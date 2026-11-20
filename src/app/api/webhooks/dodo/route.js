import { NextResponse } from "next/server";
import { redis } from "@/services/redis";

export const dynamic = "force-dynamic";

/**
 * POST /api/webhooks/dodo
 * Webhook handler for Dodo Payments events (payment.succeeded, subscription.active).
 * Grants purchased sparks/credits atomically in Upstash Redis.
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
      const sparksToAdd = parseInt(metadata.sparks || "30", 10);
      const planKey = metadata.planKey || "starter";

      if (userId && redis) {
        // Atomic increment of user purchased sparks in Upstash Redis
        const sparksKey = `user_sparks:${userId}`;
        await redis.incrby(sparksKey, sparksToAdd);

        // Record transaction receipt
        const historyKey = `user_payments:${userId}`;
        await redis.lpush(
          historyKey,
          JSON.stringify({
            paymentId: payload?.payment_id || payload?.id,
            sparks: sparksToAdd,
            planKey,
            amount: payload?.amount,
            currency: payload?.currency,
            timestamp: new Date().toISOString()
          })
        );
        // Keep last 20 transaction records
        await redis.ltrim(historyKey, 0, 19);

        console.log(`[Dodo Webhook] Successfully granted ${sparksToAdd} sparks to user ${userId}`);
      }
    }

    // Handle Subscription Active
    if (eventType === "subscription.active" || eventType === "subscription.created") {
      const metadata = payload?.metadata || {};
      const userId = metadata.userId || payload?.customer?.customer_id;

      if (userId && redis) {
        // Mark user as VIP member in Redis with 35-day TTL
        await redis.set(`user_vip:${userId}`, "true", { ex: 35 * 24 * 60 * 60 });
        // Also grant initial VIP monthly quota (250 sparks)
        await redis.incrby(`user_sparks:${userId}`, 250);
        console.log(`[Dodo Webhook] User ${userId} upgraded to Benefisto VIP!`);
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
    service: "Benefisto Dodo Payments Webhook Endpoint",
    timestamp: new Date().toISOString()
  });
}
