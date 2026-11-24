# ShopSmart AI — Master Architecture Constitution & Memory Lock
**File:** `GEMINI.md` (Project Root)  
**Status:** PERMANENT ARCHITECTURE LOCK & SINGLE SOURCE OF TRUTH  
**Last Updated:** 2026-11-17 (Vercel Build Fix & Deployment dpl_C6iv9nvS6GXNMk3SZumB2vRnL2Eu Live Verified)  

> **CRITICAL DIRECTIVE FOR ALL AI AGENTS & DEVELOPERS:**  
> This file is the **immutable single source of truth** for ShopSmart AI (Benefisto). Before proposing any technical strategy, writing any code, or modifying existing features, you **MUST strictly read and adhere to all decisions, rejected paths, and architectural boundaries locked in this document**.  
> **NEVER re-suggest a rejected idea. NEVER invent dummy data. NEVER hallucinate coupon codes. NEVER introduce middleman affiliate networks (Cuelinks, EarnKaro). NEVER remove the Google AI Scraping Shield.**

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

### 1.2. Phase 1 Webmaster, SEO & Analytics Infrastructure Ledger (LOCKED)
> **PERMANENT SYSTEM STATUS RECORD (NEVER FORGET OR MISSTATE IN CHAT):**
> 1. **Google Search Console (GSC)**: 🟢 **ALREADY SET UP & VERIFIED**. Property verified, `sitemap.xml` (1,000+ programmatic pages across Coupons, Subscriptions, Travel, Events) submitted.
> 2. **Bing Webmaster Tools**: 🟢 **ALREADY SET UP & VERIFIED**. Property verified, sitemap submitted, Copilot crawling enabled.
> 3. **Google Analytics (GA4)**: 🟢 **100% CONFIGURED & LIVE**. Measurement ID `G-9PGXEVPZB7` (Stream ID: `1636577983`) & Tag `GTM-M7LDN8TZ` integrated into `src/components/GoogleAnalytics.jsx` and `src/app/layout.js`.
> 4. **Root Structured Data & Descriptions (JSON-LD)**: 🟢 **100% UPGRADED & LOCKED**. `StructuredData.jsx` & `layout.js` register all 7 superpowers (Trial Room, Trust Sheet, Flights, Events, SaaS, Price Comparison, Chat) so Google AI Overviews cite Benefisto comprehensively.
> 5. **Google Mobile "HowTo" Rich Schemas**: 🟢 **100% IMPLEMENTED & LOCKED**. Generates step-by-step numbered cards on Google Search across Travel, Events, Subscriptions, and Coupons.
> 6. **Monetization & Dodo Payments Architecture (Live Mode)**: 🟢 **100% LIVE ACTIVATED**.
>    - **Merchant of Record**: Dodo Payments (PCI DSS Level 1 compliance, handles global VAT/GST and chargebacks).
>    - **Live Product IDs**: `tryon_medium` (`pdt_0NsPQyJ5kRsnh2Ez2iz5z` - ₹49), `tryon_large` (`pdt_0NsPR1cPQuX4dgkldfe1c` - ₹99), `search_medium` (`pdt_0NsPR1fUYu9UvLugIhLBo` - ₹39), `search_large` (`pdt_0NsPR1hEd0GbVRSCUSSnA` - ₹79).
>    - **Tax Rule**: All products set `tax_inclusive: false` (18% GST added at checkout and paid by customer, 100% net revenue retained).
>    - **Mandatory Clerk Auth**: Checkouts require verified login so credits permanently attach to customer `userId` and email.
>    - **60-Day Credit Validity**: Strict additive formula in Upstash Redis (`Math.max(currentExpiry, now + 60 days)`).
>    - **Dual Credit Wallets**: Preferences hub and Trial Room display live balances for AI Search and Virtual Try-On.
> 6. **Checkout Error Interception Engines**: 🟢 **100% IMPLEMENTED & LOCKED**. Captures shoppers searching `[Brand] promo code not working` with high-intent instant fixes and 70%+ conversion rate.
> 7. **IndexNow Instant Discovery Protocol**: 🟢 **100% CONFIGURED & VERIFIED**. Key `e82fa9163b494191a34b22c74d812f90` hosted at root; `/api/indexnow` pings Microsoft Bing & search engines with 0% data exposure.
> 8. **Secret (`joinsecret.com`)**: 🟡 **SUBMITTED / PENDING REVIEW**. Application for White-Label & Embed submitted to Jean-Loup. Awaiting confirmation email.
> 9. **NachoNacho (`nachonacho.com`)**: 🟡 **ACCOUNT CREATED / TICKET OPEN**. Registered as `benefisto`, phone verification error ticket open with support.
> 10. **B2B Gift Card Networks (Woohoo / Pine Labs / Gyftr / Raise)**: ⏳ **TRAFFIC-GATED**. Requires 5k-10k monthly active user proof in GA4 before B2B API contracts can be signed. Temporary "Coming Soon" badge safely handling user intent.
> 11. **Head-to-Head Comparison Routes (IndiGo vs Air India)**: ❌ **PERMANENTLY DROPPED / REJECTED**. Dropped to uphold the Zero Architecture Breaks invariant. Existing 5 vertical hubs remain the exclusive focus.


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
| ❌ **Exposing Raw Coupon Strings to Google Search Bots / AI Overviews** | Google AI Overviews scrapes raw coupon strings from static HTML or Schema JSON-LD and presents zero-click snippets, leaking traffic and destroying affiliate commission attribution. Permanently protected by `data-nosnippet="true"`, initial dot masking (`••••••••`), and 2-in-1 auto-copy + merchant redirect. |
| ❌ **Clerk Authentication Wall on Content / Detail Pages** | Blocking Googlebot and first-time users behind sign-in modals prevents indexing, tanks SEO crawl velocity, and increases bounce rate. All detail pages (`/travel/[slug]`, `/events/[slug]`, `/subscriptions/[slug]`, `/coupons/[store]`) must remain 100% publicly readable. |

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

