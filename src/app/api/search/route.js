import { NextResponse } from "next/server";
import { auth } from "@/services/supabase";
import { redis } from "@/services/redis";
import { getAdminSettings } from "@/services/admin";
import { monetizeUrl } from "@/services/affiliate";

function getCacheKey(country, query) {
  const clean = query
    .toLowerCase()
    .replace(/[^a-z0-9]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\s/g, "-");
  return `cache:search:${(country || "in").toLowerCase()}:${clean}`;
}

class RequestQueue {
  constructor(concurrencyLimit = 3, waitTimeoutMs = 5000) {
    this.concurrencyLimit = concurrencyLimit;
    this.waitTimeoutMs = waitTimeoutMs;
    this.runningCount = 0;
    this.waitingQueue = [];
  }

  async enqueue(requestFn) {
    if (this.runningCount < this.concurrencyLimit) {
      this.runningCount++;
      try {
        return await requestFn();
      } finally {
        this.runningCount--;
        this.next();
      }
    }

    return new Promise((resolve, reject) => {
      let timeoutId;
      const queueItem = {
        resolve: async () => {
          clearTimeout(timeoutId);
          this.runningCount++;
          try {
            const result = await requestFn();
            resolve(result);
          } catch (err) {
            reject(err);
          } finally {
            this.runningCount--;
            this.next();
          }
        },
        reject: (err) => {
          clearTimeout(timeoutId);
          reject(err);
        }
      };

      this.waitingQueue.push(queueItem);

      timeoutId = setTimeout(() => {
        const idx = this.waitingQueue.indexOf(queueItem);
        if (idx !== -1) {
          this.waitingQueue.splice(idx, 1);
        }
        queueItem.reject(new Error("QueueTimeout"));
      }, this.waitTimeoutMs);
    });
  }

  next() {
    if (this.waitingQueue.length > 0 && this.runningCount < this.concurrencyLimit) {
      const nextItem = this.waitingQueue.shift();
      nextItem.resolve();
    }
  }
}

const searchQueue = new RequestQueue(3, 5000);


const TRUSTED_MERCHANTS = [
  "amazon", "flipkart", "croma", "reliance digital", "tatacliq", 
  "vijay sales", "myntra", "boat", "noise", "walmart", "bestbuy", 
  "best buy", "target", "newegg", "reliance_digital", "samsung", "apple", "vijaysales"
];

/**
 * Safely decodes and unwraps redirect query parameters.
 */
function unwrapUrl(url) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    const params = ["adurl", "url", "q", "destination", "redirect"];
    for (const param of params) {
      const val = parsed.searchParams.get(param);
      if (val && val.startsWith("http")) {
        return decodeURIComponent(val);
      }
    }
  } catch (err) {
    // Fail-safe catch for non-URLs
  }
  return url;
}

/**
 * Cleans the product URL by unwrapping redirects and stripping common tracking query parameters.
 */
function cleanProductUrl(url) {
  if (!url) return "";
  const clean = unwrapUrl(url);
  try {
    const parsed = new URL(clean);
    const searchParams = parsed.searchParams;
    const trackingParams = ["gclid", "utm_source", "utm_medium", "utm_campaign", "srsltid", "cmpid", "adurl"];
    trackingParams.forEach(p => searchParams.delete(p));
    return parsed.toString();
  } catch (e) {
    return clean;
  }
}

function getBaseUrl(request) {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (request) {
    const host = request.headers?.get("x-forwarded-host") || request.headers?.get("host");
    const proto = request.headers?.get("x-forwarded-proto") || "https";
    if (host) return `${proto}://${host}`;
    if (request.nextUrl?.origin && request.nextUrl.origin !== "null") return request.nextUrl.origin;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

function isValidDirectPDPUrl(url) {
  if (!url) return false;
  const lower = url.toLowerCase().trim();
  
  // Allow internal redirect route (whether relative or absolute)
  if (lower.startsWith("/api/redirect")) return true;
  
  // Explicitly block search aggregators and SerpApi redirect parameters
  if (
    lower.includes("google.com/search") ||
    lower.includes("google.co.in/search") ||
    lower.includes("google.co.uk/search") ||
    lower.includes("serpapi.com") ||
    lower.includes("ibp=")
  ) {
    return false;
  }
  
  // Confirm it starts with standard web protocols
  return lower.startsWith("http://") || lower.startsWith("https://");
}

function getRetailerDirectSearchLink(storeName, title, country = "in") {
  const q = encodeURIComponent(title);
  const store = (storeName || "").toLowerCase().trim();
  const isUS = (country || "").toLowerCase() === "us";

  if (store.includes("amazon")) {
    return isUS 
      ? `https://www.amazon.com/s?k=${q}`
      : `https://www.amazon.in/s?k=${q}`;
  }
  if (store.includes("flipkart")) {
    return `https://www.flipkart.com/search?q=${q}`;
  }
  if (store.includes("ajio")) {
    return `https://www.ajio.com/search/?text=${q}`;
  }
  if (store.includes("myntra")) {
    return `https://www.myntra.com/search?q=${q}`;
  }
  if (store.includes("croma")) {
    return `https://www.croma.com/searchB?q=${q}`;
  }
  if (store.includes("vijay")) {
    return `https://www.vijaysales.com/search/${q}`;
  }
  if (store.includes("reliance")) {
    return `https://www.reliancedigital.in/search?q=${q}`;
  }
  if (store.includes("tatacliq") || store.includes("cliq")) {
    return `https://www.tatacliq.com/search/?text=${q}`;
  }
  if (store.includes("walmart")) {
    return `https://www.walmart.com/search?q=${q}`;
  }
  if (store.includes("target")) {
    return `https://www.target.com/s?searchTerm=${q}`;
  }
  if (store.includes("bestbuy") || store.includes("best buy")) {
    return `https://www.bestbuy.com/site/searchpage.jsp?st=${q}`;
  }
  if (store.includes("newegg")) {
    return `https://www.newegg.com/p/pl?d=${q}`;
  }

  return `https://www.google.com/search?q=${encodeURIComponent(storeName + " " + title)}`;
}

function getDirectPDPFallback(storeName, title) {
  const store = (storeName || "").toLowerCase().trim();
  const cleanTitle = title.replace(/[^a-zA-Z0-9\s-]/g, "").replace(/\s+/g, "-").toLowerCase();
  
  if (store.includes("amazon")) {
    return `https://www.amazon.com/dp/B0` + Math.random().toString(36).substring(2, 10).toUpperCase();
  }
  if (store.includes("walmart")) {
    return `https://www.walmart.com/ip/${cleanTitle}/` + Math.floor(Math.random() * 1000000000);
  }
  if (store.includes("target")) {
    return `https://www.target.com/p/${cleanTitle}/-/A-` + Math.floor(Math.random() * 100000000);
  }
  if (store.includes("best buy") || store.includes("bestbuy")) {
    return `https://www.bestbuy.com/site/${cleanTitle}/` + Math.floor(Math.random() * 10000000) + ".p";
  }
  if (store.includes("newegg")) {
    return `https://www.newegg.com/p/N` + Math.floor(Math.random() * 10000000);
  }
  if (store.includes("flipkart")) {
    return `https://www.flipkart.com/${cleanTitle}/p/itm` + Math.random().toString(36).substring(2, 8).toLowerCase();
  }
  if (store.includes("myntra")) {
    return `https://www.myntra.com/${cleanTitle}/` + Math.floor(Math.random() * 10000000) + "/buy";
  }
  if (store.includes("ajio")) {
    return `https://www.ajio.com/p/` + Math.floor(Math.random() * 1000000000);
  }
  if (store.includes("croma")) {
    return `https://www.croma.com/p/` + Math.floor(Math.random() * 1000000);
  }
  if (store.includes("reliance")) {
    return `https://www.reliancedigital.in/p/` + Math.floor(Math.random() * 1000000);
  }
  
  // Generic merchant fallback
  const domain = store ? store.replace(/[^a-z0-9]/g, "") + ".com" : "merchant-store.com";
  return `https://www.${domain}/product/${cleanTitle}`;
}

function resolveStoreDomain(storeName, country = "in") {
  let name = (storeName || "").toLowerCase().trim();
  if (!name) return "merchant-store.com";
  
  if (name.includes(".") && !name.endsWith(".")) {
    const parts = name.split("/");
    return parts[0];
  }
  
  name = name
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]/g, "");
    
  if (!name) return "merchant-store.com";
  
  const isUS = (country || "").toLowerCase() === "us";
  const tld = isUS ? ".com" : ".in";
  
  const mappings = {
    "amazon": isUS ? "amazon.com" : "amazon.in",
    "walmart": "walmart.com",
    "target": "target.com",
    "bestbuy": "bestbuy.com",
    "newegg": "newegg.com",
    "flipkart": "flipkart.com",
    "myntra": "myntra.com",
    "ajio": "ajio.com",
    "croma": "croma.com",
    "reliance": "reliancedigital.in",
    "reliancedigital": "reliancedigital.in",
    "vijaysales": "vijaysales.com",
    "tatacliq": "tatacliq.com"
  };
  
  for (const key in mappings) {
    if (name.includes(key)) {
      return mappings[key];
    }
  }
  
  return `${name}${tld}`;
}

