import React from "react";
import TravelHubClient from "./TravelHubClient";

export const metadata = {
  title: "Flight & Hotel Savings Blueprints (2026): Secret Deals & Concessions | Benefisto",
  description: "Verified savings blueprints for top airlines, OTAs, and hotels across India, USA, UK, Australia, Canada, and UAE. Student baggage perks, 21-day booking windows, and verified promo codes.",
  keywords: [
    "flight savings blueprints",
    "airline student discounts",
    "hotel promo codes",
    "secret app hotel deals",
    "indigo student discount",
    "makemytrip promo codes",
    "agoda secret rates",
    "cheap flights booking window",
    "free extra baggage airline hacks",
    "travel deals 2026"
  ],
  alternates: {
    canonical: "https://www.benefisto.com/travel",
  },
  openGraph: {
    title: "Flight & Hotel Savings Blueprints: Verified Deals & Hacks | Benefisto",
    description: "Compare verified flight and hotel saving strategies across 6 countries. Actionable concessions, booking windows, and promo codes.",
    url: "https://www.benefisto.com/travel",
    siteName: "Benefisto",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flight & Hotel Savings Blueprints | Benefisto",
    description: "Stop paying full price for flights and hotels. Verified strategies and promo codes tested daily.",
  }
};

export default function TravelPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Benefisto Travel Savings Engine & Flight/Hotel Blueprints",
    "description": "Verified flight, hotel, and airfare savings strategies, student baggage schemes, and promo codes.",
    "url": "https://www.benefisto.com/travel",
    "provider": {
      "@type": "Organization",
      "name": "Benefisto",
      "url": "https://www.benefisto.com"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.benefisto.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Travel Savings & Blueprints",
        "item": "https://www.benefisto.com/travel"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <TravelHubClient />
    </>
  );
}
