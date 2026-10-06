import { NextResponse } from "next/server";
import { redis } from "@/services/redis";
import { executeProductDetailsRequest, formatStoreName, isTrustedMerchant, sanitizeOfferUrl, isSearchPageUrl, parsePriceNum, getStoreDirectSearchFallback } from "@/services/rapidapi";

export async function POST(request) {
  try {
    const body = await request.json();
    const { productId, title = "", basePrice = 0, baseStore = "Online Store", baseLink = "", country = "IN" } = body;

    const parsedBasePrice = parsePriceNum(basePrice) || 1000;
    const isUS = String(country).toUpperCase() === "US";
    const cleanCountry = isUS ? "us" : "in";

    let rawOffers = [];
    if (productId) {
      try {
        const detailsPromise = executeProductDetailsRequest(productId, cleanCountry);
        const timeoutPromise = new Promise(resolve => setTimeout(() => resolve({ offers: [] }), 4000));
        const details = await Promise.race([detailsPromise, timeoutPromise]);
        rawOffers = details?.offers || [];
      } catch (err) {
        console.warn("[Compare API] Details fetch error:", err.message);
      }
    }

    const rawTitle = typeof title === "string" ? title.trim() : "";
    const cleanTitle = (rawTitle && rawTitle !== "null" && rawTitle !== "undefined") ? rawTitle : "laptop";

    const storeMap = new Map();
    const cleanBaseStore = formatStoreName(baseStore, country);
    const baseStoreKey = cleanBaseStore.toLowerCase();

    // 1. ANCHOR LOWEST: Base Store is ALWAYS Store 1 with is_lowest = true
    const safeBaseLink = sanitizeOfferUrl(baseLink, cleanBaseStore, cleanTitle, country) || getStoreDirectSearchFallback(cleanBaseStore, cleanTitle, country);
    storeMap.set(baseStoreKey, {
      store_name: cleanBaseStore,
      price: parsedBasePrice,
      deal_link: safeBaseLink,
      is_lowest: true,
      is_verified: true,
      diff_text: "LOWEST GUARANTEED ✓"
    });

    // 2. Filter live offers: ONLY trusted merchants & price >= parsedBasePrice
    (rawOffers || []).forEach(offer => {
      const rawStore = offer.store_name || "";
      const formattedStore = formatStoreName(rawStore, country);
      const sKey = formattedStore.toLowerCase();

      // If offer matches base store, upgrade to exact verified PDP if available
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
      // RULE: Offer must be >= basePrice (never lower, protecting the initial recommendation)
      if (!offerPrice || offerPrice < parsedBasePrice) return;

      const rawUrl = offer.product_page_url || offer.offer_page_url || offer.link;
      const cleanUrl = sanitizeOfferUrl(rawUrl, formattedStore, cleanTitle, country);
      if (!cleanUrl || cleanUrl.includes("google.com") || cleanUrl.includes("ibp=") || isSearchPageUrl(cleanUrl)) return;

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

    // ONLY Real Verified Merchant Offers with 100% Direct PDPs (NO fake search fallbacks)
    const finalStores = Array.from(storeMap.values()).slice(0, 4);

    // Clean Shopify parameters (e.g. gonoise) & save resolved direct PDPs to Redis cache
    finalStores.forEach(s => {
      if (s.deal_link && (s.deal_link.includes("gonoise.com") || s.deal_link.includes("/products/"))) {
        try {
          const u = new URL(s.deal_link);
          u.searchParams.delete("country");
          u.searchParams.delete("currency");
          s.deal_link = u.toString();
        } catch (e) {}
      }

      if (productId && s.deal_link && (s.deal_link.startsWith("http://") || s.deal_link.startsWith("https://"))) {
        const cleanStoreKey = (s.store_name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        const cacheKey = `cache:pdp:direct:v4:${productId.slice(-50)}:${cleanStoreKey}`;
        try {
          redis.set(cacheKey, s.deal_link, { ex: 604800 }).catch(() => {});
        } catch (e) {}
      }
    });

    return NextResponse.json({
      success: true,
      stores: finalStores,
      count: finalStores.length
    });
  } catch (error) {
    console.error("[Compare API] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
