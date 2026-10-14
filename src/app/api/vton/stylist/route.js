import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { checkRateLimit, extractTrustedClientIp } from '@/services/rateLimiter';
import { consultFashionStylist } from '@/services/fashionStylist';

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

export async function POST(request) {
  try {
    // 1. Clerk Authentication Verification
    let userId = null;
    try {
      const authObj = getAuth(request);
      userId = authObj?.userId || null;
    } catch {
      userId = null;
    }

    // 2. Anti-Spam Rate Limiting (20 requests per minute)
    const clientIp = extractTrustedClientIp(request);
    const minuteLimit = await checkRateLimit({
      namespace: "vton_stylist_minute",
      identifier: userId || clientIp || "anon",
      limit: 20,
      windowSeconds: 60
    });

    if (!minuteLimit.allowed && !minuteLimit.isBackendError) {
      return NextResponse.json({
        intent: "RATE_LIMITED",
        assistantMessage: `Too many stylist questions sent. Please wait ${minuteLimit.retryAfter || 30}s.`,
        recommendedProducts: [],
        suggestedQuestions: []
      }, { status: 429 });
    }

    // 3. Request Payload Validation
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "INVALID_JSON", message: "Invalid JSON request body." }, { status: 400 });
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ success: false, error: "INVALID_PAYLOAD", message: "Request body must be a JSON object." }, { status: 400 });
    }

    const { userMessage, skinTone, gender, isCustomPhoto, excludeProductIds } = body;

    if (!userMessage || typeof userMessage !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // 4. Base Stylist Consultation (Catalog Lookup & Color Harmony)
    const baseResponse = await consultFashionStylist({
      userMessage,
      skinTone: skinTone || "wheatish",
      gender: gender || "men",
      isCustomPhoto: !!isCustomPhoto,
      excludeProductIds: Array.isArray(excludeProductIds) ? excludeProductIds : []
    });

    // 5. Groq Cloud LLM Stylist Brain (Personalized Guidance + Screenshot Upload Strategy)
    if (GROQ_API_KEY) {
      try {
        const topCatalogPicks = (baseResponse.recommendedProducts || []).slice(0, 4).map(p => ({
          id: p.id,
          title: p.title,
          color: p.color,
          category: p.category_label || p.category,
          price: p.price
        }));

        const systemPrompt = `You are ShopSmart AI Fashion Stylist, a warm, chic, and honest personal fashion consultant for a virtual trial room.

CONTEXT & USER SIGNALS:
- Gender: ${gender || "men"}
- Skin Tone: ${skinTone || "wheatish"}
- User Uploaded Photo?: ${isCustomPhoto ? "YES (Self Photo Uploaded - DO NOT ask about skin tone! They want to know what looks great on their frame/tone directly)" : "NO (Browsing without photo - ask about occasion, budget or preferred colors)"}
- Products currently matching in our wardrobe:
${JSON.stringify(topCatalogPicks, null, 2)}

ROLE & SCOPE GUARDRAILS:
- You are strictly an AI Fashion & Style Consultant.
- You do NOT write code, essays, poems, or general knowledge answers. Politely decline out-of-scope non-fashion queries in 1 sentence and guide back to clothing.
- Language: Natural friendly Hinglish (conversational Hindi-English blend) if user writes in Hindi/Hinglish, or simple English if user writes in English.
- Keep replies concise (2-3 sentences max).

CRITICAL STRATEGY FOR OUT-OF-CATALOG OR VERY SPECIFIC REQUESTS:
- IF the user asks for an outfit, style, or specific designer dress that does NOT closely match what we have in the wardrobe (e.g. vintage leather jacket, specific bridal lehenga, cartoon print hoodies, or bespoke designer wear):
  EMPOWER THEM! Say: "Yeh specific style hamare current curated wardrobe mein abhi available nahi hai, lekin aap Pinterest ya Myntra/Instagram se iska screenshot lekar upar 'Upload Garment' button se upload kar sakte hain—hamari AI seedhe aapki photo par pehna kar dikha degi!"
  And set "suggestScreenshotUpload": true.

Output strictly valid JSON matching this schema:
{
  "reply": "Warm, 2-3 sentence style recommendation or occasion question",
  "suggestScreenshotUpload": false, // true IF user asked for something not in wardrobe
  "suggestedQuestions": ["Quick Chip 1", "Quick Chip 2", "Quick Chip 3"]
}`;

        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "qwen/qwen3.8-27b",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userMessage }
            ],
            temperature: 0.25,
            response_format: { type: "json_object" }
          }),
          signal: AbortSignal.timeout(6000)
        });

        if (groqRes.ok) {
          const groqData = await groqRes.json();
          const parsed = JSON.parse(groqData.choices[0].message.content);
          if (parsed && parsed.reply) {
            return NextResponse.json({
              ...baseResponse,
              assistantMessage: parsed.reply,
              suggestScreenshotUpload: !!parsed.suggestScreenshotUpload,
              suggestedQuestions: (Array.isArray(parsed.suggestedQuestions) && parsed.suggestedQuestions.length > 0)
                ? parsed.suggestedQuestions
                : baseResponse.suggestedQuestions
            });
          }
        }
      } catch (groqErr) {
        console.warn("[VTON Stylist] Groq dynamic LLM fallback to rule engine:", groqErr.message);
      }
    }

    // High-speed fallback to verified deterministic stylist engine if Groq offline
    return NextResponse.json(baseResponse);
  } catch (err) {
    console.error("Fashion Stylist API error:", err?.message);
    return NextResponse.json({
      intent: "ERROR",
      assistantMessage: "Unable to complete styling recommendations. Please retry shortly.",
      recommendedProducts: [],
      suggestedQuestions: []
    }, { status: 500 });
  }
}

