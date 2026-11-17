import { getAllUniversalSubscriptionSlugs } from "../data/subscriptionsRegistry.js";
import { getAllTravelSlugs, getAllEventSlugs } from "../data/travelRegistry.js";
import { COUNTRY_TOP_BRANDS } from "../data/countryBrandsCatalog.js";

export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://www.benefisto.com");

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/travel`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/subscriptions`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Universal Subscriptions & Software Hub (291 Platforms)
  const subscriptionRoutes = getAllUniversalSubscriptionSlugs().map(slug => ({
    url: `${baseUrl}/subscriptions/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Master Flights & Hotels Travel Hub (76 Global Platforms)
  const travelRoutes = getAllTravelSlugs().map(slug => ({
    url: `${baseUrl}/travel/${slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  }));

  // Master Concerts, Movies & Entertainment Events Hub (47 Global Platforms)
  const eventRoutes = getAllEventSlugs().map(slug => ({
    url: `${baseUrl}/events/${slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  }));

  // Retail & Shopping Coupon Brands (600 Market Brands)
  const couponRoutes = [];
  const seenBrands = new Set();

  for (const list of Object.values(COUNTRY_TOP_BRANDS)) {
    for (const brand of list) {
      if (!seenBrands.has(brand.id)) {
        seenBrands.add(brand.id);
        couponRoutes.push({
          url: `${baseUrl}/coupons/${brand.id}`,
          lastModified: new Date(),
          changeFrequency: "daily",
          priority: 0.85,
        });
      }
    }
  }

  return [
    ...staticRoutes, 
    ...subscriptionRoutes, 
    ...travelRoutes, 
    ...eventRoutes, 
    ...couponRoutes
  ];
}