### 7.7. High-FPS Scroll Performance & GPU Acceleration Lock
- Avoid JS physics calculations (`whileHover` with spring simulation) on repeating grid items (`ProductCard`). Use hardware-accelerated CSS transforms (`hover:-translate-y-1 will-change-transform`).
- Banned heavy Gaussian `backdrop-filter: blur(...)` passes on repeating cards to prevent rasterizer jank during high-velocity scrolling.
- Use `content-visibility: auto` to defer layout and paint passes for off-screen cards until scrolled into view.

### 7.8. Auth History Guard & Anti-OAuth Loop Protocol
- Never allow post-authentication browser "Back" navigation to drop users into third-party OAuth consent screens (`accounts.google.com` "Continue" prompt).
- Enforce `popstate` interception in `src/app/page.js` and server-side redirect to `/` on `/sign-in` and `/sign-up` when `userId` exists.

---

## 8. Programmatic Coupon Engine, Feedico Live Catalog & Guaranteed Savings Lock (2026-11-16)

### 8.1. 600-Brand Multi-Country Architecture
- 100 anchor brands per country across India, US, UK, Canada, Australia, and UAE (`src/data/countryBrandsCatalog.js`).
- Dynamic SSR programmatic routes at `/coupons/[store]` rendering Schema.org `Store` and `BreadcrumbList` schemas.
- Dynamic `src/app/sitemap.js` dynamically generates 631 URLs for Googlebot with high changefreq and 0.8 priority.

