import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { checkRateLimit, checkSharedIpQuota } from "@/services/rateLimiter";
import { extractProductInfoFromUrl, isProductUrl } from "@/lib/urlProductParser";
import { analyzeProductPurchaseStrategy } from "@/services/terminalStrategyService";

export async function POST(request) {
  // 1. Server-Side Cryptographic Clerk Session Verification (Zero Trust in Client Headers)
  let userId = null;
  try {
    const authObj = getAuth(request);
    userId = authObj?.userId || null;
  } catch {
    console.warn("[Terminal API] Authentication resolution error.");
    userId = null;
  }

  if (!userId) {
    return NextResponse.json(
      {
        success: false,
        error: "UNAUTHORIZED",
        message: "Sign-in required to analyze product purchase strategies."
      },
      { status: 401 }
    );
  }

  // 2. Distributed Rate Limiting & Quota Protection (Fail-Closed)
  // Evaluated before request-body parsing or any Scraper/RapidAPI/Groq invocation.
  try {
    const dailyLimit = await checkRateLimit({
      namespace: "terminal_analyze_daily",
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
          message: "Smart Purchase Terminal is temporarily busy. Please retry shortly.",
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
          message: `Daily terminal analysis limit reached (5/5 requests). Your quota resets in ${hoursRemaining} hours.`,
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
      request,
      limit: 10,
      windowSeconds: 86400
    });

    if (!ipQuotaResult || typeof ipQuotaResult !== "object" || ipQuotaResult.isBackendError) {
      const retrySec = Number.isInteger(ipQuotaResult?.retryAfter) && ipQuotaResult.retryAfter > 0 ? ipQuotaResult.retryAfter : 60;
      return NextResponse.json(
        {
          success: false,
          error: "RATE_LIMITER_UNAVAILABLE",
          message: "Smart Purchase Terminal is temporarily busy. Please retry shortly.",
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
  } catch {
    console.error("[Terminal API] Limiter exception occurred.");
    return NextResponse.json(
      {
        success: false,
        error: "RATE_LIMITER_UNAVAILABLE",
        message: "Smart Purchase Terminal is temporarily busy. Please retry shortly.",
        retryAfter: 60
      },
      {
        status: 503,
        headers: { "Retry-After": "60" }
      }
    );
  }

  // 3. Request Payload Processing & Safe Shape Validation
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "INVALID_JSON", message: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    // Require non-null, non-array object
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, error: "INVALID_PAYLOAD", message: "Request body must be a JSON object." },
        { status: 400 }
      );
    }

    const rawUrl = typeof body.url === "string" ? body.url.trim() : "";
    const rawQuery = typeof body.query === "string" ? body.query.trim() : "";
    const country = typeof body.country === "string" && body.country.trim().length > 0 ? body.country.trim() : "IN";

    const targetInput = rawUrl || rawQuery;
    if (!targetInput) {
      return NextResponse.json(
        { success: false, error: "MISSING_INPUT", message: "A valid product link or name is required." },
        { status: 400 }
      );
    }

    let detectedStore = "Amazon.in";
    let resolvedTitle = targetInput;
    let canonicalUrl = targetInput;

    if (isProductUrl(targetInput)) {
      const info = extractProductInfoFromUrl(targetInput);
      detectedStore = info.store;
      resolvedTitle = info.title;
      canonicalUrl = info.canonicalUrl;
    }

    // Run the full multi-store and brand strategy pipeline
    const strategy = await analyzeProductPurchaseStrategy({
      url: canonicalUrl,
      title: resolvedTitle,
      store: detectedStore,
      country
    });

    return NextResponse.json({
      success: true,
      data: strategy
    });
  } catch (error) {
    console.error("[API /api/terminal/analyze] Strategy execution failed:", error?.message);
    return NextResponse.json(
      { 
        success: false,
        error: "INTERNAL_ERROR",
        message: "Failed to analyze product purchase strategy. Please retry shortly."
      },
      { status: 500 }
    );
  }
}
