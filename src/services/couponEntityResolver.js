/**
 * ShopSmart AI — Smart Store & Merchant Entity Gatekeeper
 * 
 * Multi-layer intelligent verification for E-Commerce & Retail Stores:
 * 1. Catalog Fuzzy & Typo Matching against MASTER_COUPON_DATABASE
 * 2. Cross-Category Entity Detection (e.g. IndiGo/Netflix in Coupons -> Travel/Subscriptions Hub)
 * 3. Groq AI Commercial Store Knowledge & Canonical Extraction
 * 
 * Note: Zero DNS/raw server pings to eliminate SSRF / IP security risks.
 */

import { MASTER_COUPON_DATABASE, matchStoreKey } from "./couponDatabase.js";
import { clampString, checkSearchContentSafety } from "./securityShield.js";
import { aiRouter } from "./aiRouter.js";

const STORE_CACHE = new Map();

/**
 * Fast Levenshtein distance calculator
 */
function levenshteinDistance(s1, s2) {
  const a = s1.toLowerCase();
  const b = s2.toLowerCase();
  const costs = [];
  for (let i = 0; i <= a.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= b.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (a.charAt(i - 1) !== b.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[b.length] = lastValue;
  }
  return costs[b.length];
}

/**
 * Check if the query is a typo of an existing master coupon store
 */
export function checkMasterStoreTypo(rawQuery) {
  const q = rawQuery.toLowerCase().trim();
  if (q.length < 3) return null;

  for (const [key, store] of Object.entries(MASTER_COUPON_DATABASE)) {
    const sName = store.name.toLowerCase();
    const sKey = key.toLowerCase();

    // Direct match
    if (sName === q || sKey === q) {
      return {
        matched: true,
        canonicalName: store.name,
        storeKey: key,
        isTypo: false
      };
    }

    // Levenshtein typo check
    const distName = levenshteinDistance(q, sName);
    const distKey = levenshteinDistance(q, sKey);
    const maxTolerance = q.length <= 4 ? 1 : q.length <= 8 ? 2 : 3;

    if (distName <= maxTolerance || distKey <= maxTolerance) {
      return {
        matched: true,
        canonicalName: store.name,
        storeKey: key,
        isTypo: true
      };
    }
  }

  return null;
}

/**
 * Primary Store Entity Gatekeeper Resolver
 */
export async function verifyStoreEntity(rawQuery, country = "IN") {
  const query = clampString((rawQuery || "").trim(), 60);
  if (!query || query.length < 2) {
    return {
      success: false,
      action: "TOO_SHORT",
      guidanceMessage: "Query is too short"
    };
  }

  // Content safety check (blocks illicit/hazardous patterns)
  const safetyCheck = checkSearchContentSafety(query);
  if (!safetyCheck.safe) {
    return {
      success: true,
      query,
      isRealEntity: false,
      action: "UNKNOWN_ENTITY",
      guidanceMessage: "We currently do not have verified coupons or saving strategies available for this store in our database."
    };
  }

  const cacheKey = `${country}:store:${query.toLowerCase()}`;
  if (STORE_CACHE.has(cacheKey)) {
    return STORE_CACHE.get(cacheKey);
  }

  // 1. LAYER 1: Catalog Fuzzy & Typo Check against Master Database
  const typoMatch = checkMasterStoreTypo(query);
  if (typoMatch) {
    const result = {
      success: true,
      query,
      isRealEntity: true,
      canonicalName: typoMatch.canonicalName,
      storeKey: typoMatch.storeKey,
      isTypoOfCatalog: typoMatch.isTypo,
      action: typoMatch.isTypo ? "CATALOG_TYPO_MATCH" : "CATALOG_EXACT_MATCH",
      guidanceMessage: `Showing coupons for ${typoMatch.canonicalName}`
    };
    STORE_CACHE.set(cacheKey, result);
    return result;
  }

  // 2. LAYER 2 & 3: Multi-Tier AI Entity Knowledge & Categorization
  let groqAnalysis = null;
  try {
    const prompt = `You are the ShopSmart AI E-Commerce & Retail Store Gatekeeper.
A user searched for: "${query}" in the Coupons & Store Deals section for country "${country}".

Analyze whether this refers to a real, authentic commercial e-commerce store, retail brand, food delivery app, fashion brand, electronics store, or beauty shop (e.g. "The Souled Store", "Snitch", "Boat", "Lenskart", "Mamaearth", "Nykaa", "Zara", "IKEA", "Decathlon", "Croma", "Sephora", "Lululemon").

RULES:
1. "isRealBrand": true ONLY if this is a real-world commercial e-commerce company, retail merchant, or online shopping store.
   If it is random gibberish, a dictionary noun without brand context, or non-existent (e.g. "asdfgh", "fakestore123", "superxyzcoupon"), return "isRealBrand": false.
2. "industry": Choose from exactly one of: ["ecommerce", "fashion", "food", "electronics", "beauty", "travel", "subscriptions", "other"].
   - Airlines / Hotels -> "travel"
   - OTT / Music / Streaming -> "subscriptions"
3. "canonicalName": Clean, official title casing (e.g. "The Souled Store", "Snitch", "boAt Lifestyle").
4. "domain": Likely primary website domain without protocol (e.g. "thesouledstore.com", "snitch.co.in", "boat-lifestyle.com").
5. "briefDescription": One short sentence explaining what the store sells.

OUTPUT JSON ONLY:
{
  "isRealBrand": boolean,
  "canonicalName": string,
  "industry": "ecommerce" | "fashion" | "food" | "electronics" | "beauty" | "travel" | "subscriptions" | "other",
  "domain": string,
  "briefDescription": string
}`;

    const aiRes = await aiRouter.complete({
      prompt,
      systemPrompt: "You are the ShopSmart AI E-Commerce & Retail Store Gatekeeper. Always respond in valid JSON.",
      jsonMode: true,
      temperature: 0.1,
      maxTokens: 250,
      timeoutMs: 2500
    });

    if (aiRes?.parsed) {
      groqAnalysis = aiRes.parsed;
    }
  } catch (err) {
    console.warn("[Store Gatekeeper] AI Router analysis error:", err.message);
  }

  // 3. Fallback Heuristics if Groq was unavailable
  if (!groqAnalysis) {
    const qLower = query.toLowerCase();
    const isRetailHeuristic = /store|shop|mart|wear|cloth|jewel|kart|buy|deal/i.test(qLower);
    const isTravelHeuristic = /air|flight|hotel|stay|resort/i.test(qLower);
    const isSubHeuristic = /tv|stream|play|plus|music|fm/i.test(qLower);

    groqAnalysis = {
      isRealBrand: isRetailHeuristic,
      canonicalName: query.charAt(0).toUpperCase() + query.slice(1),
      industry: isTravelHeuristic ? "travel" : (isSubHeuristic ? "subscriptions" : (isRetailHeuristic ? "ecommerce" : "other")),
      domain: `${query.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
      briefDescription: "Online shopping store or merchant"
    };
  }

  // If AI determined it's NOT a real brand (gibberish/fake)
  if (!groqAnalysis.isRealBrand) {
    const result = {
      success: true,
      query,
      isRealEntity: false,
      action: "UNKNOWN_ENTITY",
      guidanceMessage: "We currently do not have verified coupons or saving strategies available for this store in our database."
    };
    STORE_CACHE.set(cacheKey, result);
    return result;
  }

  // Cross-category check
  if (groqAnalysis.industry === "travel") {
    const result = {
      success: true,
      query,
      isRealEntity: true,
      canonicalName: groqAnalysis.canonicalName,
      domain: groqAnalysis.domain,
      entityCategory: "travel",
      isCategoryMatch: false,
      action: "CATEGORY_MISMATCH",
      crossCategoryTab: "travel",
      crossCategoryTitle: "Travel & Stays Hub",
      description: groqAnalysis.briefDescription,
      guidanceMessage: `${groqAnalysis.canonicalName} is an airline or travel booking channel. Explore verified deals in our Travel Hub!`
    };
    STORE_CACHE.set(cacheKey, result);
    return result;
  }

  if (groqAnalysis.industry === "subscriptions") {
    const result = {
      success: true,
      query,
      isRealEntity: true,
      canonicalName: groqAnalysis.canonicalName,
      domain: groqAnalysis.domain,
      entityCategory: "subscriptions",
      isCategoryMatch: false,
      action: "CATEGORY_MISMATCH",
      crossCategoryTab: "subscriptions",
      crossCategoryTitle: "Digital Subscriptions & OTT Hub",
      description: groqAnalysis.briefDescription,
      guidanceMessage: `${groqAnalysis.canonicalName} is a streaming subscription. Explore 4-Level Savings Blueprints in Subscriptions Hub!`
    };
    STORE_CACHE.set(cacheKey, result);
    return result;
  }

  // Verified Commercial Store!
  const result = {
    success: true,
    query,
    isRealEntity: true,
    canonicalName: groqAnalysis.canonicalName,
    domain: groqAnalysis.domain,
    entityCategory: groqAnalysis.industry || "ecommerce",
    isCategoryMatch: true,
    action: "STORE_ENTITY_VERIFIED",
    description: groqAnalysis.briefDescription,
    guidanceMessage: `ShopSmart AI verified official portal for ${groqAnalysis.canonicalName} (${groqAnalysis.domain}).`
  };

  STORE_CACHE.set(cacheKey, result);
  return result;
}
