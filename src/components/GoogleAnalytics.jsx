import Script from "next/script";

/**
 * High-Performance Google Analytics (GA4) Script Component
 * Loads asynchronously after page interaction so it doesn't block Core Web Vitals or LCP.
 * Automatically activates whenever NEXT_PUBLIC_GA_MEASUREMENT_ID is provided.
 */
export default function GoogleAnalytics({ gaId }) {
  const measurementId = gaId || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // If no measurement ID is configured, fail silently without overhead
  if (!measurementId) {
    return null;
  }

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
          `,
        }}
      />
    </>
  );
}
