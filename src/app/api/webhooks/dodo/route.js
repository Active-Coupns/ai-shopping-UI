import { NextResponse } from "next/server";
import { redis } from "@/services/redis";

export const dynamic = "force-dynamic";

/**
 * POST /api/webhooks/dodo
 * Webhook handler for Dodo Payments events (payment.succeeded, checkout.session.completed).
 * Grants purchased Try-On or Search credits additively in Upstash Redis with 60-day validity.
 */
export async function POST(request) {
  try {
    const rawBody = await request.text();
    let event = null;

    try {
      event = JSON.parse(rawBody);
    } catch (parseErr) {
      console.error("[Dodo Webhook] Failed to parse JSON:", parseErr.message);
      return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
    }

    const eventType = event?.type || event?.event_type || "";
    const payload = event?.data || event;

    console.log(`[Dodo Webhook] Received event: ${eventType}`);

    // Handle Payment Succeeded
    if (eventType === "payment.succeeded" || eventType === "checkout.session.completed") {
      const metadata = payload?.metadata || {};
      const userId = metadata.userId || payload?.customer?.customer_id;
      const planKey = metadata.planKey || "";
      const validityDays = parseInt(metadata.validityDays || "60", 10);
      const validityMs = validityDays * 24 * 60 * 60 * 1000;

      // Determine Category: 'tryon' or 'search'
      let category = metadata.category;
      if (!category) {
        if (planKey.startsWith("tryon")) category = "tryon";
        else if (planKey.startsWith("search")) category = "search";
        else category = "tryon"; // default
      }

      // Determine Credits to Add
      let creditsToAdd = parseInt(metadata.credits || "0", 10);
      if (!creditsToAdd || isNaN(creditsToAdd)) {
        if (planKey === "tryon_medium") creditsToAdd = 14;
        else if (planKey === "tryon_large") creditsToAdd = 30;
        else if (planKey === "search_medium") creditsToAdd = 120;
        else if (planKey === "search_large") creditsToAdd = 260;
        else creditsToAdd = 14;
      }

      if (userId && redis) {
        const now = Date.now();

        if (category === "tryon") {
          // 1. Additive Top-up for Virtual Try-On Credits
          const creditKey = `user_tryon_credits:${userId}`;
          const expiryKey = `user_tryon_expiry:${userId}`;

          await redis.incrby(creditKey, creditsToAdd);

          // Extend or set 60-day expiry window from date of latest top-up
          const rawCurrentExpiry = await redis.get(expiryKey);
          const currentExpiry = parseInt(rawCurrentExpiry || "0", 10);
          const newExpiry = Math.max(now + validityMs, currentExpiry);
          await redis.set(expiryKey, String(newExpiry));

          console.log(`[Dodo Webhook] Added ${creditsToAdd} Try-On credits to ${userId}. New expiry: ${new Date(newExpiry).toISOString()}`);
        } else {
          // 2. Additive Top-up for AI Search API Credits
          const creditKey = `user_search_credits:${userId}`;
          const expiryKey = `user_search_expiry:${userId}`;

          await redis.incrby(creditKey, creditsToAdd);

          // Extend or set 60-day expiry window from date of latest top-up
          const rawCurrentExpiry = await redis.get(expiryKey);
          const currentExpiry = parseInt(rawCurrentExpiry || "0", 10);
          const newExpiry = Math.max(now + validityMs, currentExpiry);
          await redis.set(expiryKey, String(newExpiry));

          console.log(`[Dodo Webhook] Added ${creditsToAdd} Search credits to ${userId}. New expiry: ${new Date(newExpiry).toISOString()}`);
        }

        // 3. Record transaction receipt in Redis
        const historyKey = `user_payments:${userId}`;
        await redis.lpush(
          historyKey,
          JSON.stringify({
            paymentId: payload?.payment_id || payload?.id,
            category,
            creditsAdded: creditsToAdd,
            planKey,
            amount: payload?.amount,
            currency: payload?.currency,
            timestamp: new Date().toISOString()
          })
        );
        await redis.ltrim(historyKey, 0, 19);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[Dodo Webhook] Internal processing error:", err);
    return NextResponse.json({ error: "INTERNAL_ERROR", message: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "Benefisto Dodo Payments Webhook Endpoint (Additive Top-up 60-Day)",
    timestamp: new Date().toISOString()
  });
}
