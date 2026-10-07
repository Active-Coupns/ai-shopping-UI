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
    const displayedProducts = body.displayedProducts || (body.products || []).slice(0, 3);
    const allPoolProducts = body.allPoolProducts || body.products || [];
    const searchQuery = body.searchQuery || "";
    const conversationHistory = body.conversationHistory || [];
    const sessionLedger = body.sessionLedger || null;

    if (!userMessage || typeof userMessage !== "string") {
      return NextResponse.json({ error: "userMessage is required" }, { status: 400 });
    }

    const displayedSummary = displayedProducts.slice(0, 3).map((p, idx) => ({
      displayedIndex: idx,
      title: p.title || "Product",
      price: p.price || "N/A",
      store: p.store_name || p.store || "Online Store",
      specs: (p.specs || []).slice(0, 4),
      rating: p.rating || "4.4"
    }));

    const displayedTitles = new Set(displayedProducts.map(p => (p.title || "").toLowerCase()));
    const otherPoolProducts = allPoolProducts
      .filter(p => !displayedTitles.has((p.title || "").toLowerCase()))
      .slice(0, 15);

    const otherPoolSummary = otherPoolProducts.map((p, idx) => ({
      poolIndex: idx,
      title: p.title || "Product",
      price: p.price || "N/A",
      store: p.store_name || p.store || "Online Store",
      specs: (p.specs || []).slice(0, 4),
      rating: p.rating || "4.4"
    }));

    const viewedReviews = sessionLedger?.viewedReviews || [];
    const lastViewedProduct = sessionLedger?.lastViewedProduct || null;

    const ledgerContext = (viewedReviews.length > 0 || lastViewedProduct)
      ? `\n- USER ACTIVITY & PREVIOUSLY INSPECTED REVIEWS IN THIS SESSION:\n` +
        (lastViewedProduct ? `* Most Recently Inspected Product Card: "${lastViewedProduct.title}" (${lastViewedProduct.price})\n` : "") +
        viewedReviews.map(r => `* Inspected Review for "${r.title}":
  - Verdict: "${r.fitVerdict || 'Reviewed'}"
  - Best For: "${r.bestFor || 'General use'}"
  - Limitation/Step Up: "${r.skipIf || 'N/A'}"
  - Pros: ${(r.pros || []).join("; ")}
  - Cons: ${(r.cons || []).join("; ")}`).join("\n") +
        `\nCRITICAL CONVERSATIONAL COHERENCE MANDATE:\n` +
        `- Maintain 100% harmony with what the user was shown above in their product insights.\n` +
        `- DO NOT contradict or jumble advice. If the user asks about a product they already inspected, reference it smoothly (e.g., 'As we noticed in the insights for [Product]...').\n` +
        `- We are an UNBIASED BUYER ADVOCATE, not an e-commerce seller. Never say 'don't buy this', but honestly reinforce the genuine pros and trade-offs so the user makes a confident decision.\n`
      : "";

    const prompt = `You are ShopSmart AI, an honest, empathetic, and expert personal shopping assistant for an Indian e-commerce platform.

CONTEXT:
- User's Current Search Query: "${searchQuery}"

- PRODUCTS ON USER'S SCREEN (Currently Visible 3 Cards):
${JSON.stringify(displayedSummary, null, 2)}

- OTHER INVENTORY PRODUCTS FROM THIS SEARCH (Hidden in Store Pool, up to 15 more):
${JSON.stringify(otherPoolSummary, null, 2)}
${ledgerContext}

- Recent Conversation History:
${(conversationHistory || []).slice(-4).map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`).join("\n")}

- User's Latest Message:
"${userMessage}"

YOUR MISSION & DECISION FLOW:
1. ANSWER THE USER'S QUESTION DIRECTLY & OBJECTIVELY (Friendly, helpful tone).

