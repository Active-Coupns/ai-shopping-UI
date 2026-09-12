const isDummyKey = (val) => {
  if (!val) return true;
  const v = val.toLowerCase().trim();
  return (
    v === "" ||
    v.includes("tokenxyz") ||
    v.includes("keyabc") ||
    v.includes("myshop") ||
    v.includes("placeholder") ||
    v.includes("your_") ||
    v.includes("dummy") ||
    v.includes("mock") ||
    v === "cuelinkstokenxyz" ||
    v === "earnkarokeyabc"
  );
};

/**
 * Wraps a clean product merchant URL with affiliate tags or aggregator redirects.
 * @param {string} url - Clean target merchant PDP URL.
 * @param {string} store - Merchant store/platform name (e.g. Amazon, Flipkart).
 * @param {string} region - Query region code (e.g. IN, US).
 * @param {object} settings - Admin configurations containing personalTags & aggregators list.
 * @returns {string} - Affiliate-monetized destination link.
 */
export function monetizeUrl(url, store, region, settings) {
  try {
    if (!url) return "";
    
    // Prevent double-wrapping if URL is already an affiliate aggregator redirect
    if (
      url.includes("earnkaro.com") ||
      url.includes("cuelinks.com") ||
      url.includes("linksredirect.com") ||
      url.includes("fktr.in") ||
      url.includes("topend.in")
    ) {
      return url;
    }

    const storeClean = (store || "Online Store").toLowerCase().trim();
    const regionClean = (region || "IN").toUpperCase().trim();

    // STEP 1: Personal Affiliate Tag Match
    const personalTags = Array.isArray(settings?.personalTags) ? settings.personalTags : [];
    const matchedTag = personalTags.find(t => {
      if (!t) return false;
      const sName = (t.store || "").toLowerCase().trim();
      const matchesStore = storeClean.includes(sName) || sName.includes(storeClean);
      const matchesRegion = (t.region || "").toUpperCase() === regionClean || (t.region || "").toUpperCase() === "GLOBAL";
      return matchesStore && matchesRegion;
    });

    if (matchedTag && matchedTag.tag && !isDummyKey(matchedTag.tag)) {
      try {
        const urlObj = new URL(url);
        if (storeClean.includes("amazon")) {
          urlObj.searchParams.set("tag", matchedTag.tag);
        } else if (storeClean.includes("flipkart") || storeClean.includes("myntra")) {
          urlObj.searchParams.set("affid", matchedTag.tag);
        } else {
          urlObj.searchParams.set("afftag", matchedTag.tag);
        }
        return urlObj.toString();
      } catch (e) {
        const sep = url.includes("?") ? "&" : "?";
        const paramName = storeClean.includes("amazon") ? "tag" : (storeClean.includes("flipkart") || storeClean.includes("myntra")) ? "affid" : "afftag";
        return `${url}${sep}${paramName}=${matchedTag.tag}`;
      }
    }

    // STEP 2: Affiliate Aggregators Fallback (EarnKaro, Cuelinks, etc.)
    const aggregators = Array.isArray(settings?.aggregators) ? settings.aggregators : [];
    const matchedAggregator = aggregators.find(a => {
      if (!a) return false;
      const matchesRegion = (a.region || "").toUpperCase() === regionClean || (a.region || "").toUpperCase() === "GLOBAL";
      return matchesRegion && a.token;
    });

    if (matchedAggregator && matchedAggregator.token && !isDummyKey(matchedAggregator.token)) {
      const nameClean = (matchedAggregator.name || "").toLowerCase().trim();
      const nameNoSpace = nameClean.replace(/\s+/g, "");
      const template = matchedAggregator.redirectUrl || "";
      
      if (template && (template.includes("{token}") || template.includes("{url}"))) {
        return template
          .replace("{token}", matchedAggregator.token)
          .replace("{url}", encodeURIComponent(url));
      }
      
      if (nameNoSpace.includes("cuelinks")) {
        return `https://cuelinks.com/redirection?token=${matchedAggregator.token}&url=${encodeURIComponent(url)}`;
      } else if (nameNoSpace.includes("earnkaro") || nameNoSpace.includes("earn")) {
        return `https://earnkaro.com/redirect?key=${matchedAggregator.token}&url=${encodeURIComponent(url)}`;
      }
    }

    // STEP 3: Fallback Demo Affiliate Monetization
    try {
      const urlObj = new URL(url);
      if (storeClean.includes("amazon")) {
        urlObj.searchParams.set("tag", "demo-shopsmart-21");
        return urlObj.toString();
      } else if (storeClean.includes("flipkart")) {
        urlObj.searchParams.set("affid", "demo-shopsmartflip");
        return urlObj.toString();
      }
    } catch (e) {}

    return `https://linksredirect.com/?cid=123456PUB&subid=shopsmart_demo&url=${encodeURIComponent(url)}`;
  } catch (err) {
    console.error("monetizeUrl exception caught safely:", err);
    return url || "";
  }
}
