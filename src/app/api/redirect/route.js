import { NextResponse } from "next/server";
import { redis } from "@/services/redis";
import { getAdminSettings } from "@/services/admin";
import { monetizeUrl } from "@/services/affiliate";

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
      path.includes("/drugs/") ||
      path.includes("/otc/") ||
      path.includes("/medicine/") ||
      path.includes("/sv/") ||
      path.includes("/itm/") ||
      path.includes("/catalog/") ||
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
    const parsed = new URL(url);
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
  
  const urlRegex = /href=["']([^"']+)["']/g;
  const urls = [];
  let match;
  
  try {
    const fallbackObj = new URL(fallbackUrl);
    const origin = fallbackObj.origin;
    
    while ((match = urlRegex.exec(html)) !== null) {
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
    while ((match = generalUrlRegex.exec(html)) !== null) {
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

  const cacheKey = `cache:pdp:${domain}:${cleanTitle.toLowerCase().replace(/\s+/g, "-")}`;

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
    const monetized = monetizeUrl(targetUrl, storeName, region, settings);
    console.log(`Dynamic Redirect: Redirecting to monetized target URL -> ${monetized}`);
    return NextResponse.redirect(monetized);
  };

  const handleFallback = async (fallbackUrl, store) => {
    let cleanFallback = fallbackUrl;

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
      return safeRedirect(cleanFallback);
    }
    return safeRedirect("https://www.google.com");
  };

  if (!pageToken && !productId) {
    console.log("Redirect API: Missing token and product_id parameters, executing fallback resolution:", fallback);
    return await handleFallback(fallback, storeName);
  }
  
  const serpapiApiKey = process.env.SERPAPI_API_KEY || 
                        process.env.SERP_API_KEY || 
                        process.env.SERPAPI_KEY;
  
  const tokenVal = pageToken || productId || "generic";
  const uniqueId = tokenVal.slice(-40);
  const cacheKey = `cache:immersive:redirect:${uniqueId}`;
  
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`Dynamic Redirect: Cache HIT for key: ${cacheKey} -> ${cached}`);
      return safeRedirect(cached);
    }
  } catch (e) {
    console.warn("Failed to read redirect cache:", e);
  }
  
  let immersiveApi = "";
  if (pageToken) {
    immersiveApi = `https://serpapi.com/search.json?engine=google_immersive_product&page_token=${encodeURIComponent(pageToken)}`;
  } else if (productId) {
    immersiveApi = `https://serpapi.com/search.json?engine=google_immersive_product&product_id=${encodeURIComponent(productId)}`;
  }
  
  try {
    const detailUrl = `${immersiveApi}&api_key=${serpapiApiKey}`;
    const res = await fetch(detailUrl, { signal: AbortSignal.timeout(6000) });
    
    if (res.ok) {
      const data = await res.json();
      const stores = data.product_results?.stores || [];
      
      let selectedLink = "";
      
      if (Array.isArray(stores) && stores.length > 0) {
        const match = stores.find(s => {
          const sName = (s.name || s.store || "").toLowerCase();
          return sName.includes(storeName.toLowerCase()) || storeName.toLowerCase().includes(sName);
        });
        
        if (match && (match.link || match.direct_link)) {
          selectedLink = match.link || match.direct_link;
        } else {
          const anyValid = stores.find(s => s.link || s.direct_link);
          if (anyValid) {
            selectedLink = anyValid.link || anyValid.direct_link;
          }
        }
      }
      
      if (selectedLink) {
        const urlObj = new URL(selectedLink);
        const redirectParams = ["adurl", "destination", "merchant_url", "url", "target_url", "q", "u", "r"];
        let finalUrl = selectedLink;
        
        for (const param of redirectParams) {
          let val = urlObj.searchParams.get(param);
          if (val) {
            val = decodeURIComponent(val);
            if (val.startsWith("/")) {
              val = urlObj.origin + val;
            }
            if (val.startsWith("http://") || val.startsWith("https://")) {
              finalUrl = val;
              break;
            }
          }
        }
        
        finalUrl = cleanUrlParams(finalUrl);
        
        try {
          await redis.set(cacheKey, finalUrl, { ex: 86400 });
        } catch (e) {}
        
        console.log(`Dynamic Redirect: Resolved exact PDP -> ${finalUrl}`);
        return safeRedirect(finalUrl);
      }
    }
  } catch (err) {
    console.error("Dynamic Redirect error resolving PDP:", err);
  }
  
  console.log(`Dynamic Redirect: Executing fallback resolution for -> ${fallback}`);
  return await handleFallback(fallback, storeName);
}
