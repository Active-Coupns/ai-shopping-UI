import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const country = (searchParams.get("country") || "IN").toUpperCase();
    const category = searchParams.get("category") || "all";
    const dealType = searchParams.get("dealType") || "all";
    const query = (searchParams.get("query") || "").toLowerCase().trim();

    // 1. Attempt to fetch from Supabase
    try {
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
        // Map database snake_case to frontend camelCase
        const formattedDeals = data.map(d => ({
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

        return NextResponse.json({
          success: true,
          source: "supabase",
          country,
          total: formattedDeals.length,
          deals: formattedDeals,
        }, {
          headers: {
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        });
      }
    } catch (dbErr) {
      console.warn("[Travel Deals API] Supabase notice:", dbErr.message);
    }

    // 2. Seamless local fallback
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

    return NextResponse.json({
      success: true,
      source: "local_database",
      country,
      total: deals.length,
      deals,
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("[Travel Deals API Error]:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch travel deals", deals: [] }, { status: 500 });
  }
}
