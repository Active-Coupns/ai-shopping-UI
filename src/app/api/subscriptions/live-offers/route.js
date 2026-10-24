import { NextResponse } from "next/server";
import { INDIA_SUBSCRIPTIONS_CATALOG } from "@/data/subscriptionsCatalog";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const brandName = (body.brandName || "Netflix").trim();
    const country = (body.country || "IN").toUpperCase();

    // 1. Locate baseline catalog entry for fallback
    const catalogItem = INDIA_SUBSCRIPTIONS_CATALOG.find(
      (b) => b.name.toLowerCase().includes(brandName.toLowerCase()) || 
             b.id.toLowerCase() === brandName.toLowerCase()
    ) || INDIA_SUBSCRIPTIONS_CATALOG[0];

    // 2. Query Gemini with Google Search Grounding if API key is present
    if (GEMINI_API_KEY) {
      const models = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];
      
      const prompt = `You are a real-time digital subscription price & offer intelligence engine for India (${country}).
Search the live web for "${brandName}" subscription plans, pricing, telecom free bundle offers (Jio, Airtel, Vi), voucher deals, and promo codes in India for today in 2026.

Return ONLY a valid JSON object matching this exact structure:
{
  "brandName": "${brandName}",
  "country": "${country}",
  "lastVerified": "Today, April 2026",
  "sourceType": "Google Search Grounded (Live)",
  "plans": [
    {
      "name": "Plan Name (e.g. Mobile, Basic, Standard, Premium, Annual)",
      "price": 149,
      "period": "month | 3 months | year",
      "screens": 1,
      "resolution": "4K UHD | Full HD | HD",
      "devices": "Mobile only | All devices",
      "audio": "Dolby Atmos | Dolby 5.1 | Stereo",
      "ads": "100% Ad-Free | Ad-Supported"
    }
  ],
  "savingsBlueprint": {
    "telecomFree": [
      { "operator": "Jio / Airtel / Vi", "plan": "Plan details", "claimSteps": "How to claim" }
    ],
    "voucherSavings": {
      "provider": "Amazon Pay / Gyftr",
      "discountPercent": "10% Off",
      "instructions": "Voucher purchase details"
    },
    "comboPass": {
      "passName": "Times Prime / Tata Play Binge",
      "bundledWith": ["Service 1", "Service 2"]
    },
    "coupons": [
      { "code": "COUPON_CODE", "discount": "Discount details", "verified": true }
    ]
  },
  "liveInsights": "Brief 1-2 sentence summary of current best value route."
}`;

      for (const model of models) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              tools: [{ googleSearch: {} }],
              generationConfig: {
                temperature: 0.1,
                topP: 0.95
              }
            }),
            signal: AbortSignal.timeout(10000)
          });

          if (res.ok) {
            const data = await res.json();
            const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            const groundingMetadata = data.candidates?.[0]?.groundingMetadata;

            if (rawText) {
              let cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
              const firstBrace = cleaned.indexOf("{");
              const lastBrace = cleaned.lastIndexOf("}");
              if (firstBrace !== -1 && lastBrace !== -1) {
                cleaned = cleaned.substring(firstBrace, lastBrace + 1);
              }

              const parsed = JSON.parse(cleaned);
              const sources = groundingMetadata?.groundingChunks?.map(c => c.web?.uri || c.web?.title).filter(Boolean) || [];

              return NextResponse.json({
                success: true,
                liveGrounded: true,
                data: {
                  ...parsed,
                  groundingSources: sources.slice(0, 4),
                  modelUsed: model
                }
              });
            }
          } else {
            const errBody = await res.text();
            console.warn(`[Live Subscriptions] Gemini ${model} failed HTTP ${res.status}:`, errBody.slice(0, 200));
          }
        } catch (fetchErr) {
          console.warn(`[Live Subscriptions] Gemini ${model} error:`, fetchErr.message);
        }
      }
    }

    // 3. High-Fidelity Catalog Fallback
    return NextResponse.json({
      success: true,
      liveGrounded: false,
      data: {
        brandName: catalogItem.name,
        country: "IN",
        lastVerified: "April 2026 (Verified Master Catalog)",
        sourceType: "Official Curated Catalog",
        plans: catalogItem.plans,
        savingsBlueprint: catalogItem.savingsBlueprint,
        liveInsights: `${catalogItem.name} offers multiple tiers ranging from ₹${catalogItem.plans[0]?.price} to ₹${catalogItem.plans[catalogItem.plans.length - 1]?.price}. Best value via Level 1 & Level 2 blueprints.`
      }
    });
  } catch (err) {
    console.error("[Live Subscriptions API] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
