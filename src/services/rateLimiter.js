/**
 * Shop Smart AI — Standalone Distributed Rate Limiting & Quota Utility
 *
 * Implements atomic, distributed rate-limiting and quota tracking using Redis Lua scripts
 * with Upstash Redis (@upstash/redis).
 *
 * Algorithm: Fixed Window Counter with auto-evaporating keys via Redis EXPIRE.
 * - Counter resets after `windowSeconds` from first access in a window.
 * - Trade-off: Fixed window counter allows boundary bursts up to 2x limit across window boundaries,
 *   which is acceptable and standard for tier cost protection without the high memory/sorting overhead of sliding logs.
 *
 * Security & Design Principles:
 * 1. Collision-Resistant Keys: Identifiers are hashed deterministically with SHA-256 (first 32 hex chars).
 *    Raw user IDs, emails, or sensitive strings never appear in Redis key names or logs.
 *    Punctuation-containing identifiers never collapse to identical keys.
 * 2. Atomic Increment & Expiry: Evaluated atomically in a single Redis Lua script (`eval`).
 *    Eliminates race conditions where a key is created without a TTL.
 * 3. Strict Bounds Validation: Ceilings enforced on limit (<= 10,000), windowSeconds (<= 604,800 / 7 days),
 *    timeoutMs (100ms - 10,000ms), and namespace/identifier lengths.
 * 4. Fail-Closed / Explicit Error Signaling: When Redis is unreachable, unconfigured, or times out,
 *    returns `{ success: false, allowed: false, error: "RATE_LIMITER_UNAVAILABLE", isBackendError: true }`.
 *    Never silently allows unmetered paid operations on backend outage.
 * 5. Clean Promise Rejection Handling: Attached catch handler avoids unhandled rejections if Redis
 *    settles with an error after the timeout race has completed.
 */

import crypto from "crypto";
import { redis } from "./redis.js";

// Validation Bounds
const MAX_NAMESPACE_LENGTH = 64;
const MAX_IDENTIFIER_LENGTH = 256;
const MAX_LIMIT = 10000;
const MIN_TIMEOUT_MS = 100;
const MAX_TIMEOUT_MS = 10000;
const MAX_WINDOW_SECONDS = 7 * 24 * 60 * 60; // 604,800 seconds (7 days)

/**
 * Atomic Lua Script for Fixed Window Counter Rate Limiting.
 *
 * Logic:
 * 1. INCR key.
 * 2. If current count == 1, key was just created: set EXPIRE to windowSeconds.
 * 3. Get current TTL:
 *    - If TTL is -1 (no expiry set, e.g. edge condition), re-set EXPIRE to windowSeconds.
 *    - If TTL <= 0, fallback to windowSeconds.
 * 4. Return [currentCount, ttlSeconds].
 *
 * KEYS[1]: Rate limit key
 * ARGV[1]: windowSeconds (number)
 */
export const ATOMIC_RATE_LIMIT_LUA = `
local current = redis.call('INCR', KEYS[1])
if tonumber(current) == 1 then
  redis.call('EXPIRE', KEYS[1], ARGV[1])
end
local ttl = redis.call('TTL', KEYS[1])
if tonumber(ttl) < 0 then
  redis.call('EXPIRE', KEYS[1], ARGV[1])
  ttl = tonumber(ARGV[1])
end
return { current, ttl }
`;

/**
 * Builds a deterministic, collision-resistant Redis key.
 *
 * Format: `ratelimit:{safeNamespace}:{sha256Hex32}`
 * - Namespace is validated against strict alphanumeric pattern [a-z0-9_-].
 * - Identifier is trimmed and hashed with SHA-256 to ensure distinct identities
 *   never collapse and raw IDs are never exposed in key listings.
 *
 * @param {string} namespace
 * @param {string} identifier
 * @returns {string}
 */
export function buildRateLimitKey(namespace, identifier) {
  const safeNamespace = namespace.trim().toLowerCase();
  const trimmedId = identifier.trim();
  const idHash = crypto.createHash("sha256").update(trimmedId).digest("hex").slice(0, 32);
  return `ratelimit:${safeNamespace}:${idHash}`;
}

/**
 * Evaluate rate limit for a given subject using Fixed Window Counter.
 *
 * @param {Object} options
 * @param {string} options.namespace - Feature identifier (e.g. "ai_chat", "compare", "deals", "vton"). Max 64 chars.
 * @param {string} options.identifier - Verified server-side user ID (e.g. Clerk userId). Max 256 chars. Client headers forbidden.
 * @param {number} options.limit - Maximum allowed requests within the window (1 to 10,000).
 * @param {number} options.windowSeconds - Window length in seconds (1 to 604,800).
 * @param {number} [options.timeoutMs=2000] - Redis operation timeout ceiling in ms (100 to 10,000).
 * @param {Object} [options._client] - Optional dependency-injected Redis client for isolated deterministic testing.
 *
 * @returns {Promise<Object>} Evaluation result:
 *   - success: boolean (true if request is allowed, false if rejected or error)
 *   - allowed: boolean (true if count <= limit)
 *   - limit: number (configured limit)
 *   - remaining: number (remaining calls in this window, min 0)
 *   - current: number (current count in this window)
 *   - resetInSeconds: number (seconds until window reset)
 *   - retryAfter: number (seconds to wait if rate-limited, 0 if allowed)
 *   - error?: string ("RATE_LIMIT_EXCEEDED" | "RATE_LIMITER_UNAVAILABLE" | "INVALID_ARGUMENTS")
 *   - isBackendError?: boolean (true if failed due to Redis outage/timeout)
 */
