import { redis } from "@/services/redis";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

/**
 * Known Product Categories & Keywords
 */
const CATEGORIES = [
  {
    name: "audio",
    keywords: ["headphone", "headphones", "earphone", "earphones", "earbuds", "airpods", "tws", "neckband", "speaker", "speakers", "soundbar", "buds"]
  },
  {
    name: "laptops",
    keywords: ["laptop", "laptops", "notebook", "macbook", "chromebook", "thinkpad", "vivobook", "zenbook", "ideapad", "loq", "tuf", "legion", "victus", "omen", "predator"]
  },
  {
    name: "phones",
    keywords: ["phone", "phones", "mobile", "mobiles", "smartphone", "smartphones", "iphone", "galaxy", "oneplus", "realme", "redmi", "poco", "iqoo", "pixel"]
  },
  {
    name: "watches",
    keywords: ["watch", "watches", "smartwatch", "smartwatches", "fitness band", "tracker"]
  },
  {
    name: "shoes",
    keywords: ["shoe", "shoes", "sneaker", "sneakers", "boots", "footwear", "running shoes", "loafers", "sandals"]
  },
  {
    name: "appliances",
    keywords: ["washing machine", "refrigerator", "fridge", "microwave", "air conditioner", "ac", "cooler", "purifier", "vacuum"]
  },
  {
    name: "tv",
    keywords: ["tv", "tvs", "television", "smart tv", "oled", "qled", "led tv"]
  },
  {
    name: "apparel",
    keywords: ["shirt", "tshirt", "t-shirt", "jeans", "jacket", "hoodie", "saree", "kurti", "dress", "clothes"]
  }
];

const KNOWN_BRANDS = [
  "apple", "macbook", "samsung", "hp", "dell", "lenovo", "asus", "acer", "msi",
  "oneplus", "xiaomi", "redmi", "realme", "poco", "vivo", "oppo", "motorola", "google", "nothing",
  "sony", "boat", "noise", "boult", "jbl", "sennheiser", "bose", "zebronics",
  "nike", "adidas", "puma", "reebok", "woodland", "bata", "asian", "campus", "sparx",
  "lg", "whirlpool", "panasonic", "haier", "godrej", "daikin", "voltas", "fire-boltt"
];

function detectCategory(text) {
  const lower = String(text || "").toLowerCase();
  for (const cat of CATEGORIES) {
    if (cat.keywords.some(kw => {
      if (kw.length <= 4) {
        return new RegExp(`\\b${kw}\\b`, "i").test(lower);
      }
      return lower.includes(kw);
    })) {
      return cat.name;
    }
  }
  return "general";
}

function detectBrand(text) {
  const lower = String(text || "").toLowerCase();
  for (const b of KNOWN_BRANDS) {
    const regex = new RegExp(`\\b${b}\\b`, "i");
    if (regex.test(lower)) return b;
  }
  return null;
}

function parseBudget(text) {
  const query = String(text || "").toLowerCase();
  const kMatch = query.match(/(?:under|below|less\s+than|within|upto|budget(?:\s+of)?)\s*(?:₹|\$)?\s*(\d+(?:\.\d+)?)\s*k\b/i);
  if (kMatch) return Math.round(parseFloat(kMatch[1]) * 1000);
  const numMatch = query.match(/(?:under|below|less\s+than|within|upto|budget(?:\s+of)?)\s*(?:₹|\$)?\s*(\d{3,7})\b/i);
  if (numMatch) return parseInt(numMatch[1], 10);
  return null;
}

function parseNumericPrice(p) {
  if (typeof p.rawPrice === "number" && p.rawPrice > 0) return p.rawPrice;
  if (typeof p.price === "number" && p.price > 0) return p.price;
  const num = parseFloat(String(p.price || "").replace(/[^0-9.]/g, ""));
  return isNaN(num) ? 0 : num;
}

/**
 * Redis Key for the Central Store Inventory Pool (24-Hour TTL)
 */
function getInventoryPoolKey(country) {
  const cleanCountry = (country || "in").toLowerCase();
  return `cache:inventory:pool:v2:${cleanCountry}`;
}

/**
 * Add freshly fetched products to the Central Store Inventory Pool
 * Keeps a rolling inventory of up to 100 products with 24-hour TTL.
 */
