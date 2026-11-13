import { NextResponse } from "next/server";
import { redis } from "@/services/redis";
import { supabase } from "@/lib/supabaseClient";
import { getAuth } from "@clerk/nextjs/server";

const MAX_HISTORY_ITEMS = 12;
const JOURNEY_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 Days

/**
 * Helper to determine budget tier from price numbers
 */
function inferBudgetTier(prices) {
  if (!prices || prices.length === 0) return "unspecified";
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
  if (avg < 3000) return "budget-daily";
  if (avg < 25000) return "budget-electronics";
  if (avg < 75000) return "mid-range";
  return "premium";
}

/**
 * GET /api/telemetry/event
 * Retrieve session journey ledger or clear on request
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const action = searchParams.get("action");

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
    }

    const redisKey = `user:journey:${sessionId}`;

    if (action === "clear") {
      try {
        await redis.del(redisKey);
      } catch (err) {
        console.warn("[Telemetry] Error clearing journey:", err);
      }
      return NextResponse.json({ success: true, message: "Journey cleared" });
    }

    let journey = null;
    try {
      const data = await redis.get(redisKey);
      journey = typeof data === "string" ? JSON.parse(data) : data;
    } catch (err) {
      console.warn("[Telemetry] Error fetching journey:", err);
    }

    return NextResponse.json({
      success: true,
      sessionId,
      journey: journey || {
        session: { sessionId, visitCount: 1, firstSeen: Date.now(), lastSeen: Date.now() },
        searches: [],
        clickedProducts: [],
        aiSummaries: [],
        guideContext: null,
        preferences: { budgetTier: "unspecified", topCategories: [] }
      }
    });
  } catch (err) {
    console.error("[Telemetry GET Error]", err);
    return NextResponse.json({ error: "Failed to retrieve journey" }, { status: 500 });
  }
}

/**
 * POST /api/telemetry/event
 * Log non-intrusive user journey events (VISIT, SEARCH, PRODUCT_CLICK, AI_SUMMARY_ASKED, AI_GUIDE_SYNC)
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { sessionId, eventType, payload = {} } = body;

    if (!sessionId || !eventType) {
      return NextResponse.json({ error: "sessionId and eventType are required" }, { status: 400 });
    }

    let serverUserId = null;
    try {
      const auth = getAuth(request);
      serverUserId = auth?.userId || null;
    } catch (_) {}

    const now = Date.now();
    const redisKey = `user:journey:${sessionId}`;

    // 1. Fetch current journey or initialize
    let currentJourney = null;
    try {
      const raw = await redis.get(redisKey);
      currentJourney = typeof raw === "string" ? JSON.parse(raw) : raw;
    } catch (err) {
      console.warn("[Telemetry] Redis fetch warning:", err);
    }

    if (!currentJourney) {
      currentJourney = {
        session: {
          sessionId,
          visitCount: 1,
          firstSeen: now,
          lastSeen: now
        },
        user: null,
        searches: [],
        clickedProducts: [],
        aiSummaries: [],
        guideContext: null,
        preferences: {
          budgetTier: "unspecified",
          topCategories: []
        }
      };
    } else {
      currentJourney.session.lastSeen = now;
    }

    // Attach authenticated user information if available
    const resolvedUserId = body.userId || serverUserId || currentJourney.user?.userId || null;
    const resolvedUserEmail = body.userEmail || currentJourney.user?.email || null;
    const resolvedUserName = body.userName || currentJourney.user?.name || null;

    if (resolvedUserId || resolvedUserEmail) {
      currentJourney.user = {
        userId: resolvedUserId,
        email: resolvedUserEmail,
        name: resolvedUserName,
        linkedAt: currentJourney.user?.linkedAt || now
      };
    }

    // 2. Process specific event types
    switch (eventType) {
      case "VISIT": {
        // Increment visit count if last seen was more than 30 mins ago
        if (now - (currentJourney.session.lastActiveTime || 0) > 30 * 60 * 1000) {
          currentJourney.session.visitCount = (currentJourney.session.visitCount || 1) + 1;
        }
        currentJourney.session.lastActiveTime = now;
        break;
      }

      case "SEARCH": {
        const queryText = String(payload.query || "").trim();
        const mode = payload.mode || "shopping";
        if (queryText) {
          // Avoid immediate duplicates
          const filtered = (currentJourney.searches || []).filter(
            s => s.query.toLowerCase() !== queryText.toLowerCase()
          );
          currentJourney.searches = [
            { query: queryText, mode, timestamp: now },
            ...filtered
          ].slice(0, MAX_HISTORY_ITEMS);
        }
        break;
      }

      case "PRODUCT_CLICK": {
        const { title, price, store, dealLink } = payload;
        if (title) {
          const filtered = (currentJourney.clickedProducts || []).filter(
            p => p.title.toLowerCase() !== title.toLowerCase()
          );
          currentJourney.clickedProducts = [
            { title, price, store, dealLink, timestamp: now },
            ...filtered
          ].slice(0, MAX_HISTORY_ITEMS);

          // Update affiliate click telemetry counter
          try {
            await redis.incr("telemetry:affiliate_clicks");
          } catch (_) {}
        }
        break;
      }

      case "AI_SUMMARY_ASKED": {
        const { title, price, store, category = "ecommerce" } = payload;
        if (title) {
          const filtered = (currentJourney.aiSummaries || []).filter(
            p => p.title.toLowerCase() !== title.toLowerCase()
          );
          currentJourney.aiSummaries = [
            { title, price, store, category, timestamp: now },
            ...filtered
          ].slice(0, MAX_HISTORY_ITEMS);
        }
        break;
      }

      case "AI_GUIDE_SYNC": {
        const { userPersona, budgetLimit, lastAdvice, suggestedQuery } = payload;
        currentJourney.guideContext = {
          userPersona: userPersona || currentJourney.guideContext?.userPersona || null,
          budgetLimit: budgetLimit || currentJourney.guideContext?.budgetLimit || null,
          lastAdvice: lastAdvice || currentJourney.guideContext?.lastAdvice || null,
          suggestedQuery: suggestedQuery || currentJourney.guideContext?.suggestedQuery || null,
          timestamp: now
        };
        break;
      }

      default:
        break;
    }

    // 3. Update inferred preferences (Budget Tier)
    const allPrices = [
      ...(currentJourney.clickedProducts || []),
      ...(currentJourney.aiSummaries || [])
    ]
      .map(p => parseInt(String(p.price).replace(/[^0-9]/g, ""), 10))
      .filter(n => !isNaN(n) && n > 0);

    if (allPrices.length > 0) {
      currentJourney.preferences.budgetTier = inferBudgetTier(allPrices);
    }
    if (currentJourney.guideContext?.userPersona) {
      currentJourney.preferences.activePersona = currentJourney.guideContext.userPersona;
    }

    // 4. Save to Redis with 30-day TTL
    try {
      await redis.set(redisKey, JSON.stringify(currentJourney), { ex: JOURNEY_TTL_SECONDS });
      await redis.incr("telemetry:total_events");
      await redis.incr(`telemetry:event:${eventType.toLowerCase()}`);
    } catch (saveErr) {
      console.warn("[Telemetry Event Save Warning]", saveErr);
    }

    // 5. Permanent Persistence to Supabase Database (Lean User Activity Ledger)
    try {
      const email = resolvedUserEmail || currentJourney.user?.email || null;
      let details = "";
      let category = payload.category || "shopping";

      if (eventType === "SEARCH") {
        details = String(payload.query || "").trim().slice(0, 150);
        category = payload.mode || "shopping";
      } else if (eventType === "PRODUCT_CLICK") {
        details = `${payload.store || "Store"}: ${payload.title || ""} (${payload.price || "N/A"})`.slice(0, 200);
        category = payload.category || "shopping";
      } else if (eventType === "AI_SUMMARY_ASKED") {
        details = `AI Review: ${payload.title || ""}`.slice(0, 150);
        category = payload.category || "shopping";
      } else if (eventType === "VISIT") {
        details = `Page Visit (session #${currentJourney.session?.visitCount || 1})`;
        category = "platform";
      } else if (eventType === "USER_AUTH_SYNC") {
        details = `User Login / Auth Sync (${email || "Signed In"})`;
        category = "auth";
      } else {
        details = typeof payload === "string" ? payload : JSON.stringify(payload).slice(0, 150);
      }

      if (details) {
        // Multi-Country Virtual Regional Partition (Zero Cost)
        const userCountry = String(payload.country || request.headers.get("cf-ipcountry") || request.headers.get("x-vercel-ip-country") || "IN").toUpperCase().slice(0, 4);
        const regionalDetails = `[${userCountry}] ${details}`;

        // Non-blocking async insert to Supabase event stream
        supabase
          .from("user_activity_ledger")
          .insert({
            user_email: email,
            session_id: sessionId,
            action: eventType,
            category,
            details: regionalDetails
          })
          .then(({ error: sbErr }) => {
            if (sbErr && !sbErr.message.includes("schema cache")) {
              console.warn("[Activity Ledger Note]", sbErr.message);
            }
          })
          .catch(err => {
            console.warn("[Activity Ledger Sync Error]", err.message);
          });
      }
    } catch (sbEx) {
      console.warn("[Activity Ledger Exception]", sbEx.message);
    }

    return NextResponse.json({
      success: true,
      sessionId,
      eventType,
      journey: currentJourney
    });
  } catch (err) {
    console.error("[Telemetry Event POST Error]", err);
    return NextResponse.json({ error: "Failed to record event" }, { status: 500 });
  }
}
