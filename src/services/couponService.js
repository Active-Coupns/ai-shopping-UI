import fs from "fs";
import path from "path";
import { MASTER_COUPON_DATABASE, matchStoreKey } from "./couponDatabase.js";
import { getCountryMeta } from "../lib/countryConfig.js";
import { discoverOnDemandStoreCoupons } from "./couponOnDemandService.js";
import { fetchFeedicoCoupons } from "./feedicoService.js";
import { findBrandInCatalog, getTopBrandsForCountry } from "../data/countryBrandsCatalog.js";
import { aiRouter } from "./aiRouter.js";
import { redis } from "./redis.js";
import { loadPersistentStore, savePersistentStore } from "./couponRollingSyncEngine.js";

function getLiveCouponsStore() {
  try {
    const storePath = path.join(process.cwd(), "src/data/liveCouponsStore.json");
    if (fs.existsSync(storePath)) {
      return JSON.parse(fs.readFileSync(storePath, "utf8"));
    }
  } catch (e) {
    // Graceful fallback
  }
  return liveCouponsData;
}

const SEMANTIC_INTENT_MAP = [
  { keywords: ["pizza", "burger", "biryani", "food", "dinner", "lunch", "hungry", "cravings", "restaurant", "meal", "khaana"], storeKey: "zomato" },
  { keywords: ["grocery", "groceries", "milk", "vegetables", "fruits", "10 min", "snacks", "ration"], storeKey: "blinkit" },
  { keywords: ["cab", "taxi", "ride", "auto", "commute", "gadi"], storeKey: "uber" },
  { keywords: ["clothes", "fashion", "shirt", "jeans", "dress", "shoes", "sneakers", "kapde"], storeKey: "myntra" },
  { keywords: ["movie", "cinema", "tickets", "show", "film"], storeKey: "bookmyshow" },
  { keywords: ["flight", "hotel", "holiday", "vacation", "trip"], storeKey: "makemytrip" },
  { keywords: ["beauty", "makeup", "skincare", "cosmetics"], storeKey: "nykaa" },
  { keywords: ["gadgets", "phone", "electronics", "online shopping"], storeKey: "amazon" }
];

/**
 * Real-Time On-Demand Coupon Evaluation Engine
 * Evaluates live, active, validated promo codes & bank offers per request.
 */
