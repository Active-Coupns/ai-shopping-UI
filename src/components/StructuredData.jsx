export default function StructuredData() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Benefisto AI",
    "alternateName": ["Benefisto", "ShopSmart AI"],
    "url": "https://www.benefisto.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.benefisto.com/?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Benefisto AI Shopping Assistant",
    "applicationCategory": "ShoppingApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Intelligent real-time multi-store price comparison and authentic merchant shopping assistant.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1250"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Benefisto AI",
    "url": "https://www.benefisto.com",
    "logo": "https://www.benefisto.com/laptop.jpg",
    "description": "Empowering global consumers with transparent multi-store price discovery and authentic shopping links."
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </>
  );
}
