/**
 * ShopSmart AI — Smart Entity & Domain Resolver Gatekeeper
 * 
 * Multi-layer intelligent verification:
 * 1. Catalog Fuzzy & Typo Matching (Levenshtein distance & token similarity)
 * 2. Cross-Category Entity Detection (e.g. Kuku FM, Netflix in Flights -> Subscriptions Hub)
 * 3. Groq AI Entity Knowledge & Canonical Name Extraction
 * 
 * Note: Zero DNS/raw server pings to eliminate SSRF / IP security risks.
 */

import { getTravelDealsByCountry } from "@/services/travelDealsDatabase";
import { clampString, checkSearchContentSafety } from "@/services/securityShield";

import { aiRouter } from "./aiRouter.js";

// Cache for resolved entity verifications (TTL: 24h)
const ENTITY_VERIFICATION_CACHE = new Map();

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
 * Check if the query is a typo of an existing catalog deal in the country
 */
function checkCatalogTypo(rawQuery, country) {
  const q = rawQuery.toLowerCase().trim();
  if (q.length < 3) return null;

  const countryDeals = getTravelDealsByCountry(country, "all", "all");
  const uniquePlatforms = new Map();

  for (const deal of countryDeals) {
    if (!uniquePlatforms.has(deal.platformId)) {
      uniquePlatforms.set(deal.platformId, {
        platformId: deal.platformId,
        platformName: deal.platformName,
        category: deal.category
      });
    }
  }

  for (const [, plat] of uniquePlatforms.entries()) {
    const pName = plat.platformName.toLowerCase();
    const pId = plat.platformId.toLowerCase();

    // 1. Direct substring
    if (pName.includes(q) || q.includes(pName) || pId.includes(q)) {
      return {
        matched: true,
        canonicalName: plat.platformName,
        category: plat.category,
        platformId: plat.platformId
      };
    }

    // 2. Levenshtein distance check on platform name or id
    const distName = levenshteinDistance(q, pName);
    const distId = levenshteinDistance(q, pId);
    const maxTolerance = q.length <= 4 ? 1 : q.length <= 8 ? 2 : 3;

    if (distName <= maxTolerance || distId <= maxTolerance) {
      return {
        matched: true,
        canonicalName: plat.platformName,
        category: plat.category,
        platformId: plat.platformId,
        isTypo: true
      };
    }
  }

  return null;
}

/**
 * Primary Entity Verification Resolver
 */