export async function checkRateLimit({
  namespace,
  identifier,
  limit,
  windowSeconds,
  timeoutMs = 2000,
  _client = null
}) {
  // 1. Strict Argument Validation & Bounds Clamping
  const isValidNamespace =
    typeof namespace === "string" &&
    namespace.trim().length > 0 &&
    namespace.trim().length <= MAX_NAMESPACE_LENGTH &&
    /^[a-zA-Z0-9_-]+$/.test(namespace.trim());

  const isValidIdentifier =
    typeof identifier === "string" &&
    identifier.trim().length > 0 &&
    identifier.trim().length <= MAX_IDENTIFIER_LENGTH;

  const isValidLimit =
    Number.isInteger(limit) &&
    limit > 0 &&
    limit <= MAX_LIMIT;

  const isValidWindow =
    Number.isInteger(windowSeconds) &&
    windowSeconds > 0 &&
    windowSeconds <= MAX_WINDOW_SECONDS;

  const isValidTimeout =
    Number.isInteger(timeoutMs) &&
    timeoutMs >= MIN_TIMEOUT_MS &&
    timeoutMs <= MAX_TIMEOUT_MS;

  if (!isValidNamespace || !isValidIdentifier || !isValidLimit || !isValidWindow || !isValidTimeout) {
    const fallbackWindow = Number.isInteger(windowSeconds) && windowSeconds > 0 ? windowSeconds : 60;
    return {
      success: false,
      allowed: false,
      limit: Number.isInteger(limit) && limit > 0 ? limit : 0,
      remaining: 0,
      current: 0,
      resetInSeconds: fallbackWindow,
      retryAfter: fallbackWindow,
      error: "INVALID_ARGUMENTS",
      isBackendError: false
    };
  }

  // 2. Deterministic Key Construction
  const rateLimitKey = buildRateLimitKey(namespace, identifier);

  // 3. Validate Redis Backend Availability
  const clientToUse = _client || redis?.upstash;
  if (!clientToUse || typeof clientToUse.eval !== "function") {
    // Fail closed: No silent bypass of paid provider limits
    return {
      success: false,
      allowed: false,
      limit,
      remaining: 0,
      current: 0,
      resetInSeconds: windowSeconds,
      retryAfter: windowSeconds,
      error: "RATE_LIMITER_UNAVAILABLE",
      isBackendError: true
    };
  }

  // 4. Execute Atomic Lua Script with Timeout Protection & Unhandled Rejection Suppression
  let timerId = null;
  try {
    const evalPromise = clientToUse.eval(
      ATOMIC_RATE_LIMIT_LUA,
      [rateLimitKey],
      [String(windowSeconds)]
    );

    // Attach silent error handler to prevent unhandled promise rejections if Redis rejects after timeout
    evalPromise.catch(() => {});

    const timeoutPromise = new Promise((_, reject) => {
      timerId = setTimeout(() => reject(new Error("RateLimiter Redis timeout")), timeoutMs);
    });

    const result = await Promise.race([evalPromise, timeoutPromise]);
    if (timerId) clearTimeout(timerId);

    if (!Array.isArray(result) || result.length < 2) {
      throw new Error("Invalid Lua response format from Redis");
    }

    const currentCount = parseInt(result[0], 10);
    const ttlSeconds = parseInt(result[1], 10);

    if (isNaN(currentCount) || isNaN(ttlSeconds)) {
      throw new Error("Invalid integer values in Lua response");
    }

    const effectiveTtl = Math.max(1, ttlSeconds);
    const isAllowed = currentCount <= limit;
    const remainingCount = Math.max(0, limit - currentCount);

    return {
      success: isAllowed,
      allowed: isAllowed,
      limit,
      remaining: remainingCount,
      current: currentCount,
      resetInSeconds: effectiveTtl,
      retryAfter: isAllowed ? 0 : effectiveTtl,
      ...(isAllowed ? {} : { error: "RATE_LIMIT_EXCEEDED" }),
      isBackendError: false
    };
  } catch (err) {
    if (timerId) clearTimeout(timerId);
    // Fail closed on Redis network failure, timeout, or parsing error
    console.warn(`[RateLimiter] Backend evaluation failed for namespace "${namespace}":`, err.message);
    return {
      success: false,
      allowed: false,
      limit,
      remaining: 0,
      current: 0,
      resetInSeconds: windowSeconds,
      retryAfter: windowSeconds,
      error: "RATE_LIMITER_UNAVAILABLE",
      isBackendError: true
    };
  }
}

/**
 * Indian Standard Time (Asia/Kolkata) Calendar Day String
 * Format: YYYY-MM-DD
 */
export function getIstCalendarDay(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(date);
}

/**
 * Cluster Hash-Tagged Key Generator for VTON Free Quota
 */
export function getVtonQuotaKeys(identifier) {
  const rawId = String(identifier || "").trim();
  const hash = crypto.createHash("sha256").update(rawId).digest("hex").slice(0, 32);
  return {
    usageKey: `rl:{${hash}}:vton_free_usage`,
    leasesKey: `rl:{${hash}}:vton_free_leases`,
    tombstonesKey: `rl:{${hash}}:vton_free_tombstones`
  };
}

/**
 * Atomic Lua Script for VTON Free Slot Reservation
 * KEYS[1]: rl:{hash}:vton_free_usage
 * KEYS[2]: rl:{hash}:vton_free_leases
 * KEYS[3]: rl:{hash}:vton_free_tombstones
 * ARGV[1]: limit (number string, e.g. "2")
 * ARGV[2]: attemptId (string)
 * ARGV[3]: windowId (string, e.g. "2026-10-11")
 * ARGV[4]: leaseDurationMs (number string, e.g. "60000")
 * ARGV[5]: hardDeadlineOffsetMs (number string, e.g. "240000")
 */
