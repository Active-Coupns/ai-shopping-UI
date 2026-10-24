import { NextResponse } from "next/server";
import { getTravelDealsByCountry } from "@/services/travelDealsDatabase";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const country = (searchParams.get("country") || "IN").toUpperCase();
    const category = searchParams.get("category") || "all";
    const dealType = searchParams.get("dealType") || "all";
    const query = (searchParams.get("query") || "").toLowerCase().trim();

    let deals = getTravelDealsByCountry(country, category, dealType);

    if (query) {
      deals = deals.filter(d => 
        d.platformName.toLowerCase().includes(query) ||
        d.title.toLowerCase().includes(query) ||
        d.promoCode.toLowerCase().includes(query) ||
        d.badge.toLowerCase().includes(query)
      );
    }

    return NextResponse.json({
      success: true,
      country,
      total: deals.length,
      deals
    });
  } catch (error) {
    console.error("[Travel Deals API Error]:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch travel deals" }, { status: 500 });
  }
}
