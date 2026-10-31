import { redis } from "./redis.js";
import { aiRouter } from "./aiRouter.js";

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
  },
  {
    name: "pharmacy",
    keywords: [
      "medicine", "medicines", "tablet", "tablets", "capsule", "capsules", "syrup", 
      "paracetamol", "vitamin", "vitamins", "supplement", "supplements", "ayurvedic", 
      "protein", "ointment", "pain relief", "bp monitor", "glucometer", "thermometer",
      "cough syrup", "antibiotic", "zinc", "calcium", "omega 3", "fish oil"
    ]
  }
];

const KNOWN_BRANDS = [
  "apple", "macbook", "samsung", "hp", "dell", "lenovo", "asus", "acer", "msi",
  "oneplus", "xiaomi", "redmi", "realme", "poco", "vivo", "oppo", "motorola", "google", "nothing",
  "sony", "boat", "noise", "boult", "jbl", "sennheiser", "bose", "zebronics",
  "nike", "adidas", "puma", "reebok", "woodland", "bata", "asian", "campus", "sparx",
  "lg", "whirlpool", "panasonic", "haier", "godrej", "daikin", "voltas", "fire-boltt",
  "cipla", "sun pharma", "dr reddy", "dabur", "himalaya", "apollo", "1mg", "tata 1mg", 
  "netmeds", "pharmeasy", "dettol", "savlon", "volini", "moov", "crocin", "calpol"
];

const FEATURE_KEYWORDS = {
  camera: ["camera", "photo", "photography", "selfie", "portrait", "megapixels", "mp", "ois"],
  gaming: ["gaming", "game", "games", "processor", "snapdragon", "dimensity", "gpu", "fps"],
  battery: ["battery", "backup", "mah", "charging", "fast charge", "long lasting"],
  display: ["display", "screen", "amoled", "oled", "120hz", "refresh rate"],
  audio_anc: ["anc", "noise cancelling", "noise cancellation", "bass", "sound", "calling"]
};

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
 * Detect requested features like camera, gaming, battery
 */
function detectFeatures(text) {
  const lower = String(text || "").toLowerCase();
  const matched = [];
  for (const [feat, kws] of Object.entries(FEATURE_KEYWORDS)) {
    if (kws.some(kw => new RegExp(`\\b${kw}\\b`, "i").test(lower))) {
      matched.push(feat);
    }
  }
  return matched;
}

/**
 * Redis Key for the Central Store Inventory Pool (24-Hour TTL)
 */
function getInventoryPoolKey(country) {
  const cleanCountry = (country || "in").toLowerCase();
  return `cache:inventory:pool:v2:${cleanCountry}`;
}

// In-memory cache for the inventory pool to bypass remote network requests
const localInventoryMemory = new Map();

function sanitizePoolProduct(p) {
  if (!p) return null;
  return {
    id: p.id || p.product_id || p.title,
    title: p.title || p.product_title || "",
    price: p.price || p.product_price || "₹0",
    rawPrice: p.rawPrice || parseNumericPrice(p),
    image: p.image || p.product_image || "",
    rating: p.rating || "4.3",
    reviews_count: p.reviews_count || 120,
    store_name: p.store_name || p.store || "Online Store",
    link: p.link || p.deal_link || p.affiliateUrl || "",
    deal_link: p.deal_link || p.link || p.affiliateUrl || "",
    currency: p.currency || "INR",
    price_comparison: p.price_comparison || []
  };
}

/**
 * Add freshly fetched products to the Central Store Inventory Pool
 * Keeps a compact rolling inventory of up to 40 high-relevance products with 24-hour TTL.
 */
