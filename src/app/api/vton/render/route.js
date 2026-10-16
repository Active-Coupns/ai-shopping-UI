import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { redis } from '@/services/redis';

// Allow up to 300 seconds (5 minutes) for deep diffusion GPU inference
export const maxDuration = 300;
import { getAuth } from '@clerk/nextjs/server';
import {
  checkRateLimit,
  reserveVtonFreeQuota,
  commitVtonFreeQuota,
  releaseVtonFreeQuota,
  acquireDistributedVtonSlot,
  releaseDistributedVtonSlot,
  checkVtonDeviceAbuse,
  incrementVtonDeviceUsage,
  checkVtonIpAbuse,
  incrementVtonIpUsage,
  extractTrustedClientIp
} from '@/services/rateLimiter';
import {
  validateAndSanitizeImage,
  safeFetchImage,
  globalResourceManager,
  ephemeralVtonCache,
  verifyRequestOrigin,
  safeLog
} from '@/lib/vtonSecurity';

// Helper to normalize catalog category to PixelAPI's allowed categories:
// ['upperbody', 'lowerbody', 'dress', 'saree', 'lehenga', 'kurti', 'sherwani']
function normalizeCategory(cat) {
  if (!cat) return "upperbody";
  const c = cat.toLowerCase();
  
  if (c.includes("saree")) return "saree";
  if (c.includes("lehenga")) return "lehenga";
  if (c.includes("kurti")) return "kurti";
  if (c.includes("kurta") || c.includes("sherwani") || c.includes("ethnic")) return "kurti";
  if (c.includes("dress") || c.includes("frock") || c.includes("gown") || c.includes("coord") || c.includes("co-ord")) return "dress";
  if (c.includes("pant") || c.includes("jean") || c.includes("trouser") || c.includes("bottom") || c.includes("palazzo") || c.includes("short") || c.includes("skirt") || c.includes("cargo") || c.includes("chino") || c.includes("jogger") || c.includes("denim")) return "lowerbody";
  
  return "upperbody";
}

/**
 * Smart VTON Error Classifier: Separates user photo/pose guidance from genuine server load
 */
function categorizeVtonError(rawError, httpStatus = 500) {
  let errString = "";
  if (typeof rawError === "string") {
    errString = rawError;
  } else if (rawError && typeof rawError === "object") {
    if (typeof rawError.friendly_message === "string") {
      errString = rawError.friendly_message;
    } else if (typeof rawError.detail === "string") {
      errString = rawError.detail;
    } else if (Array.isArray(rawError.detail) && rawError.detail[0]?.msg) {
      errString = rawError.detail[0].msg;
    } else if (typeof rawError.message === "string") {
      errString = rawError.message;
    } else if (typeof rawError.error === "string") {
      errString = rawError.error;
    }
  }

  const lower = errString.toLowerCase();

  // 1. Photo / Pose / Face / Alignment Guidance (Directly helps user take a better photo)
  if (
    lower.includes("person") ||
    lower.includes("pose") ||
    lower.includes("body") ||
    lower.includes("human") ||
    lower.includes("face") ||
    lower.includes("shoulder") ||
    lower.includes("angle") ||
    lower.includes("blur") ||
    lower.includes("dark") ||
    lower.includes("resolution") ||
    lower.includes("crop") ||
    lower.includes("not detected") ||
    lower.includes("unsupported photo")
  ) {
    return {
      errorType: "PHOTO_QUALITY",
      message: errString || "AI requires a clear, front-facing photo with shoulders and posture visible for authentic draping.",
      guidance: "Please upload a straight front-facing portrait with good lighting and clear shoulders."
    };
  }

  // 2. Garment / Outfit Image Issues
  if (
    lower.includes("garment") ||
    lower.includes("cloth") ||
    lower.includes("outfit") ||
    lower.includes("template") ||
    lower.includes("solid-color") ||
    lower.includes("placeholder")
  ) {
    return {
      errorType: "GARMENT_ISSUE",
      message: errString || "This garment photo could not be mapped for draping. Please choose another look or upload a flat, unfolded garment shot.",
      guidance: "Single unfolded garment photos with plain backgrounds work best."
    };
  }

  // 3. Genuine Server Busy / Cluster Capacity (503, 504, 502, overloaded, timeout)
  if (
    httpStatus === 503 ||
    httpStatus === 504 ||
    httpStatus === 502 ||
    lower.includes("capacity") ||
    lower.includes("busy") ||
    lower.includes("overloaded") ||
    lower.includes("timeout") ||
    lower.includes("wait")
  ) {
    return {
      errorType: "SERVER_TRAFFIC",
      message: "AI styling servers are momentarily handling peak traffic. Your try-on credit was preserved (NOT deducted).",
      guidance: "Please tap 'Try Again' in a moment to resume."
    };
  }

  // Default: Pass through friendly message if present, else fallback
  if (errString && errString.length > 5) {
    return {
      errorType: "GENERAL",
      message: errString,
      guidance: "Please tap 'Try Again' or select another outfit."
    };
  }

  return {
    errorType: "SERVER_TRAFFIC",
    message: "AI styling servers are momentarily handling peak traffic. Your try-on credit was preserved (NOT deducted).",
    guidance: "Please tap 'Try Again' in a moment to resume."
  };
}

