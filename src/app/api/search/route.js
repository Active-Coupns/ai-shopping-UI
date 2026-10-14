import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { redis } from "@/services/redis";
import { checkUnifiedApiQuota, extractTrustedClientIp } from "@/services/rateLimiter";
import { getAdminSettings } from "@/services/admin";
import { monetizeUrl } from "@/services/affiliate";
import { searchRapidApiProducts, isExactProductQuery, getStoreDirectSearchFallback } from "@/services/rapidapi";
import { addToInventoryPool, consultAiShopkeeper } from "@/services/semanticCache";
import { recordSearchMetric } from "@/services/adminMetrics";

function getCacheKey(country, query) {
  const clean = query
    .toLowerCase()
    .replace(/[^\w\u0900-\u097F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\s/g, "-");
  return `cache:search:v14:${(country || "in").toLowerCase()}:${clean || "default"}`;
}

/**
 * Layer 1: Zero-Latency Multi-Lingual Query Normalization Engine (Hindi, Marathi, Hinglish)
 */
function normalizeMultiLingualQuery(rawQuery) {
  if (!rawQuery) return { normalizedQuery: "", originalQuery: "", isRegional: false, detectedLanguage: "en" };

  const raw = String(rawQuery).trim();
  let query = raw.toLowerCase();
  const hasDevanagari = /[\u0900-\u097F]/.test(query);

  // 1. Strip currencies and punctuation
  query = query.replace(/[₹$€£,]/g, " ");

  // 1b. Common Typo Auto-Correction Engine
  query = query
    .replace(/\blaoptop\b|\blaptap\b|\blabtop\b|\blaptop\b/gi, "laptop")
    .replace(/\bmobaile\b|\bmobail\b|\bphne\b/gi, "mobile")
    .replace(/\bshose\b|\bshue\b/gi, "shoes");

  // 2. Technical specification spacing & unit standardization
  query = query
    .replace(/\b(\d+)\s*(?:gb|tb)\b/gi, "$1gb")
    .replace(/\b(\d+)\s*g\s*(?:ram|rom|storage|ddr\d?)\b/gi, "$1gb")
    .replace(/\b(5)\s*g\b/gi, "5g")
    .replace(/\b(4)\s*g\b/gi, "4g")
    .replace(/\bs\s*(\d{2})\b/gi, "s$1");

  // 3. Devanagari (Hindi & Marathi) translation & cleaning
  const hindiTranslations = [
    { pattern: /सबसे\s+अच्छा|सबसे\s+बढ़िया|अच्छे|अच्छा/g, replacement: "" },
    { pattern: /सबसे\s+सस्ता|सबसे\s+सस्ते|सस्ता|सस्ते/g, replacement: "" },
    { pattern: /ऑनलाइन|कीमत|दाम|रेट|में|का|की|के|पर|दिखाओ|बताओ|चाहिए/g, replacement: "" },
    { pattern: /गेमिंग/g, replacement: "gaming" },
    { pattern: /लैपटॉप/g, replacement: "laptop" },
    { pattern: /मोबाइल|फोन/g, replacement: "mobile" },
    { pattern: /जूते|जूता/g, replacement: "shoes" },
    { pattern: /कपड़े|कपड़ा/g, replacement: "clothes" },
    { pattern: /अगरबत्ती/g, replacement: "incense sticks" },
    { pattern: /घड़ी|स्मार्टवॉच/g, replacement: "smartwatch" },
    { pattern: /टीवी|टेलीविजन/g, replacement: "tv" },
    { pattern: /वाशिंग\s+मशीन/g, replacement: "washing machine" },
    { pattern: /फ्रिज|रेफ्रिजरेटर/g, replacement: "refrigerator" },
    { pattern: /इयरफोन|हेडफोन/g, replacement: "headphones" },
    { pattern: /किताबें|किताब/g, replacement: "books" },
    { pattern: /खिलौने|खिलौना/g, replacement: "toys" },
    { pattern: /चश्मा/g, replacement: "sunglasses" },
    { pattern: /पर्स|वॉलेट/g, replacement: "wallet" },
    { pattern: /साड़ी|साडी/g, replacement: "saree" },
    { pattern: /कुर्ती/g, replacement: "kurti" },
  ];

  const marathiTranslations = [
    { pattern: /सर्वात\s+छान|उत्तम|काढून\s+द्या|पाहिजे/g, replacement: "" },
    { pattern: /कमी\s+किमतीचा|कमी\s+किमतीत|स्वस्त/g, replacement: "" },
    { pattern: /मोबाईल/g, replacement: "mobile" },
    { pattern: /कपडे/g, replacement: "clothes" },
  ];

  let cleaned = query;
  let isRegional = hasDevanagari;
  let detectedLang = hasDevanagari ? "hi" : "en";

  if (hasDevanagari) {
    if (/पाहिजे|आहे|कोणता|कमी\s+किमतीचा|सर्वात/.test(query)) {
      detectedLang = "mr";
      marathiTranslations.forEach(({ pattern, replacement }) => {
        cleaned = cleaned.replace(pattern, replacement);
      });
    }

    hindiTranslations.forEach(({ pattern, replacement }) => {
      cleaned = cleaned.replace(pattern, replacement);
    });

    cleaned = cleaned.replace(/[\u0900-\u097F]+/g, " ").trim();
  } else {
    // Hinglish & English Conversational Noise Removal
    const isHinglish = /\b(sabse|sasta|saste|achha|badiya|chahiye|dikhao|batao|wala|wali|dokan|dukaan)\b/i.test(query);
    if (isHinglish) {
      isRegional = true;
      detectedLang = "hinglish";
    }

    const noisePatterns = [
      /\bsabse\s+achha\b|\bsabse\s+badiya\b|\bachha\b|\bbadiya\b/gi,
      /\bsabse\s+sasta\b|\bsasta\b|\bsaste\b/gi,
      /\bchahiye\b|\bdikhao\b|\bbatao\b|\bwala\b|\bwali\b|\bwaala\b|\bwaali\b/gi,
      /\bbuy\s+online\b|\bonline\b|\bbuy\b|\bpurchase\b/gi,
      /\bprice\s+in\s+india\b|\bprices\s+in\s+india\b|\bprice\s+list\b|\bprice\b|\bprices\b|\bcost\b|\brate\b/gi,
      /\bbest\s+deal\b|\bbest\s+deals\b|\bdeal\b|\bdeals\b|\boffers\b|\boffer\b|\bdiscount\b|\bdiscounts\b/gi,
      /\bin\s+india\b|\bindia\b/gi,
      /\bshow\s+me\b|\bfind\s+me\b|\bgive\s+me\b|\blooking\s+for\b|\bwant\s+to\b/gi,
      /\bcellphone\b|\bcell\s+phone\b|\bsmartphone\b/gi
    ];

    noisePatterns.forEach(pattern => {
      cleaned = cleaned.replace(pattern, " ");
    });

    // Standardize synonyms
    cleaned = cleaned
      .replace(/\bphone\b/gi, "mobile")
      .replace(/\bearphones\b|\bearbuds\b|\bairpods\b|\bheadphone\b/gi, "headphones");
  }

  cleaned = cleaned.replace(/\s+/g, " ").trim();

  // Deduplicate redundant consecutive or repeated words
  if (cleaned) {
    const tokens = cleaned.split(/\s+/);
    cleaned = Array.from(new Set(tokens)).join(" ");
  }

  // Safeguard: If normalization wiped everything out, restore original query
  if (!cleaned) {
    cleaned = raw.replace(/[^\w\u0900-\u097F\s]/g, "").replace(/\s+/g, " ").trim();
  }

  return {
    normalizedQuery: cleaned,
    originalQuery: raw,
    isRegional,
    detectedLanguage: detectedLang
  };
}

export async function POST(request) {
  const searchStartTime = Date.now();
  try {
    // 1. Mandatory Clerk Session Token / Auth State Verification
    let userId = null;
    try {
      const authObj = getAuth(request);
      userId = authObj?.userId || null;
    } catch (clerkErr) {
      userId = null;
    }

    if (!userId && process.env.NODE_ENV === "production") {
      return NextResponse.json({
        products: [],
        coupons: [],
        error: "UNAUTHORIZED",
        message: "Sign-in required to search live deals. Please sign in to continue."
      }, { status: 401 });
    }

    // 1b. Bot & Automated Scraper Defense Shield
    const userAgent = (request.headers.get("user-agent") || "").toLowerCase();
    const isBot = /\b(bot|crawler|spider|scraper|headless|python-requests|postman|insomnia|curl|wget)\b/i.test(userAgent);
    if (isBot) {
      return NextResponse.json({
        products: [],
        coupons: [],
        error: "FORBIDDEN",
        message: "Automated queries are blocked."
      }, { status: 403 });
    }
    const clientIp = extractTrustedClientIp(request);

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ products: [], coupons: [], error: "INVALID_JSON", message: "Invalid JSON request body." }, { status: 400 });
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ products: [], coupons: [], error: "INVALID_PAYLOAD", message: "Request body must be a JSON object." }, { status: 400 });
    }

    const { query, country, isUrlLookup, sourceStore, sourceUrl, isExactLookup } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json({ products: [], error: "Query is required" }, { status: 200 });
    }

    // 2. Zero-Latency Multi-Lingual Query Normalization (Hindi, Marathi, Hinglish, English)
    const { normalizedQuery } = normalizeMultiLingualQuery(query);
    const cleanQuery = normalizedQuery || query.replace(/[₹$€£,]/g, "").replace(/\s+/g, " ").trim();
    const isExactProduct = !!isUrlLookup || !!isExactLookup || !!sourceUrl || isExactProductQuery(cleanQuery);

    // 3. Check Redis Cache First
    const cacheKey = getCacheKey(country, isExactProduct ? `exact:${cleanQuery}` : (normalizedQuery || cleanQuery));
    try {
      const cachedDataStr = await redis.get(cacheKey);
      if (cachedDataStr) {
        let cachedPayload = typeof cachedDataStr === "string" ? JSON.parse(cachedDataStr) : cachedDataStr;
        const hasProducts = Array.isArray(cachedPayload.products) && cachedPayload.products.length > 0;
        const isServiceCoupon = cachedPayload.intent === "SERVICE_COUPON";
        const hasFallbackProducts = hasProducts && cachedPayload.products.some(p => p.id?.startsWith("fallback-") || p.is_catalog_fallback);

        if ((hasProducts && !hasFallbackProducts) || isServiceCoupon) {
          const quotaStatus = await checkUnifiedApiQuota({
            userId,
            clientIp,
            isCacheHit: true,
            limit: 10
          });
          const remainingSearches = quotaStatus.remaining;
          let finalCachedProducts = (isExactProduct && cachedPayload.products) 
            ? cachedPayload.products.slice(0, 1) 
            : (cachedPayload.products || []);

          finalCachedProducts = finalCachedProducts.map(p => {
            const rawL = p.deal_link || p.link || p.affiliateUrl || "";
            if (rawL.includes("google.com") || rawL.includes("ibp=")) {
              const cleanL = getStoreDirectSearchFallback(p.store_name, p.title, country);
              return {
                ...p,
                link: cleanL,
                deal_link: cleanL,
                affiliateUrl: cleanL,
                direct_link: cleanL
              };
            }
            return p;
          });

          if (sourceStore && sourceUrl && finalCachedProducts.length > 0) {
            finalCachedProducts = finalCachedProducts.map(p => {
              const updatedComp = (p.price_comparison || []).map(o => 
                o.store_name?.toLowerCase() === sourceStore.toLowerCase() ? { ...o, deal_link: sourceUrl } : o
              );
              return {
                ...p,
                link: p.store_name?.toLowerCase() === sourceStore.toLowerCase() ? sourceUrl : p.link,
                deal_link: p.store_name?.toLowerCase() === sourceStore.toLowerCase() ? sourceUrl : p.deal_link,
                price_comparison: updatedComp
              };
            });
          }

          // Asynchronously enrich Central Store Inventory Pool from direct cache
          addToInventoryPool(country, finalCachedProducts).catch(() => {});

          // Non-blocking telemetry for Admin monitoring
          recordSearchMetric({
            query: cleanQuery,
            clientIp,
            isCacheHit: true,
            country,
            category: "ecommerce",
            latencyMs: Date.now() - searchStartTime,
            statusCode: 200
          }).catch(() => {});

          return NextResponse.json({
            products: finalCachedProducts,
            coupons: cachedPayload.coupons || [],
            intent: cachedPayload.intent || "E-COMMERCE",
            error: cachedPayload.error || null,
            searchesLeft: remainingSearches,
            fromCache: true
          }, { status: 200 });
        }
      }
    } catch (cacheErr) {
      console.warn("Redis cache read error:", cacheErr);
    }

    // 4. Admin Settings & Coupons
    const settings = await getAdminSettings();
    const userRegion = (country || "IN").toUpperCase();

    // 5. Intent Classification (Service Coupons vs E-Commerce Shopping)
    const serviceKeywords = [
      "coupon", "coupons", "discount", "discounts", "promo", "voucher", "vouchers",
      "zomato", "swiggy", "uber", "ola", "rapido", "makemytrip", "easemytrip", "cleartrip",
      "bookmyshow", "netflix", "spotify", "prime video", "hotstar", "youtube premium"
    ];
    const queryLower = cleanQuery.toLowerCase();
    const isServiceQuery = serviceKeywords.some(keyword => queryLower.includes(keyword));

    if (isServiceQuery) {
      const rawMatched = (settings.coupons || []).filter(coupon => {
        const storeName = (coupon.store || "").toLowerCase();
        const matchesStore = queryLower.includes(storeName) || storeName.includes(queryLower);
        const matchesRegion = coupon.region === userRegion || coupon.region === "GLOBAL";
        return matchesStore && matchesRegion;
      });

      const matchedCoupons = rawMatched.map(coupon => ({
        store_name: coupon.store,
        store: coupon.store,
        code: coupon.code,
        description: coupon.description,
        link: monetizeUrl(coupon.link, coupon.store, userRegion, settings),
        deal_link: monetizeUrl(coupon.link, coupon.store, userRegion, settings),
        region: coupon.region
      }));

      if (matchedCoupons.length === 0) {
        return NextResponse.json({
          products: [],
          coupons: [],
          intent: "SERVICE_COUPON",
          error: "NotAvailable",
          searchesLeft: 10
        }, { status: 200 });
      }

      try {
        await redis.set(cacheKey, JSON.stringify({
          products: [],
          coupons: matchedCoupons,
          intent: "SERVICE_COUPON"
        }), { ex: 21600 });
      } catch (cacheErr) {
        console.warn("Redis cache write error:", cacheErr);
      }

      return NextResponse.json({
        products: [],
        coupons: matchedCoupons,
        intent: "SERVICE_COUPON",
        searchesLeft: 10
      }, { status: 200 });
    }

    // 6. Live Product Search via OpenWebNinja - Consumes 1 credit from Unified 10-Call API Quota
    const quotaResult = await checkUnifiedApiQuota({
      userId,
      clientIp,
      isCacheHit: false,
      limit: 10
    });

    if (!quotaResult.allowed) {
      return NextResponse.json({
        products: [],
        coupons: [],
        error: "QUOTA_EXHAUSTED",
        message: quotaResult.message || "Daily limit reached (10/10 AI operations). Your quota resets tomorrow at 12:00 AM IST!",
        searchesLeft: 0
      }, { status: 429 });
    }

    let cleanProducts = [];
    const fetchLimit = isExactProduct ? 1 : 20;

    try {
      const openWebResults = await searchRapidApiProducts(cleanQuery, fetchLimit, userRegion, isExactProduct, sourceStore, sourceUrl);
      if (Array.isArray(openWebResults) && openWebResults.length > 0) {
        cleanProducts = openWebResults.slice(0, fetchLimit);
      }
    } catch (apiErr) {
      console.warn("[Search Route] OpenWebNinja provider error:", apiErr.message);
    }

    // 7. Match Store Coupons from Admin Settings
    const matchedStoreCoupons = [];
    try {
      (settings.coupons || []).forEach(coupon => {
        const couponStoreLower = (coupon.store || "").toLowerCase().trim();
        const matchesStore = cleanProducts.some(p => {
          const productStoreLower = (p.store_name || "").toLowerCase().trim();
          return productStoreLower.includes(couponStoreLower) || couponStoreLower.includes(productStoreLower);
        });
        const matchesRegion = coupon.region === userRegion || coupon.region === "GLOBAL";
        if (matchesStore && matchesRegion) {
          matchedStoreCoupons.push({
            store_name: coupon.store,
            store: coupon.store,
            code: coupon.code,
            description: coupon.description,
            link: monetizeUrl(coupon.link, coupon.store, userRegion, settings),
            deal_link: monetizeUrl(coupon.link, coupon.store, userRegion, settings),
            region: coupon.region
          });
        }
      });
    } catch (couponMatchErr) {
      console.error("Failed matching store coupons:", couponMatchErr);
    }

    // 8. Save Fresh Search Results to Redis Cache & Cluster Pool (24-Hour Synchronized TTL) - Live deals only
    const hasAnyFallback = cleanProducts.some(p => p.id?.startsWith("fallback-") || p.is_catalog_fallback);
    if (cleanProducts.length >= 1 && !hasAnyFallback) {
      try {
        await Promise.all([
          redis.set(cacheKey, JSON.stringify({ 
            products: cleanProducts,
            coupons: matchedStoreCoupons,
            intent: "E-COMMERCE"
          }), { ex: 86400 }),
          addToInventoryPool(country, cleanProducts)
        ]);
      } catch (cacheWriteErr) {
        console.warn("Redis cache save error:", cacheWriteErr);
      }
    }

    const remainingSearches = quotaResult?.remaining ?? 9;

    // Non-blocking telemetry for Admin monitoring
    recordSearchMetric({
      query: cleanQuery,
      clientIp,
      isCacheHit: false,
      country,
      category: "ecommerce",
      latencyMs: Date.now() - searchStartTime,
      statusCode: 200
    }).catch(() => {});

    return NextResponse.json({
      products: cleanProducts,
      coupons: matchedStoreCoupons,
      intent: "E-COMMERCE",
      searchesLeft: remainingSearches
    }, { status: 200 });

  } catch (err) {
    console.error("Serverless Search API Route error:", err);
    return NextResponse.json({
      products: [],
      coupons: [],
      error: "SERVER_BUSY",
      message: "Zippy servers are experiencing extraordinarily high shopping traffic right now. To ensure price accuracy, please wait a moment or try again in a few seconds."
    }, { status: 200 });
  }
}
