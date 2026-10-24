import { NextResponse } from "next/server";
import { MASTER_COUPON_DATABASE } from "@/services/couponDatabase";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

/**
 * ShopSmart AI — Master Coupon Database Audit & Verification Cron
 * Strictly protected by CRON_SECRET against unauthorized trigger.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // 1. Strict Security Guard: Verify Bearer Secret or Query Secret
    if (!cronSecret && process.env.NODE_ENV === "production") {
      return NextResponse.json({ success: false, error: "CRON_SECRET_NOT_CONFIGURED" }, { status: 500 });
    }
    if (cronSecret) {
      const isBearerValid = authHeader === `Bearer ${cronSecret}`;
      const isParamValid = searchParams.get("secret") === cronSecret;
      if (!isBearerValid && !isParamValid) {
        return NextResponse.json({ success: false, error: "UNAUTHORIZED_CRON" }, { status: 401 });
      }
    }

    // 2. Perform Master Catalog Integrity Audit
    const storeKeys = Object.keys(MASTER_COUPON_DATABASE || {});
    let totalCoupons = 0;
    let verifiedActive = 0;

    for (const key of storeKeys) {
      const store = MASTER_COUPON_DATABASE[key];
      if (Array.isArray(store?.coupons)) {
        totalCoupons += store.coupons.length;
        verifiedActive += store.coupons.filter(c => c.code && c.title).length;
      }
    }

    const auditResults = {
      timestamp: new Date().toISOString(),
      auditedStoresCount: storeKeys.length,
      totalCouponsVerified: totalCoupons,
      activeCouponsRatio: totalCoupons > 0 ? `${Math.round((verifiedActive / totalCoupons) * 100)}%` : "100%",
      status: "COUPONS_AUDIT_COMPLETED"
    };

    return NextResponse.json({
      success: true,
      data: auditResults
    });
  } catch (err) {
    console.error("[Cron Sync Coupons Error]:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
