import { NextResponse } from "next/server";

const FALLBACK_PRODUCTS = [
  {
    title: "HP Standard Laptop 15s AMD Ryzen 3 (8GB RAM / 512GB SSD)",
    description: "Ideal budget laptop for daily office productivity, online classes, and casual entertainment.",
    image: "/laptop.jpg",
    rating: "4.4",
    link: "https://www.amazon.in",
    platform: "Amazon"
  },
  {
    title: "Classy Casual Cotton Slim Fit Shirt",
    description: "Breathable cotton fabric with custom tailoring. Perfect for semi-casual wear and social events.",
    image: "/shirt.jpg",
    rating: "4.5",
    link: "https://www.flipkart.com",
    platform: "Flipkart"
  },
  {
    title: "Over-Ear Wireless ANC Headphones Pro",
    description: "Immersive sound signature with custom active noise cancellation and up to 40 hours battery life.",
    image: "/headphones.jpg",
    rating: "4.7",
    link: "https://www.amazon.in",
    platform: "Amazon"
  }
];

/**
 * Extracts and cleans the target merchant product landing page URL (PDP URL).
 * If a direct link isn't available, constructs Google's single product details page to prevent Flipkart E002 errors.
 * @param {object} item - Raw HasData product object.
 * @returns {string} - Direct clean HTTP merchant link.
 */
function getSingleProductPageUrl(item) {
  // 1. If a direct offer / merchant link exists, use it
  const directLink = item.merchantLink || item.merchant_link || item.offerLink || item.offer_link || item.directUrl || item.direct_url || "";
  if (directLink && directLink.startsWith("http") && !directLink.includes("api.hasdata.com")) {
    return directLink;
  }
  // 2. If item has a Google Shopping Product ID, construct Google's single product page URL
  if (item.productId || item.product_id || item.docid) {
    const pid = item.productId || item.product_id || item.docid;
    return `https://www.google.com/shopping/product/${pid}`;
  }
  // 3. Fallback to raw link if valid
  return item.link || item.productLink || item.url || "#";
}

