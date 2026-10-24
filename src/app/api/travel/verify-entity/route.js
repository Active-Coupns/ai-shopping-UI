import { NextResponse } from "next/server";
import { verifyTravelEntity } from "@/services/travelEntityResolver";

export const maxDuration = 10;

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const query = String(body.query || "").trim();
    const category = String(body.category || "flights").toLowerCase();
    const country = String(body.country || "IN").toUpperCase();

    if (!query || query.length < 2) {
      return NextResponse.json({ success: false, error: "Query is too short" }, { status: 400 });
    }

    if (query.length > 80) {
      return NextResponse.json({ success: false, error: "Query exceeds maximum length" }, { status: 400 });
    }

    const verification = await verifyTravelEntity(query, category, country);

    return NextResponse.json(verification);
  } catch (error) {
    console.error("[Entity Verification API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify entity" },
      { status: 500 }
    );
  }
}
