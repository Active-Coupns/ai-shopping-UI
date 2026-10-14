import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { redis } from "@/services/redis";
import { checkRateLimit, checkSharedIpQuota } from "@/services/rateLimiter";
import { getDealsForCategory, DEAL_CATEGORIES } from "@/services/dealsService";

function getCategoryCacheKey(categoryId = "smartphones", country = "IN") {
  const normCatId = (categoryId || "smartphones").toLowerCase().trim();
  const catConfig = DEAL_CATEGORIES.find(c => c.id === normCatId) || DEAL_CATEGORIES[0];
  const countryCode = (country || "IN").toLowerCase();
  return `cache:category_deals:v4:${catConfig.id}:${countryCode}`;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "smartphones";
    const country = searchParams.get("country") || "IN";

    // 1. Tiered Access: Check Upstash Redis Cache First
    // Public guests can access cached deals without cost.
    const cacheKey = getCategoryCacheKey(category, country);
    let cachedResult = null;
    try {
      const raw = await redis.get(cacheKey);
      if (raw) {
        const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
        if (Array.isArray(parsed?.deals) && parsed.deals.length > 0) {
          cachedResult = {
            ...parsed,
            cached: true
          };
        }
      }
    } catch (err) {
      console.warn("[API Deals] Redis cache lookup failed:", err.message);
    }

    if (cachedResult) {
      return NextResponse.json(cachedResult);
    }

    // 2. Cache Miss: Require Server-Side Verified Clerk Authentication
    // Prevents unauthenticated guests or scrapers from triggering paid RapidAPI calls.
    let userId = null;
    try {
      const authObj = getAuth(request);
      userId = authObj?.userId || null;
    } catch (authErr) {
      console.warn("[API Deals] Auth resolution error:", authErr.message);
      userId = null;
    }

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "UNAUTHORIZED",
          message: "Sign-in required to fetch live category deals."
        },
        { status: 401 }
      );
    }

    // 3. Distributed Rate Limiting & Quota Protection on Cache Miss (Fail-Closed)
    // Evaluated after authentication, but strictly before invoking the paid deals provider.
    try {
      // 3a. Short window: 5 requests per 60 seconds
      const minuteLimit = await checkRateLimit({
        namespace: "category_deals_minute",
        identifier: userId,
        limit: 5,
        windowSeconds: 60
      });

      if (minuteLimit.isBackendError) {
        return NextResponse.json(
          {
            success: false,
            error: "RATE_LIMITER_UNAVAILABLE",
            message: "Category deals service is temporarily busy. Please retry shortly.",
            retryAfter: minuteLimit.retryAfter || 60
          },
          {
            status: 503,
            headers: { "Retry-After": String(minuteLimit.retryAfter || 60) }
          }
        );
      }

      if (!minuteLimit.allowed) {
        return NextResponse.json(
          {
            success: false,
            error: "RATE_LIMIT_EXCEEDED",
            message: `Too many category deals requests. Please wait ${minuteLimit.retryAfter}s before requesting again.`,
            retryAfter: minuteLimit.retryAfter,
            limit: minuteLimit.limit,
            remaining: minuteLimit.remaining,
            resetInSeconds: minuteLimit.resetInSeconds
          },
          {
            status: 429,
            headers: { "Retry-After": String(minuteLimit.retryAfter) }
          }
        );
      }

      // 3b. Daily window: 5 requests per 24 hours (86,400 seconds)
      const dailyLimit = await checkRateLimit({
        namespace: "category_deals_daily",
        identifier: userId,
        limit: 5,
        windowSeconds: 86400
      });

      if (dailyLimit.isBackendError) {
        return NextResponse.json(
          {
            success: false,
            error: "RATE_LIMITER_UNAVAILABLE",
            message: "Category deals service is temporarily busy. Please retry shortly.",
            retryAfter: dailyLimit.retryAfter || 60
          },
          {
            status: 503,
            headers: { "Retry-After": String(dailyLimit.retryAfter || 60) }
          }
        );
      }

      if (!dailyLimit.allowed) {
        return NextResponse.json(
          {
            success: false,
            error: "RATE_LIMIT_EXCEEDED",
            message: `Daily category deals limit reached (5/5 requests). Your quota resets in ${Math.ceil(dailyLimit.resetInSeconds / 3600)} hours.`,
            retryAfter: dailyLimit.retryAfter,
            limit: dailyLimit.limit,
            remaining: dailyLimit.remaining,
            resetInSeconds: dailyLimit.resetInSeconds
          },
          {
            status: 429,
            headers: { "Retry-After": String(dailyLimit.retryAfter) }
          }
        );
      }

      // 3c. Shared IP Rolling 24-Hour Quota (10 requests per rolling 24h, Fail-Closed)
      const ipQuotaResult = await checkSharedIpQuota({
        request,
        limit: 10,
        windowSeconds: 86400
      });

      if (ipQuotaResult.isBackendError) {
        return NextResponse.json(
          {
            success: false,
            error: "RATE_LIMITER_UNAVAILABLE",
            message: "Category deals service is temporarily busy. Please retry shortly.",
            retryAfter: ipQuotaResult.retryAfter || 60
          },
          {
            status: 503,
            headers: { "Retry-After": String(ipQuotaResult.retryAfter || 60) }
          }
        );
      }

      if (!ipQuotaResult.allowed) {
        return NextResponse.json(
          {
            success: false,
            error: "IP_QUOTA_EXHAUSTED",
            message: "Daily limit reached for this network/device across free tools. Please try again later.",
            retryAfter: ipQuotaResult.retryAfter,
            limit: ipQuotaResult.limit,
            remaining: ipQuotaResult.remaining
          },
          {
            status: 429,
            headers: { "Retry-After": String(ipQuotaResult.retryAfter) }
          }
        );
      }
    } catch (limiterErr) {
      console.warn("[API Deals] Limiter unexpected exception:", limiterErr.message);
      return NextResponse.json(
        {
          success: false,
          error: "RATE_LIMITER_UNAVAILABLE",
          message: "Category deals service is temporarily busy. Please retry shortly.",
          retryAfter: 60
        },
        {
          status: 503,
          headers: { "Retry-After": "60" }
        }
      );
    }

    // 4. Authenticated Cache Miss: Fetch live deals via provider
    const result = await getDealsForCategory(category, country);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[API Deals Error]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  // POST always requires authenticated session
  let userId = null;
  try {
    const authObj = getAuth(request);
    userId = authObj?.userId || null;
  } catch (authErr) {
    console.warn("[API Deals] Auth resolution error:", authErr.message);
    userId = null;
  }

  if (!userId) {
    return NextResponse.json(
      {
        success: false,
        error: "UNAUTHORIZED",
        message: "Sign-in required to access category deals via POST."
      },
      { status: 401 }
    );
  }

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
