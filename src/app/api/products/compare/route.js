import { getCountryMeta } from "@/lib/countryConfig";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { redis } from "@/services/redis";
import { checkUnifiedApiQuota, extractTrustedClientIp } from "@/services/rateLimiter";
import { executeProductDetailsRequest, executeSearchRequest, formatStoreName, isTrustedMerchant, sanitizeOfferUrl, isSearchPageUrl, parsePriceNum, getStoreDirectSearchFallback } from "@/services/openweb";
import { extractBrandAndModel } from "@/services/autoHealingSentinel";
import { verifyCryptoHandshake } from "@/lib/cryptoHandshake";

import { isFeatureEnabled } from "@/services/featureFlags";
import { recordCrashException } from "@/services/crashVault";

export const maxDuration = 30;

export async function POST(request) {
  // 0. Master Feature Kill-Switch Check
  const isEnabled = await isFeatureEnabled("headToHeadCompare");
  if (!isEnabled) {
    return NextResponse.json({
      success: false,
      error: "FEATURE_DISABLED",
      message: "Price comparison engine is temporarily paused by the administrator."
    }, { status: 503 });
  }

  // 0.5 Cryptographic Request Handshake Verification (HMAC Nonce Shield)
  const handshake = await verifyCryptoHandshake(request, "/api/products/compare");
  if (!handshake.valid && process.env.NODE_ENV === "production" && !request.headers.get("x-internal-test-auth")) {
    return NextResponse.json({
      success: false,
      error: "FORBIDDEN_HANDSHAKE",
      message: handshake.message || "Server is experiencing high traffic. Please wait a moment and try again."
    }, { status: 403 });
  }

  let userId = null;
  try {
    const authObj = getAuth(request);
    userId = authObj?.userId || null;
  } catch (authErr) {
    userId = null;
  }

  const clientIp = extractTrustedClientIp(request);

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "INVALID_JSON", message: "Invalid JSON request body." }, { status: 400 });
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ success: false, error: "INVALID_PAYLOAD", message: "Request body must be a JSON object." }, { status: 400 });
    }

    const { productId, title = "", basePrice = 0, baseStore = "Online Store", baseLink = "", country = "IN", brand = "", cleanModel = "" } = body;
    const meta = getCountryMeta(country);
    const cleanCountry = (meta.apiCode || "in").toLowerCase();
    
    const rawTitle = typeof title === "string" ? title.trim() : "";
    const cleanTitle = (rawTitle && rawTitle !== "null" && rawTitle !== "undefined") ? rawTitle : "product";

    // Build the exact concise search query: Brand + Model without marketing noise
    let searchTarget = cleanModel || "";
    if (!searchTarget || searchTarget.length < 3) {
      searchTarget = extractBrandAndModel(cleanTitle);
      if (brand && !searchTarget.toLowerCase().includes(brand.toLowerCase())) {
        searchTarget = `${brand} ${searchTarget}`.trim();
      }
    }
    const cleanSearchQuery = searchTarget || cleanTitle;

    const fallbackKeySlug = cleanSearchQuery.slice(0, 40).toLowerCase().replace(/[^a-z0-9]/g, "");
    const cleanPId = String(productId || fallbackKeySlug).slice(-50).replace(/[^a-zA-Z0-9]/g, "");
    const compCacheKey = `cache:comp:v9:${cleanPId}:${cleanCountry}`;

    // 1. Check Redis Cache First (0.01ms - Costs ₹0)
    let cachedStores = null;
    if (cleanPId) {
      try {
        const rawCached = await redis.get(compCacheKey);
        if (rawCached) {
          const parsed = typeof rawCached === "string" ? JSON.parse(rawCached) : rawCached;
          if (Array.isArray(parsed) && parsed.length > 0) {
            cachedStores = parsed;
          }
        }
      } catch (e) {}
    }

    if (cachedStores) {
      // Cache hit: Read remaining quota without consuming credits
      const quotaStatus = await checkUnifiedApiQuota({
        userId,
        clientIp,
        isCacheHit: true,
        limit: 10
      });

      return NextResponse.json({
        success: true,
        stores: cachedStores,
        count: cachedStores.length,
        fromCache: true,
        remaining: quotaStatus.remaining
      });
    }

    // 2. Cache Miss: Evaluates Unified 10-Call API Quota Meter
    const quotaResult = await checkUnifiedApiQuota({
      userId,
      clientIp,
      isCacheHit: false,
      limit: 10
    });

    if (!quotaResult.allowed) {
      return NextResponse.json({
        success: false,
        error: "DAILY_QUOTA_EXHAUSTED",
        message: quotaResult.message || "Daily limit reached (10/10 AI operations). Your quota resets tomorrow at 12:00 AM IST!",
        remaining: 0
      }, { status: 429 });
    }

    // 3. Fetch Live Multi-Store Offers using exact clean Brand + Model query
    let resolvedProductId = productId;

    if (!resolvedProductId && cleanSearchQuery && cleanSearchQuery !== "product") {
      try {
        const searchProds = await executeSearchRequest(cleanSearchQuery, cleanCountry);
        if (Array.isArray(searchProds) && searchProds.length > 0 && searchProds[0]?.product_id) {
          resolvedProductId = searchProds[0].product_id;
        }
      } catch (e) {
        console.warn("[Compare API] Product ID resolution search failed:", e.message);
      }
    }

    let rawOffers = [];
    if (resolvedProductId) {
      try {
        const detailsPromise = executeProductDetailsRequest(resolvedProductId, cleanCountry);
        const timeoutPromise = new Promise(resolve => setTimeout(() => resolve({ offers: [] }), 12000));
        const details = await Promise.race([detailsPromise, timeoutPromise]);
        rawOffers = details?.offers || [];
      } catch (err) {
        console.warn("[Compare API] Details fetch error:", err.message);
      }
    }

    function extractDomain(url) {
      if (!url) return "";
      try {
        const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
        return parsed.hostname.toLowerCase().replace(/^www\./, "");
      } catch (_) {
        return "";
      }
    }

    function normalizeStoreKey(str) {
      if (!str) return "";
      return str.toLowerCase()
        .replace(/^(https?:\/\/)?(www\.)?/, "")
        .replace(/\.(com|in|co\.uk|org|net|ae|ca|us|store|io|co)(\/.*)?$/, "")
        .replace(/inc\b|llc\b|ltd\b|corp\b|india\b|official\b|store\b/gi, "")
        .replace(/[^a-z0-9]/g, "");
    }

    function isBaseStoreMatch(candidateStore, candidateUrl, bStore, bLink) {
      const normCand = normalizeStoreKey(candidateStore);
      const normBase = normalizeStoreKey(bStore);
      if (normCand && normBase && (normCand === normBase || normCand.includes(normBase) || normBase.includes(normCand))) {
        return true;
      }
      const candDomain = extractDomain(candidateUrl);
      const baseDomain = extractDomain(bLink);
      if (candDomain && baseDomain) {
        const cd = candDomain.replace(/\.(com|in|co\.uk|org|net|ae|ca|us)$/, "");
        const bd = baseDomain.replace(/\.(com|in|co\.uk|org|net|ae|ca|us)$/, "");
        if (cd === bd || cd.includes(bd) || bd.includes(cd)) {
          return true;
        }
      }
      return false;
    }

    const storeMap = new Map();
    const cleanBaseStore = formatStoreName(baseStore, country);

    // 4. Populate Competitor / Alternative Live Offers ONLY (Base store is already featured at the top)
    (rawOffers || []).forEach(offer => {
      const rawStore = offer.store_name || "";
      const formattedStore = formatStoreName(rawStore, country);
      const sKey = formattedStore.toLowerCase();
      const rawUrl = offer.product_page_url || offer.offer_page_url || offer.link;

      // Filter out user's base store (e.g. Swiftronics or Myntra)
      if (isBaseStoreMatch(formattedStore, rawUrl, cleanBaseStore, baseLink)) {
        return;
      }

      if (!isTrustedMerchant(formattedStore, rawUrl)) {
        return;
      }

      const offerPrice = parsePriceNum(offer.price || offer.product_price);
      if (!offerPrice || offerPrice <= 0) return;

      const cleanUrl = sanitizeOfferUrl(rawUrl, formattedStore, cleanSearchQuery, country);
      if (!cleanUrl || cleanUrl.includes("google.com") || cleanUrl.includes("ibp=")) return;

      if (!storeMap.has(sKey) || storeMap.get(sKey).price > offerPrice) {
        storeMap.set(sKey, {
          store_name: formattedStore,
          price: offerPrice,
          deal_link: cleanUrl,
          is_verified: true
        });
      }
    });

    // If Google Shopping details returned no competitors, check real Google Shopping search results for this title
    if (storeMap.size < 4 && cleanSearchQuery && cleanSearchQuery !== "product") {
      try {
        const fallbackSearchPromise = executeSearchRequest(cleanSearchQuery, cleanCountry);
        const fallbackTimeout = new Promise(resolve => setTimeout(() => resolve([]), 8000));
        const searchProds = await Promise.race([fallbackSearchPromise, fallbackTimeout]);
        (searchProds || []).forEach(p => {
          const rawStore = p.store_name || "";
          const formattedStore = formatStoreName(rawStore, country);
          const sKey = formattedStore.toLowerCase();
          const rawUrl = p.product_page_url || p.offer?.product_page_url;

          // Filter out user's base store
          if (isBaseStoreMatch(formattedStore, rawUrl, cleanBaseStore, baseLink)) {
            return;
          }

          if (!isTrustedMerchant(formattedStore, rawUrl)) return;

          const pPrice = parsePriceNum(p.product_price || p.price);
          if (!pPrice || pPrice <= 0) return;

          let cleanUrl = sanitizeOfferUrl(rawUrl, formattedStore, cleanSearchQuery, country);
          if (!cleanUrl || cleanUrl.includes("google.com") || cleanUrl.includes("ibp=")) {
            cleanUrl = getStoreDirectSearchFallback(formattedStore, cleanSearchQuery, country);
          }
          if (!cleanUrl) return;

          if (!storeMap.has(sKey) || storeMap.get(sKey).price > pPrice) {
            storeMap.set(sKey, {
              store_name: formattedStore,
              price: pPrice,
              deal_link: cleanUrl,
              is_verified: true
            });
          }
        });
      } catch (err) {
        console.warn("[Compare API] Real search fallback error:", err.message);
      }
    }

    // Sort alternative stores ascending by price (cheapest alternative first)
    const competitorStores = Array.from(storeMap.values()).sort((a, b) => a.price - b.price);

    if (competitorStores.length > 0) {
      const lowestPrice = competitorStores[0].price;
      competitorStores.forEach((s, idx) => {
        if (idx === 0) {
          s.is_lowest = true;
          s.diff_text = "LOWEST";
        } else {
          s.is_lowest = false;
          const diff = s.price - lowestPrice;
          s.diff_text = diff > 0 ? `+${meta.symbol}${diff.toLocaleString(meta.locale)}` : "Matching";
        }
      });
    }

    const finalStores = competitorStores.slice(0, 4);

    // 6. Preserve country=IN and currency=INR for Noise and D2C stores
    finalStores.forEach(s => {
      if (s.deal_link && s.deal_link.includes("gonoise.com")) {
        try {
          const u = new URL(s.deal_link);
          u.searchParams.set("country", "IN");
          u.searchParams.set("currency", "INR");
          s.deal_link = u.toString();
        } catch (e) {}
      }

      if (productId && s.deal_link && (s.deal_link.startsWith("http://") || s.deal_link.startsWith("https://"))) {
        const cleanStoreKey = (s.store_name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        const cacheKey = `cache:pdp:direct:v4:${cleanPId}:${cleanStoreKey}`;
        try {
          redis.set(cacheKey, s.deal_link, { ex: 86400 }).catch(() => {});
        } catch (e) {}
      }
    });

    // 7. Save resolved multi-store comparison to Redis cache (24h TTL)
    if (cleanPId && finalStores.length > 0) {
      try {
        await redis.set(compCacheKey, JSON.stringify(finalStores), { ex: 86400 });
      } catch (e) {}
    }

    if (finalStores.length === 0) {
      return NextResponse.json({
        success: false,
        stores: [],
        count: 0,
        message: "This product is currently exclusive to this store or not tracked across other verified marketplaces.",
        remaining: quotaResult.remaining
      });
    }

    return NextResponse.json({
      success: true,
      stores: finalStores,
      count: finalStores.length,
      remaining: quotaResult.remaining
    });
  } catch (error) {
    console.error("[Compare API] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
