import React from "react";
import EventsHubClient from "./EventsHubClient";

export const metadata = {
  title: "Events, Concerts & Cinema Savings Blueprints (2026): BOGO Cards & Deals | Benefisto",
  description: "Verified savings blueprints for event ticketing, live music concerts, and cinema chains across India, USA, UK, Australia, Canada, and UAE. Buy 1 Get 1 (BOGO) credit card cheat sheets and resale timing hacks.",
  keywords: [
    "event savings blueprints",
    "bookmyshow bogo credit cards",
    "ticketmaster presale codes",
    "movie ticket discounts",
    "stubhub last minute tickets",
    "buy 1 get 1 free movie tickets",
    "pvr passport subscription",
    "concert ticket discounts 2026",
    "icici bookmyshow offer",
    "early bird festival tickets"
  ],
  alternates: {
    canonical: "https://www.benefisto.com/events",
  },
  openGraph: {
    title: "Events, Concerts & Cinema Savings Blueprints | Benefisto",
    description: "Compare verified entertainment ticket saving strategies across 6 countries. BOGO credit card matrix and promo codes.",
    url: "https://www.benefisto.com/events",
    siteName: "Benefisto",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Events & Cinema Ticket Savings Blueprints | Benefisto",
    description: "Stop paying full price for concerts, movies, and events. Verified BOGO cards and timing hacks tested daily.",
  }
};

export default function EventsPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Benefisto Events & Cinema Ticket Savings Engine",
    "description": "Verified concert, cinema, and live event savings strategies, BOGO credit card cheatsheets, and vouchers.",
    "url": "https://www.benefisto.com/events",
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
        "name": "Events & Entertainment Savings",
        "item": "https://www.benefisto.com/events"
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
      <EventsHubClient />
    </>
  );
}
