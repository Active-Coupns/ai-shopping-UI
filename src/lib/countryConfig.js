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
    timeZone: "Asia/Kolkata",
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
    timeZone: "America/New_York",
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
    timeZone: "Europe/London",
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
    timeZone: "America/Toronto",
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
    timeZone: "Australia/Sydney",
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
    timeZone: "Asia/Dubai",
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

export const COUNTRY_BANKING_METAS = {
  IN: {
    topBanks: ["HDFC", "ICICI", "SBI", "Axis", "Kotak"],
    bankDisplayString: "HDFC, ICICI, Axis, and SBI",
    wallets: "Paytm, PhonePe & UPI",
    cardPaymentText: "Cannot combine with Paytm/PhonePe UPI; must choose Credit/Debit Card directly."
  },
  US: {
    topBanks: ["Chase", "Amex", "Capital One", "Citi", "Bank of America"],
    bankDisplayString: "Chase, Amex, Capital One, and Citi",
    wallets: "Apple Pay, PayPal & Venmo",
    cardPaymentText: "Cannot combine with 3rd-party digital wallets; must select eligible Credit/Debit Card directly."
  },
  GB: {
    topBanks: ["Barclays", "HSBC", "Lloyds", "NatWest", "Santander"],
    bankDisplayString: "Barclays, HSBC, Lloyds, and NatWest",
    wallets: "Apple Pay, PayPal & Klarna",
    cardPaymentText: "Cannot combine with 3rd-party digital wallets; must select eligible Credit/Debit Card directly."
  },
  CA: {
    topBanks: ["RBC", "TD", "Scotiabank", "BMO", "CIBC"],
    bankDisplayString: "RBC, TD, Scotiabank, and BMO",
    wallets: "Apple Pay, PayPal & Interac",
    cardPaymentText: "Cannot combine with 3rd-party digital wallets; must select eligible Credit/Debit Card directly."
  },
  AU: {
    topBanks: ["CommBank", "ANZ", "Westpac", "NAB", "Macquarie"],
    bankDisplayString: "CommBank, ANZ, Westpac, and NAB",
    wallets: "Apple Pay, PayPal & Afterpay",
    cardPaymentText: "Cannot combine with 3rd-party digital wallets; must select eligible Credit/Debit Card directly."
  },
  AE: {
    topBanks: ["Emirates NBD", "ADCB", "FAB", "Mashreq", "Dubai Islamic Bank"],
    bankDisplayString: "Emirates NBD, ADCB, FAB, and Mashreq",
    wallets: "Apple Pay, Careem Pay & Tabby",
    cardPaymentText: "Cannot combine with 3rd-party digital wallets; must select eligible Credit/Debit Card directly."
  }
};

export function getCountryBankingMeta(countryCode = "IN") {
  const code = validateCountryCode(countryCode);
  return COUNTRY_BANKING_METAS[code] || COUNTRY_BANKING_METAS.IN;
}

/**
 * Country-Aware Dynamic Date & Month Resolver for International SEO
 * Formats month, year, and dates according to the target country's official IANA timezone and locale.
 * Ensures that if it is already the 1st of a new month in Australia/India while still end of previous month in US,
 * Google crawlers and local users see the 100% accurate local month and date.
 */
export function getCountryDateDetails(countryCode = "IN", date = new Date()) {
  const meta = getCountryMeta(countryCode);
  const locale = meta.locale || "en-US";
  const timeZone = meta.timeZone || "UTC";

  try {
    const monthFormatter = new Intl.DateTimeFormat(locale, {
      timeZone,
      month: "long"
    });
    const yearFormatter = new Intl.DateTimeFormat(locale, {
      timeZone,
      year: "numeric"
    });
    const monthName = monthFormatter.format(date);
    const year = yearFormatter.format(date);
    const monthYear = `${monthName} ${year}`;

    const dateFormatter = new Intl.DateTimeFormat(locale, {
      timeZone,
      month: "short",
      day: "numeric",
      year: "numeric"
    });
    const todayFormatted = dateFormatter.format(date);

    return {
      monthName,
      year,
      monthYear,
      todayFormatted,
      locale,
      timeZone
    };
  } catch (_) {
    const now = new Date(date);
    const monthName = now.toLocaleString("en-US", { month: "long" });
    const year = String(now.getFullYear());
    return {
      monthName,
      year,
      monthYear: `${monthName} ${year}`,
      todayFormatted: now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      locale,
      timeZone
    };
  }
}

/**
 * Zero-Latency Browser Timezone Country Resolver
 * Maps standard IANA timezones to our 6 supported Tier-1 countries
 * Runs 100% client-side in 0ms with zero network requests
 */
export function detectCountryFromTimezone() {
  try {
    const tz = (typeof Intl !== "undefined" && Intl.DateTimeFormat)
      ? Intl.DateTimeFormat().resolvedOptions().timeZone || ""
      : "";
    if (/Kolkata|Calcutta/i.test(tz)) return "IN";
    if (/London/i.test(tz)) return "GB";
    if (/Dubai/i.test(tz)) return "AE";
    if (/Toronto|Vancouver|Montreal|Edmonton|Winnipeg|Halifax|Calgary/i.test(tz)) return "CA";
    if (/Sydney|Melbourne|Brisbane|Perth|Adelaide|Hobart|Darwin/i.test(tz)) return "AU";
    if (/New_York|Chicago|Denver|Los_Angeles|Phoenix|Anchorage|Honolulu|Detroit|Boise|Indiana|Kentucky|North_Dakota/i.test(tz)) return "US";
  } catch (_) {}
  return "IN";
}