2. DETERMINE THE BEST PRODUCT SOURCE:
   A) IF one of the 3 DISPLAYED products satisfies the user's requirement best:
      - Name it clearly, explain why, and set "recommendedDisplayedIndex" to that card's index (0, 1, or 2).
      - Set "suggestedPoolProduct" to null.
   B) IF the 3 DISPLAYED products do NOT satisfy the user's specific need (e.g. user asks for 16GB RAM, higher storage, gaming GPU, or a particular brand/price), BUT one of the OTHER INVENTORY PRODUCTS does:
      - Highlight this discovery in your reply! Say something like: "None of the 3 laptops currently on your screen have 16GB RAM, but in our search inventory we found the [Product Title] with 16GB RAM for [Price] at [Store]."
      - Set "recommendedDisplayedIndex" to null.
      - Return "suggestedPoolProduct" with exact details from the inventory pool:
        {
          "title": "Exact Title",
          "price": "Price",
          "store": "Store",
          "specs": ["spec 1", "spec 2"],
          "whyRecommended": "1 clear sentence explaining why this fits better than the 3 on screen"
        }
   C) IF the user's requirement CANNOT be fulfilled by ANY product in either list (e.g. user searching 50k budget laptops now asks for an Apple MacBook, or RTX 4080 GPU, or iPad/tablet, or completely different category):
      - DO NOT force any mismatch product!
      - Explain politely why the current search does not have it.
      - Trigger INTENT SHIFT RE-CONFIRMATION:
        Ask the user if they would like a new search for their specific requirement.
      - Set "intentShiftDetected": true.
      - Return "intentShiftReconfirmation":
        {
          "understoodRequirement": "1 concise sentence summarizing what the user specifically needs (in English or natural Hinglish).",
          "suggestedQuery": "clean search query (e.g. 'Apple MacBook Air M1')",
          "confirmationQuestion": "Natural question asking if user wants to search (in English or natural Hinglish, e.g. 'Would you like me to search for ... deals now?' or 'Kya aap chahte hain ki main ... search karun?')"
        }

LANGUAGE & TONE POLICY:
- We strictly use natural English or modern conversational Hinglish (standard daily spoken Hindi with tech terms like RAM, Battery, Display, Budget, Coding in English).
- DO NOT use archaic, bookish, or formal Sanskritized Hindi words. Keep it friendly, empathetic, and authentic.
- If user talks in English, respond in English. If user talks in Hindi/Hinglish, respond in natural conversational Hinglish.

