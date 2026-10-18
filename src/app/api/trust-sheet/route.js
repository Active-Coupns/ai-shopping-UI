import { NextResponse } from "next/server";
import { identifyProduct, generateTrustSheet, askHardwareAssistant } from "@/services/trustSheetService";
import { extractTrustedClientIp } from "@/services/rateLimiter";
import { applyAdaptiveSlowdown } from "@/services/securityRadar";

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

    const { action = "identify", input, product, answers, dossier, question, country } = body || {};
    const userCountry = String(country || product?.country || dossier?.country || "IN").toUpperCase();

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
      if (!product || !product.title) {
        return NextResponse.json(
          { success: false, error: "Product information is required to generate Trust Sheet." },
          { status: 400 }
        );
      }

      const safeProduct = {
        ...product,
        title: String(product.title || "").trim().slice(0, 300),
        country: userCountry
      };

      const dossierResult = await generateTrustSheet({
        product: safeProduct,
        answers: answers || {},
        country: userCountry
      });

      return NextResponse.json(dossierResult);
    }

    // 3. Hardware Truth Assistant Q&A Phase
    if (action === "ask_assistant") {
      const safeQuestion = String(question || "").trim().slice(0, 250);
      const result = await askHardwareAssistant({
        product: product || {},
        dossier: dossier || {},
        question: safeQuestion,
        country: userCountry
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
        country: userCountry
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
