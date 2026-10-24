import { INDIA_SUBSCRIPTIONS_CATALOG } from "./subscriptionsCatalog";
import { US_SUBSCRIPTIONS_CATALOG } from "./subscriptionsCatalogUS";
import { UK_SUBSCRIPTIONS_CATALOG } from "./subscriptionsCatalogUK";
import { CA_SUBSCRIPTIONS_CATALOG } from "./subscriptionsCatalogCA";
import { AU_SUBSCRIPTIONS_CATALOG } from "./subscriptionsCatalogAU";
import { AE_SUBSCRIPTIONS_CATALOG } from "./subscriptionsCatalogAE";
import { SUBSCRIPTIONS_SEO_MAP, getSubscriptionBySlug as getIndiaSubBySlug, getAllSubscriptionSlugs as getAllIndiaSlugs } from "./subscriptionsSeoData";
import { SUBSCRIPTIONS_SEO_MAP_US, getUSSubscriptionBySlug, getAllUSSubscriptionSlugs } from "./subscriptionsSeoDataUS";
import { SUBSCRIPTIONS_SEO_MAP_UK, getUKSubscriptionBySlug, getAllUKSubscriptionSlugs } from "./subscriptionsSeoDataUK";
import { SUBSCRIPTIONS_SEO_MAP_CA, getCASubscriptionBySlug, getAllCASubscriptionSlugs } from "./subscriptionsSeoDataCA";
import { SUBSCRIPTIONS_SEO_MAP_AU, getAUSubscriptionBySlug, getAllAUSubscriptionSlugs } from "./subscriptionsSeoDataAU";
import { SUBSCRIPTIONS_SEO_MAP_AE, getAESubscriptionBySlug, getAllAESubscriptionSlugs } from "./subscriptionsSeoDataAE";

/**
 * Multi-Country Catalog Resolver
 */
export function getSubscriptionsCatalog(countryCode = "IN") {
  const code = String(countryCode || "IN").toUpperCase();
  if (code === "US") {
    return US_SUBSCRIPTIONS_CATALOG;
  }
  if (code === "GB" || code === "UK") {
    return UK_SUBSCRIPTIONS_CATALOG;
  }
  if (code === "CA") {
    return CA_SUBSCRIPTIONS_CATALOG;
  }
  if (code === "AU") {
    return AU_SUBSCRIPTIONS_CATALOG;
  }
  if (code === "AE") {
    return AE_SUBSCRIPTIONS_CATALOG;
  }
  return INDIA_SUBSCRIPTIONS_CATALOG;
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
