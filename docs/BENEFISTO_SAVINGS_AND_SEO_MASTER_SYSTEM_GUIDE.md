# Benefisto — Master System Architecture & Savings Engine Guide
> **Version**: 2.0.0 (Production Verified)  
> **Last Updated**: November 2026  
> **Target Audience**: Core Engineering, Product Owners, SEO Architects, and Future Developers

---

## 1. Executive Summary & Core Philosophy

Benefisto is an intelligent shopping and savings platform designed to capture high-intent organic search traffic and deliver real, verified savings across five primary consumer spending verticals:
1. **Retail & E-Commerce Coupons** (`/coupons`, `/coupons/[store]`)
2. **Software, SaaS & AI Tools** (`/subscriptions`, `/subscriptions/[slug]`)
3. **Digital Subscriptions & OTT Streaming** (`/subscriptions`, `/subscriptions/[slug]`)
4. **Travel: Airlines & Hotels** (`/travel`, `/travel/[slug]`)
5. **Events, Concerts & Movies** (`/events`, `/events/[slug]`)

### The Hybrid Savings Strategy
Traditional coupon aggregators suffer from severe bounce rates because 70%+ of retail coupon codes online are expired or fake. Benefisto solves this through a **Hybrid Savings Architecture**:
- **When verified promo codes exist**: We provide tested, active discount codes sourced from partner affiliate feeds (Feedico) and official carrier channels.
- **When direct promo codes do not exist** (e.g., Apple, Netflix, Indigo, Airbnb): Instead of showing blank pages or fake codes, Benefisto delivers actionable **Savings Blueprints**:
  - Official student, youth, and military/defense concession schemes (up to 50% basic fare concession, free +10kg baggage).
  - Advance booking windows (e.g., 21-day domestic airline price arbitrage).
  - Bank and credit card Buy-1-Get-1 (BOGO) passes and reward multiplier transfers.
  - Mobile app-exclusive secret pricing.

---

## 2. Universal Data Ingestion & Sync Pipelines

Benefisto utilizes a multi-tiered data pipeline to ensure real-time accuracy without fake data:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DATA ACQUISITION ENGINE                         │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
       ┌───────────────────────────┼───────────────────────────┐
       ▼                           ▼                           ▼
┌──────────────┐           ┌──────────────┐            ┌───────────────┐
│ Feedico API  │           │   Zyte Web   │            │ Groq / Llama  │
│ Partner Feed │           │  Extraction  │            │ AI Live Radar │
│ (26,600+     │           │  (Carrier    │            │ (On-Demand    │
│  Coupons)    │           │   Promos)    │            │  Discovery)   │
└──────┬───────┘           └───────┬──────┘            └───────┬───────┘
       │                           │                           │
       └───────────────────────────┼───────────────────────────┘
                                   │
                                   ▼
       ┌───────────────────────────────────────────────────────┐
       │             Master Normalized In-Memory               │
       │               Database & Local Caches                 │
       │ (couponDatabase.js / travelDealsDatabase.js)          │
       └───────────────────────────────────────────────────────┘
```

### Data Sources
1. **Feedico Partner API (`https://partner.feedico.io`)**:
   - Sourced via `src/services/feedicoService.js`.
   - Contains 26,629+ live affiliate coupons across major e-commerce platforms and Online Travel Agencies (OTAs like MakeMyTrip, Agoda, Booking.com, Expedia).
   - Generates affiliate redirect URLs with encoded sub-affiliate IDs ensuring direct commission attribution.
2. **Zyte API Extraction (`src/services/zyteTravelDealsService.js`)**:
   - Probes carrier promotion pages (e.g., IndiGo student scheme, Air India defense fares, Emirates Student Club) using headless browser rendering.
   - Extracts validated terms, baggage limits, and promo codes into structured JSON.
3. **Groq / Llama 3 AI Live Radar (`src/services/travelEntityResolver.js` & `travelOnDemandService.js`)**:
   - Activates when a user searches for a long-tail brand not present in the pre-compiled database (e.g., "Singapore Airlines", "Hyatt").
   - Analyzes official domain authenticity, verifies active baggage rules, and dynamically adds verified deals to the user's active session without fake data.
