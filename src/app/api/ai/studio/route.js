import { NextResponse } from "next/server";
import { checkSharedIpQuota } from "@/services/rateLimiter";
import { sanitizeAiPrompt, checkSearchContentSafety, clampString } from "@/services/securityShield";
import { validateCountryCode } from "@/lib/countryConfig";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";

/**
 * Natural LLM Caller with fallback
 */
async function callLLM(prompt, systemInstruction = "") {
  if (GROQ_API_KEY) {
    try {
      const messages = [];
      if (systemInstruction) {
        messages.push({ role: "system", content: systemInstruction });
      }
      messages.push({ role: "user", content: prompt });

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          messages,
          temperature: 0.2,
          response_format: { type: "json_object" }
        }),
        signal: AbortSignal.timeout(6000)
      });

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content || "";
        try {
          return JSON.parse(content);
        } catch {
          const match = content.match(/\{[\s\S]*\}/);
          if (match) return JSON.parse(match[0]);
        }
      }
    } catch (err) {
      console.warn("[AI Studio] Groq 120b error:", err.message);
    }

    try {
      const messages = [];
      if (systemInstruction) {
        messages.push({ role: "system", content: systemInstruction });
      }
      messages.push({ role: "user", content: prompt });

      const res2 = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages,
          temperature: 0.2,
          response_format: { type: "json_object" }
        }),
        signal: AbortSignal.timeout(5000)
      });

      if (res2.ok) {
        const data2 = await res2.json();
        const content2 = data2.choices?.[0]?.message?.content || "";
        try {
          return JSON.parse(content2);
        } catch {
          const match = content2.match(/\{[\s\S]*\}/);
          if (match) return JSON.parse(match[0]);
        }
      }
    } catch (err2) {
      console.warn("[AI Studio] Groq 20b error:", err2.message);
    }
  }

  return null;
}

/**
 * Intelligent Conversational Assistant API
 * Matches ChatGPT's exact questionnaire format ("Let me narrow it down for you")
 * & supports follow-up product advice conversations
 */
