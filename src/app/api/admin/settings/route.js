import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { redis } from "@/services/redis";

const SETTINGS_REDIS_KEY = "config:admin:settings";

const envEarnkaroKey = process.env.EARNKARO_KEY || process.env.EARNKARO_TOKEN || "";

const defaultSettings = {
  personalTags: [],
  aggregators: envEarnkaroKey ? [
    { id: "agg-earnkaro-env", name: "EarnKaro", token: envEarnkaroKey, region: "IN" }
  ] : [],
  coupons: [
    { id: "c1", code: "ZOMATO50", store: "Zomato", description: "50% off on your first food order", link: "https://zomato.com", region: "IN" },
    { id: "c2", code: "UBERFREE", store: "Uber", description: "Get a free cab ride up to $15", link: "https://uber.com", region: "US" },
    { id: "c3", code: "SWIGGYIT", store: "Swiggy", description: "Free delivery on food orders above Rs.199", link: "https://swiggy.com", region: "IN" },
    { id: "c4", code: "AMZ100", store: "Amazon", description: "Flat Rs. 100 cashback on electronics purchase", link: "https://amazon.in", region: "IN" }
  ],
  featureFlags: {
    vtonTrialRoom: true,
    aiConciergeChat: true,
    aiSpecRealityCheck: true,
    zyteCouponScraper: true,
    headToHeadCompare: true,
    priceAlerts: true,
    maintenanceBanner: false
  }
};

function normalizeSettings(raw) {
  if (!raw) return defaultSettings;
  
  const normalized = {
    personalTags: Array.isArray(raw.personalTags) ? raw.personalTags : [],
    aggregators: Array.isArray(raw.aggregators) ? raw.aggregators : [],
    coupons: Array.isArray(raw.coupons) ? raw.coupons : [],
    featureFlags: { ...defaultSettings.featureFlags, ...(raw.featureFlags || {}) }
  };

  if (Array.isArray(raw.apiKeys)) {
    raw.apiKeys.forEach(k => {
      const nameLower = (k.name || "").toLowerCase();
      const isTag = nameLower.includes("tag") || nameLower.includes("id") || nameLower.includes("amazon") || nameLower.includes("flipkart");
      if (isTag) {
        if (!normalized.personalTags.some(pt => pt.store.toLowerCase() === nameLower.split(" ")[0])) {
          normalized.personalTags.push({
            id: k.id || "p-" + Date.now(),
            store: k.name.split(" ")[0],
            tag: k.value || k.tag || "",
            region: k.region || "GLOBAL"
          });
        }
      } else {
        if (!normalized.aggregators.some(ag => ag.name.toLowerCase() === nameLower.split(" ")[0])) {
          normalized.aggregators.push({
            id: k.id || "a-" + Date.now(),
            name: k.name.split(" ")[0],
            token: k.value || k.token || "",
            region: k.region || "GLOBAL"
          });
        }
      }
    });
  }

  if (normalized.aggregators.length === 0) {
    normalized.aggregators = [...defaultSettings.aggregators];
  }

  if (normalized.coupons.length === 0) {
    normalized.coupons = [...defaultSettings.coupons];
  }

  return normalized;
}

function getAdminAllowlist() {
  const raw = process.env.ADMIN_USER_IDS;
  if (!raw || typeof raw !== "string") return new Set();
  return new Set(
    raw
      .split(",")
      .map(id => id.trim())
      .filter(id => id.length > 0)
  );
}

function verifyAdminAuthorization(request) {
  let userId = null;
  try {
    const authObj = getAuth(request);
    userId = authObj?.userId || null;
  } catch (authErr) {
    console.warn("[Admin Settings] Authentication resolution error:", authErr.message);
    return {
      authorized: false,
      status: 401,
      payload: { error: "UNAUTHORIZED", message: "Valid authentication session required." }
    };
  }

  if (!userId) {
    return {
      authorized: false,
      status: 401,
      payload: { error: "UNAUTHORIZED", message: "Sign-in required to access admin settings." }
    };
  }

  const allowlist = getAdminAllowlist();
  if (allowlist.size === 0) {
    console.warn("[Admin Settings] Access denied: ADMIN_USER_IDS is unconfigured or empty (failing closed).");
    return {
      authorized: false,
      status: 403,
      payload: { error: "FORBIDDEN", message: "Admin authorization is unconfigured or disabled on this server." }
    };
  }

  if (!allowlist.has(userId)) {
    console.warn(`[Admin Settings] Forbidden: User ${userId} is not in ADMIN_USER_IDS allowlist.`);
    return {
      authorized: false,
      status: 403,
      payload: { error: "FORBIDDEN", message: "User is not authorized as an administrator." }
    };
  }

  return { authorized: true, userId };
}

export async function GET(request) {
  const authCheck = verifyAdminAuthorization(request);
  if (!authCheck.authorized) {
    return NextResponse.json(authCheck.payload, { status: authCheck.status });
  }

  try {
    const raw = await redis.get(SETTINGS_REDIS_KEY);
    if (raw) {
      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      return NextResponse.json(normalizeSettings(parsed));
    }
  } catch (err) {
    console.warn("Failed reading admin settings from Redis:", err);
  }

  return NextResponse.json(defaultSettings);
}

export async function POST(request) {
  const authCheck = verifyAdminAuthorization(request);
  if (!authCheck.authorized) {
    return NextResponse.json(authCheck.payload, { status: authCheck.status });
  }

  try {
    const body = await request.json();
    const normalized = normalizeSettings(body);

    await redis.set(SETTINGS_REDIS_KEY, JSON.stringify(normalized));
    console.log("Successfully persisted updated Admin Settings to Redis:", SETTINGS_REDIS_KEY);

    return NextResponse.json({ data: normalized, error: null });
  } catch (err) {
    console.error("Failed saving admin settings to Redis:", err);
    return NextResponse.json({ error: "Failed to save admin settings" }, { status: 500 });
  }
}
