const fs = require('fs');
const path = require('path');

const FEEDICO_PARTNER_TOKEN = process.env.FEEDICO_PARTNER_TOKEN || "fdcp_3d1fb99ed3d71a5396094bb85e5fa5825660ff343d803bf586e2fef9832614d3";
const FEEDICO_BASE_URL = "https://partner.feedico.io";

const catalog = require('../src/data/countryBrandsCatalog.js');

function cleanBrandName(rawName) {
  if (!rawName) return "";
  return rawName
    .replace(/\s+(India|UK|Canada|Australia|UAE)$/i, '')
    .replace(/\s+(Online|Official|Store|Direct)$/i, '')
    .trim();
}

async function checkFeedico(brandName, countryCode) {
  const clean = cleanBrandName(brandName);
  const queries = clean !== brandName ? [clean, brandName] : [clean];

  for (const q of queries) {
    try {
      const payload = {
        page: 1,
        pageSize: 5,
        q: q,
        countries: [countryCode.toUpperCase(), "WW"]
      };

      const res = await fetch(`${FEEDICO_BASE_URL}/api/catalog/coupons`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${FEEDICO_PARTNER_TOKEN}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(4000)
      });

      if (res.ok) {
        const data = await res.json();
        const coupons = Array.isArray(data?.coupons) ? data.coupons : [];
        if (coupons.length > 0) {
          return { supported: true, count: coupons.length, matchedQuery: q };
        }
      }
    } catch (e) {
      // Ignore network timeout
    }
  }
  return { supported: false, count: 0 };
}

async function runAudit() {
  const countries = ['IN', 'US', 'GB', 'CA', 'AU', 'AE'];
  console.log(`Starting Phase 1 Full 600-Brand Audit across ${countries.join(', ')}...`);

  const results = {
    auditedAt: new Date().toISOString(),
    totalBrandsAudited: 0,
    totalFeedicoSupported: 0,
    totalScrapingRequired: 0,
    countries: {}
  };

  const allScrapingBrands = [];

  for (const country of countries) {
    const brandList = catalog.COUNTRY_TOP_BRANDS[country] || [];
    console.log(`\nAuditing [${country}] (${brandList.length} brands)...`);
    
    results.countries[country] = {
      total: brandList.length,
      feedicoSupported: [],
      scrapingRequired: []
    };

    // Run in concurrency batches of 5 to be fast and respectful
    const batchSize = 5;
    for (let i = 0; i < brandList.length; i += batchSize) {
      const batch = brandList.slice(i, i + batchSize);
      await Promise.all(batch.map(async (b) => {
        const check = await checkFeedico(b.name, country);
        if (check.supported) {
          results.countries[country].feedicoSupported.push({
            id: b.id,
            name: b.name,
            domain: b.domain,
            category: b.category,
            feedicoCount: check.count,
            matchedQuery: check.matchedQuery
          });
        } else {
          const item = {
            id: b.id,
            name: b.name,
            cleanName: cleanBrandName(b.name),
            domain: b.domain,
            category: b.category,
            country: country
          };
          results.countries[country].scrapingRequired.push(item);
          allScrapingBrands.push(item);
        }
      }));

      // Short delay between batches
      if (i + batchSize < brandList.length) {
        await new Promise(r => setTimeout(r, 120));
      }
    }

    const supCount = results.countries[country].feedicoSupported.length;
    const reqCount = results.countries[country].scrapingRequired.length;
    console.log(`[${country}] Summary: Feedico Supported: ${supCount} | Scraping Required: ${reqCount}`);
  }

  // Calculate totals
  for (const country of countries) {
    results.totalBrandsAudited += results.countries[country].total;
    results.totalFeedicoSupported += results.countries[country].feedicoSupported.length;
    results.totalScrapingRequired += results.countries[country].scrapingRequired.length;
  }

  // Partition allScrapingBrands into 6 Shards (Day 1 - Monday to Day 6 - Saturday)
  const shardCount = 6;
  results.shards = {
    1: [], // Monday
    2: [], // Tuesday
    3: [], // Wednesday
    4: [], // Thursday
    5: [], // Friday
    6: []  // Saturday
  };

  allScrapingBrands.forEach((brand, index) => {
    const shardIndex = (index % shardCount) + 1;
    brand.shardId = shardIndex;
    results.shards[shardIndex].push(brand);
  });

  // Save audit matrix to file
  const outPath = path.join(__dirname, '..', 'src', 'data', 'couponAuditMatrix.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\nAudit successfully completed and saved to: ${outPath}`);
  console.log(`\n=== FINAL AUDIT MATRIX ===`);
  console.log(`Total Brands: ${results.totalBrandsAudited}`);
  console.log(`Feedico Active: ${results.totalFeedicoSupported} (${Math.round((results.totalFeedicoSupported / results.totalBrandsAudited) * 100)}%)`);
  console.log(`Scraping Shards: ${results.totalScrapingRequired} (${Math.round((results.totalScrapingRequired / results.totalBrandsAudited) * 100)}%)`);
  console.log(`Shard Distribution (Mon-Sat):`);
  for (let s = 1; s <= 6; s++) {
    console.log(`  Shard ${s}: ${results.shards[s].length} brands`);
  }
}

runAudit();
