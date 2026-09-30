import { NextResponse } from 'next/server';
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

export async function POST(request) {
  let releaseSlot = null;
  const startTime = Date.now();

  try {
    // 1. Origin & CSRF Guard
    if (!verifyRequestOrigin(request)) {
      safeLog('VTON Render', 'Blocked unauthorized origin request');
      return NextResponse.json({ success: false, error: "Access denied: Unauthorized cross-origin request." }, { status: 403 });
    }

    const { userImageBase64, garmentImageUrl, garmentCategory, garmentTitle } = await request.json();

    if (!userImageBase64 || !garmentImageUrl) {
      return NextResponse.json({ success: false, error: "Both user snapshot and garment image are required." }, { status: 400 });
    }

    // 2. Identify client / user for atomic concurrency gating
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anon_client';
    const userId = request.headers.get('x-clerk-user-id') || clientIp;

    // 3. Acquire Atomic GPU Slot & Concurrency Lock (OWASP API4)
    try {
      releaseSlot = await globalResourceManager.acquire(userId);
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

    // 4. Validate & Sanitize User Image (Magic Bytes + Pre-Decode Pixel Clamp + EXIF Strip)
    let sanitizedPerson;
    try {
      sanitizedPerson = await validateAndSanitizeImage(userImageBase64);
    } catch (valErr) {
      safeLog('VTON Upload Gate', `Rejected invalid user image: ${valErr.message}`);
      return NextResponse.json({ success: false, error: valErr.message }, { status: 400 });
    }

    // 5. Ingest & Validate Garment Image (Hardened SSRF Protection)
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

    // 6. Ephemeral In-Memory Cache Check (Max 15-min retention target, 0 GPU cost for repeat looks)
    const cacheKey = `${sanitizedPerson.base64.slice(0, 40)}_${garmentImageUrl.slice(-40)}`;
    const cachedResult = ephemeralVtonCache.get(cacheKey);
    if (cachedResult) {
      safeLog('VTON Render', 'Served look from ephemeral cache', { garmentTitle });
      return NextResponse.json({
        success: true,
        renderedImageUrl: cachedResult,
        processingTimeMs: Date.now() - startTime,
        engine: "PixelAPI-VTON-Cache",
        garmentTitle: garmentTitle || "Tailored Fit"
      });
    }

    // 7. Dispatch to Isolated VTON Inference Worker
    const PIXELAPI_KEY = process.env.PIXELAPI_KEY || "";
    const mappedCategory = normalizeCategory(garmentCategory);

    if (PIXELAPI_KEY) {
      try {
        safeLog('VTON Render', 'Submitting job to PixelAPI worker', { category: mappedCategory, garmentTitle });

        const submitRes = await fetch("https://api.pixelapi.dev/v1/virtual-tryon", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${PIXELAPI_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            person_image: sanitizedPerson.base64,
            garment_image: sanitizedGarmentB64,
            category: mappedCategory,
            n_samples: 1,
            n_steps: 22
          })
        });

        if (submitRes.ok) {
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
                  safeLog('VTON Render', 'Worker reported failure', { err: pollData.error_message });
                  return NextResponse.json({
                    success: false,
                    error: pollData.error_message || pollData.friendly_message || "Try-on generation failed. Please try with a clearer photo.",
                    processingTimeMs: Date.now() - startTime
                  });
                }
              }
            }

            if (finalOutputUrl) {
              ephemeralVtonCache.set(cacheKey, finalOutputUrl);
              safeLog('VTON Render', 'Job completed successfully', { processingTimeMs: Date.now() - startTime });
              return NextResponse.json({
                success: true,
                renderedImageUrl: finalOutputUrl,
                processingTimeMs: Date.now() - startTime,
                engine: "PixelAPI-Neural-VTON",
                garmentTitle: garmentTitle || "Tailored Fit"
              });
            } else {
              return NextResponse.json({
                success: false,
                error: "High-resolution AI render is taking a little longer than usual. Please retry in a moment.",
                processingTimeMs: Date.now() - startTime
              });
            }
          }
        } else {
          const errData = await submitRes.json().catch(() => ({}));
          const errMsg = errData?.detail?.message || errData?.detail?.error || "PixelAPI request error";
          safeLog('VTON Render', 'Worker rejected request', { status: submitRes.status, errMsg });

          if (submitRes.status === 402 || (typeof errMsg === 'string' && errMsg.includes('trial_cap_reached'))) {
            return NextResponse.json({
              success: false,
              isQuotaExceeded: true,
              error: "PixelAPI Free Trial REST limit reached (100 credits). Please add a ₹200 top-up at pixelapi.dev to continue unlimited try-ons.",
              processingTimeMs: Date.now() - startTime
            });
          }

          return NextResponse.json({
            success: false,
            error: errMsg,
            processingTimeMs: Date.now() - startTime
          });
        }
      } catch (workerErr) {
        safeLog('VTON Render', 'Worker network error', { err: workerErr.message });
        return NextResponse.json({
          success: false,
          error: workerErr.message,
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
    safeLog('VTON Render API Error', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  } finally {
    // Crucial: Always release concurrency lock in finally block
    if (releaseSlot) {
      releaseSlot();
    }
  }
}
