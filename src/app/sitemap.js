import { getAllSubscriptionSlugs } from "@/data/subscriptionsSeoData";

export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://shopsmart-ai.com");

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  const subscriptionRoutes = getAllSubscriptionSlugs().map(slug => ({
    url: `${baseUrl}/subscriptions/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...staticRoutes, ...subscriptionRoutes];
}
