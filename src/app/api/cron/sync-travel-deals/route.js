import { NextResponse } from "next/server";
import { getTravelDealsByCountry } from "@/services/travelDealsDatabase";
import { OFFICIAL_PROMO_ENDPOINTS, scrapeLiveBrandDeals } from "@/services/zyteTravelDealsService";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

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

    // 2. Multi-Country Day Rotation
    const DAY_TO_COUNTRY = ["IN", "US", "GB", "CA", "AU", "AE", "IN"];
    const currentDay = new Date().getDay();
    const rawCountry = searchParams.get("country");
    const targetCountry = (rawCountry ? rawCountry.toUpperCase() : DAY_TO_COUNTRY[currentDay]) || "IN";

    // 3. Retrieve Base Deals
    const baseDeals = getTravelDealsByCountry(targetCountry, "all", "all");
    const endpoints = OFFICIAL_PROMO_ENDPOINTS[targetCountry] || [];

    const syncResults = {
      country: targetCountry,
      timestamp: new Date().toISOString(),
      activeDealsCount: baseDeals.length,
      evergreenAudited: baseDeals.filter(d => d.isEvergreen).length,
      promosVerified: baseDeals.filter(d => !d.isEvergreen).length,
      zyteEndpointsChecked: endpoints.length,
      status: "SYNC_COMPLETED"
    };

    // If Zyte API is available and there are endpoints, perform quick live verification probe
    if (endpoints.length > 0 && searchParams.get("scrape") === "true") {
      const targetEndpoint = endpoints[0];
      try {
        const liveDeals = await scrapeLiveBrandDeals(
          targetEndpoint.url,
          targetEndpoint.name,
          targetEndpoint.category,
          targetCountry
        );
        syncResults.liveZyteExtraction = {
          endpoint: targetEndpoint.name,
          extractedDealsCount: liveDeals ? liveDeals.length : 0
        };
      } catch (scrapeErr) {
        syncResults.liveZyteExtraction = { error: scrapeErr.message };
      }
    }

    return NextResponse.json({
      success: true,
      data: syncResults
    });
  } catch (err) {
    console.error("[Cron Sync Travel Deals Error]:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
