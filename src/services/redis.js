import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const isConfigured = !!(redisUrl && redisToken);

// Local in-memory cache fallback for offline testing
const memoryCache = new Map();

class FallbackRedisClient {
  async get(key) {
    const entry = memoryCache.get(key);
    if (!entry) return null;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      memoryCache.delete(key);
      return null;
    }
    return entry.value;
  }

  async set(key, value, options) {
    let ttlMs = null;
    if (options && options.ex) {
      ttlMs = options.ex * 1000;
    }
    memoryCache.set(key, {
      value,
      expiresAt: ttlMs ? Date.now() + ttlMs : null
    });
    return "OK";
  }
}

let redisClient;

if (isConfigured) {
  redisClient = new Redis({
    url: redisUrl,
    token: redisToken,
  });
  console.log("Upstash Redis connection initialized.");
} else {
  redisClient = new FallbackRedisClient();
  console.warn("Upstash Redis credentials missing. Using local in-memory fallback cache.");
}

export const redis = redisClient;
export default redis;
