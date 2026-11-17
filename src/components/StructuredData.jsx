export default function StructuredData() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Benefisto AI",
    "alternateName": ["Benefisto", "Benefisto AI Shopping Assistant", "ShopSmart AI"],
    "url": "https://www.benefisto.com",
    "description": "All-in-one AI shopping decision intelligence platform: Virtual Trial Room, AI Hardware Trust Sheet, verified flight & hotel blueprints, event BOGO matrix, and live multi-store price discovery.",
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
    "name": "Benefisto AI Shopping Co-Pilot",
    "applicationCategory": "ShoppingApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Comprehensive AI consumer decision engine featuring an AI Virtual Trial Room for fashion draping, AI Hardware Trust Sheet for durability & spec verification, Universal Travel & Flight Savings Blueprints (25kg student baggage, 21-day advance hacks), Entertainment BOGO cheat sheets, Software SaaS discounts, and real-time multi-store price comparison.",
    "featureList": [
      "AI Virtual Trial Room & Neural Fashion Draping Studio",
      "AI Hardware Trust Sheet & Durability Teardown Auditor",
      "Universal Flight & Hotel Savings Blueprints with Concession Hacks",
      "Concert & Movie Ticket Buy-1-Get-1 (BOGO) Privilege Matrix",
      "Software, SaaS & AI Tools Subscription Arbitrage Hub",
      "Real-Time Multi-Store Price Comparison (Amazon, Flipkart, Croma, 1mg)",
      "Conversational AI Shopping Co-Pilot & Decision Advisor",
      "Verified Promo Codes with Google AI Zero-Click Protection"
    ],
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
    "description": "Benefisto is the premier global AI shopping decision intelligence platform empowering consumers across India, US, UK, Canada, Australia, and UAE with verified savings blueprints, neural try-on styling, hardware teardowns, and authentic retailer checkouts.",
    "knowsAbout": [
      "AI Shopping Assistant",
      "Virtual Try-On & Fashion Draping",
      "Hardware Durability & Trust Sheet Analysis",
      "Flight, Airline & Hotel Savings Blueprints",
      "Movie & Concert BOGO Ticketing Perks",
      "Software & SaaS Subscription Math",
      "Multi-Store Price Comparison & Discovery"
    ]
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