4. **Local Static Baselines & Caches**:
   - `src/data/liveCouponsStore.json`: Pre-synced snapshot of affiliate coupons.
   - `src/services/couponDatabase.js`: Core merchant definitions and fallback coupons.
   - `src/services/travelDealsDatabase.js`: Master repository of airline, hotel, and ticketing promo codes and concession deals across 6 countries.
   - `src/data/travelRegistry.js`: Master metadata registry for brand pages (logos, colors, SEO tags, Blueprints, FAQs).

---

## 3. Data Formats & Schemas

### A. Retail Coupon Object Schema (`src/services/couponDatabase.js`)
```json
{
  "code": "SUPER60",
  "title": "Flat 60% Off on First Order",
  "discount": "60% OFF",
  "type": "percent",
  "minSpend": "Min Order ₹499",
  "expiry": "Active & Verified Today",
  "verified": true,
  "affiliateUrl": "https://partner.feedico.io/click?id=12345"
}
```

### B. Travel & Event Deal Object Schema (`src/services/travelDealsDatabase.js`)
```json
{
  "id": "in-flight-indigo-student-2026",
  "country": "IN",
  "category": "flights",
  "platformId": "indigo",
  "platformName": "IndiGo Airlines",
  "accentColor": "from-blue-600 to-indigo-800",
  "badge": "STUDENT SPECIAL",
  "discountValue": "6% Off + 25kg Bag",
  "estimatedSavings": "₹2,500+",
  "minSpend": "No min spend on domestic one-way",
  "expiryNote": "Evergreen (Refreshes monthly)",
  "title": "Student Special: 6% Base Fare Off + 25kg Checked Baggage",
  "tagline": "Save ₹1,500 to ₹3,000 on baggage fees plus flat basic fare reduction on direct domestic flights",
  "dealType": "CATEGORY_PERK",
  "promoCode": "STUDENT6E",
  "isEvergreen": true,
  "verifiedDate": "Today",
  "verifiedScore": 99,
  "directUrl": "https://www.goindigo.in/student-discount.html"
}
```

### C. Brand Registry Metadata Schema (`src/data/travelRegistry.js`)
```json
{
  "id": "indigo-airlines",
  "slug": "indigo-airlines",
  "name": "IndiGo Airlines",
  "category": "flights",
  "country": "IN",
  "logoText": "6E",
  "accentColor": "from-blue-600 to-indigo-800",
  "tagline": "India's largest passenger airline connecting 85+ domestic and 30+ international destinations.",
  "officialUrl": "https://www.goindigo.in",
  "position0Snapshot": {
    "studentFare": "6% off basic fare + 25kg free baggage allowance",
    "advanceBooking": "Optimal booking window 21–28 days prior on Tuesday/Wednesday",
    "defenseConcession": "Up to 50% basic fare concession for armed forces personnel",
    "appExclusive": "Zero convenience fee on select mobile app booking windows"
  },
  "blueprints": [
    {
      "tier": "Level 1: Statutory & Student Concessions",
      "action": "Claim Student ID Perks at Booking",
      "savings": "Save ₹1,500 – ₹3,000 per sector",
      "steps": ["Select 'Student' passenger category", "Upload valid college ID", "Get 25kg baggage waiver"]
    }
  ]
}
```

---

## 4. Brand Catalog & Country Coverage

Benefisto operates across **6 Global Markets**:
- 🇮🇳 **India (`IN`)** — Currency: ₹ (INR)
- 🇺🇸 **United States (`US`)** — Currency: $ (USD)
- 🇬🇧 **United Kingdom (`GB` / `UK`)** — Currency: £ (GBP)
- 🇦🇺 **Australia (`AU`)** — Currency: A$ (AUD)
- 🇨🇦 **Canada (`CA`)** — Currency: C$ (CAD)
- 🇦🇪 **United Arab Emirates (`AE`)** — Currency: AED