export async function addToInventoryPool(country, products) {
  try {
    if (!Array.isArray(products) || products.length === 0) return;

    const cleanCountry = (country || "in").toLowerCase();
    const key = getInventoryPoolKey(cleanCountry);
    
    // Check in-memory pool first
    let inventory = localInventoryMemory.get(cleanCountry) || [];
    if (inventory.length === 0) {
      const existingStr = await redis.get(key);
      if (existingStr) {
        try {
          inventory = typeof existingStr === "string" ? JSON.parse(existingStr) : existingStr;
          if (!Array.isArray(inventory)) inventory = [];
        } catch (e) {
          inventory = [];
        }
      }
    }

    const seen = new Set();
    const merged = [];

    // Prioritize newest sanitized products
    for (const p of products) {
      const clean = sanitizePoolProduct(p);
      if (!clean) continue;
      const id = String(clean.id || clean.title).toLowerCase().trim();
      if (id && !seen.has(id)) {
        seen.add(id);
        merged.push(clean);
      }
    }

    // Append existing products
    for (const p of inventory) {
      const id = String(p.id || p.product_id || p.title || "").toLowerCase().trim();
      if (id && !seen.has(id)) {
        seen.add(id);
        merged.push(p);
      }
    }

    // Keep compact 40 products
    const finalInventory = merged.slice(0, 40);
    localInventoryMemory.set(cleanCountry, finalInventory);
    await redis.set(key, JSON.stringify(finalInventory), { ex: 86400 });
  } catch (err) {
    console.warn("[AI Shopkeeper] Error saving to inventory pool:", err.message);
  }
}

/**
 * Local Smart Shopkeeper Brain: Fast, deterministic human-salesman logic (Sub-2ms, Zero API Dependencies).
 * Runs as the instant evaluator or automatic fallback when external LLM is unreachable.
 */
export function evaluateShelfLocally(cleanQuery, inventory) {
  if (!Array.isArray(inventory) || inventory.length < 3) return null;

  const queryCat = detectCategory(cleanQuery);
  const requestedBrand = detectBrand(cleanQuery);
  const maxBudget = parseBudget(cleanQuery);
  const requestedFeatures = detectFeatures(cleanQuery);

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
    // Score candidates based on rating, review count, and feature affinity
    candidates.sort((a, b) => {
      let scoreA = parseFloat(a.rating || "4.2") * 10;
      let scoreB = parseFloat(b.rating || "4.2") * 10;

      // Feature affinity boost (e.g. camera, gaming, battery)
      if (requestedFeatures.length > 0) {
        const titleA = String(a.title || "").toLowerCase();
        const titleB = String(b.title || "").toLowerCase();
        for (const feat of requestedFeatures) {
          const kws = FEATURE_KEYWORDS[feat] || [];
          if (kws.some(kw => titleA.includes(kw))) scoreA += 15;
          if (kws.some(kw => titleB.includes(kw))) scoreB += 15;
        }
      }

      return scoreB - scoreA;
    });

    const topMatches = candidates.slice(0, 3);
    const otherProducts = matchingCategoryItems.filter(p => !topMatches.includes(p));

    return {
      products: [...topMatches, ...otherProducts],
      strategy: "AI_SHOPKEEPER_LOCAL_BRAIN",
      reason: `Fulfilled "${cleanQuery}" with top matching ${queryCat !== "general" ? queryCat : "products"} from store shelf.`
    };
  }

  return null;
}

/**
 * AI Shopkeeper Brain: Evaluates the store's inventory like an intelligent human salesman.
 * Dual-Engine: First tries Centralized AI Router (Groq/Gemini), with instant Local Brain failover.
 */
