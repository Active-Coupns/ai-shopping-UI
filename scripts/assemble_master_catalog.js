const fs = require('fs');
const path = require('path');

const inBrands = JSON.parse(fs.readFileSync(path.join(__dirname, 'in_brands.json'), 'utf8'));

const usBase = JSON.parse(fs.readFileSync(path.join(__dirname, 'us_brands.json'), 'utf8'));
const usExtras = [
  { id: "patagonia", name: "Patagonia", category: "Outdoor & Sustainable Apparel", catGroup: "fashion", domain: "patagonia.com", logo: "🏔️", color: "from-amber-800 to-stone-900", bestOffer: "Worn Wear Recycled Savings", tagline: "Built To Protect Our Home Planet" },
  { id: "hoka", name: "HOKA", category: "Max Cushion Running Shoes", catGroup: "fashion", domain: "hoka.com", logo: "👟", color: "from-blue-600 to-cyan-600", bestOffer: "Clifton & Bondi Free Shipping", tagline: "Fly Human Fly" },
  { id: "chewy", name: "Chewy", category: "Pet Food & Medications", catGroup: "retail", domain: "chewy.com", logo: "🐶", color: "from-blue-600 to-indigo-700", bestOffer: "Autoship Extra 35% First Order", tagline: "Where Pet Lovers Shop" },
  { id: "carhartt", name: "Carhartt", category: "Rugged Workwear & Jackets", catGroup: "fashion", domain: "carhartt.com", logo: "🧥", color: "from-amber-700 to-stone-900", bestOffer: "Groundbreakers Loyalty Free Ship", tagline: "Outworking Them All Since 1889" },
  { id: "vans-us", name: "Vans", category: "Skate Shoes & Classics", catGroup: "fashion", domain: "vans.com", logo: "🛹", color: "from-red-600 to-black", bestOffer: "Vans Family First Order Points", tagline: "Off the Wall Since 1966" }
];
const usBrands = [...usBase, ...usExtras];

const gbBrands = JSON.parse(fs.readFileSync(path.join(__dirname, 'gb_brands.json'), 'utf8'));
const caBrands = JSON.parse(fs.readFileSync(path.join(__dirname, 'ca_brands.json'), 'utf8'));
const auBrands = JSON.parse(fs.readFileSync(path.join(__dirname, 'au_brands.json'), 'utf8'));
const aeBrands = JSON.parse(fs.readFileSync(path.join(__dirname, 'ae_brands.json'), 'utf8'));

console.log('Final Verification of Counts:');
console.log('IN:', inBrands.length);
console.log('US:', usBrands.length);
console.log('GB:', gbBrands.length);
console.log('CA:', caBrands.length);
console.log('AU:', auBrands.length);
console.log('AE:', aeBrands.length);

const targetFile = path.join(__dirname, '..', 'src', 'data', 'countryBrandsCatalog.js');

const fileHeader = `/**
 * Benefisto AI — Master Multi-Country Top 100 Power Brands Registry
 * 
 * Curates the definitive Top 100 high-intent consumer merchants for each of our 6 supported markets:
 * 🇮🇳 India (IN) - 100 Brands
 * 🇺🇸 United States (US) - 100 Brands
 * 🇬🇧 United Kingdom (GB) - 100 Brands
 * 🇨🇦 Canada (CA) - 100 Brands
 * 🇦🇺 Australia (AU) - 100 Brands
 * 🇦🇪 United Arab Emirates (AE) - 100 Brands
 * 
 * Total: 600 Core Market Anchor Brands.
 */

export const COUNTRY_TOP_BRANDS = {
  IN: ${JSON.stringify(inBrands, null, 2)},
  US: ${JSON.stringify(usBrands, null, 2)},
  GB: ${JSON.stringify(gbBrands, null, 2)},
  CA: ${JSON.stringify(caBrands, null, 2)},
  AU: ${JSON.stringify(auBrands, null, 2)},
  AE: ${JSON.stringify(aeBrands, null, 2)}
};

/**
 * Helper to fetch curated top anchor brands for any country
 * @param {string} countryCode - 'IN' | 'US' | 'GB' | 'CA' | 'AU' | 'AE'
 * @returns {Array} Array of 100 brand objects
 */
export function getTopBrandsForCountry(countryCode = "IN") {
  const code = (countryCode || "IN").toUpperCase();
  return COUNTRY_TOP_BRANDS[code] || COUNTRY_TOP_BRANDS.IN;
}

/**
 * Helper to find a specific brand by ID or name across all countries
 * @param {string} query - store id or name
 * @param {string} countryCode - 'IN' | 'US' | 'GB' | 'CA' | 'AU' | 'AE'
 * @returns {Object|null}
 */
export function findBrandInCatalog(query = "", countryCode = "IN") {
  if (!query) return null;
  const brands = getTopBrandsForCountry(countryCode);
  const qLower = query.toLowerCase().trim();
  return brands.find(b => 
    b.id.toLowerCase() === qLower || 
    b.name.toLowerCase() === qLower ||
    b.name.toLowerCase().includes(qLower) ||
    (b.domain && b.domain.toLowerCase().includes(qLower))
  ) || null;
}
`;

fs.writeFileSync(targetFile, fileHeader, 'utf8');
console.log('Successfully written to', targetFile);