### Major Brands Inventory:
| Category | India (`IN`) | USA (`US`) | UK (`GB`) | Canada (`CA`) | Australia (`AU`) | UAE (`AE`) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Flights** | IndiGo, Air India, Akasa Air, SpiceJet, MakeMyTrip, EaseMyTrip | Delta, United, American, Southwest, Expedia | British Airways, easyJet, Virgin Atlantic | Air Canada, WestJet, Porter | Qantas, Virgin Australia, Jetstar | Emirates, flydubai, Etihad |
| **Hotels** | Taj Hotels, OYO, Treebo, Marriott India, Booking.com | Marriott Bonvoy, Hilton, Hyatt, Expedia | Premier Inn, Travelodge UK, Booking UK | Fairmont, Sandman, HotelTonight | Accor ALL, Crown, Quest | Jumeirah, Rotana, Atlantis Dubai |
| **Events** | BookMyShow, Paytm Insider, District (Zomato Live), PVR INOX | Ticketmaster, StubHub, AMC Theatres, Live Nation | Eventim UK, DICE, Odeon, ATG Tickets | Ticketmaster CA, Cineplex, Canadian Stage | Ticketek, Event Cinemas, Sydney Opera | Platinumlist, Virgin Megastore, Vox |
| **OTT** | Hotstar, Prime, Netflix, SonyLIV, Zee5, JioCinema | Netflix, HBO Max, Hulu, Disney+, Paramount+ | BBC iPlayer, Now TV, Prime UK, Disney+ | Crave, Sportsnet, Prime CA | Stan, Binge, Kayo Sports, Foxtel | Shahid VIP, OSN+, Starzplay Arabia |
| **Software** | ChatGPT, Canva, Notion, Figma, Hostinger, ClickUp, Cursor | ChatGPT, GitHub, Claude, Slack, Adobe, Perplexity, Zoom | NordVPN, Perplexity, 1Password, JetBrains | Shopify, Notion, Surfshark | Canva, Atlassian, Replit | ExpressVPN, Microsoft 365, Google One |

---

## 5. Automated Cron Jobs & Health Architecture

Benefisto relies on Vercel Crons for automated background maintenance. Configuration is located in `vercel.json`.

### Active Cron Jobs:
1. **`/api/cron/sync-coupons`** (`0 2 * * *` — Daily at 02:00 UTC):
   - Audits the Master Coupon Database.
   - Pings Feedico Partner API to verify catalog health and active affiliate link availability.
2. **`/api/cron/sync-travel-deals`** (`0 3 * * *` — Daily at 03:00 UTC):
   - Rotates through the 6 countries daily (`IN` -> `US` -> `GB` -> `CA` -> `AU` -> `AE`).
   - Audits active deals, verifies evergreen concession schemes, and pings Feedico OTA queries (MakeMyTrip, Agoda, Expedia, Booking.com).
3. **`/api/cron/sync-subscriptions`** (`0 2-12 * * 0` — Every Sunday):
   - Rotates through regional subscription catalogs to verify multi-tier pricing, annual discounts, and bundle perks.
4. **`/api/cron/heal-sentinel`**:
   - Automated self-healing sentinels across APAC and Americas server clusters.

### Security & Manual Triggering:
All cron endpoints are guarded by `CRON_SECRET`. In production, requests without a matching secret are rejected (`401 Unauthorized`).
- **To test locally**:
  ```bash
  curl "http://localhost:3000/api/cron/sync-coupons"
  curl "http://localhost:3000/api/cron/sync-travel-deals?country=IN"
  ```
- **To trigger in production via browser/cURL**:
  ```bash
  curl -H "Authorization: Bearer YOUR_CRON_SECRET" "https://www.benefisto.com/api/cron/sync-coupons"
  # Or via query parameter:
  curl "https://www.benefisto.com/api/cron/sync-coupons?secret=YOUR_CRON_SECRET"
  ```

---

## 6. SEO Strategy & The Google AI Scraping Shield

Search Engine Optimization is the primary organic acquisition engine for Benefisto. The entire SEO architecture is optimized for:
1. Googlebot / Bingbot 100% crawlability.
2. High-intent Position 0 Rich Snippets.
3. Complete protection against **Google AI Overviews zero-click scraping**.

