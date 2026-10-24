import { NextResponse } from "next/server";
import { discoverOnDemandDeals } from "@/services/travelOnDemandService";

export const maxDuration = 30;

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const brandName = String(body.brandName || "").trim();
    const category = String(body.category || "flights").toLowerCase();
    const country = String(body.country || "IN").toUpperCase();

    // 1. Input Validation
    if (!brandName || brandName.length < 2) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid brand or platform name." },
        { status: 400 }
      );
    }

    if (brandName.length > 80) {
      return NextResponse.json(
        { success: false, error: "Brand name exceeds maximum allowed length." },
        { status: 400 }
      );
    }

    // Security sanitization
    const DANGEROUS = [/<script/i, /javascript:/i, /eval\(/i, /DROP\s+TABLE/i];
    if (DANGEROUS.some(p => p.test(brandName))) {
      return NextResponse.json(
        { success: false, error: "Invalid characters in brand name." },
        { status: 400 }
      );
    }

    // 2. Discover on-demand verified deals
    const result = await discoverOnDemandDeals(brandName, category, country);

    if (!result.success) {
      return NextResponse.json({
        success: false,
        brand: result.brand,
        error: result.error || "We currently do not have verified coupons or saving strategies available for this platform in our database.",
        deals: [],
        total: 0
      });
    }

    return NextResponse.json({
      success: true,
      brand: result.brand,
      fromCache: result.fromCache,
      deals: result.deals || [],
      total: (result.deals || []).length
    });
  } catch (error) {
    console.error("[ShopSmart AI On-Demand API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to discover on-demand deals for requested brand." },
      { status: 500 }
    );
  }
}