import { isFeatureEnabled } from "@/services/featureFlags";
import { recordCrashException } from "@/services/crashVault";

export async function POST(request) {
  let releaseSlot = null;
  let attemptId = null;
  let quotaReserved = false;
  let quotaCommitted = false;
  let authenticatedUserId = null;
  const startTime = Date.now();

  try {
    // 0. Master Feature Kill-Switch Check (Admin Controlled)
    const isVtonEnabled = await isFeatureEnabled("vtonTrialRoom");
    if (!isVtonEnabled) {
      return NextResponse.json({
        success: false,
        error: "FEATURE_DISABLED",
        friendly_message: "Virtual Trial Room is temporarily paused by the administrator for maintenance. No try-on credits were deducted.",
        errorType: "FEATURE_DISABLED"
      }, { status: 503 });
    }

    // 1. Origin & CSRF Guard
    if (!verifyRequestOrigin(request)) {
      safeLog('VTON Render', 'Blocked unauthorized origin request');
      return NextResponse.json({ success: false, error: "Access denied: Unauthorized cross-origin request." }, { status: 403 });
    }

    // 1b. Bot & Automated Headless Scraping Defense (Stealth Tarpit & Friendly Peak Traffic Response)
    const isBotHeader = request.headers.get("x-bot-detected") === "true";
    if (isBotHeader) {
      safeLog('VTON Security', 'Stealth tarpitting potential automated request');
      await new Promise(resolve => setTimeout(resolve, 2500));
      return NextResponse.json(
        {
          success: false,
          error: "AI styling servers are momentarily handling peak traffic. Your try-on credit was preserved (NOT deducted).",
          errorType: "SERVER_TRAFFIC",
          guidance: "Please tap 'Try Again' in a moment to resume."
        },
        { status: 503 }
      );
    }

    // 2. Server-Side Cryptographic Clerk Session Verification (Zero Trust in Client Headers)
    let userId = null;
    try {
      const authObj = getAuth(request);
      userId = authObj?.userId || null;
    } catch (authErr) {
      safeLog('VTON Auth Gate', `Authentication resolution error: ${authErr.message}`);
      userId = null;
    }

    if (!userId) {
      safeLog('VTON Auth Gate', 'Rejected unauthenticated try-on request');
      return NextResponse.json(
        { success: false, error: "UNAUTHORIZED", message: "Sign-in required to use Virtual Try-On." },
        { status: 401 }
      );
    }
    authenticatedUserId = userId;

    // 3. Distributed Rate Limiting (Fail-Closed)
    // Evaluated before expensive body/image payload parsing, resource lock, or GPU work.
    try {
      const minuteLimit = await checkRateLimit({
        namespace: "vton_render_minute",
        identifier: userId,
        limit: 2,
        windowSeconds: 60
      });

      if (minuteLimit.isBackendError) {
        safeLog('VTON Limiter', 'Limiter backend failure (503 fail-closed)', { userId });
        return NextResponse.json(
          {
            success: false,
            error: "RATE_LIMITER_UNAVAILABLE",
            message: "Virtual Try-On service is temporarily busy. Please retry shortly.",
            retryAfter: minuteLimit.retryAfter || 60
          },
          {
            status: 503,
            headers: { "Retry-After": String(minuteLimit.retryAfter || 60) }
          }
        );
      }

      if (!minuteLimit.allowed) {
        safeLog('VTON Limiter', 'User exceeded minute rate limit', { userId, retryAfter: minuteLimit.retryAfter });
        return NextResponse.json(
          {
            success: false,
            error: "RATE_LIMIT_EXCEEDED",
            message: `Too many try-on requests. Please wait ${minuteLimit.retryAfter}s before trying on another outfit.`,
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
    } catch (limiterErr) {
      safeLog('VTON Limiter', `Limiter unexpected exception: ${limiterErr.message}`);
      return NextResponse.json(
        {
          success: false,
          error: "RATE_LIMITER_UNAVAILABLE",
          message: "Virtual Try-On service is temporarily busy. Please retry shortly.",
          retryAfter: 60
        },
        {
          status: 503,
          headers: { "Retry-After": "60" }
        }
      );
    }

    // 4. Request Payload Parsing
    let body;
    try {
      body = await request.json();
    } catch (parseErr) {
      return NextResponse.json({ success: false, error: "INVALID_JSON", message: "Invalid JSON request body." }, { status: 400 });
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ success: false, error: "INVALID_PAYLOAD", message: "Request body must be a JSON object." }, { status: 400 });
    }

    const { userImageBase64, garmentImageUrl, garmentCategory, garmentTitle: rawGarmentTitle } = body;

    // Sanitize garmentTitle to prevent prompt injection and script tags
    const garmentTitle = typeof rawGarmentTitle === 'string'
      ? rawGarmentTitle.replace(/<[^>]*>?/gm, '').replace(/[\r\n\t]+/g, ' ').trim().slice(0, 120)
      : "Tailored Fit";

    if (!userImageBase64 || typeof userImageBase64 !== "string" || !garmentImageUrl || typeof garmentImageUrl !== "string") {
      return NextResponse.json({ success: false, error: "Both user snapshot and garment image are required." }, { status: 400 });
    }

    // Attempt ID Sanitization & Generation
    const candidateAttemptId = typeof body?.attemptId === "string" ? body.attemptId.trim() : "";
    attemptId = /^[a-zA-Z0-9_\-]{8,128}$/.test(candidateAttemptId)
      ? candidateAttemptId
      : crypto.randomUUID();

    // 5. Hardware / Device Footprint Sybil Abuse Check (Strict 3 free try-ons per physical device across all accounts)
    const rawFingerprint = request.headers.get("x-device-fingerprint") || body?.deviceFingerprint || null;

    // 5a. Hardware / Device Footprint Sybil Abuse Check (Strict 3 free try-ons per physical device across all accounts)
    if (rawFingerprint && typeof rawFingerprint === "string" && rawFingerprint.startsWith("hw_")) {
      const deviceCheck = await checkVtonDeviceAbuse(rawFingerprint, 3);
      if (!deviceCheck.allowed) {
        safeLog('VTON Limiter', 'Blocked multi-account abuse from physical device', { rawFingerprint, userId });
        return NextResponse.json(
          {
            success: false,
            error: "DEVICE_FREE_TRIAL_EXHAUSTED",
            message: "This device has reached the limit of 3 free AI Try-Ons across accounts. To continue trying outfits with high GPU speed, please get a Sachet pack for just ₹10 (5 Try-Ons).",
            upgradeRequired: true,
            freeTier: { limit: 3, used: 3, remaining: 0 }
          },
          { status: 403 }
        );
      }
    }

    // 5b. Anti-Sybil Multi-Account IP Check (Max 3 free try-ons from same network/IP across accounts)
    const clientIp = extractTrustedClientIp(request);
    const ipCheck = await checkVtonIpAbuse(clientIp, 3);
    if (!ipCheck.allowed) {
      safeLog('VTON Limiter', 'Blocked multi-account abuse from IP', { clientIp, userId });
      return NextResponse.json(
        {
          success: false,
          error: "IP_FREE_TRIAL_EXHAUSTED",
          message: "This network has reached the limit of 3 free AI Try-Ons. Heavy GPU computing demand is currently high. Please upgrade to a Sachet pack (₹10 for 5 try-ons) to continue.",
          upgradeRequired: true,
          freeTier: { limit: 3, used: 3, remaining: 0 }
        },
        { status: 403 }
      );
    }

    // 5c. Account Lifetime Free Try-On Quota Reservation (3 free try-ons per account)
    const quotaRes = await reserveVtonFreeQuota({
      identifier: userId,
      attemptId,
      limit: 3,
      windowId: "account_lifetime"
    });

    if (!quotaRes.allowed && !quotaRes.isBackendError) {
      safeLog('VTON Limiter', 'User exceeded lifetime free quota', { userId, quotaRes });
      return NextResponse.json(
        {
          success: false,
          error: "FREE_TIER_LIMIT_EXCEEDED",
          message: "You have used all 3 of your free AI Try-Ons for this account.",
          upgradeRequired: true,
          freeTier: {
            limit: 3,
            used: quotaRes.confirmedCount || 3,
            remaining: 0
          }
        },
        { status: 403 }
      );
    }

    quotaReserved = true;

    // 6. Acquire Atomic Distributed GPU Slot & Concurrency Lock (Cluster-wide Redis + Local Queue)
    try {
      const distributedSlot = await acquireDistributedVtonSlot({
        userId,
        attemptId,
        maxGlobal: 5,
        leaseTtlSeconds: 360
      });

      if (distributedSlot.isBackendError) {
        safeLog('VTON Resource Gate', 'Distributed concurrency lock backend failure (503 fail-closed)', { userId });
        return NextResponse.json(
          {
            success: false,
            error: "RATE_LIMITER_UNAVAILABLE",
            message: "Virtual Try-On service is temporarily busy. Please retry shortly.",
            retryAfter: 15
          },
          {
            status: 503,
            headers: { "Retry-After": "15" }
          }
        );
      }

      if (!distributedSlot.success) {
        if (distributedSlot.reason === 'USER_CONCURRENCY_LIMIT') {
          return NextResponse.json(
            {
              success: false,
              error: "USER_CONCURRENCY_LIMIT",
              message: "You already have an active Try-On in progress. Please wait."
            },
            {
              status: 429,
              headers: { "Retry-After": "10" }
            }
          );
        } else {
          return NextResponse.json(
            {
              success: false,
              error: "QUEUE_EXHAUSTED",
              message: "VTON processing servers are currently at maximum capacity. Please retry shortly."
            },
            {
              status: 503,
              headers: { "Retry-After": "15" }
            }
          );
        }
      }

      // Also acquire local process gate for metrics & in-process tracking
      const localRelease = await globalResourceManager.acquire(userId);
      releaseSlot = async () => {
        try {
          localRelease();
        } catch (_) {}
        await releaseDistributedVtonSlot({ userId, attemptId });
      };
    } catch (resourceErr) {
      safeLog('VTON Resource Gate', resourceErr.message, { userId, statusCode: resourceErr.statusCode || 429 });
      return NextResponse.json(
        { success: false, error: resourceErr.message },
        { 
          status: resourceErr.statusCode || 429,
          headers: resourceErr.retryAfter ? { 'Retry-After': String(resourceErr.retryAfter) } : {}
        }
      );
    }

    // 6. Validate & Sanitize User Image (Magic Bytes + Pre-Decode Pixel Clamp + EXIF Strip)
    let sanitizedPerson;
    try {
      sanitizedPerson = await validateAndSanitizeImage(userImageBase64);
    } catch (valErr) {
      safeLog('VTON Upload Gate', `Rejected invalid user image: ${valErr.message}`);
      return NextResponse.json({ success: false, error: valErr.message }, { status: 400 });
    }

    // 7. Ingest & Validate Garment Image (Hardened SSRF Protection)
    let sanitizedGarmentB64;
    try {
      if (garmentImageUrl.startsWith('data:image/')) {
        const sanitizedGarment = await validateAndSanitizeImage(garmentImageUrl);
        sanitizedGarmentB64 = sanitizedGarment.base64;
      } else if (garmentImageUrl.startsWith('http://') || garmentImageUrl.startsWith('https://')) {
        const fetchedBuffer = await safeFetchImage(garmentImageUrl);
        const sanitizedGarment = await validateAndSanitizeImage(fetchedBuffer);
        sanitizedGarmentB64 = sanitizedGarment.base64;
      } else {
        const sanitizedGarment = await validateAndSanitizeImage(garmentImageUrl);
        sanitizedGarmentB64 = sanitizedGarment.base64;
      }
    } catch (ssrfErr) {
      safeLog('VTON SSRF Guard', `Blocked or failed garment fetch: ${ssrfErr.message}`);
      return NextResponse.json({ success: false, error: ssrfErr.message }, { status: 400 });
    }

    // 8. Ephemeral In-Memory Cache Check (Max 15-min retention target, 0 GPU cost for repeat looks)
    const cacheKey = `${sanitizedPerson.base64.slice(0, 40)}_${garmentImageUrl.slice(-40)}`;
    const cachedResult = ephemeralVtonCache.get(cacheKey);
    if (cachedResult) {
      safeLog('VTON Render', 'Served look from ephemeral cache', { garmentTitle });
      if (quotaReserved) {
        await releaseVtonFreeQuota({ identifier: userId, attemptId });
        quotaReserved = false;
      }
      if (releaseSlot) {
        try {
          await releaseSlot();
          releaseSlot = null;
        } catch (_) {}
      }
      return NextResponse.json({
        success: true,
        renderedImageUrl: cachedResult,
        processingTimeMs: Date.now() - startTime,
        engine: "PixelAPI-VTON-Cache",
        garmentTitle: garmentTitle || "Tailored Fit",
        freeTier: {
          limit: 2,
          used: quotaRes.confirmedCount || 0,
          remaining: Math.max(0, 2 - (quotaRes.confirmedCount || 0)),
          cached: true
        }
      });
    }

    // 9. Dispatch to Isolated VTON Inference Worker
    const PIXELAPI_KEY = process.env.PIXELAPI_KEY || "";
    const MODAL_VTON_ENDPOINT = process.env.MODAL_VTON_ENDPOINT || "";
    const mappedCategory = normalizeCategory(garmentCategory);

    // Primary Engine: Official PixelAPI Neural Virtual Try-On
    if (PIXELAPI_KEY) {
      try {
        safeLog('VTON Render', 'Submitting job to PixelAPI worker', { category: mappedCategory, garmentTitle });

        let submitRes = null;
        const requestPayload = JSON.stringify({
          person_image: sanitizedPerson.base64,
          garment_image: sanitizedGarmentB64,
          category: mappedCategory,
          n_samples: 1,
          n_steps: 22,
          ephemeral: true,
          auto_delete: true
        });

        // Try with 1 automatic retry if safety check has a momentary 503 hiccup
        for (let attempt = 1; attempt <= 2; attempt++) {
          submitRes = await fetch("https://api.pixelapi.dev/v1/virtual-tryon", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${PIXELAPI_KEY}`,
              "Content-Type": "application/json"
            },
            body: requestPayload
          });

          if (submitRes.ok) break;

          if (submitRes.status === 503 && attempt === 1) {
            safeLog('VTON Render', 'PixelAPI temporary 503 detected, performing automatic 2.5s retry...');
            await new Promise(r => setTimeout(r, 2500));
          } else {
            break;
          }
        }

        if (submitRes && submitRes.ok) {
          const submitData = await submitRes.json();
          const jobId = submitData.job_id || submitData.id;

          if (jobId) {
            safeLog('VTON Render', `Job queued with worker: ${jobId}`);
            
            let finalOutputUrl = null;
            // Poll up to 80 times (every 2.5s = 200s max)
            for (let i = 0; i < 80; i++) {
              await new Promise(r => setTimeout(r, 2500));
              
              const pollRes = await fetch(`https://api.pixelapi.dev/v1/virtual-tryon/jobs/${jobId}`, {
                headers: { "Authorization": `Bearer ${PIXELAPI_KEY}` }
              });

              if (pollRes.ok) {
                const pollData = await pollRes.json();
                
                if (pollData.status === "completed" || pollData.status === "succeeded") {
                  finalOutputUrl = pollData.output_url || (pollData.result_image_b64 ? `data:image/png;base64,${pollData.result_image_b64}` : null);
                  break;
                } else if (pollData.status === "failed") {
                  const classified = categorizeVtonError(pollData.error_message || pollData.friendly_message || "Generation failed", 400);
                  safeLog('VTON Render', 'Worker reported failure', { err: classified.message, errorType: classified.errorType });
                  return NextResponse.json({
                    success: false,
                    error: classified.message,
                    errorType: classified.errorType,
                    guidance: classified.guidance,
                    processingTimeMs: Date.now() - startTime
                  });
                }
              }
            }

            if (finalOutputUrl) {
              const commitRes = await commitVtonFreeQuota({
                identifier: userId,
                attemptId,
                limit: 3
              });
              if (commitRes.success) {
                quotaCommitted = true;
              }
              incrementVtonIpUsage(clientIp).catch(() => {});
              if (rawFingerprint && typeof rawFingerprint === "string" && rawFingerprint.startsWith("hw_")) {
                incrementVtonDeviceUsage(rawFingerprint).catch(() => {});
              }
              ephemeralVtonCache.set(cacheKey, finalOutputUrl);
              safeLog('VTON Render', 'Job completed successfully', { processingTimeMs: Date.now() - startTime, quotaCommitted });
              const currentUsage = commitRes.confirmedCount || (quotaRes.confirmedCount + 1);
              return NextResponse.json({
                success: true,
                renderedImageUrl: finalOutputUrl,
                processingTimeMs: Date.now() - startTime,
                engine: "PixelAPI-Neural-VTON",
                garmentTitle: garmentTitle || "Tailored Fit",
                freeTier: {
                  limit: 3,
                  used: currentUsage,
                  remaining: Math.max(0, 3 - currentUsage)
                }
              });
            } else {
              return NextResponse.json({
                success: false,
                error: "High-resolution AI render is taking a little longer than usual due to high GPU demand. Please tap 'Try Again' in a moment.",
                errorType: "SERVER_TRAFFIC",
                guidance: "Please tap 'Try Again' to resume without re-uploading.",
                processingTimeMs: Date.now() - startTime
              });
            }
          }
        } else {
          const errData = await submitRes.json().catch(() => ({}));
          const classified = categorizeVtonError(errData, submitRes.status);
          safeLog('VTON Render', 'Worker rejected request', { status: submitRes.status, classified });

          return NextResponse.json({
            success: false,
            error: classified.message,
            errorType: classified.errorType,
            guidance: classified.guidance,
            processingTimeMs: Date.now() - startTime
          });
        }
      } catch (workerErr) {
        const classified = categorizeVtonError(workerErr?.message, 503);
        safeLog('VTON Render', 'Worker network error', { err: workerErr?.message || 'Unknown network error', classified });
        return NextResponse.json({
          success: false,
          error: classified.message,
          errorType: classified.errorType,
          guidance: classified.guidance,
          processingTimeMs: Date.now() - startTime
        });
      }
    }

    return NextResponse.json({
      success: false,
      error: "Unable to process try-on. Please check the API configuration.",
      processingTimeMs: Date.now() - startTime
    });

  } catch (err) {
    safeLog('VTON Render API Error', err?.message || 'Unexpected exception');
    recordCrashException({
      error: err,
      message: err?.message || "Unexpected VTON render failure",
      component: "vton_render",
      route: "/api/vton/render",
      severity: "critical"
    }).catch(() => {});
    return NextResponse.json({
      success: false,
      error: "An unexpected error occurred while processing the virtual try-on. Please try again."
    }, { status: 500 });
  } finally {
    // If quota was reserved but render failed or aborted before commit, release reservation idempotently
    if (quotaReserved && !quotaCommitted && authenticatedUserId && attemptId) {
      try {
        await releaseVtonFreeQuota({ identifier: authenticatedUserId, attemptId });
      } catch (relErr) {
        safeLog('VTON Limiter', `Failed to release free slot: ${relErr.message}`);
      }
    }
    // Crucial: Always release concurrency lock in finally block
    if (releaseSlot) {
      try {
        await releaseSlot();
      } catch (slotErr) {
        safeLog('VTON Limiter', `Failed to release concurrency slot: ${slotErr.message}`);
      }
    }
  }
}

