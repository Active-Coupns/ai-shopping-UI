import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import crypto from "crypto";
import { checkRateLimit, checkSharedIpQuota } from "@/services/rateLimiter";
import { calculateBestCartCoupon } from "@/services/couponService";
import { safeClientError } from "@/lib/errorShield";
import { redis } from "@/services/redis";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

/**
 * Multimodal Cart Screenshot Analyzer using Gemini Vision
 */
export async function POST(req) {
  // 1. Server-Side Cryptographic Clerk Session Verification
  let userId = null;
  try {
    const authObj = getAuth(req);
    userId = authObj?.userId || null;
  } catch {
    console.warn("[Cart Analysis API] Authentication resolution error.");
    userId = null;
  }

  if (!userId) {
    return NextResponse.json(
      {
        success: false,
        error: "UNAUTHORIZED",
        message: "Sign-in required to analyze cart screenshots."
      },
      { status: 401 }
    );
  }

  // Check paid status (active Search Pack) to bypass free limits if applicable
  let isPaidUser = false;
  if (userId && redis) {
    try {
      const rawCredits = await redis.get(`user_search_credits:${userId}`);
      const rawExpiry = await redis.get(`user_search_expiry:${userId}`);
      const credits = parseInt(rawCredits || "0", 10);
      const expiry = parseInt(rawExpiry || "0", 10);
      if (credits > 0 && Date.now() <= expiry) {
        isPaidUser = true;
      }
    } catch (_) {}
  }

  // 2. Distributed Rate Limiting & Quota Protection (Fail-Closed, 5/24 hours, bypassed for paid users)
  if (!isPaidUser) {
    try {
      const dailyLimit = await checkRateLimit({
        namespace: "cart_analyze_daily",
        identifier: userId,
        limit: 5,
        windowSeconds: 86400
      });

      if (!dailyLimit || typeof dailyLimit !== "object" || dailyLimit.isBackendError) {
        const retrySec = Number.isInteger(dailyLimit?.retryAfter) && dailyLimit.retryAfter > 0 ? dailyLimit.retryAfter : 60;
        return NextResponse.json(
          {
            success: false,
            error: "RATE_LIMITER_UNAVAILABLE",
            message: "Cart analysis service is temporarily busy. Please retry shortly.",
            retryAfter: retrySec
          },
          {
            status: 503,
            headers: { "Retry-After": String(retrySec) }
          }
        );
      }

      if (!dailyLimit.allowed) {
        const retrySec = Number.isInteger(dailyLimit.retryAfter) && dailyLimit.retryAfter > 0 ? dailyLimit.retryAfter : 60;
        const hoursRemaining = Math.max(1, Math.ceil((dailyLimit.resetInSeconds || 86400) / 3600));
        return NextResponse.json(
          {
            success: false,
            error: "RATE_LIMIT_EXCEEDED",
            message: `Daily cart analysis limit reached (5/5 requests). Upgrade to Benefisto Search & Coupon Pack (₹49) to unlock unlimited on-demand analyses!`,
            retryAfter: retrySec,
            limit: dailyLimit.limit,
            remaining: dailyLimit.remaining,
            resetInSeconds: dailyLimit.resetInSeconds
          },
          {
            status: 429,
            headers: { "Retry-After": String(retrySec) }
          }
        );
      }

      // Shared IP Rolling 24-Hour Quota (10 requests per rolling 24h, Fail-Closed)
      const ipQuotaResult = await checkSharedIpQuota({
        request: req,
        limit: 10,
        windowSeconds: 86400
      });

      if (!ipQuotaResult || typeof ipQuotaResult !== "object" || ipQuotaResult.isBackendError) {
        const retrySec = Number.isInteger(ipQuotaResult?.retryAfter) && ipQuotaResult.retryAfter > 0 ? ipQuotaResult.retryAfter : 60;
        return NextResponse.json(
          {
            success: false,
            error: "RATE_LIMITER_UNAVAILABLE",
            message: "Cart analysis service is temporarily busy. Please retry shortly.",
            retryAfter: retrySec
          },
          {
            status: 503,
            headers: { "Retry-After": String(retrySec) }
          }
        );
      }

      if (!ipQuotaResult.allowed) {
        const retrySec = Number.isInteger(ipQuotaResult.retryAfter) && ipQuotaResult.retryAfter > 0 ? ipQuotaResult.retryAfter : 60;
        return NextResponse.json(
          {
            success: false,
            error: "IP_QUOTA_EXHAUSTED",
            message: "Daily limit reached for this network/device across free tools. Please try again later.",
            retryAfter: retrySec,
            limit: ipQuotaResult.limit,
            remaining: ipQuotaResult.remaining
          },
          {
            status: 429,
            headers: { "Retry-After": String(retrySec) }
          }
        );
      }

      // Device Hardware Footprint Abuse Protection (Max 5/day per physical device across accounts)
      const deviceFingerprint = req.headers.get("x-device-fingerprint") || req.headers.get("x-device-id") || null;
      if (deviceFingerprint && typeof deviceFingerprint === "string" && redis) {
        try {
          const deviceHash = crypto.createHash("sha256").update(deviceFingerprint).digest("hex").slice(0, 32);
          const deviceKey = `device:cart_analyze_daily:${deviceHash}`;
          const rawDevice = await redis.get(deviceKey);
          const deviceCount = parseInt(rawDevice || "0", 10);
          if (deviceCount >= 5) {
            return NextResponse.json(
              {
                success: false,
                error: "DEVICE_QUOTA_EXHAUSTED",
                message: "Daily free cart analysis limit reached (5/5) for this device. Quota resets at 12:00 AM IST! Upgrade to Search & Coupon Pack (₹49) for unlimited access.",
                remaining: 0
              },
              { status: 429 }
            );
          }
        } catch (_) {}
      }
    } catch {
      console.error("[Cart Analysis API] Limiter exception occurred.");
      return NextResponse.json(
        {
          success: false,
          error: "RATE_LIMITER_UNAVAILABLE",
          message: "Cart analysis service is temporarily busy. Please retry shortly.",
          retryAfter: 60
        },
        {
          status: 503,
          headers: { "Retry-After": "60" }
        }
      );
    }
  }

  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, error: "INVALID_JSON", message: "Invalid JSON request body." }, { status: 400 });
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ success: false, error: "INVALID_PAYLOAD", message: "Request body must be a JSON object." }, { status: 400 });
    }

    const { 
      imageBase64, 
      mimeType = "image/jpeg",
      country = "IN",
      isNewUser = false,
      paymentMethod = null,
      manualStore = null,
      manualCartTotal = null
    } = body;

    if (!imageBase64 && !manualCartTotal) {
      return NextResponse.json(
        { error: "Image data or cart total is required" },
        { status: 400 }
      );
    }

    let extractedData = null;

    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, "");

      const prompt = `You are the Benefisto Expert E-Commerce Checkout & Cart Visual Inspector.
Analyze this checkout or shopping cart screenshot carefully.
Extract and return ONLY a valid JSON object matching this schema:
{
  "detectedStore": string or null (Identify the exact brand, merchant, or restaurant name from the header logo, app bar, URL bar, or merchant details. E.g. "The Derma Co", "Zomato", "Dominos", "Walmart", "Swiggy", "Blinkit", "Myntra", "Pepperfry", "Target", "Argos", etc. If the store name is missing or ambiguous, return null),
  "cartTotal": number or null (Extract the numerical final cart subtotal or payable bill total, e.g. 1499 or 45.50. Clean number only, no currency signs),
  "currency": string (e.g. "INR", "USD", "GBP", "CAD", "AUD", "AED"),
  "itemsSummary": string (Short summary of items in cart, e.g. "2 Pizzas + Garlic Bread" or "Skincare Serums"),
  "alreadyAppliedCoupon": string or null (Promo code name if already applied in promo box, or null),
  "confidenceScore": number (0.0 to 1.0)
}
Important:
- Return ONLY raw JSON, with no markdown fences, no explanatory text.
- If the image does not show an e-commerce cart or checkout screen, set confidenceScore to 0.1 and detectedStore to null.`;

      const visionModels = [
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-1.5-flash-8b"
      ];

      if (GEMINI_API_KEY) {
        for (const model of visionModels) {
          try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
            const res = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      { text: prompt },
                      {
                        inline_data: {
                          mime_type: mimeType,
                          data: cleanBase64
                        }
                      }
                    ]
                  }
                ],
                generationConfig: {
                  temperature: 0.1,
                  response_mime_type: "application/json"
                }
              })
            });

            if (!res.ok) continue;

            const data = await res.json();
            const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawText) {
              const cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
              extractedData = JSON.parse(cleaned);
              break;
            }
          } catch (visionErr) {
            console.warn(`[Vision Error ${model}]:`, visionErr.message);
          }
        }
      }
    }

    const effectiveStore = manualStore || extractedData?.detectedStore || null;
    const effectiveTotal = manualCartTotal || extractedData?.cartTotal || null;

    if (!effectiveTotal || effectiveTotal <= 0) {
      return NextResponse.json({
        success: false,
        error: "UNREADABLE_CART",
        message: "Could not clearly detect your cart bill total from this image. Please upload a clear screenshot of your checkout/cart screen showing the bill."
      }, { status: 400 });
    }

    // If store name is not identifiable from image, prompt user to select store
    if (!effectiveStore) {
      return NextResponse.json({
        success: true,
        requiresStoreSelection: true,
        cartTotal: effectiveTotal,
        currency: extractedData?.currency || "INR",
        message: "Cart bill detected! Which store are you shopping on?",
        popularStores: [
          "Zomato", "Swiggy", "Blinkit", "Dominos India", "The Derma Co", 
          "Mamaearth", "Myntra", "Nykaa", "Pepperfry", "Walmart", "Target", "Amazon"
        ]
      });
    }

    // Run deterministic mathematical cart optimization
    const optimization = await calculateBestCartCoupon(
      effectiveStore,
      effectiveTotal,
      country,
      { isNewUser, paymentMethod, isPaidUser, userId }
    );

    if (optimization.requiresPaidTier) {
      return NextResponse.json({
        success: false,
        requiresPaidTier: true,
        storeName: optimization.storeName || effectiveStore,
        message: optimization.message,
        upgradeUrl: optimization.upgradeUrl || "/pricing?tab=search"
      });
    }

    if (deviceFingerprint && typeof deviceFingerprint === "string" && redis && !isPaidUser) {
      try {
        const deviceHash = crypto.createHash("sha256").update(deviceFingerprint).digest("hex").slice(0, 32);
        const deviceKey = `device:cart_analyze_daily:${deviceHash}`;
        redis.incr(deviceKey).then(() => redis.expire(deviceKey, 86400)).catch(() => {});
      } catch (_) {}
    }

    return NextResponse.json({
      success: true,
      analysis: {
        ...(extractedData || {}),
        detectedStore: effectiveStore,
        cartTotal: effectiveTotal
      },
      optimization
    });
  } catch (error) {
    console.error("[Cart Analysis Route Error]:", error);
    return NextResponse.json(
      { error: "Cart analysis failed", details: safeClientError(error).message },
      { status: 500 }
    );
  }
}
