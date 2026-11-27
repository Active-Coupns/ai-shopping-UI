import { NextResponse } from "next/server";
import { 
  getTodayShardId, 
  syncShard, 
  syncFeedicoBulk, 
  loadPersistentStore 
} from "@/services/couponRollingSyncEngine";

export const maxDuration = 60; // Allow 60s runtime for multi-brand sync batch
export const dynamic = "force-dynamic";

/**
 * Constant-time string comparison to prevent timing attacks
 */
function safeCompareTokens(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * Benefisto — Multi-Tier Rolling Coupon Synchronization Cron
 * 
 * Runs a daily rolling sync across Feedico bulk feeds + today's partitioned shard of ~75 brands.
 * Persists directly into `src/data/liveCouponsStore.json` (zero volatile cache eviction).
 * Protected by CRON_SECRET against unauthorized calls.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // 1. Strict Security Guard: Verify Bearer Secret or Query Secret in production
    if (process.env.NODE_ENV === "production" && cronSecret) {
      const isBearerValid = safeCompareTokens(authHeader, `Bearer ${cronSecret}`);
      const isParamValid = safeCompareTokens(searchParams.get("secret"), cronSecret);
      if (!isBearerValid && !isParamValid) {
        return NextResponse.json({ success: false, error: "UNAUTHORIZED_CRON" }, { status: 401 });
      }
    }

    // 2. Identify Shard ID (defaults to today's rolling shard 1-6)
    const customShard = searchParams.get("shard");
    const shardId = customShard ? Math.min(6, Math.max(1, Number(customShard))) : getTodayShardId();
    // Default to 20 brands per run so the route completes cleanly within 30-45s without proxy timeout
    const limit = searchParams.get("limit") ? Math.min(100, Math.max(1, Number(searchParams.get("limit")))) : 20;
    const skipFeedico = searchParams.get("skipFeedico") === "true";

    console.log(`[Cron Sync-Coupons] Triggered for Shard ${shardId} (limit: ${limit}, skipFeedico: ${skipFeedico})`);

    // 3. Step A: Daily Feedico Bulk Sync (Free, fast affiliate refresh)
    let feedicoResult = { totalFeedicoImported: 0 };
    if (!skipFeedico) {
      try {
        feedicoResult = await syncFeedicoBulk({ maxPerCountry: 25 });
      } catch (fErr) {
        console.warn("[Cron Sync-Coupons] Feedico bulk notice:", fErr.message);
      }
    }

    // 4. Step B: Rolling Shard Sync (Bright Data + Groq + Deterministic Safety Net)
    const shardResult = await syncShard(shardId, { maxBrands: limit });

    // 5. Read current state of Persistent Storage
    const currentStore = loadPersistentStore();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      action: "SHARD_SYNC_COMPLETED",
      shardProcessed: shardId,
      feedicoImported: feedicoResult.totalFeedicoImported || 0,
      totalBrandsInShard: shardResult.totalBrands || 0,
      signalsProcessed: shardResult.signalsProcessed || 0,
      unlockedCoupons: shardResult.unlockedCount || 0,
      totalBrandsInPersistentStore: currentStore.metadata?.totalBrandsSynced || currentStore.metadata?.totalStores || 0,
      totalCouponsInPersistentStore: currentStore.metadata?.totalCouponsStored || 0,
      lastSyncedAt: currentStore.metadata?.lastSyncedAt || null
    });
  } catch (err) {
    console.error("[Cron Sync-Coupons Error]:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/**
 * POST endpoint for targeted / manual shard triggering
 */
export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (process.env.NODE_ENV === "production" && cronSecret) {
      if (!safeCompareTokens(authHeader, `Bearer ${cronSecret}`)) {
        return NextResponse.json({ success: false, error: "UNAUTHORIZED_CRON" }, { status: 401 });
      }
    }

    const body = await request.json().catch(() => ({}));
    const shardId = body.shard ? Math.min(6, Math.max(1, Number(body.shard))) : getTodayShardId();
    const limit = body.limit ? Math.min(100, Math.max(1, Number(body.limit))) : 20;

    console.log(`[Cron Sync-Coupons POST] Running targeted sync for Shard ${shardId} (limit: ${limit})`);
    const shardResult = await syncShard(shardId, { maxBrands: limit });
    const currentStore = loadPersistentStore();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      shardProcessed: shardId,
      totalBrandsInShard: shardResult.totalBrands || 0,
      signalsProcessed: shardResult.signalsProcessed || 0,
      unlockedCoupons: shardResult.unlockedCount || 0,
      totalCouponsInPersistentStore: currentStore.metadata?.totalCouponsStored || 0
    });
  } catch (err) {
    console.error("[Cron Sync-Coupons POST Error]:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