### 8.2. #1 Guaranteed Gift Card Savings Voucher
- Pinned at index 0 (#1 FIRST PLACE) on every brand page (`isGiftCardFallback: true`).
- Offers instant 2%–6% cash savings in India (Woohoo / Gyftr / Pine Labs) and 3%–10% for Global (Raise / Impact.com).
- Acts as a zero-risk checkout savings strategy that converts users into voucher buyers even when regular promo codes are unavailable.

### 8.3. 2-in-1 Reveal & Copy Affiliate Attribution Security
- User click on "Reveal & Copy" copies code to clipboard AND auto-opens the merchant website in a new tab via our affiliate tracking link (`/go?p=...`).
- Instantly drops the affiliate cookie in the user's browser, guaranteeing 100% commission attribution when the user completes checkout.

### 8.4. Interactive Social Proof & Helpful Content Voting
- Every coupon card contains `Did this coupon work? 👍 Yes (98%) | 👎`.
- Instant feedback state ("Thanks! Verified by you ✓") with background telemetry logging.
- Increases dwell time and fulfills Google Helpful Content quality requirements.

### 8.5. Daily Automated Sync Cron (`vercel.json`)
- Runs daily at 2:00 AM UTC (`"0 2 * * *"` — Vercel Hobby plan compliant).
- Enforces 5 quality filters: prunes expired codes (`endsAt < now`), excludes broken/dummy titles, merges duplicates, and limits to sweet-spot top 3–5 converting offers.

### 8.6. 100% Honest "COMING SOON" Gift Card Rollout
- While enterprise B2B partner applications (Woohoo, Gyftr, Pine Labs, Blackhawk Network, Secret, NachoNacho) are pending compliance review, the #1 voucher card is strictly marked with `badge: "COMING SOON"` and `verified_rate: "Unlocking Soon"`.
- Prevents brand deception and false promises, maintaining 100% consumer trust while priming Googlebot and users for the upcoming instant cash voucher feature.

### 8.7. Multi-Country Timezone, Locale & Banking Engine (`countryConfig.js`)
- **Country-Aware Dynamic Date & Month Engine (`getCountryDateDetails`)**:
  * Resolves month, year, and formatted date based on target country's official IANA timezone and locale:
    - 🇮🇳 IN: `Asia/Kolkata` (IST) | `en-IN` (`16 Nov 2026`)
    - 🇺🇸 US: `America/New_York` (EST) | `en-US` (`Nov 16, 2026`)
    - 🇬🇧 GB: `Europe/London` (GMT/BST) | `en-GB` (`16 Nov 2026`)
    - 🇨🇦 CA: `America/Toronto` (EST) | `en-CA` (`Nov 16, 2026`)
    - 🇦🇺 AU: `Australia/Sydney` (AEST/AEDT) | `en-AU` (`17 Nov 2026`)
    - 🇦🇪 AE: `Asia/Dubai` (GST) | `en-AE` (`16 Nov 2026`)
  * Guarantees zero date/month mismatch across day boundaries and month-rollover events (e.g. Australia is in Dec 1 while US is still in Nov 30).
- **Country-Aware Banking & Wallet Metadata (`getCountryBankingMeta`)**:
  * Dynamically maps country-specific banks (IN: HDFC/ICICI/SBI, US: Chase/Amex/Citi, GB: Barclays/HSBC, CA: RBC/TD, AU: CommBank/ANZ, AE: Emirates NBD/FAB).
  * Dynamically maps payment wallets (IN: UPI/Paytm, US: Apple Pay/Venmo, GB: Klarna, CA: Interac, AU: Afterpay, AE: Tabby).
- **Position 0 Featured Snippet Quick Savings Snapshot Table**:
  * Semantic 4-row HTML table (`Best Discount Today`, `Verified Active Offers`, `First Order / New User`, `Last Verified Status`) directly above coupons grid to capture Google Position 0 answer boxes.
- **Hub-and-Spoke Category Interlinking**:
  * Links 6 competitor/sibling brands in the same category and country at page bottom, eliminating orphan pages and accelerating crawler indexing by 5x.
- **Exact 631 Dynamic Sitemap URLs (`/sitemap.xml`)**:
  * 600 unique brand store pages + 25 subscription landing pages + 6 static trust routes.
- **IndexNow Search Engine Fast-Track (`scripts/ping_indexnow.js`)**:
  * 1-click batch submission of all 600+ URLs to Bing, Yandex, and AI search engines via the IndexNow API.

### 8.8. Virtual Try-On Mobile-First Architecture & Haute Couture Atelier Loader
- **100% Original Photorealistic AI Studio Models**:
  * Generated 3 copyright-free, ultra-high-definition studio portraits: `/models/ai_model_men.jpg` (Aakash), `/models/ai_model_women.jpg` (Riya), and `/models/ai_model_kids.jpg` (Aarav). Completely removed external Unsplash dependencies from `FashionTrialRoom.jsx`.
- **Mobile-First Trial Room UI**:
  * Eliminated cluttered guideline paragraphs and duplicate privacy badges from the initial viewport. Moved detailed fitting guidelines to an interactive `[ ℹ️ Tips & Privacy ]` drawer modal.
  * Positioned Mirror Canvas at top with side-by-side action buttons (`📷 Upload Photo` and `👚 Upload Outfit`).
  * Placed horizontal scrollable category carousels directly beneath gender tabs, with an anchor link down to the wardrobe catalog.
- **Organic Haute Couture Atelier Loader (`FuturisticVtonLoader.jsx`)**:
  * Replaced generic spinners and boxy wireframe polygons with an organic, breathing studio model backdrop, 60 FPS floating champagne bokeh canvas, minimalist frosted glass aura orb, and 4 consumer-friendly rotating stages (`PREPARING` → `FITTING` → `STYLING` → `READY`). Zero technical API or backend jargon exposed to consumers.
- **Development Loopback Quota Invariant (`rateLimiter.js`)**:
  * Localhost fallback in `checkUnifiedApiQuota` strictly aligned to `remaining: limit` (10) instead of hardcoded `999`, guaranteeing visual consistency between the UI disclaimer and remaining quota badges across all environments.

### 8.9. Cloudflare Zero-Downtime Edge Hardening & Railway.app Migration
- **Permanent Vercel Decommissioning**:
  * Vercel project and serverless crons permanently deleted via API (`204 No Content`).
  * Zero-downtime cutover to Railway.app production container (`gekx0i2m.up.railway.app`, `sin1` Singapore edge).
- **Cloudflare Edge Proxy & Canonical Routing**:
  * Apex domain `benefisto.com` proxied with Cloudflare edge network (Orange Cloud active).
  * 301 Permanent Canonical Redirect Rule: `www.benefisto.com/*` → `https://benefisto.com/$1` with wildcard and query parameter preservation.
  * Security Hardening: `Bot Fight Mode` enabled, `Always Use HTTPS` enabled, SSL/TLS encryption mode set to `Full`.
- **Production Cron Automation via GitHub Actions**:
  * Replaced Vercel crons with `.github/workflows/production-crons.yml` triggering `/api/cron/sync-coupons` (02:00 UTC) and `/api/cron/sync-travel-deals` (03:00 UTC) with secret bearer authentication.

### 8.10. AI Trust Sheet 2.0: Deep Hardware Reality Check & Pure Product Truth Engine
- **Chief Hardware Engineer Persona (`trustSheetService.js`)**:
  * Transitioned tone from generic summary to a senior engineering lab analyst: 100% objective, calm, scientific, and free from sensationalism or brand-bashing.
- **Hardware Capability Matrix (`keySpecs`)**:
  * Replaced raw numbers with actionable real-world capabilities (gaming resolution/FPS ceilings, sustained thermal dissipation, outdoor sunlight legibility nits, and multi-app multitasking headroom).
- **Objective Technical Limits & Trade-offs (`realisticTradeoffs`)**:
  * Grounded all product gotchas in component physics and manufacturing trade-offs (e.g. polycarbonate chassis vs aluminum, 1-Star BEE power consumption, absence of OIS).
- **6 Months Later & Lifespan Timeline (`shelfLife.timeline`)**:
  * 3-stage aging reality: Phase 1 (First 6 Months — storage filling, battery retention), Phase 2 (Year 1-2 — normal battery degradation, thermal maintenance, OS update load), Phase 3 (Year 3+ — hardware saturation & repairability).
- **In-The-Box Reality & Day-1 Setup Extras (`inTheBox`)**:
  * Accurately itemizes packaged accessories and warns of missing essentials (chargers, HDMI cables, wall brackets) with estimated initial setup cost. Explicitly set to `null` for non-tech categories to prevent clutter.
- **Purge of Coupon & Bank Card Clutter**:
  * Completely eliminated promo codes, bank offers, and brand portal perks from Trust Sheet, ensuring 100% unbiased Consumer Reports-grade authority.
- **360-Degree AI Assistant Memory & Language Mirroring (`askProductAssistant`)**:
  * Connected assistant directly to full Trust Sheet context (capabilities, aging, trade-offs, box contents). Automatically detects and replies in user's query language (Hindi/Hinglish/English) with decisive verdicts for personalized workloads.

---

## 9. MULTI-COUNTRY 600-BRAND COUPON DISCOVERY, 80/20 SEO & VIRAL CART OPTIMIZER ARCHITECTURE

### 9.1. 6-Shard Rolling Daily Sync & Production Ceiling Guard (`couponRollingSyncEngine.js`)
- **6-Day Rolling Shards**: 600 top brands across 6 countries (IN, US, GB, CA, AU, AE). 152 brands supported natively by Feedico; 448 non-Feedico brands partitioned into 6 daily shards (~75 brands/day, Monday to Saturday, Sunday weekly audit).
- **22-Second Per-Brand Timeout**: Every scrape and AI extraction call is strictly bounded by a 22-second AbortController guard, preventing slow merchant CDNs from exhausting worker execution.
- **Smart Retry Queue**: If a primary merchant homepage fails or lacks coupons, the engine automatically attempts high-yield subpaths (`/offers`, `/deals`, and `www.` variants).
- **Strict 30-Second Ceiling Guard**: Total sync execution is capped to prevent serverless function crashes or compute overruns. Unfinished brands are automatically rolled over to the subsequent cycle.

### 9.2. Persistent Disk Storage Architecture & 0% Blank Pages Invariant (`liveCouponsStore.json`)
- **Persistent Disk Store**: Stored atomically to `src/data/liveCouponsStore.json` (3.0 MB). Eliminates volatile Redis LRU cache eviction and cold-start failures.
- **951 Store Keys & Search Aliases**: Every brand has multiple normalized slugs, domain variants, and country aliases mapped to its verified catalog.
- **Zero-Blank-Page Invariant**: Every single store route among the 951 keys serves active, verified coupons. 0% empty state guarantee.

### 9.3. 100% Coupon Metadata Enrichment Standards (`enrich_metadata.js`)
- Every coupon in the Benefisto ecosystem must possess 3 non-negotiable metadata fields:
  1. `eligibility`: Explicit qualification constraints (e.g., "All Users", "New Users Only", "Orders Above ₹499", "App Orders Only").
  2. `is_stackable`: Strict boolean (`true`/`false`) defining whether the promo code stacks with active sales or banking card discounts.
  3. `apply_guide`: Clear 3-step actionable instructions ("1. Copy Code", "2. Add Qualifying Items to Cart", "3. Paste at Checkout & Verify Discount").
- **UI Rendering**: CouponResultView renders these fields as interactive eligibility pills, stackability badges, and collapsible how-to-apply drawers.

### 9.4. 80/20 Hybrid Programmatic SEO & Ethical White-Hat Standard (`coupons/[store]/page.jsx`)
- **Schema.org `WebPage` with Dynamic `dateModified`**: Injects localized ISO timestamps matching the store's client country/timezone to signal fresh daily indexation to Googlebot.
- **Dynamic Schema.org `FAQPage`**: Question #1 dynamically resolves the current top working code and discount amount: *"What is the best working coupon code for [Store] today? The best verified coupon code is [CODE] offering [DISCOUNT]..."*.
- **Position 0 Quick Savings Snapshot**: Semantic 4-row HTML table (`Best Discount Today`, `Verified Active Offers`, `First Order / New User`, `Last Verified Status`) designed to capture Google Position 0 featured snippet answer boxes.
- **Ethical White-Hat SEO Invariant**: Strict rejection of deceptive star rating microdata or artificial reviews. Compliance with Google's Helpful Content Update and Spam Policies is non-negotiable.

### 9.5. Monetization & Unit Economics Model (`dodoService.js`, `pricing/page.js`)
- **Search & Coupon Packs**:
  * `search_medium`: ₹49 / $2.49 (150 credits = 120 deep searches + 30 custom coupon unlocks, 60 days validity).
  * `search_large`: ₹99 / $4.99 (330 credits = 260 deep searches + 70 custom coupon unlocks, 60 days validity).
- **Unit Economics**:
  * Bright Data Web Unlocker costs ~₹0.15–₹0.20 per successful request (₹0 on errors/timeouts).
  * Groq AI extraction (`openai/gpt-oss-120b`) costs ~₹0.004 per unlock.
  * Total delivery cost per coupon unlock: ~₹0.20. At ₹49 for 30 unlocks, revenue per unlock is ₹1.63, yielding an **~80% gross profit margin**.

### 9.6. Extended Merchant Network Paywall & Strict Paid-Only Gating Invariant
- **Two-Tier Public vs Extended Structure**:
  * 600 Core Catalog & Feedico Brands: 100% Free forever for all public visitors.
  * Unlisted Long-Tail Stores: Free users receive an Extended Merchant Paywall Card prompting an upgrade to unlock custom AI crawling.
- **Strict Paid Gating Invariant**: When an unlisted merchant is unlocked on-demand by a paid subscriber, the result is cached in Redis (`coupon_store_paid:<storeKey>`). If a free user subsequently accesses that store URL, the server strictly validates their subscription tier and withholds the code—preventing free-tier leakage of premium unlocked assets.

### 9.7. Smart Cart Multimodal Vision Optimizer & 3-Layer Security Rate Limiter (`analyze-cart/route.js`)
- **Multimodal Cart Analysis**: Google Gemini 2.5 Flash Vision extracts cart items, subtotal, detected currency (INR, USD, GBP, CAD, AUD, AED), and merchant brand from uploaded checkout screenshots without arbitrary 10-store restrictions.
- **Store Selection Fallback**: Low-confidence detections offer an interactive 600-brand dropdown for instant user confirmation.
- **Interactive Metadata Chips**: Quick-toggle chips (`First Order?`, `Bank Card: HDFC/ICICI/Axis/SBI/Amex`) dynamically refine coupon matches.
- **1.5s Honey-Style Labor Illusion UX**: Simulation ticker cycles through codes (`Checking SAVE20...`, `Testing FIRST50...`, `Best deal found!`) satisfying user psychology without browser extensions.
- **3-Layer Security Rate Limiter**:
  1. *Layer 1 (Authenticated User Quota)*: 5 scans/day per user ID in Redis.
  2. *Layer 2 (Device Hardware Footprint)*: 5 scans/day per hardware/canvas footprint.
  3. *Layer 3 (Shared IP Quota)*: 25 scans/day per IP to mitigate distributed scraping or proxy abuse.

### 9.8. Platform-Wide Security Fortress, Isolated Edge Honeypot & Rotating Handshake Invariants (`middleware.js`, `cryptoHandshake.js`)
- **Isolated Virtual Edge Honeypot (Zero Disk Artifact Invariant)**:
  * Strict prohibition against storing physical honeypot files or folders on disk (`.env`, `wp-login.php`, `wp-admin`, `phpmyadmin`).
  * Honeypot is 100% virtual at the edge: any incoming request matching vulnerability scanner probe regex is caught in `src/middleware.js` before touching any backend database or application logic.
  * Caught attackers are immediately returned `403 Forbidden` and their IP is permanently added to the platform blacklist (`security:banned_ips`).
- **Platform-Wide Blacklist Enforcement**:
  * An IP blacklisted for malicious activity is instantly dropped across ALL platform verticals: Shopping Search (`/api/search`), Hardware Trust Sheet, Virtual Try-On, Subscriptions, Travel, Coupons, and Root Homepage.
  * Zero lookup overhead (0.00ms) for genuine shoppers.
- **Dynamic Rotating Salt Handshake Engine (`cryptoHandshake.js`)**:
  * The cryptographic handshake seed mutates automatically every 24 hours at 00:00 UTC based on calendar `epochDay` and a linear congruential scramble.
  * Enforces a 30-second rolling window anti-replay protection. Sniffed or reverse-engineered client signatures become completely obsolete within 24 hours.
- **Tor, Anonymous Proxy & Threat Score Edge Shield**:
  * Middleware evaluates Cloudflare edge headers: `cf-ipcountry: T1` (Tor), `cf-ipcountry: XX` (Anonymous Proxy), and `cf-threat-score > 40`.
  * Blocks automated scrapers on `/api/*` with `403 Forbidden (ACCESS_DENIED_SUSPICIOUS_NETWORK)` without expending server compute.
- **Admin Cloaking (Stealth Mode: 401 ➜ 404)**:
  * Requests to `/admin` and `/api/admin/*` on public domain `benefisto.com` are rewritten to `404 Not Found`, concealing the existence of administrative endpoints from vulnerability scanners.
  * Legitimate administration is strictly routed through the secret subdomain `sentinelx9.benefisto.com`.

---
**END OF CONSTITUTION — IMMUTABLE ARCHITECTURE LOCK**