3. STRICT JSON RESPONSE SCHEMA:
Respond ONLY with a valid JSON object matching this schema:
{
  "reply": "Your clear, empathetic, and objective response (2-3 paragraphs with key highlights).",
  "recommendedDisplayedIndex": 0, // 0, 1, 2 or null
  "suggestedPoolProduct": null, // or { "title": "...", "price": "...", "store": "...", "specs": [...], "whyRecommended": "..." }
  "intentShiftDetected": false, // true ONLY if user's need requires a completely new search query
  "intentShiftReconfirmation": null, // or { "understoodRequirement": "...", "suggestedQuery": "...", "confirmationQuestion": "..." }
  "quickFollowUps": [
    "Short question 1",
    "Short question 2",
    "Short question 3"
  ]
}`;

    let aiResponse = null;
    const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

    // 1. Prioritize Ultra-Fast Groq Engine (Sub-Second Response)
    if (GROQ_API_KEY) {
      const groqModels = ["qwen/qwen3.8-27b", "openai/gpt-oss-120b"];
      for (const gModel of groqModels) {
        try {
          const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
              model: gModel,
              messages: [{ role: "user", content: prompt }],
              temperature: 0.2,
              response_format: { type: "json_object" }
            }),
            signal: AbortSignal.timeout(10000)
          });

          if (!res.ok) {
            const errBody = await res.text().catch(() => "");
            console.warn(`[AI Chat] Groq ${gModel} status ${res.status}:`, errBody);
            continue;
          }

          const data = await res.json();
          const rawText = data.choices?.[0]?.message?.content;
          if (rawText) {
            let cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
            const firstBrace = cleaned.indexOf("{");
            const lastBrace = cleaned.lastIndexOf("}");
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
              cleaned = cleaned.substring(firstBrace, lastBrace + 1);
            }
            aiResponse = JSON.parse(cleaned);
            console.log(`[AI Chat] Successfully generated dynamic response with Groq ${gModel}`);
            break;
          }
        } catch (err) {
          console.warn(`[AI Chat] Groq ${gModel} error:`, err.message);
        }
      }
    }

    // 2. Fallback to OpenRouter AI (Verified Working & Free)
    if (!aiResponse && OPENROUTER_API_KEY) {
      const orModels = ["cohere/north-mini-code:free", "liquid/lfm-2.5-2.6b:free", "dots-studio/dots-3-note-preview:free"];
      for (const orModel of orModels) {
        try {
          const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
              "HTTP-Referer": "http://localhost:3000",
              "X-Title": "ShopSmart AI"
            },
            body: JSON.stringify({
              model: orModel,
              messages: [{ role: "user", content: prompt }],
              temperature: 0.2,
              max_tokens: 1000
            }),
            signal: AbortSignal.timeout(25000)
          });

          if (!res.ok) {
            const errBody = await res.text().catch(() => "");
            console.warn(`[AI Chat] OpenRouter ${orModel} status ${res.status}:`, errBody);
            continue;
          }

          const data = await res.json();
          const rawText = data.choices?.[0]?.message?.content;
          if (rawText) {
            let cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
            const firstBrace = cleaned.indexOf("{");
            const lastBrace = cleaned.lastIndexOf("}");
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
              cleaned = cleaned.substring(firstBrace, lastBrace + 1);
            }
            aiResponse = JSON.parse(cleaned);
            console.log(`[AI Chat] Successfully generated dynamic response with ${orModel}`);
            break;
          }
        } catch (err) {
          console.warn(`[AI Chat] OpenRouter ${orModel} error:`, err.message);
        }
      }
    }

    // 2. Fallback to Gemini AI if OpenRouter was unavailable
    if (!aiResponse && GEMINI_API_KEY) {
      const models = ["gemini-flash-latest", "gemini-2.5-flash-lite", "gemini-pro-latest"];
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
            signal: AbortSignal.timeout(15000)
          });

          if (!res.ok) continue;

          const data = await res.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            let cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
            const firstBrace = cleaned.indexOf("{");
            const lastBrace = cleaned.lastIndexOf("}");
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
              cleaned = cleaned.substring(firstBrace, lastBrace + 1);
            }
            aiResponse = JSON.parse(cleaned);
            console.log(`[AI Chat] Successfully generated dynamic response with Gemini ${model}`);
            break;
          }
        } catch (err) {
          console.warn(`[AI Chat] Gemini ${model} error:`, err.message);
        }
      }
    }

    // High-Fidelity Heuristic Fallback if AI unavailable
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

    return NextResponse.json({
      reply: aiResponse.reply || "I analyzed your requirements against the deals.",
      recommendedDisplayedIndex: aiResponse.recommendedDisplayedIndex !== undefined ? aiResponse.recommendedDisplayedIndex : (aiResponse.recommendedProductIndex ?? null),
      suggestedPoolProduct: aiResponse.suggestedPoolProduct || null,
      intentShiftDetected: !!aiResponse.intentShiftDetected,
      intentShiftReconfirmation: aiResponse.intentShiftReconfirmation || (aiResponse.pivotSuggestion ? {
        understoodRequirement: aiResponse.pivotSuggestion.reason,
        suggestedQuery: aiResponse.pivotSuggestion.suggestedQuery,
        confirmationQuestion: `Would you like me to search for ${aiResponse.pivotSuggestion.suggestedQuery} now?`
      } : null),
      quickFollowUps: aiResponse.quickFollowUps || []
    }, { status: 200 });

  } catch (error) {
    console.error("[AI Chat API Error]:", error);
    return NextResponse.json({
      reply: "I am ready to help you evaluate these products. Ask me anything about their performance, battery, or alternatives!",
      recommendedDisplayedIndex: null,
      suggestedPoolProduct: null,
      intentShiftDetected: false,
      intentShiftReconfirmation: null,
      quickFollowUps: ["Which has the best battery?", "Compare value for money"]
    }, { status: 200 });
  }
}
