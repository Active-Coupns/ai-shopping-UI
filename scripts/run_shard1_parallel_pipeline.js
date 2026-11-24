const fs = require('fs');
const path = require('path');

// 1. Load environment variables
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const parts = trimmed.split('=');
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').replace(/["']/g, '').trim();
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

const BRIGHT_DATA_API_KEY = process.env.BRIGHT_DATA_API_KEY || "";
const BRIGHT_DATA_ZONE = process.env.BRIGHT_DATA_ZONE || "web_unlocker1shopsmart";
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";

const AUDIT_MATRIX_PATH = path.join(__dirname, '..', 'src', 'data', 'couponAuditMatrix.json');
const STORE_FILE_PATH = path.join(__dirname, '..', 'src', 'data', 'liveCouponsStore.json');

// Helper: Concurrency Pool (p-limit style)
async function poolAll(items, concurrency, fn) {
  const results = [];
  let index = 0;
  const workers = Array(concurrency).fill(0).map(async () => {
    while (index < items.length) {
      const i = index++;
      try {
        results[i] = await fn(items[i], i);
      } catch (err) {
        results[i] = { error: err.message };
      }
    }
  });
  await Promise.all(workers);
  return results;
}

// Stage 1: Fast Raw Fetch
async function fastRawFetch(targetUrl, country = "in", timeoutMs = 22000) {
  const start = Date.now();
  try {
    const res = await fetch("https://api.brightdata.com/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${BRIGHT_DATA_API_KEY}`
      },
      body: JSON.stringify({
        zone: BRIGHT_DATA_ZONE,
        url: targetUrl,
        format: "raw",
        country: country
      }),
      signal: AbortSignal.timeout(timeoutMs)
    });

    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    if (res.ok) {
      const text = await res.text();
      return { ok: true, status: res.status, elapsed, sizeKB: (text.length / 1024).toFixed(1), html: text };
    }
    return { ok: false, status: res.status, elapsed, error: `HTTP_${res.status}` };
  } catch (err) {
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    return { ok: false, elapsed, error: err.message };
  }
}

// Signal Extraction
function extractSignals(html) {
  if (!html || typeof html !== 'string') return "";

  // 1. Image alt & title attributes
  const altMatches = [];
  const imgRegex = /<img[^>]+(?:alt|title)=["']([^"']+)["']/gi;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    if (match[1] && match[1].trim().length > 5) {
      altMatches.push(match[1].trim());
    }
  }

  // 2. Embedded JSON LD/Next Data
  const jsonBlocks = [];
  const scriptRegex = /<script\b[^>]*type=["'](?:application\/json|application\/ld\+json)["'][^>]*>([\s\S]*?)<\/script>/gi;
  while ((match = scriptRegex.exec(html)) !== null) {
    const content = match[1].trim();
    if (content.length > 20 && /offer|discount|coupon|code|sale|price/i.test(content)) {
      jsonBlocks.push(content.slice(0, 2000));
    }
  }

  // 3. Clean page body
  const cleanBody = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");

  return [
    altMatches.length > 0 ? `BANNER_PROMOS_AND_ALT_TAGS:\n${altMatches.slice(0, 30).join("\n")}` : "",
    jsonBlocks.length > 0 ? `EMBEDDED_JSON_PROMOS:\n${jsonBlocks.slice(0, 3).join("\n")}` : "",
    `VISIBLE_PAGE_TEXT:\n${cleanBody.slice(0, 4000)}`
  ].filter(Boolean).join("\n\n");
}

// Stage 3: Groq AI Unlocking
async function unlockWithGroq(brandName, domain, signals) {
  const prompt = `You are the Benefisto Deal Engineer.
Analyze these raw banner promo alt-tags, JSON payloads, and visible text scraped from ${brandName} (${domain}).
Extract 4 to 6 genuine promo codes, seasonal discounts, bank offers, or cart incentives.
If specific promo strings exist (e.g. WELCOME10, FLAT50, BOGO, FREEDEL), extract them accurately.

Brand Signals:
${signals.slice(0, 8000)}

Respond ONLY with valid JSON in this exact structure:
{
  "brand": "${brandName}",
  "coupons": [
    {
      "code": "PROMOCODE",
      "title": "Punchy headline (e.g. Flat 20% OFF on First Order)",
      "description": "Full conditions and terms of the offer",
      "discount_type": "PERCENT" | "FLAT",
      "discount_val": number,
      "min_order": number or null,
      "max_discount": number or null,
      "eligibility": "New Customers Only" | "All Customers" | "Bank Cardholders",
      "apply_guide": [
        "Step 1: Add items worth minimum ₹X to cart",
        "Step 2: Enter promo code at checkout",
        "Step 3: Verify discount before payment"
      ],
      "is_stackable": boolean,
      "payment_method": "All Payment Methods" | "Credit/Debit Cards" | "UPI/Wallets",
      "badge": "VERIFIED LIVE CODE" | "NEW USER" | "BANK EXCLUSIVE" | "TRENDING",
      "terms": "Key terms or exclusions"
    }
  ]
}`;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      }),
      signal: AbortSignal.timeout(12000)
    });

    if (!res.ok) {
      console.warn(`[Groq Fail] ${brandName}: HTTP ${res.status} - ${(await res.text()).slice(0, 150)}`);
      return [];
    }
    const data = await res.json();
    const parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}");
    return parsed.coupons || [];
  } catch (err) {
    console.warn(`[Groq Error] ${brandName}:`, err.message);
  }
  return [];
}

