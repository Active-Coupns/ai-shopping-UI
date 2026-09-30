import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

/**
 * Human-Centric, Empathetic AI Shopping Consultant Prompt (3-Deep Lifestyle Questions)
 */
const SYSTEM_PROMPT = `You are ShopSmart AI, an intuitive, empathetic, and friendly shopping advisor for an Indian e-commerce platform.

CORE PRINCIPLES:
1. ALWAYS ASK EXACTLY 2-3 SMART LIFESTYLE QUESTIONS when user starts:
   - Question 1: Profile & Persona (e.g. Student, Professional, Gamer, Creator, Casual)
   - Question 2: Daily Use-Case & Occasion (What will you actually do with this product?)
   - Question 3: Top Priority & Comfort (What matters most? Speed, Battery, Fabric, Fit, Brand Value)
2. ZERO TECHNICAL JARGON: Speak in simple everyday language.
3. HANDLE TYPOS & HINGLISH NATURALLY.
4. WHEN PREFERENCES ARE SELECTED: When user provides choices or answers (e.g. occasion, style, priority), IMMEDIATELY finalize the Shopper Blueprint with refinedQuery and set questions: [].
5. HIGH-PRECISION QUERY FORMULATION (refinedQuery in blueprint):
   - ALWAYS preserve and strictly enforce the user's budget constraint (e.g. "under 50000", "under 3000", "below 20k") in refinedQuery so the search engine only fetches deals strictly within the user's budget.
   - Combine the core product + primary use-case + budget (e.g. "thin light i5 laptop under 50000", "printed cotton party shirt under 3000", "active anc headphones under 4000").
   - NEVER output a generic query that drops the budget limit.
6. PHARMACY MEDICINES & SPECIFIC SUPPLEMENTS (ZERO QUESTIONNAIRE):
   - If the user's query is for a specific medicine (e.g. Dolo 650, Telma 40, Shelcal, Augmentin, Paracetamol) or a specific supplement brand/product (e.g. ON Gold Standard Whey 2kg, MuscleBlaze Creatine 250g), DO NOT ASK ANY QUESTIONS.
   - Return questions: [] and immediately create an action with type "EXECUTE_SEARCH" and query matching the exact product.

Always respond ONLY with a valid JSON object matching this schema:

Sample 1 (Initial category search):
{
  "content": "Let's find the ideal party shirt for your look! To help me recommend the best options under ₹3,000, tell me a bit about your style:",
  "category": "Men's Fashion",
  "questions": [
    {
      "id": "occasion",
      "title": "What is the occasion for your party shirt?",
      "options": [
        "🎉 Beach or Summer Vacation Party",
        "🍸 Casual Night Out / Clubbing",
        "👔 Smart-Casual Dinner / Function"
      ]
    },
    {
      "id": "style",
      "title": "What is your preferred style?",
      "options": [
        "🌸 Bold Prints & Patterns (Stand out)",
        "✨ Solid Colors (Minimalist & Classy)",
        "🌿 Textured Linen (Breathable & Premium)"
      ]
    },
    {
      "id": "priority",
      "title": "What matters most to you?",
      "options": [
        "🏷️ Brand Value & Premium Look",
        "☁️ 100% Pure Soft Cotton Comfort",
        "💰 Best Value under ₹3,000"
      ]
    }
  ],
  "blueprint": null
}

Sample 2 (When preferences are provided or questionnaire is answered):
{
  "content": "Awesome choices! For a beach or vacation party with bold prints and brand value under ₹3,000, I'm curating top picks from premium brands with pure breathable cotton.\\n\\nI've generated your custom **Party Wear Shopper Blueprint** to find live discounts across Amazon, Flipkart, Myntra, and Ajio.",
  "category": "Party Shirts",
  "questions": [],
  "blueprint": {
    "title": "VACATION PARTY SHIRT BLUEPRINT",
    "refinedQuery": "printed cotton party shirt under 3000",
    "criteria": {
      "Occasion": "Beach & Summer Vacation Party",
      "Style": "Bold Prints & Patterns",
      "Priority": "Brand Value & Pure Cotton Comfort",
      "Budget": "Under ₹3,000"
    }
  }
}
`;

/**
 * Call Gemini Flash API with automatic model fallback
 */
async function callGemini(userPrompt) {
  const models = ["gemini-3.1-flash-lite", "gemini-3.6-flash", "gemini-3.8-flash"];

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userPrompt }] }],
          generationConfig: {
            temperature: 0.2
          }
        })
      });

      if (!res.ok) continue;

      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        const cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        return { parsed, modelUsed: model };
      }
    } catch (err) {
      console.warn(`Error with model ${model}:`, err.message);
    }
  }
  return null;
}

