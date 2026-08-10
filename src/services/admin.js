import { supabase, isMockAuthMode, auth } from "./supabase";

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

/**
 * Normalizes loaded settings to ensure all required arrays are present.
 */
function normalizeSettings(raw) {
  if (!raw) return defaultSettings;
  
  const normalized = {
    personalTags: raw.personalTags || [],
    aggregators: raw.aggregators || [],
    coupons: raw.coupons || []
  };

  // Compatibility Adapter: If raw has old apiKeys, split them into personalTags and aggregators
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

/**
 * Gets admin settings (API keys & Coupons) from Supabase table or falls back to user metadata.
 */
export async function getAdminSettings(user = null, token = null) {
  if (isMockAuthMode()) {
    if (user && user.user_metadata?.admin_settings) {
      return normalizeSettings(user.user_metadata.admin_settings);
    }
    return defaultSettings;
  }

  try {
    // Attempt database table read
    const { data, error } = await supabase
      .from("admin_settings")
      .select("*");
    
    if (!error && data && data.length > 0) {
      // Map rows back to settings structure
      const personalTags = data.filter(item => item.type === "personal_tag").map(item => ({
        id: item.id,
        store: item.name,
        tag: item.value,
        region: item.region
      }));
      const aggregators = data.filter(item => item.type === "aggregator").map(item => ({
        id: item.id,
        name: item.name,
        token: item.value,
        region: item.region
      }));
      const coupons = data.filter(item => item.type === "coupon").map(item => ({
        id: item.id,
        code: item.code,
        store: item.store,
        description: item.description,
        link: item.link,
        region: item.region
      }));
      
      // Fallback if DB table is empty but exists
      if (personalTags.length === 0 && aggregators.length === 0 && coupons.length === 0) {
        if (user && user.user_metadata?.admin_settings) {
          return normalizeSettings(user.user_metadata.admin_settings);
        }
        return defaultSettings;
      }

      return { personalTags, aggregators, coupons };
    }
  } catch (dbErr) {
    console.warn("Supabase database admin_settings table not accessible, using metadata fallback:", dbErr.message);
  }

  // Fallback to active user metadata
  if (user && user.user_metadata?.admin_settings) {
    return normalizeSettings(user.user_metadata.admin_settings);
  }

  return defaultSettings;
}

/**
 * Saves admin settings securely to Supabase DB or falls back to user metadata.
 */
export async function saveAdminSettings(user, settings, token = null) {
  if (!user) throw new Error("Unauthenticated");

  const todayStr = new Date().toISOString();
  const normalized = normalizeSettings(settings);

  // 1. Update user metadata as a secure fallback
  const { data: updateData, error: updateError } = await auth.updateUserMetadata(user.id, {
    admin_settings: normalized
  }, token);

  if (isMockAuthMode()) {
    return { data: updateData?.user, error: updateError };
  }

  // 2. Try to write to Supabase DB table
  try {
    // For simple DB representation, we delete old settings and insert new ones
    await supabase.from("admin_settings").delete().neq("id", "0");

    const rows = [];
    normalized.personalTags.forEach(tagItem => {
      rows.push({
        id: tagItem.id,
        type: "personal_tag",
        name: tagItem.store,
        value: tagItem.tag,
        region: tagItem.region,
        updated_at: todayStr
      });
    });
    normalized.aggregators.forEach(aggItem => {
      rows.push({
        id: aggItem.id,
        type: "aggregator",
        name: aggItem.name,
        value: aggItem.token,
        region: aggItem.region,
        updated_at: todayStr
      });
    });
    normalized.coupons.forEach(coupon => {
      rows.push({
        id: coupon.id,
        type: "coupon",
        code: coupon.code,
        store: coupon.store,
        description: coupon.description,
        link: coupon.link,
        region: coupon.region,
        updated_at: todayStr
      });
    });

    const { error: dbError } = await supabase.from("admin_settings").insert(rows);
    if (dbError) {
      console.warn("DB settings insert failed, metadata fallback saved successfully:", dbError.message);
    }
  } catch (err) {
    console.warn("DB settings save failed, metadata fallback saved successfully:", err.message);
  }

  return { data: updateData?.user, error: updateError };
}
