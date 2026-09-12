import { NextResponse } from "next/server";
import { redis } from "@/services/redis";

const SETTINGS_REDIS_KEY = "config:admin:settings";

const defaultSettings = {
  personalTags: [],
  aggregators: [],
  coupons: [
    { id: "c1", code: "ZOMATO50", store: "Zomato", description: "50% off on your first food order", link: "https://zomato.com", region: "IN" },
    { id: "c2", code: "UBERFREE", store: "Uber", description: "Get a free cab ride up to $15", link: "https://uber.com", region: "US" },
    { id: "c3", code: "SWIGGYIT", store: "Swiggy", description: "Free delivery on food orders above Rs.199", link: "https://swiggy.com", region: "IN" },
    { id: "c4", code: "AMZ100", store: "Amazon", description: "Flat Rs. 100 cashback on electronics purchase", link: "https://amazon.in", region: "IN" }
  ]
};

// Auto-inject environment fallback keys if available in process.env
const envEarnkaroKey = process.env.EARNKARO_KEY || process.env.EARNKARO_TOKEN || process.env.NEXT_PUBLIC_EARNKARO_KEY;
if (envEarnkaroKey) {
  defaultSettings.aggregators.push({
    id: "agg-env-earnkaro",
    name: "EarnKaro",
    token: envEarnkaroKey,
    region: "IN"
  });
}

function normalizeSettings(raw) {
  if (!raw) return defaultSettings;
  
  const normalized = {
    personalTags: Array.isArray(raw.personalTags) ? raw.personalTags : [],
    aggregators: Array.isArray(raw.aggregators) ? raw.aggregators : [],
    coupons: Array.isArray(raw.coupons) ? raw.coupons : []
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

  if (normalized.coupons.length === 0) {
    normalized.coupons = [...defaultSettings.coupons];
  }

  return normalized;
}

export async function GET() {
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