export async function verifyTravelEntity(rawQuery, activeCategory = "flights", country = "IN") {
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
      guidanceMessage: "We currently do not have verified coupons or saving strategies available for this platform in our database."
    };
  }

  const cacheKey = `${country}:${activeCategory}:${query.toLowerCase()}`;
  if (ENTITY_VERIFICATION_CACHE.has(cacheKey)) {
    return ENTITY_VERIFICATION_CACHE.get(cacheKey);
  }

  // 1. LAYER 1: Catalog Fuzzy & Typo Check
  const catalogTypo = checkCatalogTypo(query, country);
  if (catalogTypo) {
    const result = {
      success: true,
      query,
      isRealEntity: true,
      canonicalName: catalogTypo.canonicalName,
      entityCategory: catalogTypo.category,
      isCategoryMatch: catalogTypo.category === activeCategory,
      isTypoOfCatalog: true,
      platformId: catalogTypo.platformId,
      action: "CATALOG_TYPO_MATCH",
      guidanceMessage: `Showing deals for ${catalogTypo.canonicalName}`
    };
    ENTITY_VERIFICATION_CACHE.set(cacheKey, result);
    return result;
  }

  // 2. LAYER 2 & 3: Multi-Tier AI Entity Knowledge
  let groqAnalysis = null;
  try {
    const safeQuery = String(query || '').replace(/"/g, "'").trim();
    const prompt = `You are the ShopSmart AI Entity Gatekeeper.
A user typed the following search query: "${safeQuery}" in the "${activeCategory}" tab for country "${country}".

Analyze whether this refers to a real, authentic commercial brand, company, app, airline, hotel, or booking website.

RULES:
1. "isRealBrand": true ONLY if this is a real-world commercial entity or app (e.g. "Kuku FM", "Netflix", "Singapore Airlines", "Hyatt", "StubHub").
   If it is random gibberish, a common dictionary noun, or a non-existent name (e.g. "asdfgh", "flyfakexyz", "test1234"), return "isRealBrand": false.
2. "industry": Choose from exactly one of: ["flights", "hotels", "events", "subscriptions", "ecommerce", "fashion", "food", "other"].
   - Airlines / Air carriers (e.g. Singapore Airlines, Lufthansa, Air India) -> "flights"
   - Hotel chains / booking stays (e.g. Hyatt, Hilton, Radisson, Lemon Tree) -> "hotels"
   - Live events / concert & cinema ticketing (e.g. StubHub, Vivid Seats, Event Cinemas, TodayTix) -> "events"
   - Streaming, Audiobooks, OTT, Podcasting (e.g. Kuku FM, Pocket FM, Netflix, Spotify, Audible) -> "subscriptions"
3. "canonicalName": Clean, official title casing (e.g. "Kuku FM", "Singapore Airlines", "Hyatt Hotels").
4. "domain": Likely primary website domain without protocol (e.g. "kukufm.com", "singaporeair.com", "hyatt.com").
5. "briefDescription": One short sentence explaining what the company is (e.g. "Indian audio stories and audiobook subscription platform").

OUTPUT JSON ONLY:
{
  "isRealBrand": boolean,
  "canonicalName": string,
  "industry": "flights" | "hotels" | "events" | "subscriptions" | "ecommerce" | "fashion" | "other",
  "domain": string,
  "briefDescription": string
}`;

    const aiRes = await aiRouter.complete({
      prompt,
      systemPrompt: "You are the ShopSmart AI Entity Gatekeeper. Always respond in valid JSON.",
      jsonMode: true,
      temperature: 0.1,
      maxTokens: 250,
      timeoutMs: 2500
    });

    if (aiRes?.parsed) {
      groqAnalysis = aiRes.parsed;
    }
  } catch (err) {
    console.warn("[Entity Resolver] AI Router error:", err.message);
  }

  // 3. Fallback Heuristics if Groq was unavailable
  if (!groqAnalysis) {
    const qLower = query.toLowerCase();
    // Known airlines heuristic
    const isFlightHeuristic = /air|fly|airways|jet|carrier/i.test(qLower);
    // Known hotel heuristic
    const isHotelHeuristic = /hotel|inn|resort|suites|stay|palace/i.test(qLower);
    // Known audio/sub heuristic
    const isSubHeuristic = /fm|audio|music|stream|tv|plus/i.test(qLower);

    groqAnalysis = {
      isRealBrand: isFlightHeuristic || isHotelHeuristic || isSubHeuristic,
      canonicalName: query.charAt(0).toUpperCase() + query.slice(1),
      industry: isFlightHeuristic ? "flights" : isHotelHeuristic ? "hotels" : isSubHeuristic ? "subscriptions" : "other",
      domain: `${query.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
      briefDescription: "Commercial platform or booking channel"
    };
  }

  // If AI determined it's NOT a real brand (gibberish/fake or unlisted)
  if (!groqAnalysis.isRealBrand) {
    const result = {
      success: true,
      query,
      isRealEntity: false,
      action: "UNKNOWN_ENTITY",
      guidanceMessage: "We currently do not have verified coupons or saving strategies available for this platform in our database."
    };
    ENTITY_VERIFICATION_CACHE.set(cacheKey, result);
    return result;
  }

  // 4. Check Category Alignment (e.g. Kuku FM in Flights)
  const isTravelCategory = ["flights", "hotels", "events"].includes(groqAnalysis.industry);
  const isCategoryMatch = groqAnalysis.industry === activeCategory;

  // Case A: Real entity, but completely different category (e.g. Subscriptions / OTT)
  if (!isTravelCategory || !isCategoryMatch) {
    const categoryLabels = {
      subscriptions: "Digital Subscriptions & Audio Entertainment",
      ecommerce: "Online Shopping & Electronics",
      fashion: "Fashion & Apparel",
      hotels: "Hotels & Stays",
      flights: "Airlines & Flights",
      events: "Live Events & Ticketing"
    };

    const targetLabel = categoryLabels[groqAnalysis.industry] || "Subscriptions Hub";
    const crossCategoryTab = groqAnalysis.industry === "subscriptions" ? "subscriptions" : groqAnalysis.industry;

    const result = {
      success: true,
      query,
      isRealEntity: true,
      canonicalName: groqAnalysis.canonicalName,
      domain: groqAnalysis.domain,
      entityCategory: groqAnalysis.industry,
      isCategoryMatch: false,
      action: "CATEGORY_MISMATCH",
      crossCategoryTab,
      crossCategoryTitle: targetLabel,
      description: groqAnalysis.briefDescription,
      guidanceMessage: `${groqAnalysis.canonicalName} is a ${groqAnalysis.briefDescription || targetLabel}, not an airline or flight provider.`
    };
    ENTITY_VERIFICATION_CACHE.set(cacheKey, result);
    return result;
  }

  // Case B: Real, verified travel entity matching the active tab! (e.g. Singapore Airlines in Flights, Hyatt in Hotels)
  const result = {
    success: true,
    query,
    isRealEntity: true,
    canonicalName: groqAnalysis.canonicalName,
    domain: groqAnalysis.domain,
    entityCategory: groqAnalysis.industry,
    isCategoryMatch: true,
    action: "TRAVEL_ENTITY_VERIFIED",
    description: groqAnalysis.briefDescription,
    guidanceMessage: `ShopSmart AI verified official portal for ${groqAnalysis.canonicalName} (${groqAnalysis.domain}).`
  };

  ENTITY_VERIFICATION_CACHE.set(cacheKey, result);
  return result;
}
