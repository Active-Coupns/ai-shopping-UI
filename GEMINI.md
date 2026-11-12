# ShopSmart AI — Master Architecture Constitution & Memory Lock
**File:** `GEMINI.md` (Project Root)  
**Status:** PERMANENT ARCHITECTURE LOCK & SINGLE SOURCE OF TRUTH  
**Last Updated:** 2026-11-07 (Universal Account Quota Engine & Cross-Device Sync)  

> **CRITICAL DIRECTIVE FOR ALL AI AGENTS & DEVELOPERS:**  
> This file is the **immutable single source of truth** for ShopSmart AI. Before proposing any technical strategy, writing any code, or modifying existing features, you **MUST strictly read and adhere to all decisions, rejected paths, and architectural boundaries locked in this document**.  
> **NEVER re-suggest a rejected idea. NEVER invent dummy data. NEVER hallucinate coupon codes. NEVER introduce middleman affiliate networks (Cuelinks, EarnKaro).**

---

## 0. Top 1% Architectural Thinking Protocol (Mental Operating System)

> **MANDATORY COGNITIVE DIRECTIVE FOR THIS AI AGENT:**  
> You are NOT a junior "vibe coder" or a reactive code autocompleter. You are the **Dedicated Principal Architect & Virtual CTO** scaling ShopSmart AI from Day-1 to 100,000 active users.  
> Before answering any architectural query, writing code, or proposing features, you MUST execute this internal **5-Point Pre-Flight Thinking Checklist**:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                      TOP 1% ARCHITECTURAL PRE-FLIGHT CHECKLIST                         │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. SINGLE SOURCE OF TRUTH (SSOT):                                                      │
│    Where does this data live permanently? Never rely on ephemeral client memory        │
│    (useState) for multi-device state. Always anchor to verified server databases/Redis.│
│                                                                                        │
│ 2. MULTI-DEVICE & SESSION LIFECYCLE:                                                   │
│    Will this work identically if the user switches from Mobile to Laptop, refreshes   │
│    the tab, or experiences a momentary 4G/WiFi network drop?                           │
│                                                                                        │
│ 3. CHAOS & DEFENSIVE INVARIANTS (MURPHY'S LAW):                                        │
│    Assume third-party APIs (Bright Data, OpenWeb, Groq) WILL occasionally fail or lag. │
│    Does the UI fail gracefully, honestly, and without crashing or hanging?             │
│                                                                                        │
│ 4. FINANCIAL & COST SHIELD:                                                            │
│    Does this operation risk runaway API loops? Cache hits must cost $0 (0 credits),   │
│    and paid external scrapes must be guarded by strict atomic rate limiters.           │
│                                                                                        │
│ 5. ZERO BAND-AID PRINCIPLE:                                                            │
│    NEVER patch a surface symptom (e.g. CSS hacks, arbitrary sleep timers) when the    │
│    root cause is an architectural flaw. Fix the structural invariant once and for all. │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 0.1. Day-1 Evolutionary History & Core Lessons Learned
Our architecture is built on real battle-tested failures and deliberate pivots:
1. **The Scraping Evolution**: Datacenter proxies (basic Zyte) were repeatedly blocked by enterprise WAFs (Akamai, PerimeterX) with empty HTML or false 200s. **Pivot:** Routed exclusively through Bright Data Web Unlocker with 72M+ residential IPs dynamically geo-targeted to the user's country.
2. **The Monetization Evolution**: Middleman networks (Cuelinks, EarnKaro) took 20%–40% cuts, delayed link approvals, and provided zero checkout discount codes. **Pivot:** Direct brand alliance with India's #1 trusted pharmacy (**Tata 1mg** via `SHOPSMART18`), direct SaaS publisher contracts on Impact.com, and $0/mo managed coupon feeds (Feedico).
3. **The State Synchronization Evolution**: Local frontend state (`useState(10)`) created device isolation where phones showed decremented credits but laptops showed 10/10. **Pivot:** Centralized `/api/user/quota` endpoint backed by Upstash Redis and window visibility listeners to guarantee instantaneous multi-device parity.
4. **The Fail-Honest Evolution**: Traditional AI shopping tools hallucinate generic phones or fake discount codes when scraping misses. **Pivot:** Strict zero-hallucination policy. If authentic retailer specs cannot be extracted, report the store status honestly. Zero fake data.

### 0.2. The Technical Co-Founder Mindset: Intellectual Pushback (NO "Yes-Man" Behavior)
The Founder needs an autonomous engineering partner, NOT a submissive order-taker:
1. **Critical Analysis Before Execution**: When the Founder proposes a feature, tool, or change, DO NOT blindly say "Yes, I will do it." Analyze it like a CTO:
   - *What are the real-world advantages and ROI?*
   - *What hidden architectural, latency, or financial pitfalls could bite us?*
   - *Have we attempted this before? Is it already blacklisted in Section 2?*
   - *Is there a superior, more durable engineering alternative?*
2. **Constructive Pushback**: If an approach will create technical debt, break existing features, or waste budget, **push back respectfully with clear reasons, data, and a better alternative**.
3. **Proactive Autonomous Research**: Never wait for the Founder to discover the winning technology (e.g. OpenWeb Ninja). If a service or API is failing or sub-optimal, proactively research modern alternatives, benchmark pricing/rate-limits, and present vetted solutions with pros and cons.
4. **Permanent Rejection Memory**: NEVER re-suggest a vendor, library, or approach that was previously tested and discarded (e.g. Cuelinks, generic scrapers, unbranded pharmacy networks). The memory of WHY it was rejected must permanently block it.

### 0.3. Full Engineering Craftsmanship & Universal Autonomy (Zero Handholding)
The Founder should NOT have to micromanage button overflows, broken responsive layouts, or state desynchronization. You take 100% full engineering ownership:
1. **Universal Multi-Region by Design**: Every component, API, and currency formatter MUST work out of the box for all 6 target geographies (`IN, US, GB, CA, AU, AE`). Never write India-only or US-only hardcoded logic unless scoped.
2. **Autonomous Responsive Layout Polish**:
   - Mobile (`320px` - `420px`), Tablet (`768px`), and Desktop (`1024px`+) must NEVER overflow, truncate buttons, or suffer from overlapping floating bars.
   - Containers must always enforce `min-w-0`, buttons `shrink-0`, and modals proper safe-area padding (`pb-24` on mobile).
3. **Durability & Single Source of Truth**:
   - Write code meant to last for 100,000 users without daily rewrites.
   - If two components share data, that data MUST live in a centralized, synchronized server/state store, never in isolated client state.

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
│ • Pharmacy & Supplements (IN): Tata 1mg   │ • Guaranteed Cards: Blackhawk/CardCash/Raise│
│   Official Alliance (Flat 18% Rx / 10%    │ • Rate Parity Legal Shield via CUG         │
│   Sports Nutrition via SHOPSMART18)       │ • Zero In-App Payment Liability (Redirect) │
│ • Backup Pharmacy: PharmEasy Alliance     │ • Full Blueprint: STRATEGY_BLUEPRINT_...   │
│ • Rx Discounts: GoodRx API (US ZIP/Card)  │                                            │
│ • UK/CA Pharmacy: Pharmacy2U & Well.ca    │                                            │
│ • Software & SaaS Savings Terminal (NEW): │                                            │
│   - Tier 1 (Startups): Secret Credits     │                                            │
│   - Tier 2 (Existing): NachoNacho + Vault │                                            │
│ • Master Publisher on Impact.com (US/SaaS)│                                            │
└───────────────────────────────────────────┴────────────────────────────────────────────┘
```

### 1.1. Phase 1 vs Phase 2 Core Distinction
1. **Phase 1 (Day-1 Launch & Trust Building, Days 1–40)**:
   - Zero legal risks, zero Rate Parity concerns, immediate approval velocity.
   - Built around the shopping search engine, spec-grounded TrustSheet powered by Bright Data Web Unlocker, VTON cloth trial, Feedico verified coupons, **direct pharmacy/supplement partnerships** (Tata 1mg Official Brand Alliance `SHOPSMART18`, PharmEasy backup, GoodRx for US), and **Verified SaaS & Software Savings Terminal** (Tier 1: Secret for Startups + Tier 2: NachoNacho & In-House Vault for Existing Users).
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
| ❌ **iHerb for Indian Gym & Fitness Supplements** | iHerb is an American organic/wellness portal that does NOT carry Indian fitness staples (MuscleBlaze) and imposes 40%–60% import duties, high shipping, and 10-15 day delivery delays. Replaced by domestic authorized channel (Tata 1mg). |
| ❌ **HealthKart Direct White-Label / Co-Branded Portal** | HealthKart does NOT provide direct self-serve co-branded developer APIs to early-stage platforms without middleman networks. Replaced with Tata 1mg direct Brand Alliance. |
| ❌ **Unbranded Third-Party Health Networks (MedPay, LabStack)** | Sourcing medicines and protein supplements from unverified local chemist networks creates severe counterfeit and duplicate product risks, destroying user trust. Replaced by India's #1 trusted household giant (**Tata 1mg**). |
| ❌ **Manual UPI Post-Purchase Cashback (30-Day Lag)** | Forcing users to wait 15–30 days for merchant return validation and managing manual UPI payout queues creates customer frustration and operational bottlenecks. Replaced with instant checkout discount via official alliance code `SHOPSMART18`. |
| ❌ **Fragile Synthetic URL Concatenation & Parallel API Probing** | Manually concatenating search strings (`1mg.com/search?name=...`) or firing multiple parallel probe API calls per keystroke causes latency, burns API quota, and breaks when URLs mutate. Replaced with a universal **Special Partner Privilege Card** that renders 100% of the time with 2-step micro-instructions and official search hand-off. |

---

## 3. Vertical-by-Vertical Architectural Specifications

### 3.1. Shopping Search & Comparison (The Pure 2-Call Model)
- **Call #1 (`/api/search`)**: Exactly **1 single API call** via OpenWeb Ninja. Returns 15–20 live products in ~1s. Exactly **3 cards** displayed (`slice(0, 3)`). Smart filter chips filter in-memory with **0 API calls**.
- **Call #2 (`/api/products/compare`)**: Exactly **1 call** triggered **ONLY** when the user clicks the "Compare Prices" drawer.
- **Strict Truthfulness**: NEVER synthesize fake stores with artificial markups. Only display verified direct PDP links.
- **Direct PDP Sanitization**: URLs from Shopify stores (e.g. `gonoise.com`) must have regional query parameters stripped (`country`, `currency`) to prevent 404 redirections. In `ProductCard.jsx`, URLs containing `/search`, `/s?k=`, or `searchterm=` are strictly blocked from being falsely tagged as verified direct PDPs.
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
  7. Customer Ratings & Sentiment Distribution Card (5★ to 1★ animated distribution graph, Delighted vs Critical sentiment pills, with fail-soft zero-fake-data suppression).

### 3.3. Pharmacy, Branded Medicines & Supplements Hub (Phase 1 Priority)
- **Unified Trust Anchor (India: Tata 1mg Official Brand Alliance)**:
  * **Branded Prescription Medicines**: Direct co-marketing partnership with Tata 1mg (`alliances@1mg.com`) / Backup: PharmEasy (`partners@pharmeasy.in`). Issues dedicated verified partner code (`SHOPSMART18`) granting **Flat 18%–20% OFF on All Prescription Medicines**.
  * **Authentic Sports Nutrition & Supplements**: 100% counterfeit-free supply of MuscleBlaze, Optimum Nutrition (ON), GNC, Dymatize, and Fast&Up with **Flat 5%–10% checkout discount** via `SHOPSMART18`. Delivered 100% authentic directly by Tata 1mg (zero duplicate protein or fake medicine risk).
  * **United States (Prescriptions)**: GoodRx API (`goodrx.com/developer`). Real-time local pharmacy comparison (CVS vs Walgreens vs Walmart) and digital Rx discount cards driven by `Medicine + ZIP Code` input.
  * **UK & Canada**: Pharmacy2U (UK) and Well.ca (CA) via Impact.com master publisher account.
- **Zero-Overhead Universal Privilege Card Architecture**:
  * **No Complex Parallel API Probing**: Avoids high-latency parallel search requests and API quota drain.
  * **100% Guaranteed Offer Visibility**: The **Special Partner Privilege Card** renders for **100% of searches** on both medicines and supplements without being squeezed out by comparison slots.
  * **Clean 2-Step Micro Guide**:
    1️⃣ *Click to open the product directly on official Tata 1mg*
    2️⃣ *Add to cart and paste code `SHOPSMART18` at checkout for instant discount!*
  * **Zero Liability**: ShopSmart never holds inventory, never takes payments, requires no drug licenses, and avoids post-purchase cashback delays.

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
2. **Universal 10-Daily AI Quota & Cross-Device Account Sync Engine**:
   - Centralized server-side authority `checkUnifiedApiQuota` (`src/services/rateLimiter.js`) and live query endpoint `/api/user/quota` enforce a strict daily ceiling of **10 paid operations per authenticated Clerk user account** (`user:${userId}`) resetting automatically at 12:00 AM IST.
   - **Cross-Device Account Synchronization (Mobile <-> Laptop)**:
     - Real-time balances are queryable via `GET /api/user/quota` (`Cache-Control: no-store`).
     - Frontend automatically syncs quota on initial load, on Clerk authentication ready, and on window focus/tab visibility changes (`window.focus`, `visibilitychange`).
     - Moving from mobile to laptop (or switching tabs) synchronizes the exact remaining credits instantly without requiring a hard page refresh.
   - **Strict Data-Fetch Quota Rule**:
     - Whenever our server calls an external paid data provider in the background (OpenWeb Ninja for search, Bright Data Web Unlocker / Zyte for TrustSheet PDP scraping, Multi-store Comparison Benchmark), **exactly 1 credit** is consumed from the user's daily quota.
     - Cache hits (`isCacheHit: true`) and static browsing consume strictly **0 credits** ($0 API cost, instant sub-millisecond resolution).
   - TrustSheet inspections and comparison drawers interlock with `onQuotaUpdate` callback to immediately reflect deducted balances in the account modal and main UI.
   - Global `QuotaModal` notifies users when their 10/10 credits are used while preserving unlimited free browsing of store coupons, trending deals, and wishlists.
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
2. **Universal 10-Daily AI Quota & Cross-Device Account Sync Engine**:
   - Centralized server-side authority `checkUnifiedApiQuota` (`src/services/rateLimiter.js`) and live query endpoint `/api/user/quota` enforce a strict daily ceiling of **10 paid operations per authenticated Clerk user account** (`user:${userId}`) resetting automatically at 12:00 AM IST.
   - **Cross-Device Account Synchronization (Mobile <-> Laptop)**:
     - Real-time balances are queryable via `GET /api/user/quota` (`Cache-Control: no-store`).
     - Frontend automatically syncs quota on initial load, on Clerk authentication ready, and on window focus/tab visibility changes (`window.focus`, `visibilitychange`).
     - Moving from mobile to laptop (or switching tabs) synchronizes the exact remaining credits instantly without requiring a hard page refresh.
   - **Strict Data-Fetch Quota Rule**:
     - Whenever our server calls an external paid data provider in the background (OpenWeb Ninja for search, Bright Data Web Unlocker / Zyte for TrustSheet PDP scraping, Multi-store Comparison Benchmark), **exactly 1 credit** is consumed from the user's daily quota.
     - Cache hits (`isCacheHit: true`) and static browsing consume strictly **0 credits** ($0 API cost, instant sub-millisecond resolution).
   - TrustSheet inspections and comparison drawers interlock with `onQuotaUpdate` callback to immediately reflect deducted balances in the account modal and main UI.
   - Global `QuotaModal` notifies users when their 10/10 credits are used while preserving unlimited free browsing of store coupons, trending deals, and wishlists.
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

## 7. Investor-Grade Search & Multi-Store PDP Reliability Lock (2026-11-12)

### 7.1. Strict 2-API Call Architecture (Budget & Quota Defense)
- **Call 1 (Search API `/api/search`)**: Executes exactly 1 fast OpenWeb Ninja search call (`searchOpenWebProducts`). Returns products in `<2.5s`. **NEVER** re-introduce pre-fetching enrichment loops (`enrichProductsWithDirectPdps`) on the search flow that burn multiple credits per query.
- **Call 2 (Compare API `/api/products/compare`)**: Executes strictly on-demand when the user clicks "Compare Stores" on a specific product card. Consumes exactly 1 credit.
- Total budget per complete search & compare flow = **Strictly 2 API Calls / 2 Credits**.

### 7.2. Store Isolation Shield & Anti-Hijacking Protocol
- Under no circumstances should clicking a competitor store (e.g. Croma, Reliance Digital, Nykaa, Tata 1mg) redirect to Flipkart or another unrelated platform.
- `src/components/ProductCard.jsx` enforces store-isolated PID evaluation: comparison stores in the pricing matrix never inherit or pass the main card's Flipkart ID.
- `src/app/api/redirect/route.js` enforces the Store Isolation Shield: if an affiliate or aggregator link resolves to a mismatched merchant domain, it intercepts and routes safely to the authentic clicked merchant's direct domain.

### 7.3. Zero-Tolerance on Fake Search Fallbacks (`isAuthenticPDP`)
- In price comparison tables, never force 4 stores by appending fake Amazon search links (`amazon.in/s?k=...`).
- Only genuine merchant Product Detail Pages (PDPs) that pass `isAuthenticPDP(cleanUrl)` are rendered. If only 2 authentic stores exist, show those 2 authentic stores. Quality > Quantity.

### 7.4. Shopsy Branding Transparency
- All `shopsy.in` merchant offers are explicitly displayed with the label **"Shopsy by Flipkart"**, communicating the authentic Flipkart Assured backing and shared product catalog to users.

### 7.5. Multi-Country Auto-Healing Sentinel Cron (Permanent Safeguard)
- The scheduled Sentinel cron jobs in `vercel.json` and `.github/workflows/sentinel-health-probe.yml` are **permanent infrastructure assets** across 6 Tier-1 Countries (IN, US, UK, CA, AU, AE).
- **Why it must never be deleted**: Google Shopping and aggregator networks frequently alter redirect and tracking parameters (e.g. `?url=`, `?dest=`, `?adurl=`). The Sentinel runs canary synthetic searches; if Google changes its format, Groq AI detects the new parameter and updates dynamic rules in Redis (`sentinel:dynamic_rules`) on-the-fly without requiring any developer intervention or code redeployment.

### 7.6. Intent & Category-Aware Loading
- `SearchHero.jsx` forwards `currentCategory` (e.g. `health`, `ecommerce`) through `page.js` to `RocketLoader`.
- Searching in the Pharmacy tab, searching in Hindi/Devanagari, or querying major supplement brands (GNC, MuscleBlaze, Optimum Nutrition, etc.) strictly renders the dedicated Health & Pharmacy Radar (Tata 1mg, Apollo 24|7, PharmEasy, HealthKart).

---
**END OF CONSTITUTION — IMMUTABLE ARCHITECTURE LOCK**
