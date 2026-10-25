import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hwdhbzazwxjjgnufgpab.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZGhiemF6d3hqamdudWZncGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5MDAxOTEsImV4cCI6MjEwODQ3NjE5MX0._tZoGxdbR3D7scz2udSrqJLDIMAYoHOsp8MVwqB7x-g";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function migrateTravelDeals() {
  console.log("\n🛫 [1/2] Migrating Travel Deals to 'travel_catalog'...");
  const travelMod = await import("../src/services/travelDealsDatabase.js");

  const countryMap = [
    { code: "IN", data: travelMod.TRAVEL_DEALS_INDIA },
    { code: "US", data: travelMod.TRAVEL_DEALS_US },
    { code: "UK", data: travelMod.TRAVEL_DEALS_UK },
    { code: "CA", data: travelMod.TRAVEL_DEALS_CA },
    { code: "AU", data: travelMod.TRAVEL_DEALS_AU },
    { code: "AE", data: travelMod.TRAVEL_DEALS_AE },
  ];

  let allDeals = [];
  countryMap.forEach(({ code, data }) => {
    if (Array.isArray(data)) {
      data.forEach(deal => {
        allDeals.push({
          id: deal.id,
          country: code,
          platform_id: deal.platformId,
          platform_name: deal.platformName,
          category: deal.category,
          title: deal.title,
          tagline: deal.tagline || null,
          deal_type: deal.dealType || "PROMO_CODE",
          promo_code: deal.promoCode || null,
          discount_value: deal.discountValue || null,
          estimated_savings: deal.estimatedSavings || null,
          verified_score: Number(deal.verifiedScore) || 95,
          verified_date: deal.verifiedDate || "Today",
          min_spend: deal.minSpend || null,
          expiry_note: deal.expiryNote || null,
          is_evergreen: deal.isEvergreen !== false,
          terms: deal.terms || null,
          direct_url: deal.directUrl || null,
          badge: deal.badge || null,
          accent_color: deal.accentColor || null,
        });
      });
    }
  });

  console.log(`📦 Loaded ${allDeals.length} travel deals across 6 countries.`);

  // Test table existence
  const { error: testErr } = await supabase.from("travel_catalog").select("id").limit(1);
  if (testErr) {
    console.error("❌ 'travel_catalog' table check failed:", testErr.message);
    if (testErr.code === "PGRST205") {
      console.log("👉 Please run 'scripts/supabase_schema_travel_subscriptions.sql' in your Supabase SQL Editor first.\n");
    }
    return false;
  }

  // Upload in chunks of 50
  const BATCH_SIZE = 50;
  let migrated = 0;
  for (let i = 0; i < allDeals.length; i += BATCH_SIZE) {
    const batch = allDeals.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from("travel_catalog").upsert(batch, { onConflict: "id" });
    if (error) {
      console.error(`❌ Batch error:`, error.message);
    } else {
      migrated += batch.length;
      process.stdout.write(`\r✅ Migrated ${migrated} / ${allDeals.length} travel deals (${Math.round((migrated / allDeals.length) * 100)}%)`);
    }
  }
  console.log("\n🎉 Travel Catalog migration complete!");
  return true;
}

async function migrateSubscriptions() {
  console.log("\n📺 [2/2] Migrating OTT & Global Subscriptions to 'subscription_catalog'...");

  const files = [
    { code: "IN", file: "../src/data/subscriptionsCatalog.js", key: "INDIA_SUBSCRIPTIONS_CATALOG" },
    { code: "US", file: "../src/data/subscriptionsCatalogUS.js", key: "US_SUBSCRIPTIONS_CATALOG" },
    { code: "UK", file: "../src/data/subscriptionsCatalogUK.js", key: "UK_SUBSCRIPTIONS_CATALOG" },
    { code: "CA", file: "../src/data/subscriptionsCatalogCA.js", key: "CA_SUBSCRIPTIONS_CATALOG" },
    { code: "AU", file: "../src/data/subscriptionsCatalogAU.js", key: "AU_SUBSCRIPTIONS_CATALOG" },
    { code: "AE", file: "../src/data/subscriptionsCatalogAE.js", key: "AE_SUBSCRIPTIONS_CATALOG" },
  ];

  let allPlatforms = [];
  for (const { code, file, key } of files) {
    const mod = await import(file);
    const arr = mod[key] || [];
    arr.forEach(item => {
      allPlatforms.push({
        id: `${code.toLowerCase()}_${item.id}`,
        country: code,
        platform_id: item.id,
        name: item.name,
        category: item.category,
        tagline: item.tagline || null,
        logo_text: item.logoText || null,
        accent_color: item.accentColor || null,
        badge: item.badge || null,
        popular_shows: item.popularShows || [],
        plans: item.plans || [],
        savings_blueprint: item.savingsBlueprint || {},
      });
    });
  }

  console.log(`📦 Loaded ${allPlatforms.length} subscription platforms across 6 countries.`);

  // Test table existence
  const { error: testErr } = await supabase.from("subscription_catalog").select("id").limit(1);
  if (testErr) {
    console.error("❌ 'subscription_catalog' table check failed:", testErr.message);
    if (testErr.code === "PGRST205") {
      console.log("👉 Please run 'scripts/supabase_schema_travel_subscriptions.sql' in your Supabase SQL Editor first.\n");
    }
    return false;
  }

  const BATCH_SIZE = 50;
  let migrated = 0;
  for (let i = 0; i < allPlatforms.length; i += BATCH_SIZE) {
    const batch = allPlatforms.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from("subscription_catalog").upsert(batch, { onConflict: "id" });
    if (error) {
      console.error(`❌ Batch error:`, error.message);
    } else {
      migrated += batch.length;
      process.stdout.write(`\r✅ Migrated ${migrated} / ${allPlatforms.length} subscriptions (${Math.round((migrated / allPlatforms.length) * 100)}%)`);
    }
  }
  console.log("\n🎉 Subscriptions Catalog migration complete!");
  return true;
}

async function run() {
  console.log("🚀 Starting Multi-Category Database Decoupling...");
  console.log(`🌐 Supabase Target: ${supabaseUrl}`);

  const travelOk = await migrateTravelDeals();
  const subOk = await migrateSubscriptions();

  if (travelOk && subOk) {
    console.log("\n=======================================================");
    console.log("🌟 ALL MIGRATIONS COMPLETE: Travel & Subscriptions Live in Supabase!");
    console.log("=======================================================\n");
  }
}

run().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
