export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://benefisto.com");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/sign-in",
          "/sign-up",
          "/reset-password"
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
