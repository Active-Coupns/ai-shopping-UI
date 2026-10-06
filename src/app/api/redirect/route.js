import { NextResponse } from "next/server";
import { redis } from "@/services/redis";
import { getAdminSettings } from "@/services/admin";
import { monetizeUrl } from "@/services/affiliate";
import { getStoreDirectSearchFallback, executeProductDetailsRequest } from "@/services/rapidapi";

function isSearchUrl(url) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.toLowerCase();
    const search = parsed.search.toLowerCase();
    
    if (hasExactPDPPath(url)) {
      return false;
    }
    
    if (
      path === "/search" ||
      path.startsWith("/search/") ||
      path.startsWith("/s/") ||
      path === "/s" ||
      path.includes("/searchpage") ||
      path.includes("google.com/search")
    ) {
      return true;
    }
    
    if (search.includes("q=") || search.includes("k=") || search.includes("searchterm=")) {
      return true;
    }
  } catch (e) {
    return false;
  }
  return false;
}

function hasExactPDPPath(url) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.toLowerCase();

    // 1. STRICT BLACKLIST: Never match account, orders, help, cart, css, search, reviews
    if (
      path.includes("/css/") ||
      path.includes("/order") ||
      path.includes("/cart") ||
      path.includes("/sign") ||
      path.includes("/account") ||
      path.includes("/help") ||
      path.includes("/gp/css") ||
      path.includes("/yourstore") ||
      path.includes("/wishlist") ||
      path.includes("/customer-reviews") ||
      path.includes("/b/") ||
      path.includes("/s/") ||
      path.includes("/search") ||
      path.includes("/viewdeal") ||
      path.includes("/redirect")
    ) {
      return false;
    }

    // 2. AMAZON SPECIFIC: Strictly require /dp/ or /gp/product/
    if (parsed.hostname.includes("amazon")) {
      return path.includes("/dp/") || path.includes("/gp/product/") || path.includes("/gp/aw/d/");
    }

    // 3. FLIPKART SPECIFIC: Require /p/ or /p/itm
    if (parsed.hostname.includes("flipkart")) {
      return path.includes("/p/itm") || (path.includes("/p/") && !path.includes("/search"));
    }

    // 4. GENERAL PDP PATHS
    if (
      path.includes("/dp/") ||
      path.includes("/product/") ||
      path.includes("/products/") ||
      path.includes("/product-page/") ||
      path.includes("/product_page/") ||
      path.includes("/item/") ||
      path.includes("/pd/") ||
      path.includes("/buy/") ||
      path.includes("/deal/") ||
      path.includes("/itm/") ||
      path.endsWith("/buy")
    ) {
      return true;
    }
  } catch (e) {}
  return false;
}

function isCompletePDPUrl(url) {
  if (!url || typeof url !== "string") return false;
  return (url.startsWith("http://") || url.startsWith("https://")) && hasExactPDPPath(url);
}

function cleanUrlParams(url) {
  if (!url) return "";
  try {
    const unescaped = url.replace(/&amp;/g, "&");
    const parsed = new URL(unescaped);
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
    return url;
  }
}