export const VTON_RESERVE_FREE_SLOT_LUA = `
local rtime = redis.call('TIME')
local nowMs = (tonumber(rtime[1]) * 1000) + math.floor(tonumber(rtime[2]) / 1000)

local tombstone = redis.call('HGET', KEYS[3], ARGV[2])
if tombstone then
  return {0, 0, 0, "ATTEMPT_ALREADY_TERMINAL"}
end

local existingLease = redis.call('HGET', KEYS[2], ARGV[2])
if existingLease and type(existingLease) == "string" then
  local p1 = string.find(existingLease, ":")
  if p1 then
    local w = string.sub(existingLease, 1, p1 - 1)
    local rest = string.sub(existingLease, p1 + 1)
    local p2 = string.find(rest, ":")
    if p2 then
      local expMs = tonumber(string.sub(rest, 1, p2 - 1))
      local dlMs = tonumber(string.sub(rest, p2 + 1))
      if w == ARGV[3] and expMs and dlMs and nowMs < expMs and nowMs <= dlMs then
        local confirmed = tonumber(redis.call('HGET', KEYS[1], ARGV[3]) or '0')
        return {1, confirmed, 1, "ALREADY_RESERVED"}
      else
        redis.call('HDEL', KEYS[2], ARGV[2])
        redis.call('HSET', KEYS[3], ARGV[2], "EXPIRED:" .. w .. ":" .. tostring(nowMs))
        redis.call('EXPIRE', KEYS[3], 600)
        return {0, 0, 0, "ATTEMPT_EXPIRED_TERMINAL"}
      end
    end
  end
  redis.call('HDEL', KEYS[2], ARGV[2])
end

local leases = redis.call('HGETALL', KEYS[2])
local activeCount = 0
for i = 1, #leases, 2 do
  local k = leases[i]
  local val = leases[i+1]
  local isAlive = false
  if type(val) == "string" then
    local p1 = string.find(val, ":")
    if p1 then
      local w = string.sub(val, 1, p1 - 1)
      local rest = string.sub(val, p1 + 1)
      local p2 = string.find(rest, ":")
      if p2 then
        local expMs = tonumber(string.sub(rest, 1, p2 - 1))
        local dlMs = tonumber(string.sub(rest, p2 + 1))
        if expMs and dlMs and nowMs < expMs and nowMs <= dlMs then
          isAlive = true
          if w == ARGV[3] then
            activeCount = activeCount + 1
          end
        end
      end
    end
  end
  if not isAlive then
    redis.call('HDEL', KEYS[2], k)
  end
end

local limit = tonumber(ARGV[1])
local confirmed = tonumber(redis.call('HGET', KEYS[1], ARGV[3]) or '0')
if (confirmed + activeCount) >= limit then
  return {0, confirmed, activeCount, "FREE_TIER_LIMIT_EXCEEDED"}
end

local leaseExp = nowMs + tonumber(ARGV[4])
local hardDl = nowMs + tonumber(ARGV[5])
local leaseVal = ARGV[3] .. ":" .. tostring(leaseExp) .. ":" .. tostring(hardDl)
redis.call('HSET', KEYS[2], ARGV[2], leaseVal)
redis.call('EXPIRE', KEYS[2], 600)
redis.call('EXPIRE', KEYS[1], 172800)

return {1, confirmed, activeCount + 1, "RESERVED"}
`;

/**
 * Atomic Lua Script for VTON Free Slot Commit
 * KEYS[1]: rl:{hash}:vton_free_usage
 * KEYS[2]: rl:{hash}:vton_free_leases
 * KEYS[3]: rl:{hash}:vton_free_tombstones
 * ARGV[1]: limit (number string, e.g. "2")
 * ARGV[2]: attemptId (string)
 */
export const VTON_COMMIT_FREE_SLOT_LUA = `
local tombstone = redis.call('HGET', KEYS[3], ARGV[2])
if tombstone and type(tombstone) == "string" then
  local p1 = string.find(tombstone, ":")
  if p1 then
    local status = string.sub(tombstone, 1, p1 - 1)
    if status == "COMMITTED" then
      local rest = string.sub(tombstone, p1 + 1)
      local p2 = string.find(rest, ":")
      local w = p2 and string.sub(rest, 1, p2 - 1) or rest
      local confirmed = tonumber(redis.call('HGET', KEYS[1], w) or '0')
      return {1, confirmed, "ALREADY_COMMITTED"}
    end
  end
  return {0, 0, "ATTEMPT_ALREADY_TERMINATED"}
end

local leaseVal = redis.call('HGET', KEYS[2], ARGV[2])
if not leaseVal or type(leaseVal) ~= "string" then
  return {0, 0, "LEASE_NOT_FOUND_OR_EXPIRED"}
end

local rtime = redis.call('TIME')
local nowMs = (tonumber(rtime[1]) * 1000) + math.floor(tonumber(rtime[2]) / 1000)

local p1 = string.find(leaseVal, ":")
if not p1 then
  redis.call('HDEL', KEYS[2], ARGV[2])
  return {0, 0, "MALFORMED_LEASE"}
end

local targetWindow = string.sub(leaseVal, 1, p1 - 1)
local rest = string.sub(leaseVal, p1 + 1)
local p2 = string.find(rest, ":")
if not p2 then
  redis.call('HDEL', KEYS[2], ARGV[2])
  return {0, 0, "MALFORMED_LEASE"}
end

local expMs = tonumber(string.sub(rest, 1, p2 - 1))
local dlMs = tonumber(string.sub(rest, p2 + 1))
if not expMs or not dlMs or nowMs >= expMs or nowMs > dlMs then
  redis.call('HDEL', KEYS[2], ARGV[2])
  redis.call('HSET', KEYS[3], ARGV[2], "EXPIRED:" .. targetWindow .. ":" .. tostring(nowMs))
  redis.call('EXPIRE', KEYS[3], 600)
  return {0, 0, "LEASE_EXPIRED_OR_STALE"}
end

local limit = tonumber(ARGV[1])
local confirmed = tonumber(redis.call('HGET', KEYS[1], targetWindow) or '0')
if confirmed >= limit then
  redis.call('HDEL', KEYS[2], ARGV[2])
  redis.call('HSET', KEYS[3], ARGV[2], "EXPIRED:" .. targetWindow .. ":" .. tostring(nowMs))
  redis.call('EXPIRE', KEYS[3], 600)
  return {0, confirmed, "HARD_CAP_EXCEEDED"}
end

redis.call('HDEL', KEYS[2], ARGV[2])
redis.call('HSET', KEYS[3], ARGV[2], "COMMITTED:" .. targetWindow .. ":" .. tostring(nowMs))
redis.call('EXPIRE', KEYS[3], 600)
local newConfirmed = redis.call('HINCRBY', KEYS[1], targetWindow, 1)
redis.call('EXPIRE', KEYS[1], 172800)

return {1, newConfirmed, "SUCCESS"}
`;