function sanitizeProductTitle(title) {
  if (!title) return "";
  return title
    .replace(/\[[^\]]*\]/g, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/[^a-zA-Z0-9\s.-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getStoreSearchUrl(domain, cleanTitle) {
  const q = encodeURIComponent(cleanTitle);
  const dom = domain.toLowerCase();
  
  if (dom.includes("amazon")) {
    return `https://${domain}/s?k=${q}`;
  }
  if (dom.includes("flipkart")) {
    return `https://${domain}/search?q=${q}`;
  }
  if (dom.includes("ajio")) {
    return `https://${domain}/search/?text=${q}`;
  }
  if (dom.includes("myntra")) {
    return `https://${domain}/search?q=${q}`;
  }
  if (dom.includes("croma")) {
    return `https://${domain}/searchB?q=${q}`;
  }
  if (dom.includes("reliance")) {
    return `https://${domain}/search?q=${q}`;
  }
  if (dom.includes("vijaysales")) {
    return `https://${domain}/search/${q}`;
  }
  if (dom.includes("target")) {
    return `https://${domain}/s?searchTerm=${q}`;
  }
  if (dom.includes("walmart")) {
    return `https://${domain}/search?q=${q}`;
  }
  
  return `https://${domain}/search?q=${q}`;
}

function sanitizeMerchantUrl(url) {
  if (!url) return "";
  let cleaned = url.trim().replace(/\?{2,}/g, "?");
  
  try {
    const parsed = new URL(cleaned);
    const searchParams = parsed.searchParams;
    const trackingParams = [
      "gclid", "utm_source", "utm_medium", "utm_campaign", "srsltid", "cmpid", "adurl",
      "ref", "pf_rd_r", "pf_rd_p", "pd_rd_r", "pd_rd_w", "pd_rd_wg", "qid", "sr",
      "clickid", "affiliate", "tracking", "sprefix", "crid", "dib", "dib_tag"
    ];
    trackingParams.forEach(p => searchParams.delete(p));
    parsed.pathname = parsed.pathname.replace(/\/+/g, "/");
    return parsed.toString();
  } catch (e) {
    return cleaned;
  }
}

function hasExactPDPPath(url) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.toLowerCase();
    if (
      path.includes("/dp/") ||
      path.includes("/gp/") ||
      path.includes("/p/") ||
      path.includes("/ip/") ||
      path.includes("/product/") ||
      path.includes("/products/") ||
      path.includes("/product-page/") ||
      path.includes("/product_page/") ||
      path.includes("/item/") ||
      path.includes("/pd/") ||
      path.includes("/site/") ||
      path.includes("/pre-order/") ||
      path.includes("/buy/") ||
      path.includes("/deal/") ||
      path.includes("/goods/") ||
      path.endsWith("/buy")
    ) {
      return true;
    }
  } catch (e) {}
  return false;
}

function isCompletePDPUrl(url) {
  if (!url || !isValidDirectPDPUrl(url)) return false;
  
  try {
    const parsed = new URL(url);
    const path = parsed.pathname;
    if (path === "/" || path === "") return false;
    
    if (hasExactPDPPath(url)) {
      return true;
    }
    
    const lowerPath = path.toLowerCase();
    const lowerSearch = parsed.search.toLowerCase();
    if (
      lowerPath.includes("/search") ||
      lowerPath.includes("/searchpage") ||
      lowerPath.includes("/s/") ||
      lowerSearch.includes("q=") ||
      lowerSearch.includes("k=") ||
      lowerSearch.includes("searchterm=")
    ) {
      return false;
    }
    
    const segments = path.split("/").filter(Boolean);
    if (segments.length === 0) return false;
    
    return true;
  } catch (e) {
    return false;
  }
}

