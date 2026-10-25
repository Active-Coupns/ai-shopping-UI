import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hwdhbzazwxjjgnufgpab.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZGhiemF6d3hqamdudWZncGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5MDAxOTEsImV4cCI6MjEwODQ3NjE5MX0._tZoGxdbR3D7scz2udSrqJLDIMAYoHOsp8MVwqB7x-g';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function cleanUp() {
  console.log('--- PURGING MULTIPACKS ---');
  const multipackIds = [
    'hm-uk-1344357003',
    'hm-uk-1348296004',
    'hm-uk-1344357007',
    'hm-uk-1342906005',
    'ca_hm_1348296004',
    'ca_hm_1344357003',
    'ca_hm_1353187001',
    'au_asos_210076537',
    'au_asos_210090470',
    'au_hm_1344357006',
    'au_hm_1348296004'
  ];

  for (const id of multipackIds) {
    const { error } = await supabase.from('fashion_catalog').delete().eq('id', id);
    if (!error) console.log(`Deleted multipack: ${id}`);
  }

  console.log('\n--- FIXING MISSING CURRENCY SYMBOLS IN UK ---');
  const ukMissingCurr = [
    { id: 'asos-uk-212087288', price: '£58.00' },
    { id: 'asos-uk-211707731', price: '£58.00' },
    { id: 'asos-uk-211867648', price: '£53.00' },
    { id: 'asos-uk-211787643', price: '£125.00' }
  ];

  for (const item of ukMissingCurr) {
    const { error } = await supabase.from('fashion_catalog').update({ price: item.price }).eq('id', item.id);
    if (!error) console.log(`Updated price for ${item.id} to ${item.price}`);
  }

  console.log('✅ Cleanup and patching complete!');
}
cleanUp();