/**
 * Atomic Lua Script for VTON Free Slot Release (Idempotent)
 * KEYS[1]: rl:{hash}:vton_free_usage
 * KEYS[2]: rl:{hash}:vton_free_leases
 * KEYS[3]: rl:{hash}:vton_free_tombstones
 * ARGV[1]: attemptId (string)
 */
export const VTON_RELEASE_FREE_SLOT_LUA = `
local rtime = redis.call('TIME')
local nowMs = (tonumber(rtime[1]) * 1000) + math.floor(tonumber(rtime[2]) / 1000)

local tombstone = redis.call('HGET', KEYS[3], ARGV[1])
if tombstone and type(tombstone) == "string" then
  local p1 = string.find(tombstone, ":")
  if p1 then
    local status = string.sub(tombstone, 1, p1 - 1)
    if status == "COMMITTED" then
      redis.call('HDEL', KEYS[2], ARGV[1])
      return 1
    end
  end
end

local leaseVal = redis.call('HGET', KEYS[2], ARGV[1])
local targetWindow = "unknown"
if leaseVal and type(leaseVal) == "string" then
  local p1 = string.find(leaseVal, ":")
  if p1 then
    targetWindow = string.sub(leaseVal, 1, p1 - 1)
  end
end

redis.call('HDEL', KEYS[2], ARGV[1])
redis.call('HSET', KEYS[3], ARGV[1], "RELEASED:" .. targetWindow .. ":" .. tostring(nowMs))
redis.call('EXPIRE', KEYS[3], 600)

return 1
`;

/**
 * Reserve a free try-on slot atomically before starting VTON rendering.
 */
export async function reserveVtonFreeQuota({
  identifier,
  attemptId,
  limit = 3,
  leaseDurationMs = 240000,
  hardDeadlineOffsetMs = 240000,
  timeoutMs = 2500,
  _client = null,
  windowId = null
}) {
  const normId = String(identifier || "").trim();
  const safeAttemptId = String(attemptId || "").trim();

  if (!normId || !safeAttemptId || !/^[a-zA-Z0-9_\-]{8,128}$/.test(safeAttemptId)) {
    return {
      allowed: false,
      error: "INVALID_ARGUMENTS",
      isBackendError: false,
      status: "INVALID_ARGUMENTS"
    };
  }

  const clientToUse = _client || redis?.upstash;
  if (!clientToUse || typeof clientToUse.eval !== "function") {
    return {
      allowed: false,
      error: "RATE_LIMITER_UNAVAILABLE",
      isBackendError: true,
      status: "BACKEND_UNAVAILABLE"
    };
  }

  const targetWindow = windowId || getIstCalendarDay();
  const { usageKey, leasesKey, tombstonesKey } = getVtonQuotaKeys(normId);

  let timerId = null;
  try {
    const evalPromise = clientToUse.eval(
      VTON_RESERVE_FREE_SLOT_LUA,
      [usageKey, leasesKey, tombstonesKey],
      [String(limit), safeAttemptId, targetWindow, String(leaseDurationMs), String(hardDeadlineOffsetMs)]
    );
    evalPromise.catch(() => {});

    const timeoutPromise = new Promise((_, reject) => {
      timerId = setTimeout(() => reject(new Error("VTON Reserve Redis timeout")), timeoutMs);
    });

    const result = await Promise.race([evalPromise, timeoutPromise]);
    if (timerId) clearTimeout(timerId);

    if (!Array.isArray(result) || result.length < 4) {
      throw new Error("Invalid Lua response from VTON reserve");
    }

    const isAllowed = result[0] === 1;
    const confirmedCount = parseInt(result[1], 10) || 0;
    const activeCount = parseInt(result[2], 10) || 0;
    const status = String(result[3] || "");

    return {
      allowed: isAllowed,
      confirmedCount,
      activeCount,
      status,
      windowId: targetWindow,
      isBackendError: false
    };
  } catch (err) {
    if (timerId) clearTimeout(timerId);
    console.warn(`[VTON Quota] Reserve failed for user:`, err.message);
    return {
      allowed: false,
      error: "RATE_LIMITER_UNAVAILABLE",
      isBackendError: true,
      status: "BACKEND_ERROR"
    };
  }
}

/**
 * Commit a successful free try-on slot atomically after PixelAPI completes.
 */
export async function commitVtonFreeQuota({
  identifier,
  attemptId,
  limit = 3,
  timeoutMs = 2500,
  _client = null
}) {
  const normId = String(identifier || "").trim();
  const safeAttemptId = String(attemptId || "").trim();

  if (!normId || !safeAttemptId || !/^[a-zA-Z0-9_\-]{8,128}$/.test(safeAttemptId)) {
    return { success: false, error: "INVALID_ARGUMENTS", isBackendError: false };
  }

  const clientToUse = _client || redis?.upstash;
  if (!clientToUse || typeof clientToUse.eval !== "function") {
    return { success: false, error: "RATE_LIMITER_UNAVAILABLE", isBackendError: true };
  }

  const { usageKey, leasesKey, tombstonesKey } = getVtonQuotaKeys(normId);

  let timerId = null;
  try {
    const evalPromise = clientToUse.eval(
      VTON_COMMIT_FREE_SLOT_LUA,
      [usageKey, leasesKey, tombstonesKey],
      [String(limit), safeAttemptId]
    );
    evalPromise.catch(() => {});

    const timeoutPromise = new Promise((_, reject) => {
      timerId = setTimeout(() => reject(new Error("VTON Commit Redis timeout")), timeoutMs);
    });

    const result = await Promise.race([evalPromise, timeoutPromise]);
    if (timerId) clearTimeout(timerId);

    if (!Array.isArray(result) || result.length < 3) {
      throw new Error("Invalid Lua response from VTON commit");
    }

    const isSuccess = result[0] === 1;
    const confirmedCount = parseInt(result[1], 10) || 0;
    const status = String(result[2] || "");

    return {
      success: isSuccess,
      confirmedCount,
      status,
      isBackendError: false
    };
  } catch (err) {
    if (timerId) clearTimeout(timerId);
    console.warn(`[VTON Quota] Commit failed for user:`, err.message);
    return {
      success: false,
      error: "RATE_LIMITER_UNAVAILABLE",
      isBackendError: true
    };
  }
}

