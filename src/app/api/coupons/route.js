import { NextResponse } from "next/server";
import { getCouponsForStore } from "@/services/couponService";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const store = searchParams.get("store") || searchParams.get("query") || "zomato";
    const country = searchParams.get("country") || "IN";

    const result = await getCouponsForStore(store, country);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[Coupons API Error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch coupons", details: error.message },
      { status: 500 }
    );
  }
}
