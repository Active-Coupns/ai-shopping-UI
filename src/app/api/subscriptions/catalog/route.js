import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// Global in-memory cache for ultra-low latency (0ms response on warm containers)
const memoryCatalogCache = new Map();

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = (searchParams.get("country") || "IN").toUpperCase();
    const category = searchParams.get("category") || "all";
    const query = (searchParams.get("query") || "").toLowerCase().trim();

    const cacheKey = `${country}:${category}:${query}`;
    if (memoryCatalogCache.has(cacheKey)) {
      return NextResponse.json(memoryCatalogCache.get(cacheKey), {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
          "X-Memory-Cache": "HIT"
        },
      });
    }

    // 1. Attempt to fetch from Supabase with a strict 400ms timeout (avoids 3-second cold start hangs)
    let fetchedFromSupabase = false;
    let formatted = [];

    try {
      const supabasePromise = (async () => {
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
          return data.map(item => ({
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
        }
        return null;
      })();

      const timeoutPromise = new Promise(resolve => setTimeout(() => resolve(null), 400));
      const result = await Promise.race([supabasePromise, timeoutPromise]);

      if (result && Array.isArray(result) && result.length > 0) {
        formatted = result;
        fetchedFromSupabase = true;
      }
    } catch (dbErr) {
      console.warn("[Subscriptions Catalog API] Fast fallback triggered:", dbErr.message);
    }

    // 2. Seamless instant local catalog + Supabase enrichment
    const { getSubscriptionsCatalog } = await import("@/data/subscriptionsRegistry.js");
    const localCatalog = getSubscriptionsCatalog(country) || [];

    const catalogMap = new Map();
    // Insert local catalog items first
    localCatalog.forEach(item => catalogMap.set(item.id, item));

    // If Supabase returned items, overlay/enrich
    if (fetchedFromSupabase && Array.isArray(formatted) && formatted.length > 0) {
      formatted.forEach(item => {
        const existing = catalogMap.get(item.id);
        catalogMap.set(item.id, existing ? { ...existing, ...item } : item);
      });
    }

    let catalog = Array.from(catalogMap.values());

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

    const payload = {
      success: true,
      source: fetchedFromSupabase ? "hybrid" : "local_catalog",
      country,
      total: catalog.length,
      subscriptions: catalog,
    };
    memoryCatalogCache.set(cacheKey, payload);

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
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
