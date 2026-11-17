import { INDIA_SUBSCRIPTIONS_CATALOG } from "./subscriptionsCatalog.js";
import { US_SUBSCRIPTIONS_CATALOG } from "./subscriptionsCatalogUS.js";
import { UK_SUBSCRIPTIONS_CATALOG } from "./subscriptionsCatalogUK.js";
import { CA_SUBSCRIPTIONS_CATALOG } from "./subscriptionsCatalogCA.js";
import { AU_SUBSCRIPTIONS_CATALOG } from "./subscriptionsCatalogAU.js";
import { AE_SUBSCRIPTIONS_CATALOG } from "./subscriptionsCatalogAE.js";
import { MASTER_PLATFORMS_CATALOG } from "./masterSoftwareCatalog.js";
import { SUBSCRIPTIONS_SEO_MAP, getSubscriptionBySlug as getIndiaSubBySlug, getAllSubscriptionSlugs as getAllIndiaSlugs } from "./subscriptionsSeoData.js";
import { SUBSCRIPTIONS_SEO_MAP_US, getUSSubscriptionBySlug, getAllUSSubscriptionSlugs } from "./subscriptionsSeoDataUS.js";
import { SUBSCRIPTIONS_SEO_MAP_UK, getUKSubscriptionBySlug, getAllUKSubscriptionSlugs } from "./subscriptionsSeoDataUK.js";
import { SUBSCRIPTIONS_SEO_MAP_CA, getCASubscriptionBySlug, getAllCASubscriptionSlugs } from "./subscriptionsSeoDataCA.js";
import { SUBSCRIPTIONS_SEO_MAP_AU, getAUSubscriptionBySlug, getAllAUSubscriptionSlugs } from "./subscriptionsSeoDataAU.js";
import { SUBSCRIPTIONS_SEO_MAP_AE, getAESubscriptionBySlug, getAllAESubscriptionSlugs } from "./subscriptionsSeoDataAE.js";

// Extract all 140 software & AI platforms (Universal across all countries)
const GLOBAL_SOFTWARE_PLATFORMS = MASTER_PLATFORMS_CATALOG.filter(sub => {
  const cat = (sub.category || "").toLowerCase();
  const id = (sub.id || "").toLowerCase();
  return (
    ["ai_creative", "ai_tools", "cloud_work", "dev_tools", "security", "productivity", "design", "cloud_hosting", "ecommerce"].includes(cat) ||
    ["chatgpt", "canva", "adobe_creative", "copilot", "google_one", "microsoft_365", "icloud", "notion", "figma", "hostinger", "nordvpn", "github", "slack", "perplexity", "claude", "clickup", "zoom", "replit", "cursor", "shopify", "expressvpn", "surfshark", "jetbrains", "grammarly", "1password"].includes(id)
  );
});

function adaptSoftwareForCountry(sub, countryCode) {
  const code = String(countryCode || "IN").toUpperCase();
  if (code === "IN") return sub;

  const currencySymbol = code === "AE" ? "AED" : (code === "AU" ? "A$" : (code === "CA" ? "C$" : (code === "GB" || code === "UK" ? "£" : "$")));
  const rate = code === "AE" ? 0.044 : (code === "AU" ? 0.018 : (code === "CA" ? 0.016 : (code === "GB" || code === "UK" ? 0.0095 : 0.012)));

  const convertedPlans = (sub.plans || []).map(p => ({
    ...p,
    price: p.price === 0 ? 0 : Number((p.price * rate).toFixed(p.period === "year" ? 0 : 2))
  }));

  return {
    ...sub,
    country: code,
    currencySymbol,
    plans: convertedPlans
  };
}

/**
 * Multi-Country Catalog Resolver:
 * Returns Country-Specific OTT/Streaming + Universal Multi-Category Software
 */
