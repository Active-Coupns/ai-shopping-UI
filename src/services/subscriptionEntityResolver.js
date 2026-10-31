/**
 * ShopSmart AI — Smart Subscription & OTT Entity Gatekeeper
 * 
 * Multi-layer intelligent verification:
 * 1. Catalog Fuzzy & Typo Matching against getSubscriptionsCatalog(country)
 * 2. Cross-Category Detection (e.g., IndiGo/Marriott in Subscriptions -> Travel Hub)
 * 3. Groq AI Entity Knowledge & Canonical Name Extraction
 * 
 * Note: Zero DNS/raw server pings to eliminate SSRF / IP security risks.
 */

import { getSubscriptionsCatalog } from "@/data/subscriptionsRegistry";
import { clampString, checkSearchContentSafety } from "@/services/securityShield";

import { aiRouter } from "./aiRouter.js";
const ENTITY_CACHE = new Map();

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
 * Check if the query is a typo of an existing catalog subscription in the country
 */
function checkCatalogTypo(rawQuery, country = "IN") {
  const q = rawQuery.toLowerCase().trim();
  if (q.length < 3) return null;

  const catalog = getSubscriptionsCatalog(country);

  for (const sub of catalog) {
    const subName = sub.name.toLowerCase();
    const subId = sub.id.toLowerCase();

    // 1. Direct substring
    if (subName.includes(q) || q.includes(subName) || subId.includes(q)) {
      return {
        matched: true,
        canonicalName: sub.name,
        category: sub.category,
        subId: sub.id
      };
    }

    // 2. Levenshtein distance check
    const distName = levenshteinDistance(q, subName);
    const distId = levenshteinDistance(q, subId);
    const maxTolerance = q.length <= 4 ? 1 : q.length <= 8 ? 2 : 3;

    if (distName <= maxTolerance || distId <= maxTolerance) {
      return {
        matched: true,
        canonicalName: sub.name,
        category: sub.category,
        subId: sub.id,
        isTypo: true
      };
    }
  }

  return null;
}

/**
 * Primary Subscription Entity Verification Resolver
 */
export async function verifySubscriptionEntity(rawQuery, country = "IN") {
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
      guidanceMessage: "We currently do not have verified subscriptions or saving blueprints available for this platform in our database."
    };
  }

  const cacheKey = `${country}:sub:${query.toLowerCase()}`;
  if (ENTITY_CACHE.has(cacheKey)) {
    return ENTITY_CACHE.get(cacheKey);
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
      isTypoOfCatalog: true,
      subId: catalogTypo.subId,
      action: "CATALOG_TYPO_MATCH",
      guidanceMessage: `Showing plans for ${catalogTypo.canonicalName}`
    };
    ENTITY_CACHE.set(cacheKey, result);
    return result;
  }

  // 2. LAYER 2 & 3: Multi-Tier AI Entity Knowledge
  let groqAnalysis = null;
  try {
    const prompt = `You are the ShopSmart AI Subscription Entity Gatekeeper.
A user searched for: "${query}" in the Subscriptions & OTT section for country "${country}".

Analyze whether this refers to a real, authentic commercial digital subscription, OTT streaming app, music/audio platform, cloud storage, fitness subscription, or digital pass.

RULES:
1. "isRealBrand": true if this is a real-world commercial brand, company, app, airline, hotel, or subscription service (e.g. "MUBI", "Hayu", "IndiGo", "Netflix", "Zomato").
   If it is random gibberish, a common dictionary word, or non-existent (e.g. "asdfgh", "flyfakexyz", "fakestream99"), return "isRealBrand": false.
2. "industry": Choose from exactly one of: ["subscriptions", "flights", "hotels", "events", "ecommerce", "fashion", "other"].
3. "canonicalName": Clean, official title casing (e.g. "Lionsgate Play", "MUBI").
4. "domain": Likely primary website domain without protocol (e.g. "lionsgateplay.com", "mubi.com").
5. "briefDescription": One short sentence explaining what it is.

OUTPUT JSON ONLY:
{
  "isRealBrand": boolean,
  "canonicalName": string,
  "industry": "subscriptions" | "flights" | "hotels" | "events" | "ecommerce" | "fashion" | "other",
  "domain": string,
  "briefDescription": string
}`;

    const aiRes = await aiRouter.complete({
      prompt,
      systemPrompt: "You are the ShopSmart AI Subscription Entity Gatekeeper. Always respond in valid JSON.",
      jsonMode: true,
      temperature: 0.1,
      maxTokens: 250,
      timeoutMs: 2500
    });

    if (aiRes?.parsed) {
      groqAnalysis = aiRes.parsed;
    }
  } catch (err) {
    console.warn("[Subscription Resolver] AI Router error:", err.message);
  }

  // 3. Fallback Heuristics if Groq was unavailable
  if (!groqAnalysis) {
    const qLower = query.toLowerCase();
    const isSubHeuristic = /tv|stream|play|plus|max|music|audio|fm|cloud|pass|fit/i.test(qLower);
    const isTravelHeuristic = /air|flight|hotel|stay|resort|ticket/i.test(qLower);

    groqAnalysis = {
      isRealBrand: isSubHeuristic,
      canonicalName: query.charAt(0).toUpperCase() + query.slice(1),
      industry: isTravelHeuristic ? "flights" : (isSubHeuristic ? "subscriptions" : "other"),
      domain: `${query.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
      briefDescription: "Digital subscription or streaming service"
    };
  }

  // If AI determined it's NOT a real brand (gibberish/fake)
  if (!groqAnalysis.isRealBrand) {
    const result = {
      success: true,
      query,
      isRealEntity: false,
      action: "UNKNOWN_ENTITY",
      guidanceMessage: "We currently do not have verified subscriptions or saving blueprints available for this platform in our database."
    };
    ENTITY_CACHE.set(cacheKey, result);
    return result;
  }

  // Check Category Alignment
  const isSubscriptionMatch = groqAnalysis.industry === "subscriptions";

  // Case A: Real entity, but Travel or E-commerce
  if (!isSubscriptionMatch) {
    const isTravel = ["flights", "hotels", "events"].includes(groqAnalysis.industry);
    const targetTab = isTravel ? "travel" : (groqAnalysis.industry === "ecommerce" ? "ecommerce" : "coupons");
    const targetTitle = isTravel ? "Travel & Stays Hub" : "Shopping & Coupons Hub";

    const result = {
      success: true,
      query,
      isRealEntity: true,
      canonicalName: groqAnalysis.canonicalName,
      domain: groqAnalysis.domain,
      entityCategory: groqAnalysis.industry,
      isCategoryMatch: false,
      action: "CATEGORY_MISMATCH",
      crossCategoryTab: targetTab,
      crossCategoryTitle: targetTitle,
      description: groqAnalysis.briefDescription,
      guidanceMessage: `${groqAnalysis.canonicalName} belongs to ${targetTitle}, not Digital Subscriptions & OTT.`
    };
    ENTITY_CACHE.set(cacheKey, result);
    return result;
  }

  // Case B: Real, verified subscription entity!
  const result = {
    success: true,
    query,
    isRealEntity: true,
    canonicalName: groqAnalysis.canonicalName,
    domain: groqAnalysis.domain,
    entityCategory: "subscriptions",
    isCategoryMatch: true,
    action: "SUBSCRIPTION_ENTITY_VERIFIED",
    description: groqAnalysis.briefDescription,
    guidanceMessage: `ShopSmart AI verified official portal for ${groqAnalysis.canonicalName} (${groqAnalysis.domain}).`
  };

  ENTITY_CACHE.set(cacheKey, result);
  return result;
}