export async function POST(request) {
  console.log("HASDATA_API_KEY present:", !!process.env.HASDATA_API_KEY);

  try {
    const { query, country } = await request.json();
    
    if (!query) {
      return NextResponse.json({ products: FALLBACK_PRODUCTS, error: "Query is required" }, { status: 200 });
    }

    // 1. Sanitize the query keywords (remove currency symbols, extra spacing)
    const cleanQuery = query
      .replace(/[₹$€£]/g, "")
      .replace(/\b(please|find|show|me|best|buy|under|below|for|search|deals|get)\b/gi, "")
      .replace(/\s+/g, " ")
      .trim();

    const hasdataApiKey = process.env.HASDATA_API_KEY;
    if (!hasdataApiKey) {
      console.warn("[Scraper Warning] HASDATA_API_KEY is not configured. Using curated fallbacks.");
      return NextResponse.json({ products: FALLBACK_PRODUCTS, error: "Scraper API key not configured." }, { status: 200 });
    }

    // 2. Fetch live data from HasData targeting Google Shopping
    const gl = (country || "IN").toLowerCase();
    const domain = gl === "us" ? "google.com" : "google.co.in";
    const hasdataUrl = `https://api.hasdata.com/scrape/google/serp?q=${encodeURIComponent(cleanQuery)}&domain=${domain}&gl=${gl}&tbm=shop&apiKey=${hasdataApiKey}`;

    let scraperResponse;
    try {
      scraperResponse = await fetch(hasdataUrl, {
        method: "GET",
        headers: {
          "x-api-key": hasdataApiKey,
          "Content-Type": "application/json"
        }
      });
    } catch (fetchErr) {
      console.error("[Scraper Connection Error] HasData fetch threw:", fetchErr);
      return NextResponse.json(
        { products: FALLBACK_PRODUCTS, error: fetchErr.message || "Scraper connection failed" },
        { status: 200 }
      );
    }

    if (!scraperResponse || !scraperResponse.ok) {
      const errorText = scraperResponse ? await scraperResponse.text() : "No response object";
      console.error("Fetch failed with status:", scraperResponse?.status, errorText);
      return NextResponse.json(
        { products: FALLBACK_PRODUCTS, error: errorText },
        { status: 200 }
      );
    }

    let data;
    try {
      data = await scraperResponse.json();
      console.log("HasData Status:", scraperResponse.status);
    } catch (jsonErr) {
      console.error("[Scraper JSON Parse Error] Failed parsing response:", jsonErr);
      return NextResponse.json(
        { products: FALLBACK_PRODUCTS, error: "Invalid JSON response from Scraper API" },
        { status: 200 }
      );
    }

    // Safely extract results checking for both camelCase and snake_case variations
    const rawResults = data?.shoppingResults || data?.shopping_results || data?.organicResults || [];

    // Slice array immediately to process ONLY the top 5 high-quality products for latency & focus
    const top5Items = rawResults
      .filter(item => item && (item.title || item.name))
      .slice(0, 5);

    if (top5Items.length === 0) {
      console.warn(`[Scraper Warning] Empty results array received for query: "${cleanQuery}"`);
    }

    // 3. Map into clean array containing strictly the exact 6 fields with try-catch mapping checks
    const cleanProducts = [];
    for (const item of top5Items) {
      if (!item) continue;
      try {
        const title = item.title || item.name || "";
        const image = item.thumbnail || item.image || item.imageUrl || item.serpapi_thumbnail || "";
        const platform = item.source || item.merchant || item.seller || "Online Store";

        // Call our safe resolved destination link
        const directLink = getSingleProductPageUrl(item);

        // Skip if title or resolved link is missing
        if (!title || !directLink) {
          continue;
        }

        // Generate a clean 2-line AI description summary instead of delivery text
        const cleanTitle = title.split(" ").slice(0, 6).join(" ");
        const fallbackDesc = `${cleanTitle} is a top choice on ${platform} with a ${item.rating || "4.5"}/5 customer rating, matching your search parameters perfectly.`;
        const description = item.snippet || item.description || fallbackDesc;

        cleanProducts.push({
          title: String(title),
          description: String(description),
          image: String(image),
          rating: String(item.rating || item.stars || "4.5"),
          link: String(directLink),
          platform: String(platform)
        });
      } catch (mapErr) {
        console.error("Mapping Error:", mapErr);
      }
    }

    // Call Gemini AI on the top 5 curated products to generate custom insights (if API key is present)
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (geminiApiKey && cleanProducts.length > 0) {
      try {
        const productsListText = cleanProducts.map((p, idx) => {
          return `${idx + 1}. Title: ${p.title} | Store: ${p.platform}`;
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
                parts: [{ text: prompt }]
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
          const parsedInsights = JSON.parse(rawText);
          if (Array.isArray(parsedInsights)) {
            cleanProducts.forEach((p, idx) => {
              if (parsedInsights[idx]) {
                p.description = String(parsedInsights[idx]);
              }
            });
          }
        }
      } catch (geminiError) {
        console.error("Gemini AI API call failed:", geminiError);
      }
    }

    // Round-robin re-sorting to ensure merchant diversity at the top
    const sortedProducts = [];
    const merchantGroups = {};
    for (const p of cleanProducts) {
      const key = (p.platform || "Online Store").toLowerCase();
      if (!merchantGroups[key]) {
        merchantGroups[key] = [];
      }
      merchantGroups[key].push(p);
    }
    const merchantKeys = Object.keys(merchantGroups);
    if (merchantKeys.length > 0) {
      const maxItemsInGroup = Math.max(...merchantKeys.map(k => merchantGroups[k].length));
      for (let step = 0; step < maxItemsInGroup; step++) {
        for (const key of merchantKeys) {
          if (merchantGroups[key][step]) {
            sortedProducts.push(merchantGroups[key][step]);
          }
        }
      }
    }
    const finalProducts = sortedProducts.length > 0 ? sortedProducts : cleanProducts;

    // Fallback logic if results array is empty
    if (finalProducts.length === 0) {
      console.warn(`[API Fallback] Returning curated fallback list for query: "${cleanQuery}"`);
      const queryLower = cleanQuery.toLowerCase();
      if (queryLower.includes("laptop") || queryLower.includes("computer") || queryLower.includes("coding")) {
        return NextResponse.json({ products: [FALLBACK_PRODUCTS[0]] }, { status: 200 });
      } else if (queryLower.includes("shirt") || queryLower.includes("cotton") || queryLower.includes("wear")) {
        return NextResponse.json({ products: [FALLBACK_PRODUCTS[1]] }, { status: 200 });
      } else if (queryLower.includes("headphone") || queryLower.includes("audio") || queryLower.includes("anc")) {
        return NextResponse.json({ products: [FALLBACK_PRODUCTS[2]] }, { status: 200 });
      }
      return NextResponse.json({ products: FALLBACK_PRODUCTS }, { status: 200 });
    }

    // Return clean JSON response (top 5 products only)
    return NextResponse.json({ products: finalProducts.slice(0, 5) }, { status: 200 });

  } catch (err) {
    console.error("Serverless Search API Route error:", err);
    return NextResponse.json(
      { products: FALLBACK_PRODUCTS, error: `Server Error: ${err.message}` },
      { status: 200 }
    );
  }
}