export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
    }

    const { 
      action = "chat", 
      message = "", 
      history = [], 
      country = "IN", 
      selections = null,
      displayedProducts = []
    } = body;

    // 0. Rate Limiting Protection (Max 30 calls/minute per IP)
    const quota = await checkSharedIpQuota({ request, limit: 30, windowSeconds: 60 });
    if (!quota.allowed && !quota.isBackendError) {
      return NextResponse.json({ 
        success: false, 
        error: "RATE_LIMITED", 
        message: "You're sending requests too quickly. Please pause for a moment." 
      }, { status: 429 });
    }

    // 1. Content Safety & Harmful Pattern Defense
    if (message) {
      const safetyCheck = checkSearchContentSafety(message);
      if (!safetyCheck.safe) {
        return NextResponse.json({
          success: false,
          error: "UNSAFE_QUERY",
          message: safetyCheck.reason
        }, { status: 400 });
      }

      // 2. Prompt Injection & Jailbreak Defense
      const promptShield = sanitizeAiPrompt(message, 400);
      if (promptShield.isJailbreak) {
        return NextResponse.json({
          success: false,
          error: "SECURITY_VIOLATION",
          message: "ShopSmart AI only assists with retail product discovery and advice."
        }, { status: 400 });
      }
    }

    const safeCountry = validateCountryCode(country);
    const cleanMsg = clampString(message, 400);
    if (!cleanMsg && !selections) {
      return NextResponse.json({ success: false, error: "Message or selections required." }, { status: 400 });
    }

    // -----------------------------------------------------------------------------------
    // ACTION: FINALIZE QUERY (User submitted the "Find my best [category]" questionnaire)
    // -----------------------------------------------------------------------------------
    if (action === "finalize_query" || selections) {
      const systemInstruction = `You are an expert e-commerce search query optimizer for Amazon, Flipkart, and Google Shopping.
Given the user's original request and their questionnaire answers:
1. Synthesize a clean, high-yield 2 to 4 word search query (e.g. "laptop 16GB RAM under 50000", "laptop under 50000", "ANC earbuds under 3000", "running shoes men", "whey protein isolate").
2. CRITICAL ACCURACY RULE: If the user selected "No" for dedicated graphics or "Business, coding and AI tools", DO NOT include the word "gaming"! Instead formulate clean queries like "laptop 16GB RAM under 50000" or "laptop under 50000".
3. NEVER include intent filler words like "coding", "best", "find", "50k". Use "under 50000" or just category + specs.
4. Provide an "adviceNote": 1-2 sentences of expert advice (e.g. "My initial advice: prioritize 16GB RAM, a 512GB SSD, and a good IPS display.").
Output strictly in JSON.`;

      const prompt = `Original request: "${cleanMsg}"
User selections: ${JSON.stringify(selections || {})}
Conversation History: ${JSON.stringify(history.slice(-3))}

Respond strictly in JSON:
{
  "searchQuery": "clean 2-4 word query",
  "adviceNote": "1-2 sentences expert advice"
}`;

      const finalData = await callLLM(prompt, systemInstruction);
      const cleanSearchQuery = finalData?.searchQuery || cleanMsg.replace(/coding|best|cheap/gi, "").trim() || "laptop 16GB RAM";

      return NextResponse.json({
        success: true,
        type: "execute_search",
        searchQuery: cleanSearchQuery,
        adviceNote: finalData?.adviceNote || "Prioritizing verified in-stock models matching your exact criteria:"
      });
    }

    // -----------------------------------------------------------------------------------
    // ACTION: CONTEXTUAL FOLLOW-UP CHAT (Products are already displayed on screen)
    // -----------------------------------------------------------------------------------
    if (Array.isArray(displayedProducts) && displayedProducts.length > 0) {
      // Check if user is asking for a completely new search category
      const isNewCategoryRequest = /\b(aur|nayi|new|different|dikhao|search for|find me|look for|dusra|change)\s+(phone|laptop|shoes|watch|earbuds|headphones|medicine|supplement|deals|tv|tablet|camera)\b/i.test(cleanMsg);

      if (!isNewCategoryRequest) {
        const productSummaries = displayedProducts.slice(0, 4).map((p, idx) => 
          `${idx + 1}. ${p.title} | Price: ₹${p.price} | Store: ${p.store || p.store_name || "Verified Store"}`
        ).join("\n");

        const followUpInstruction = `You are ShopSmart AI, a trusted shopping advisor like ChatGPT.
The user has shortlisted/viewed these products on their screen:
${productSummaries}

The user is asking a follow-up question about these products (e.g. which one is better, battery life, RAM upgrade, durability, or advice).
Rules:
1. Answer their specific question honestly, objectively, and concisely (2-4 sentences max).
2. If they ask which one to pick, give a clear direct recommendation with a clear reason.
3. Match the user's language (Hindi, Hinglish, or English).
Output strictly in JSON:
{
  "type": "chat_reply",
  "reply": "Your clear, direct and expert answer here."
}`;

        const followUpData = await callLLM(`User message: "${cleanMsg}"\nHistory: ${JSON.stringify(history.slice(-3))}`, followUpInstruction);
        if (followUpData && followUpData.reply) {
          return NextResponse.json({
            success: true,
            type: "chat_reply",
            reply: followUpData.reply
          });
        }
      }
    }

    // -----------------------------------------------------------------------------------
    // ACTION: QUESTIONNAIRE GENERATION (First turn: "Let me narrow it down for you")
    // -----------------------------------------------------------------------------------
    const systemInstruction = `You are ShopSmart AI, an expert shopping concierge like ChatGPT.
When a user asks about buying any product (laptop, phone, headphones, shoes, medicine, supplement, TV, AC):
1. Provide a warm, helpful 1-2 sentence intro offering honest buying advice for their budget/category.
2. Generate an interactive questionnaire titled "Let me narrow it down for you" with exactly 2 or 3 high-impact multiple choice questions.
3. Each question must have 3-4 realistic options, and a "defaultSelected" index (usually 0).
4. Provide a "buttonText" for the submit button (e.g. "Find my best laptop", "Find my best headphones", "Find my best deals").
Output strictly in JSON.`;

    const prompt = `User request: "${cleanMsg}" (Country: ${safeCountry})

Respond strictly with this JSON schema:
{
  "introText": "1-2 sentences honest buying advice for this budget/need",
  "title": "Let me narrow it down for you",
  "category": "laptop | audio | phone | fashion | general",
  "buttonText": "Find my best laptop",
  "questions": [
    {
      "id": "q1",
      "text": "What will you mainly use it for?",
      "options": [
        "Business, coding and AI tools",
        "Gaming",
        "College and everyday use",
        "Video editing and design"
      ],
      "defaultSelected": 0
    },
    {
      "id": "q2",
      "text": "What matters most?",
      "options": [
        "Maximum performance",
        "Battery life",
        "Best display",
        "Build quality and reliability"
      ],
      "defaultSelected": 0
    },
    {
      "id": "q3",
      "text": "Do you need dedicated graphics for gaming or 3D work?",
      "options": [
        "Yes",
        "No",
        "Not sure"
      ],
      "defaultSelected": 1
    }
  ]
}`;

    const questionnaireData = await callLLM(prompt, systemInstruction);

    if (questionnaireData && Array.isArray(questionnaireData.questions) && questionnaireData.questions.length > 0) {
      return NextResponse.json({
        success: true,
        type: "questionnaire",
        ...questionnaireData
      });
    }

    // Fallback if LLM failed
    return NextResponse.json({
      success: true,
      type: "questionnaire",
      introText: `When shopping for ${cleanMsg}, focusing on the right specs and proven reliability will get you the best value.`,
      title: "Let me narrow it down for you",
      category: "general",
      buttonText: "Find my best options",
      questions: [
        {
          "id": "q1",
          "text": "What will you mainly use it for?",
          "options": ["Everyday productivity & work", "Gaming & heavy tasks", "Media & entertainment"],
          "defaultSelected": 0
        },
        {
          "id": "q2",
          "text": "What matters most to you?",
          "options": ["Maximum performance", "Battery & durability", "Best value for money"],
          "defaultSelected": 0
        }
      ]
    });

  } catch (error) {
    console.error("[AI Studio API Error]:", error);
    return NextResponse.json({
      success: false,
      error: "INTERNAL_ERROR",
      message: "An unexpected error occurred."
    }, { status: 500 });
  }
}
