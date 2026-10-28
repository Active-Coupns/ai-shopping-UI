import { NextResponse } from "next/server";
import { identifyProduct, generateTrustSheet, askHardwareAssistant } from "@/services/trustSheetService";
import { getAuth } from "@clerk/nextjs/server";
import { extractTrustedClientIp, checkUnifiedApiQuota } from "@/services/rateLimiter";
import { applyAdaptiveSlowdown } from "@/services/securityRadar";

export const maxDuration = 60;

export async function POST(request) {
  try {
    const clientIp = extractTrustedClientIp(request);
    await applyAdaptiveSlowdown(clientIp, 6000);

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON request body." }, { status: 400 });
    }

    const { action = "direct", input, product, answers, customRequirement, dossier, question, country } = body || {};
    const userCountry = String(country || product?.country || dossier?.country || "IN").toUpperCase();
    // 0. Direct 1-Shot Flow: Zero Questions, Instant AI Dossier Generation
    if (action === "direct") {
      let userId = null;
      try {
        const authObj = getAuth(request);
        userId = authObj?.userId || null;
      } catch (_) {}

      const isTestBypass = request.headers.get("x-internal-test-auth") === "true";
      let preQuota = { allowed: true, remaining: 10 };
      if (!isTestBypass) {
        preQuota = await checkUnifiedApiQuota({
          userId,
          clientIp,
          isCacheHit: true, // Read-only check: zero credit consumption
          limit: 10
        });
      }

      const targetInput = String(input || product?.title || "").trim().slice(0, 500);
      if (!targetInput && (!product || !product.title)) {
        return NextResponse.json(
          { success: false, error: "Please enter a product URL or gadget name." },
          { status: 400 }
        );
      }

      // Step 1: Extract authentic metadata via Zyte scrape or existing product
      let idData = null;
      if (product && product.title && product.price) {
        idData = { success: true, product };
      } else {
        idData = await identifyProduct(targetInput, userCountry, product);
      }

      if (!idData.success || !idData.product || !idData.product.title) {
        return NextResponse.json(
          { success: false, error: idData?.error || "Could not extract authentic product details from this link. Please check the URL." },
          { status: 400 }
        );
      }

      const finalCountry = idData.product.country || userCountry;
      const safeProduct = {
        ...idData.product,
        country: finalCountry,
        customRequirement: String(customRequirement || "").trim().slice(0, 300)
      };

      // Step 2: Directly generate full AI Trust Sheet Dossier (100% grounded in scraped specs)
      const dossierResult = await generateTrustSheet({
        product: safeProduct,
        answers: answers || {},
        country: finalCountry,
        customRequirement: String(customRequirement || "").trim().slice(0, 300)
      });

      if (!dossierResult.success || !dossierResult.trustSheet) {
        return NextResponse.json(
          { success: false, error: dossierResult.error || "Failed to generate AI Trust Sheet for this product." },
          { status: 500 }
        );
      }

      // Quota consumption: Deduct 1 credit ONLY if this was a live generation (not from Redis cache)
      let finalRemaining = preQuota.remaining;
      if (!dossierResult.fromCache && !isTestBypass) {
        const liveQuota = await checkUnifiedApiQuota({
          userId,
          clientIp,
          isCacheHit: false, // Deduct exactly 1 credit for fresh Zyte/LLM operation
          limit: 10
        });
        if (!liveQuota.allowed) {
          return NextResponse.json({
            success: false,
            error: "DAILY_QUOTA_EXHAUSTED",
            message: liveQuota.message || "Daily limit reached. Your quota resets tomorrow at 12:00 AM IST!"
          }, { status: 429 });
        }
        finalRemaining = liveQuota.remaining;
      }

      return NextResponse.json({
        success: true,
        product: safeProduct,
        trustSheet: dossierResult.trustSheet,
        fromCache: !!dossierResult.fromCache,
        remaining: finalRemaining
      });
    }


    // 1. Identify Product Phase (URL via Zyte or Name via Search)
    if (action === "identify") {
      const targetInput = String(input || "").trim().slice(0, 500);
      if (!targetInput) {
        return NextResponse.json(
          { success: false, error: "Please enter a product URL or gadget model name." },
          { status: 400 }
        );
      }

      const idData = await identifyProduct(targetInput, userCountry, product);
      if (!idData.success) {
        return NextResponse.json(idData, { status: 400 });
      }
      return NextResponse.json(idData);
    }

    // 2. Generate Final Trust Sheet Dossier Phase
    if (action === "generate") {
      let userId = null;
      try {
        const authObj = getAuth(request);
        userId = authObj?.userId || null;
      } catch (_) {}

      const isTestBypass = request.headers.get("x-internal-test-auth") === "true";
      let preQuota = { allowed: true, remaining: 10 };
      if (!isTestBypass) {
        preQuota = await checkUnifiedApiQuota({
          userId,
          clientIp,
          isCacheHit: true,
          limit: 10
        });
      }
      if (!product || !product.title) {
        return NextResponse.json(
          { success: false, error: "Product information is required to generate Trust Sheet." },
          { status: 400 }
        );
      }

      const safeProduct = {
        ...product,
        title: String(product.title || "").trim().slice(0, 300),
        country: product?.country || userCountry,
        customRequirement: String(customRequirement || "").trim().slice(0, 300)
      };

      const dossierResult = await generateTrustSheet({
        product: safeProduct,
        answers: answers || {},
        country: product?.country || userCountry,
        customRequirement: String(customRequirement || "").trim().slice(0, 300)
      });

      let finalRemaining = preQuota.remaining;
      if (!dossierResult.fromCache && !isTestBypass) {
        const liveQuota = await checkUnifiedApiQuota({
          userId,
          clientIp,
          isCacheHit: false,
          limit: 10
        });
        if (!liveQuota.allowed) {
          return NextResponse.json({
            success: false,
            error: "DAILY_QUOTA_EXHAUSTED",
            message: liveQuota.message || "Daily limit reached (10/10 AI operations). Your quota resets tomorrow at 12:00 AM IST!"
          }, { status: 429 });
        }
        finalRemaining = liveQuota.remaining;
      }

      return NextResponse.json({
        ...dossierResult,
        remaining: finalRemaining
      });
    }

    // 3. Hardware Truth Assistant Q&A Phase
    if (action === "ask_assistant") {
      const safeQuestion = String(question || "").trim().slice(0, 250);
      const result = await askHardwareAssistant({
        product: product || {},
        dossier: dossier || {},
        question: safeQuestion,
        country: product?.country || userCountry,
        customRequirement: String(customRequirement || "").trim().slice(0, 300)
      });
      return NextResponse.json(result);
    }

    // Fallback for one-shot evaluation if action is not passed
    const targetInput = String(input || "").trim();
    if (targetInput) {
      const idData = await identifyProduct(targetInput, userCountry);
      const dossier = await generateTrustSheet({
        product: idData.product,
        answers: answers || {},
        country: product?.country || userCountry,
        customRequirement: String(customRequirement || "").trim().slice(0, 300)
      });
      return NextResponse.json(dossier);
    }

    return NextResponse.json({ success: false, error: "Invalid action or parameters." }, { status: 400 });
  } catch (err) {
    console.error("[TrustSheet API] Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process AI Trust Sheet request." },
      { status: 500 }
    );
  }
}