/**
 * Release an active reservation when a try-on fails or is cancelled.
 */
export async function releaseVtonFreeQuota({
  identifier,
  attemptId,
  timeoutMs = 2500,
  _client = null
}) {
  const normId = String(identifier || "").trim();
  const safeAttemptId = String(attemptId || "").trim();

  if (!normId || !safeAttemptId) return { success: false };

  const clientToUse = _client || redis?.upstash;
  if (!clientToUse || typeof clientToUse.eval !== "function") return { success: false };

  const { usageKey, leasesKey, tombstonesKey } = getVtonQuotaKeys(normId);

  try {
    await clientToUse.eval(
      VTON_RELEASE_FREE_SLOT_LUA,
      [usageKey, leasesKey, tombstonesKey],
      [safeAttemptId]
    ).catch(() => {});
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}

/**
 * -----------------------------------------------------------------------------
 * SHARED IP ROLLING 24-HOUR QUOTA (SLIDING WINDOW LOG VIA REDIS ZSET)
 * -----------------------------------------------------------------------------
 * Policy: 10 free cost-incurring operations per rolling 24-hour window per IP.
 * - Enforces sliding window log with ZREMRANGEBYSCORE.
 * - Computes precise rolling retryAfter based on oldest timestamp in window.
 * - Fail-closed: returns isBackendError: true if Redis is unavailable or fails.
 */

export const ATOMIC_SLIDING_WINDOW_IP_LUA = `
local key = KEYS[1]
local windowMs = tonumber(ARGV[1])
local limit = tonumber(ARGV[2])
local memberSuffix = ARGV[3]

-- 0. Fetch high-precision server time from Redis (immune to client node clock skew)
local redisTime = redis.call('TIME')
local nowMs = (tonumber(redisTime[1]) * 1000) + math.floor(tonumber(redisTime[2]) / 1000)
local member = tostring(nowMs) .. ':' .. tostring(memberSuffix)

local windowStart = nowMs - windowMs
redis.call('ZREMRANGEBYSCORE', key, '-inf', '(' .. tostring(windowStart))

local currentCount = redis.call('ZCARD', key)
if currentCount < limit then
  redis.call('ZADD', key, nowMs, member)
  redis.call('PEXPIRE', key, windowMs)
  local remaining = limit - (currentCount + 1)
  return { 1, remaining, 0, currentCount + 1 }
else
  local oldest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
  local retryAfterSec = 60
  if oldest and #oldest >= 2 then
    local oldestTime = tonumber(oldest[2])
    local resetTime = oldestTime + windowMs
    local diffMs = resetTime - nowMs
    if diffMs > 0 then
      retryAfterSec = math.ceil(diffMs / 1000)
    else
      retryAfterSec = 1
    end
  end
  return { 0, 0, retryAfterSec, currentCount }
end
`;

/**
 * Extracts a normalized, sanitized client IP address from standard reverse-proxy headers.
 * Priority: cf-connecting-ip -> x-real-ip -> first address in x-forwarded-for.
 * Falls back to "127.0.0.1" for local non-proxied environments.
 *
 * @param {Request} request
 * @returns {string}
 */
export function extractTrustedClientIp(request) {
  if (!request || !request.headers) return "127.0.0.1";

  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp && typeof cfIp === "string" && cfIp.trim()) {
    return cfIp.trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp && typeof realIp === "string" && realIp.trim()) {
    return realIp.trim();
  }

  const xff = request.headers.get("x-forwarded-for");
  if (xff && typeof xff === "string" && xff.trim()) {
    const firstIp = xff.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  return "127.0.0.1";
}

/**
 * Evaluates the shared rolling 24-hour IP quota across all free cost-incurring endpoints.
 *
 * @param {Object} options
 * @param {Request} options.request - Standard Next.js Request or Web Request object.
 * @param {number} [options.limit=10] - Quota allowance per rolling window (default 10).
 * @param {number} [options.windowSeconds=86400] - Rolling window length in seconds (default 86,400 = 24h).
 * @param {number} [options.timeoutMs=2000] - Redis timeout ceiling in ms.
 * @param {Object} [options._client=null] - Optional injected Redis client for unit testing.
 *
 * @returns {Promise<Object>}
 */
export async function checkSharedIpQuota({
  request,
  limit = 10,
  windowSeconds = 86400,
  timeoutMs = 2000,
  _client = null
}) {
  const clientIp = extractTrustedClientIp(request);

  // In local development or testing environments, exempt loopback/localhost IPs
  // so development and testing actions do not exhaust the shared quota.
  const isLoopback = clientIp === "127.0.0.1" || clientIp === "::1" || clientIp === "localhost";
  if (process.env.NODE_ENV !== "production" && isLoopback) {
    return {
      success: true,
      allowed: true,
      limit,
      remaining: limit,
      current: 0,
      retryAfter: 0,
      error: null,
      isBackendError: false
    };
  }

  const ipHash = crypto.createHash("sha256").update(clientIp).digest("hex").slice(0, 32);
  const key = `rl:shared_ip:${ipHash}`;

  const clientToUse = _client || redis?.upstash;
  if (!clientToUse || typeof clientToUse.eval !== "function") {
    return {
      success: false,
      allowed: false,
      limit,
      remaining: 0,
      current: 0,
      retryAfter: windowSeconds,
      error: "RATE_LIMITER_UNAVAILABLE",
      isBackendError: true
    };
  }

  const windowMs = windowSeconds * 1000;
  const uniqueMemberSuffix = crypto.randomBytes(8).toString("hex");

  let timerId = null;
  try {
    const evalPromise = clientToUse.eval(
      ATOMIC_SLIDING_WINDOW_IP_LUA,
      [key],
      [String(windowMs), String(limit), uniqueMemberSuffix]
    );
    evalPromise.catch(() => {});

    const timeoutPromise = new Promise((_, reject) => {
      timerId = setTimeout(() => reject(new Error("Shared IP Limiter timeout")), timeoutMs);
    });

    const result = await Promise.race([evalPromise, timeoutPromise]);
    if (timerId) clearTimeout(timerId);

    if (!Array.isArray(result) || result.length < 4) {
      throw new Error("Invalid Lua response format from Shared IP Limiter");
    }

    const allowed = result[0] === 1;
    const remaining = Math.max(0, parseInt(result[1], 10) || 0);
    const retryAfter = Math.max(0, parseInt(result[2], 10) || 0);
    const current = Math.max(0, parseInt(result[3], 10) || 0);

    return {
      success: allowed,
      allowed,
      limit,
      remaining,
      current,
      retryAfter: allowed ? 0 : (retryAfter || windowSeconds),
      error: allowed ? null : "IP_QUOTA_EXHAUSTED",
      isBackendError: false
    };
  } catch (err) {
    if (timerId) clearTimeout(timerId);
    console.warn(`[Shared IP Limiter] Backend failure:`, err.message);
    return {
      success: false,
      allowed: false,
      limit,
      remaining: 0,
      current: 0,
      retryAfter: windowSeconds,
      error: "RATE_LIMITER_UNAVAILABLE",
      isBackendError: true
    };
  }
}

/**
 * -----------------------------------------------------------------------------
 * DISTRIBUTED VTON CONCURRENCY MANAGEMENT (CLUSTER-WIDE ATOMIC MUTEX)
 * -----------------------------------------------------------------------------
 * Rules:
 * - Max 5 active VTON jobs cluster-wide (global pool limit).
 * - Max 1 active VTON job per user simultaneously (anti-stampede per user).
 * - Automatic 240s lease TTL so aborted/crashed workers cannot deadlock slots.
 * - Idempotent release script ensures safe cleanup in `finally` blocks.
 */

export const VTON_ACQUIRE_CONCURRENCY_LUA = `
local userKey = KEYS[1]
local globalKey = KEYS[2]
local maxGlobal = tonumber(ARGV[1])
local leaseTtl = tonumber(ARGV[2])
local attemptId = ARGV[3]

-- 0. Get current server time from Redis (immune to node clock drift)
local redisTime = redis.call('TIME')
local nowSec = tonumber(redisTime[1])

-- 1. Check if user already has an active slot
local userActive = redis.call('GET', userKey)
if userActive then
  return { 0, 'USER_CONCURRENCY_LIMIT' }
end

-- 2. Prune expired entries from cluster-wide global hash to prevent slot leaks
local allEntries = redis.call('HGETALL', globalKey)
local activeGlobalCount = 0
for i = 1, #allEntries, 2 do
  local att = allEntries[i]
  local ts = tonumber(allEntries[i + 1])
  if ts and (nowSec - ts) > leaseTtl then
    redis.call('HDEL', globalKey, att)
  else
    activeGlobalCount = activeGlobalCount + 1
  end
end

if activeGlobalCount >= maxGlobal then
  return { 0, 'QUEUE_EXHAUSTED' }
end

-- 3. Atomically acquire both
redis.call('SET', userKey, attemptId, 'EX', leaseTtl)
redis.call('HSET', globalKey, attemptId, tostring(nowSec))
redis.call('EXPIRE', globalKey, leaseTtl + 60)

return { 1, 'ACQUIRED' }
`;

export const VTON_RELEASE_CONCURRENCY_LUA = `
local userKey = KEYS[1]
local globalKey = KEYS[2]
local attemptId = ARGV[1]

-- 1. Verify user key matches this attempt before deleting (prevents clearing successor's lock)
local currentUserAttempt = redis.call('GET', userKey)
if currentUserAttempt == attemptId then
  redis.call('DEL', userKey)
end

-- 2. Remove attempt from global hash
redis.call('HDEL', globalKey, attemptId)

return 1
`;

/**
 * Acquires an atomic distributed VTON concurrency slot across all cluster instances.
 *
 * @param {Object} options
 * @param {string} options.userId - Clerk verified user ID.
 * @param {string} options.attemptId - Unique UUID of the try-on render attempt.
 * @param {number} [options.maxGlobal=5] - Global cluster-wide concurrency cap (default 5).
 * @param {number} [options.leaseTtlSeconds=240] - Auto-evaporation lease TTL (default 240s).
 * @param {number} [options.timeoutMs=2500] - Redis timeout ceiling in ms.
 * @param {Object} [options._client=null] - Injected Redis client for unit testing.
 *
 * @returns {Promise<Object>}
 */
export async function acquireDistributedVtonSlot({
  userId,
  attemptId,
  maxGlobal = 5,
  leaseTtlSeconds = 240,
  timeoutMs = 2500,
  _client = null
}) {
  const normUser = String(userId || "").trim();
  const safeAttemptId = String(attemptId || "").trim();

  if (!normUser || !safeAttemptId) {
    return { success: false, error: "INVALID_ARGUMENTS", isBackendError: false };
  }

  const userHash = crypto.createHash("sha256").update(normUser).digest("hex").slice(0, 32);
  const userKey = `vton:active_user:${userHash}`;
  const globalKey = `vton:global_active_jobs`;

  const clientToUse = _client || redis?.upstash;
  if (!clientToUse || typeof clientToUse.eval !== "function") {
    return { success: false, error: "RATE_LIMITER_UNAVAILABLE", isBackendError: true };
  }

  let timerId = null;
  try {
    const evalPromise = clientToUse.eval(
      VTON_ACQUIRE_CONCURRENCY_LUA,
      [userKey, globalKey],
      [String(maxGlobal), String(leaseTtlSeconds), safeAttemptId]
    );
    evalPromise.catch(() => {});

    const timeoutPromise = new Promise((_, reject) => {
      timerId = setTimeout(() => reject(new Error("Distributed VTON Acquire timeout")), timeoutMs);
    });

    const result = await Promise.race([evalPromise, timeoutPromise]);
    if (timerId) clearTimeout(timerId);

    if (!Array.isArray(result) || result.length < 2) {
      throw new Error("Invalid Lua response from VTON concurrency acquire");
    }

    const acquired = result[0] === 1;
    const reason = String(result[1] || "");

    return {
      success: acquired,
      reason,
      isBackendError: false
    };
  } catch (err) {
    if (timerId) clearTimeout(timerId);
    console.warn(`[VTON Concurrency] Acquire failure:`, err.message);
    return {
      success: false,
      error: "RATE_LIMITER_UNAVAILABLE",
      isBackendError: true
    };
  }
}

/**
 * Releases an atomic distributed VTON concurrency slot idempotently.
 *
 * @param {Object} options
 * @param {string} options.userId - Clerk verified user ID.
 * @param {string} options.attemptId - Unique UUID of the try-on render attempt.
 * @param {Object} [options._client=null] - Injected Redis client for unit testing.
 *
 * @returns {Promise<boolean>}
 */
export async function releaseDistributedVtonSlot({
  userId,
  attemptId,
  _client = null
}) {
  const normUser = String(userId || "").trim();
  const safeAttemptId = String(attemptId || "").trim();

  if (!normUser || !safeAttemptId) return false;

  const userHash = crypto.createHash("sha256").update(normUser).digest("hex").slice(0, 32);
  const userKey = `vton:active_user:${userHash}`;
  const globalKey = `vton:global_active_jobs`;

  const clientToUse = _client || redis?.upstash;
  if (!clientToUse || typeof clientToUse.eval !== "function") return false;

  try {
    await clientToUse.eval(
      VTON_RELEASE_CONCURRENCY_LUA,
      [userKey, globalKey],
      [safeAttemptId]
    ).catch(() => {});
    return true;
  } catch (err) {
    return false;
  }
}

// In-memory fallback map for offline/dev/resilience
const inMemoryUnifiedQuota = new Map();

/**
 * Unified 10-Call Daily API Quota Meter.
 * Every real external API call (Search, Compare) consumes 1 credit from a shared 10-call daily pool.
 * Cache hits (Redis warm queries) do NOT consume quota (cost: ₹0).
 *
 * @param {Object} options
 * @param {string} [options.userId] - Clerk user ID (if logged in).
 * @param {string} [options.clientIp="127.0.0.1"] - Client IP address (for guest or IP-level abuse prevention).
 * @param {boolean} [options.isCacheHit=false] - If true, does not increment quota (costs ₹0).
 * @param {number} [options.limit=10] - Daily user quota limit.
 * @param {number} [options.ipDailyLimit=30] - Max total calls allowed per IP across all sessions/accounts per day.
 * @returns {Promise<Object>} { allowed: boolean, remaining: number, current: number, error?: string, message?: string }
 */
export async function checkUnifiedApiQuota({
  userId = null,
  clientIp = "127.0.0.1",
  deviceFingerprint = null,
  isCacheHit = false,
  limit = 10,
  ipDailyLimit = 30
}) {
  // Allow seamless testing in local development environment
  if (process.env.NODE_ENV === "development" && (clientIp === "127.0.0.1" || clientIp === "::1" || clientIp === "localhost")) {
    return {
      allowed: true,
      remaining: 999,
      current: 0,
      totalLimit: 1000
    };
  }

  const today = getIstCalendarDay();
  const effectiveId = userId ? `user:${userId}` : `ip:${clientIp}`;
  const userHash = crypto.createHash("sha256").update(effectiveId).digest("hex").slice(0, 32);
  const ipHash = crypto.createHash("sha256").update(clientIp || "127.0.0.1").digest("hex").slice(0, 32);

  const userKey = `quota:unified_api:${userHash}:${today}`;
  const ipKey = `quota:ip_abuse:${ipHash}:${today}`;

  // Device-level abuse protection against rotating proxy / VPN abuse
  let deviceKey = null;
  if (deviceFingerprint && typeof deviceFingerprint === "string" && deviceFingerprint.startsWith("hw_")) {
    const deviceHash = crypto.createHash("sha256").update(deviceFingerprint).digest("hex").slice(0, 32);
    deviceKey = `quota:device_abuse:${deviceHash}:${today}`;
  }

  // If cache hit, do not increment quota - just return current remaining
  if (isCacheHit) {
    try {
      const rawUser = await redis.get(userKey);
      const current = parseInt(rawUser || "0", 10);
      return {
        allowed: true,
        remaining: Math.max(0, limit - current),
        current,
        isCacheHit: true
      };
    } catch {
      return { allowed: true, remaining: limit, current: 0, isCacheHit: true };
    }
  }

  // 1. IP Sybil/Bot Abuse Protection (Max 30 calls across accounts per IP/day)
  try {
    const rawIp = await redis.get(ipKey);
    const ipCount = parseInt(rawIp || "0", 10);
    if (ipCount >= ipDailyLimit) {
      return {
        allowed: false,
        error: "IP_QUOTA_EXHAUSTED",
        message: "Daily search and comparison limit reached for this network/device to protect against automated abuse.",
        remaining: 0,
        current: ipCount
      };
    }
  } catch (err) {
    console.warn("[Unified Quota] IP check warning:", err.message);
  }

  // 1b. Device Hardware Footprint Abuse Protection (Max limit across accounts on this device)
  if (deviceKey) {
    try {
      const rawDevice = await redis.get(deviceKey);
      const deviceCount = parseInt(rawDevice || "0", 10);
      if (deviceCount >= limit) {
        return {
          allowed: false,
          error: "DEVICE_QUOTA_EXHAUSTED",
          message: `Daily search limit reached (${limit}/${limit}) for this device. Your quota resets tomorrow at 12:00 AM IST!`,
          remaining: 0,
          current: deviceCount
        };
      }
    } catch (err) {
      console.warn("[Unified Quota] Device check warning:", err.message);
    }
  }

  // 2. User 10-Call Quota Meter
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
        if (currentCount > limit) {
          return {
            allowed: false,
            error: "DAILY_QUOTA_EXHAUSTED",
            message: `Daily limit reached (${limit}/${limit} AI operations). Your quota resets tomorrow at 12:00 AM IST!`,
            remaining: 0,
            current: currentCount
          };
        }
        // Increment IP counter non-blocking
        redis.set(ipKey, String((parseInt(await redis.get(ipKey) || "0", 10)) + 1), { ex: 86400 }).catch(() => {});
        if (deviceKey) {
          redis.set(deviceKey, String((parseInt(await redis.get(deviceKey) || "0", 10)) + 1), { ex: 86400 }).catch(() => {});
        }
        return {
          allowed: true,
          remaining: Math.max(0, limit - currentCount),
          current: currentCount
        };
      }
    }
  } catch (redisErr) {
    console.warn("[Unified Quota] Upstash Redis error, engaging resilient in-memory fallback:", redisErr.message);
  }

  // Fail-Open In-Memory Resilience (Local Dev & Redis Outage Safeguard)
  const memKey = `${effectiveId}:${today}`;
  const currentMem = (inMemoryUnifiedQuota.get(memKey) || 0) + 1;
  inMemoryUnifiedQuota.set(memKey, currentMem);

  if (currentMem > limit) {
    return {
      allowed: false,
      error: "DAILY_QUOTA_EXHAUSTED",
      message: `Daily limit reached (${limit}/${limit} AI operations). Your quota resets tomorrow!`,
      remaining: 0,
      current: currentMem
    };
  }

  return {
    allowed: true,
    remaining: Math.max(0, limit - currentMem),
    current: currentMem
  };
}

