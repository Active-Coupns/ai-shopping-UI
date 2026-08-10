import { supabase, isMockAuthMode, auth } from "./supabase";

/**
 * Gets admin settings (API keys & Coupons) from Supabase table or falls back to user metadata.
 */
export async function getAdminSettings(user = null, token = null) {
  const defaultSettings = {
    apiKeys: [
      { id: "1", name: "Cuelinks API Token", value: "", region: "IN" },
      { id: "2", name: "Amazon Affiliate Tag", value: "", region: "US" }
    ],
    coupons: [
      { id: "c1", code: "ZOMATO50", store: "Zomato", description: "50% off on your first food order", link: "https://zomato.com", region: "IN" },
      { id: "c2", code: "UBERFREE", store: "Uber", description: "Get a free cab ride up to $15", link: "https://uber.com", region: "US" },
      { id: "c3", code: "SWIGGYIT", store: "Swiggy", description: "Free delivery on food orders above Rs.199", link: "https://swiggy.com", region: "IN" },
      { id: "c4", code: "AMZ100", store: "Amazon", description: "Flat Rs. 100 cashback on electronics purchase", link: "https://amazon.in", region: "IN" }
    ]
  };

  if (isMockAuthMode()) {
    if (user && user.user_metadata?.admin_settings) {
      return user.user_metadata.admin_settings;
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
      const apiKeys = data.filter(item => item.type === "apikey").map(item => ({
        id: item.id,
        name: item.name,
        value: item.value,
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
      return { apiKeys, coupons };
    }
  } catch (dbErr) {
    console.warn("Supabase database admin_settings table not accessible, using metadata fallback:", dbErr.message);
  }

  // Fallback to active user metadata
  if (user && user.user_metadata?.admin_settings) {
    return user.user_metadata.admin_settings;
  }

  return defaultSettings;
}

/**
 * Saves admin settings securely to Supabase DB or falls back to user metadata.
 */
export async function saveAdminSettings(user, settings, token = null) {
  if (!user) throw new Error("Unauthenticated");

  const todayStr = new Date().toISOString();

  // 1. Update user metadata as a secure fallback
  const { data: updateData, error: updateError } = await auth.updateUserMetadata(user.id, {
    admin_settings: settings
  }, token);

  if (isMockAuthMode()) {
    return { data: updateData?.user, error: updateError };
  }

  // 2. Try to write to Supabase DB table
  try {
    // For simple DB representation, we delete old settings and insert new ones
    // First, clear previous entries
    await supabase.from("admin_settings").delete().neq("id", "0");

    const rows = [];
    settings.apiKeys.forEach(key => {
      rows.push({
        id: key.id,
        type: "apikey",
        name: key.name,
        value: key.value,
        region: key.region,
        updated_at: todayStr
      });
    });
    settings.coupons.forEach(coupon => {
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
