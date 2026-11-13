export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://benefisto.com");

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/about",
          "/privacy",
          "/terms",
          "/disclaimer",
          "/contact",
          "/llms.txt",
          "/llms-full.txt",
          "/manifest.json"
        ],
        disallow: [
          "/admin",
          "/admin/",
          "/sentinelx9",
          "/sentinelx9/",
          "/purchase_terminal",
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