/**
 * Hardware / Device Footprint Abuse Check for VTON
 * Enforces a strict 3 free try-ons ceiling per physical device across all accounts.
 */
export async function checkVtonDeviceAbuse(deviceFingerprint, limit = 3) {
  if (!deviceFingerprint || typeof deviceFingerprint !== "string" || !deviceFingerprint.startsWith("hw_")) {
    return { allowed: true, count: 0, limit };
  }
  const deviceHash = crypto.createHash("sha256").update(deviceFingerprint).digest("hex").slice(0, 32);
  const deviceKey = `vton:device_lifetime:${deviceHash}`;
  try {
    const raw = await redis.get(deviceKey);
    const count = parseInt(raw || "0", 10);
    if (count >= limit) {
      return {
        allowed: false,
        error: "DEVICE_FREE_TRIAL_EXHAUSTED",
        message: `This device has reached the limit of ${limit} free AI Try-Ons. Heavy GPU compute is reserved for registered shoppers. To continue trying outfits with high GPU speed, get a Sachet pack for just ₹10 (5 Try-Ons).`,
        count,
        limit
      };
    }
    return { allowed: true, count, limit };
  } catch {
    return { allowed: true, count: 0, limit };
  }
}

export async function incrementVtonDeviceUsage(deviceFingerprint) {
  if (!deviceFingerprint || typeof deviceFingerprint !== "string" || !deviceFingerprint.startsWith("hw_")) return;
  const deviceHash = crypto.createHash("sha256").update(deviceFingerprint).digest("hex").slice(0, 32);
  const deviceKey = `vton:device_lifetime:${deviceHash}`;
  try {
    const raw = await redis.get(deviceKey);
    const count = parseInt(raw || "0", 10) + 1;
    await redis.set(deviceKey, String(count), { ex: 2592000 }); // 30-day rolling window
  } catch {}
}

