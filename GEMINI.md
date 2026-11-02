# ShopSmart AI — Master Architecture Constitution & Memory Lock
**File:** `GEMINI.md` (Project Root)  
**Status:** PERMANENT ARCHITECTURE LOCK & SINGLE SOURCE OF TRUTH  
**Last Updated:** 2026-11-02  

> **CRITICAL DIRECTIVE FOR ALL AI AGENTS & DEVELOPERS:**  
> This file is the **immutable single source of truth** for ShopSmart AI. Before proposing any technical strategy, writing any code, or modifying existing features, you **MUST strictly read and adhere to all decisions, rejected paths, and architectural boundaries locked in this document**.  
> **NEVER re-suggest a rejected idea. NEVER invent dummy data. NEVER hallucinate coupon codes.**

---

## 1. Core Product Identity & Business Model (The Real Vision)

ShopSmart AI is **NOT a generic coupon website**, nor a generic affiliate blog. It is an **AI-driven shopping and savings assistant** operating on a proven two-tier monetization model:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             SHOPSMART AI TWO-TIER MODEL                          │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │
        ┌────────────────────────────────┴────────────────────────────────┐
        ▼                                                                 ▼
┌──────────────────────────────────────────────┐  ┌──────────────────────────────────────────────┐
│  TIER 1: THE CORE USP & MONETIZATION ENGINE  │  │  TIER 2: MULTI-VERTICAL GLOBAL DATA ENGINE   │
│  Guaranteed Instant Discounts (Powered by    │  │  Free Organic Traffic, Travel & Coupons      │
│  Runa - runa.io)                             │  │  (Powered by Feedico Partner Program)        │
├──────────────────────────────────────────────┤  ├──────────────────────────────────────────────┤
│ • Passes 100% of wholesale margin (8%-15%)   │  │ • 48,000+ Global Brands (7 Major Networks:   │
│   directly to the shopper at checkout.       │  │   CJ, Impact, Awin, Admitad, Partnerize).    │
│ • Category: Zero-return daily services       │  │ • Verticals Covered: Retail, Flights,        │
│   (Food, Cabs, Groceries, Fast Fashion).     │  │   Hotels, SaaS Subscriptions, Pharmacy.      │
│ • Merchants: Zomato, Swiggy, Uber, Domino's, │  │ • Delivery: Daily Bulk Sync (Cron) + Instant │
│   DoorDash, Deliveroo, Blinkit, Zepto.       │  │   On-Demand Lookup via POST /catalog/coupons.│
│ • Zero expired codes. Zero cashback waiting. │  │ • Cost: $0.00 upfront. No monthly seat fees. │
│ • Instant App Deep-Links with pre-loaded     │  │ • Monetization: 65% publisher revenue share  │
│   merchant wallet credits.                   │  │   on matched sales paid via Payoneer.        │
└──────────────────────────────────────────────┘  └──────────────────────────────────────────────┘
```

### Technical Integration Blueprint for Feedico (`api.feedico.io`)
- **Primary Endpoint**: `POST https://api.feedico.io/api/v1/catalog/coupons`
- **Authentication**: Bearer Token (`fdco_...` generated from partner dashboard post domain verification)
- **Daily Cron Mode**: Batch pagination (`{"page": 1, "pageSize": 100}`) to refresh top 100 multi-vertical deals in Redis.
- **On-Demand Search Mode**: Targeted merchant filter (`{"firmName": "<brand>", "pageSize": 20}`) responding in ~200ms.
- **Fail-Honest Policy**: If Feedico has 0 active coupons for a brand, return honest "No active coupon available" (zero AI hallucination).

### Routing Logic (How Links are Resolved)
```javascript
if (merchant.hasDirectPartnership || merchant.category in ["food", "cabs", "groceries"]) {
  // TIER 1: Runa Guaranteed Wholesale Deep-Link (100% Margin to User / Retention Driver)
  return runa.generatePreloadedAppDeepLink(merchant);
} else {
  // TIER 2: Feedico Managed Catalog /go link (Travel, Flights, Hotels, SaaS, Retail - 65% Rev-Share)
  return feedico.getTrackedGoLink(merchant);
}
```

---

## 2. Permanently Rejected / Blacklisted Decisions (DO NOT REPEAT)

