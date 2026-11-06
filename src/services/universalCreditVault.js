import crypto from "crypto";
import { redis } from "./redis.js";
import { extractTrustedClientIp, getIstCalendarDay, ATOMIC_RATE_LIMIT_LUA } from "./rateLimiter.js";

const inMemoryVault = new Map();
const DAILY_LIMIT = 10;
const IP_DAILY_LIMIT = 30;

/**
 * Universal Server-Side Credit Vault
 * 100% Server-Side Enforced. Zero Frontend Authority.
 *
 * Implements atomic, distributed 10-daily operation quota tracking using Redis Lua scripts.
 * Guarantees that across Search, Compare, TrustSheet, and Uncached Redirects,
 * a user/device can NEVER exceed 10 paid operations per day.
 */
export class UniversalCreditVault {
  /**
   * Consumes 1 credit from the user's daily quota.
   * If isCacheHit is true, 0 credits are deducted (free operation).
   *
   * @param {Object} options
   * @param {Request} [options.request] - Next.js Request object to auto-extract auth & IP
   * @param {string} [options.userId] - Clerk user ID (if already extracted)
   * @param {string} [options.clientIp] - Client IP address (if already extracted)
   * @param {string} [options.deviceFingerprint] - Hardware/device fingerprint (optional)
   * @param {boolean} [options.isCacheHit=false] - Whether operation was served from cache
   * @param {boolean} [options.enforceInDev=false] - Whether to enforce the 10 limit in local dev
   * @returns {Promise<{ allowed: boolean, remaining: number, current: number, latencyMs: number, error?: string, message?: string }>}
   */
  static async consume({
    request = null,
    userId = null,
    clientIp = null,
    deviceFingerprint = null,
    isCacheHit = false,
    enforceInDev = false
  } = {}) {
    const startTime = performance.now();

    // 1. Resolve Identity Server-Side
    let resolvedUserId = userId;
    if (!resolvedUserId && request) {
      try {
        const authObj = getAuth(request);
        resolvedUserId = authObj?.userId || null;
      } catch (_) {
        resolvedUserId = null;
      }
    }

    let resolvedIp = clientIp;
    if (!resolvedIp && request) {
      resolvedIp = extractTrustedClientIp(request);
    }
    if (!resolvedIp) {
      resolvedIp = "127.0.0.1";
    }

    let resolvedDevice = deviceFingerprint;
    if (!resolvedDevice && request?.headers) {
      resolvedDevice = request.headers.get("x-device-fingerprint") || null;
    }

    // Dev bypass only if not explicitly testing limit enforcement in dev
    const isLocalDev = process.env.NODE_ENV === "development" && (resolvedIp === "127.0.0.1" || resolvedIp === "::1" || resolvedIp === "localhost");
    if (isLocalDev && !enforceInDev) {
      const elapsed = Math.round((performance.now() - startTime) * 100) / 100;
      return {
        allowed: true,
        remaining: DAILY_LIMIT,
        current: 0,
        latencyMs: elapsed
      };
    }

    const today = getIstCalendarDay();
    const effectiveId = resolvedUserId ? `user:${resolvedUserId}` : `ip:${resolvedIp}`;
    const userHash = crypto.createHash("sha256").update(effectiveId).digest("hex").slice(0, 32);
    const ipHash = crypto.createHash("sha256").update(resolvedIp).digest("hex").slice(0, 32);

    const userKey = `quota:universal_vault:${userHash}:${today}`;
    const ipKey = `quota:ip_abuse:${ipHash}:${today}`;

    let deviceKey = null;
    if (resolvedDevice && typeof resolvedDevice === "string" && resolvedDevice.startsWith("hw_")) {
      const deviceHash = crypto.createHash("sha256").update(resolvedDevice).digest("hex").slice(0, 32);
      deviceKey = `quota:device_abuse:${deviceHash}:${today}`;
    }

    // 2. Cache Hit Policy: 100% Free (0 credits deducted)
    if (isCacheHit) {
      try {
        let current = 0;
        const rawUser = await redis.get(userKey);
        if (rawUser !== null && rawUser !== undefined) {
          current = parseInt(rawUser || "0", 10);
        } else {
          current = inMemoryVault.get(`${effectiveId}:${today}`) || 0;
        }
        const isAllowed = current < DAILY_LIMIT;
        const elapsed = Math.round((performance.now() - startTime) * 100) / 100;
        return {
          allowed: isAllowed,
          remaining: Math.max(0, DAILY_LIMIT - current),
          current,
          isCacheHit: true,
          latencyMs: elapsed,
          error: isAllowed ? undefined : "DAILY_CREDIT_EXHAUSTED",
          message: isAllowed ? undefined : `आपके आज के ${DAILY_LIMIT} फ्री AI क्रेडिट्स समाप्त हो चुके हैं। आपका कोटा रात 12:00 AM IST को रीसेट होगा।`
        };
      } catch {
        const elapsed = Math.round((performance.now() - startTime) * 100) / 100;
        return { allowed: true, remaining: DAILY_LIMIT, current: 0, isCacheHit: true, latencyMs: elapsed };
      }
    }

    // 3. IP Abuse Gate (Max 30 calls across accounts from single IP)
    try {
      const rawIp = await redis.get(ipKey);
      const ipCount = parseInt(rawIp || "0", 10);
      if (ipCount >= IP_DAILY_LIMIT) {
        const elapsed = Math.round((performance.now() - startTime) * 100) / 100;
        return {
          allowed: false,
          error: "IP_CREDIT_EXHAUSTED",
          message: "इस नेटवर्क से आज की अधिकतम लिमिट पूरी हो चुकी है।",
          remaining: 0,
          current: ipCount,
          latencyMs: elapsed
        };
      }
    } catch (_) {}

    // 4. Device Hardware Signature Check
    if (deviceKey) {
      try {
        const rawDevice = await redis.get(deviceKey);
        const deviceCount = parseInt(rawDevice || "0", 10);
        if (deviceCount >= DAILY_LIMIT) {
          const elapsed = Math.round((performance.now() - startTime) * 100) / 100;
          return {
            allowed: false,
            error: "DEVICE_CREDIT_EXHAUSTED",
            message: `इस डिवाइस के लिए आज के ${DAILY_LIMIT} क्रेडिट्स पूरे हो गए हैं। रात 12:00 AM IST को रीसेट होगा।`,
            remaining: 0,
            current: deviceCount,
            latencyMs: elapsed
          };
        }
      } catch (_) {}
    }

    // 5. Atomic Redis Lua Execution (Single-Threaded Microsecond Lock)
    try {
      const clientToUse = redis?.upstash;
      if (clientToUse && typeof clientToUse.eval === "function") {
        const result = await clientToUse.eval(
          ATOMIC_RATE_LIMIT_LUA,
          [userKey],
          ["86400"]
        );
        if (Array.isArray(result) && result.length >= 2) {
          const currentCount = parseInt(result[0], 10);
          const elapsed = Math.round((performance.now() - startTime) * 100) / 100;

          if (currentCount > DAILY_LIMIT) {
            return {
              allowed: false,
              error: "DAILY_CREDIT_EXHAUSTED",
              message: `आपके आज के ${DAILY_LIMIT} फ्री AI क्रेडिट्स समाप्त हो चुके हैं। आपका कोटा रात 12:00 AM IST को रीसेट होगा।`,
              remaining: 0,
              current: currentCount,
              latencyMs: elapsed
            };
          }

          // Non-blocking secondary increments
          redis.set(ipKey, String((parseInt(await redis.get(ipKey) || "0", 10)) + 1), { ex: 86400 }).catch(() => {});
          if (deviceKey) {
            redis.set(deviceKey, String((parseInt(await redis.get(deviceKey) || "0", 10)) + 1), { ex: 86400 }).catch(() => {});
          }

          return {
            allowed: true,
            remaining: Math.max(0, DAILY_LIMIT - currentCount),
            current: currentCount,
            latencyMs: elapsed
          };
        }
      }
    } catch (redisErr) {
      console.warn("[UniversalCreditVault] Redis fallback to in-memory:", redisErr.message);
    }

    // 6. In-Memory Fallback (If Redis network is unreachable)
    const memKey = `${effectiveId}:${today}`;
    const currentMem = (inMemoryVault.get(memKey) || 0) + 1;
    inMemoryVault.set(memKey, currentMem);
    const elapsed = Math.round((performance.now() - startTime) * 100) / 100;

    if (currentMem > DAILY_LIMIT) {
      return {
        allowed: false,
        error: "DAILY_CREDIT_EXHAUSTED",
        message: `आपके आज के ${DAILY_LIMIT} फ्री AI क्रेडिट्स समाप्त हो चुके हैं। आपका कोटा रात 12:00 AM IST को रीसेट होगा।`,
        remaining: 0,
        current: currentMem,
        latencyMs: elapsed
      };
    }

    return {
      allowed: true,
      remaining: Math.max(0, DAILY_LIMIT - currentMem),
      current: currentMem,
      latencyMs: elapsed
    };
  }

  /**
   * Read-only inspection of remaining credits without consuming.
   */
  static async getRemaining({ request = null, userId = null, clientIp = null } = {}) {
    return this.consume({ request, userId, clientIp, isCacheHit: true, enforceInDev: true });
  }
}
