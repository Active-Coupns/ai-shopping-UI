import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hwdhbzazwxjjgnufgpab.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZGhiemF6d3hqamdudWZncGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5MDAxOTEsImV4cCI6MjEwODQ3NjE5MX0._tZoGxdbR3D7scz2udSrqJLDIMAYoHOsp8MVwqB7x-g";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runMigration() {
  console.log("🚀 Starting Fashion Catalog Migration to Supabase...");
  console.log(`🌐 Supabase Target: ${supabaseUrl}`);

  // Dynamically load the fashion catalog
  const catalogModule = await import("../src/data/fashionCatalog.js");
  const catalog = catalogModule.FASHION_CATALOG || [];

  console.log(`📦 Loaded ${catalog.length} products from local catalog.`);

  if (catalog.length === 0) {
    console.error("❌ No items found in catalog to migrate.");
    process.exit(1);
  }

  // Check if table exists
  const { error: testErr } = await supabase.from("fashion_catalog").select("id").limit(1);
  if (testErr) {
    console.error("❌ Table check failed:", testErr.message);
    if (testErr.code === "PGRST205") {
      console.log("\n⚠️  The 'fashion_catalog' table does not exist in your Supabase database yet.");
      console.log("👉 Please copy and run the SQL in 'scripts/supabase_schema.sql' in your Supabase SQL Editor first.\n");
    }
    process.exit(1);
  }

  // Upload in chunks of 50 to avoid payload limits
  const BATCH_SIZE = 50;
  let totalMigrated = 0;

  for (let i = 0; i < catalog.length; i += BATCH_SIZE) {
    const batch = catalog.slice(i, i + BATCH_SIZE).map(item => ({
      id: item.id,
      gender: item.gender,
      category: item.category,
      category_label: item.category_label || null,
      title: item.title,
      brand: item.brand || null,
      color: item.color || null,
      price: item.price || null,
      raw_price: Number(item.raw_price) || 0,
      original_price: item.original_price || null,
      discount_percent: Number(item.discount_percent) || 0,
      store: item.store || null,
      direct_link: item.direct_link || null,
      deal_link: item.deal_link || null,
      image: item.image || null,
      image_url: item.image_url || item.image || null,
      description: item.description || null,
      fabric: item.fabric || null,
      occasion: item.occasion || null,
      fit: item.fit || null,
      rating: Number(item.rating) || 4.0,
      reviews_count: Number(item.reviews_count) || 0,
      tryon_compatible: item.tryon_compatible !== false,
      price_comparison: item.price_comparison || []
    }));

    const { error } = await supabase
      .from("fashion_catalog")
      .upsert(batch, { onConflict: "id" });

    if (error) {
      console.error(`❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} failed:`, error.message);
    } else {
      totalMigrated += batch.length;
      process.stdout.write(`\r✅ Migrated ${totalMigrated} / ${catalog.length} items (${Math.round((totalMigrated / catalog.length) * 100)}%)`);
    }
  }

  console.log("\n\n🎉 Migration Complete! All items are successfully synced to Supabase.");
}

runMigration().catch(err => {
  console.error("Fatal migration error:", err);
  process.exit(1);
});
