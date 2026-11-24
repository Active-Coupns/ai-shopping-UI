import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { getCouponsForStore } from "@/services/couponService";
import { isFeatureEnabled } from "@/services/featureFlags";
import { recordCrashException } from "@/services/crashVault";
import { safeClientError } from "@/lib/errorShield";
import { redis } from "@/services/redis";

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

    // Check user auth & active paid search/coupon credit entitlement
    let isPaidUser = false;
    let userId = null;
    try {
      const auth = getAuth(req);
      userId = auth?.userId || null;
      if (userId && redis) {
        const rawCredits = await redis.get(`user_search_credits:${userId}`);
        const rawExpiry = await redis.get(`user_search_expiry:${userId}`);
        const credits = parseInt(rawCredits || "0", 10);
        const expiry = parseInt(rawExpiry || "0", 10);
        if (credits > 0 && Date.now() <= expiry) {
          isPaidUser = true;
        }
      }
    } catch (_) {}

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

    const result = await getCouponsForStore(store, country, { isPaidUser, userId });

    // Only cache successful public/paid unlocks in memory (do not cache paywall gates)
    if (result && !result.requiresPaidTier && (result.coupons?.length > 0 || result.success)) {
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
