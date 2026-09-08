import { NextResponse } from "next/server";
import { redis } from "@/services/redis";

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
      path.endsWith("/buy")
    ) {
      return true;
    }
  } catch (e) {}
  return false;
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

async function resolveSearchToPdp(searchUrl, storeName) {
  if (!searchUrl) return null;
  try {
    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5"
      },
      signal: AbortSignal.timeout(1500)
    });
    
    if (response.ok) {
      const html = await response.text();
      const pdpUrl = extractFirstPdpFromHtml(html, storeName, searchUrl);
      if (pdpUrl) {
        console.log(`Dynamic Edge Resolver: Resolved search to direct PDP -> ${pdpUrl}`);
        return pdpUrl;
      }
    }
  } catch (err) {
    console.warn(`Dynamic Edge Resolver failed to fetch/parse search page: ${err.message}`);
  }
  return null;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const pageToken = searchParams.get("page_token");
  const productId = searchParams.get("product_id");
  const fallback = searchParams.get("fallback") || searchParams.get("url") || searchParams.get("link") || searchParams.get("target");
  const storeName = searchParams.get("store") || "Online Store";
  const title = searchParams.get("title") || "";
  
  const handleFallback = async (fallbackUrl, store) => {
    if (fallbackUrl && isSearchUrl(fallbackUrl)) {
      const resolvedPdp = await resolveSearchToPdp(fallbackUrl, store);
      if (resolvedPdp) {
        return NextResponse.redirect(resolvedPdp);
      }
    }
    if (fallbackUrl && (fallbackUrl.startsWith("http://") || fallbackUrl.startsWith("https://"))) {
      return NextResponse.redirect(fallbackUrl);
    }
    return NextResponse.redirect("https://www.google.com");
  };

  if (!pageToken && !productId) {
    console.log("Redirect API: Missing token and product_id parameters, executing fallback resolution:", fallback);
    return await handleFallback(fallback, storeName);
  }
  
  const serpapiApiKey = process.env.SERPAPI_API_KEY || 
                        process.env.SERP_API_KEY || 
                        process.env.SERPAPI_KEY || 
                        "d01f7fb0d597a6cbaa7b9a0e6a04c61c1eb1da33375409b65acf4dbc60593bdb";
  
  const tokenVal = pageToken || productId || "generic";
  const uniqueId = tokenVal.slice(-40);
  const cacheKey = `cache:immersive:redirect:${uniqueId}`;
  
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`Dynamic Redirect: Cache HIT for key: ${cacheKey} -> ${cached}`);
      return NextResponse.redirect(cached);
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
        return NextResponse.redirect(finalUrl);
      }
    }
  } catch (err) {
    console.error("Dynamic Redirect error resolving PDP:", err);
  }
  
  console.log(`Dynamic Redirect: Executing fallback resolution for -> ${fallback}`);
  return await handleFallback(fallback, storeName);
}
