/**
 * Enterprise AI Product Curator
 * Uses Groq LLM to intelligently analyze user search intent, filter out spam/accessory spoof listings
 * (e.g. ₹29 laptop skins or dummy parts), rank the top 6-8 authentic products for smart filter chips,
 * and select the top 3 hero products for upfront screen presentation.
 */

function parsePriceNum(val) {
  if (typeof val === "number" && !isNaN(val)) return Math.round(val);
  if (!val) return 0;
  const str = String(val).replace(/[^0-9.]/g, "");
  const n = parseFloat(str);
  return !isNaN(n) ? Math.round(n) : 0;
}

import { aiRouter } from "./aiRouter.js";

function getMinDevicePrice(country = "IN") {
  const c = String(country || "IN").toUpperCase();
  switch (c) {
    case "US": return 60; // $60 USD
    case "GB": return 50; // £50 GBP
    case "CA": return 80; // C$80 CAD
    case "AU": return 90; // A$90 AUD
    case "AE": return 200; // 200 AED (~$54)
    case "IN":
    default: return 5000; // ₹5,000 INR
  }
}

/**
 * Fast Heuristic Fallback in case AI is unreachable
 */
function heuristicFallback(query, products, country = "IN") {
  const qLower = String(query || "").toLowerCase();
  const minPriceThreshold = getMinDevicePrice(country);
  
  const isHighValueDevice = /\b(laptop|notebook|macbook|pc|desktop|phone|mobile|smartphone|iphone|galaxy|tablet|ipad|tv|television|refrigerator|fridge|washing\s*machine|ac|air\s*conditioner)\b/i.test(qLower);
  const isAccessorySearch = /\b(skin|sticker|cover|case|tempered|guard|charger|cable|adapter|pouch|sleeve|stand|battery|remote|filter)\b/i.test(qLower);

  return products.filter(p => {
    const title = (p.product_title || p.title || "").toLowerCase();
    const price = parsePriceNum(p.product_price || p.price || p.rawPrice);

    // If searching for a main device (not accessory), drop items that are ridiculously cheap
    if (isHighValueDevice && !isAccessorySearch) {
      if (price > 0 && price < minPriceThreshold) {
        console.warn(`[AI Product Curator: Heuristic] Discarded low-price spoof item '${title.slice(0, 40)}' (${price} < ${minPriceThreshold})`);
        return false;
      }
    }
    return true;
  });
}

/**
 * Curate and validate raw search products using Groq AI
 */
export async function curateProductsWithAi(query, products = [], country = "IN") {
  if (!Array.isArray(products) || products.length <= 1) {
    return products;
  }

  const cleanQuery = String(query || "").trim();
  if (!cleanQuery) return products;

  // Prepare a compact candidate list to minimize token size and keep latency < 350ms
  const candidates = products.map((p, idx) => ({
    i: idx,
    t: (p.product_title || p.title || "").slice(0, 100),
    p: parsePriceNum(p.product_price || p.price || p.rawPrice),
    s: p.store_name || p.store || "Online"
  }));

  const prompt = `You are ShopSmart AI Product Quality & Curation Specialist.
User search query: "${cleanQuery}" (Country: ${country})

Candidate products extracted from search engines:
${JSON.stringify(candidates)}

TASK:
1. Determine what the user actually wants to buy (e.g. a whole laptop, a phone, a shirt, an accessory, or a shoe).
2. REMOVE spam, fake listings, accessories (e.g. skins, stickers, pouches, parts) IF the user searched for the actual main device and NOT the accessory.
3. REMOVE products with impossible prices (e.g. ₹29 or ₹199 for a laptop or phone is 100% spam/accessory).
4. KEEP between 4 and 8 of the best, most authentic matching products so that category filter chips remain functional.
5. Identify the top 3 best distinct matches for upfront hero display.

Respond ONLY with valid JSON:
{
  "validIndices": [0, 2, 3, 5],
  "top3Indices": [0, 2, 3],
  "reason": "Brief reason for discarded items"
}`;

  try {
    const aiResult = await aiRouter.complete({
      prompt,
      systemPrompt: "You are ShopSmart AI Product Quality & Curation Specialist. Always respond in valid JSON.",
      jsonMode: true,
      temperature: 0.1,
      maxTokens: 300,
      timeoutMs: 1800
    });

    const parsed = aiResult?.parsed;
    if (parsed) {
      const validSet = new Set(Array.isArray(parsed.validIndices) ? parsed.validIndices : []);
      const top3List = Array.isArray(parsed.top3Indices) ? parsed.top3Indices : [];

      if (validSet.size > 0) {
        console.log(`[AI Product Curator] Curated ${validSet.size}/${products.length} products. Reason: ${parsed.reason || "Cleaned spam/accessories"}`);

        // Extract valid products
        const validProducts = [];
        const topPicks = [];
        const remaining = [];

        products.forEach((p, idx) => {
          if (validSet.has(idx)) {
            if (top3List.includes(idx)) {
              topPicks.push(p);
            } else {
              remaining.push(p);
            }
          }
        });

        // Combine: top 3 first, then remaining candidates
        const finalCurated = [...topPicks, ...remaining];
        return finalCurated.length > 0 ? finalCurated : heuristicFallback(cleanQuery, products, country);
      }
    }
  } catch (err) {
    console.warn("[AI Product Curator] Groq timeout/error, using resilient heuristic fallback:", err.message);
  }

  return heuristicFallback(cleanQuery, products, country);
}
