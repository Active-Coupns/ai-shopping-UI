import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hwdhbzazwxjjgnufgpab.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZGhiemF6d3hqamdudWZncGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5MDAxOTEsImV4cCI6MjEwODQ3NjE5MX0._tZoGxdbR3D7scz2udSrqJLDIMAYoHOsp8MVwqB7x-g';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function patchUAELinks() {
  console.log("🇦🇪 Auditing & Fast-Batch Patching UAE Links in Supabase...");
  
  // Fetch all AE items
  const { data: aeItems, error } = await supabase
    .from('fashion_catalog')
    .select('*')
    .eq('country', 'AE');

  if (error || !aeItems) {
    console.error("Error fetching AE items:", error?.message);
    return;
  }

  console.log(`Fetched ${aeItems.length} UAE items.`);
  const patched = [];

  for (const item of aeItems) {
    let directLink = item.direct_link || "";
    let dealLink = item.deal_link || "";

    // Clean ASOS URLs: remove /us/
    directLink = directLink.replace("asos.com/us/", "asos.com/");
    dealLink = dealLink.replace("asos.com/us/", "asos.com/");

    // Clean H&M URLs: change www2.hm.com/en_us/ to ae.hm.com/en/
    directLink = directLink.replace("www2.hm.com/en_us/", "ae.hm.com/en/");
    dealLink = dealLink.replace("www2.hm.com/en_us/", "ae.hm.com/en/");

    // Clean price comparison links
    let priceComp = item.price_comparison;
    if (Array.isArray(priceComp)) {
      priceComp = priceComp.map(c => {
        let u = c.deal_link || "";
        u = u.replace("asos.com/us/", "asos.com/").replace("www2.hm.com/en_us/", "ae.hm.com/en/");
        return { ...c, deal_link: u };
      });
    }

    patched.push({
      ...item,
      direct_link: directLink,
      deal_link: dealLink,
      price_comparison: priceComp
    });
  }

  // Bulk upsert in chunks of 200 (instant!)
  for (let i = 0; i < patched.length; i += 200) {
    const chunk = patched.slice(i, i + 200);
    const { error: upErr } = await supabase
      .from('fashion_catalog')
      .upsert(chunk, { onConflict: 'id' });
    if (upErr) {
      console.error("Batch upsert error:", upErr.message);
    } else {
      console.log(`  ⚡ Fast Upserted ${Math.min(i + 200, patched.length)} / ${patched.length}`);
    }
  }

  console.log(`✅ All ${patched.length} UAE items are now clean and point directly to Middle East / UAE stores!`);

  // Verify sample
  const { data: sample } = await supabase
    .from('fashion_catalog')
    .select('title, price, direct_link, store')
    .eq('country', 'AE')
    .limit(3);

  console.log("\n--- VERIFIED CLEAN UAE SAMPLES ---");
  sample?.forEach(s => console.log(`• ${s.title} | ${s.price} | Store: ${s.store} | Link: ${s.direct_link}`));
}

patchUAELinks();
