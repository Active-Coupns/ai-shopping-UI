import { redis } from "@/services/redis";

const SETTINGS_REDIS_KEY = "config:admin:settings";

const defaultSettings = {
  personalTags: [],
  aggregators: [
    { id: "agg-earnkaro-default", name: "EarnKaro", token: "5631241", region: "IN" }
  ],
  coupons: [
    { id: "c1", code: "ZOMATO50", store: "Zomato", description: "50% off on your first food order", link: "https://zomato.com", region: "IN" },
    { id: "c2", code: "UBERFREE", store: "Uber", description: "Get a free cab ride up to $15", link: "https://uber.com", region: "US" },
    { id: "c3", code: "SWIGGYIT", store: "Swiggy", description: "Free delivery on food orders above Rs.199", link: "https://swiggy.com", region: "IN" },
    { id: "c4", code: "AMZ100", store: "Amazon", description: "Flat Rs. 100 cashback on electronics purchase", link: "https://amazon.in", region: "IN" }
  ]
};

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

export async function getAdminSettings() {
  try {
    // 1. On Server Side (Node.js/Vercel), fetch directly from Redis
    if (typeof window === "undefined") {
      const raw = await redis.get(SETTINGS_REDIS_KEY);
      if (raw) {
        const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
        return normalizeSettings(parsed);
      }
      return defaultSettings;
    }

    // 2. On Client Side (Browser), fetch from Admin Settings API
    const res = await fetch("/api/admin/settings");
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("shopsmart_admin_settings", JSON.stringify(data));
      return normalizeSettings(data);
    }
  } catch (e) {
    console.warn("Failed to load admin settings from API/Redis:", e);
  }

  // 3. Fallback to localStorage
  try {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("shopsmart_admin_settings");
      if (stored) {
        return normalizeSettings(JSON.parse(stored));
      }
    }
  } catch (e) {}

  return defaultSettings;
}

export async function saveAdminSettings(user, settings) {
  const normalized = normalizeSettings(settings);
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem("shopsmart_admin_settings", JSON.stringify(normalized));
      
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalized)
      });

      if (res.ok) {
        const data = await res.json();
        return { data: data.data || normalized, error: null };
      }
    } else {
      await redis.set(SETTINGS_REDIS_KEY, JSON.stringify(normalized));
    }
  } catch (e) {
    console.warn("Failed to save admin settings to API/Redis:", e);
  }
  return { data: normalized, error: null };
}
