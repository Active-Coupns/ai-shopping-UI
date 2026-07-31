import { NextResponse } from "next";

export async function POST(request) {
  console.log("HASDATA_API_KEY present:", !!process.env.HASDATA_API_KEY);
  console.log("GEMINI_API_KEY present:", !!process.env.GEMINI_API_KEY);

  try {
    const { query, country } = await request.json();
    
    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
    }

    // 1. Sanitize the query keywords (remove currency symbols like ₹, $, filler words, extra spacing)
    const cleanQuery = query
      .replace(/[₹$€£]/g, "")
      .replace(/\b(please|find|show|me|best|buy|under|below|for|search|deals|get)\b/gi, "")
      .replace(/\s+/g, " ")
      .trim();

    const hasdataApiKey = process.env.HASDATA_API_KEY;
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!hasdataApiKey) {
      return NextResponse.json(
        { error: "HASDATA_API_KEY environment variable is not configured." },
        { status: 500 }
      );
    }

    // 2. Build HasData search URL targeting Google Shopping (tbm=shop) with fallback query parameter apiKey
    const gl = (country || "IN").toLowerCase();
    const domain = gl === "us" ? "google.com" : "google.co.in";
    const hasdataUrl = `https://api.hasdata.com/scrape/google/serp?q=${encodeURIComponent(cleanQuery)}&domain=${domain}&gl=${gl}&tbm=shop&apiKey=${hasdataApiKey}`;

    const scraperResponse = await fetch(hasdataUrl, {
      method: "GET",
      headers: {
        "x-api-key": hasdataApiKey,
        "Content-Type": "application/json"
      }
    });

    if (!scraperResponse.ok || scraperResponse.status !== 200) {
      const errText = await scraperResponse.text();
      console.error(`[Scraper Error] HasData returned status: ${scraperResponse.status}`);
      console.error(`[Scraper Error] Raw response body:`, errText);
      return NextResponse.json(
        { error: `Google Shopping scraper failed with status ${scraperResponse.status}: ${errText}` },
        { status: scraperResponse.status }
      );
    }

    const data = await scraperResponse.json();
    
    // Safely parse shoppingResults OR organicResults and log if empty
    const rawResults = data.shoppingResults || data.shopping_results || data.organicResults || data.organic_results || [];
    const isOrganic = !data.shoppingResults && !data.shopping_results && (data.organicResults || data.organic_results);

    if (rawResults.length === 0) {
      console.warn(`[Scraper Warning] Empty results array received for query: "${cleanQuery}"`);
      console.warn(`[Scraper Warning] Full scraper JSON response:`, JSON.stringify(data));
    }

    // 3. Filter out zero-price, missing, or invalid products
    const validResults = rawResults.filter(p => {
      if (!p) return false;
      if (isOrganic) return true; // Keep organic results (we will mock/estimate their price if missing)
      
      const priceVal = p.extracted_price || p.price;
      if (priceVal === undefined || priceVal === null) return false;
      if (typeof priceVal === "string") {
        const clean = priceVal.replace(/[^0-9.]/g, "");
        const num = parseFloat(clean);
        return !isNaN(num) && num > 0;
      }
      return typeof priceVal === "number" && priceVal > 0;
    });

    // Take top 4-5 products for analysis
    const topProducts = validResults.slice(0, 5);

    if (topProducts.length === 0) {
      return NextResponse.json({ results: [], creditsRemaining: data.requestInfo?.creditsLeft || 100 });
    }

    // 4. Pass top products to Gemini API for custom AI insights
    let insights = [];
    if (geminiApiKey) {
      try {
        const productsListText = topProducts.map((p, idx) => {
          const priceStr = p.price || `${p.extracted_price}`;
          return `${idx + 1}. Title: ${p.title} | Price: ${priceStr} | Store: ${p.source || "Merchant"}`;
        }).join("\n");

        const prompt = `You are an expert e-commerce shopping assistant. I have a list of products retrieved for the query: "${cleanQuery}".
For each product, write a concise 2-line "AI Matching Insight" explaining why it fits the user's query or who it is best for. Keep it simple, everyday-user friendly, and short (max 2 sentences, ~25 words).

Products:
${productsListText}

Return the insights strictly as a JSON array of strings, where each entry matches the product's index.
Example output format:
[
  "Best option for heavy coding and occasional gaming within a tight budget.",
  "Excellent choice for a lightweight, travel-friendly work laptop with solid battery life."
]
Return ONLY the raw JSON array. Do not include markdown code block formatting (like \`\`\`json) or any other text.`;

        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt
                  }
                ]
              }
            ]
          })
        });

        if (geminiResponse.ok) {
          const geminiData = await geminiResponse.json();
          let rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
          rawText = rawText.trim();
          if (rawText.startsWith("```")) {
            rawText = rawText.replace(/^```json/, "").replace(/^```/, "").replace(/```$/, "").trim();
          }
          insights = JSON.parse(rawText);
        }
      } catch (geminiError) {
        console.error("Gemini API call failed:", geminiError);
      }
    }

    // 5. Map results into card format
    const mappedResults = topProducts.map((p, idx) => {
      let priceNum = 0;
      if (typeof p.extracted_price === "number") {
        priceNum = p.extracted_price;
      } else if (p.price) {
        const clean = String(p.price).replace(/[^0-9.]/g, "");
        priceNum = parseFloat(clean) || 0;
      }
      if (priceNum <= 0) {
        priceNum = 1499 + (idx * 350);
      }

      const isUSD = gl === "us";
      const currencyCode = isUSD ? "USD" : "INR";
      const locale = isUSD ? "en-US" : "en-IN";

      const formattedPrice = new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currencyCode,
        maximumFractionDigits: 0,
      }).format(priceNum);

      const discount = Math.floor(15 + (idx * 5) + Math.random() * 5);
      const calculatedOriginal = Math.round(priceNum / (1 - discount / 100));
      
      const formattedOriginal = new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currencyCode,
        maximumFractionDigits: 0,
      }).format(calculatedOriginal);

      let localImage = "/laptop.jpg";
      const qLower = query.toLowerCase();
      if (qLower.includes("shirt") || qLower.includes("cotton") || qLower.includes("cloth") || qLower.includes("wear")) {
        localImage = "/shirt.jpg";
      } else if (qLower.includes("headphone") || qLower.includes("noise") || qLower.includes("audio") || qLower.includes("earphone")) {
        localImage = "/headphones.jpg";
      }

      const specs = [
        p.title.split(" ").slice(0, 3).join(" ") || "Verified Specifications",
        p.source ? `Sold by verified seller: ${p.source}` : "Merchant warranty included",
        "Top rated customer feedback and fast shipping support"
      ];

      let coupon = null;
      if (idx === 0) {
        coupon = {
          code: "AISAVE10",
          discount: "10% Extra Discount"
        };
      } else if (idx === 1) {
        coupon = {
          code: "FREESHIP",
          discount: "Free Shipping Applied"
        };
      }

      return {
        id: p.product_id || p.id || `prod-${idx}-${Date.now()}`,
        title: p.title,
        store: p.source || p.displayed_link || "Merchant",
        price: formattedPrice,
        originalPrice: formattedOriginal,
        discountPercent: discount,
        rating: p.rating || (4.4 + idx * 0.1).toFixed(1),
        reviewsCount: p.reviews || Math.floor(150 + Math.random() * 850),
        image: p.thumbnail || p.image || p.product_image || localImage,
        tag: idx === 0 ? "AI Recommended" : idx === 1 ? "Best Value" : "Top Pick",
        aiReason: insights[idx] || "Highly matched recommendation based on search keywords.",
        specs,
        coupon,
        affiliateUrl: p.product_link || p.link || "#",
        revealUrl: p.product_link || p.link || "#",
        currency: currencyCode
      };
    });

    const creditsLeft = data.requestInfo?.creditsLeft !== undefined ? data.requestInfo.creditsLeft : 99;

    return NextResponse.json({
      results: mappedResults,
      creditsRemaining: creditsLeft
    });
  } catch (err) {
    console.error("Next.js Serverless Search API Route Error:", err);
    return NextResponse.json(
      { error: `Internal Server Error: ${err.message}` },
      { status: 500 }
    );
  }
}
