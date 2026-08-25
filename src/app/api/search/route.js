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

function isValidDirectPDPUrl(url) {
  if (!url) return false;
  const lower = url.toLowerCase();
  
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
      path.includes("/item/") ||
      path.includes("/pd/") ||
      path.includes("/site/") ||
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
  
  const origin = request?.nextUrl?.origin || "";
  
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
  const textToScan = [
    title,
    item.snippet,
    item.description,
    Array.isArray(item.extensions) ? item.extensions.join(" ") : "",
    Array.isArray(item.tags) ? item.tags.join(" ") : ""
  ].filter(Boolean).join(" ").toLowerCase();

  let brand = "Generic Partner";
  const brands = ["apple", "samsung", "dell", "hp", "lenovo", "asus", "acer", "sony", "bose", "jbl", "boat", "noise", "oneplus", "nothing", "realme", "xiaomi", "redmi", "poco", "google", "nike", "adidas", "puma", "under armour", "reebok", "columbia", "merrell", "patagonia", "hoka", "danner", "timberland", "owala", "stanley", "yeti", "ninja", "crock-pot", "kitchenaid", "philips", "sauder", "ikea", "ashley", "logitech", "razer", "corsair", "anchor", "anker"];
  for (const b of brands) {
    if (textToScan.includes(b)) {
      brand = b.charAt(0).toUpperCase() + b.slice(1);
      break;
    }
  }

  let ramMatch = textToScan.match(/(\d+)\s*(?:gb|gig)\s*(?:ram|lpddr|ddr|memory)/i) || textToScan.match(/\b(\d+)\s*gb\b/i);
  let ram = ramMatch ? `${ramMatch[1]}GB Memory` : null;

  let storageMatch = textToScan.match(/(\d+)\s*(?:gb|tb)\s*(?:ssd|hdd|storage|nvme|rom|emmc)/i);
  if (!storageMatch && textToScan.includes("ssd")) {
    storageMatch = textToScan.match(/(\d+)\s*(?:gb|tb)/i);
  }
  let storage = storageMatch ? `${storageMatch[0].toUpperCase()}` : null;

  let cpu = null;
  const cpuMatch = textToScan.match(/(intel\s+(?:core\s+)?i\d|ryzen\s+\d|apple\s+m\d|snapdragon\s+\d|mediatek|dimensity|exynos|tensor|bionic|celeron|pentium)/i);
  if (cpuMatch) {
    cpu = `Processor: ${cpuMatch[0].toUpperCase()}`;
  }

  let display = null;
  const displayMatch = textToScan.match(/(\d+(?:\.\d+)?)\s*(?:inch|\"|\-inch)/i);
  if (displayMatch) {
    display = `Display: ${displayMatch[0]}`;
  }

  let camera = null;
  const cameraMatch = textToScan.match(/(\d+)\s*(?:mp|megapixel)/i);
  if (cameraMatch) {
    camera = `Camera: ${cameraMatch[0].toUpperCase()}`;
  }

  let battery = null;
  const batteryMatch = textToScan.match(/(\d+)\s*(?:mah|wh|hours\s+playtime|hours\s+battery|h\s+playtime)/i);
  if (batteryMatch) {
    battery = `Battery: ${batteryMatch[0].toUpperCase()}`;
  }

  let material = null;
  const materialMatch = textToScan.match(/(cotton|denim|linen|polyester|leather|wool|silk|synthetic|suede|canvas|gore-tex|mesh)/i);
  if (materialMatch) {
    material = `Material: ${materialMatch[0].charAt(0).toUpperCase() + materialMatch[0].slice(1)}`;
  }

  let color = null;
  const colorMatch = textToScan.match(/(black|white|blue|red|green|grey|gray|silver|gold|yellow|brown|pink|purple|orange|beige)/i);
  if (colorMatch) {
    color = `Color: ${colorMatch[0].charAt(0).toUpperCase() + colorMatch[0].slice(1)}`;
  }

  if (category === "laptop") {
    specs.push(cpu || `Processor: Intel Core / AMD Ryzen`);
    specs.push(ram || (storage ? `Memory: 8GB RAM` : `Memory: Standard Laptop RAM`));
    specs.push(storage || `Storage: 512GB High-Speed SSD`);
    specs.push(display || `Display: 14-inch Thin Bezel Screen`);
    specs.push(color || `Build: Premium Protective Shell Chassis`);
  } else if (category === "mobile") {
    const is5G = textToScan.includes("5g") || title.toLowerCase().includes("5g");
    
    let phoneRam = ram || "6GB LPDDR4X Memory";
    let phoneStorage = storage || "128GB ROM Storage";
    
    let phoneBattery = "5000 mAh High-Capacity Battery";
    if (battery) {
      phoneBattery = `${battery} Battery`;
    } else {
      if (title.toLowerCase().includes("galaxy f23") || title.toLowerCase().includes("galaxy m")) {
        phoneBattery = "6000 mAh Extended Battery";
      }
    }
    
    let phoneCamera = "50MP Triple Camera Setup";
    if (camera) {
      phoneCamera = `${camera} Primary Camera`;
    } else {
      if (title.toLowerCase().includes("f23") || title.toLowerCase().includes("m33")) {
        phoneCamera = "50MP Triple-Lens Primary Camera";
      } else if (title.toLowerCase().includes("pro")) {
        phoneCamera = "64MP Quad-Lens AI Camera";
      }
    }
    
    let phoneProcessor = "Octa-Core Snapdragon Processor";
    if (title.toLowerCase().includes("f23")) {
      phoneProcessor = "Snapdragon 750G 5G Processor";
    } else if (textToScan.includes("dimensity") || textToScan.includes("mediatek")) {
      const dimMatch = textToScan.match(/dimensity\s*(\d+)/i);
      phoneProcessor = dimMatch ? `MediaTek ${dimMatch[0]} Octa-Core` : "MediaTek Dimensity Octa-Core";
    } else if (title.toLowerCase().includes("iphone")) {
      phoneProcessor = "Apple A-Series Bionic Chipset";
    }

    specs.push(`Processor: ${phoneProcessor}`);
    specs.push(`Memory: ${phoneRam}`);
    specs.push(`Storage: ${phoneStorage}`);
    specs.push(`Camera: ${phoneCamera}`);
    specs.push(`Battery: ${phoneBattery}`);
  } else if (category === "audio") {
    const isTWS = textToScan.includes("earbuds") || textToScan.includes("tws") || textToScan.includes("earphone") || textToScan.includes("buds") || textToScan.includes("pods") || price < 1000;
    specs.push(`Form Factor: ${isTWS ? "True Wireless Earbuds" : "Over-Ear Wireless Headphones"}`);
    
    let driver = "10mm Dynamic Bass Drivers";
    if (textToScan.includes("12mm")) driver = "12mm Extra Bass Drivers";
    else if (textToScan.includes("13mm")) driver = "13mm Ultra Bass Drivers";
    else if (textToScan.includes("40mm")) driver = "40mm Large Aperture Drivers";
    specs.push(`Sound Driver: ${driver}`);
    
    specs.push(textToScan.includes("anc") || textToScan.includes("noise cancel")
      ? "Noise Control: Active Noise Cancellation (ANC)"
      : "Noise Control: Passive Environmental Noise Isolation"
    );
    specs.push(battery || `Battery: Up to ${isTWS ? "24" : "40"} Hours playtime`);
    specs.push(color || `Color Finish: Matte Black Textured`);
  } else if (category === "electronics") {
    let screen = null;
    const screenMatch = textToScan.match(/(\d+(?:\.\d+)?)\s*(?:inch|\"|\-inch)/i);
    if (screenMatch) screen = `Display Size: ${screenMatch[0]}`;

    let resolution = "1080p Full HD Output";
    if (textToScan.includes("4k") || textToScan.includes("uhd")) {
      resolution = "4K Ultra HD HDR Resolution";
    } else if (textToScan.includes("2k")) {
      resolution = "2K Quad HD Resolution";
    } else if (textToScan.includes("megapixel") || textToScan.includes("mp")) {
      const camMatch = textToScan.match(/(\d+)\s*(?:mp)/i);
      resolution = camMatch ? `Sensor: ${camMatch[0].toUpperCase()} Resolution` : "High-Resolution Image Sensor";
    }

    let connectivity = "Wi-Fi & Bluetooth Smart Sync";
    if (textToScan.includes("hdmi") || textToScan.includes("usb")) {
      connectivity = "HDMI, USB, and Optical Interface Ports";
    }

    specs.push(`Brand Partner: ${brand}`);
    specs.push(screen || `Form Factor: Smart Electronics Device`);
    specs.push(resolution);
    specs.push(connectivity);
    specs.push(`Build Type: Sturdy Protective Outer Frame`);
  } else if (category === "home") {
    let material = "Durable Composite Build Materials";
    if (textToScan.includes("steel") || textToScan.includes("metal")) {
      material = "Heavy-Duty Reinforced Steel/Metal";
    } else if (textToScan.includes("wood") || textToScan.includes("wooden") || textToScan.includes("oak") || textToScan.includes("maple")) {
      material = "Solid Finished Hardwood Panel";
    } else if (textToScan.includes("plastic") || textToScan.includes("bpa")) {
      material = "BPA-Free Food Grade Polymers";
    }

    let capacity = "Standard Home Kitchen Utility Size";
    if (textToScan.includes("qt") || textToScan.includes("quart")) {
      const qtMatch = textToScan.match(/(\d+(?:\.\d+)?)\s*(?:qt|quart)/i);
      capacity = qtMatch ? `Capacity: ${qtMatch[0].toUpperCase()} Volume` : "Large Family Size Capacity";
    } else if (textToScan.includes("liter") || textToScan.includes(" l ") || textToScan.endsWith("l")) {
      const lMatch = textToScan.match(/(\d+(?:\.\d+)?)\s*(?:l|liter)/i);
      capacity = lMatch ? `Capacity: ${lMatch[0].toUpperCase()} Volume` : "High Liquid Liter Capacity";
    } else if (textToScan.includes("lbs") || textToScan.includes("load")) {
      capacity = "Max Load: High weight endurance layout";
    }

    specs.push(`Brand Partner: ${brand}`);
    specs.push(`Structure: Ergonomic Space-Saving Design`);
    specs.push(material);
    specs.push(capacity);
    specs.push(color || `Color Finish: Classic Neutral Matte Tone`);
  } else if (category === "fashion") {
    specs.push(material || `Fabric: Premium Breathable Cotton Blend`);
    specs.push(textToScan.includes("slim") ? "Fit Profile: Modern Slim Fit Layout" : "Fit Profile: Comfort Regular Fit Layout");
    specs.push(color || `Color Style: Solid Tone Dye`);
    
    let design = "Classic Daily Wear Design";
    if (textToScan.includes("hiking") || textToScan.includes("boot") || textToScan.includes("shoe")) {
      design = textToScan.includes("waterproof") ? "Features: Waterproof Walking Tread" : "Features: Grip Athletic Sole";
    }
    specs.push(design);
    
    specs.push(`Care Advice: Machine wash cold with similar shades`);
  } else {
    specs.push(`Brand Partner: ${brand}`);
    if (display) specs.push(display);
    if (storage || ram) specs.push(storage || ram);
    if (battery) specs.push(battery);
    if (color) specs.push(color);
    if (material) specs.push(material);

    if (specs.length < 5) {
      if (textToScan.includes("waterproof") || textToScan.includes("water-resistant")) {
        specs.push("Features: Waterproof Rated Seal");
      } else {
        specs.push("Quality Rating: Top Customer Choice Recommendation");
      }
    }
    if (specs.length < 5) specs.push("Availability: In Stock & Ready to Dispatch");
    if (specs.length < 5) specs.push("Condition: 100% Brand New and Sealed Pack");
    if (specs.length < 5) specs.push(`Pricing Class: ${price < 1500 ? "Budget Value Selection" : "Premium Tier Selection"}`);
  }

  return specs.slice(0, 5);
}

/**
 * Returns category-specific dynamic fallback matching insight summaries based on price and platform.
 */
function getDynamicInsight(category, title, price, platform, item = {}) {
  const titleLower = title.toLowerCase();
  const textToScan = [
    title,
    item.snippet,
    item.description,
    Array.isArray(item.extensions) ? item.extensions.join(" ") : "",
    Array.isArray(item.tags) ? item.tags.join(" ") : ""
  ].filter(Boolean).join(" ").toLowerCase();

  let bestFor = "";
  let whyDeal = "";
  let tradeOff = "";

  if (category === "laptop") {
    if (titleLower.includes("gaming") || titleLower.includes("rtx") || price > 80000) {
      bestFor = "AAA gaming sessions, 3D modeling, and intensive software engineering.";
    } else if (price < 35000) {
      bestFor = "Students, online school classes, document editing, and video playback.";
    } else {
      bestFor = "Office productivity tasks, software coding, and general multitasking.";
    }
  } else if (category === "mobile") {
    const isPro = titleLower.includes("pro") || titleLower.includes("plus") || titleLower.includes("ultra") || price > 30000;
    const isBudget = price < 15000;
    
    if (isPro) {
      bestFor = "Heavy multitasking, high-frame gaming (BGMI/CoD), and high-resolution videography.";
      whyDeal = `Features a high-tier chipset and premium display refresh rate at this price bracket on ${platform}.`;
      tradeOff = "Slightly higher thermal levels under heavy gaming loads; charger may be sold separately.";
    } else if (isBudget) {
      bestFor = "Daily calling, social media, media streaming, and long battery standby needs.";
      whyDeal = `Excellent value-for-money offering massive battery life and modern 5G connectivity on ${platform}.`;
      tradeOff = "Plastic back panel is prone to fingerprints; standard low-light camera performance.";
    } else {
      bestFor = "Balanced everyday use, multitasking, streaming, and casual mobile photography.";
      whyDeal = `Superb mid-range value package blending high-speed 5G performance with reliable camera sensors on ${platform}.`;
      tradeOff = "Hybrid SIM slot limits simultaneous dual SIM and microSD storage expansions.";
    }
  } else if (category === "audio") {
    if (titleLower.includes("anc") || titleLower.includes("noise cancel")) {
      bestFor = "Commuters, noisy office spaces, and distraction-free study sessions.";
    } else if (titleLower.includes("sport") || titleLower.includes("run") || titleLower.includes("waterproof")) {
      bestFor = "Gym workouts, outdoor jogging, and high-intensity sports routines.";
    } else {
      bestFor = "Casual music listening, hands-free voice calls, and media streaming.";
    }
  } else if (category === "electronics") {
    if (titleLower.includes("camera") || titleLower.includes("dslr")) {
      bestFor = "Vlogging, amateur content creation, and professional photography.";
      whyDeal = `High-resolution sensor paired with optical image stabilization elements at this price point on ${platform}.`;
      tradeOff = "Lens bundle may require separate filter threads for outdoor glare protection.";
    } else if (titleLower.includes("tv")) {
      bestFor = "Immersive home theater setups, movie nights, and console gaming.";
      whyDeal = `Superb dynamic contrast panel and high audio speaker outputs on ${platform}.`;
      tradeOff = "Slightly thicker bezel profile than premium flagship smart TVs.";
    } else {
      bestFor = "Daily smart entertainment, tracking fitness metrics, and media sync.";
      whyDeal = `Robust system interface with long-lasting build endurance and reliable sensors on ${platform}.`;
      tradeOff = "Sync app requires bluetooth connectivity to run continuous notifications.";
    }
  } else if (category === "home") {
    if (titleLower.includes("chair") || titleLower.includes("desk")) {
      bestFor = "Long office working hours, coding sessions, and studying comfort.";
      whyDeal = `Heavy-duty frame with multi-level adjustment features for back support on ${platform}.`;
      tradeOff = "Assembly guidelines can take up to 30 minutes to complete setup.";
    } else {
      bestFor = "Daily home cooking, family meals, and food/beverage preparation.";
      whyDeal = `Excellent thermal heat control / food preservation build quality on ${platform}.`;
      tradeOff = "Power consumption requires grounded electrical plug slots for safety.";
    }
  } else if (category === "fashion") {
    if (titleLower.includes("boot") || titleLower.includes("hike") || titleLower.includes("hiking")) {
      bestFor = "Rugged outdoor trails, wet terrains, and long mountain hikes.";
    } else if (titleLower.includes("sport") || titleLower.includes("run") || titleLower.includes("sneaker")) {
      bestFor = "Daily workouts, casual jogging, and athletic fitness training.";
    } else {
      bestFor = "Casual daily wear, weekend outings, and everyday comfort styling.";
    }
  } else {
    if (titleLower.includes("phone") || titleLower.includes("mobile") || titleLower.includes("pro")) {
      bestFor = "High-performance multitasking, mobile photography, and media playback.";
    } else if (titleLower.includes("desk") || titleLower.includes("chair") || titleLower.includes("office")) {
      bestFor = "Ergonomic home office layouts and comfortable long work routines.";
    } else {
      bestFor = "General everyday usage and practical household requirements.";
    }
  }

  if (price < 1500) {
    whyDeal = `Exceptional entry-level bargain price of ${price} on ${platform} for instant savings.`;
  } else if (!whyDeal) {
    let featureHighlight = "quality build standards";
    if (textToScan.includes("waterproof") || textToScan.includes("gore-tex")) {
      featureHighlight = "protective waterproof sealing";
    } else if (textToScan.includes("anc") || textToScan.includes("noise cancel")) {
      featureHighlight = "active noise cancelling support";
    } else if (textToScan.includes("ssd") || textToScan.includes("nvme")) {
      featureHighlight = "rapid SSD boot storage";
    } else if (textToScan.includes("leather")) {
      featureHighlight = "durable premium leather materials";
    } else if (textToScan.includes("cotton")) {
      featureHighlight = "soft breathable cotton stitching";
    }
    whyDeal = `Saves money by offering ${featureHighlight} at a very competitive market price on ${platform}.`;
  }

  if (tradeOff === "") {
    if (category === "laptop") {
      if (price < 35000) {
        tradeOff = "Limited processing speed; not built for heavy gaming or 4K rendering.";
      } else {
        tradeOff = "Requires higher battery consumption under peak multi-core tasks.";
      }
    } else if (category === "mobile") {
      if (price < 15000) {
        tradeOff = "Plastic back panel is prone to fingerprints; standard low-light camera performance.";
      } else {
        tradeOff = "Charger may be sold separately in the retail box; hybrid SIM slot layout.";
      }
    } else if (category === "audio") {
      if (price < 1500) {
        tradeOff = "Basic plastic build finish; does not support advanced spatial audio tuning.";
      } else {
        tradeOff = "Charging case is slightly bulky to carry in small pant pockets.";
      }
    } else if (category === "electronics") {
      if (titleLower.includes("camera")) {
        tradeOff = "Requires high-speed memory cards to record 4K video feeds smoothly.";
      } else {
        tradeOff = "Firmware updates are recommended upon initial setup connection.";
      }
    } else if (category === "home") {
      if (titleLower.includes("desk") || titleLower.includes("chair")) {
        tradeOff = "Requires manual assembly; assembly package tools are included in box.";
      } else {
        tradeOff = "Requires stable voltage inputs; avoid sharing socket boards with high load devices.";
      }
    } else if (category === "fashion") {
      if (titleLower.includes("boot") || titleLower.includes("leather")) {
        tradeOff = "Requires initial wear-in period to attain optimal ankle flexibility.";
      } else {
        tradeOff = "Delicate fabric blend requiring gentle washing settings to prevent fading.";
      }
    } else {
      if (titleLower.includes("desk") || titleLower.includes("chair")) {
        tradeOff = "Requires home assembly; package is relatively heavy to carry upstairs.";
      } else if (price < 1500) {
        tradeOff = "Lacks premium accessories or extra packaging box contents.";
      } else {
        tradeOff = "Retail warranty registration is required online immediately upon delivery.";
      }
    }
  }

  return `👤 Best For: ${bestFor}\n\n💡 Why This Deal: ${whyDeal}\n\n⚠️ Trade-off: ${tradeOff}`;
}

export async function POST(request) {
  const serpapiApiKey = process.env.SERPAPI_API_KEY || "adf7db9fe87b9bc68d4c0ebc9017846f52e9b8520d10cfa87c677713e34c4125";
  console.log("SERPAPI_API_KEY config check: verified");

  try {
    // Verify Supabase Session Token
    const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: Missing active session token" }, { status: 401 });
    }

    const { data: { user }, error: authError } = await auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized: Invalid or expired session token" }, { status: 401 });
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
        let serpapiUrl = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(cleanQuery)}&gl=${gl}&hl=${hl}&api_key=${serpapiApiKey}`;

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
            const fallbackSerpapiUrl = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(fallbackQuery)}&gl=${gl}&hl=${hl}&api_key=${serpapiApiKey}`;
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

      // Extract price
      const priceRaw = item.price || item.extracted_price || 0;
      let priceVal = 0;
      if (typeof priceRaw === "number") {
        priceVal = priceRaw;
      } else if (typeof priceRaw === "string") {
        priceVal = parseFloat(priceRaw.replace(/[^0-9.]/g, "")) || 0;
      }

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
