/**
 * Centralized Multi-Country & Currency Configuration Hub
 * Powers 6-Country Tier-1 E-Commerce Engine:
 * 🇮🇳 India, 🇺🇸 United States, 🇬🇧 United Kingdom, 🇨🇦 Canada, 🇦🇺 Australia, 🇦🇪 United Arab Emirates
 */

export const SUPPORTED_COUNTRIES = {
  IN: {
    code: "IN",
    apiCode: "in",
    name: "India",
    flag: "🇮🇳",
    currency: "INR",
    symbol: "₹",
    locale: "en-IN",
    popularStores: "Amazon.in, Flipkart, Myntra, 1mg, Apollo",
    defaultStore: "Amazon.in",
    placeholder: "Search phones, laptops, clothes, medicines..."
  },
  US: {
    code: "US",
    apiCode: "us",
    name: "United States",
    flag: "🇺🇸",
    currency: "USD",
    symbol: "$",
    locale: "en-US",
    popularStores: "Amazon.com, Walmart, Best Buy, Target",
    defaultStore: "Amazon.com",
    placeholder: "Search tech, laptops, shoes, supplements..."
  },
  GB: {
    code: "GB",
    apiCode: "uk", // OpenWeb Ninja / Google Shopping uses 'uk' for Great Britain
    name: "United Kingdom",
    flag: "🇬🇧",
    currency: "GBP",
    symbol: "£",
    locale: "en-GB",
    popularStores: "Amazon.co.uk, Argos, Currys, John Lewis, ASOS",
    defaultStore: "Amazon.co.uk",
    placeholder: "Search laptops, headphones, fashion, deals..."
  },
  CA: {
    code: "CA",
    apiCode: "ca",
    name: "Canada",
    flag: "🇨🇦",
    currency: "CAD",
    symbol: "C$",
    locale: "en-CA",
    popularStores: "Amazon.ca, Best Buy CA, Walmart CA, Canadian Tire",
    defaultStore: "Amazon.ca",
    placeholder: "Search electronics, outdoor gear, laptops..."
  },
  AU: {
    code: "AU",
    apiCode: "au",
    name: "Australia",
    flag: "🇦🇺",
    currency: "AUD",
    symbol: "A$",
    locale: "en-AU",
    popularStores: "Amazon.com.au, JB Hi-Fi, Harvey Norman, Kmart",
    defaultStore: "Amazon.com.au",
    placeholder: "Search tech, gaming, fashion, appliances..."
  },
  AE: {
    code: "AE",
    apiCode: "ae",
    name: "United Arab Emirates",
    flag: "🇦🇪",
    currency: "AED",
    symbol: "AED",
    locale: "en-AE",
    popularStores: "Amazon.ae, Noon, Sharaf DG, Carrefour",
    defaultStore: "Amazon.ae",
    placeholder: "Search perfumes, phones, laptops, luxury deals..."
  }
};

export const COUNTRIES_LIST = Object.values(SUPPORTED_COUNTRIES);

/**
 * Strict Country Code Validator & Sanitizer
 * Ensures country inputs strictly match one of the 6 supported Tier-1 countries
 * Prevents path traversal, prototype pollution, or cache key poisoning
 */
export function validateCountryCode(countryCode = "IN") {
  if (!countryCode || typeof countryCode !== "string") return "IN";
  const sanitized = countryCode.trim().slice(0, 10);
  const upper = sanitized.toUpperCase();
  if (SUPPORTED_COUNTRIES[upper]) return upper;
  if (upper === "UK") return "GB";
  const matchByApi = COUNTRIES_LIST.find(c => c.apiCode.toLowerCase() === sanitized.toLowerCase());
  return matchByApi ? matchByApi.code : "IN";
}

export function getCountryMeta(countryCode = "IN") {
  const safeCode = validateCountryCode(countryCode);
  return SUPPORTED_COUNTRIES[safeCode] || SUPPORTED_COUNTRIES.IN;
}

export function getAmazonBaseUrl(countryCode = "IN") {
  const r = String(countryCode || "IN").toUpperCase();
  if (r === "GB" || r === "UK") return "https://www.amazon.co.uk";
  if (r === "AU") return "https://www.amazon.com.au";
  if (r === "CA") return "https://www.amazon.ca";
  if (r === "AE") return "https://www.amazon.ae";
  if (r === "US") return "https://www.amazon.com";
  return "https://www.amazon.in";
}

export function formatCountryPrice(amount, countryCode = "IN") {
  const meta = getCountryMeta(countryCode);
  const num = typeof amount === "number" ? amount : (parseFloat(String(amount).replace(/[^0-9.]/g, "")) || 0);
  try {
    return new Intl.NumberFormat(meta.locale, {
      style: "currency",
      currency: meta.currency,
      maximumFractionDigits: 0
    }).format(num);
  } catch (_) {
    return `${meta.symbol}${Math.round(num)}`;
  }
}
