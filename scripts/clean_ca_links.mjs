import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hwdhbzazwxjjgnufgpab.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZGhiemF6d3hqamdudWZncGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5MDAxOTEsImV4cCI6MjEwODQ3NjE5MX0._tZoGxdbR3D7scz2udSrqJLDIMAYoHOsp8MVwqB7x-g';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function cleanCALinks() {
  const { data: caItems } = await supabase
    .from('fashion_catalog')
    .select('*')
    .eq('country', 'CA');

  if (!caItems) return;
  const patched = [];
  for (const item of caItems) {
    let directLink = (item.direct_link || "").replace("asos.com/us/", "asos.com/");
    let dealLink = (item.deal_link || "").replace("asos.com/us/", "asos.com/");
    let priceComp = item.price_comparison;
    if (Array.isArray(priceComp)) {
      priceComp = priceComp.map(c => ({
        ...c,
        deal_link: (c.deal_link || "").replace("asos.com/us/", "asos.com/")
      }));
    }
    patched.push({
      ...item,
      direct_link: directLink,
      deal_link: dealLink,
      price_comparison: priceComp
    });
  }

  for (let i = 0; i < patched.length; i += 200) {
    await supabase.from('fashion_catalog').upsert(patched.slice(i, i + 200), { onConflict: 'id' });
  }
  console.log(`Cleaned ${patched.length} Canada items!`);
}
cleanCALinks();
