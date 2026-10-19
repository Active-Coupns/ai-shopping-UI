import { redis } from "@/services/redis";
import { maskSecretTokens } from "@/lib/errorShield";

const CRASH_VAULT_KEY = "metrics:crash_vault";
const CRASH_DAILY_PREFIX = "metrics:crash:daily:";
const MAX_CRASH_LOGS = 50;

function getTodayKey() {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(now.getUTCDate()).padStart(2, "0")}`;
}

/**
 * Record an unhandled crash or exception into the Crash Vault
 */
export async function recordCrashException({
  error = null,
  message = "",
  component = "backend",
  route = "/",
  userId = "anonymous",
  clientIp = "127.0.0.1",
  severity = "error", // error | warning | critical
  meta = {}
}) {
  try {
    const today = getTodayKey();
    const rawErrMsg = (error?.message || message || "Unknown runtime exception").slice(0, 300);
    const rawErrStack = (error?.stack || "").slice(0, 800);
    const errMsg = maskSecretTokens(rawErrMsg);
    const errStack = maskSecretTokens(rawErrStack);
    
    // Extract file and line from stack trace if available
    let location = "Unknown file";
    if (errStack) {
      const match = errStack.match(/(?:at\s+.*?\s+\()?(.*?:\d+:\d+)\)?/);
      if (match && match[1]) {
        // Clean absolute path for privacy/readability
        location = match[1].replace(/.*[\\\/](src[\\\/].*)/, "$1").replace(/\\/g, "/");
      }
    }

    const crashId = `crash_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const entry = {
      id: crashId,
      timestamp: Date.now(),
      message: errMsg,
      stack: errStack,
      location,
      component,
      route,
      userId,
      clientIp,
      severity,
      meta,
      resolved: false
    };

    // Increment daily crash counter
    redis.incr(`${CRASH_DAILY_PREFIX}${today}`).catch(() => {});
    
    // Push into recent crash list
    await redis.lpush(CRASH_VAULT_KEY, JSON.stringify(entry)).catch(() => {});
    await redis.ltrim(CRASH_VAULT_KEY, 0, MAX_CRASH_LOGS - 1).catch(() => {});

    return entry;
  } catch (err) {
    console.warn("[CrashVault] Non-critical recording error:", err.message);
    return null;
  }
}

/**
 * Retrieve recent crashes and daily statistics
 */
export async function getRecentCrashes(limit = 30) {
  try {
    const today = getTodayKey();
    const [rawCrashes, dailyCount] = await Promise.all([
      redis.lrange(CRASH_VAULT_KEY, 0, limit - 1).catch(() => []),
      redis.get(`${CRASH_DAILY_PREFIX}${today}`).catch(() => 0)
    ]);

    const crashes = (rawCrashes || []).map(item => {
      try {
        return typeof item === "string" ? JSON.parse(item) : item;
      } catch {
        return null;
      }
    }).filter(Boolean);

    return {
      todayCount: parseInt(dailyCount, 10) || 0,
      totalTracked: crashes.length,
      crashes
    };
  } catch (e) {
    console.warn("[CrashVault] Fetch error:", e.message);
    return { todayCount: 0, totalTracked: 0, crashes: [] };
  }
}

/**
 * Clear or mark crashes as resolved
 */
export async function clearCrashes() {
  try {
    await redis.del(CRASH_VAULT_KEY);
    return true;
  } catch (e) {
    return false;
  }
}