/**
 * IP Sybil Abuse Check for VTON (Strict 3 free try-ons per IP across accounts)
 */
export async function checkVtonIpAbuse(clientIp, ipLimit = 3) {
  if (!clientIp || clientIp === "127.0.0.1" || clientIp === "::1") return { allowed: true, count: 0 };
  const ipHash = crypto.createHash("sha256").update(clientIp).digest("hex").slice(0, 32);
  const ipKey = `vton:ip_lifetime:${ipHash}`;
  try {
    const raw = await redis.get(ipKey);
    const count = parseInt(raw || "0", 10);
    if (count >= ipLimit) {
      return {
        allowed: false,
        error: "IP_FREE_TRIAL_EXHAUSTED",
        message: `This network has reached the limit of ${ipLimit} free AI Try-Ons. To continue trying outfits with high GPU speed, get a Sachet pack for just ₹10 (5 Try-Ons).`,
        count,
        limit: ipLimit
      };
    }
    return { allowed: true, count, limit: ipLimit };
  } catch {
    return { allowed: true, count: 0, limit: ipLimit };
  }
}

export async function incrementVtonIpUsage(clientIp) {
  if (!clientIp || clientIp === "127.0.0.1" || clientIp === "::1") return;
  const ipHash = crypto.createHash("sha256").update(clientIp).digest("hex").slice(0, 32);
  const ipKey = `vton:ip_lifetime:${ipHash}`;
  try {
    const raw = await redis.get(ipKey);
    const count = parseInt(raw || "0", 10) + 1;
    await redis.set(ipKey, String(count), { ex: 2592000 }); // 30-day rolling window
  } catch {}
}