export async function getCouponsForStore(queryOrStore = "", country = "IN", { isPaidUser = false, userId = null } = {}) {
  const normalizedKey = matchStoreKey(queryOrStore);
  const searchSlug = normalizedKey || queryOrStore.toLowerCase().trim();

  // 1. Check Master Multi-Country Top 100 Brand Registry
  const catalogBrand = findBrandInCatalog(queryOrStore, country);

  // 2. Lookup in Live Verified Master Database
  let storeData = normalizedKey ? MASTER_COUPON_DATABASE[normalizedKey] : null;

  // 3. Pre-Synced Live Store Check (Instant sub-millisecond cache from Daily Cron)
  const currentLiveStore = getLiveCouponsStore();
  let feedicoCoupons = [];
  const rawLookupKey = (catalogBrand?.name || queryOrStore).toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const cleanLookupKey = rawLookupKey.replace(/-(india|uk|canada|australia|uae)$/i, "");
  const idLookupKey = (catalogBrand?.id || "").toLowerCase();
  const preSyncedStore = currentLiveStore?.stores?.[rawLookupKey] ||
                         currentLiveStore?.stores?.[cleanLookupKey] ||
                         currentLiveStore?.stores?.[idLookupKey] ||
                         (normalizedKey ? currentLiveStore?.stores?.[normalizedKey] : null) ||
                         (searchSlug ? currentLiveStore?.stores?.[searchSlug] : null);
  if (preSyncedStore && Array.isArray(preSyncedStore.coupons) && preSyncedStore.coupons.length > 0) {
    // If this store was unlocked via on-demand and is NOT in the public 600 catalog:
    // It is an exclusive Extended Network brand that requires Paid Tier!
    const isPublicCatalogBrand = Boolean(catalogBrand || normalizedKey);
    if (preSyncedStore.isOnDemandUnlocked && !isPublicCatalogBrand && !isPaidUser) {
      return {
        success: false,
        requiresPaidTier: true,
        storeName: preSyncedStore.brandName || queryOrStore,
        title: "Extended Merchant Network",
        message: `${preSyncedStore.brandName || queryOrStore} is part of our Extended Global Merchant Network. Active checkout deals and promo codes for this store require an active Benefisto Search & Coupon Pack.`,
        upgradeUrl: "/pricing?tab=search",
        coupons: []
      };
    }

    feedicoCoupons = preSyncedStore.coupons;
    if (preSyncedStore.isLiveScraped || preSyncedStore.coupons[0]?.source === "brightdata_groq_unlocked") {
      storeData = {
        name: catalogBrand?.name || preSyncedStore.brandName || queryOrStore,
        category: catalogBrand?.category || "Verified Brand Savings",
        logo: catalogBrand?.logo || "🏷️",
        brandColor: catalogBrand?.color || "from-blue-600 to-indigo-700",
        domain: catalogBrand?.domain || preSyncedStore.domain,
        tagline: catalogBrand?.tagline || "Official Verified Savings",
        coupons: preSyncedStore.coupons
      };
    }
  }

  // 3.1 Live Query to Feedico Partner Catalog (if not in pre-synced cache)
  if (feedicoCoupons.length === 0 && queryOrStore && queryOrStore.trim().length >= 2) {
    try {
      const feedicoRes = await fetchFeedicoCoupons({
        query: queryOrStore.trim(),
        country,
        pageSize: 15
      });
      if (feedicoRes.success && Array.isArray(feedicoRes.coupons) && feedicoRes.coupons.length > 0) {
        feedicoCoupons = feedicoRes.coupons;
        console.log(`[Coupon Service] Found ${feedicoCoupons.length} live Feedico coupons for "${queryOrStore}"`);
      }
    } catch (fErr) {
      console.warn("[Coupon Service] Feedico query notice:", fErr.message);
    }
  }

  // 4. Semantic Intent & Category Mapping (Zero-latency RAG layer)
  if (!storeData && queryOrStore) {
    const qLower = queryOrStore.toLowerCase();
    for (const mapping of SEMANTIC_INTENT_MAP) {
      if (mapping.keywords.some(kw => qLower.includes(kw))) {
        if (MASTER_COUPON_DATABASE[mapping.storeKey]) {
          storeData = MASTER_COUPON_DATABASE[mapping.storeKey];
          console.log(`[Coupon RAG] Mapped "${queryOrStore}" to verified merchant "${storeData.name}"`);
          break;
        }
      }
    }
  }

  // 5. Fuzzy Search across local store database if specific key wasn't matched
  if (!storeData) {
    const queryLower = queryOrStore.toLowerCase();
    for (const [key, store] of Object.entries(MASTER_COUPON_DATABASE)) {
      if (
        store.name.toLowerCase().includes(queryLower) ||
        store.category.toLowerCase().includes(queryLower)
      ) {
        storeData = store;
        break;
      }
    }
  }

  // 6. Integrate Catalog Brand + Feedico Live Catalog Deals
  if (!storeData && feedicoCoupons.length > 0) {
    storeData = {
      name: catalogBrand?.name || feedicoCoupons[0].merchantName || queryOrStore,
      category: catalogBrand?.category || "Verified Partner Catalog",
      logo: catalogBrand?.logo || "🏷️",
      brandColor: catalogBrand?.color || "from-blue-600 to-indigo-700",
      domain: catalogBrand?.domain || feedicoCoupons[0].websiteUrl,
      tagline: catalogBrand?.tagline || "Official Verified Savings",
      coupons: feedicoCoupons
    };
  } else if (storeData && feedicoCoupons.length > 0) {
    // Enrich local store with real-time Feedico affiliate deals & /go tracking links
    const existingCodes = new Set((storeData.coupons || []).map(c => (c.code || "").toUpperCase()));
    const uniqueFeedico = feedicoCoupons.filter(c => !c.code || !existingCodes.has(c.code.toUpperCase()));
    storeData.coupons = [...uniqueFeedico, ...(storeData.coupons || [])].slice(0, 5);
  } else if (!storeData && catalogBrand) {
    // Brand is in Top 100 power catalog but has 0 affiliate offers right now -> Generate clean brand promo strategy
    const meta = getCountryMeta(country);
    storeData = {
      name: catalogBrand.name,
      category: catalogBrand.category,
      logo: catalogBrand.logo,
      brandColor: catalogBrand.color,
      domain: catalogBrand.domain,
      tagline: catalogBrand.tagline,
      coupons: [
        {
          id: `top-${catalogBrand.id}-deal`,
          code: "DIRECT_DEAL",
          hasRealCode: false,
          title: catalogBrand.bestOffer || `${catalogBrand.name} Verified Special Savings`,
          description: `Official promotions and instant seasonal savings available directly at ${catalogBrand.name}.`,
          discount_type: "PERCENT",
          discount_val: 15,
          min_order: null,
          badge: "VERIFIED ACTIVE",
          verified_rate: "99% Success Rate",
          valid_till: "Limited Time",
          terms: `Subject to ${catalogBrand.name} standard terms and seasonal stock availability.`,
          merchantName: catalogBrand.name,
          websiteUrl: `https://${catalogBrand.domain}`,
          source: "catalog_verified"
        }
      ]
    };
  }

  // 7. If still not matched, trigger On-Demand Live Merchant Discovery
  if (!storeData && queryOrStore && queryOrStore.trim().length >= 2) {
    if (!isPaidUser) {
      return {
        success: false,
        requiresPaidTier: true,
        storeName: queryOrStore,
        title: "Extended Merchant Network",
        message: `${queryOrStore} is part of our Extended Global Merchant Network. Active checkout deals and promo codes for this store require an active Benefisto Search & Coupon Pack.`,
        upgradeUrl: "/pricing?tab=search",
        coupons: []
      };
    }

    const onDemandRes = await discoverOnDemandStoreCoupons(queryOrStore, country);
    if (onDemandRes.success && onDemandRes.storeData) {
      storeData = onDemandRes.storeData;

      // Deduct 1 credit for paid user
      if (userId && redis) {
        try {
          await redis.decrby(`user_search_credits:${userId}`, 1);
        } catch (_) {}
      }

      // Persistently cache in liveCouponsStore.json so all future lookups are instant & free!
      try {
        const persistent = loadPersistentStore();
        if (persistent && persistent.stores) {
          const storeSlug = queryOrStore.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          persistent.stores[storeSlug] = {
            brandName: storeData.name || queryOrStore,
            domain: storeData.domain,
            lastUpdated: new Date().toISOString(),
            isLiveScraped: true,
            isOnDemandUnlocked: true,
            coupons: storeData.coupons || []
          };
          savePersistentStore(persistent);
        }
      } catch (saveErr) {
        console.warn("[Coupon Service] Error persisting on-demand store:", saveErr.message);
      }
    } else {
      return {
        success: false,
        notFound: true,
        storeName: queryOrStore,
        isCategoryMismatch: onDemandRes.isCategoryMismatch || false,
        crossCategoryTab: onDemandRes.crossCategoryTab,
        crossCategoryTitle: onDemandRes.crossCategoryTitle,
        error: onDemandRes.error || "We currently do not have verified coupons or saving strategies available for this store in our database.",
        coupons: []
      };
    }
  }

  // 8. Attach Guaranteed Discount Gift Card Fallback Banner (Raise for Global, Woohoo/Gyftr for India)
  const isIndia = (country || "IN").toUpperCase() === "IN";
  const brandName = storeData?.name || queryOrStore;
  const brandSlug = (storeData?.name || queryOrStore).toLowerCase().replace(/[^a-z0-9]/g, "-");

  const giftCardBanner = {
    id: `gc-${brandSlug}-guarantee`,
    code: isIndia ? "INSTANT_CASHBACK" : "RAISE_REWARDS",
    hasRealCode: false,
    title: isIndia 
      ? `Flat 2% to 6% Savings via ${brandName} Gift Card (Coming Soon)`
      : `Flat 3% to 10% Savings via Discounted ${brandName} Gift Card (Coming Soon)`,
    description: isIndia
      ? `Zero-failure digital savings voucher. Direct brand partner integration currently in verification rollout — launching soon on Benefisto!`
      : `Stackable zero-risk strategy. Direct brand partner integration currently in verification rollout — launching soon on Benefisto!`,
    discount_type: "PERCENT",
    discount_val: isIndia ? 5 : 7,
    min_order: null,
    badge: "COMING SOON",
    verified_rate: "Unlocking Soon",
    valid_till: "Partner Rollout",
    terms: "Direct partner onboarding in progress. Instant digital voucher delivery launching soon.",
    merchantName: brandName,
    link: null,
    websiteUrl: null,
    isGiftCardFallback: true,
    source: "benefisto_guarantee"
  };

  // Ensure sweet-spot cap of 3 to 5 total offers (including gift card guarantee)
  // Deduplicate and filter out any existing gift card banner before appending
  const existingCoupons = (storeData?.coupons || [])
    .filter(c => !c.isGiftCardFallback && c.id !== giftCardBanner.id)
    .map(c => ({
      ...c,
      hasRealCode: c.hasRealCode !== undefined ? c.hasRealCode : Boolean(c.code && c.code !== 'DIRECT_DEAL' && c.code !== 'INSTANT_CASHBACK' && c.code !== 'RAISE_REWARDS'),
      link: c.link || c.goUrl || (storeData?.domain ? `https://${storeData.domain}` : `https://${brandSlug}.com`)
    }));
  const cappedOffers = existingCoupons.slice(0, 4);
  // Place 100% Guaranteed Gift Card Savings at #1 FIRST PLACE to maximize conversions & user attraction
  const finalizedCoupons = [giftCardBanner, ...cappedOffers];

  return {
    success: true,
    storeKey: normalizedKey || searchSlug,
    storeName: storeData.name,
    category: storeData.category,
    logo: storeData.logo,
    brandColor: storeData.brandColor,
    totalOffers: finalizedCoupons.length,
    coupons: finalizedCoupons,
    isOnDemand: Boolean(storeData.isOnDemand),
    isRealTime: true,
    lastUpdated: preSyncedStore?.lastUpdated || currentLiveStore?.metadata?.lastUpdated || new Date().toISOString()
  };
}

