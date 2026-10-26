import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// Global in-memory cache for 0ms warm response
const memoryTravelDealsCache = new Map();

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const country = (searchParams.get("country") || "IN").toUpperCase();
    const category = searchParams.get("category") || "all";
    const dealType = searchParams.get("dealType") || "all";
    const query = (searchParams.get("query") || "").toLowerCase().trim();

    const cacheKey = `${country}:${category}:${dealType}:${query}`;
    if (memoryTravelDealsCache.has(cacheKey)) {
      return NextResponse.json(memoryTravelDealsCache.get(cacheKey), {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
          "X-Memory-Cache": "HIT"
        },
      });
    }

    // 1. Attempt to fetch from Supabase with a strict 400ms timeout (avoids 3s cold start hang)
    let fetchedFromSupabase = false;
    let formattedDeals = [];

    try {
      const supabasePromise = (async () => {
        let queryBuilder = supabase
          .from("travel_catalog")
          .select("*")
          .eq("country", country);

        if (category && category !== "all") {
          queryBuilder = queryBuilder.eq("category", category);
        }
        if (dealType && dealType !== "all") {
          queryBuilder = queryBuilder.eq("deal_type", dealType);
        }
        if (query) {
          queryBuilder = queryBuilder.or(`title.ilike.%${query}%,platform_name.ilike.%${query}%,promo_code.ilike.%${query}%,badge.ilike.%${query}%`);
        }

        const { data, error } = await queryBuilder;
        if (!error && Array.isArray(data) && data.length > 0) {
          return data.map(d => ({
            id: d.id,
            country: d.country,
            platformId: d.platform_id,
            platformName: d.platform_name,
            category: d.category,
            title: d.title,
            tagline: d.tagline,
            dealType: d.deal_type,
            promoCode: d.promo_code,
            discountValue: d.discount_value,
            estimatedSavings: d.estimated_savings,
            verifiedScore: Number(d.verified_score) || 95,
            verifiedDate: d.verified_date,
            minSpend: d.min_spend,
            expiryNote: d.expiry_note,
            isEvergreen: d.is_evergreen,
            terms: d.terms,
            directUrl: d.direct_url,
            badge: d.badge,
            accentColor: d.accent_color,
          }));
        }
        return null;
      })();

      const timeoutPromise = new Promise(resolve => setTimeout(() => resolve(null), 400));
      const result = await Promise.race([supabasePromise, timeoutPromise]);

      if (result && Array.isArray(result) && result.length > 0) {
        formattedDeals = result;
        fetchedFromSupabase = true;
      }
    } catch (dbErr) {
      console.warn("[Travel Deals API] Fast fallback triggered:", dbErr.message);
    }

    if (fetchedFromSupabase) {
      const payload = {
        success: true,
        source: "supabase",
        country,
        total: formattedDeals.length,
        deals: formattedDeals,
      };
      memoryTravelDealsCache.set(cacheKey, payload);

      return NextResponse.json(payload, {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        },
      });
    }

    // 2. Seamless instant local fallback (0ms)
    const { getTravelDealsByCountry } = await import("@/services/travelDealsDatabase");
    let deals = getTravelDealsByCountry(country, category, dealType);

    if (query) {
      deals = deals.filter(d =>
        d.platformName.toLowerCase().includes(query) ||
        d.title.toLowerCase().includes(query) ||
        (d.promoCode && d.promoCode.toLowerCase().includes(query)) ||
        (d.badge && d.badge.toLowerCase().includes(query))
      );
    }

    const payload = {
      success: true,
      source: "local_database",
      country,
      total: deals.length,
      deals,
    };
    memoryTravelDealsCache.set(cacheKey, payload);

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    console.error("[Travel Deals API Error]:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch travel deals", deals: [] }, { status: 500 });
  }
}
