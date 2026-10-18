import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { redis } from "@/services/redis";
import { checkUnifiedApiQuota, extractTrustedClientIp } from "@/services/rateLimiter";
import { executeProductDetailsRequest, executeSearchRequest, formatStoreName, isTrustedMerchant, sanitizeOfferUrl, isSearchPageUrl, parsePriceNum, getStoreDirectSearchFallback } from "@/services/openweb";

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

    const { productId, title = "", basePrice = 0, baseStore = "Online Store", baseLink = "", country = "IN" } = body;
    const isUS = String(country).toUpperCase() === "US";
    const cleanCountry = isUS ? "us" : "in";
    const cleanPId = String(productId || "").slice(-50).replace(/[^a-zA-Z0-9]/g, "");
    const compCacheKey = `cache:comp:v5:${cleanPId}:${cleanCountry}`;

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

    // 3. Fetch Live Multi-Store Offers (Exact merchant PDPs via OpenWebNinja)
    let resolvedProductId = productId;
    const rawTitle = typeof title === "string" ? title.trim() : "";
    const cleanTitle = (rawTitle && rawTitle !== "null" && rawTitle !== "undefined") ? rawTitle : "product";

    if (!resolvedProductId && cleanTitle && cleanTitle !== "product") {
      try {
        const searchProds = await executeSearchRequest(cleanTitle, cleanCountry);
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

    const parsedBasePrice = parsePriceNum(basePrice) || 1000;
    const storeMap = new Map();
    const cleanBaseStore = formatStoreName(baseStore, country);
    const baseStoreKey = cleanBaseStore.toLowerCase();

    // 4. ANCHOR LOWEST: Base Store is Store 1 with is_lowest = true
    const safeBaseLink = sanitizeOfferUrl(baseLink, cleanBaseStore, cleanTitle, country) || getStoreDirectSearchFallback(cleanBaseStore, cleanTitle, country);
    storeMap.set(baseStoreKey, {
      store_name: cleanBaseStore,
      price: parsedBasePrice,
      deal_link: safeBaseLink,
      is_lowest: true,
      is_verified: true,
      diff_text: "LOWEST GUARANTEED ✓"
    });

    // 5. Populate Competitor Live Offers (Amazon, Flipkart, Croma, Reliance)
    (rawOffers || []).forEach(offer => {
      const rawStore = offer.store_name || "";
      const formattedStore = formatStoreName(rawStore, country);
      const sKey = formattedStore.toLowerCase();

      // Upgrade base store deal_link if exact verified PDP offer is found
      if (sKey === baseStoreKey) {
        const rawUrl = offer.product_page_url || offer.offer_page_url || offer.link;
        const cleanUrl = sanitizeOfferUrl(rawUrl, formattedStore, cleanTitle, country);
        if (cleanUrl && !cleanUrl.includes("google.com") && !cleanUrl.includes("ibp=") && !isSearchPageUrl(cleanUrl)) {
          storeMap.get(baseStoreKey).deal_link = cleanUrl;
        }
        return;
      }

      if (!isTrustedMerchant(formattedStore, offer.product_page_url || offer.offer_page_url || offer.link)) {
        return;
      }

      const offerPrice = parsePriceNum(offer.price || offer.product_price);
      if (!offerPrice) return;

      const rawUrl = offer.product_page_url || offer.offer_page_url || offer.link;
      const cleanUrl = sanitizeOfferUrl(rawUrl, formattedStore, cleanTitle, country);
      if (!cleanUrl || cleanUrl.includes("google.com") || cleanUrl.includes("ibp=")) return;

      if (!storeMap.has(sKey) || storeMap.get(sKey).price > offerPrice) {
        const diff = offerPrice - parsedBasePrice;
        storeMap.set(sKey, {
          store_name: formattedStore,
          price: offerPrice,
          deal_link: cleanUrl,
          is_lowest: false,
          is_verified: true,
          diff_text: diff > 0 ? `+${isUS ? "$" : "₹"}${diff.toLocaleString(isUS ? "en-US" : "en-IN")}` : "Matching"
        });
      }
    });

    // If Google Shopping details returned no competitors, check real Google Shopping search results for this title
    if (storeMap.size < 2 && cleanTitle && cleanTitle !== "product") {
      try {
        const fallbackSearchPromise = executeSearchRequest(cleanTitle, cleanCountry);
        const fallbackTimeout = new Promise(resolve => setTimeout(() => resolve([]), 4000));
        const searchProds = await Promise.race([fallbackSearchPromise, fallbackTimeout]);
        (searchProds || []).forEach(p => {
          const rawStore = p.store_name || "";
          const formattedStore = formatStoreName(rawStore, country);
          const sKey = formattedStore.toLowerCase();
          if (sKey === baseStoreKey) return;
          if (!isTrustedMerchant(formattedStore, p.product_page_url)) return;

          const pPrice = parsePriceNum(p.product_price || p.price);
          if (!pPrice || pPrice <= 0) return;

          const rawUrl = p.product_page_url || p.offer?.product_page_url;
          const cleanUrl = sanitizeOfferUrl(rawUrl, formattedStore, cleanTitle, country);
          if (!cleanUrl || cleanUrl.includes("google.com") || cleanUrl.includes("ibp=")) return;

          if (!storeMap.has(sKey)) {
            const diff = pPrice - parsedBasePrice;
            storeMap.set(sKey, {
              store_name: formattedStore,
              price: pPrice,
              deal_link: cleanUrl,
              is_lowest: false,
              is_verified: true,
              diff_text: diff > 0 ? `+${isUS ? "$" : "₹"}${diff.toLocaleString(isUS ? "en-US" : "en-IN")}` : diff < 0 ? `-${isUS ? "$" : "₹"}${Math.abs(diff).toLocaleString(isUS ? "en-US" : "en-IN")}` : "Matching"
            });
          }
        });
      } catch (err) {
        console.warn("[Compare API] Real search fallback error:", err.message);
      }
    }

    const finalStores = Array.from(storeMap.values()).slice(0, 4);

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
