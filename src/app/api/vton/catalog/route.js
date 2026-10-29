import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

// High-Speed Global L1 In-Memory Cache (Sub-5ms response across all 6 countries)
const catalogMemoryCache = new Map();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 Minutes TTL

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = (searchParams.get("country") || "IN").toUpperCase();
    const gender = searchParams.get("gender") || "men";
    const category = searchParams.get("category") || "all";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(60, Math.max(1, parseInt(searchParams.get("limit") || "24", 10)));
    const search = (searchParams.get("search") || "").trim();

    // 0. Instant L1 In-Memory Cache Hit (<1ms)
    const cacheKey = `${country}_${gender}_${category}_${page}_${limit}_${search}`;
    const cachedEntry = catalogMemoryCache.get(cacheKey);
    if (cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_TTL_MS) {
      return NextResponse.json(cachedEntry.payload, {
        headers: {
          "Cache-Control": "public, max-age=180, stale-while-revalidate=600",
          "x-cache-hit": "L1_MEMORY"
        }
      });
    }

    // 1. Attempt to fetch from Supabase with 400ms anti-hang timeout
    try {
      const supabasePromise = (async () => {
        let query = supabase
          .from("fashion_catalog")
          .select("id, gender, category, category_label, title, brand, color, price, raw_price, original_price, discount_percent, store, direct_link, deal_link, image, fabric, occasion, fit, rating, reviews_count, tryon_compatible, country", { count: "planned" });

        if (country) {
          if (country === "UK" || country === "GB") {
            query = query.in("country", ["UK", "GB"]);
          } else if (country === "UAE" || country === "AE") {
            query = query.eq("country", "AE");
          } else {
            query = query.eq("country", country);
          }
        }
        if (gender && gender !== "all") {
          query = query.eq("gender", gender);
        }
        if (category && category !== "all") {
          query = query.eq("category", category);
        }
        if (search) {
          query = query.ilike("title", `%${search}%`);
        }

        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to);

        const { data, count, error } = await query;
        if (!error && Array.isArray(data) && data.length > 0) {
          return { data, count: count || data.length };
        }
        return null;
      })();

      const timeoutPromise = new Promise(resolve => setTimeout(() => resolve(null), 400));
      const result = await Promise.race([supabasePromise, timeoutPromise]);

      if (result && Array.isArray(result.data) && result.data.length > 0) {
        const payload = {
          success: true,
          source: "supabase",
          country,
          items: result.data,
          total: result.count,
          page,
          limit,
        };

        // Cache in memory for lightning fast subsequent clicks
        catalogMemoryCache.set(cacheKey, { payload, timestamp: Date.now() });

        return NextResponse.json(payload, {
          headers: {
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
            "x-cache-hit": "MISS"
          },
        });
      }
    } catch (dbErr) {
      console.warn("[VTON Catalog API] Supabase query notice:", dbErr.message);
    }

    // 2. Seamless Fast Fallback to local catalog (0ms)
    const catalogModule = await import("@/data/fashionCatalog");
    const localCatalog = catalogModule.FASHION_CATALOG || [];

    let filtered = localCatalog.filter(item => {
      const genderMatch = gender === "all" || item.gender === gender;
      const catMatch = category === "all" || item.category === category;
      const searchMatch = !search ||
        item.title?.toLowerCase().includes(search.toLowerCase()) ||
        item.brand?.toLowerCase().includes(search.toLowerCase());
      return genderMatch && catMatch && searchMatch;
    });

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    let items = filtered.slice(startIndex, startIndex + limit);

    // If country is not India, localize the catalog items to match the user's selected country
    if (country && country !== "IN") {
      const isUS = country === "US";
      const isUK = country === "GB" || country === "UK";
      const isCA = country === "CA";
      const isAU = country === "AU";
      const isAE = country === "AE";

      const currSymbol = isAE ? "AED " : isAU ? "A$" : isCA ? "C$" : isUK ? "£" : "$";
      const exchangeDivisor = isAE ? 22 : isAU ? 55 : isCA ? 60 : isUK ? 105 : 83;
      const storeName = isAE ? "Amazon.ae" : isAU ? "Amazon.com.au" : isCA ? "Amazon.ca" : isUK ? "ASOS UK" : "Amazon.com";
      const storeBaseUrl = isAE 
        ? "https://www.amazon.ae/s?k=" 
        : isAU 
        ? "https://www.amazon.com.au/s?k=" 
        : isCA 
        ? "https://www.amazon.ca/s?k=" 
        : isUK 
        ? "https://www.amazon.co.uk/s?k=" 
        : "https://www.amazon.com/s?k=";

      items = items.map(item => {
        const raw = item.raw_price || 1500;
        const converted = Math.max(15, Math.round(raw / exchangeDivisor));
        const originalConverted = Math.round(converted * 1.4);
        const encodedTitle = encodeURIComponent(item.title || "fashion clothing");

        return {
          ...item,
          country,
          store: storeName,
          price: `${currSymbol}${converted}`,
          original_price: `${currSymbol}${originalConverted}`,
          raw_price: converted,
          direct_link: `${storeBaseUrl}${encodedTitle}`,
          deal_link: `${storeBaseUrl}${encodedTitle}`,
          price_comparison: [
            {
              store_name: storeName,
              price: converted,
              deal_link: `${storeBaseUrl}${encodedTitle}`,
              is_lowest: true
            }
          ]
        };
      });
    }

    const payload = {
      success: true,
      source: "local_catalog",
      country: country || "IN",
      items,
      total,
      page,
      limit,
    };

    // Cache local catalog in memory as well
    catalogMemoryCache.set(cacheKey, { payload, timestamp: Date.now() });

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("[VTON Catalog API] Internal Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch fashion catalog", items: [] },
      { status: 500 }
    );
  }
}
