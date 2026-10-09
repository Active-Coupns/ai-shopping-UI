import { NextResponse } from "next/server";
import { getDealsForCategory, DEAL_CATEGORIES } from "@/services/dealsService";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "smartphones";
    const country = searchParams.get("country") || "IN";

    const result = await getDealsForCategory(category, country);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[API Deals Error]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const category = body.category || "smartphones";
    const country = body.country || "IN";

    const result = await getDealsForCategory(category, country);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[API Deals Error]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