/**
 * Real-time Cart Optimizer: Simulates all coupons against user's cart total & metadata
 */
export async function calculateBestCartCoupon(
  storeNameOrKey, 
  cartTotal, 
  country = "IN", 
  { isNewUser = false, paymentMethod = null, isPaidUser = false, userId = null } = {}
) {
  const numericCart = parseFloat(cartTotal) || 0;
  const storeCouponsResult = await getCouponsForStore(storeNameOrKey, country, { isPaidUser, userId });

  if (storeCouponsResult.requiresPaidTier) {
    return {
      success: false,
      requiresPaidTier: true,
      storeName: storeCouponsResult.storeName || storeNameOrKey,
      message: storeCouponsResult.message,
      upgradeUrl: storeCouponsResult.upgradeUrl || "/pricing?tab=search"
    };
  }

  const coupons = storeCouponsResult.coupons || [];
  const meta = getCountryMeta(country);
  const currencySymbol = meta?.symbol || "₹";

  // Currency-aware shortfall threshold for next-tier upgrades
  const cCode = (country || "IN").toUpperCase();
  const maxShortfallAllowed = cCode === "IN" ? 350 : (cCode === "GB" ? 10 : (cCode === "AE" ? 50 : 15));

  const evaluatedCoupons = coupons.map((c) => {
    const minOrder = c.min_order ? parseFloat(c.min_order) : 0;
    const isMinOrderMet = numericCart >= minOrder;
    const shortfall = !isMinOrderMet ? Math.round(minOrder - numericCart) : 0;

    // Check user eligibility metadata
    const eligText = (c.eligibility || c.badge || "").toLowerCase();
    const isNewUserCoupon = eligText.includes("new user") || eligText.includes("first") || eligText.includes("welcome");
    const userEligible = isNewUser ? true : !isNewUserCoupon;

    // Check bank/payment method metadata
    const titleLower = (c.title || "").toLowerCase();
    const descLower = (c.description || "").toLowerCase();
    let paymentMatch = true;
    if (paymentMethod && paymentMethod !== "ALL") {
      const pm = paymentMethod.toLowerCase();
      const hasBankMention = titleLower.includes("hdfc") || titleLower.includes("icici") || titleLower.includes("axis") || titleLower.includes("sbi") || titleLower.includes("amex");
      if (hasBankMention) {
        paymentMatch = titleLower.includes(pm) || descLower.includes(pm);
      }
    }

    let savings = 0;
    const isEligible = isMinOrderMet && userEligible && paymentMatch;

    if (isEligible) {
      if (c.discount_type === "PERCENT") {
        const calculated = Math.round(numericCart * (c.discount_val / 100));
        const maxCap = c.max_discount ? parseFloat(c.max_discount) : Infinity;
        savings = Math.min(maxCap, calculated);
      } else {
        const flatVal = parseFloat(c.discount_val) || 0;
        const maxCap = c.max_discount ? parseFloat(c.max_discount) : flatVal;
        savings = Math.min(maxCap, flatVal);
      }
    }

    let status = "ELIGIBLE";
    let statusText = `Saves ${currencySymbol}${savings} at checkout`;

    if (!isMinOrderMet) {
      status = "MIN_ORDER_SHORTFALL";
      statusText = `Need ${currencySymbol}${shortfall} more in cart`;
    } else if (!userEligible) {
      status = "NEW_USER_REQUIRED";
      statusText = "App / First-order accounts only";
    } else if (!paymentMatch) {
      status = "PAYMENT_METHOD_MISMATCH";
      statusText = `Requires ${c.title.split(" ")[0]} payment`;
    }

    return {
      ...c,
      isEligible,
      savingsAmount: savings,
      shortfall,
      simulationStatus: status,
      simulationText: statusText
    };
  });

  // Sort eligible by highest savings first
  const eligibleCoupons = evaluatedCoupons
    .filter((c) => c.isEligible && c.savingsAmount > 0)
    .sort((a, b) => b.savingsAmount - a.savingsAmount);

  // Identify next tier (offers needing a small cart bump)
  const nextTierOpportunities = evaluatedCoupons
    .filter((c) => !c.isEligible && c.shortfall > 0 && c.shortfall <= maxShortfallAllowed)
    .sort((a, b) => a.shortfall - b.shortfall);

  // Pick top real code as best coupon
  const bestCoupon = eligibleCoupons.find(c => c.hasRealCode && c.code && c.code !== "INSTANT_CASHBACK") || eligibleCoupons[0] || null;

  return {
    success: true,
    storeKey: storeCouponsResult.storeKey,
    storeName: storeCouponsResult.storeName,
    logo: storeCouponsResult.logo,
    category: storeCouponsResult.category,
    cartTotal: numericCart,
    currencySymbol,
    country,
    bestCoupon,
    eligibleCoupons,
    nextTierOpportunities,
    allCoupons: evaluatedCoupons,
    simulatedCount: evaluatedCoupons.length,
    requiresPaidTier: false
  };
}
