import { getAllSubscriptionSlugs } from "../data/subscriptionsSeoData.js";
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

  const subscriptionRoutes = getAllSubscriptionSlugs().map(slug => ({
    url: `${baseUrl}/subscriptions/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

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
          priority: 0.9,
        });
      }
    }
  }

  return [...staticRoutes, ...subscriptionRoutes, ...couponRoutes];
}
