import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { recordComplianceConsent, getUserConsentStatus } from "@/services/compliance";
import { extractTrustedClientIp } from "@/services/rateLimiter";

export async function GET(request) {
  try {
    const authObj = getAuth(request);
    const userId = authObj?.userId;
    if (!userId) {
      return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });
    }

    const consentStatus = await getUserConsentStatus(userId);
    return NextResponse.json({ success: true, consentStatus }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const authObj = getAuth(request);
    const userId = authObj?.userId;
    if (!userId) {
      return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { consentType, version = "1.0", email = "", metadata = {} } = body;

    if (!consentType) {
      return NextResponse.json({ success: false, error: "consentType is required" }, { status: 400 });
    }

    const clientIp = extractTrustedClientIp(request);
    const userAgent = request.headers.get("user-agent") || "Unknown";

    const result = await recordComplianceConsent({
      userId,
      email,
      consentType,
      version,
      ipAddress: clientIp,
      userAgent,
      metadata
    });

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