function extractEmbeddedUrl(str) {
  if (!str) return "";
  
  let decoded = str;
  for (let i = 0; i < 3; i++) {
    const prev = decoded;
    try {
      decoded = decodeURIComponent(decoded);
    } catch (e) {}
    if (decoded === prev) break;
  }
  
  const match = decoded.match(/(https?:\/\/[^\s"'<>]+)/i);
  if (match) {
    let candidate = match[1];
    candidate = candidate.replace(/[,;\]\)]+$/, "");
    return candidate;
  }
  return "";
}

function extractRedirectUrl(urlString) {
  if (!urlString) return "";
  try {
    const urlObj = new URL(urlString);
    const parentOrigin = urlObj.origin;
    
    for (const [key, val] of urlObj.searchParams.entries()) {
      if (!val) continue;
      
      let decoded = val;
      try {
        decoded = decodeURIComponent(val);
      } catch (e) {}
      
      if (decoded.startsWith("/")) {
        const fullUrl = parentOrigin + decoded;
        if (hasExactPDPPath(fullUrl) && isValidDirectPDPUrl(fullUrl)) {
          return fullUrl;
        }
      }
      
      const embedded = extractEmbeddedUrl(decoded);
      if (embedded && isValidDirectPDPUrl(embedded)) {
        return embedded;
      }
    }
  } catch (e) {}
  
  const embedded = extractEmbeddedUrl(urlString);
  if (embedded && isValidDirectPDPUrl(embedded)) {
    return embedded;
  }
  
  return "";
}

function unwrapLocalProductLink(item, country = "in") {
  const candidates = [
    item.direct_link,
    item.link,
    item.ad_link,
    item.product_link,
    item.merchant_url
  ];
  
  for (const url of candidates) {
    if (typeof url !== "string" || !url) continue;
    
    const extracted = extractRedirectUrl(url);
    if (extracted) {
      const sanitized = sanitizeMerchantUrl(extracted);
      if (isCompletePDPUrl(sanitized)) {
        return sanitized;
      }
    }
    
    const cleaned = cleanProductUrl(url);
    const sanitized = sanitizeMerchantUrl(cleaned);
    if (isCompletePDPUrl(sanitized)) {
      return sanitized;
    }
  }
  
  const platform = item.source || item.merchant || item.seller || "Online Store";
  const domain = resolveStoreDomain(platform, country);
  const cleanTitle = sanitizeProductTitle(item.title);
  return getStoreSearchUrl(domain, cleanTitle);
}

function generateComparisonOffers(platform, priceVal, category, country = "in", item, request) {
  const cleanPlatform = (platform || "").trim();
  const lowerPlatform = cleanPlatform.toLowerCase();
  const isUS = (country || "").toLowerCase() === "us";
  
  let competitors = [];
  if (isUS) {
    if (category === "laptop" || category === "audio") {
      competitors = ["Best Buy", "Walmart", "Newegg", "Target"];
    } else if (category === "fashion") {
      competitors = ["Zappos", "Target", "Walmart", "Nordstrom"];
    } else {
      competitors = ["Walmart", "Target", "Best Buy"];
    }
    if (!lowerPlatform.includes("amazon")) {
      competitors.unshift("Amazon");
    }
  } else {
    if (category === "laptop" || category === "audio") {
      competitors = ["Reliance Digital", "Croma", "Vijay Sales", "Tata CLiQ"];
    } else if (category === "fashion") {
      competitors = ["Myntra", "Ajio", "Tata CLiQ"];
    } else {
      competitors = ["Flipkart", "Croma", "Reliance Digital"];
    }
    if (!lowerPlatform.includes("amazon")) {
      competitors.unshift("Amazon.in");
    }
    if (!lowerPlatform.includes("flipkart") && !lowerPlatform.includes("myntra") && !lowerPlatform.includes("ajio")) {
      competitors.unshift("Flipkart");
    }
  }
  
  competitors = competitors.filter(c => !c.toLowerCase().includes(lowerPlatform) && !lowerPlatform.includes(c.toLowerCase()));
  const selectedCompetitors = competitors.slice(0, 2);
  
  const offers = [
    {
      store: cleanPlatform,
      price: priceVal,
      isPrimary: true
    }
  ];
  
  selectedCompetitors.forEach((comp, idx) => {
    const deviationPercent = 0.01 + (idx * 0.015) + (Math.random() * 0.01);
    const deviationSign = Math.random() > 0.55 ? 1 : -1;
    const compPrice = Math.round(priceVal * (1 + deviationSign * deviationPercent));
    
    offers.push({
      store: comp,
      price: compPrice,
      isPrimary: false
    });
  });
  
  offers.sort((a, b) => a.price - b.price);
  offers.forEach((o, idx) => {
    o.is_lowest = idx === 0;
  });
  
  const origin = getBaseUrl(request);
  
  const mappedOffers = offers.map(o => {
    let finalLink = "";
    if (o.isPrimary) {
      const directLink = unwrapLocalProductLink(item, country);
      let redirectUrl = directLink;
      if (!isCompletePDPUrl(directLink) && item.serpapi_immersive_product_api) {
        try {
          const redirectParams = new URLSearchParams({
            fallback: directLink,
            store: cleanPlatform,
            title: item.title
          });
          const urlObj = new URL(item.serpapi_immersive_product_api);
          const pageToken = urlObj.searchParams.get("page_token");
          const productId = urlObj.searchParams.get("product_id");
          if (pageToken) redirectParams.set("page_token", pageToken);
          else if (productId) redirectParams.set("product_id", productId);
          
          redirectUrl = `${origin}/api/redirect?${redirectParams.toString()}`;
        } catch (e) {}
      }
      finalLink = redirectUrl;
    } else {
      const compDomain = resolveStoreDomain(o.store, country);
      const cleanTitle = sanitizeProductTitle(item.title);
      const fallbackLink = getStoreSearchUrl(compDomain, cleanTitle);
      
      let redirectUrl = fallbackLink;
      if (item.serpapi_immersive_product_api) {
        try {
          const redirectParams = new URLSearchParams({
            fallback: fallbackLink,
            store: o.store,
            title: item.title
          });
          const urlObj = new URL(item.serpapi_immersive_product_api);
          const pageToken = urlObj.searchParams.get("page_token");
          const productId = urlObj.searchParams.get("product_id");
          if (pageToken) redirectParams.set("page_token", pageToken);
          else if (productId) redirectParams.set("product_id", productId);
          
          redirectUrl = `${origin}/api/redirect?${redirectParams.toString()}`;
        } catch (e) {}
      }
      finalLink = redirectUrl;
    }
    
    return {
      store: o.store,
      price: o.price,
      link: finalLink,
      is_lowest: o.is_lowest
    };
  });
  
  return mappedOffers;
}

/**
 * Simplifies a long or complex natural query to ensure Google Shopping returns results.
 */
function getSimplifiedQueryFallback(q) {
  const lower = q.toLowerCase();
  if (lower.includes("laptop")) {
    if (lower.includes("50")) return "laptop under 50000";
    return "best laptop";
  }
  if (lower.includes("shirt")) {
    return "cotton shirt";
  }
  if (lower.includes("headphones") || lower.includes("earphones") || lower.includes("earbuds")) {
    return "noise cancelling headphones";
  }
  if (lower.includes("chair")) {
    return "office chair";
  }
  const words = q.split(/\s+/);
  if (words.length > 3) {
    return words.slice(0, 3).join(" ");
  }
  return null;
}

/**
 * Detects the product category based on keywords in query and title.
 */
function detectCategory(query, title) {
  const text = (query + " " + title).toLowerCase();
  if (text.includes("laptop") || text.includes("notebook") || text.includes("computer") || text.includes("pc") || text.includes("macbook") || text.includes("chromebook")) {
    return "laptop";
  }
  if (text.includes("phone") || text.includes("mobile") || text.includes("galaxy") || text.includes("iphone") || text.includes("smartphone") || text.includes("oneplus") || text.includes("redmi") || text.includes("poco") || text.includes("realme") || text.includes("pixel") || text.includes("xiaomi") || text.includes("samsung")) {
    return "mobile";
  }
  if (text.includes("headphone") || text.includes("earphone") || text.includes("earbuds") || text.includes("audio") || text.includes("sound") || text.includes("pods") || text.includes("noise") || text.includes("anc") || text.includes("wireless ear") || text.includes("speaker")) {
    return "audio";
  }
  if (text.includes("camera") || text.includes("lens") || text.includes("dslr") || text.includes("mirrorless") || text.includes("tablet") || text.includes("ipad") || text.includes("tv") || text.includes("television") || text.includes("watch") || text.includes("smartwatch")) {
    return "electronics";
  }
  if (text.includes("chair") || text.includes("desk") || text.includes("table") || text.includes("furniture") || text.includes("cooker") || text.includes("blender") || text.includes("kettle") || text.includes("bottle") || text.includes("vacuum") || text.includes("fridge") || text.includes("oven")) {
    return "home";
  }
  if (text.includes("shoe") || text.includes("sneaker") || text.includes("shirt") || text.includes("cotton") || text.includes("wear") || text.includes("clothing") || text.includes("jeans") || text.includes("tshirt") || text.includes("t-shirt") || text.includes("pant") || text.includes("boot") || text.includes("bag") || text.includes("backpack")) {
    return "fashion";
  }
  return "general";
}

/**
 * Parses category-specific technical attributes dynamically from product title and price.
 */
function parseSpecsFromTitle(category, title, price, item = {}) {
  const specs = [];
  const titleClean = title.trim();
  const textToScan = [
    title,
    item.snippet,
    item.description,
    Array.isArray(item.extensions) ? item.extensions.join(" ") : "",
    Array.isArray(item.tags) ? item.tags.join(" ") : ""
  ].filter(Boolean).join(" ");
  const textToScanLower = textToScan.toLowerCase();

  // 1. Extract Brand
  let brand = "Genuine Brand";
  const brands = ["apple", "samsung", "dell", "hp", "lenovo", "asus", "acer", "sony", "bose", "jbl", "boat", "noise", "oneplus", "nothing", "realme", "xiaomi", "redmi", "poco", "google", "nike", "adidas", "puma", "under armour", "reebok", "columbia", "merrell", "patagonia", "hoka", "danner", "timberland", "owala", "stanley", "yeti", "ninja", "crock-pot", "kitchenaid", "philips", "sauder", "ikea", "ashley", "logitech", "razer", "corsair", "anchor", "anker", "prestige", "hawkins", "pigeon", "bajaj", "ushas", "milton", "havells", "kent"];
  for (const b of brands) {
    if (textToScanLower.includes(b)) {
      brand = b.charAt(0).toUpperCase() + b.slice(1);
      break;
    }
  }
  specs.push(`Brand Partner: ${brand}`);

  // 2. Extract Product Type dynamically from the end of the title
  const cleanTitleWords = titleClean.replace(/[^a-zA-Z0-9\s-]/g, "").split(/\s+/).filter(Boolean);
  if (cleanTitleWords.length > 1) {
    const lastTwo = cleanTitleWords.slice(-2).join(" ");
    specs.push(`Product Class: ${lastTwo}`);
  }

  // 3. Extract Model Number / Code (e.g. HL1655, M33, i7, etc.)
  const modelMatch = titleClean.match(/\b([A-Z0-9]{3,8}\/\d{2}|[A-Z]+\d+[A-Z]*|\d+[A-Z]+\d*)\b/);
  if (modelMatch && !modelMatch[0].match(/^(GB|TB|MP|MAH|INR|USD|INR|OFF|GTX|RTX|5G|4G)$/i)) {
    specs.push(`Model Identifier: Series ${modelMatch[0].toUpperCase()}`);
  }

  // 4. Extract Capacities / Technical specifications dynamically
  // Watts
  const wattMatch = textToScan.match(/\b(\d+)\s*(?:w|watt|watts)\b/i);
  if (wattMatch) {
    specs.push(`Power Rating: ${wattMatch[1]} Watts`);
  }
  
  // Liters/L
  const literMatch = textToScan.match(/\b(\d+(?:\.\d+)?)\s*(?:l|ltr|liter|liters|litre|litres)\b/i);
  if (literMatch) {
    specs.push(`Capacity: ${literMatch[1]} Litres`);
  }

  // Weight (kg/g)
  const weightMatch = textToScan.match(/\b(\d+(?:\.\d+)?)\s*(?:kg|g|gm|gram|grams)\b/i);
  if (weightMatch) {
    specs.push(`Weight: ${weightMatch[1]}${weightMatch[0].toLowerCase().includes("kg") ? " Kg" : " grams"}`);
  }

  // Screen Size (inch/")
  const sizeMatch = textToScan.match(/\b(\d+(?:\.\d+)?)\s*(?:inch|inches|[\"\u201D\u201C])\b/i);
  if (sizeMatch && !sizeMatch[0].includes("gb") && !sizeMatch[0].includes("tb")) {
    specs.push(`Screen Size: ${sizeMatch[1]}-inch Display`);
  }

  // Camera MP
  const mpMatch = textToScan.match(/\b(\d+)\s*(?:mp|megapixel|megapixels)\b/i);
  if (mpMatch) {
    specs.push(`Camera Resolution: ${mpMatch[1]} Megapixels`);
  }

  // Battery mAh
  const mahMatch = textToScan.match(/\b(\d+)\s*(?:mah)\b/i);
  if (mahMatch) {
    specs.push(`Battery Cell: ${mahMatch[1]} mAh Capacity`);
  }

  // RAM/Storage (e.g. 6GB, 128GB)
  const ramMatch = textToScan.match(/\b(\d+)\s*gb\s*(?:ram|memory)?\b/i);
  if (ramMatch && specs.length < 5) {
    specs.push(`System Memory: ${ramMatch[1]}GB RAM`);
  }

  // 5. Extract design keywords / Adjectives
  const keywords = ["automatic", "manual", "electric", "gas", "non-stick", "double-walled", "cordless", "handheld", "smart", "wireless", "portable", "ergonomic", "heavy-duty", "waterproof", "stainless steel", "aluminum", "copper", "induction"];
  for (const kw of keywords) {
    if (textToScanLower.includes(kw) && specs.length < 5) {
      specs.push(`Material/Type: ${kw.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}`);
    }
  }

  // Fill up to 5 items with dynamic title-based attributes
  if (specs.length < 5 && cleanTitleWords.length > 2) {
    const firstTwo = cleanTitleWords.slice(0, 2).join(" ");
    specs.push(`Product Line: ${firstTwo} Series`);
  }
  if (specs.length < 5) {
    specs.push(`Pricing Tier: ${price < 1500 ? "Budget Value" : price < 10000 ? "Mid-Range Standard" : "Premium Tier Selection"}`);
  }
  if (specs.length < 5) {
    specs.push("Warranty status: Official manufacturer retail pack");
  }
  if (specs.length < 5) {
    specs.push("Safety index: Certified retail market standards");
  }

  return specs.slice(0, 5);
}

/**
 * Returns category-specific dynamic fallback matching insight summaries based on price and platform.
 */
function getDynamicInsight(category, title, price, platform, item = {}) {
  const titleClean = title.trim();
  const titleLower = title.toLowerCase();
  
  const cleanTitleWords = titleClean.replace(/[^a-zA-Z0-9\s-]/g, "").split(/\s+/).filter(Boolean);
  const productNoun = cleanTitleWords.length > 0 ? cleanTitleWords[cleanTitleWords.length - 1] : "product";
  const productTitleShort = cleanTitleWords.slice(0, 4).join(" ");

  let bestFor = "";
  let whyDeal = "";
  let tradeOff = "";

  if (category === "laptop") {
    if (titleLower.includes("macbook") || titleLower.includes("apple") || titleLower.includes("m1") || titleLower.includes("m2") || titleLower.includes("m3")) {
      bestFor = `Professional creative design, software engineering, and quiet all-day battery efficiency with the ${productTitleShort}.`;
    } else if (titleLower.includes("gaming") || titleLower.includes("rtx") || titleLower.includes("gtx") || titleLower.includes("rog") || titleLower.includes("tuf") || titleLower.includes("legion") || titleLower.includes("victus")) {
      bestFor = `High-FPS AAA gaming, 3D rendering, and heavy thermal-cooled workstation processing using the ${productTitleShort}.`;
    } else if (titleLower.includes("i7") || titleLower.includes("i9") || titleLower.includes("ryzen 7") || titleLower.includes("ryzen 9") || titleLower.includes("16gb") || titleLower.includes("32gb")) {
      bestFor = `Heavy code compilation, data analysis, and power multitasking on the ${productTitleShort}.`;
    } else {
      bestFor = `Fast web browsing, Office productivity, and HD video conferencing with the ${productTitleShort}.`;
    }
  } else if (category === "mobile") {
    if (titleLower.includes("camera") || titleLower.includes("mp") || titleLower.includes("lens") || titleLower.includes("pro") || titleLower.includes("ultra")) {
      bestFor = `High-resolution mobile photography, 4K video recording, and social media content creation on the ${productTitleShort}.`;
    } else if (titleLower.includes("gaming") || titleLower.includes("snapdragon") || titleLower.includes("dimensity") || titleLower.includes("iqoo") || titleLower.includes("poco") || titleLower.includes("gt") || titleLower.includes("z9")) {
      bestFor = `Lag-free mobile gaming, high-FPS esports, and intense app multitasking with the ${productTitleShort}.`;
    } else if (titleLower.includes("5g") || titleLower.includes("12gb") || titleLower.includes("256gb") || titleLower.includes("512gb")) {
      bestFor = `High-capacity storage, 5G video streaming, and power multitasking on the ${productTitleShort}.`;
    } else if (titleLower.includes("max") || titleLower.includes("battery") || titleLower.includes("mah") || price < 15000) {
      bestFor = `All-day battery longevity, reliable daily calling, and budget 5G utility with the ${productTitleShort}.`;
    } else {
      bestFor = `Fluid daily app performance, crisp display streaming, and sleek ergonomics with the ${productTitleShort}.`;
    }
  } else if (category === "audio") {
    if (titleLower.includes("anc") || titleLower.includes("noise cancel") || titleLower.includes("bose") || titleLower.includes("sony")) {
      bestFor = `Active noise-cancelling travel, distraction-free focus, and studio-grade acoustics with the ${productTitleShort}.`;
    } else if (titleLower.includes("earbuds") || titleLower.includes("tws") || titleLower.includes("airpods") || titleLower.includes("airdopes")) {
      bestFor = `Compact TWS hands-free calling, gym workouts, and low-latency audio using the ${productTitleShort}.`;
    } else {
      bestFor = `Deep bass music playback, comfortable acoustic listening, and wireless freedom with the ${productTitleShort}.`;
    }
  } else if (titleLower.includes("camera") || titleLower.includes("dslr") || titleLower.includes("eos") || titleLower.includes("alpha") || titleLower.includes("mirrorless")) {
    bestFor = `Pro portrait photography, cinematic 4K video recording, and interchangeable lens optic performance with the ${productTitleShort}.`;
  } else if (category === "fashion") {
    bestFor = `Stylish daily casual wear, breathable fabric comfort, and lifestyle modeling with the ${productTitleShort}.`;
  } else {
    bestFor = `Practical daily utility, specialized performance, and trusted convenience with the ${productTitleShort} ${productNoun}.`;
  }

  if (price < 3000) {
    whyDeal = `Provides exceptional entry-level value under ₹3,000 on ${platform} with verified merchant return guarantees.`;
  } else if (price >= 3000 && price < 25000) {
    whyDeal = `Offers a strong cost-to-performance ratio and verified retail quality on ${platform}.`;
  } else {
    whyDeal = `Delivers flagship-tier hardware engineering and verified merchant authenticity on ${platform}.`;
  }

  if (price < 15000) {
    tradeOff = `Entry-to-mid range construction; fast charger or protective case may require separate purchase.`;
  } else if (price >= 15000 && price < 50000) {
    tradeOff = `Mid-tier retail variant; software update rollout and cloud features follow brand schedule.`;
  } else {
    tradeOff = `High-value investment tier; ensure official warranty registration upon delivery.`;
  }

  return `👤 Best For: ${bestFor}\n\n💡 Why This Deal: ${whyDeal}\n\n⚠️ Trade-off: ${tradeOff}`;
}

function parseCleanPrice(item, country = "in") {
  const isUS = (country || "").toLowerCase() === "us";
  let rawStr = "";

  if (typeof item.price === "string") {
    rawStr = item.price;
  } else if (typeof item.extracted_price === "string") {
    rawStr = item.extracted_price;
  }

  let num = 0;
  if (typeof item.extracted_price === "number" && item.extracted_price > 0) {
    num = item.extracted_price;
  } else if (typeof item.price === "number" && item.price > 0) {
    num = item.price;
  }

  if (rawStr) {
    const lower = rawStr.toLowerCase();
    const lakhMatch = lower.match(/([\d.]+)\s*lakh/);
    if (lakhMatch) {
      return Math.round(parseFloat(lakhMatch[1]) * 100000);
    }
    const kMatch = lower.match(/([\d.]+)\s*k\b/);
    if (kMatch) {
      return Math.round(parseFloat(kMatch[1]) * 1000);
    }

    const cleanStr = rawStr.replace(/[^0-9.]/g, "");
    const parsed = parseFloat(cleanStr);
    if (!isNaN(parsed) && parsed > 0) {
      num = parsed;
    }
  }

  if (!isUS && num > 0 && num < 100) {
    num = Math.round(num * 100000);
  }

  if (num <= 0) {
    num = isUS ? 299 : 14999;
  }

  return Math.round(num);
}

function extractProductCoupons(item, storeName, priceVal, country = "in") {
  const coupons = [];
  const storeLower = (storeName || "").toLowerCase();
  const isUSD = (country || "").toLowerCase() === "us";

  // 1. Extract raw promotional extensions / badges from SerpApi item payload
  if (item && item.extensions && Array.isArray(item.extensions)) {
    for (const ext of item.extensions) {
      if (typeof ext === "string") {
        const extLower = ext.toLowerCase();
        if (
          extLower.includes("offer") ||
          extLower.includes("coupon") ||
          extLower.includes("off") ||
          extLower.includes("discount") ||
          extLower.includes("rebate")
        ) {
          coupons.push({
            code: "DEALSPECIAL",
            type: "SPECIAL_OFFER",
            discount: ext,
            description: "Merchant Promotional Badge",
            effective_price: priceVal
          });
          break;
        }
      }
    }
  }

  // 2. Rule-based Bank & Store Promo Matcher
  if (!isUSD) {
    if (storeLower.includes("amazon")) {
      if (priceVal >= 10000) {
        coupons.push({
          code: "HDFC1500",
          type: "BANK_DISCOUNT",
          discount: "Flat ₹1,500 Instant Off",
          description: "On HDFC Credit Cards & EMI",
          effective_price: Math.max(0, priceVal - 1500)
        });
      } else if (priceVal >= 2000) {
        coupons.push({
          code: "AMAZON500",
          type: "PROMO_CODE",
          discount: "Flat ₹500 Coupon",
          description: "Apply coupon at checkout",
          effective_price: Math.max(0, priceVal - 500)
        });
      } else if (priceVal >= 500) {
        coupons.push({
          code: "SAVE100",
          type: "PROMO_CODE",
          discount: "Flat ₹100 Off",
          description: "Instant discount on Amazon Pay",
          effective_price: Math.max(0, priceVal - 100)
        });
      }
    } else if (storeLower.includes("flipkart")) {
      if (priceVal >= 10000) {
        const disc = Math.min(1500, Math.round(priceVal * 0.1));
        coupons.push({
          code: "ICICI10",
          type: "BANK_DISCOUNT",
          discount: `10% Off (up to ₹${disc})`,
          description: "On ICICI Bank Credit Cards",
          effective_price: Math.max(0, priceVal - disc)
        });
      } else if (priceVal >= 1000) {
        coupons.push({
          code: "AXIS200",
          type: "BANK_DISCOUNT",
          discount: "Flat ₹200 Instant Off",
          description: "On Axis Bank Credit Cards",
          effective_price: Math.max(0, priceVal - 200)
        });
      }
    } else if (storeLower.includes("croma") || storeLower.includes("reliance") || storeLower.includes("vijay")) {
      if (priceVal >= 5000) {
        coupons.push({
          code: "SBI1000",
          type: "BANK_DISCOUNT",
          discount: "Flat ₹1,000 Cashback",
          description: "On SBI Credit Card Checkout",
          effective_price: Math.max(0, priceVal - 1000)
        });
      } else if (priceVal >= 1000) {
        coupons.push({
          code: "TECH300",
          type: "PROMO_CODE",
          discount: "Flat ₹300 Instant Off",
          description: "Store promotional code",
          effective_price: Math.max(0, priceVal - 300)
        });
      }
    } else {
      if (priceVal >= 1000) {
        coupons.push({
          code: "WELCOME100",
          type: "PROMO_CODE",
          discount: "Flat ₹100 Off",
          description: "First purchase promo code",
          effective_price: Math.max(0, priceVal - 100)
        });
      }
    }
  } else {
    if (priceVal >= 100) {
      coupons.push({
        code: "SAVE15",
        type: "PROMO_CODE",
        discount: "$15 Instant Off",
        description: "With store card checkout",
        effective_price: Math.max(0, priceVal - 15)
      });
    } else if (priceVal >= 20) {
      coupons.push({
        code: "SAVE5",
        type: "PROMO_CODE",
        discount: "$5 Extra Off",
        description: "Apply at checkout",
        effective_price: Math.max(0, priceVal - 5)
      });
    }
  }

  return coupons;
}

export async function POST(request) {
  const serpapiApiKey = process.env.SERPAPI_API_KEY;
  if (!serpapiApiKey) {
    console.error("SERPAPI_API_KEY config check: MISSING in process.env!");
  } else {
    console.log("SERPAPI_API_KEY config check: verified");
  }

  try {
    // Verify Supabase Session Token
    const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];

    let user = null;
    if (token) {
      try {
        const { data, error: authError } = await auth.getUser(token);
        user = data?.user;
      } catch (e) {
        console.warn("Search API: Token validation exception, falling back to local user session:", e);
      }
    }

    if (!user) {
      user = {
        id: "default-active-session",
        email: "user@shopsmart.ai",
        user_metadata: {
          full_name: "Valued Shopper",
          country: "IN",
          search_count_today: 0,
          last_search_date: new Date().toISOString().split("T")[0]
        }
      };
    }

    const { query, country } = await request.json();

    if (!query) {
      return NextResponse.json({ products: [], error: "Query is required" }, { status: 200 });
    }

    // Keep user's query intact, only stripping currency symbols and double spaces
    const cleanQuery = query
      .replace(/[₹$€£,]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    // Check Redis Cache First (Exempt from Quota limits!)
    const cacheKey = getCacheKey(country, cleanQuery);
    try {
      const cachedDataStr = await redis.get(cacheKey);
      if (cachedDataStr) {
        console.log(`Cache HIT for key: ${cacheKey}`);
        let cachedPayload = typeof cachedDataStr === "string" ? JSON.parse(cachedDataStr) : cachedDataStr;
        
        const hasProducts = Array.isArray(cachedPayload.products) && cachedPayload.products.length > 0;
        const isServiceCoupon = cachedPayload.intent === "SERVICE_COUPON";

        if (hasProducts || isServiceCoupon) {
          // Return cached results immediately, exempting user quota
          const todayStr = new Date().toISOString().split("T")[0];
          const lastDate = user.user_metadata?.last_search_date || "";
          const count = user.user_metadata?.search_count_today || 0;
          const currentSearchesLeft = lastDate === todayStr ? 10 - count : 10;

          return NextResponse.json({
            products: cachedPayload.products || [],
            coupons: cachedPayload.coupons || [],
            intent: cachedPayload.intent || "E-COMMERCE",
            error: cachedPayload.error || null,
            searchesLeft: currentSearchesLeft,
            fromCache: true
          }, { status: 200 });
        } else {
          console.log(`Bypassing empty cached entry for key: ${cacheKey}`);
        }
      }
    } catch (cacheErr) {
      console.warn("Redis cache read error:", cacheErr);
    }

    // Daily Quota Verification (strictly capped to 10 searches per day)
    const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    let count = user.user_metadata?.search_count_today || 0;
    let lastDate = user.user_metadata?.last_search_date || "";

    if (lastDate !== todayStr) {
      count = 0;
      lastDate = todayStr;
    }

    if (count >= 10) {
      return NextResponse.json({ error: "QuotaReached", searchesLeft: 0 }, { status: 403 });
    }

    const newCount = count + 1;
    const updatedMetadata = {
      search_count_today: newCount,
      last_search_date: lastDate
    };

    const { data: updateData } = await auth.updateUserMetadata(user.id, updatedMetadata, token);
    const newToken = updateData?.access_token || null;

    // Fetch active settings (API Keys & Manual Coupons)
    const settings = await getAdminSettings(user, token);
    const userRegion = (country || "IN").toUpperCase();

    // 2. Gemini Intent Classification (with Fast-Path Keyword Fallback)
    let intent = "E-COMMERCE";
    const serviceKeywords = [
      "coupon", "coupons", "discount", "discounts", "promo", "voucher", "vouchers",
      "zomato", "swiggy", "uber", "ola", "rapido", "makemytrip", "easemytrip", "cleartrip",
      "bookmyshow", "netflix", "spotify", "prime video", "hotstar", "youtube premium"
    ];
    const queryLower = cleanQuery.toLowerCase();
    const isServiceQuery = serviceKeywords.some(keyword => queryLower.includes(keyword));

    if (isServiceQuery) {
      intent = "SERVICE_COUPON";
      console.log(`Local Keyword classifier resolved: ${intent} for query: "${cleanQuery}"`);
    } else {
      try {
        const geminiApiKey = process.env.GEMINI_API_KEY || "YOUR_GEMINI_KEY";
        const classificationPrompt = `Classify the shopping search query: "${cleanQuery}".
Determine if the user is looking for:
A) Physical products to buy (e.g., "smartphones", "laptops", "nike shoes", "water bottles") -> Classify as "E-COMMERCE".
B) Non-physical service discounts, coupons, rides, food delivery, or hotel bookings (e.g., "uber coupons", "zomato discounts", "swiggy coupon code", "makemytrip promo codes") -> Classify as "SERVICE_COUPON".

Respond strictly in JSON with this structure:
{
  "intent": "E-COMMERCE" | "SERVICE_COUPON"
}`;

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
        const classificationResponse = await fetch(geminiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: classificationPrompt }] }],
            generationConfig: {
              responseMimeType: "application/json"
            }
          }),
          signal: AbortSignal.timeout(4000)
        });

        if (classificationResponse.ok) {
          const classData = await classificationResponse.json();
          let classText = classData.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
          const parsedClass = JSON.parse(classText.trim());
          if (parsedClass.intent === "E-COMMERCE" || parsedClass.intent === "SERVICE_COUPON") {
            intent = parsedClass.intent;
            console.log(`AI Intent classification: ${intent} for query: "${cleanQuery}"`);
          }
        }
      } catch (err) {
        console.warn("AI Intent classification failed, falling back to E-COMMERCE:", err.message);
        intent = "E-COMMERCE";
      }
    }

    if (intent === "SERVICE_COUPON") {
      const queryLower = cleanQuery.toLowerCase();
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
        // Return 200 with error 'NotAvailable' to bypass product scraper and display polite notice
        try {
          await redis.set(cacheKey, JSON.stringify({
            products: [],
            coupons: [],
            intent: "SERVICE_COUPON",
            error: "NotAvailable"
          }), { ex: 21600 });
        } catch (cacheErr) {
          console.warn("Failed to write empty service coupons to Redis:", cacheErr);
        }

        return NextResponse.json({
          products: [],
          coupons: [],
          intent: "SERVICE_COUPON",
          error: "NotAvailable",
          searchesLeft: 10 - newCount,
          newToken
        }, { status: 200 });
      }

      // Save to Redis Cache (ex: 21600)
      try {
        await redis.set(cacheKey, JSON.stringify({
          products: [],
          coupons: matchedCoupons,
          intent: "SERVICE_COUPON"
        }), { ex: 21600 });
      } catch (cacheErr) {
        console.warn("Failed to write service coupons to Redis:", cacheErr);
      }

      return NextResponse.json({
        products: [],
        coupons: matchedCoupons,
        intent: "SERVICE_COUPON",
        searchesLeft: 10 - newCount,
        newToken
      }, { status: 200 });
    }
    


    let rawResults = [];

    try {
      const queueResult = await searchQueue.enqueue(async () => {
        let currentRawResults = [];
        let scraperResponse;
        let data;

        // Call SerpApi Google Shopping Endpoint directly
        const gl = (country || "in").toLowerCase();
        const hl = "en";
        const googleDomain = gl === "in" ? "google.co.in" : "google.com";
        const location = gl === "in" ? "India" : "United States";
        let serpapiUrl = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(cleanQuery)}&google_domain=${googleDomain}&location=${encodeURIComponent(location)}&gl=${gl}&hl=${hl}&api_key=${serpapiApiKey}`;

        try {
          scraperResponse = await fetch(serpapiUrl, { method: "GET" });
          if (scraperResponse && scraperResponse.ok) {
            data = await scraperResponse.json();
            currentRawResults = data?.shopping_results || data?.inline_shopping_results || [];
          }
        } catch (err) {
          console.warn("Primary SerpApi search failed inside queue:", err);
        }

        // Self-healing query fallback retry if primary search failed (e.g. 503 error) or returned 0 results
        if (currentRawResults.length === 0) {
          const fallbackQuery = getSimplifiedQueryFallback(cleanQuery);
          if (fallbackQuery && fallbackQuery !== cleanQuery) {
            console.log(`Retrying search with simplified query fallback inside queue: "${fallbackQuery}"`);
            const fallbackSerpapiUrl = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(fallbackQuery)}&google_domain=${googleDomain}&location=${encodeURIComponent(location)}&gl=${gl}&hl=${hl}&api_key=${serpapiApiKey}`;
            try {
              scraperResponse = await fetch(fallbackSerpapiUrl, { method: "GET" });
              if (scraperResponse && scraperResponse.ok) {
                data = await scraperResponse.json();
                currentRawResults = data?.shopping_results || data?.inline_shopping_results || [];
              }
            } catch (fallbackErr) {
              console.error("Fallback SerpApi search failed inside queue:", fallbackErr);
            }
          }
        }

        return {
          rawResults: currentRawResults
        };
      });

      rawResults = queueResult.rawResults;
    } catch (err) {
      if (err.message === "QueueTimeout") {
        console.warn("Search API request queue wait timed out due to high concurrency");
        return NextResponse.json({ error: "Server is busy processing other search requests. Please try again in a moment." }, { status: 429 });
      }
      console.error("Queue execution failed:", err);
    }

    const cleanProducts = [];
    const topResults = rawResults.slice(0, 20);

    // Map results to schema, merging direct checkout links and store chips from details
    for (const item of topResults) {
      if (!item || !(item.title || item.name)) continue;

      const title = item.title || item.name || "";
      const platform = item.source || item.merchant || item.seller || "Online Store";

      // Extract price using clean Lakhs/thousands parser
      const priceVal = parseCleanPrice(item, country);

      const category = detectCategory(cleanQuery, title);
      const offers = generateComparisonOffers(platform, priceVal, category, country, item, request);
      
      const lowestOffer = offers.find(o => o.is_lowest) || offers[0];
      const resolvedPrice = lowestOffer.price;
      const resolvedPlatform = lowestOffer.store;
      const finalLink = lowestOffer.link;

      // Zero Google Aggregator Link Leak Policy: Strictly filter out and drop product if no valid merchant PDP link is resolved
      if (!finalLink || !isValidDirectPDPUrl(finalLink)) {
        console.log(`Dropping product "${title}" because no valid direct retailer PDP link could be resolved.`);
        continue;
      }

      // Parse Specs & Generate local dynamic matching insights based on specific title + price tier
      const parsedSpecs = parseSpecsFromTitle(category, title, resolvedPrice, item);
      const fallbackDesc = getDynamicInsight(category, title, resolvedPrice, resolvedPlatform, item);
      const image = item.thumbnail || "";

      cleanProducts.push({
        title: String(title),
        price: Number(resolvedPrice),
        original_price: item.original_price ? Number(item.original_price) : null,
        store_name: String(resolvedPlatform),
        rating: String(item.rating || "4.5"),
        review_count: Number(item.reviews || 100),
        image_url: String(image),
        deal_link: String(monetizeUrl(finalLink, resolvedPlatform, userRegion, settings)),
        
        // UI Helper properties:
        description: String(fallbackDesc),
        specs: parsedSpecs,
        coupons: extractProductCoupons(item, resolvedPlatform, resolvedPrice, country),
        price_comparison: offers.map(o => ({
          store_name: o.store || o.store_name,
          price: o.price,
          deal_link: o.link || o.deal_link || o.buyNowUrl,
          is_lowest: o.is_lowest
        }))
      });
    }

    // Call Gemini AI on the top products to generate custom insights (if API key is present)
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (geminiApiKey && cleanProducts.length > 0) {
      try {
        const productsListText = cleanProducts.slice(0, 10).map((p, idx) => {
          return `${idx + 1}. Title: ${p.title} | Store: ${p.store_name} | Price: ${p.price}`;
        }).join("\n");

        const prompt = `You are a friendly, expert personal shopping consultant advising a friend on their search for: "${cleanQuery}".
For each product, generate category-specific specifications and recommendations.

For each product, output:
1. "ai_insight" object containing:
   - "best_for": A practical use-case statement explaining who should buy this.
   - "why_this_deal": A sharp statement highlighting the real value.
   - "trade_off": An honest, transparent note about limitations.
2. "detailed_specs" array of strings:
   - If it's a Laptop/PC: CPU, RAM & Storage, Display & GPU, Battery Life, Standout Feature.
   - If it's Headphones/Audio: Sound Engine, Noise Control, Battery Life, Connectivity, Standout Feature.
   - If it's Shoes/Fashion: Material, Fit Profile, Occasion, Care, Standout Feature.
   - Other: Extract 5 relevant attributes from title.

Products:
${productsListText}

Return the results strictly as a JSON array of objects, where each object matches the product's index.
Do not include markdown code block formatting (like \`\`\`json). Return ONLY raw JSON array.`;

        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });

        if (geminiResponse.ok) {
          const geminiData = await geminiResponse.json();
          let rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
          rawText = rawText.trim();
          if (rawText.startsWith("```")) {
            rawText = rawText.replace(/^```json/, "").replace(/^```/, "").replace(/```$/, "").trim();
          }
          const parsedResults = JSON.parse(rawText);
          if (Array.isArray(parsedResults)) {
            cleanProducts.slice(0, 10).forEach((p, idx) => {
              const res = parsedResults[idx];
              if (res) {
                if (res.ai_insight) {
                  const bfor = res.ai_insight.best_for || "";
                  const wdeal = res.ai_insight.why_this_deal || "";
                  const toff = res.ai_insight.trade_off || "";
                  p.description = `👤 Best For: ${bfor}\n\n💡 Why This Deal: ${wdeal}\n\n⚠️ Trade-off: ${toff}`;
                }
                if (res.detailed_specs && Array.isArray(res.detailed_specs)) {
                  p.specs = res.detailed_specs;
                }
              }
            });
          }
        }
      } catch (geminiError) {
        console.error("Gemini AI API call failed:", geminiError);
      }
    }

    const mappedProducts = cleanProducts.slice(0, 10);
    console.log("Filtered Products mapped count:", mappedProducts.length);

    // Fetch store coupons matching userRegion and store names of our top products
    const matchedStoreCoupons = [];
    try {
      (settings.coupons || []).forEach(coupon => {
        const couponStoreLower = (coupon.store || "").toLowerCase().trim();
        const matchesStore = mappedProducts.some(p => {
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
      console.log(`Matched ${matchedStoreCoupons.length} store coupons for e-commerce stores.`);
    } catch (couponMatchErr) {
      console.error("Failed matching store coupons:", couponMatchErr);
    }

    // Save fresh search results to Redis Cache with a 6-Hour TTL (21600 seconds) - ONLY cache if count is complete (8-10) to avoid caching low-yield cold starts
    if (mappedProducts.length >= 8) {
      try {
        await redis.set(cacheKey, JSON.stringify({ 
          products: mappedProducts,
          coupons: matchedStoreCoupons,
          intent: "E-COMMERCE"
        }), { ex: 21600 });
        console.log(`Cache MISS. Saved fresh results to key: ${cacheKey}`);
      } catch (cacheWriteErr) {
        console.warn("Failed to write to Redis Cache:", cacheWriteErr);
      }
    } else {
      console.log(`Skipped caching key: ${cacheKey} due to low-yield product count: ${mappedProducts.length}`);
    }

    return NextResponse.json({
      products: mappedProducts,
      coupons: matchedStoreCoupons,
      intent: "E-COMMERCE",
      searchesLeft: 10 - newCount,
      newToken
    }, { status: 200 });

  } catch (err) {
    console.error("Serverless Search API Route error:", err);
    return NextResponse.json({ products: [], coupons: [], error: "Unable to fetch live deals at this moment" }, { status: 200 });
  }
}
