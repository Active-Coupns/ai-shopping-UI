import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = (searchParams.get("country") || "IN").toUpperCase();
    const category = searchParams.get("category") || "all";
    const query = (searchParams.get("query") || "").toLowerCase().trim();

    // 1. Attempt to fetch from Supabase
    try {
      let queryBuilder = supabase
        .from("subscription_catalog")
        .select("*")
        .eq("country", country);

      if (category && category !== "all") {
        queryBuilder = queryBuilder.eq("category", category);
      }
      if (query) {
        queryBuilder = queryBuilder.or(`name.ilike.%${query}%,tagline.ilike.%${query}%,badge.ilike.%${query}%`);
      }

      const { data, error } = await queryBuilder;

      if (!error && Array.isArray(data) && data.length > 0) {
        const formatted = data.map(item => ({
          id: item.platform_id,
          country: item.country,
          name: item.name,
          category: item.category,
          tagline: item.tagline,
          logoText: item.logo_text,
          accentColor: item.accent_color,
          badge: item.badge,
          popularShows: item.popular_shows || [],
          plans: item.plans || [],
          savingsBlueprint: item.savings_blueprint || {},
        }));

        return NextResponse.json({
          success: true,
          source: "supabase",
          country,
          total: formatted.length,
          subscriptions: formatted,
        }, {
          headers: {
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        });
      }
    } catch (dbErr) {
      console.warn("[Subscriptions Catalog API] Supabase notice:", dbErr.message);
    }

    // 2. Seamless local fallback
    const { getSubscriptionsCatalog } = await import("@/data/subscriptionsRegistry");
    let catalog = getSubscriptionsCatalog(country) || [];

    if (category && category !== "all") {
      catalog = catalog.filter(item => item.category === category);
    }

    if (query) {
      catalog = catalog.filter(item =>
        item.name.toLowerCase().includes(query) ||
        (item.tagline && item.tagline.toLowerCase().includes(query)) ||
        (item.badge && item.badge.toLowerCase().includes(query))
      );
    }

    return NextResponse.json({
      success: true,
      source: "local_catalog",
      country,
      total: catalog.length,
      subscriptions: catalog,
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("[Subscriptions Catalog API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch subscriptions catalog", subscriptions: [] },
      { status: 500 }
    );
  }
}
