import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { checkRateLimit, checkSharedIpQuota } from "@/services/rateLimiter";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

/**
 * Pre-Search AI Shopping Concierge API
 * Guides the user before search, answers buyer questions, clarifies requirements,
 * and formulates a high-yield, clean search query with explicit user confirmation.
 */
export async function POST(request) {
  // 1. Server-Side Cryptographic Clerk Session Verification (Zero Trust in Client Headers)
  let userId = null;
  try {
    const authObj = getAuth(request);
    userId = authObj?.userId || null;
  } catch {
    console.warn("[Concierge API] Authentication resolution error.");
    userId = null;
  }

  if (!userId) {
    return NextResponse.json(
      {
        success: false,
        error: "UNAUTHORIZED",
        message: "Sign-in required to use AI Shopping Concierge."
      },
      { status: 401 }
    );
  }

  // 2. Anti-spam protection (20 requests per minute)
  try {
    const minuteLimit = await checkRateLimit({
      namespace: "ai_concierge_minute",
      identifier: userId,
      limit: 20,
      windowSeconds: 60
    });

    if (minuteLimit.isBackendError) {
      return NextResponse.json(
        {
          success: false,
          error: "RATE_LIMITER_UNAVAILABLE",
          message: "AI Shopping Concierge is temporarily busy. Please retry shortly.",
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
          message: `Too many questions sent quickly. Please wait ${minuteLimit.retryAfter}s.`,
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
  } catch {
    console.error("[Concierge API] Limiter exception occurred.");
    return NextResponse.json(
      {
        success: false,
        error: "RATE_LIMITER_UNAVAILABLE",
        message: "AI Shopping Concierge is temporarily busy. Please retry shortly.",
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

    const {
      userMessage: rawUserMessage = "",
      conversationHistory = [],
      initialTopic: rawInitialTopic = "",
      country = "IN",
      browsingContext = {}
    } = body || {};

    const userMessage = typeof rawUserMessage === "string" ? rawUserMessage.trim().slice(0, 500) : "";
    const initialTopic = typeof rawInitialTopic === "string" ? rawInitialTopic.trim().slice(0, 150) : "";

    if (!userMessage && !initialTopic) {
      return NextResponse.json({ error: "userMessage or initialTopic is required" }, { status: 400 });
    }

    const isUS = String(country).toUpperCase() === "US";
    const currencySymbol = isUS ? "$" : "₹";

    const browsingLines = [];
    if (Array.isArray(browsingContext.recentSearches) && browsingContext.recentSearches.length > 0) {
      browsingLines.push(`Recent searches in this session: ${browsingContext.recentSearches.map(s => s.query || s).join(", ")}`);
    }
    if (Array.isArray(browsingContext.recentProducts) && browsingContext.recentProducts.length > 0) {
      browsingLines.push(`Products user clicked/reviewed earlier: ${browsingContext.recentProducts.map(p => p.title || p).join(", ")}`);
    }
    const browsingNote = browsingLines.length > 0 ? `\nSESSION BROWSING SIGNALS (Use gently for relevant context, never creep out the user):\n${browsingLines.join("\n")}\n` : "";

    const prompt = `You are ShopSmart AI Shopping Guide, an expert, honest, and friendly personal shopping consultant for an ${isUS ? "US" : "Indian"} e-commerce search platform.

YOUR MISSION & PHILOSOPHY:
1. ADVISOR FIRST, SEARCH SECOND: You are a friendly, knowledgeable consultant. Never rush the buyer to search. If they are confused (e.g. "PC vs Laptop", "battery vs GPU", "which brand is best"), explain clearly in simple, natural terms in 2-3 sentences.
2. ANSWER THEIR QUESTIONS: If they ask why something is better or what they should pick, give clear, objective shopping guidance.
3. STRICT 2-4 WORD SMART QUERY RULE:
   - Formulate a clean, ultra-focused search query strictly 2 to 4 words (e.g. "White sneakers men", "Running shoes under 2500", "Front load washing machine", "Cotton linen shirt").
   - NEVER create a long sentence or bloated query!
   - BRAND NEUTRALITY RULE (IMPORTANT): 
     Do NOT inject or assume specific brand names into "suggestedQuery" (e.g. do NOT force "Campus", "Sparx", "Samsung", "HP") UNLESS the user explicitly mentioned or asked for that specific brand. 
     Keep the search query open to all market deals by focusing on: [Use-case/Feature] + [Category] + [Budget/Gender] (e.g. "White casual sneakers", "Running shoes under 2500").
4. CATEGORY-SPECIFIC BEHAVIOR RULES (E-COMMERCE vs MEDICINE vs SUPPLEMENTS):
   A) MEDICINES (Prescription & Generic Drugs, e.g. Dolo, Paracetamol, Telma, Pantocid):
      - EDUCATIONAL & SALT-INFO ONLY: If asked what a medicine is used for, briefly explain its primary pharmacological indication/active salt based on medical facts (e.g., 'Dolo 650 mein Paracetamol hota hai jo bukhar aur sharir dard kam karne ke liye use hota hai').
      - ZERO MEDICAL PRESCRIPTION / DOSAGE: Never prescribe dosages, never say 'take this 2 times a day', never diagnose illnesses.
      - ALWAYS INCLUDE A DOCTOR DISCLAIMER: Remind them politely: 'Kripya koi bhi dawa lene se pehle apne doctor se salah zaroor lein.'
      - QUERY GENERATION: Formulate clean salt/brand query strictly 2-3 words (e.g. 'Dolo 650mg tablets', 'Telma 40mg strip').
   B) HEALTH SUPPLEMENTS (Whey Protein, Creatine, Multivitamins, Fish Oil):
      - SAFE NUTRITIONAL GUIDANCE: You MAY guide the user based on objective facts (e.g., Whey Isolate vs Concentrate for lactose sensitivity, unflavored creatine monohydrate benefits, protein per scoop).
      - SAFE RECOMMENDATIONS: Ask clarifying questions (e.g. beginner vs regular trainer, budget, digestion/lactose issues) before suggesting a category or spec.
      - BRAND NEUTRALITY: Do not force a single brand unless asked; highlight clean ingredients, FSSAI/Labdoor testing, and price per serving.
      - QUERY GENERATION: Formulate 2-4 words query (e.g. 'Whey protein isolate unflavored', 'Creatine monohydrate 250g').
   C) GENERAL E-COMMERCE & TECH (Fashion, Electronics, Home):
      - Standard buyer advocate behavior (features, budget, value for money, brand-neutral search query).

5. SUGGESTED CHIPS:
   - Provide 3-4 short, clickable interactive chips.
   - Mix clarifying spec questions (e.g. "Under ₹2,000", "Canvas vs Leather", "Memory Foam Sole") and if ready to explore deals, offer "🚀 Search: [query]".
5. SHARED USER CONTEXT (Preserved for downstream AI memory without polluting the search query):
   - "userPersona": 2-4 words (e.g. "College Daily Wearer", "Casual Jogger")
   - "userRequirement": 1 concise sentence summarizing primary use-case
   - "budgetLimit": integer number if known, or null

ROLE & PURPOSE BOUNDARY:
- Your role is strictly ShopSmart AI Pre-Search Shopping Guide.
- You exist solely to help buyers discover products, clarify features/specs, compare options, and suggest search queries.
- You do NOT generate essays, stories, blog articles, computer programs, or creative content.
- If the user asks for non-shopping tasks (e.g. general essay writing, coding, bedtime stories), politely respond in 1-2 friendly sentences that your expertise is personal shopping guidance, and ask what product or category they would like to explore.
- Keep responses short, warm, and structured (2-3 sentences max).

LANGUAGE & TONE:
- Speak in natural, friendly, warm Hinglish (conversational Hindi-English blend) if user writes in Hindi/Hinglish, or simple English if user writes in English.
- Keep responses short, warm, and structured (2-3 sentences max).

CONTEXT:
Initial Search Topic: "${initialTopic}"
Country: ${country} (${currencySymbol})
${browsingNote}Recent Conversation:
${(conversationHistory || []).slice(-6).map(m => `${m.role === 'user' ? 'Buyer' : 'Guide'}: ${m.text || m.content}`).join("\n")}
Latest Buyer Message: "${userMessage || initialTopic}"

Respond ONLY with a valid JSON object matching this schema:
{
  "reply": "Warm 2-3 sentence conversational advice or clarifying question.",
  "suggestedChips": ["Short Chip 1", "Short Chip 2", "Short Chip 3"],
  "isReadyToSearch": true or false,
  "suggestedQuery": "Strictly 2-4 words query (e.g. 'RTX 3050 laptop')",
  "confirmationQuestion": "Polite question asking if they want to check deals or explore more.",
  "userPersona": "Concise persona label",
  "userRequirement": "Concise primary requirement sentence",
  "budgetLimit": 50000 or null
}`;

    let conciergeResult = null;

    // 1. Try Groq (Sub-Second Response)
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
              temperature: 0.25,
              response_format: { type: "json_object" }
            }),
            signal: AbortSignal.timeout(8000)
          });
          if (res.ok) {
            const data = await res.json();
            const rawText = data.choices?.[0]?.message?.content;
            if (rawText) {
              let cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
              const firstBrace = cleaned.indexOf("{");
              const lastBrace = cleaned.lastIndexOf("}");
              if (firstBrace !== -1 && lastBrace !== -1) {
                cleaned = cleaned.substring(firstBrace, lastBrace + 1);
              }
              conciergeResult = JSON.parse(cleaned);
              console.log(`[AI Concierge] Generated with Groq ${gModel}`);
              break;
            }
          }
        } catch (err) {
          console.warn(`[AI Concierge] Groq ${gModel} error:`, err.message);
        }
      }
    }

    // 2. Try OpenRouter AI
    if (!conciergeResult && OPENROUTER_API_KEY) {
      const orModels = ["liquid/lfm-2.5-2.6b:free", "cohere/north-mini-code:free", "dots-studio/dots-3-note-preview:free"];
      for (const orModel of orModels) {
        try {
          const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
              "HTTP-Referer": "http://localhost:3000",
              "X-Title": "ShopSmart Concierge"
            },
            body: JSON.stringify({
              model: orModel,
              messages: [{ role: "user", content: prompt }],
              temperature: 0.25,
              max_tokens: 600
            }),
            signal: AbortSignal.timeout(12000)
          });
          if (res.ok) {
            const data = await res.json();
            const rawText = data.choices?.[0]?.message?.content;
            if (rawText) {
              let cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
              const firstBrace = cleaned.indexOf("{");
              const lastBrace = cleaned.lastIndexOf("}");
              if (firstBrace !== -1 && lastBrace !== -1) {
                cleaned = cleaned.substring(firstBrace, lastBrace + 1);
              }
              conciergeResult = JSON.parse(cleaned);
              console.log(`[AI Concierge] Generated with OpenRouter ${orModel}`);
              break;
            }
          }
        } catch (err) {
          console.warn(`[AI Concierge] OpenRouter error:`, err.message);
        }
      }
    }

    // 3. Try Gemini API
    if (!conciergeResult && GEMINI_API_KEY) {
      const models = ["gemini-2.5-flash-lite", "gemini-2.5-flash"];
      for (const model of models) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.25 }
            }),
            signal: AbortSignal.timeout(12000)
          });
          if (res.ok) {
            const data = await res.json();
            const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawText) {
              let cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
              const firstBrace = cleaned.indexOf("{");
              const lastBrace = cleaned.lastIndexOf("}");
              if (firstBrace !== -1 && lastBrace !== -1) {
                cleaned = cleaned.substring(firstBrace, lastBrace + 1);
              }
              conciergeResult = JSON.parse(cleaned);
              console.log(`[AI Concierge] Generated with Gemini ${model}`);
              break;
            }
          }
        } catch (err) {
          console.warn(`[AI Concierge] Gemini error:`, err.message);
        }
      }
    }

    // 4. Safe Natural Fallback
    if (!conciergeResult) {
      const q = (userMessage || initialTopic || "").toLowerCase();
      const isLaptop = q.includes("laptop");
      const isPhone = q.includes("phone") || q.includes("mobile");

      conciergeResult = {
        reply: isLaptop
          ? "ज़रूर! बेस्ट लैपटॉप चुनने के लिए आपका मुख्य काम क्या रहेगा—Gaming, College/Coding, या Daily Office Use? और आपका बजट कितना है?"
          : isPhone
          ? "बिल्कुल! आपके लिए कैमरा, 5G स्पीड, और लंबी बैटरी सबसे ज़रूरी है या बेस्ट परफॉर्मेंस? आपका बजट कितना है?"
          : `ज़रूर! बेस्ट डील्स ढूंढने के लिए आपकी मुख्य पसंद और बजट क्या है?`,
        suggestedChips: isLaptop
          ? ["🎮 Heavy Gaming", "🎓 College & Coding", "💼 Office & Multi-tasking", "💰 Under ₹50,000"]
          : isPhone
          ? ["📸 Best Camera", "⚡ Fast Gaming 5G", "🔋 6000mAh Battery", "💰 Under ₹20,000"]
          : ["💰 Budget Friendly", "⭐ Top Rated", "🏷️ Branded Only", "⚡ Fast Performance"],
        isReadyToSearch: false,
        suggestedQuery: userMessage || initialTopic,
        confirmationQuestion: `क्या मैं "${userMessage || initialTopic}" सर्च करूँ?`,
        userPersona: "Value Shopper",
        userRequirement: "Quality product within budget",
        budgetLimit: null
      };
    }

    return NextResponse.json({
      success: true,
      ...conciergeResult
    });

  } catch (err) {
    console.error("[AI Concierge API Error]:", err?.message);
    return NextResponse.json({ success: false, error: "Failed to generate concierge guidance" }, { status: 500 });
  }
}
