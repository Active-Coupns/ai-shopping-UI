import { redis } from "@/services/redis";

export const FEATURES_REDIS_KEY = "config:admin:features";

export const defaultFeatureFlags = {
  vtonTrialRoom: true,       // AI Virtual Trial Room (VTON)
  aiConciergeChat: true,     // Pre-Search AI Shopping Concierge
  aiSpecRealityCheck: true,  // AI Spec & Reality Check Engine
  zyteCouponScraper: true,   // Zyte Brand Coupon Scraper
  headToHeadCompare: true,   // Head-to-Head VS Comparison Mode
  priceAlerts: true,         // Price Drop Tracker & Alerts
  maintenanceBanner: false   // System Maintenance Notice Banner
};

export async function getFeatureFlags() {
  try {
    const raw = await redis.get(FEATURES_REDIS_KEY);
    if (raw) {
      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      return { ...defaultFeatureFlags, ...parsed };
    }
  } catch (e) {
    console.warn("[FeatureFlags] Fetch error:", e);
  }
  return { ...defaultFeatureFlags };
}

export async function isFeatureEnabled(featureKey) {
  const flags = await getFeatureFlags();
  return flags[featureKey] !== false;
}

export async function updateFeatureFlags(updates) {
  const current = await getFeatureFlags();
  const updated = { ...current, ...updates };
  await redis.set(FEATURES_REDIS_KEY, JSON.stringify(updated));
  return updated;
}
