import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hwdhbzazwxjjgnufgpab.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZGhiemF6d3hqamdudWZncGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5MDAxOTEsImV4cCI6MjEwODQ3NjE5MX0._tZoGxdbR3D7scz2udSrqJLDIMAYoHOsp8MVwqB7x-g";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("🚀 Starting US Fashion Ingestion into Supabase...");

  if (!fs.existsSync("scratch/us_fashion_sample.json")) {
    console.error("❌ File scratch/us_fashion_sample.json not found!");
    process.exit(1);
  }

  const items = JSON.parse(fs.readFileSync("scratch/us_fashion_sample.json", "utf8"));
  console.log(`📦 Loaded ${items.length} verified US items.`);

  // Check country column
  const { error: testErr } = await supabase.from("fashion_catalog").select("country").limit(1);
  if (testErr) {
    console.error("❌ 'country' column check failed:", testErr.message);
    console.log("👉 Please run the ALTER TABLE statement in Supabase SQL editor first:\n");
    console.log("ALTER TABLE public.fashion_catalog ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'IN';\n");
    process.exit(1);
  }

  // Upload in batch
  const { error } = await supabase.from("fashion_catalog").upsert(items, { onConflict: "id" });
  if (error) {
    console.error("❌ Upsert failed:", error.message);
  } else {
    console.log(`🎉 Successfully seeded ${items.length} US fashion products into Supabase fashion_catalog!`);
  }
}

run();
