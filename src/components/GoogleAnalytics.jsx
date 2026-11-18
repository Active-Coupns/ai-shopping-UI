import Script from "next/script";

/**
 * High-Performance Google Analytics (GA4) Component
 * Measurement ID: G-9PGXEVPZB7 (Stream ID: 1636577983)
 * Google Tag Container: GTM-M7LDN8TZ
 * Loads asynchronously via next/script so it never blocks page load or Core Web Vitals.
 */
export default function GoogleAnalytics({ gaId }) {
  const measurementId = gaId || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-9PGXEVPZB7";
  const gtmId = "GTM-M7LDN8TZ";

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
            });
            gtag('config', '${gtmId}');
          `,
        }}
      />
    </>
  );
}
