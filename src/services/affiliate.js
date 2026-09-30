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
    // Direct raw merchant URL return (Affiliate wrapping disabled until approval)
    return url;
  } catch (err) {
    console.error("monetizeUrl exception caught safely:", err);
    return url || "";
  }
}
