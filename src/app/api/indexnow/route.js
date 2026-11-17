import { NextResponse } from "next/server";
import { getAllUniversalSubscriptionSlugs } from "@/data/subscriptionsRegistry";
import { getAllTravelSlugs, getAllEventSlugs } from "@/data/travelRegistry";
import { COUNTRY_TOP_BRANDS } from "@/data/countryBrandsCatalog";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const INDEXNOW_KEY = "e82fa9163b494191a34b22c74d812f90";
const HOST = "www.benefisto.com";
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

/**
 * Helper to compile the default priority batch of programmatic URLs
 */
function getPriorityUrlBatch(limit = 100) {
  const baseUrl = `https://${HOST}`;
  const urls = [
    baseUrl,
    `${baseUrl}/travel`,
    `${baseUrl}/events`,
    `${baseUrl}/subscriptions`,
  ];

  // Top travel slugs
  const travelSlugs = getAllTravelSlugs().slice(0, 30);
  travelSlugs.forEach((s) => urls.push(`${baseUrl}/travel/${s}`));

  // Top event slugs
  const eventSlugs = getAllEventSlugs().slice(0, 20);
  eventSlugs.forEach((s) => urls.push(`${baseUrl}/events/${s}`));

  // Top subscription slugs
  const subSlugs = getAllUniversalSubscriptionSlugs().slice(0, 30);
  subSlugs.forEach((s) => urls.push(`${baseUrl}/subscriptions/${s}`));

  // Top retail brands
  const seenBrands = new Set();
  for (const list of Object.values(COUNTRY_TOP_BRANDS)) {
    for (const b of list) {
      if (!seenBrands.has(b.id) && urls.length < limit) {
        seenBrands.add(b.id);
        urls.push(`${baseUrl}/coupons/${b.id}`);
      }
    }
  }

  return urls.slice(0, limit);
}

/**
 * POST /api/indexnow
 * Accepts optional JSON body: { urls: string[] }
 */
export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Security Guard: Check Bearer token in production
    if (cronSecret && process.env.NODE_ENV === "production") {
      const isBearerValid = authHeader === `Bearer ${cronSecret}`;
      if (!isBearerValid) {
        return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });
      }
    }

    let customUrls = null;
    try {
      const body = await request.json();
      if (Array.isArray(body?.urls) && body.urls.length > 0) {
        customUrls = body.urls;
      }
    } catch (_) {
      // Body is empty or not JSON, fallback to priority batch
    }

    const urlList = customUrls || getPriorityUrlBatch(100);

    const payload = {
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList: urlList,
    };

    // Submit to IndexNow API (Microsoft Bing & Participating Engines)
    let indexNowResponse = null;
    let responseStatus = 200;
    try {
      const res = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      responseStatus = res.status;
      indexNowResponse = {
        status: res.status,
        statusText: res.statusText,
      };
    } catch (err) {
      indexNowResponse = {
        status: 502,
        error: err.message,
      };
    }

    return NextResponse.json({
      success: true,
      protocol: "IndexNow (Microsoft Bing & Search Engines)",
      host: HOST,
      keyLocation: KEY_LOCATION,
      submittedCount: urlList.length,
      sampleUrls: urlList.slice(0, 5),
      engineResponse: indexNowResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/indexnow
 * Convenience handler for health check or cron ping
 */
export async function GET(request) {
  return POST(request);
}
