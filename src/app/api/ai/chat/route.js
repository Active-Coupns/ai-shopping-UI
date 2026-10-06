import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

/**
 * In-Chat Shopping Agent Endpoint
 * Handles live Q&A, multi-product comparison, and autonomous intent shift detection.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const userMessage = body.userMessage || body.message || "";
    const products = body.products || [];
    const searchQuery = body.searchQuery || "";
    const conversationHistory = body.conversationHistory || [];

    if (!userMessage || typeof userMessage !== "string") {
      return NextResponse.json({ error: "userMessage is required" }, { status: 400 });
    }

    const productsSummary = (products || []).slice(0, 4).map((p, idx) => ({
      index: idx,
      title: p.title || "Product",
      price: p.price || "N/A",
      store: p.store_name || p.store || "Online Store",
      specs: (p.specs || []).slice(0, 4),
      rating: p.rating || "4.4"
    }));

    const prompt = `You are ShopSmart AI, an honest, empathetic, and expert personal shopping assistant for an Indian e-commerce platform.

CONTEXT:
- User's Current Search Query: "${searchQuery}"
- Products Currently Displayed on User's Screen:
${JSON.stringify(productsSummary, null, 2)}

- Recent Conversation History:
${(conversationHistory || []).slice(-4).map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`).join("\n")}

- User's Latest Message:
"${userMessage}"

YOUR MISSION:
1. ANSWER THE USER'S QUESTION DIRECTLY & HONESTLY:
   - Speak conversationally in friendly, helpful English/Hinglish (matching the user's natural language).
   - If they ask to compare or ask which is best: compare the actual specs, prices, and value. Name the clear winner and explain why.
   - Mention specific stores and prices where relevant.

2. DETECT INTENT SHIFT (CRITICAL AGENTIC BEHAVIOR):
   - Check if the user's requirement actually differs from or exceeds the currently displayed products.
   - Example 1: User looking at budget ₹50k office laptops asks "Can I do heavy 4K Premiere editing and Blender 3D?". -> Current laptops lack dedicated GPU! Detect shift! Recommend dedicated RTX gaming laptop around ₹55k-₹60k.
   - Example 2: User looking at laptops says "Actually I just want to watch Netflix in bed and take handwritten notes." -> Recommend iPad or tablet.
   - Example 3: User looking at running shoes asks for party/formal wear. -> Recommend formal shoes.
   - Example 4: User budget is too low or they want a completely different brand/category.
   - If user's intent shifted or current products are a poor fit for their stated goal, set "intentShiftDetected": true.
   - Formulate an optimized "suggestedQuery" (always include budget/key spec if applicable) and an action-oriented "buttonText".

3. STRICT JSON RESPONSE SCHEMA:
Respond ONLY with a valid JSON object matching this schema:
{
  "reply": "Your clear, empathetic, and objective response (2-4 concise paragraphs with bullet points if helpful).",
  "recommendedProductIndex": 0, // index of best product among displayed (0, 1, or 2), or null if none fit user's need
  "intentShiftDetected": false, // true ONLY if user's actual need requires a different search query
  "pivotSuggestion": {
    "reason": "Brief explanation of why a new search is recommended.",
    "suggestedQuery": "optimized search query (e.g. 'gaming laptop rtx under 60000')",
    "buttonText": "Short CTA (e.g. 'Search RTX Gaming Laptops →')"
  }, // or null if intentShiftDetected is false
  "quickFollowUps": [
    "Short question 1",
    "Short question 2",
    "Short question 3"
  ]
}`;

    const models = ["gemini-flash-latest", "gemini-2.5-flash-lite", "gemini-pro-latest"];
    let aiResponse = null;

    if (GEMINI_API_KEY) {
      for (const model of models) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.2,
                responseMimeType: "application/json",
                maxOutputTokens: 1200
              }
            }),
            signal: AbortSignal.timeout(25000)
          });

          if (!res.ok) continue;

          const data = await res.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
            aiResponse = JSON.parse(cleaned);
            break;
          }
        } catch (err) {
          console.warn(`[AI Chat] Model ${model} error:`, err.message);
        }
      }
    }

    // High-Fidelity Heuristic Fallback if Gemini unavailable
    if (!aiResponse) {
      const msgLower = userMessage.toLowerCase();
      const hasTabletIntent = /\b(tablet|ipad|stylus|drawing|late\s+kar|movies\s+dekhna|handwritten|pen)\b/i.test(msgLower);
      const hasGamingOrEditing = /\b(game|gaming|editing|blender|gpu|render|4k|rtx)\b/i.test(msgLower) && !searchQuery.toLowerCase().includes("gaming");
      const hasBudgetLower = /\b(cheaper|sasta|kam\s+budget|under\s*30000|under\s*25000)\b/i.test(msgLower);

      if (hasTabletIntent) {
        aiResponse = {
          reply: `Aapki requirement ke hisaab se (bed par late kar movies dekhna aur stylus se drawing karna), ek laptop bhari aur awkward lagega. In kaamo ke liye ek dedicated Tablet ya iPad with Stylus support best option rahega, jisme touch screen, halka weight aur behtareen battery backup milta hai!`,
          recommendedProductIndex: null,
          intentShiftDetected: true,
          pivotSuggestion: {
            reason: "Bedside media streaming and drawing are significantly better on a lightweight tablet with stylus support.",
            suggestedQuery: "tablet with stylus under 30000",
            buttonText: "Explore Best Tablets with Stylus →"
          },
          quickFollowUps: [
            "What is the best tablet for drawing under 30k?",
            "Should I buy iPad 10th Gen or Samsung Galaxy Tab?",
            "Can I attach an external keyboard later?"
          ]
        };
      } else if (hasGamingOrEditing) {
        aiResponse = {
          reply: `Heavy video editing, 3D rendering ya gaming ke liye standard everyday laptops me dedicated graphics card na hone se lag hoga. Aapko ek dedicated RTX gaming laptop ki zaroorat padegi.`,
          recommendedProductIndex: null,
          intentShiftDetected: true,
          pivotSuggestion: {
            reason: "Dedicated GPU needed for heavy creative workflows and gaming.",
            suggestedQuery: "gaming laptop rtx under 60000",
            buttonText: "Search RTX Gaming Laptops →"
          },
          quickFollowUps: [
            "What is the battery life of gaming laptops?",
            "Can I upgrade RAM later?",
            "Show laptops under 55000"
          ]
        };
      } else if (hasBudgetLower) {
        aiResponse = {
          reply: `Agar aapka budget kam hai, to hum ₹25,000 - ₹30,000 ke beech ke best value laptops dekh sakte hain jo daily office aur study ke liye perfect hain.`,
          recommendedProductIndex: null,
          intentShiftDetected: true,
          pivotSuggestion: {
            reason: "Optimizing recommendations for a lower price budget.",
            suggestedQuery: "best laptop under 30000",
            buttonText: "Search Laptops Under ₹30,000 →"
          },
          quickFollowUps: [
            "Are laptops under 30k good for MS Office?",
            "Which brand is most reliable under 30k?"
          ]
        };
      } else {
        const topProd = products[0] || {};
        aiResponse = {
          reply: products.length > 0
            ? `Based on your query, **${topProd.title || "the top option"}** offers the strongest overall balance of performance, warranty, and pricing at ${topProd.store_name || "verified stores"}. It comes equipped with ${((topProd.specs || []).slice(0, 2).join(", ")) || "solid hardware"}.`
            : "I can help you evaluate these options or find alternative deals based on your daily workflow. Tell me more about what you need!",
          recommendedProductIndex: 0,
          intentShiftDetected: false,
          pivotSuggestion: null,
          quickFollowUps: [
            "Which has the best battery life?",
            "Compare specs side-by-side",
            "Is the highest priced model worth it?"
          ]
        };
      }
    }

    return NextResponse.json(aiResponse, { status: 200 });

  } catch (error) {
    console.error("[AI Chat API Error]:", error);
    return NextResponse.json({
      reply: "I am ready to help you evaluate these products. Ask me anything about their performance, battery, or alternatives!",
      recommendedProductIndex: null,
      intentShiftDetected: false,
      pivotSuggestion: null,
      quickFollowUps: ["Which has the best battery?", "Compare value for money"]
    }, { status: 200 });
  }
}
