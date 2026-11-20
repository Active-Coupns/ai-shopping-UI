import { NextResponse } from "next/server";
import { getAuth, currentUser } from "@clerk/nextjs/server";
import { createDodoCheckoutSession, DODO_PRODUCTS } from "@/services/dodoService";
import { extractTrustedClientIp } from "@/services/rateLimiter";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    let userId = null;
    let userEmail = null;
    let userName = null;

    try {
      const auth = getAuth(request);
      userId = auth?.userId || null;
      if (userId) {
        const user = await currentUser();
        userEmail = user?.primaryEmailAddress?.emailAddress || null;
        userName = user?.fullName || user?.firstName || "Shopper";
      }
    } catch (_) {
      // Guest or non-logged in
    }

    const body = await request.json().catch(() => ({}));
    const { planKey = "power", country = "IN", returnUrl } = body;

    if (!DODO_PRODUCTS[planKey]) {
      return NextResponse.json(
        { success: false, error: "INVALID_PLAN", message: `Unknown plan key: ${planKey}` },
        { status: 400 }
      );
    }

    const clientIp = extractTrustedClientIp(request);
    const resolvedUserId = userId || `anon_${clientIp.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 20)}`;

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://www.benefisto.com");
    const finalReturnUrl = returnUrl || `${baseUrl}/?payment=success&plan=${planKey}`;

    const session = await createDodoCheckoutSession({
      planKey,
      userId: resolvedUserId,
      userEmail: userEmail || `shopper_${Date.now()}@benefisto.com`,
      userName,
      country,
      returnUrl: finalReturnUrl
    });

    return NextResponse.json({
      success: true,
      planKey,
      checkoutUrl: session.checkoutUrl,
      sessionId: session.sessionId
    });
  } catch (error) {
    console.error("[Payments Checkout Route] Error generating checkout:", error);
    return NextResponse.json(
      { success: false, error: "CHECKOUT_FAILED", message: error.message },
      { status: 500 }
    );
  }
}
