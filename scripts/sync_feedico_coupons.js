import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchFeedicoCoupons } from '../src/services/feedicoService.js';
import { COUNTRY_TOP_BRANDS } from '../src/data/countryBrandsCatalog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORE_PATH = path.join(__dirname, '../src/data/liveCouponsStore.json');

// List of high-priority anchor brands across IN, US, GB, CA, AU, AE
const PRIORITY_BRANDS = [
  // India
  "Nike", "Adidas", "Puma", "Samsung", "Dell", "Hostinger", "NordVPN",
  "Amazon", "Flipkart", "Myntra", "Ajio", "Nykaa", "Croma", "Zomato", "Swiggy",
  "Domino's", "Lenskart", "Mamaearth", "boAt", "Noise", "Tata CLiQ",
  // US & Global
  "Apple", "Walmart", "Target", "Best Buy", "Home Depot", "Macy's", "Kohl's",
  "Sephora", "Ulta Beauty", "ASOS", "Zara", "H&M", "Gymshark", "Lululemon",
  "Shein", "Gap", "Old Navy", "Under Armour", "Reebok", "New Balance",
  "Lenovo", "HP", "Canon", "GoPro", "Coursera", "Udemy",
  // UK / Europe
  "Currys", "Argos", "Boots", "John Lewis", "Marks & Spencer", "Next",
  // Middle East / UAE
  "Noon", "Sharaf DG", "Namshi", "Carrefour", "Lulu Hypermarket",
  // Australia & Canada
  "The Iconic", "Cotton On", "JB Hi-Fi", "Bunnings", "Canadian Tire", "Roots", "Hudson's Bay"
];

async function syncCoupons() {
  console.log(`Starting Feedico coupon sync for ${PRIORITY_BRANDS.length} priority brands...`);
  const store = {};
  let totalFound = 0;

  // Process in small batches of 3 to avoid hammering the endpoint
  const batchSize = 3;
  for (let i = 0; i < PRIORITY_BRANDS.length; i += batchSize) {
    const batch = PRIORITY_BRANDS.slice(i, i + batchSize);
    
    await Promise.all(batch.map(async (brandName) => {
      try {
        const cleanQuery = brandName.split(" ")[0]; // Clean search query
        const res = await fetchFeedicoCoupons({ query: cleanQuery, pageSize: 10 });
        if (res.success && res.coupons && res.coupons.length > 0) {
          const key = brandName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          store[key] = {
            brandName,
            updatedAt: new Date().toISOString(),
            totalOffers: res.coupons.length,
            coupons: res.coupons
          };
          totalFound += res.coupons.length;
          console.log(`  [Synced] ${brandName}: ${res.coupons.length} active coupons`);
        } else {
          console.log(`  [No deals] ${brandName}: 0 Feedico coupons right now`);
        }
      } catch (err) {
        console.warn(`  [Error] ${brandName}:`, err.message);
      }
    }));

    // Polite pause between batches
    await new Promise(r => setTimeout(r, 200));
  }

  const payload = {
    metadata: {
      lastSyncedAt: new Date().toISOString(),
      totalBrandsSynced: Object.keys(store).length,
      totalCouponsStored: totalFound,
      provider: "Feedico Partner Hub"
    },
    stores: store
  };

  fs.writeFileSync(STORE_PATH, JSON.stringify(payload, null, 2), 'utf8');
  console.log(`\nSync complete! Saved ${totalFound} coupons across ${Object.keys(store).length} brands to src/data/liveCouponsStore.json`);
}

syncCoupons();
