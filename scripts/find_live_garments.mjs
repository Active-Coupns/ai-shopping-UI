import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hwdhbzazwxjjgnufgpab.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZGhiemF6d3hqamdudWZncGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5MDAxOTEsImV4cCI6MjEwODQ3NjE5MX0._tZoGxdbR3D7scz2udSrqJLDIMAYoHOsp8MVwqB7x-g';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function isImageValid(url) {
  if (!url || typeof url !== 'string' || !url.startsWith('http')) return false;
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(5000)
    });
    if (!res.ok) return false;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 5000) return false;
    const meta = await sharp(buf).metadata();
    return meta && meta.width > 200 && meta.height > 200;
  } catch (_) {
    return false;
  }
}

async function findLiveProduct(country, gender, categoryQuery, isUpper) {
  const countryFilter = country === 'UK' ? ['UK', 'GB'] : [country];
  const { data } = await supabase
    .from('fashion_catalog')
    .select('id, title, brand, price, image, category, gender')
    .in('country', countryFilter)
    .eq('gender', gender)
    .ilike('category', `%${categoryQuery}%`)
    .limit(15);

  if (!data) return null;

  for (const item of data) {
    if (await isImageValid(item.image)) {
      return {
        ...item,
        category: isUpper ? 'upper_body' : (item.category.includes('dress') || item.category.includes('frock') ? 'dresses' : 'lower_body')
      };
    }
  }
  return null;
}

async function buildVerifiedMatrix() {
  const countries = ['IN', 'US', 'UK', 'CA', 'AU', 'AE'];
  const verified = [];

  for (const c of countries) {
    console.log(`Checking live verified items for ${c}...`);
    // 1. Men Upper
    const menUpper = await findLiveProduct(c, 'men', 'shirt', true) || await findLiveProduct(c, 'men', 'flannel', true) || await findLiveProduct(c, 'men', 'blazer', true);
    // 2. Men Lower
    const menLower = await findLiveProduct(c, 'men', 'chino', false) || await findLiveProduct(c, 'men', 'pant', false) || await findLiveProduct(c, 'men', 'trouser', false) || await findLiveProduct(c, 'men', 'denim', false);
    // 3. Women Upper
    const womenUpper = await findLiveProduct(c, 'women', 'blazer', true) || await findLiveProduct(c, 'women', 'top', true) || await findLiveProduct(c, 'women', 'kurti', true) || await findLiveProduct(c, 'women', 'blouse', true);
    // 4. Women Lower
    const womenLower = await findLiveProduct(c, 'women', 'denim', false) || await findLiveProduct(c, 'women', 'bottom', false) || await findLiveProduct(c, 'women', 'pant', false) || await findLiveProduct(c, 'women', 'skirt', false);
    // 5. Kids Boy
    const kidsBoy = await findLiveProduct(c, 'kids', 'boy', true);
    // 6. Kids Girl
    const kidsGirl = await findLiveProduct(c, 'kids', 'girl', false);

    console.log(`  Men Upper: ${menUpper?.title?.slice(0, 40)} | Valid: ${!!menUpper}`);
    console.log(`  Men Lower: ${menLower?.title?.slice(0, 40)} | Valid: ${!!menLower}`);
    console.log(`  Women Upper: ${womenUpper?.title?.slice(0, 40)} | Valid: ${!!womenUpper}`);
    console.log(`  Women Lower: ${womenLower?.title?.slice(0, 40)} | Valid: ${!!womenLower}`);
    console.log(`  Kids Boy: ${kidsBoy?.title?.slice(0, 40)} | Valid: ${!!kidsBoy}`);
    console.log(`  Kids Girl: ${kidsGirl?.title?.slice(0, 40)} | Valid: ${!!kidsGirl}`);

    verified.push(
      { id: `${c}_men_upper`, country: c, gender: 'men', categoryType: 'Upper Body', categoryLabel: `Men Upper (${c})`, modelKey: 'men', garment: menUpper },
      { id: `${c}_men_lower`, country: c, gender: 'men', categoryType: 'Lower Body', categoryLabel: `Men Lower (${c})`, modelKey: 'men', garment: menLower },
      { id: `${c}_women_upper`, country: c, gender: 'women', categoryType: 'Upper Body', categoryLabel: `Women Upper (${c})`, modelKey: 'women', garment: womenUpper },
      { id: `${c}_women_lower`, country: c, gender: 'women', categoryType: 'Lower Body', categoryLabel: `Women Lower (${c})`, modelKey: 'women', garment: womenLower },
      { id: `${c}_kids_boy`, country: c, gender: 'kids', categoryType: 'Upper Body', categoryLabel: `Kids Boy (${c})`, modelKey: 'kids_boy', garment: kidsBoy },
      { id: `${c}_kids_girl`, country: c, gender: 'kids', categoryType: kidsGirl?.category === 'dresses' ? 'Dress' : 'Lower Body', categoryLabel: `Kids Girl (${c})`, modelKey: 'kids_girl', garment: kidsGirl }
    );
  }

  return verified;
}

buildVerifiedMatrix().then(matrix => {
  import('fs').then(fs => {
    import('path').then(path => {
      const out = path.join('C:\\Users\\ASUS\\.gemini\\antigravity\\scratch\\ai-shopping-assistant', 'scripts', 'verified_test_matrix.json');
      fs.writeFileSync(out, JSON.stringify(matrix, null, 2));
      console.log('✅ Successfully wrote to', out);
    });
  });
}).catch(console.error);