export function getSubscriptionsCatalog(countryCode = "IN") {
  const code = String(countryCode || "IN").toUpperCase();
  
  let baseOtt = INDIA_SUBSCRIPTIONS_CATALOG.filter(s => !GLOBAL_SOFTWARE_PLATFORMS.some(sw => sw.id === s.id));
  if (code === "US") {
    baseOtt = US_SUBSCRIPTIONS_CATALOG;
  } else if (code === "GB" || code === "UK") {
    baseOtt = UK_SUBSCRIPTIONS_CATALOG;
  } else if (code === "CA") {
    baseOtt = CA_SUBSCRIPTIONS_CATALOG;
  } else if (code === "AU") {
    baseOtt = AU_SUBSCRIPTIONS_CATALOG;
  } else if (code === "AE") {
    baseOtt = AE_SUBSCRIPTIONS_CATALOG;
  }

  const adaptedSoftware = GLOBAL_SOFTWARE_PLATFORMS.map(s => adaptSoftwareForCountry(s, code));
  return [...baseOtt, ...adaptedSoftware];
}

/**
 * Universal Slug Resolver across all supported regions
 * Resolves Indian, US, UK, Canadian, Australian, UAE, and dynamic Redis-cached brands automatically.
 */
export async function getUniversalSubscriptionBySlug(slug, countryCode = null) {
  if (!slug) return null;
  const cleanSlug = slug.toLowerCase().trim();
  const code = countryCode ? String(countryCode).toUpperCase() : null;

  // If country is explicitly AE, try UAE first
  if (code === "AE") {
    const aeSub = await getAESubscriptionBySlug(cleanSlug);
    if (aeSub) return { ...aeSub, country: "AE", currencySymbol: "AED" };
  }

  // If country is explicitly AU, try Australia first
  if (code === "AU") {
    const auSub = await getAUSubscriptionBySlug(cleanSlug);
    if (auSub) return { ...auSub, country: "AU", currencySymbol: "A$" };
  }

  // If country is explicitly CA, try Canada first
  if (code === "CA") {
    const caSub = await getCASubscriptionBySlug(cleanSlug);
    if (caSub) return { ...caSub, country: "CA", currencySymbol: "C$" };
  }

  // If country is explicitly GB or UK, try UK first
  if (code === "GB" || code === "UK") {
    const ukSub = await getUKSubscriptionBySlug(cleanSlug);
    if (ukSub) return { ...ukSub, country: "GB", currencySymbol: "£" };
  }

  // If country is explicitly US, try US first
  if (code === "US") {
    const usSub = await getUSSubscriptionBySlug(cleanSlug);
    if (usSub) return { ...usSub, country: "US", currencySymbol: "$" };
  }

  // Try India first (default)
  const inSub = await getIndiaSubBySlug(cleanSlug);
  if (inSub) return { ...inSub, country: "IN", currencySymbol: "₹" };

  // If not found in India, try US
  const usSub = await getUSSubscriptionBySlug(cleanSlug);
  if (usSub) return { ...usSub, country: "US", currencySymbol: "$" };

  // If not found in US, try UK
  const ukSub = await getUKSubscriptionBySlug(cleanSlug);
  if (ukSub) return { ...ukSub, country: "GB", currencySymbol: "£" };

  // If not found in UK, try Canada
  const caSub = await getCASubscriptionBySlug(cleanSlug);
  if (caSub) return { ...caSub, country: "CA", currencySymbol: "C$" };

  // If not found in Canada, try Australia
  const auSub = await getAUSubscriptionBySlug(cleanSlug);
  if (auSub) return { ...auSub, country: "AU", currencySymbol: "A$" };

  // If not found in Australia, try UAE
  const aeSub = await getAESubscriptionBySlug(cleanSlug);
  if (aeSub) return { ...aeSub, country: "AE", currencySymbol: "AED" };

  return null;
}

/**
 * Universal Slug Generator for SSG Build
 * Combines all slugs from all supported countries so every page is pre-rendered!
 */
export function getAllUniversalSubscriptionSlugs() {
  const inSlugs = getAllIndiaSlugs();
  const usSlugs = getAllUSSubscriptionSlugs();
  const ukSlugs = getAllUKSubscriptionSlugs();
  const caSlugs = getAllCASubscriptionSlugs();
  const auSlugs = getAllAUSubscriptionSlugs();
  const aeSlugs = getAllAESubscriptionSlugs();
  const combined = Array.from(new Set([...inSlugs, ...usSlugs, ...ukSlugs, ...caSlugs, ...auSlugs, ...aeSlugs]));
  return combined;
}