export async function POST(request) {
  try {
    const { message, conversationHistory = [], answers = {}, queryContext = "" } = await request.json();

    const currentText = String(message || queryContext || "").trim();
    if (!currentText && Object.keys(answers).length === 0) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const qLower = currentText.toLowerCase();
    const isMedicine = /\b(dolo|telma|shelcal|augmentin|pantocid|crocin|paracetamol|azithromycin|metformin|glycomet|atorvastatin|amlodipine|pantoprazole|amoxicillin|combiflam|allegra|montair|vicks|benadryl|strepsils|betadine|limcee|zincovit|becosules|supradyn|liv\s*52|digene|gelusil|omez|pan\s*40|pan\s*d|rantac|zinetac|ciplox|norflox|cifran|taxim|calpol|sumo|meftal|disprin|saridon|cetrizine|levocetrizine|okacet|avil|tablets?|capsules?|syrups?|injections?|drops?|ointment|gel|cream|suspension|inhaler|sachet|\d+\s*mg|\d+\s*ml|strip\s*of)\b/i.test(qLower);
    const isSpecificSupplement = /\b(optimum\s*nutrition|gold\s*standard|muscleblaze|biozyme|nutrabay|myprotein|as-?it-?is|nakpro|gnc|isopure|cellucor|dymatize|nitro-?tech|rule\s*1|avatar|avvatar|fast\s*&\s*up|the\s*whole\s*truth|atom|boniso|muscletech|prostar|ultimate\s*nutrition|labrada|scitron|creapure|\d+(\.\d+)?\s*(kg|lbs?|gm|g)\b)/i.test(qLower);

    if ((isMedicine || isSpecificSupplement) && Object.keys(answers).length === 0) {
      return NextResponse.json({
        role: "assistant",
        content: `Finding verified prices and live deals for **${currentText}** across certified pharmacies and official brand stores...`,
        category: isMedicine ? "Pharmacy & Medicines" : "Health & Fitness",
        questions: [],
        action: {
          type: "EXECUTE_SEARCH",
          query: currentText,
          buttonText: `View Live Prices & Coupons →`
        }
      });
    }

    const answerCount = Object.keys(answers).length;
    const hasSufficientAnswers = answerCount >= 2;

    let prompt = `${SYSTEM_PROMPT}\n\n`;
    if (queryContext && queryContext !== currentText) {
      prompt += `User Original Search Topic: "${queryContext}"\n`;
    }
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      prompt += `Conversation History so far:\n`;
      for (const turn of conversationHistory.slice(-4)) {
        prompt += `${turn.role === "user" ? "User" : "Assistant"}: ${turn.text || turn.content}\n`;
      }
      prompt += `\n`;
    }

    if (hasSufficientAnswers) {
      prompt += `User has answered the questions and selected these exact preferences: ${JSON.stringify(answers)}.\nCRITICAL INSTRUCTION: The questionnaire is COMPLETE. DO NOT ASK ANY NEW QUESTIONS. Output questions: [] and create the finalized shopper blueprint with a clean search query now.\n\nGenerate the JSON response:`;
    } else {
      if (answerCount > 0) {
        prompt += `User Selected Preferences So Far: ${JSON.stringify(answers)}\n\n`;
      }
      prompt += `Latest User Message: "${currentText}"\n\nGenerate the JSON response:`;
    }

    const geminiResult = await callGemini(prompt);

    if (geminiResult && geminiResult.parsed) {
      const { parsed, modelUsed } = geminiResult;

      const responsePayload = {
        role: "assistant",
        content: parsed.content || "Here are the best options tailored to your needs:",
        category: parsed.category || "Recommended Products",
        questions: parsed.questions || [],
        quickSuggestions: parsed.quickSuggestions || [],
        aiModel: modelUsed
      };

      if (parsed.blueprint || hasSufficientAnswers) {
        const blueprintData = parsed.blueprint || {
          title: "CUSTOM SHOPPER BLUEPRINT",
          refinedQuery: `${queryContext || currentText} ${Object.values(answers).join(" ")}`.replace(/[^\w\s₹]/g, " ").trim(),
          criteria: answers
        };

        responsePayload.intent = "BLUEPRINT_READY";
        responsePayload.blueprint = blueprintData;
        responsePayload.action = {
          type: "EXECUTE_SEARCH",
          query: blueprintData.refinedQuery || currentText,
          buttonText: `Search Best Deals for this Blueprint →`
        };
        responsePayload.questions = [];
      } else if (parsed.action) {
        responsePayload.action = parsed.action;
      }

      return NextResponse.json(responsePayload);
    }

    // Fallback response if API is unreachable
    return NextResponse.json({
      role: "assistant",
      content: `I'm analyzing your request for "${currentText}". Let's find you the best multi-store deals!`,
      category: "Shopping Guide",
      questions: []
    });

  } catch (err) {
    console.error("AI Guide API Error:", err);
    return NextResponse.json({
      role: "assistant",
      content: "I am ready to help you find the best deals! Tell me what product you're exploring.",
      questions: []
    }, { status: 200 });
  }
}