function extractFirstPdpFromHtml(html, storeName, fallbackUrl) {
  if (!html) return null;
  
  const decodedHtml = html.replace(/&amp;/g, "&");
  const urlRegex = /href=["']([^"']+)["']/g;
  const urls = [];
  let match;
  
  try {
    const fallbackObj = new URL(fallbackUrl);
    const origin = fallbackObj.origin;
    
    while ((match = urlRegex.exec(decodedHtml)) !== null) {
      let link = match[1];
      if (link.startsWith("/")) {
        link = origin + link;
      }
      if (link.startsWith("http://") || link.startsWith("https://")) {
        urls.push(link);
      }
    }
  } catch (e) {
    const generalUrlRegex = /(https?:\/\/[^\s"'<>]+)/gi;
    while ((match = generalUrlRegex.exec(decodedHtml)) !== null) {
      urls.push(match[1]);
    }
  }

  const targetDomain = storeName.toLowerCase().replace("www.", "").split(".")[0];
  for (const url of urls) {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.toLowerCase();
      if (host.includes(targetDomain)) {
        const cleaned = cleanUrlParams(url);
        if (hasExactPDPPath(cleaned)) {
          return cleaned;
        }
      }
    } catch (e) {}
  }
  
  return null;
}

async function resolveSearchToPdp(searchUrl, storeName, productTitle = "") {
  if (!searchUrl && !productTitle) return null;

  const targetDomainMap = {
    "flipkart": "flipkart.com",
    "reliance digital": "reliancedigital.in",
    "croma": "croma.com",
    "vijay sales": "vijaysales.com",
    "myntra": "myntra.com",
    "amazon": "amazon.in",
    "amazon.in": "amazon.in",
    "healthkart": "healthkart.com",
    "nutrabay": "nutrabay.com",
    "muscleblaze": "muscleblaze.com",
    "tata 1mg": "1mg.com",
    "1mg": "1mg.com",
    "apollo 24|7": "apollopharmacy.in",
    "apollo": "apollopharmacy.in",
    "pharmeasy": "pharmeasy.in",
    "netmeds": "netmeds.com",
    "myprotein": "myprotein.co.in",
    "optimum nutrition": "optimumnutrition.co.in"
  };

  const domain = targetDomainMap[storeName.toLowerCase()] || `${storeName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;
  const cleanTitle = cleanModelForStoreSearch(productTitle || searchUrl);
  if (!cleanTitle) return null;

  const cacheKey = `cache:pdp:v4:${domain}:${cleanTitle.toLowerCase().replace(/\s+/g, "-")}`;

  try {
    const cachedPdp = await redis.get(cacheKey);
    if (cachedPdp && isCompletePDPUrl(cachedPdp)) {
      console.log(`Dynamic Edge Resolver (Redis HIT): Exact PDP -> ${cachedPdp}`);
      return cachedPdp;
    }
  } catch (e) {}

  // 1. Zero-Cost Microservice PDP Resolution (gotScraping Engine)
  try {
    const scraperServiceUrl = process.env.SCRAPER_SERVICE_URL || "http://localhost:4000";
    const apiKey = process.env.SCRAPER_SERVICE_API_KEY || "";
    
    console.log(`Dynamic Edge Resolver: Requesting zero-cost microservice PDP resolution for ${storeName} ("${cleanTitle}")...`);
    const res = await fetch(`${scraperServiceUrl}/api/v1/resolve-pdp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { "x-api-key": apiKey } : {})
      },
      body: JSON.stringify({ storeName, query: cleanTitle }),
      signal: AbortSignal.timeout(1500)
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.pdpUrl && isCompletePDPUrl(data.pdpUrl)) {
        console.log(`Dynamic Edge Resolver: Microservice resolved 100% EXACT PDP -> ${data.pdpUrl}`);
        try { await redis.set(cacheKey, data.pdpUrl, { ex: 2592000 }); } catch (e) {}
        return data.pdpUrl;
      }
    }
  } catch (err) {
    console.warn(`Dynamic Edge Resolver microservice lookup warning: ${err.message}`);
  }

  // 2. Direct search page HTML parsing fallback
  if (searchUrl) {
    try {
      const response = await fetch(searchUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5"
        },
        signal: AbortSignal.timeout(1200)
      });
      
      if (response.ok) {
        const html = await response.text();
        const pdpUrl = extractFirstPdpFromHtml(html, storeName, searchUrl);
        if (pdpUrl && isCompletePDPUrl(pdpUrl)) {
          console.log(`Dynamic Edge Resolver: Resolved search to direct PDP -> ${pdpUrl}`);
          try { await redis.set(cacheKey, pdpUrl, { ex: 2592000 }); } catch (e) {}
          return pdpUrl;
        }
      }
    } catch (err) {
      console.warn(`Dynamic Edge Resolver failed to fetch/parse search page: ${err.message}`);
    }
  }
  return null;
}

