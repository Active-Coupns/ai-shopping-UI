/**
 * Layer 1: Gemini 1.5 Flash Intent Cleaner & AI Product Advisory Engine
 * Normalizes complex, conversational, Hinglish, Marathi & English prompts into tight e-commerce keywords.
 * Generates AI "Why Buy" and "Why Avoid" pros & cons per query/product context.
 */

export async function extractQueryIntent(rawQuery, country = "IN") {
  if (!rawQuery) {
    return {
      cleaned_keyword: "",
      category: "general",
      max_price: null,
      why_buy: "Offers verified market pricing with multi-store comparison.",
      why_avoid: "Verify seller ratings and return policy before ordering."
    };
  }

  const queryStr = String(rawQuery).trim();
  const lower = queryStr.toLowerCase();

  // 1. Fast Category Classification
  let category = "general";
  if (/\b(laptop|laptops|macbook|computer|pc|rtx|intel|amd|ryzen|notebook|chromebook)\b/i.test(lower)) {
    category = "laptop";
  } else if (/\b(phone|phones|mobile|mobiles|iphone|samsung|oneplus|realme|xiaomi|redmi|vivo|oppo|5g)\b/i.test(lower)) {
    category = "mobile";
  } else if (/\b(tshirt|tshirts|t-shirt|shirt|shirts|pant|pants|jeans|clothes|clothing|dress|shoes|sneakers|kurti|saree|wear|downshoulder|oversized|fabric)\b/i.test(lower)) {
    category = "fashion";
  } else if (/\b(tv|televisions|fridge|refrigerator|washing machine|ac|air conditioner|oven|microwave)\b/i.test(lower)) {
    category = "appliance";
  } else if (/\b(headphone|headphones|earphone|earphones|earbuds|airpods|speaker|speakers|audio|soundbar)\b/i.test(lower)) {
    category = "audio";
  }

  // 2. Price Constraint Extraction (e.g., "under 50000", "below 1500", "under 1k")
  let maxPrice = null;
  const priceMatch = lower.match(/(?:under|below|less than|within|upto|up to|sasta|range)\s*(?:rs\.?|inr|₹)?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(k|lakh|lakhs)?/i);
  if (priceMatch) {
    let val = parseFloat(priceMatch[1].replace(/,/g, ""));
    const unit = priceMatch[2] ? priceMatch[2].toLowerCase() : "";
    if (unit === "k") val *= 1000;
    if (unit === "lakh" || unit === "lakhs") val *= 100000;
    maxPrice = val;
  }

  // 3. Fast Intent Keyword Cleaning (Removing filler words in English, Hindi & Hinglish)
  let cleanKw = queryStr
    .replace(/[₹$€£,!?."']/g, " ")
    .replace(/\b(mujhe|chahiye|dikhao|batao|wala|wali|waala|waali|sabse|badiya|achha|achhi|sasta|saste|best|top|buy|online|price|cost|deal|deals|offer|offers|discount|discounts|in|india|for|men|women|heavy|fabric|cloth|clothe|travel|focus|work|home|office|study|college|daily|use|usage|long)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Handle specific cases
  if (lower.includes("downshoulder") || lower.includes("oversized")) {
    if (!cleanKw.toLowerCase().includes("tshirt") && !cleanKw.toLowerCase().includes("t-shirt")) {
      cleanKw += " tshirt";
    }
  }

  if (!cleanKw) cleanKw = queryStr;

  // 4. Generate AI "Why Buy" & "Why Avoid" Insights based on Query Context
  let whyBuy = "Strong value pick featuring verified multi-store price benchmarks.";
  let whyAvoid = "Check size chart & store return policies before finalizing.";

  if (category === "fashion") {
    whyBuy = "Features comfortable breathable fabric, trendy relaxed fit & high durability for daily wear.";
    whyAvoid = "Thick/heavy fabric can feel slightly warm during high-humidity summer peak days.";
  } else if (category === "laptop") {
    whyBuy = "Delivers high CPU/GPU performance balance for gaming, coding & multi-tasking workloads.";
    whyAvoid = "Battery backup drops faster under heavy GPU gaming; keep charger handy.";
  } else if (category === "mobile") {
    whyBuy = "Offers vibrant AMOLED display, fast 5G connectivity & reliable day-long battery life.";
    whyAvoid = "Lacks expandable microSD slot; choose higher internal storage variant if needed.";
  } else if (category === "audio") {
    whyBuy = "Delivers active noise cancellation (ANC) with punchy bass output & ergonomic earcups.";
    whyAvoid = "Touch control sensors may occasionally register accidental taps during workouts.";
  }

  // 5. Try calling Gemini API if GEMINI_API_KEY is configured
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an AI e-commerce intent parser. Given the user query: "${queryStr}", extract:
1. Clean concise search keyword (remove conversational filler words).
2. "why_buy": 1 bullet point explaining why this item/category is recommended.
3. "why_avoid": 1 bullet point explaining potential drawback.
Respond strictly in valid JSON format: {"cleaned_keyword": "...", "why_buy": "...", "why_avoid": "..."}`
            }]
          }]
        })
      });

      if (response.ok) {
        const json = await response.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.cleaned_keyword) cleanKw = parsed.cleaned_keyword;
          if (parsed.why_buy) whyBuy = parsed.why_buy;
          if (parsed.why_avoid) whyAvoid = parsed.why_avoid;
        }
      }
    } catch (err) {
      console.warn("[Intent Engine] Gemini API fallback to fast rules:", err.message);
    }
  }

  return {
    cleaned_keyword: cleanKw,
    category,
    max_price: maxPrice,
    why_buy: whyBuy,
    why_avoid: whyAvoid
  };
}
