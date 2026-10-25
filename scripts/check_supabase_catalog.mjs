import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hwdhbzazwxjjgnufgpab.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZGhiemF6d3hqamdudWZncGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5MDAxOTEsImV4cCI6MjEwODQ3NjE5MX0._tZoGxdbR3D7scz2udSrqJLDIMAYoHOsp8MVwqB7x-g';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCatalog() {
  const countries = ['IN', 'US', 'UK', 'CA', 'AU', 'AE'];
  for (const c of countries) {
    const { count, error } = await supabase
      .from('fashion_catalog')
      .select('*', { count: 'exact', head: true })
      .eq('country', c);
    console.log(`Country ${c}: count = ${count}, error = ${error?.message || 'none'}`);
  }
}

checkCatalog().catch(console.error);
