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

function normalizeSettings(raw) {
  if (!raw) return defaultSettings;
  
  const normalized = {
    personalTags: raw.personalTags || [],
    aggregators: raw.aggregators || [],
    coupons: raw.coupons || []
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
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("shopsmart_admin_settings");
      if (stored) {
        return normalizeSettings(JSON.parse(stored));
      }
    }
  } catch (e) {
    console.warn("Failed to load admin settings from localStorage:", e);
  }
  return defaultSettings;
}

export async function saveAdminSettings(user, settings) {
  const normalized = normalizeSettings(settings);
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem("shopsmart_admin_settings", JSON.stringify(normalized));
    }
  } catch (e) {
    console.warn("Failed to save admin settings to localStorage:", e);
  }
  return { data: normalized, error: null };
}
