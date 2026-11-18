import Script from "next/script";

/**
 * High-Performance Google Tag & Analytics (GA4 / GTM) Component
 * Configured with Tag ID: GTM-M7LDN8TZ
 * Loads asynchronously via next/script so it never blocks page load or Core Web Vitals.
 */
export default function GoogleAnalytics({ gaId }) {
  const tagId = gaId || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "GTM-M7LDN8TZ";

  if (!tagId) {
    return null;
  }

  const isGtm = tagId.startsWith("GTM-");
  const scriptUrl = isGtm
    ? `https://www.googletagmanager.com/gtm.js?id=${tagId}`
    : `https://www.googletagmanager.com/gtag/js?id=${tagId}`;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={scriptUrl}
      />
      <Script
        id="google-tag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            ${!isGtm ? `gtag('config', '${tagId}', { page_path: window.location.pathname });` : ""}
          `,
        }}
      />
    </>
  );
}
