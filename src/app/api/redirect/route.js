import { NextResponse } from "next/server";
import { redis } from "@/services/redis";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const pageToken = searchParams.get("page_token");
  const productId = searchParams.get("product_id");
  const fallback = searchParams.get("fallback");
  const storeName = searchParams.get("store") || "Online Store";
  const title = searchParams.get("title") || "";
  
  if (!pageToken && !productId) {
    console.log("Redirect API: Missing token and product_id parameters, redirecting to fallback:", fallback);
    return NextResponse.redirect(fallback || "https://google.com");
  }
  
  const serpapiApiKey = process.env.SERPAPI_API_KEY || "adf7db9fe87b9bc68d4c0ebc9017846f52e9b8520d10cfa87c677713e34c4125";
  
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
        
        try {
          const finalParsed = new URL(finalUrl);
          const finalParams = finalParsed.searchParams;
          const trackingParams = [
            "gclid", "utm_source", "utm_medium", "utm_campaign", "srsltid", "cmpid", "adurl",
            "ref", "pf_rd_r", "pf_rd_p", "pd_rd_r", "pd_rd_w", "pd_rd_wg", "qid", "sr",
            "clickid", "affiliate", "tracking", "sprefix", "crid", "dib", "dib_tag"
          ];
          trackingParams.forEach(p => finalParams.delete(p));
          finalParsed.pathname = finalParsed.pathname.replace(/\/+/g, "/");
          finalUrl = finalParsed.toString();
        } catch (e) {}
        
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
  
  console.log(`Dynamic Redirect: Fallback redirect to -> ${fallback}`);
  return NextResponse.redirect(fallback || "https://google.com");
}
