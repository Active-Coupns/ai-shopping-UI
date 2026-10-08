import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

/**
 * Pre-Search AI Shopping Concierge API
 * Guides the user before search, answers buyer questions, clarifies requirements,
 * and formulates a high-yield, clean search query with explicit user confirmation.
 */
export async function POST(request) {
  try {
    const {
      userMessage = "",
      conversationHistory = [],
      initialTopic = "",
      country = "IN"
    } = await request.json();

    if (!userMessage && !initialTopic) {
      return NextResponse.json({ error: "userMessage or initialTopic is required" }, { status: 400 });
    }

    const isUS = String(country).toUpperCase() === "US";
    const currencySymbol = isUS ? "$" : "₹";

    const prompt = `You are ShopSmart AI Shopping Guide, an expert, honest, and friendly personal shopping consultant for an ${isUS ? "US" : "Indian"} e-commerce search platform.

YOUR MISSION & PHILOSOPHY:
1. ADVISOR FIRST, SEARCH SECOND: You are a friendly, knowledgeable consultant. Never rush the buyer to search. If they are confused (e.g. "PC vs Laptop", "battery vs GPU", "which brand is best"), explain clearly in simple, natural terms in 2-3 sentences.
2. ANSWER THEIR QUESTIONS: If they ask why something is better or what they should pick, give clear, objective shopping guidance.
3. STRICT 2-4 WORD SMART QUERY RULE:
   - Formulate a clean, ultra-focused search query strictly 2 to 4 words (e.g. "RTX 3050 laptop", "ASUS TUF gaming", "Sony ANC headphones", "Cotton linen shirt").
   - NEVER create a long sentence or bloated query! Never concatenate multiple sentences into the search terms. RapidAPI/Amazon/Flipkart search engines only work with 2-4 concise anchor words.
4. SUGGESTED CHIPS:
   - Provide 3-4 short, clickable chips.
   - Mix advice questions (e.g. "Check Battery Life", "Compare Brands") and if a specific model or spec is discussed, you may include "🚀 Search: [query]".
5. SHARED USER CONTEXT (Preserved for downstream AI memory without polluting the search query):
   - "userPersona": 2-4 words (e.g. "Budget College Gamer", "Casual Daily Wearer")
   - "userRequirement": 1 concise sentence summarizing primary use-case
   - "budgetLimit": integer number if known, or null

LANGUAGE & TONE:
- Speak in natural, friendly, warm Hinglish (conversational Hindi-English blend) if user writes in Hindi/Hinglish, or simple English if user writes in English.
- Keep responses short, warm, and structured (2-3 sentences max).

CONTEXT:
Initial Search Topic: "${initialTopic}"
Country: ${country} (${currencySymbol})
Recent Conversation:
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
    console.error("[AI Concierge API Error]:", err);
    return NextResponse.json({ error: "Failed to generate concierge guidance" }, { status: 500 });
  }
}
