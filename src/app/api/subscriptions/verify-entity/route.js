import { NextResponse } from "next/server";
import { verifySubscriptionEntity } from "@/services/subscriptionEntityResolver";

export const maxDuration = 10;

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const query = String(body.query || "").trim();
    const country = String(body.country || "IN").toUpperCase();

    if (!query || query.length < 2) {
      return NextResponse.json({ success: false, error: "Query is too short" }, { status: 400 });
    }

    if (query.length > 80) {
      return NextResponse.json({ success: false, error: "Query exceeds maximum length" }, { status: 400 });
    }

    const verification = await verifySubscriptionEntity(query, country);
    return NextResponse.json(verification);
  } catch (error) {
    console.error("[Subscription Verification API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify subscription entity" },
      { status: 500 }
    );
  }
}