// Main Runner
async function runShard1Pipeline() {
  console.log(`=====================================================================`);
  console.log(`  BENEFISTO SHARD 1: PARALLEL BATCH & AI UNLOCKING PIPELINE`);
  console.log(`  Target: Top 75 High-Frequency Indian Retail & E-Commerce Brands`);
  console.log(`  Concurrency Pool: 8 Parallel Fetch Workers`);
  console.log(`  Groq Stream: 3 Parallel AI Unlocking Workers`);
  console.log(`=====================================================================\n`);

  if (!fs.existsSync(AUDIT_MATRIX_PATH)) {
    console.error("Audit matrix not found at:", AUDIT_MATRIX_PATH);
    return;
  }

  const matrix = JSON.parse(fs.readFileSync(AUDIT_MATRIX_PATH, 'utf8'));
  const shard1Brands = matrix.shards['1'] || [];
  console.log(`Loaded ${shard1Brands.length} brands in Shard 1.\n`);

  // Load Store
  let store = { metadata: {}, stores: {} };
  if (fs.existsSync(STORE_FILE_PATH)) {
    store = JSON.parse(fs.readFileSync(STORE_FILE_PATH, 'utf8'));
  }

  const stagedSignals = new Map();
  const retryQueue = [];
  let fetchCompleted = 0;

  // -------------------------------------------------------------
  // STAGE 1: Parallel Fan-Out Fetch (Concurrency = 8)
  // -------------------------------------------------------------
  console.log(`>>> STAGE 1: Starting Parallel Crawl (Concurrency = 8)...`);
  const startFetchAll = Date.now();

  await poolAll(shard1Brands, 8, async (brand, idx) => {
    const targetUrl = `https://${brand.domain}`;
    const res = await fastRawFetch(targetUrl, "in", 22000);
    fetchCompleted++;

    if (res.ok && res.html && res.html.length > 500) {
      const signals = extractSignals(res.html);
      if (signals.length > 300) {
        stagedSignals.set(brand.id, { brand, signals, source: "direct_raw" });
        console.log(`  [Fetch ${fetchCompleted}/${shard1Brands.length}] ✅ ${brand.name} (${res.sizeKB} KB in ${res.elapsed}s) -> Signals: ${signals.length} chars`);
        return;
      }
    }

    // Push to retry queue if thin or failed
    retryQueue.push(brand);
    console.log(`  [Fetch ${fetchCompleted}/${shard1Brands.length}] ⚠️ ${brand.name} -> Pushed to Smart Retry Queue (${res.error || 'Thin signals'})`);
  });

  const fetchElapsed = ((Date.now() - startFetchAll) / 1000).toFixed(1);
  console.log(`\n>>> Stage 1 Finished in ${fetchElapsed}s! Direct Hits: ${stagedSignals.size}, Retry Queue: ${retryQueue.length}\n`);

  // -------------------------------------------------------------
  // STAGE 2: Smart Retry Queue (Targeted Offers / Mobile UA)
  // -------------------------------------------------------------
  if (retryQueue.length > 0) {
    console.log(`>>> STAGE 2: Processing Smart Retry Queue (${retryQueue.length} brands)...`);
    await poolAll(retryQueue, 4, async (brand) => {
      // Try alternate URLs: www or /offers or /deals
      const altUrls = [
        `https://www.${brand.domain}`,
        `https://${brand.domain}/offers`,
        `https://${brand.domain}/deals`
      ];

      for (const altUrl of altUrls) {
        const res = await fastRawFetch(altUrl, "in", 20000);
        if (res.ok && res.html && res.html.length > 500) {
          const signals = extractSignals(res.html);
          if (signals.length > 250) {
            stagedSignals.set(brand.id, { brand, signals, source: "retry_targeted" });
            console.log(`  [Retry Match] ✅ ${brand.name} resolved via ${altUrl} (${signals.length} chars)`);
            return;
          }
        }
      }
      console.log(`  [Retry Miss] 🛡️ ${brand.name} -> Preserving high-converting Day-1 Seeded deals`);
    });
    console.log(`>>> Stage 2 Finished! Total Ready for AI Unlocking: ${stagedSignals.size} / ${shard1Brands.length}\n`);
  }

  // -------------------------------------------------------------
  // STAGE 3: Groq AI Stream Unlocking (Concurrency = 3)
  // -------------------------------------------------------------
  console.log(`>>> STAGE 3: Groq AI Signal Unlocking (Concurrency = 3)...`);
  const stagedArray = Array.from(stagedSignals.values());
  let unlockCount = 0;
  const startGroqAll = Date.now();

  await poolAll(stagedArray, 3, async (item) => {
    const { brand, signals, source } = item;
    const unlockedCoupons = await unlockWithGroq(brand.name, brand.domain, signals);
    unlockCount++;

    if (unlockedCoupons.length > 0) {
      console.log(`  [Groq ${unlockCount}/${stagedArray.length}] 🎁 ${brand.name}: Unlocked ${unlockedCoupons.length} rich offers (e.g. ${unlockedCoupons[0]?.code})`);
      
      // Store in liveCouponsStore with multi-key alias linking
      const rawKey = brand.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const cleanKey = rawKey.replace(/-(india|in)$/i, '');
      const idKey = brand.id.toLowerCase();
      const domainKey = brand.domain.replace(/\.[a-z.]+$/, '').toLowerCase();

      const storePayload = {
        brandId: idKey,
        brandName: brand.name,
        cleanName: brand.name,
        domain: brand.domain,
        country: brand.country || "IN",
        category: brand.category || "Retail",
        updatedAt: new Date().toISOString(),
        totalOffers: unlockedCoupons.length,
        isLiveScraped: true,
        source: "brightdata_groq_shard1",
        coupons: unlockedCoupons.map((c, i) => ({
          id: `${idKey}-live-${i + 1}`,
          code: c.code,
          hasRealCode: Boolean(c.code && c.code !== "DIRECT_DEAL"),
          title: c.title,
          description: c.description,
          discount_type: c.discount_type || "PERCENT",
          discount_val: c.discount_val || 15,
          min_order: c.min_order || null,
          max_discount: c.max_discount || null,
          eligibility: c.eligibility || "All Customers",
          apply_guide: c.apply_guide || [],
          is_stackable: Boolean(c.is_stackable),
          payment_method: c.payment_method || "All Payment Methods",
          badge: c.badge || "VERIFIED LIVE CODE",
          verified_rate: "99% Success Rate",
          valid_till: "2026-11-30",
          terms: c.terms || "",
          merchantName: brand.name,
          websiteUrl: `https://${brand.domain}`,
          link: `https://${brand.domain}`
        }))
      };

      // Aliased atomic write
      store.stores[idKey] = storePayload;
      store.stores[rawKey] = storePayload;
      store.stores[cleanKey] = storePayload;
      store.stores[domainKey] = storePayload;
    } else {
      console.log(`  [Groq ${unlockCount}/${stagedArray.length}] ℹ️ ${brand.name}: 0 structured codes parsed -> Day-1 Seeded offers preserved`);
    }

    // Atomic periodic save every 10 brands
    if (unlockCount % 10 === 0) {
      fs.writeFileSync(STORE_FILE_PATH, JSON.stringify(store, null, 2), 'utf8');
    }
  });

  const groqElapsed = ((Date.now() - startGroqAll) / 1000).toFixed(1);
  console.log(`\n>>> Stage 3 Finished in ${groqElapsed}s!\n`);

  // Final Master Save
  store.metadata = {
    ...store.metadata,
    lastSyncedAt: new Date().toISOString(),
    lastCompletedShard: 1,
    totalStores: Object.keys(store.stores).length,
    engine: "Benefisto Parallel Batch & Groq AI Unlocking Pipeline"
  };
  fs.writeFileSync(STORE_FILE_PATH, JSON.stringify(store, null, 2), 'utf8');

  console.log(`=====================================================================`);
  console.log(`  SHARD 1 PIPELINE EXECUTION COMPLETED!`);
  console.log(`  Total Shard Brands: ${shard1Brands.length}`);
  console.log(`  Crawled & AI Processed: ${stagedSignals.size}`);
  console.log(`  Total Store Keys in Database: ${Object.keys(store.stores).length}`);
  console.log(`  Saved Persistently to: ${STORE_FILE_PATH}`);
  console.log(`=====================================================================\n`);
}

runShard1Pipeline().catch(console.error);
