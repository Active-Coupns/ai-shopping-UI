# ShopSmart AI — Master Architecture Constitution & Memory Lock
**File:** `GEMINI.md` (Project Root)  
**Status:** PERMANENT ARCHITECTURE LOCK & SINGLE SOURCE OF TRUTH  
**Last Updated:** 2026-11-05  

> **CRITICAL DIRECTIVE FOR ALL AI AGENTS & DEVELOPERS:**  
> This file is the **immutable single source of truth** for ShopSmart AI. Before proposing any technical strategy, writing any code, or modifying existing features, you **MUST strictly read and adhere to all decisions, rejected paths, and architectural boundaries locked in this document**.  
> **NEVER re-suggest a rejected idea. NEVER invent dummy data. NEVER hallucinate coupon codes. NEVER introduce middleman affiliate networks (Cuelinks, EarnKaro).**

---

## 1. Core Product Identity & Phased Architecture Roadmap

ShopSmart AI is **NOT a generic coupon website**, nor a spammy affiliate blog. It is an **AI-driven shopping, pharmacy, hardware reality check, and savings assistant** operating on a **Strict Two-Phase Phased Rollout**:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        SHOPSMART TWO-PHASE ARCHITECTURE ROADMAP                        │
├───────────────────────────────────────────┬────────────────────────────────────────────┤
│ PHASE 1: DAY-1 LAUNCH & TRUST (DAYS 1-40) │ PHASE 2: WHOLESALE TRAVEL (DAY 40 ONWARD)  │
├───────────────────────────────────────────┼────────────────────────────────────────────┤
│ • Zero Legal Friction, 100% Compliant     │ • High-Leverage B2B Wholesale Fares        │
│ • Shopping Search & Price Comparison      │ • Closed User Group (CUG) Free Club Pass   │
│ • Hardware AI TrustSheet (Global Specs)   │ • Flights: Duffel NDC Net Fares            │
│ • Bright Data Web Unlocker (72M+ IPs)     │ • Hotels: Agoda B2B / Hotelbeds Net Rates  │
│ • Virtual Try-On (VTON Cloth Studio)      │ • Buses: Distribusion / Omio B2B Net Rates │
│ • Coupons: Feedico Managed Catalog        │ • Events: Ticket Evolution Live Tickets    │
│ • Pharmacy: Apollo 24|7 & Tata 1mg (IN)   │ • Guaranteed Cards: Blackhawk/CardCash/Raise│
│ • Rx Discounts: GoodRx API (US ZIP/Card)  │ • Rate Parity Legal Shield via CUG         │
│ • Supplements: iHerb (180+ Countries)     │ • Zero In-App Payment Liability (Redirect) │
│ • Supplements: HealthKart Lab-Certified   │ • Full Blueprint: STRATEGY_BLUEPRINT_...   │
│ • UK/CA Pharmacy: Pharmacy2U & Well.ca    │                                            │
│ • Software & SaaS Savings Terminal (NEW): │                                            │
│   - Tier 1 (Startups): Secret Credits     │                                            │
│   - Tier 2 (Existing): NachoNacho + Vault │                                            │
│ • Single Master Account on Impact.com     │                                            │
└───────────────────────────────────────────┴────────────────────────────────────────────┘
```

### 1.1. Phase 1 vs Phase 2 Core Distinction
1. **Phase 1 (Day-1 Launch & Trust Building, Days 1–40)**:
   - Zero legal risks, zero Rate Parity concerns, immediate approval velocity.
   - Built around the shopping search engine, spec-grounded TrustSheet powered by Bright Data Web Unlocker, VTON cloth trial, Feedico verified coupons, **direct pharmacy/supplement partnerships** (Tata 1mg, Apollo 24|7, GoodRx, iHerb, HealthKart), and **Verified SaaS & Software Savings Terminal** (Tier 1: Secret for Startups + Tier 2: NachoNacho & In-House Vault for Existing Users).
   - High customer lifetime value (LTV) and monthly repeat orders (daily consumables, software renewals, and medicines).
2. **Phase 2 (Wholesale B2B Expansion, Day 40 onward)**:
   - Activated after 30–40 days of verified user traffic and organic traction.
   - High-ticket travel (Flights via Duffel, Hotels via Agoda B2B/Hotelbeds, Intercity Buses via Distribusion/Omio), Live Events (Ticket Evolution), and Secondary Gift Card Liquidation Pools (Blackhawk/CardCash/Raise).
   - Legally shielded by the **"ShopSmart Club" 90-Day Free Pass (CUG Membership)** to bypass hotel/airline Rate Parity restrictions.
   - Reference: see [`STRATEGY_BLUEPRINT_PARTNERSHIP.md`](file:///C:/Users/ASUS/.gemini/antigravity/scratch/ai-shopping-assistant/STRATEGY_BLUEPRINT_PARTNERSHIP.md) for full operational blueprints and approval ledgers.

---

## 2. Permanently Rejected / Blacklisted Decisions (DO NOT REPEAT)

| Rejected Approach | Why It Was Permanently Rejected (The Real Reason) |
| :--- | :--- |
| ❌ **Datacenter-based Basic HTTP Scraping (Zyte Basic API)** | Datacenter IPs are instantly flagged and blocked by enterprise WAFs (Akamai on Croma, PerimeterX on Walmart) with 14-byte empty payloads or misclassified warranty upsells. Permanently replaced by Bright Data Web Unlocker with 72M+ residential IPs. |
| ❌ **Third-Party Affiliate Brokers / Aggregators (Cuelinks, EarnKaro)** | Take heavy middleman revenue cuts (20%–40%), delay approval cycles for new domains, lack direct merchant API control, and fail to provide on-the-spot checkout discount codes for users. Permanently replaced by direct publisher integrations via Impact.com and iHerb. |
| ❌ **Forced Generic Medicine Substitution for Prescribed Branded Drugs** | Forcing generic salt substitution when a patient searches for a doctor-prescribed branded medicine (e.g., Augmentin, Lipitor, Telma) destroys trust and introduces medical friction. ShopSmart preserves prescribed branded drugs, comparing authentic marketplace prices (Netmeds, PharmEasy, MRP) while delivering flat 18% partner discounts via Apollo 24|7 and Tata 1mg. |
| ❌ **Scraping Brand Websites with Basic HTML Parsers for Coupons** | Brands do **NOT** publish coupon codes on homepages. Sites have constantly mutating React/Angular layouts that break weekly. Heavy WAF shields block datacenter IPs. Replaced with Feedico catalog. |
| ❌ **Expensive B2B Coupon Subscriptions ($50–$100/mo)** | Platforms like CouponAPI.org ($49/mo) and LinkMyDeals ($3/store min 50 stores = $150/mo) impose heavy fixed monthly commitments before traction. Rejected in favor of $0/mo Feedico Partner Program. |
| ❌ **AI-Generated / Hallucinated Coupon Codes (`SAVE10`, `${brand}SAVE`)** | Fake codes fail at merchant checkout, destroying customer trust. If a code is not verified from live feeds, return an honest "No active coupon available" message. |
| ❌ **Traditional Post-Booking Cashback Portals (30–60 Day Wait)** | Users despise waiting 2 months for ₹50 cashback. Instant, on-the-spot checkout price cuts win every time. |
| ❌ **Day-1 Direct Brand Applications (Nike, Samsung on CJ / Awin)** | Direct tier-1 brand applications take weeks to review and get declined for new sites without existing high traffic. Feedico and master publisher networks bypass this. |
| ❌ **Fake Fallbacks in TrustSheet (Replacing Washing Machine with Phone)** | Violates the Fail-Honest rule. If authentic PDP details cannot be extracted, report the failure honestly instead of substituting a smartphone from OpenWeb. |
| ❌ **Public Review Citations in TrustSheet** | Scraping and publishing third-party user reviews incurs legal and defamation liabilities. All TrustSheet analysis must be **strictly spec-grounded** from manufacturer datasheets. |
| ❌ **Self-Ticketing / In-App Merchant of Record in Travel or Pharmacy** | Avoids IATA licensing, drug dispensing liabilities, 24/7 emergency support call centers, baggage disputes, and airline refund liabilities. Hosted checkout / affiliate redirection only. |
| ❌ **Code Modification by Autonomous Watchdogs** | Autonomous bots/AI must NEVER edit, mutate, or "auto-fix" `.js`/`.jsx` files in production. Maintenance is strictly 100% passive, read-only observability. |
| ❌ **RAG Mixed Inventory Pool (`consultAiShopkeeper`) in Shopping Search** | Blocked queries from reaching OpenWeb Ninja, force-fed a mixed 40-item pool into search responses, and corrupted category relevance. Removed permanently. |
| ❌ **Hardcoded 'Today\'s Deals' Category Explorer (`today_deals`)** | Burned expensive OpenWeb Ninja API credits for non-intent browsers. Distracted from high-intent shopping search, pharmacy, verified coupons, and smart terminal. Permanently removed. |
| ❌ **Runa / Gift Card Reselling & Wallet Loading Model** | Imposes heavy payment gateway processing overhead, KYC compliance, customer chargeback risks, digital code theft vulnerabilities, and high user UX friction. Permanently replaced with direct B2B Wholesale Net-Rate APIs and verified promo codes. |

---

## 3. Vertical-by-Vertical Architectural Specifications

### 3.1. Shopping Search & Comparison (The Pure 2-Call Model)
- **Call #1 (`/api/search`)**: Exactly **1 single API call** via OpenWeb Ninja. Returns 15–20 live products in ~1s. Exactly **3 cards** displayed (`slice(0, 3)`). Smart filter chips filter in-memory with **0 API calls**.
- **Call #2 (`/api/products/compare`)**: Exactly **1 call** triggered **ONLY** when the user clicks the "Compare Prices" drawer.
- **Strict Truthfulness**: NEVER synthesize fake stores with artificial markups. Only display verified direct PDP links.
- **24-Hour Synchronized Redis TTL**: Search results, direct PDPs, and comparison pools expire together after 24 hours (`cache:inventory:pool:v2:<country>`).

### 3.2. Hardware TrustSheet (`TrustSheetView.jsx` & `trustSheetService.js`)
- **Universal Global Availability**: 100% active across all 6 core geographies (**IN, US, GB/UK, CA, AU, AE**).
- **Bright Data Web Unlocker Engine (`brightDataService.js`)**: Routes requests through 72M+ residential proxies dynamically mapped to user's country code (`in`, `us`, `gb`, `ca`, `au`, `ae`). Bypasses Akamai Bot Manager, PerimeterX, and Cloudflare challenges with 99.9% success.
- **Strict 3-Layer Security**:
  1. **SSRF & Private Network Shield**: `isSafeExternalUrl` rejects `169.254.169.254`, `localhost`, `127.0.0.1`, and private subnets (`10.x`, `192.168.x`) before calling Bright Data.
  2. **Zero Vercel IP Leakage**: Retailers only see Bright Data residential proxies; Vercel server IP is 100% invisible.
  3. **Rate Limiting & Redis Quota Guard**: Strict 10-daily AI operations per user/IP enforced via Upstash Redis sliding window.
- **Zero "N/A" Hardware Deduction**: LLM prompt forces deduction of 6–13 authentic manufacturer specifications directly from extracted HTML and JSON-LD schema.
- **Clean 6-Module UI Architecture**:
  1. Header (Verified photo, title, live price, Buy Now, compare trigger).
  2. Reality Specifications Sheet (8–13 clean specs, zero "N/A").
  3. Genuine Strengths vs Realistic Gotchas.
  4. Who Should BUY vs Who Should SKIP Decision Matrix.
  5. Net Effective Savings Strategy & True Daily Cost (₹18/day).
  6. Spec-Grounded AI Assistant (Universal inquiry prompt, zero static generic chips) & On-Demand Multi-Store Comparison Drawer.

### 3.3. Pharmacy, Branded Medicines & Supplements Hub (Phase 1 Priority)
- **Direct Partner Network (Zero Middlemen)**:
  * **India (Branded Rx & OTC)**: Apollo 24|7 & Tata 1mg via direct merchant/Impact.com accounts. Auto-applied exclusive promo code (`SHOPSMART18`) granting flat 15%–18% off MRP with free doorstep delivery.
  * **India (Supplements)**: HealthKart Direct Partner Program. Batch lab-tested authentic sports nutrition & vitamins (Flat 10%–15% checkout discount).
  * **United States (Prescriptions)**: GoodRx API (`goodrx.com/developer`). Real-time local pharmacy comparison (CVS vs Walgreens vs Walmart) and digital Rx discount cards driven by `Medicine + ZIP Code` input.
  * **Global 180+ Countries (Supplements & Wellness)**: iHerb Global Partner Program (`iherb.com`). Auto-applied 10% coupon code across whey protein, omega-3, multivitamins, and clean skincare in local currencies.
  * **UK & Canada**: Pharmacy2U (UK) and Well.ca (CA) via Impact.com master publisher account.
- **Dual-Model UX Presentation**:
  * **India & Global**: Unified Privilege Medicine Card displaying open-market comparison (PharmEasy, Netmeds, MRP) alongside an exclusive ShopSmart Partner Box with instant 18% checkout savings.
  * **US GoodRx Flow**: Location-aware input (`Medicine + ZIP Code`) displaying local pharmacy discount cards.

### 3.4. Coupons & Deals Engine (`couponService.js`, `CouponCard.jsx`)
- **India Hyperlocal Layer**: Dedicated in-memory & Redis master registry (`MASTER_COUPON_DATABASE`) covering 50+ stores (Zomato, Swiggy, Blinkit, Zepto, Domino's, Myntra, Ajio, Nykaa).
- **Global & E-commerce Layer**: Feedico Partner Program (`feedico.io`) ready catalog for US, UK, CA, AU, AE, IN ($0 cost, 65% rev-share, Bearer `fdco_` token).
- **AI Cart Scanner (`calculateBestCartCoupon`)**: Gemini Vision detects store name and cart total from checkout screenshots, calculating highest net savings.

### 3.5. Phase 2: Wholesale Travel & Subscriptions Hub
- **Flights**: Duffel Headless NDC API (`duffel.com`) delivering wholesale net fares across 300+ airlines. 0% markup passed to traveler.
- **Hotels**: Agoda B2B Partner Solutions & Hotelbeds Wholesale Net Rates.
- **Intercity Buses & Rail**: Distribusion API & Omio B2B net fares across 500+ operators in Europe & North America (FlixBus, National Express, ALSA).
- **Live Events & Concerts**: Ticket Evolution B2B Network (Sports, Concerts, Broadway).
- **SaaS & Cloud**: Secret B2B Partner Program (`joinsecret.com`) for $1,000+ founder software credits.
- **Legal Shield**: "ShopSmart Club" 90-Day Free Pass (CUG Membership Doctrine) to legally nullify hotel/airline Rate Parity restrictions.
- **Proactive Deflection Webhook**: Instant post-booking transactional email containing carrier 24/7 direct helpline, emergency email, and 1-click self-service cancellation link to deflect 100% of customer support queries.

### 3.6. Virtual Try-On (VTON Cloth Studio)
- Strictly isolated **3 lifetime free trials** per device/account tracked via SHA-256 hardware fingerprints and IP rate-limiters in Redis (`vton:free_quota:account_lifetime:<id>`).
- Client-side high-contrast fabric rendering: `[image-rendering:-webkit-optimize-contrast] contrast-[1.03] saturate-[1.02]`.

---

## 4. Multi-Country Strategy (6 Target Geographies)

| Country Code | Currency | Primary Food & Cab Focus | Primary Pharmacy & Health Focus | Primary Retail & Coupon Focus |
| :---: | :---: | :--- | :--- | :--- |
| **IN** | ₹ (INR) | Zomato, Swiggy, Domino's, Uber India, Blinkit, Zepto | Apollo 24|7, Tata 1mg, HealthKart | Flipkart, Amazon.in, Myntra, Nykaa, Croma |
| **US** | $ (USD) | DoorDash, Uber Eats, Uber US, Lyft, Starbucks, Chipotle | GoodRx API (Local CVS, Walgreens, Walmart) | Walmart, Target, Nike US, Best Buy, Sephora |
| **GB / UK** | £ (GBP) | Deliveroo, Just Eat, Uber Eats UK, Bolt UK, Costa Coffee | Pharmacy2U, Boots, iHerb UK | ASOS, Currys, Argos, Marks & Spencer |
| **CA** | C$ (CAD) | SkipTheDishes, DoorDash Canada, Uber Canada, Tim Hortons | Well.ca, Rexall, iHerb Canada | Canadian Tire, Best Buy Canada, Hudson's Bay |
| **AU** | A$ (AUD) | Uber Australia, Didi Australia, Menulog | Chemist Warehouse, iHerb Australia | Woolworths, Coles, JB Hi-Fi, The Iconic |
| **AE** | AED | Talabat, Careem, Noon Food, Deliveroo UAE | Life Pharmacy, Aster, iHerb UAE | Noon, Amazon.ae, Sharaf DG, Namshi |

---

## 5. Security & Rate-Limiting Protocols (Non-Negotiable)

1. **"Read Open, Act Protected" Architecture**:
   - Googlebot, crawlers, and unauthenticated visitors can browse all coupon listings, store catalogs, OTT plan matrices, and travel deals freely (**0 login friction, maximum SEO indexing**).
   - Clerk authentication (`openSignIn()`) intercepts high-value write actions: revealing masked promo codes, clicking deep links, triggering VTON renders, accessing Phase 2 CUG wholesale net rates.
2. **Unified 10-Daily AI Quota**:
   - Centralized utility `checkUnifiedApiQuota({ limit: 10 })` enforces a daily limit of **10 AI operations per user** resetting at 12:00 AM IST via Redis sliding window counters.
   - Cache hits and static browsing consume **0 credits**.
3. **Environment & Keys Protection**:
   - Production keys (Bright Data, OpenWeb Ninja, Gemini, Groq, Redis, Clerk, Impact, Feedico) must remain strictly guarded.
   - Never commit `.env` or `.env.local` files to Git.

---

## 6. Rules for All Future Code Changes

1. **Check this file FIRST**: Before implementing any coupon, travel, search, pharmacy, or TrustSheet feature, verify it does not contradict Section 1, 2, or 3.
2. **Zero Dummy Data**: If an API or scrape fails, fail honestly. Do not generate synthetic mock objects or fabricate imaginary coupon codes.
3. **Keep Mobile UI Polished**: Always ensure flexbox containers have `min-w-0`, buttons have `shrink-0`, and modals have adequate bottom padding (`pb-24`) to prevent bottom navigation bar overlap.
4. **Preserve Documentation**: Update `DEVELOPMENT_LOG.md` upon any production Git release.
5. **No Middleman Networks**: Always prioritize direct merchant partner programs (Impact.com, iHerb, Feedico) over middleman affiliate networks (Cuelinks, EarnKaro).
6. **Zero Direct IP Scraping**: Never scrape retailer URLs using direct server sockets; route exclusively through Bright Data Web Unlocker residential proxy infrastructure.

---
**END OF CONSTITUTION — IMMUTABLE ARCHITECTURE LOCK**
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
