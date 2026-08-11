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
  const BYPASS_AFFILIATE = true;
  if (BYPASS_AFFILIATE) {
    return url;
  }

  if (!url) return "";
  
  const storeClean = (store || "Online Store").toLowerCase().trim();
  const regionClean = (region || "IN").toUpperCase().trim();

  // STEP 1: Personal Affiliate Tag Match
  const personalTags = settings?.personalTags || [];
  const matchedTag = personalTags.find(t => {
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
      } else if (storeClean.includes("flipkart")) {
        urlObj.searchParams.set("affid", matchedTag.tag);
      } else {
        urlObj.searchParams.set("afftag", matchedTag.tag);
      }
      console.log(`[Affiliate Engine] Applied Personal Tag: ${matchedTag.tag} for ${storeClean} (${regionClean})`);
      return urlObj.toString();
    } catch (e) {
      const sep = url.includes("?") ? "&" : "?";
      const paramName = storeClean.includes("amazon") ? "tag" : storeClean.includes("flipkart") ? "affid" : "afftag";
      return `${url}${sep}${paramName}=${matchedTag.tag}`;
    }
  }

  // STEP 2: Affiliate Aggregators Fallback
  const aggregators = settings?.aggregators || [];
  const matchedAggregator = aggregators.find(a => {
    const matchesRegion = (a.region || "").toUpperCase() === regionClean || (a.region || "").toUpperCase() === "GLOBAL";
    return matchesRegion && a.token;
  });

  if (matchedAggregator && matchedAggregator.token && !isDummyKey(matchedAggregator.token)) {
    const nameClean = (matchedAggregator.name || "").toLowerCase().trim();
    const template = matchedAggregator.redirectUrl || "";
    
    if (template && (template.includes("{token}") || template.includes("{url}"))) {
      console.log(`[Affiliate Engine] Wrapped URL using Custom Aggregator Template: ${nameClean}`);
      return template
        .replace("{token}", matchedAggregator.token)
        .replace("{url}", encodeURIComponent(url));
    }
    
    if (nameClean.includes("cuelinks")) {
      console.log(`[Affiliate Engine] Wrapped URL using Cuelinks for region ${regionClean}`);
      return `https://cuelinks.com/redirection?token=${matchedAggregator.token}&url=${encodeURIComponent(url)}`;
    } else if (nameClean.includes("earnkaro")) {
      console.log(`[Affiliate Engine] Wrapped URL using EarnKaro for region ${regionClean}`);
      return `https://earnkaro.com/redirect?key=${matchedAggregator.token}&url=${encodeURIComponent(url)}`;
    }
  }

  // STEP 3: Return clean merchant URL
  return url;
}
