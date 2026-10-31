import { NextResponse } from "next/server";
import { getCouponsForStore } from "@/services/couponService";
import { isFeatureEnabled } from "@/services/featureFlags";
import { recordCrashException } from "@/services/crashVault";
import { safeClientError } from "@/lib/errorShield";

export const dynamic = "force-dynamic";

// Global in-memory cache for ultra-fast coupon lookups
const memoryCouponsCache = new Map();
const COUPONS_TTL_MS = 60 * 60 * 1000; // 1 Hour

export async function GET(req) {
  try {
    const isScraperEnabled = await isFeatureEnabled("zyteCouponScraper");
    if (!isScraperEnabled) {
      return NextResponse.json({
        success: false,
        error: "FEATURE_DISABLED",
        message: "Coupon Discovery is temporarily paused by the administrator."
      }, { status: 503 });
    }

    const { searchParams } = new URL(req.url);
    const store = (searchParams.get("store") || searchParams.get("query") || "zomato").toLowerCase().trim();
    const country = (searchParams.get("country") || "IN").toUpperCase();

    const cacheKey = `${country}:${store}`;
    const cached = memoryCouponsCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < COUPONS_TTL_MS) {
      return NextResponse.json(cached.data, {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
          "X-Memory-Cache": "HIT"
        }
      });
    }

    const result = await getCouponsForStore(store, country);

    if (result && (result.coupons?.length > 0 || result.success)) {
      memoryCouponsCache.set(cacheKey, { data: result, timestamp: Date.now() });
    }

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      }
    });
  } catch (error) {
    console.error("[Coupons API Error]:", error);
    recordCrashException({
      error,
      message: error.message || "Coupons API failure",
      component: "coupons",
      route: "/api/coupons",
      severity: "error"
    }).catch(() => {});
    return NextResponse.json(
      { error: "Failed to fetch coupons", details: safeClientError(error).message },
      { status: 500 }
    );
  }
}
