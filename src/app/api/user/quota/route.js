import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { extractTrustedClientIp, checkUnifiedApiQuota } from "@/services/rateLimiter";

export const dynamic = "force-dynamic";

/**
 * GET /api/user/quota
 * Universal Server-Side Live Quota Query Endpoint.
 * Resolves the authenticated user ID (or trusted IP/device for guests)
 * and reads the exact remaining daily credits from Upstash Redis without consuming any quota.
 */
export async function GET(request) {
  try {
    let userId = null;
    try {
      const authObj = getAuth(request);
      userId = authObj?.userId || null;
    } catch (_) {
      userId = null;
    }

    const clientIp = extractTrustedClientIp(request);
    const deviceFingerprint = request.headers.get("x-device-fingerprint") || null;

    // Read remaining quota atomically without incrementing (isCacheHit: true)
    const quota = await checkUnifiedApiQuota({
      userId,
      clientIp,
      deviceFingerprint,
      isCacheHit: true,
      limit: 10
    });

    const remaining = typeof quota?.remaining === "number" ? quota.remaining : 10;
    const current = typeof quota?.current === "number" ? quota.current : 0;

    return NextResponse.json(
      {
        success: true,
        authenticated: !!userId,
        userId: userId ? `${userId.slice(0, 10)}...` : null,
        searchesLeft: remaining,
        current,
        totalLimit: 10,
        allowed: quota?.allowed !== false
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
        }
      }
    );
  } catch (err) {
    console.error("[User Quota Route] Live quota read error:", err);
    return NextResponse.json(
      {
        success: false,
        searchesLeft: 10,
        totalLimit: 10,
        allowed: true
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0"
        }
      }
    );
  }
}