function cleanModelForStoreSearch(title) {
  if (!title) return "";

  const isMedicine = /\b(dolo|telma|shelcal|augmentin|pantocid|crocin|paracetamol|azithromycin|metformin|glycomet|tablets?|capsules?|syrup|\d+\s*mg|strip)\b/i.test(title);
  const isSupp = /\b(whey|protein|creatine|bcaa|glutamine|gainer|isolate|nutrition|muscleblaze|nutrabay)\b/i.test(title);

  if (isMedicine || isSupp) {
    return title
      .replace(/\[[^\]]*\]/g, " ")
      .replace(/\([^)]*\)/g, " ")
      .replace(/Sponsored Ad - /gi, " ")
      .replace(/[^a-zA-Z0-9\s-]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .split(" ")
      .slice(0, 6)
      .join(" ");
  }

  let clean = title
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/\([^)]*\)/g, " ")
    .replace(/Sponsored Ad - /gi, " ");

  const segments = clean.split(/[,;|:\/]/);
  if (segments.length > 0 && segments[0].trim().length >= 3) {
    clean = segments[0];
  }

  clean = clean
    .replace(/\b\d+\s*(gb|tb|mb|ram|rom|mp|mah|hz|inch|inches|cm)\b/gi, " ")
    .replace(/\b\d+(\.\d+)?\s*(inch|inches|cm|mp|g)\b/gi, " ")
    .replace(/\b(smartphone|mobile|phone|laptop|notebook|thin & light|camera|display|screen|battery|dual ai|triple|quad|rear|front|fast charging|windows|win|mso|office|wireless|headphones|earbuds)\b/gi, " ")
    .replace(/[^a-zA-Z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = clean.split(" ").filter(Boolean);
  if (words.length === 0) return title.split(" ").slice(0, 3).join(" ");
  return words.slice(0, 4).join(" ");
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const pageToken = searchParams.get("page_token");
  const productId = searchParams.get("product_id");
  const fallback = searchParams.get("fallback") || searchParams.get("url") || searchParams.get("link") || searchParams.get("target");
  const storeName = searchParams.get("store") || "Online Store";
  const title = searchParams.get("title") || "";
  const region = searchParams.get("region") || "IN";

  const settings = await getAdminSettings();

  const safeRedirect = (targetUrl) => {
    if (!targetUrl || targetUrl === "https://www.google.com") {
      return NextResponse.redirect("https://www.google.com");
    }
    let cleanUrl = targetUrl;
    if (cleanUrl.includes("gonoise.com") || cleanUrl.includes("/products/")) {
      try {
        const u = new URL(cleanUrl);
        u.searchParams.delete("country");
        u.searchParams.delete("currency");
        cleanUrl = u.toString();
      } catch (e) {}
    }
    const monetized = monetizeUrl(cleanUrl, storeName, region, settings);
    console.log(`Dynamic Redirect: Redirecting to monetized target URL -> ${monetized}`);
    return NextResponse.redirect(monetized);
  };

  const handleFallback = async (fallbackUrl, store) => {
    let cleanFallback = fallbackUrl;
    const storeLower = (store || "").toLowerCase().trim();

    if (fallbackUrl && isSearchUrl(fallbackUrl)) {
      try {
        const u = new URL(fallbackUrl);
        const rawQ = u.searchParams.get("q") || u.searchParams.get("k") || u.searchParams.get("text") || title;
        if (rawQ) {
          const sanitizedQ = cleanModelForStoreSearch(rawQ);
          if (u.searchParams.has("q")) u.searchParams.set("q", sanitizedQ);
          if (u.searchParams.has("k")) u.searchParams.set("k", sanitizedQ);
          if (u.searchParams.has("text")) u.searchParams.set("text", sanitizedQ);
          cleanFallback = u.toString();
        }
      } catch (e) {}

      const resolvedPdp = await resolveSearchToPdp(cleanFallback, store, title);
      if (resolvedPdp) {
        return safeRedirect(resolvedPdp);
      }
    }
    if (cleanFallback && (cleanFallback.startsWith("http://") || cleanFallback.startsWith("https://"))) {
      if (cleanFallback.includes("google.com") || cleanFallback.includes("google.co.in") || cleanFallback.includes("ibp=")) {
        const storeSearch = getStoreDirectSearchFallback(store, title, region);
        return safeRedirect(storeSearch);
      }
      // If store is a specific brand/retailer (e.g. Puma, Nike, Tata CLiQ, Croma) but fallback points to an unrelated store:
      const cleanStore = storeLower.replace(/[^a-z0-9]/g, "");
      if (cleanStore && !cleanFallback.toLowerCase().includes(cleanStore) && !cleanStore.includes("online") && !cleanStore.includes("store")) {
        const storeSearch = getStoreDirectSearchFallback(store, title, region);
        if (storeSearch && !storeSearch.includes("amazon.in")) {
          return safeRedirect(storeSearch);
        }
      }
      return safeRedirect(cleanFallback);
    }
    const storeSearch = getStoreDirectSearchFallback(store, title, region);
    return safeRedirect(storeSearch || "https://www.google.com");
  };

  if (productId) {
    const cleanStoreKey = storeName.toLowerCase().replace(/[^a-z0-9]/g, "");
    const cacheKey = `cache:pdp:direct:v4:${productId.slice(-50)}:${cleanStoreKey}`;
    try {
      const cached = await redis.get(cacheKey);
      if (cached && (cached.startsWith("http://") || cached.startsWith("https://"))) {
        console.log(`Dynamic Redirect: Cache HIT for key: ${cacheKey} -> ${cached}`);
        return safeRedirect(cached);
      }
    } catch (e) {
      console.warn("Failed to read redirect cache:", e);
    }

    try {
      const details = await executeProductDetailsRequest(productId, (region || "in").toLowerCase());
      const offers = details?.offers || [];

      const isStoreMatch = (s1, s2) => {
        if (!s1 || !s2) return false;
        const a = String(s1).toLowerCase().replace(/[^a-z0-9]/g, "");
        const b = String(s2).toLowerCase().replace(/[^a-z0-9]/g, "");
        if (a.includes(b) || b.includes(a)) return true;
        if (a.includes("amazon") && b.includes("amazon")) return true;
        if (a.includes("flipkart") && b.includes("flipkart")) return true;
        if (a.includes("myntra") && b.includes("myntra")) return true;
        if (a.includes("ajio") && b.includes("ajio")) return true;
        if (a.includes("nykaa") && b.includes("nykaa")) return true;
        if (a.includes("croma") && b.includes("croma")) return true;
        if (a.includes("reliance") && b.includes("reliance")) return true;
        if (a.includes("snitch") && b.includes("snitch")) return true;
        if (a.includes("puma") && b.includes("puma")) return true;
        if (a.includes("nike") && b.includes("nike")) return true;
        if (a.includes("adidas") && b.includes("adidas")) return true;
        if (a.includes("tatacliq") && b.includes("tatacliq")) return true;
        return false;
      };

      let match = offers.find(o => isStoreMatch(o.store_name, storeName) || isStoreMatch(o.offer_page_url, storeName));
      if (!match && storeName.toLowerCase().includes("amazon")) {
        match = offers.find(o => (o.store_name || "").toLowerCase().includes("amazon") || (o.offer_page_url || "").includes("amazon"));
      }
      if (!match && storeName.toLowerCase().includes("flipkart")) {
        match = offers.find(o => (o.store_name || "").toLowerCase().includes("flipkart") || (o.offer_page_url || "").includes("flipkart"));
      }
      if (!match && storeName.toLowerCase().includes("myntra")) {
        match = offers.find(o => (o.store_name || "").toLowerCase().includes("myntra") || (o.offer_page_url || "").includes("myntra"));
      }
      if (!match && storeName.toLowerCase().includes("puma")) {
        match = offers.find(o => (o.store_name || "").toLowerCase().includes("puma") || (o.offer_page_url || "").includes("puma"));
      }
      if (!match && storeName.toLowerCase().includes("nike")) {
        match = offers.find(o => (o.store_name || "").toLowerCase().includes("nike") || (o.offer_page_url || "").includes("nike"));
      }
      if (!match && storeName.toLowerCase().includes("adidas")) {
        match = offers.find(o => (o.store_name || "").toLowerCase().includes("adidas") || (o.offer_page_url || "").includes("adidas"));
      }

      if (match) {
        const exactPdp = match.offer_page_url || match.product_page_url;
        if (exactPdp && (exactPdp.startsWith("http://") || exactPdp.startsWith("https://")) && !exactPdp.includes("google.com") && !exactPdp.includes("ibp=")) {
          try {
            await redis.set(cacheKey, exactPdp, { ex: 604800 });
          } catch (e) {}
          console.log(`Dynamic Redirect: Resolved 100% EXACT PDP for ${storeName} -> ${exactPdp}`);
          return safeRedirect(exactPdp);
        }
      }
    } catch (err) {
      console.error("Dynamic Redirect error resolving exact PDP via details:", err);
    }
  }

  console.log(`Dynamic Redirect: Executing fallback resolution for -> ${fallback}`);
  return await handleFallback(fallback, storeName);
}