/**
 * GET: Lightweight endpoint to query live remaining free try-ons for the client
 */
export async function GET(request) {
  try {
    const clientIp = extractTrustedClientIp(request);
    const rawFingerprint = request.headers.get("x-device-fingerprint") || null;
    let userId = null;
    try {
      const authObj = getAuth(request);
      userId = authObj?.userId || null;
    } catch {}

    const ipCheck = await checkVtonIpAbuse(clientIp, 3);
    const ipUsed = ipCheck.count || 0;

    let deviceUsed = 0;
    let isDeviceExhausted = false;
    if (rawFingerprint && rawFingerprint.startsWith("hw_")) {
      const deviceCheck = await checkVtonDeviceAbuse(rawFingerprint, 3);
      deviceUsed = deviceCheck.count || 0;
      isDeviceExhausted = !deviceCheck.allowed;
    }

    let userUsed = 0;
    if (userId) {
      const userQuotaRaw = await redis.get(`vton:free_quota:account_lifetime:${userId}`).catch(() => "0");
      userUsed = parseInt(userQuotaRaw || "0", 10);
    }

    const effectiveUsed = Math.min(3, Math.max(ipUsed, deviceUsed, userUsed));
    const remaining = Math.max(0, 3 - effectiveUsed);

    return NextResponse.json({
      success: true,
      freeTier: {
        limit: 3,
        used: effectiveUsed,
        remaining,
        isIpExhausted: !ipCheck.allowed,
        isDeviceExhausted,
        isUserExhausted: userUsed >= 3
      }
    }, { status: 200 });
  } catch (err) {
    return NextResponse.json({
      success: true,
      freeTier: { limit: 3, used: 0, remaining: 3 }
    }, { status: 200 });
  }
}