| Rejected Approach | Why It Was Permanently Rejected (The Real Reason) |
| :--- | :--- |
| ❌ **Scraping Brand Websites with Zyte for Coupons** | Brands do **NOT** publish coupon codes on homepages. Sites have constantly mutating React/Angular layouts that break weekly. Heavy WAF shields (Akamai/Cloudflare/DataDome) block datacenter IPs in US, UK, and CA. |
| ❌ **Expensive B2B Coupon Subscriptions ($50–$100/mo)** | Platforms like CouponAPI.org ($49/mo) and LinkMyDeals ($3/store min 50 stores = $150/mo) impose heavy fixed monthly commitments before traction. Rejected in favor of $0/mo Feedico Partner Program. |
| ❌ **AI-Generated / Hallucinated Coupon Codes (`SAVE10`, `${brand}SAVE`)** | Fake codes fail at merchant checkout, destroying customer trust. If a code is not verified from live feeds, return an honest "No active coupon available" message. |
| ❌ **Traditional Post-Booking Cashback Portals (30–60 Day Wait)** | Users despise waiting 2 months for ₹50 cashback. Instant, on-the-spot checkout price cuts win every time. |
| ❌ **Day-1 Direct Affiliate Applications (CJ / Impact / Awin)** | Direct brand applications (Nike, Samsung) take weeks to review and get declined for new sites without existing high traffic. Feedico bypasses this via pre-approved master accounts. |
| ❌ **Fake Fallbacks in TrustSheet (Replacing Washing Machine with Phone)** | Violates the Fail-Honest rule. If Zyte fails to scrape authentic PDP details, report the failure honestly instead of substituting a smartphone from OpenWeb. |
| ❌ **Public Review Citations in TrustSheet** | Scraping and publishing third-party user reviews incurs legal and defamation liabilities. All TrustSheet analysis must be **strictly spec-grounded** from manufacturer datasheets. |
| ❌ **Self-Ticketing / In-App Merchant of Record in Travel** | Avoids IATA licensing, 24/7 emergency support call centers, baggage disputes, and airline refund liabilities. |
| ❌ **Code Modification by Autonomous Watchdogs** | Autonomous bots/AI must NEVER edit, mutate, or "auto-fix" `.js`/`.jsx` files in production. Maintenance is strictly 100% passive, read-only observability. |
| ❌ **RAG Mixed Inventory Pool (`consultAiShopkeeper`) in Shopping Search** | Blocked queries from reaching OpenWeb Ninja, force-fed a mixed 40-item pool (cameras + laptops + washing machines) into search responses, and corrupted category relevance. Removed permanently. |
| ❌ **Hardcoded 'Today\'s Deals' Category Explorer (`today_deals`)** | Burned expensive OpenWeb Ninja API credits for non-intent browsers using hardcoded generic search queries (`laptop special offer deals`). Distracted from high-intent shopping search, pharmacy, verified coupons, and smart terminal. Permanently removed. |

---

## 3. Vertical-by-Vertical Architectural Specifications

### 3.1. Shopping Search & Comparison (The Pure 2-Call Model)
- **Call #1 (`/api/search`)**: Exactly **1 single API call** via OpenWeb Ninja. Returns 15–20 live products in ~1s. Exactly **3 cards** displayed (`slice(0, 3)`). Smart filter chips filter in-memory with **0 API calls**.
- **Call #2 (`/api/products/compare`)**: Exactly **1 call** triggered **ONLY** when the user clicks the "Compare Prices" drawer.
- **Strict Truthfulness**: NEVER synthesize fake stores with artificial markups. Only display verified direct PDP links.
- **24-Hour Synchronized Redis TTL**: Search results, direct PDPs, and comparison pools expire together after 24 hours (`cache:inventory:pool:v2:<country>`).

### 3.2. Hardware TrustSheet (`TrustSheetView.jsx` & `trustSheetService.js`)
- **Domestic India Focus**: 100% active for Indian e-commerce (Flipkart, Amazon.in, Croma, Brand stores) where direct extraction has >95% reliability.
- **Non-Indian Countries**: High-converting **"Coming Soon"** teaser screen highlighting 3 value pillars with a 1-click `🇮🇳 Experience Live India Edition` preview button.
- **Zero "N/A" Hardware Deduction**: LLM prompt forces deduction of 6–8 authentic manufacturer specifications (Capacity, RPM, Inverter Motor, Star Rating, Heater) directly from title, features, breadcrumbs, and raw description.
- **Clean 6-Module UI Architecture**:
  1. Header (Verified photo, title, live price, Buy Now, compare trigger).
  2. Reality Specifications Sheet (8 clean specs, zero "N/A").
  3. Genuine Strengths vs Realistic Gotchas.
  4. Who Should BUY vs Who Should SKIP Decision Matrix.
  5. Net Effective Savings Strategy & True Daily Cost (₹18/day).
  6. Spec-Grounded AI Assistant & On-Demand Multi-Store Comparison Drawer.

