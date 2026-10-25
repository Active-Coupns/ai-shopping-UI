import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hwdhbzazwxjjgnufgpab.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZGhiemF6d3hqamdudWZncGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5MDAxOTEsImV4cCI6MjEwODQ3NjE5MX0._tZoGxdbR3D7scz2udSrqJLDIMAYoHOsp8MVwqB7x-g';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function findCandidates() {
  const countries = ['IN', 'US', 'UK', 'CA', 'AU', 'AE'];
  const testMatrix = {};

  for (const c of countries) {
    testMatrix[c] = {};
    const countryFilter = c === 'UK' ? ['UK', 'GB'] : [c];

    // Men Upper (shirts, hoodies, blazers, flannels, kurtas)
    const { data: menUpper } = await supabase
      .from('fashion_catalog')
      .select('id, title, brand, price, image, category, gender')
      .in('country', countryFilter)
      .eq('gender', 'men')
      .or('category.ilike.%shirt%,category.ilike.%hoodie%,category.ilike.%blazer%,category.ilike.%kurta%')
      .limit(1);
    testMatrix[c]['men_upper'] = menUpper?.[0];

    // Men Lower (trousers, pants, denim, chinos, cargos)
    const { data: menLower } = await supabase
      .from('fashion_catalog')
      .select('id, title, brand, price, image, category, gender')
      .in('country', countryFilter)
      .eq('gender', 'men')
      .or('category.ilike.%trouser%,category.ilike.%pant%,category.ilike.%denim%,category.ilike.%chino%,category.ilike.%cargo%')
      .limit(1);
    testMatrix[c]['men_lower'] = menLower?.[0];

    // Women Upper (tops, kurtis, blouses, shirts, blazers)
    const { data: womenUpper } = await supabase
      .from('fashion_catalog')
      .select('id, title, brand, price, image, category, gender')
      .in('country', countryFilter)
      .eq('gender', 'women')
      .or('category.ilike.%kurti%,category.ilike.%top%,category.ilike.%blouse%,category.ilike.%shirt%,category.ilike.%blazer%')
      .limit(1);
    testMatrix[c]['women_upper'] = womenUpper?.[0];

    // Women Lower (bottoms, palazzos, skirts, wideleg, pants)
    const { data: womenLower } = await supabase
      .from('fashion_catalog')
      .select('id, title, brand, price, image, category, gender')
      .in('country', countryFilter)
      .eq('gender', 'women')
      .or('category.ilike.%bottom%,category.ilike.%skirt%,category.ilike.%wideleg%,category.ilike.%jean%,category.ilike.%dress%')
      .limit(1);
    testMatrix[c]['women_lower'] = womenLower?.[0];

    // Kids Boy (shirts, tees, hoodies, pants)
    const { data: kidsBoy } = await supabase
      .from('fashion_catalog')
      .select('id, title, brand, price, image, category, gender')
      .in('country', countryFilter)
      .eq('gender', 'kids')
      .or('category.ilike.%boy%')
      .limit(1);
    testMatrix[c]['kids_boy'] = kidsBoy?.[0];

    // Kids Girl (dresses, frocks, tops, sweaters)
    const { data: kidsGirl } = await supabase
      .from('fashion_catalog')
      .select('id, title, brand, price, image, category, gender')
      .in('country', countryFilter)
      .eq('gender', 'kids')
      .or('category.ilike.%girl%')
      .limit(1);
    testMatrix[c]['kids_girl'] = kidsGirl?.[0];
  }

  console.log(JSON.stringify(testMatrix, null, 2));
}

findCandidates().catch(console.error);
