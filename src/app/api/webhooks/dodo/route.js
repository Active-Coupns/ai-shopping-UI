import { NextResponse } from "next/server";
import crypto from "crypto";
import { redis } from "@/services/redis";

export const dynamic = "force-dynamic";

/**
 * Validates Dodo Payments standard webhook signature (HMAC-SHA256)
 */
function verifyDodoSignature(rawBody, request, secret) {
  if (!secret) return true;

  const webhookId = request.headers.get("webhook-id") || request.headers.get("x-webhook-id");
  const webhookTimestamp = request.headers.get("webhook-timestamp") || request.headers.get("x-webhook-timestamp");
  const signatureHeader = request.headers.get("webhook-signature") || request.headers.get("x-dodo-signature");

  if (!signatureHeader) {
    return false;
  }

  try {
    const rawSecret = secret.startsWith("whsec_") ? secret.substring(6) : secret;
    let secretKey;
    try {
      secretKey = Buffer.from(rawSecret, "base64");
    } catch {
      secretKey = Buffer.from(secret, "utf-8");
    }

    // Reject replay attacks older than 5 minutes
    if (webhookTimestamp) {
      const timestampSec = parseInt(webhookTimestamp, 10);
      const currentSec = Math.floor(Date.now() / 1000);
      if (Math.abs(currentSec - timestampSec) > 300) {
        console.warn("[Dodo Webhook] Timestamp skew exceeded 300s.");
        return false;
      }
    }

    const payloadToSign = webhookId && webhookTimestamp
      ? `${webhookId}.${webhookTimestamp}.${rawBody}`
      : rawBody;

    const expectedSig = crypto
      .createHmac("sha256", secretKey)
      .update(payloadToSign)
      .digest("base64");

    const sigParts = signatureHeader.split(" ");
    for (const part of sigParts) {
      const cleanSig = part.startsWith("v1,") ? part.substring(3) : part;
      if (cleanSig.length === expectedSig.length && crypto.timingSafeEqual(Buffer.from(cleanSig), Buffer.from(expectedSig))) {
        return true;
      }
    }
  } catch (err) {
    console.error("[Dodo Webhook Signature Verification Error]:", err.message);
  }

  return false;
}

/**
 * POST /api/webhooks/dodo
 * Webhook handler for Dodo Payments events (payment.succeeded, checkout.session.completed).
 * Grants purchased Try-On or Search credits additively in Upstash Redis with 60-day validity.
 */
export async function POST(request) {
  try {
    const rawBody = await request.text();
    const webhookSecret = process.env.DODO_WEBHOOK_SECRET;

    // Strict Webhook Signature Verification in Production
    if (process.env.NODE_ENV === "production" && webhookSecret) {
      const isValid = verifyDodoSignature(rawBody, request, webhookSecret);
      if (!isValid) {
        console.warn("[Dodo Webhook] Unauthorized webhook attempt: Invalid HMAC signature.");
        return NextResponse.json({ error: "UNAUTHORIZED_SIGNATURE" }, { status: 401 });
      }
    }

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