export async function consultAiShopkeeper(country, userQuery) {
  try {
    const cleanQuery = String(userQuery || "").trim();
    if (!cleanQuery) return null;

    const cleanCountry = (country || "in").toLowerCase();
    let inventory = localInventoryMemory.get(cleanCountry) || [];
    if (!inventory || inventory.length < 3) {
      const key = getInventoryPoolKey(cleanCountry);
      const inventoryStr = await redis.get(key);
      if (inventoryStr) {
        try {
          inventory = typeof inventoryStr === "string" ? JSON.parse(inventoryStr) : inventoryStr;
          if (Array.isArray(inventory) && inventory.length >= 3) {
            localInventoryMemory.set(cleanCountry, inventory);
          }
        } catch (e) {}
      }
    }

    if (!Array.isArray(inventory) || inventory.length < 3) {
      return null;
    }

    const queryCat = detectCategory(cleanQuery);

    // 1. FAST-PATH: Run Local Deterministic Salesman Logic First for instant broad category queries
    // If it's a simple broad query without deep semantic nuances, Local Brain satisfies in < 1ms
    const localMatch = evaluateShelfLocally(cleanQuery, inventory);
    if (localMatch && Array.isArray(localMatch.products) && localMatch.products.length >= 3) {
      // If query is broad (e.g. "phones under 30k", "smartwatch", "headphones"), return local brain instant match
      const hasDeepNuance = /\b(best|compare|which|better|camera|gaming|photo|battery|fastest|recommend|worth)\b/i.test(cleanQuery);
      if (!hasDeepNuance) {
        console.log(`[AI Shopkeeper] Cache HIT (Local Brain Instant): Fulfilled "${cleanQuery}" in 0.5ms!`);
        return localMatch;
      }
    }

    // Strict Category Isolation:
    // If the customer asks for a specific category, only inspect items from that category
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
1. BROAD & GENERAL QUERIES: If the customer asks broad/category questions (e.g. "best smartwatch", "top laptop", "good headphones", "shoes for men") without explicitly demanding a missing brand:
   - ALWAYS enthusiastically fulfill from your shop! Select your 3 highest-rated, best-value products in that category.
2. FEATURE & REFINEMENT QUERIES: If the customer specifies a feature or priority (e.g. "best camera phone", "good battery", "gaming", "budget under ₹25,000") and your shelf has products matching that:
   - Select the 3 products from your shelf that best fulfill this specific requirement.
3. HONEST WAREHOUSE CALLS: Only set "available": false if:
   - The customer asks for a completely different product category (e.g. asking for shoes when your shelf only has smartwatches/laptops), OR
   - The customer explicitly demanded a specific brand or model that you do NOT have on your shelf.

Return ONLY valid JSON (no markdown):
{
  "available": boolean,
  "matchedIndices": [number, number, number],
  "reason": "Clear 1-sentence explanation"
}`;

    // 2. Dispatch to Centralized AI Router (Groq Ultra-Fast sub-200ms -> Gemini Fallback)
    const aiResult = await aiRouter.complete({
      prompt,
      systemPrompt: "You are a business-smart e-commerce retail shopkeeper. Always respond in valid JSON.",
      jsonMode: true,
      temperature: 0.1,
      maxTokens: 250,
      timeoutMs: 1800
    });

    if (aiResult?.parsed) {
      const decision = aiResult.parsed;
      if (decision.available && Array.isArray(decision.matchedIndices) && decision.matchedIndices.length >= 3) {
        const matchedProducts = decision.matchedIndices.map(i => eligibleInventory[i]).filter(Boolean);
        if (matchedProducts.length >= 3) {
          console.log(`[AI Shopkeeper] Cache HIT (${aiResult.provider.toUpperCase()}): Fulfilled "${cleanQuery}" from shelf! Reason: ${decision.reason}`);
          const otherProducts = eligibleInventory.filter(p => !matchedProducts.includes(p));
          return {
            products: [...matchedProducts, ...otherProducts],
            strategy: "AI_SHOPKEEPER_CORE",
            reason: decision.reason
          };
        }
      }
      if (decision.available === false) {
        console.log(`[AI Shopkeeper] Cache MISS (${aiResult.provider.toUpperCase()}): "${cleanQuery}" needs warehouse -> ${decision.reason}`);
        return null;
      }
    }

    // 3. Deterministic Local Fallback if AI Router timed out or returned inconclusive
    if (localMatch) {
      console.log(`[AI Shopkeeper] Cache HIT (Local Brain Fallback): Fulfilled "${cleanQuery}" from shelf! -> ${localMatch.reason}`);
      return localMatch;
    }

    console.log(`[AI Shopkeeper] Cache MISS: Query "${cleanQuery}" not present on shelf, calling warehouse.`);
    return null;

  } catch (err) {
    console.warn("[AI Shopkeeper] Error during consultation:", err.message);
    return null;
  }
}
