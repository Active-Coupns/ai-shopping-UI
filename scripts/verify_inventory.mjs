import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hwdhbzazwxjjgnufgpab.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZGhiemF6d3hqamdudWZncGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5MDAxOTEsImV4cCI6MjEwODQ3NjE5MX0._tZoGxdbR3D7scz2udSrqJLDIMAYoHOsp8MVwqB7x-g';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { count: inCount } = await supabase.from('fashion_catalog').select('*', { count: 'exact', head: true }).eq('country', 'IN');
  const { count: usCount } = await supabase.from('fashion_catalog').select('*', { count: 'exact', head: true }).eq('country', 'US');
  const { count: ukCount } = await supabase.from('fashion_catalog').select('*', { count: 'exact', head: true }).in('country', ['UK', 'GB']);
  const { count: caCount } = await supabase.from('fashion_catalog').select('*', { count: 'exact', head: true }).eq('country', 'CA');
  const { count: auCount } = await supabase.from('fashion_catalog').select('*', { count: 'exact', head: true }).eq('country', 'AU');
  const { count: aeCount } = await supabase.from('fashion_catalog').select('*', { count: 'exact', head: true }).eq('country', 'AE');
  
  const total = (inCount || 0) + (usCount || 0) + (ukCount || 0) + (caCount || 0) + (auCount || 0) + (aeCount || 0);

  console.log('========================================================');
  console.log('🌍 6 GLOBAL TIER-1 MARKETS - SUPABASE INVENTORY AUDIT 🌍');
  console.log('========================================================');
  console.log('🇮🇳 India (IN):                 ', inCount, 'items (₹ INR)');
  console.log('🇺🇸 United States (US):         ', usCount, 'items ($ USD)');
  console.log('🇬🇧 United Kingdom (UK):        ', ukCount, 'items (£ GBP)');
  console.log('🇨🇦 Canada (CA):                ', caCount, 'items (C$ CAD)');
  console.log('🇦🇺 Australia (AU):             ', auCount, 'items (A$ AUD)');
  console.log('🇦🇪 United Arab Emirates (AE):  ', aeCount, 'items (AED)');
  console.log('--------------------------------------------------------');
  console.log('🎉 TOTAL LIVE INVENTORY:       ', total, 'verified items');
  console.log('========================================================');

  // Sample check for UAE
  const { data: aeSample } = await supabase.from('fashion_catalog').select('title, price, store, direct_link, image, category').eq('country', 'AE').limit(5);
  console.log('\n--- SAMPLE UAE PRODUCTS ---');
  aeSample.forEach((p, i) => {
    console.log(`${i+1}. [${p.category}] ${p.title} | ${p.price} | Store: ${p.store}`);
    console.log(`   Link: ${p.direct_link}`);
    console.log(`   Image: ${p.image}`);
  });

  // Verify Quality Assertions Across All 6 Countries
  console.log('\n--- RUNNING GLOBAL INTEGRITY CHECKS ---');
  const { count: googleLinks } = await supabase.from('fashion_catalog').select('*', { count: 'exact', head: true }).ilike('direct_link', '%google.com%');
  const { count: unisexCount } = await supabase.from('fashion_catalog').select('*', { count: 'exact', head: true }).ilike('title', '%unisex%');
  const { count: backViewCount } = await supabase.from('fashion_catalog').select('*', { count: 'exact', head: true }).ilike('title', '%back print%');
  const { count: namshiLinks } = await supabase.from('fashion_catalog').select('*', { count: 'exact', head: true }).eq('country', 'AE').ilike('direct_link', '%namshi.com/uae-en/%');

  console.log('🔍 Google Redirect Links:     ', googleLinks, '(Should be 0)');
  console.log('🔍 Unisex / Double Models:    ', unisexCount, '(Should be 0)');
  console.log('🔍 Back-View Hero Images:     ', backViewCount, '(Should be 0)');
  console.log('🔍 UAE Native Namshi Links:   ', namshiLinks, `(Out of ${aeCount})`);
  console.log('========================================================');
}
check();