export async function addToInventoryPool(country, products) {
  try {
    if (!Array.isArray(products) || products.length === 0) return;

    const key = getInventoryPoolKey(country);
    const existingStr = await redis.get(key);
    let inventory = [];

    if (existingStr) {
      try {
        inventory = typeof existingStr === "string" ? JSON.parse(existingStr) : existingStr;
        if (!Array.isArray(inventory)) inventory = [];
      } catch (e) {
        inventory = [];
      }
    }

    const seen = new Set();
    const merged = [];

    // Prioritize newest products
    for (const p of products) {
      const id = String(p.product_id || p.id || p.title || "").toLowerCase().trim();
      if (id && !seen.has(id)) {
        seen.add(id);
        merged.push(p);
      }
    }

    // Append existing products
    for (const p of inventory) {
      const id = String(p.product_id || p.id || p.title || "").toLowerCase().trim();
      if (id && !seen.has(id)) {
        seen.add(id);
        merged.push(p);
      }
    }

    const finalInventory = merged.slice(0, 100);
    await redis.set(key, JSON.stringify(finalInventory), { ex: 86400 });
  } catch (err) {
    console.warn("[AI Shopkeeper] Error saving to inventory pool:", err.message);
  }
}

/**
 * Local Smart Shopkeeper Brain: Fast, deterministic human-salesman logic (Sub-5ms, Zero API Dependencies).
 * Runs as the primary engine or automatic fallback when external Gemini API is unreachable.
 */
function evaluateShelfLocally(cleanQuery, inventory) {
  if (!Array.isArray(inventory) || inventory.length < 3) return null;

  const queryCat = detectCategory(cleanQuery);
  const requestedBrand = detectBrand(cleanQuery);
  const maxBudget = parseBudget(cleanQuery);

  // Filter shelf items by category
  const matchingCategoryItems = inventory.filter(p => {
    const titleCat = detectCategory(p.title);
    return queryCat !== "general" ? titleCat === queryCat : true;
  });

  if (matchingCategoryItems.length < 3) {
    // If shelf doesn't have products for this category, honestly report warehouse needed
    return null;
  }

  // If user explicitly demanded a specific brand, shelf MUST have that brand
  if (requestedBrand) {
    const brandItems = matchingCategoryItems.filter(p => {
      const t = String(p.title || "").toLowerCase();
      const s = String(p.store_name || p.store || "").toLowerCase();
      return t.includes(requestedBrand) || s.includes(requestedBrand);
    });
    if (brandItems.length < 3) {
      return null; // Missing demanded brand -> call warehouse
    }
  }

  // Filter by budget if specified (with 10% tolerance buffer)
  let candidates = matchingCategoryItems;
  if (maxBudget) {
    const budgetItems = candidates.filter(p => {
      const price = parseNumericPrice(p);
      return price === 0 || price <= (maxBudget * 1.10);
    });
    if (budgetItems.length >= 3) {
      candidates = budgetItems;
    } else {
      return null; // Budget not satisfiable from current shelf -> call warehouse
    }
  }

  // If explicit brand demanded, restrict candidates to that brand
  if (requestedBrand) {
    candidates = candidates.filter(p => {
      const t = String(p.title || "").toLowerCase();
      return t.includes(requestedBrand);
    });
  }

  if (candidates.length >= 3) {
    // Rank candidates by rating & review count
    candidates.sort((a, b) => {
      const rA = parseFloat(a.rating || "4.2");
      const rB = parseFloat(b.rating || "4.2");
      return rB - rA;
    });

    const topMatches = candidates.slice(0, 3);
    const otherProducts = matchingCategoryItems.filter(p => !topMatches.includes(p));

    return {
      products: [...topMatches, ...otherProducts],
      strategy: "AI_SHOPKEEPER_LOCAL_BRAIN",
      reason: `Fulfilled "${cleanQuery}" with top-rated ${queryCat !== "general" ? queryCat : "products"} from store shelf.`
    };
  }

  return null;
}

/**
 * AI Shopkeeper Brain: Evaluates the store's inventory like an intelligent human salesman.
 * Dual-Engine: First tries Gemini (if valid API key), with instant Local Brain failover.
 */
