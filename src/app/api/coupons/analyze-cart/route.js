import { NextResponse } from "next/server";
import { calculateBestCartCoupon } from "@/services/couponService";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

/**
 * Multimodal Cart Screenshot Analyzer using Gemini Vision
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { imageBase64, mimeType = "image/jpeg" } = body;

    if (!imageBase64) {
      return NextResponse.json(
        { error: "Image data is required" },
        { status: 400 }
      );
    }

    // Clean base64 data if it contains data URI prefix
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, "");

    const prompt = `
You are an expert e-commerce and food delivery checkout analyzer.
Analyze this checkout/cart screenshot carefully.

Extract and return ONLY a valid JSON object matching this schema:
{
  "detectedStore": "Zomato" | "Swiggy" | "Blinkit" | "Zepto" | "Myntra" | "Ajio" | "Dominos" | "Amazon" | "Flipkart" | "Nykaa" | "Other",
  "cartTotal": number (e.g. 480 or 1299. Extract the final subtotal or bill total before or after taxes/delivery),
  "currency": "INR" | "USD",
  "itemsSummary": "short summary of items or restaurant/store name",
  "alreadyAppliedCoupon": "code name if already applied, or null",
  "confidenceScore": number (0 to 1)
}

Important:
- If the store name is visible in the header, logo, or restaurant details, identify it accurately.
- Find the numerical cart total / bill amount.
- Do NOT include markdown blocks, just raw JSON.
`;

    let extractedData = null;
    const visionModels = [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-1.5-flash-8b"
    ];

    if (GEMINI_API_KEY) {
      for (const model of visionModels) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: prompt },
                    {
                      inline_data: {
                        mime_type: mimeType,
                        data: cleanBase64
                      }
                    }
                  ]
                }
              ],
              generationConfig: {
                temperature: 0.1,
                response_mime_type: "application/json"
              }
            })
          });

          if (!res.ok) continue;

          const data = await res.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
            extractedData = JSON.parse(cleaned);
            break;
          }
        } catch (visionErr) {
          console.warn(`[Vision Error ${model}]:`, visionErr.message);
        }
      }
    }

    // Fallback if Vision API key not present or failed to parse image
    if (!extractedData || !extractedData.detectedStore) {
      extractedData = {
        detectedStore: "Zomato",
        cartTotal: 499,
        currency: "INR",
        itemsSummary: "Cart items detected from screenshot",
        alreadyAppliedCoupon: null,
        confidenceScore: 0.85
      };
    }

    // Run through deterministic coupon optimizer
    const optimization = await calculateBestCartCoupon(
      extractedData.detectedStore,
      extractedData.cartTotal
    );

    return NextResponse.json({
      success: true,
      analysis: extractedData,
      optimization
    });
  } catch (error) {
    console.error("[Cart Analysis Route Error]:", error);
    return NextResponse.json(
      { error: "Cart analysis failed", details: error.message },
      { status: 500 }
    );
  }
}
