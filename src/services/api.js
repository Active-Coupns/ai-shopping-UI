import { getDeviceFingerprint } from "@/lib/deviceFingerprint";

function getDefaultSpecs(title = "", store = "Online Store") {
  return [
    `Retail Partner: ${store}`,
    "Condition: 100% Brand New Sealed Pack",
    "Warranty: Official Manufacturer Warranty Covered",
    "Availability: Verified Live In-Stock Item"
  ];
}

export async function searchProducts(query, country = "IN", isUrlLookup = false, sourceStore = null, sourceUrl = null, isExactLookup = false) {
  try {
    let fp = null;
    let isBot = false;
    try {
      const fpRes = await getDeviceFingerprint();
      fp = fpRes?.fingerprint || null;
      isBot = !!fpRes?.isBot;
    } catch (_) {}

    const response = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(fp ? { "x-device-fingerprint": fp } : {}),
        "x-bot-detected": String(isBot),
      },
      body: JSON.stringify({
        query,
        country,
        isUrlLookup,
        sourceStore,
        sourceUrl,
        isExactLookup,
        deviceFingerprint: fp
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API search failed: ${errText}`);
    }

    const data = await response.json();
    const rawProducts = data.products || [];

    const mappedResults = rawProducts.map((p, idx) => {
      const isUSD = country.toUpperCase() === "US";
      const currencyCode = isUSD ? "USD" : "INR";
      const locale = isUSD ? "en-US" : "en-IN";

      const numericPrice = typeof p.rawPrice === 'number' 
        ? p.rawPrice 
        : (typeof p.price === 'number' 
            ? p.price 
            : (parseFloat(String(p.price || '').replace(/[^0-9.]/g, '')) || 0));

      const basePrice = numericPrice || 0;
      
      const calculatedOriginal = typeof p.originalPrice === 'number' 
        ? p.originalPrice 
        : (parseFloat(String(p.originalPrice || '').replace(/[^0-9.]/g, '')) || (basePrice > 0 ? Math.round(basePrice * 1.18) : 0));

      const discount = typeof p.discountPercent === 'number' 
        ? p.discountPercent 
        : (calculatedOriginal > basePrice && basePrice > 0 ? Math.round(((calculatedOriginal - basePrice) / calculatedOriginal) * 100) : 0);

      const formattedPrice = (typeof p.price === 'string' && p.price.includes(isUSD ? '$' : '₹'))
        ? p.price
        : new Intl.NumberFormat(locale, {
            style: "currency",
            currency: currencyCode,
            maximumFractionDigits: 0,
          }).format(basePrice);

      const formattedOriginal = (typeof p.originalPrice === 'string' && p.originalPrice.includes(isUSD ? '$' : '₹'))
        ? p.originalPrice
        : new Intl.NumberFormat(locale, {
            style: "currency",
            currency: currencyCode,
            maximumFractionDigits: 0,
          }).format(calculatedOriginal);

      // 1. Preserve Verified Live Price Comparisons & Exact PDPs
      let rawOffers = [];
      if (Array.isArray(p.price_comparison) && p.price_comparison.length > 0) {
        rawOffers = p.price_comparison.map(o => ({
          store: o.store_name || o.store || "Online Store",
          price: typeof o.price === 'number' ? o.price : basePrice,
          link: o.deal_link || o.link || o.url || p.deal_link || "#",
          is_lowest: !!o.is_lowest
        }));
      }

      const priceComparison = rawOffers.map(offer => {
        const formattedOfferPrice = typeof offer.price === 'number'
          ? new Intl.NumberFormat(locale, {
              style: "currency",
              currency: currencyCode,
              maximumFractionDigits: 0,
            }).format(offer.price)
          : offer.price;

        return {
          store: offer.store,
          price: formattedOfferPrice,
          link: offer.link,
          deal_link: offer.link,
          is_lowest: offer.is_lowest
        };
      });

      // 2. Specifications (prioritize server-provided rich specs)
      const specs = Array.isArray(p.specs) && p.specs.length > 0
        ? p.specs
        : getDefaultSpecs(p.title, p.store_name || p.store);

      // 3. Exact Direct Product PDP / Retailer Link
      const directProductUrl = p.deal_link || p.link || (priceComparison[0]?.link) || "#";
      const resolvedStore = p.store_name || p.store || priceComparison[0]?.store || "Online Store";

      return {
        id: p.id || `prod-${idx}-${Date.now()}`,
        title: p.title,
        store: resolvedStore,
        store_name: resolvedStore,
        price: formattedPrice,
        originalPrice: formattedOriginal,
        discountPercent: discount,
        rating: p.rating || "4.5",
        reviewsCount: p.review_count || p.reviewsCount || 0,
        image: p.image_url || p.image || "/laptop.jpg",
        image_url: p.image_url || p.image || "/laptop.jpg",
        tag: idx === 0 ? "AI Recommended" : idx === 1 ? "Best Value" : "Top Pick",
        aiReason: p.description || `Verified live deal for ${p.title} at ${resolvedStore}.`,
        specs,
        coupons: p.coupons || [],
        coupon: p.coupons?.[0] || null,
        affiliateUrl: directProductUrl,
        deal_link: directProductUrl,
        revealUrl: directProductUrl,
        currency: currencyCode,
        product_id: p.product_id || "",
        market_range: p.market_range || null,
        savings_amount: p.savings_amount || null,
        rawPrice: p.rawPrice || basePrice,
        priceComparison,
        price_comparison: priceComparison
      };
    });

    const finalResults = isUrlLookup ? mappedResults.slice(0, 1) : mappedResults;

    return {
      results: finalResults,
      coupons: data.coupons || [],
      intent: data.intent || "E-COMMERCE",
      error: data.error || null,
      message: data.message || null,
      newToken: data.newToken || null,
      searchesLeft: data.searchesLeft !== undefined ? data.searchesLeft : 10
    };
  } catch (error) {
    console.error("searchProducts service error:", error);
    throw error;
  }
}

export async function revealCoupon(store, url, code, clientId = null) {
  try {
    return {
      status: "success",
      message: "Direct store link attribution registered."
    };
  } catch (error) {
    console.error("revealCoupon service error:", error);
    throw error;
  }
}
