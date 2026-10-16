import { NextResponse } from "next/server";
import { getCouponsForStore } from "@/services/couponService";
import { isFeatureEnabled } from "@/services/featureFlags";
import { recordCrashException } from "@/services/crashVault";

export async function GET(req) {
  try {
    const isScraperEnabled = await isFeatureEnabled("zyteCouponScraper");
    if (!isScraperEnabled) {
      return NextResponse.json({
        success: false,
        error: "FEATURE_DISABLED",
        message: "Brand Coupon Scraper is temporarily paused by the administrator."
      }, { status: 503 });
    }

    const { searchParams } = new URL(req.url);
    const store = searchParams.get("store") || searchParams.get("query") || "zomato";
    const country = searchParams.get("country") || "IN";

    const result = await getCouponsForStore(store, country);
    return NextResponse.json(result);
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
      { error: "Failed to fetch coupons", details: error.message },
      { status: 500 }
    );
  }
}