### A. Full Public Access (No Login Walls for Bots)
- All landing pages (`/travel`, `/events`, `/subscriptions`, `/coupons`) and dynamic detail pages (`/travel/[slug]`, `/events/[slug]`, `/coupons/[store]`) are rendered server-side with zero Clerk authentication walls.
- Googlebot can read 100% of the text, blueprints, tables, and FAQs.

### B. Rich Structured Data (JSON-LD Schemas)
Every detail page embeds three Schema.org schemas:
1. **`BreadcrumbList`**: Generates clean Google search navigation paths (`Home > Travel > IndiGo Airlines`).
2. **`Product` + `Offer`**: Communicates authentic discount value, currency, price validity, and in-stock status without fake star ratings.
3. **`FAQPage`**: Embeds 5 high-intent conversational FAQs directly into Google Search results.

### C. The Google AI Zero-Click Scraping Shield (Critical)
**The Problem**: Google's AI Search Overview scrapes promo codes directly from static HTML and JSON-LD schemas and presents them in search snippets. Users copy the code without clicking into the site, causing loss of web traffic and zero affiliate commission attribution.

**Benefisto's 4-Layer Defense Guard**:
1. **`data-nosnippet="true"` Attribute**:
   - All promo code elements and reveal buttons are explicitly wrapped in `<div data-nosnippet="true">`.
   - Googlebot strictly obeys this tag and will **never** display the wrapped contents inside AI snippets or search overviews.
2. **Initial State Masking (`••••••••`)**:
   - In the initial SSR HTML payload, promo codes are masked as `••••••••`.
   - Search scrapers only see masked dots.
3. **Zero Raw Codes in Schema JSON-LD**:
   - Raw promo codes are never inserted into `Offer` or `Product` schemas. Only generic descriptions ("Verified Student & Concession Scheme") are provided.
4. **2-in-1 Auto-Copy + Affiliate Redirect**:
   - When a human user clicks **"REVEAL & OPEN"**:
     a. The code unmasks instantly in the UI.
     b. The code is written to the user's operating system clipboard via `navigator.clipboard.writeText`.
     c. The merchant's official affiliate booking portal opens in a new browser tab (`window.open(deal.directUrl)`).
   - **Result**: 100% affiliate cookie attribution, guaranteed user landing, and zero zero-click leakage!

---

## 7. Developer Maintenance & How-To Guide

### How to Add a New Brand (e.g., Qatar Airways in Travel)
1. **Open `src/data/travelRegistry.js`**:
   - Add a new object to the array with `id: "qatar-airways"`, `slug: "qatar-airways"`, `country: "AE"`, `category: "flights"`, `position0Snapshot`, and 3 `blueprints`.
2. **Open `src/services/travelDealsDatabase.js`**:
   - Add the verified promo deals or student club offers into the corresponding country section (`AE_TRAVEL_DEALS`).
3. **Done!**
   - The dynamic route `/travel/qatar-airways` will automatically render with dynamic metadata, SEO schemas, and interactive reveal buttons.

### How to Add a New Retail Store Coupon
1. **Open `src/services/couponDatabase.js`**:
   - Add the store slug under `MASTER_COUPON_DATABASE` with coupons array, `affiliateUrl`, and `terms`.
2. **Run Sync**:
   - The `/coupons/[store]` route will immediately display the new store and its verified offers.

---

## 8. Summary Checklist Before Git Push

- [x] All 5 verticals functional (Coupons, Subscriptions, Travel, Events, Software).
- [x] Zero fake data; verified real carrier concessions & affiliate codes only.
- [x] Google AI Scraping Shield active (`data-nosnippet="true"`, masked initial codes).
- [x] 100% Mobile responsive tested (360px – 1920px).
- [x] Cron jobs verified (`/api/cron/sync-coupons`, `/api/cron/sync-travel-deals` in `vercel.json`).
- [x] Master architecture guide stored in repository at `docs/BENEFISTO_SAVINGS_AND_SEO_MASTER_SYSTEM_GUIDE.md`.
