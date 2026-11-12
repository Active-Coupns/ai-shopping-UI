import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { checkRateLimit, checkSharedIpQuota } from "@/services/rateLimiter";

import { isFeatureEnabled } from "@/services/featureFlags";
import { recordCrashException } from "@/services/crashVault";
import { sanitizeAiPrompt } from "@/services/securityShield";

/**
 * In-Chat Shopping Agent Endpoint
 * Handles live Q&A, multi-product comparison, and autonomous intent shift detection.
 */
export async function POST(request) {
  // 0. Master Feature Kill-Switch Check
  const isEnabled = await isFeatureEnabled("aiConciergeChat");
  if (!isEnabled) {
    return NextResponse.json({
      success: false,
      error: "FEATURE_DISABLED",
      message: "AI In-Chat Shopping Assistant is temporarily paused by the administrator."
    }, { status: 503 });
  }

  // 1. Server-Side Cryptographic Clerk Session Verification (Zero Trust in Client Headers)
  let userId = null;
  try {
    const authObj = getAuth(request);
    userId = authObj?.userId || null;
  } catch (authErr) {
    console.warn("[AI Chat] Authentication resolution error:", authErr.message);
    userId = null;
  }

  if (!userId) {
    return NextResponse.json(
      {
        success: false,
        error: "UNAUTHORIZED",
        message: "Sign-in required to use AI Shopping Assistant chat."
      },
      { status: 401 }
    );
  }

  // 2. Distributed Rate Limiting & Quota Protection (Fail-Closed)
  try {
    // Short anti-spam window: 20 requests per 60 seconds (prevents automated bot flooding while keeping user chat unlimited)
    const minuteLimit = await checkRateLimit({
      namespace: "ai_chat_minute",
      identifier: userId,
      limit: 20,
      windowSeconds: 60
    });

    if (minuteLimit.isBackendError) {
      return NextResponse.json(
        {
          success: false,
          error: "RATE_LIMITER_UNAVAILABLE",
          message: "AI Shopping Assistant is temporarily busy. Please retry shortly.",
          retryAfter: minuteLimit.retryAfter || 60
        },
        {
          status: 503,
          headers: { "Retry-After": String(minuteLimit.retryAfter || 60) }
        }
      );
    }

    if (!minuteLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "RATE_LIMIT_EXCEEDED",
          message: `Too many chat messages sent quickly. Please wait ${minuteLimit.retryAfter}s before sending another message.`,
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
    console.warn("[AI Chat] Limiter unexpected exception:", limiterErr.message);
    return NextResponse.json(
      {
        success: false,
        error: "RATE_LIMITER_UNAVAILABLE",
        message: "AI Shopping Assistant is temporarily busy. Please retry shortly.",
        retryAfter: 60
      },
      {
        status: 503,
        headers: { "Retry-After": "60" }
      }
    );
  }

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "INVALID_JSON", message: "Invalid JSON request body." }, { status: 400 });
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ success: false, error: "INVALID_PAYLOAD", message: "Request body must be a JSON object." }, { status: 400 });
    }

    const rawUserMessage = body.userMessage || body.message || "";
    if (!rawUserMessage || typeof rawUserMessage !== "string" || !rawUserMessage.trim()) {
      return NextResponse.json({ error: "userMessage is required" }, { status: 400 });
    }

    // Zero-Latency Prompt Injection & Jailbreak Defense
    const { isJailbreak, cleanText: userMessage, isolatedPromptBlock } = sanitizeAiPrompt(rawUserMessage, 500);
    if (isJailbreak) {
      return NextResponse.json({
        reply: "Benefisto shopping guidelines prohibit system prompt overrides or non-shopping commands. I am here to help you discover and compare products, prices, and specifications!",
        recommendedDisplayedIndex: null,
        suggestedPoolProduct: null,
        intentShiftDetected: false,
        intentShiftReconfirmation: null,
        screenAction: null,
        quickFollowUps: [
          "What are the best deals right now?",
          "Compare top rated models"
        ]
      });
    }

    const displayedProducts = body.displayedProducts || (body.products || []).slice(0, 3);
    const allPoolProducts = body.allPoolProducts || body.products || [];
    const searchQuery = (body.searchQuery || "").slice(0, 150);
    const conversationHistory = (body.conversationHistory || []).slice(-10);
    const sessionLedger = body.sessionLedger || null;

    const displayedSummary = displayedProducts.slice(0, 3).map((p, idx) => ({
      displayedIndex: idx,
      title: p.title || "Product",
      price: p.price || "N/A",
      store: p.store_name || p.store || "Online Store",
      specs: (p.specs || []).slice(0, 5),
      attributes: p.product_attributes || p.attributes || {},
      description: (p.product_description || p.description || "").slice(0, 200),
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
      specs: (p.specs || []).slice(0, 5),
      attributes: p.product_attributes || p.attributes || {},
      description: (p.product_description || p.description || "").slice(0, 200),
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

    const prompt = `You are Benefisto Co-Pilot, an honest, empathetic, and deeply knowledgeable personal shopping advisor for Indian consumers.

CONTEXT:
- User's Search: "${searchQuery}"
- SCREEN PRODUCTS (Visible 3 cards):
${JSON.stringify(displayedSummary, null, 2)}

- OTHER VERIFIED MARKET OFFERS FROM THIS SEARCH (Up to 15 additional options):
${JSON.stringify(otherPoolSummary, null, 2)}
${ledgerContext}

- Recent Conversation History:
${(conversationHistory || []).slice(-4).map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`).join("\n")}

- User's Latest Message:
${isolatedPromptBlock}

CRITICAL COMMUNICATION & TONE RULES (WHATSAPP-STYLE CONSULTANT):
1. LENGTH: Exactly 4 to 6 natural lines maximum per response. NEVER write long, formal corporate essays or robotic multi-paragraph bullet lists.
2. TONE: Warm, direct, authentic, and empathetic—like a trusted friend or personal shopper advising over WhatsApp.
3. LANGUAGE: Match the user's language. If they write in Hinglish or Hindi, reply in natural conversational Hinglish (standard daily spoken Hindi with tech/shopping terms in English like RAM, Battery, Oily skin, Acne, Deal). If in English, reply in clean, friendly English.
4. FORBIDDEN JARGON: NEVER use technical database/architecture terms such as "inventory pool", "pool product", "other pool products", "cache", "fallback", "displayed index", or "database".
   - If suggesting an option from the other verified offers, introduce it naturally: e.g. "Maine market ke 15+ verified offers scan kiye aur aapki is requirement ke liye ek perfect match mila: [Product Title]..." or "I scanned all 15+ verified market offers and found a tailored match for your specific need: [Product Title]..."
5. CONSULTATIVE DIAGNOSIS (QUESTION-FIRST):
   - If the user's inquiry is broad or ambiguous (e.g. "which laptop should I buy?", "which face wash is best?"), DO NOT dump a blind recommendation. First ask 1-2 sharp, friendly diagnostic questions:
     * Tech: "Daily office/coding use hai ya heavy gaming/editing? And kya battery life ya lightweight portability zaroori hai?"
     * Skincare: "Aapki skin type kaisi hai—oily, dry, sensitive ya acne-prone? Aur kya fragrance se koi allergy hai?"
     * Supplements: "Beginner level fitness hai ya heavy bodybuilding, aur kya dairy/lactose se bloating hoti hai?"
   - If the user's inquiry is specific, give a direct, confident answer grounded in deep product realities.

UNIVERSAL CATEGORY INTUITION DIRECTIVE:
1. LAPTOPS & TECH HARDWARE:
   - Always evaluate TGP wattage (a 45W RTX 4050 performs much slower than a 95W TGP one).
   - Evaluate thermal cooling and throttling risks.
   - Clarify RAM upgradability (soldered onboard RAM vs expandable SODIMM slot).
   - Highlight display color gamut (45% NTSC washed-out vs 100% sRGB / 300+ nits) and battery capacity (Whr).
2. SKINCARE & PERSONAL CARE (Face Wash, Serums, Moisturizers, Sunscreens):
   - Categorize by skin type (oily/acne-prone, dry, sensitive, combination).
   - Deep-dive into active chemical ingredients: Salicylic Acid (1-2% for unclogging sebum & blackheads), Niacinamide (for oil control & dark spots), Hyaluronic Acid (hydration), Glycolic/AHA (exfoliation).
   - Flag comedogenic ratings (pore-clogging ingredients), harsh sulfates (SLS/SLES), and artificial fragrances for sensitive skin.
3. HEALTH SUPPLEMENTS (Whey Protein, Creatine, Multivitamins):
   - Differentiate Whey Isolate (for lactose intolerance & quick absorption) vs Whey Concentrate (budget-friendly).
   - Check third-party lab certifications (Trustified, Labdoor, Informed Choice) for heavy metal safety and true protein content.
   - Mention protein per scoop and cost-per-gram efficiency.
4. BABY CARE & NUTRITION:
   - Absolute safety first: 100% hypoallergenic, zero parabens, zero phthalates, pediatrician approved, fragrance-free.
5. MEDICINES (Prescription/Generic):
   - Provide objective therapeutic explanation of salt/composition.
   - ZERO medical dosages or prescriptions.
   - MANDATORY: Always conclude with "Kripya koi bhi dawa lene se pehle apne doctor se salah zaroor lein."
6. DIGITAL SUBSCRIPTIONS / OTT:
   - Offer the 4-level savings blueprint (SIM recharge bundles, gift card discounts, multi-app combo passes like Times Prime).

DECISION FLOW & MATCHING:
- If one of the 3 DISPLAYED cards fits the user best: set "recommendedDisplayedIndex" to 0, 1, or 2, and "suggestedPoolProduct": null.
- If the 3 DISPLAYED cards do not fit, but one of the OTHER VERIFIED OFFERS does: set "recommendedDisplayedIndex": null, and set "suggestedPoolProduct" to:
  {
    "title": "Exact Title",
    "price": "Price",
    "store": "Store",
    "specs": ["spec 1", "spec 2"],
    "whyRecommended": "1 clear sentence explaining why this specifically fits their requirement"
  }
- If the user's request cannot be fulfilled by either list (e.g. asking for completely different category or out-of-budget hardware):
  Set "intentShiftDetected": true, and provide "intentShiftReconfirmation":
  {
    "understoodRequirement": "1 short sentence of what they specifically need",
    "suggestedQuery": "clean search query",
    "confirmationQuestion": "Natural question asking if they want to search for it now"
  }
- Direct screen filter chips: If user asks to filter ("16gb ram", "gaming", "budget", "all"), set "screenAction": { "type": "SET_FILTER", "chipId": "<chipId>" }.

OUTPUT JSON FORMAT (STRICT JSON ONLY):
{
  "reply": "Conversational, empathetic WhatsApp-style advice (4-6 lines maximum).",
  "recommendedDisplayedIndex": 0, // 0, 1, 2 or null
  "suggestedPoolProduct": null, // or object with title, price, store, specs, whyRecommended
  "intentShiftDetected": false,
  "intentShiftReconfirmation": null,
  "screenAction": null,
  "quickFollowUps": [
    "Short question 1",
    "Short question 2",
    "Short question 3"
  ]
}`;

    let aiResponse = null;
    const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

    // 1. Ultra-Fast Groq Engine (Sub-Second Response)
    if (GROQ_API_KEY) {
      const groqModels = ["qwen/qwen3.8-27b", "openai/gpt-oss-120b", "openai/gpt-oss-20b"];
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

    // 2. High-Availability OpenRouter Engine (Fallback)
    if (!aiResponse && OPENROUTER_API_KEY) {
      const orModels = ["liquid/lfm-2.5-2.6b:free", "cohere/north-mini-code:free"];
      for (const orModel of orModels) {
        try {
          const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
              "HTTP-Referer": "https://benefisto.com",
              "X-Title": "Benefisto Co-Pilot"
            },
            body: JSON.stringify({
              model: orModel,
              messages: [{ role: "user", content: prompt }],
              temperature: 0.2,
              max_tokens: 800
            }),
            signal: AbortSignal.timeout(15000)
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
            console.log(`[AI Chat] Successfully generated dynamic response with OpenRouter ${orModel}`);
            break;
          }
        } catch (err) {
          console.warn(`[AI Chat] OpenRouter ${orModel} error:`, err.message);
        }
      }
    }

    // 3. Intelligent Heuristic Fallback (Grounded & WhatsApp Style)
    if (!aiResponse) {
      const msgLower = userMessage.toLowerCase();
      const hasTabletIntent = /\b(tablet|ipad|stylus|drawing|late\s+kar|movies\s+dekhna|handwritten|pen)\b/i.test(msgLower);
      const hasGamingOrEditing = /\b(game|gaming|editing|blender|gpu|render|4k|rtx)\b/i.test(msgLower) && !searchQuery.toLowerCase().includes("gaming");
      const hasBudgetLower = /\b(cheaper|sasta|kam\s+budget|under\s*30000|under\s*25000)\b/i.test(msgLower);

      if (hasTabletIntent) {
        aiResponse = {
          reply: `Aapki requirement ke hisaab se bed par casual use aur stylus drawing ke liye standard laptop thoda heavy aur inconvenient rahega. In kaamo ke liye ek dedicated Tablet ya iPad with stylus support behtareen rahega, jisme touch display aur lambi battery milti hai!`,
          recommendedDisplayedIndex: null,
          intentShiftDetected: true,
          intentShiftReconfirmation: {
            understoodRequirement: "Bedside media streaming and drawing are significantly better on a lightweight tablet with stylus support.",
            suggestedQuery: "tablet with stylus under 30000",
            confirmationQuestion: "Kya aap chahte hain ki main stylus wale best tablets search karun?"
          },
          quickFollowUps: [
            "Best tablet for drawing under 30k?",
            "iPad 10th Gen vs Samsung Galaxy Tab?",
            "Can I attach external keyboard?"
          ]
        };
      } else if (hasGamingOrEditing) {
        aiResponse = {
          reply: `Heavy 3D rendering, video editing ya AAA gaming ke liye everyday laptops bina dedicated GPU ke struggle karenge. Aapko ek high-TGP RTX gaming laptop dekhna chahiye jisme proper dual-fan thermal cooling ho.`,
          recommendedDisplayedIndex: null,
          intentShiftDetected: true,
          intentShiftReconfirmation: {
            understoodRequirement: "Dedicated high TGP graphics card and dual-fan cooling needed for heavy workflows and gaming.",
            suggestedQuery: "gaming laptop rtx under 60000",
            confirmationQuestion: "Kya main RTX dedicated graphics wale gaming laptops search karun?"
          },
          quickFollowUps: [
            "What is the battery life of gaming laptops?",
            "Can I upgrade RAM later?",
            "Show laptops under 55000"
          ]
        };
      } else if (hasBudgetLower) {
        aiResponse = {
          reply: `Agar aapka budget thoda tight hai, toh hum ₹25,000 - ₹30,000 range ke value picks dekh sakte hain jo daily typing, browsing aur study ke liye smooth chalte hain.`,
          recommendedDisplayedIndex: null,
          intentShiftDetected: true,
          intentShiftReconfirmation: {
            understoodRequirement: "Optimizing recommendations for a lower price budget.",
            suggestedQuery: "best laptop under 30000",
            confirmationQuestion: "Kya main ₹30,000 ke under ke best value laptops search karun?"
          },
          quickFollowUps: [
            "Are laptops under 30k good for MS Office?",
            "Which brand is most reliable under 30k?"
          ]
        };
      } else {
        const topProd = (displayedProducts && displayedProducts[0]) || (allPoolProducts && allPoolProducts[0]) || {};
        aiResponse = {
          reply: topProd.title
            ? `Maine screen aur market ke verified offers ko check kiya. **${topProd.title}** overall kaafi balanced option hai ${topProd.store_name || topProd.store || "verified store"} par. Kya aap daily office/study use ke liye dekh rahe hain ya heavy gaming/editing ke liye?`
            : "Main market ke sabhi verified offers ko aapki requirement ke hisaab se compare karne ke liye taiyar hoon. Aapka primary use-case kya hai?",
          recommendedDisplayedIndex: 0,
          intentShiftDetected: false,
          intentShiftReconfirmation: null,
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