export async function consultAiShopkeeper(country, userQuery) {
  try {
    const cleanQuery = String(userQuery || "").trim();
    if (!cleanQuery) return null;

    const key = getInventoryPoolKey(country);
    const inventoryStr = await redis.get(key);
    if (!inventoryStr) return null;

    let inventory = [];
    try {
      inventory = typeof inventoryStr === "string" ? JSON.parse(inventoryStr) : inventoryStr;
    } catch (e) {
      return null;
    }

    if (!Array.isArray(inventory) || inventory.length < 3) {
      return null;
    }

    const queryCat = detectCategory(cleanQuery);

    // Strict Category Isolation:
    // If the customer asks for a specific category (e.g., laptops, audio, shoes, etc.),
    // only inspect and return items from that specific category.
    let eligibleInventory = inventory;
    if (queryCat !== "general") {
      eligibleInventory = inventory.filter(p => detectCategory(p.title) === queryCat);
      if (eligibleInventory.length < 3) {
        console.log(`[AI Shopkeeper] Cache MISS: Shelf has fewer than 3 items for category "${queryCat}", routing to warehouse.`);
        return null;
      }
    }

    // Prepare compact summary of the shelf items (only from eligible category)
    const shelfItems = eligibleInventory.slice(0, 30).map((p, idx) => ({
      idx,
      title: String(p.title || "").slice(0, 80),
      price: p.price || p.rawPrice || "N/A",
      store: p.store_name || p.store || "Online Store",
      rating: p.rating || "4.5"
    }));

    const prompt = `You are an experienced, business-smart shopkeeper of an e-commerce retail store.
A customer just entered your shop and asked: "${cleanQuery}"

Here is the current product stock available on your shop's shelves:
${JSON.stringify(shelfItems)}

RETAIL INSTRUCTIONS:
1. BROAD & GENERAL QUERIES: If the customer asks broad/category questions (e.g. "best smartwatch", "top laptop", "good headphones", "fitness watch", "shoes for men") without explicitly demanding a missing brand:
   - ALWAYS enthusiastically fulfill from your shop! Select your 3 highest-rated, best-value products in that category. Never turn away a customer when you have great products in that same category on your shelf!
2. BUDGET & FEATURE QUERIES: If the customer specifies a budget or feature and your shelf has products matching that, fulfill with top 3 matches.
3. HONEST WAREHOUSE CALLS: Only set "available": false if:
   - The customer asks for a completely different product category (e.g. asking for shoes when your shelf only has smartwatches/laptops), OR
   - The customer explicitly demanded a specific brand or model that you do NOT have on your shelf.

Return ONLY valid JSON (no markdown):
{
  "available": boolean,
  "matchedIndices": [number, number, number],
  "reason": "Clear 1-sentence explanation"
}`;

    // 1. Try Ultra-Fast Groq AI (Sub-Second Shopkeeper Evaluation)
    const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
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
              temperature: 0.1,
              response_format: { type: "json_object" }
            }),
            signal: AbortSignal.timeout(4000)
          });

          if (!res.ok) continue;

          const data = await res.json();
          const rawText = data.choices?.[0]?.message?.content;
          if (rawText) {
            let cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
            const firstBrace = cleaned.indexOf("{");
            const lastBrace = cleaned.lastIndexOf("}");
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
              cleaned = cleaned.substring(firstBrace, lastBrace + 1);
            }
            const decision = JSON.parse(cleaned);
            if (decision && decision.available && Array.isArray(decision.matchedIndices) && decision.matchedIndices.length >= 3) {
              const matchedProducts = decision.matchedIndices.map(i => eligibleInventory[i]).filter(Boolean);
              if (matchedProducts.length >= 3) {
                console.log(`[AI Shopkeeper] Cache HIT (Groq): Fulfilled "${cleanQuery}" from shelf! Reason: ${decision.reason}`);
                const otherProducts = eligibleInventory.filter(p => !matchedProducts.includes(p));
                return {
                  products: [...matchedProducts, ...otherProducts],
                  strategy: "AI_SHOPKEEPER_GROQ",
                  reason: decision.reason
                };
              }
            }
            if (decision && !decision.available) {
              console.log(`[AI Shopkeeper] Cache MISS (Groq): "${cleanQuery}" needs warehouse -> ${decision.reason}`);
              return null;
            }
          }
        } catch (groqErr) {}
      }
    }

    // 2. Fallback to OpenRouter AI (100% Free / Reliable)
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
    if (OPENROUTER_API_KEY) {
      const openRouterModels = ["cohere/north-mini-code:free", "liquid/lfm-2.5-2.6b:free", "dots-studio/dots-3-note-preview:free"];
      for (const orModel of openRouterModels) {
        try {
          const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
              "HTTP-Referer": "http://localhost:3000",
              "X-Title": "ShopSmart AI"
            },
            body: JSON.stringify({
              model: orModel,
              messages: [{ role: "user", content: prompt }],
              temperature: 0.1,
              max_tokens: 300
            }),
            signal: AbortSignal.timeout(5000)
          });

          if (!res.ok) continue;

          const data = await res.json();
          const rawText = data.choices?.[0]?.message?.content;
          if (rawText) {
            let cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
            const firstBrace = cleaned.indexOf("{");
            const lastBrace = cleaned.lastIndexOf("}");
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
              cleaned = cleaned.substring(firstBrace, lastBrace + 1);
            }
            const decision = JSON.parse(cleaned);
            if (decision && decision.available && Array.isArray(decision.matchedIndices) && decision.matchedIndices.length >= 3) {
              const matchedProducts = decision.matchedIndices.map(i => eligibleInventory[i]).filter(Boolean);
              if (matchedProducts.length >= 3) {
                console.log(`[AI Shopkeeper] Cache HIT (OpenRouter): Fulfilled "${cleanQuery}" from shelf! Reason: ${decision.reason}`);
                const otherProducts = eligibleInventory.filter(p => !matchedProducts.includes(p));
                return {
                  products: [...matchedProducts, ...otherProducts],
                  strategy: "AI_SHOPKEEPER_OPENROUTER",
                  reason: decision.reason
                };
              }
            }
            if (decision && !decision.available) {
              console.log(`[AI Shopkeeper] Cache MISS (OpenRouter): "${cleanQuery}" needs warehouse -> ${decision.reason}`);
              return null;
            }
          }
        } catch (orErr) {}
      }
    }

    // 2. Fallback to Gemini AI if OpenRouter was unavailable
    if (GEMINI_API_KEY) {
      const models = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-flash-8b"];
      for (const model of models) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
          const res = await fetch(url, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "x-goog-api-key": GEMINI_API_KEY
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.1,
                responseMimeType: "application/json",
                maxOutputTokens: 250
              }
            }),
            signal: AbortSignal.timeout(2000)
          });

          if (!res.ok) continue;

          const data = await res.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            let cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
            const firstBrace = cleaned.indexOf("{");
            const lastBrace = cleaned.lastIndexOf("}");
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
              cleaned = cleaned.substring(firstBrace, lastBrace + 1);
            }
            const decision = JSON.parse(cleaned);
            if (decision && decision.available && Array.isArray(decision.matchedIndices) && decision.matchedIndices.length >= 3) {
              const matchedProducts = decision.matchedIndices.map(i => eligibleInventory[i]).filter(Boolean);
              if (matchedProducts.length >= 3) {
                console.log(`[AI Shopkeeper] Cache HIT (Gemini): Fulfilled "${cleanQuery}" from shelf! Reason: ${decision.reason}`);
                const otherProducts = eligibleInventory.filter(p => !matchedProducts.includes(p));
                return {
                  products: [...matchedProducts, ...otherProducts],
                  strategy: "AI_SHOPKEEPER_GEMINI",
                  reason: decision.reason
                };
              }
            }
            if (decision && !decision.available) {
              console.log(`[AI Shopkeeper] Cache MISS (Gemini): "${cleanQuery}" needs warehouse -> ${decision.reason}`);
              return null;
            }
          }
        } catch (geminiErr) {}
      }
    }

    // 3. High-Performance Local Shopkeeper Brain (Sub-5ms, Zero API failure risk)
    const localDecision = evaluateShelfLocally(cleanQuery, eligibleInventory);
    if (localDecision) {
      console.log(`[AI Shopkeeper] Cache HIT (Local Brain): Fulfilled "${cleanQuery}" from shelf! -> ${localDecision.reason}`);
      return localDecision;
    }

    console.log(`[AI Shopkeeper] Cache MISS: Query "${cleanQuery}" not present on shelf, calling warehouse.`);
    return null;

  } catch (err) {
    console.warn("[AI Shopkeeper] Error during consultation:", err.message);
    return null;
  }
}