### 3.3. Coupons & Deals Engine (`couponService.js`, `CouponCard.jsx`)
- **India Hyperlocal Layer**: Dedicated in-memory & Redis master registry (`MASTER_COUPON_DATABASE`) covering 50+ stores (Zomato, Swiggy, Blinkit, Zepto, Domino's, Myntra, Ajio, Nykaa).
- **Global & E-commerce Layer**: Feedico Partner Program (`feedico.io`) ready catalog for US, UK, CA, AU, AE, IN ($0 cost, 65% rev-share).
- **Core Savings Layer**: Runa (`runa.io`) wholesale digital value deep-links for Food, Cabs, Groceries.
- **AI Cart Scanner (`calculateBestCartCoupon`)**: Gemini Vision detects store name and cart total from checkout screenshots, calculating highest net savings.

### 3.4. Subscriptions & Software Hub (`SubscriptionsView.jsx`)
- Pre-curated 6-country catalog (`subscriptionsCatalog.js`, `subscriptionsCatalogUS.js`, `subscriptionsCatalogAE.js`, etc.) for SaaS, OTT, AI tools, and Developer stacks.
- On-Demand discovery powered by Groq/Gemini AI blueprints with verified tax/student write-off guides.

### 3.5. Travel Hub (`TravelHubView.jsx`)
- Curated airline, hotel, and ride-hailing deals across 6 countries.
- On-Demand radar discovery with safe AI grounded fallback if external portals time out.
- Shimmer skeleton loaders for smooth UX during background sync.

### 3.6. Virtual Try-On (VTON)
- Strictly isolated **3 lifetime free trials** per device/account tracked via SHA-256 hardware fingerprints and IP rate-limiters in Redis (`vton:free_quota:account_lifetime:<id>`).

---

## 4. Multi-Country Strategy (6 Target Geographies)

| Country Code | Currency | Primary Runa / Food & Cab Focus | Primary Retail & Coupon Focus |
| :---: | :---: | :--- | :--- |
| **IN** | ₹ (INR) | Zomato, Swiggy, Domino's, Uber India, Blinkit, Zepto | Flipkart, Amazon.in, Myntra, Nykaa, Croma |
| **US** | $ (USD) | DoorDash, Uber Eats, Uber US, Lyft, Starbucks, Chipotle | Walmart, Target, Nike US, Best Buy, Sephora |
| **GB / UK** | £ (GBP) | Deliveroo, Just Eat, Uber Eats UK, Bolt UK, Costa Coffee | ASOS, Currys, Argos, Marks & Spencer |
| **CA** | C$ (CAD) | SkipTheDishes, DoorDash Canada, Uber Canada, Tim Hortons | Canadian Tire, Best Buy Canada, Hudson's Bay |
| **AU** | A$ (AUD) | Uber Australia, Didi Australia, Menulog | Woolworths, Coles, JB Hi-Fi, The Iconic |
| **AE** | AED | Talabat, Careem, Noon Food, Deliveroo UAE | Noon, Amazon.ae, Sharaf DG, Namshi |

---

## 5. Security & Rate-Limiting Protocols (Non-Negotiable)

1. **"Read Open, Act Protected" Architecture**:
   - Googlebot, crawlers, and unauthenticated visitors can browse all coupon listings, store catalogs, OTT plan matrices, and travel deals freely (**0 login friction, maximum SEO indexing**).
   - Clerk authentication (`openSignIn()`) intercepts high-value write actions: revealing masked promo codes, clicking deep links, triggering VTON renders, asking AI advisors.
2. **Unified 10-Daily AI Quota**:
   - Centralized utility `checkUnifiedApiQuota({ limit: 10 })` enforces a daily limit of **10 AI operations per user** resetting at 12:00 AM IST via Redis sliding window counters.
   - Cache hits and static browsing consume **0 credits**.
3. **Environment & Keys Protection**:
   - Production keys (OpenWeb Ninja, Gemini, Groq, Zyte, Redis, Clerk) must remain strictly guarded.
   - Never commit `.env` or `.env.local` files to Git.

---

## 6. Rules for All Future Code Changes

1. **Check this file FIRST**: Before implementing any coupon, travel, search, or TrustSheet feature, verify it does not contradict Section 1, 2, or 3.
2. **Zero Dummy Data**: If an API or scrape fails, fail honestly. Do not generate synthetic mock objects or fabricate imaginary coupon codes.
3. **Keep Mobile UI Polished**: Always ensure flexbox containers have `min-w-0`, buttons have `shrink-0`, and modals have adequate bottom padding (`pb-24`) to prevent bottom navigation bar overlap.
4. **Preserve Documentation**: Update `DEVELOPMENT_LOG.md` upon any production Git release.

---
**END OF CONSTITUTION — IMMUTABLE ARCHITECTURE LOCK**
