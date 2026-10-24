# 📖 ShopSmart AI — Master System & Feature Manifest (The Ultimate Bible)

> **Document Classification**: Core System Blueprint & Feature Reference Manual  
> **Target Audience**: AI Engineering Agents, Lead Developers, System Operators  
> **Mission Statement**: To deliver a 100% authentic, lightning-fast, zero-fake-deal AI shopping assistant with seamless multi-lingual search, direct merchant checkout, on-demand price comparisons, interactive virtual try-on, and autonomous background resilience.

---

## 📑 Table of Contents

1. [Architectural Principles & Core Invariants (Non-Negotiables)](#1-architectural-principles--core-invariants)
2. [Global Layout, Header & Navigation Bar](#2-global-layout-header--navigation-bar)
3. [Search & Discovery Engine](#3-search--discovery-engine)
   - 3.1 [SearchHero & Multi-Modal Input Bar](#31-searchhero--multi-modal-input-bar)
   - 3.2 [AI Shopping Guide / Concierge Drawer](#32-ai-shopping-guide--concierge-drawer)
   - 3.3 [Zero-Latency Multi-Lingual Query Normalizer](#33-zero-latency-multi-lingual-query-normalizer)
   - 3.4 [Direct URL Product Lookup & Comparison](#34-direct-url-product-lookup--comparison)
   - 3.5 [Smart Dynamic Filter Chips](#35-smart-dynamic-filter-chips)
   - 3.6 [Category Deals Explorer & Store Carousel](#36-category-deals-explorer--store-carousel)
4. [Product Grid & Individual Product Card Anatomy](#4-product-grid--individual-product-card-anatomy)
   - 4.1 [Visual Specs & Badge System](#41-visual-specs--badge-system)
   - 4.2 [Get Deal & Direct Merchant PDP Redirect Engine](#42-get-deal--direct-merchant-pdp-redirect-engine)
   - 4.3 [On-Demand Price Comparison (Head-To-Head)](#43-on-demand-price-comparison-head-to-head)
   - 4.4 [Price Drop Alert & Push Notification Modal](#44-price-drop-alert--push-notification-modal)
   - 4.5 [Wishlist & Saved Deals System](#45-wishlist--saved-deals-system)
   - 4.6 [Trust Sheet & Genuine Review Sentiment](#46-trust-sheet--genuine-review-sentiment)
5. [Virtual Try-On (VTON) Studio & Fashion Trial Room](#5-virtual-try-on-vton-studio--fashion-trial-room)
6. [Interactive AI Shopping Copilot (In-Chat Agent)](#6-interactive-ai-shopping-copilot-in-chat-agent)
7. [Smart Purchase Terminal & Cart Analyzer](#7-smart-purchase-terminal--cart-analyzer)
8. [Authentic Coupon Engine & Deals Vault](#8-authentic-coupon-engine--deals-vault)
9. [User Identity, Session Security & Account Management](#9-user-identity-session-security--account-management)
10. [Customer Support & Ticket Vault](#10-customer-support--ticket-vault)
11. [Two-Tier Redis Caching Engine](#11-two-tier-redis-caching-engine)
12. [Security Radar, Bot Defense & Rate Limiter](#12-security-radar-bot-defense--rate-limiter)
13. [Admin Command Dashboard & Live Telemetry](#13-admin-command-dashboard--live-telemetry)
14. [Sentinel Autonomous Self-Healing Cron Probe](#14-sentinel-autonomous-self-healing-cron-probe)
15. [Adaptive SEO, Dynamic Robots & Sitemap Engine](#15-adaptive-seo-dynamic-robots--sitemap-engine)
16. [Master API Key & Environment Variable Matrix](#16-master-api-key--environment-variable-matrix)
17. [Global OTT & Digital Subscriptions Hub (6 Countries, Savings Blueprints, On-Demand AI & Weekly Cron)](#17-global-ott--digital-subscriptions-hub)

---

## 1. Architectural Principles & Core Invariants

Whenever maintaining, debugging, or extending any feature, you **MUST** strictly adhere to these foundational engineering rules:

| Rule # | Invariant Principle | Description & Why It Exists |
| :--- | :--- | :--- |
| **INV-1** | **Zero Fake Deals Policy** | Never return synthetic mock products, dummy prices, or placeholder images when search fails. If upstream API has no results, return clean `ProductNotFoundState` with helpful search tips. Fake deals destroy user trust. |
| **INV-2** | **1-Call Search Efficiency** | The primary search endpoint (`/api/search`) must resolve results in **one single upstream scrape call** (~2-4 seconds). Never perform N+1 background calls during the initial query. |
| **INV-3** | **On-Demand Price Enrichment** | Deep competitor comparisons (comparing 5+ stores for a specific item) are lazy-loaded **only when the user clicks "Compare Offers"**. This saves 80%+ of upstream API quotas. |
| **INV-4** | **Universal Direct PDP Redirect** | When user clicks "Get Deal", `/api/redirect` must redirect directly to the merchant's authentic Product Display Page (PDP). If affiliate approval is inactive, it safely passes through directly without breaking or hanging. |
| **INV-5** | **Zero Client-Side Secret Leakage** | All private vendor API keys (OpenWeb Ninja, Zyte, Upstash, Groq, Gemini, PixelAPI) live strictly on the server (`process.env`). Never prefix vendor keys with `NEXT_PUBLIC_`. |
| **INV-6** | **Safe Error Shield** | Catch-all error handlers must never return raw database or stack traces to clients. Return sanitized user-friendly Hindi/English messages with clean error codes (`SERVER_BUSY`, `UNAUTHORIZED`, `RATE_LIMITED`). |
| **INV-7** | **Fail-Safe Caching** | If Upstash Redis is unreachable or rate-limited, fallback to in-memory cache gracefully without crashing Next.js server processes. |
| **INV-8** | **Multi-Country Regional Isolation** | Support strictly whitelisted 6 Tier-1 countries (`IN`, `US`, `GB`, `CA`, `AU`, `AE`). Never contaminate a country's search, stores, currency symbols, or PDP redirects with another country's data. |
| **INV-9** | **Zero Third-Party AI Brand Leakage** | All conversational guides and concierge features must be presented under native branded identity (`ShopSmart AI` / `AI GUIDE`). Never expose third-party brand names (e.g. 'ChatGPT Style') in user-facing UI. |
| **INV-10** | **Pre-Dawn Sun-Chaser Sentinel** | Diagnostic cron jobs must execute at 6:00 AM local pre-dawn time per geographic cluster with mandatory `CRON_SECRET` Bearer token authentication in production. |
| **INV-11** | **Mobile-First Modal & Sheet Polish** | Modals and Trust Sheets must adapt gracefully to mobile viewports (360px-414px) with compact top headers, horizontal-scrolling question chips, and full-width touch-friendly action buttons. |

---

## 2. Global Layout, Header & Navigation Bar

### 🎯 Business Intent
Provides a unified, responsive header giving the user immediate access to their localized shopping context (Country / Currency), Wishlist drawer, Push Notification controls, Authentication state (Clerk), and Zippy Mascot presence.

### 🖥️ UX & User Touchpoints
- **Brand Logo & Title**: "ShopSmart AI" with a lightning deal icon. Clicking navigates back to root (`/`).
- **Country / Regional Switcher**: Dropdown supporting India (`in` / ₹), USA (`us` / $), UK (`uk` / £). Automatically adjusts search queries, currency symbols, and merchant prioritization.
- **Push Notification Bell**: Clicking triggers browser Web Push permission prompt; toggles price drop subscription badge.
- **Saved Deals / Wishlist Heart Button**: Badge counter indicating saved products. Clicking slides open the `SavedDealsDrawer`.
- **Clerk Auth Button**: Shows `<SignInButton>` when anonymous; renders Clerk `<UserButton>` avatar dropdown with account settings when logged in.
- **Admin Shield Link**: Rendered **only** if logged-in `userId` is present in `ADMIN_USER_IDS`. Direct shortcut to `/admin`.

### 📁 Code Files & Route Map
- **Frontend**: `src/app/layout.js`, `src/app/page.js`
- **Component**: `src/components/SavedDealsDrawer.jsx`, `src/components/UnifiedAccountModal.jsx`
- **Auth Provider**: `<ClerkProvider>` in `src/app/layout.js`

### 🔑 APIs & Keys Used
- **Clerk**: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- **Browser API**: `Notification.requestPermission()`, `localStorage`

### 🛡️ Non-Negotiables
- Admin link must never be visible to regular users or anonymous visitors.
- Country change must instantly re-fetch or clear cached location filter without requiring full page reload.

---

## 3. Search & Discovery Engine

### 3.1 SearchHero & Multi-Modal Input Bar

#### 🎯 Business Intent
The primary discovery interface. Allows users to type search queries in any language (Hindi, English, Marathi, Hinglish), paste direct product URLs from any ecommerce site, or ask questions to find products.

#### 🖥️ UX & User Touchpoints
- **Search Input Field**: Large input with animated placeholder ("Search iPhone 15, सस्ते जूते, or paste Amazon URL...").
- **Voice Search Icon**: Uses Web Speech API for voice dictation in Hindi/English.
- **Clear Button (`X`)**: Instant input wipe.
- **URL Paste Detector**: Automatically recognizes if input starts with `http://` or `https://` and flips into URL Lookup mode.
- **"AI Guide" Pill Button**: Beside the search bar, opens `SearchAiConciergeModal`.
- **Recent Searches**: Dropdown pill history stored in `localStorage` for 1-click re-querying.

#### 📁 Code Files
- **Component**: `src/components/SearchHero.jsx`
- **Service**: `src/services/api.js` (`searchProducts()`)
- **Backend Route**: `src/app/api/search/route.js`

---

### 3.2 AI Shopping Guide / Concierge Drawer

#### 🎯 Business Intent
Assists indecisive buyers before they search. If a user doesn't know exact specs (e.g., "Best laptop for video editing under ₹60,000" or "Mom's birthday gift"), the AI Guide asks 2-3 quick questions and formulates the ideal search query.

#### 🖥️ UX & User Touchpoints
- **Trigger**: Click "✨ AI Shopping Guide" button in `SearchHero`.
- **Interactive Modal**:
  - Step 1: Select buying goal (Budget, Top Rated, High Performance, Gift).
  - Step 2: Select max budget slider or preset pills.
  - Step 3: AI recommends 3 specific curated search prompts.
  - Clicking any prompt automatically executes the search.

#### 📁 Code Files
- **Component**: `src/components/SearchAiConciergeModal.jsx`
- **AI Service**: `src/services/aiProductCurator.js`

#### 🔑 APIs & Keys Used
- **Groq Llama-3 / Gemini 2.5 Flash**: `GROQ_API_KEY`, `GEMINI_API_KEY`

---

### 3.3 Zero-Latency Multi-Lingual Query Normalizer

#### 🎯 Business Intent
90%+ of Indian ecommerce users search using conversational Hinglish, regional Hindi, Marathi, or typographically flawed words (e.g., "laoptop saste me", "achha mobile dikhao", "कमी किमतीचा मोबाईल"). Raw Google Shopping searches fail on these. The normalizer sanitizes queries in **0 milliseconds** with zero external API calls.

#### ⚙️ How It Works (Engine Pipeline):
1. **Typo Correction**: `laoptop` -> `laptop`, `mobaile` -> `mobile`, `shose` -> `shoes`.
2. **Spec Standardization**: `128 gb` -> `128gb`, `8 g ram` -> `8gb ram`, `5 g` -> `5g`.
3. **Devanagari Translation**:
   - Hindi: `सस्ते जूते` -> `shoes`, `स्मार्टवॉच` -> `smartwatch`, `कपड़े` -> `clothes`.
   - Marathi: `कमी किमतीचा मोबाईल` -> `mobile`, `कपडे` -> `clothes`.
4. **Conversational Noise Stripping**: Removes filler words (`sabse achha`, `chahiye`, `dikhao`, `wala`, `batao`, `price in india`, `best deal`).
5. **Deduplication**: Eliminates duplicate tokens (`iphone 15 iphone 15` -> `iphone 15`).

#### 📁 Code Files
- **Location**: `src/app/api/search/route.js` (lines 31–152, `normalizeMultiLingualQuery()`)

---

### 3.4 Direct URL Product Lookup & Comparison

#### 🎯 Business Intent
Allows users who are already browsing Amazon, Flipkart, Myntra, or Croma to paste the product URL into ShopSmart AI. The system extracts the product title, specs, and price, then instantly scans 10+ competitor stores to find lower prices and working coupons.

#### 🖥️ UX & User Touchpoints
- User pastes URL (`https://www.flipkart.com/.../p/...`) into search bar.
- Input highlights green: "Product URL Detected".
- System automatically runs `POST /api/search` with `{ isUrlLookup: true, sourceUrl: '...' }`.
- Results show the original merchant's price vs. all competitor stores with lowest price highlighted.

#### 📁 Code Files
- **Parser**: `src/lib/urlProductParser.js`
- **Backend Route**: `src/app/api/search/route.js`

---

### 3.5 Smart Dynamic Filter Chips

#### 🎯 Business Intent
Prevents user choice paralysis by displaying contextual, category-aware filter chips that dynamically appear based on the search results.

#### 🖥️ UX & User Touchpoints
- For **Smartphones**: Chips show `5G`, `Under ₹15,000`, `128GB+`, `AMOLED`, `Samsung`, `Apple`.
- For **Shoes / Fashion**: Chips show `Running`, `Sneakers`, `Men`, `Women`, `Nike`, `Under ₹3,000`.
- For **Laptops**: Chips show `16GB RAM`, `SSD`, `Gaming`, `Intel i5`, `Under ₹50,000`.
- Clicking a chip filters the client-side list in **0ms** without re-scraping.

#### 📁 Code Files
- **Component**: `src/components/SmartFilterChips.jsx`
- **Helper Rules**: `src/lib/smartChips.js`

---

### 3.6 Category Deals Explorer & Store Carousel

#### 🎯 Business Intent
Allows users to discover pre-curated flash discounts across top retail categories and stores without entering any search keyword.

#### 🖥️ UX & User Touchpoints
- **Store Cards**: Amazon, Flipkart, Myntra, Croma, Nike, Ajio, Tata CLiQ.
- **Category Tabs**: "Electronics", "Fashion & Apparel", "Home & Kitchen", "Beauty & Grooming".
- Clicking any store or category fetches high-discount items (30%+ OFF).

#### 📁 Code Files
- **Components**: `src/components/CategoryDealsExplorer.jsx`, `src/components/StoreCardCarousel.jsx`
- **Backend Route**: `src/app/api/deals/category/route.js`
- **Service**: `src/services/dealsService.js`

---

## 4. Product Grid & Individual Product Card Anatomy

### 4.1 Visual Specs & Badge System

#### 🖥️ UX Details of Each Card:
- **Product Image**: High-res image with fallback error handler.
- **Discount Percentage Badge**: Glowing badge (e.g., `42% OFF`) calculated from `rawPrice` vs `originalPrice`.
- **Verified Merchant Pill**: Icon + Store Name (e.g., `Amazon India`, `Flipkart`, `Nike`).
- **Rating & Review Star**: e.g., `★ 4.4 (1,240 reviews)`.
- **Specification Pills**: Extracted specs (e.g., `128GB`, `Black`, `Free Delivery`).
- **Action Buttons**:
  1. `Get Deal` (Primary Button)
  2. `Compare Offers` (Secondary Button)
  3. `Try On` (Rendered only if category is apparel/fashion)
  4. `Heart Icon` (Wishlist toggle)
  5. `Bell Icon` (Price Drop alert)
  6. `Shield Icon` (Trust Sheet score)

#### 📁 Code Files
- **Component**: `src/components/ProductCard.jsx`

---

### 4.2 Get Deal & Direct Merchant PDP Redirect Engine

#### 🎯 Business Intent
When a user clicks "Get Deal", they must be redirected seamlessly to the authentic merchant's Product Display Page. Broken links or infinite redirect loops destroy conversions.

#### ⚙️ Technical Plumbing:
1. Card links to `/api/redirect?url=<encoded_target_pdp>&store=<store_name>&title=<title>`.
2. Route parses and validates destination URL against white-listed ecommerce domains.
3. If affiliate network is approved and enabled (`EARNKARO_KEY` / `CUELINKS_CID`), it wraps the URL into a tracking link via `monetizeUrl()`.
4. If monetization is disabled or returns an error, it safely executes an immediate **HTTP 307 Temporary Redirect** to the clean merchant PDP.
5. Fires asynchronous non-blocking telemetry event (`/api/telemetry/click`).

#### 📁 Code Files
- **Backend Route**: `src/app/api/redirect/route.js`
- **Affiliate Service**: `src/services/affiliate.js`
- **Validator**: `src/services/openweb.js` (`isAuthenticPDP()`)

#### 🛡️ Non-Negotiables
- Must **never** leave user on a blank page or throw a 500 error. Always redirect to target URL as fail-safe.

---

### 4.3 On-Demand Price Comparison (Head-To-Head)

#### 🎯 Business Intent
Gives the buyer complete transparency by showing what other merchants are charging for this exact product right now.

#### 🖥️ UX & User Touchpoints
- User clicks "Compare Offers" on any product card.
- Opens `HeadToHeadModal` with an animated spinner.
- Fetches real-time price offers from 4-8 stores (Flipkart vs Amazon vs Croma vs Reliance Digital).
- Displays:
  - Best Price tag ("Lowest on Flipkart: ₹64,999").
  - Price difference calculator ("You save ₹3,000 vs Amazon").
  - Direct buy buttons for each store.

#### 📁 Code Files
- **Component**: `src/components/HeadToHeadModal.jsx`
- **Backend Route**: `src/app/api/products/compare/route.js`
- **Service**: `src/services/openweb.js`

#### 🔑 APIs & Keys Used
- **OpenWeb Ninja**: `OPENWEBNINJA_API_KEY`
- **Redis Cache**: Upstash Redis (`cache:compare:v2:...`)

---

### 4.4 Price Drop Alert & Push Notification Modal

#### 🎯 Business Intent
Captures buyer intent and brings users back to the app when a product's price drops to their desired target.

#### 🖥️ UX & User Touchpoints
- User clicks Bell icon on Product Card.
- Opens `PriceDropModal`.
- User sets desired target price (e.g., current price ₹50,000; alert at ₹45,000) and email / web push permission.
- Saves alert subscription in Upstash Redis.

#### 📁 Code Files
- **Component**: `src/components/PriceDropModal.jsx`
- **Backend Route**: `src/app/api/user/price-alerts/route.js`
- **Database**: Upstash Redis

---

### 4.5 Wishlist & Saved Deals System

#### 🎯 Business Intent
Enables users to curate shopping lists across multiple ecommerce platforms in one unified place.

#### 🖥️ UX & User Touchpoints
- Clicking Heart icon saves/removes product from `SavedDealsDrawer`.
- Works anonymously via `localStorage`; automatically syncs to Clerk user metadata upon sign-in.
- Calculates total cart savings in the drawer.

#### 📁 Code Files
- **Component**: `src/components/SavedDealsDrawer.jsx`
- **Storage**: `localStorage` + Clerk metadata

---

### 4.6 Trust Sheet & Genuine Review Sentiment

#### 🎯 Business Intent
Protects shoppers from fake discounts and inflated MSRPs by analyzing review sentiments and pricing authenticity.

#### 🖥️ UX & User Touchpoints
- Clicking Shield icon opens `TrustSheetView`.
- Shows:
  - Trust Score: 1 to 100 (based on merchant reputability and discount validity).
  - AI Review Summary: 3 Pros and 2 Cons extracted from verified buyer feedback.
  - Price Authenticity: "Is this a genuine discount or regular price?"

#### 📁 Code Files
- **Component**: `src/components/TrustSheetView.jsx`
- **Backend Route**: `src/app/api/trust-sheet/route.js`
- **AI Service**: `src/services/trustSheetService.js` (powered by Gemini 2.5 Flash / Groq)

---

## 5. Virtual Try-On (VTON) Studio & Fashion Trial Room

### 🎯 Business Intent
Fashion has the highest return rate in online shopping (~30%). The VTON Studio lets users upload their photo and virtually wear any shirt, dress, jacket, or kurta to see fit and style before purchasing.

### 🖥️ UX Flow:
1. User clicks "👗 Try On" on any fashion product card.
2. `FashionTrialRoom` modal opens with the selected garment pre-loaded.
3. User uploads their own full-length photo (or chooses a diverse preset model).
4. System executes:
   - **Step 1 (PixelAPI)**: Human body detection and background segmentation.
   - **Step 2 (Modal Serverless GPU)**: High-resolution generative diffusion model renders the garment onto the user's pose.
5. User sees an interactive Before/After comparison slider.
6. User can download the render or click "Buy This Look" which redirects to the merchant PDP.

### 📁 Code Files & Route Map
- **Component**: `src/components/FashionTrialRoom.jsx`
- **Backend Routes**:
  - `src/app/api/vton/render/route.js` (Primary rendering endpoint)
  - `src/app/api/vton/stylist/route.js` (AI Fashion advice & size fit estimator)
- **Security & Validation**: `src/lib/vtonSecurity.js` (File size, MIME validation, NSFW checks)
- **Catalogs**: `src/data/fashionCatalog.js`

### 🔑 APIs & Keys Used
- **PixelAPI**: `PIXELAPI_KEY` (Human silhouette detection)
- **Modal Serverless GPU**: `MODAL_VTON_ENDPOINT` (IDM-VTON diffusion inference)
- **Groq Llama-3**: `GROQ_API_KEY` (Fashion stylist suggestions)

### 🛡️ Non-Negotiables
- Max image size 10MB, strictly JPG/PNG/WebP.
- Cold-start timeout resilience: If Modal GPU is warming up, client shows friendly progress bar instead of failing.

---

## 6. Interactive AI Shopping Copilot (In-Chat Agent)

### 🎯 Business Intent
A floating shopping assistant (Zippy Copilot) available across all pages. Users can ask conversational questions like "Which phone has the best camera under 30k?", "Compare Nike Revolution vs Pegasus", or "Find a good deal on air fryers".

### 🖥️ UX & User Touchpoints
- Floating Mascot pill in bottom-right corner.
- Clicking expands `InChatShoppingAgent` chat window.
- Features:
  - Instant streaming responses.
  - Interactive product mini-cards embedded directly inside chat messages.
  - 1-click prompt chips ("Help me choose", "Find coupons", "Compare prices").

### 📁 Code Files
- **Components**: `src/components/InChatShoppingAgent.jsx`, `src/components/ZippyInteractiveMascot.jsx`
- **Backend Route**: `src/app/api/ai/chat/route.js`
- **AI Service**: `src/services/aiProductCurator.js`

### 🔑 APIs & Keys Used
- **Google Gemini 2.5 Flash**: `GEMINI_API_KEY` (Primary)
- **Groq Llama-3 70B**: `GROQ_API_KEY` (High-speed fallback)
- **OpenRouter**: `OPENROUTER_API_KEY` (Tertiary backup)

---

## 7. Smart Purchase Terminal & Cart Analyzer

### 🎯 Business Intent
Acts as a final pre-checkout optimizer. Analyzes the total cart value, checks if buying an extra ₹100 item unlocks a ₹500 bank discount, and calculates maximum possible cashback.

### 🖥️ UX & User Touchpoints
- Accessible via "Smart Terminal" button or cart icon.
- `SmartPurchaseTerminal` modal prompts for cart total and merchant store.
- Recommends:
  - Best Credit/Debit Card to use (e.g., "5% cashback on HDFC Millennia").
  - Stackable coupon combinations.
  - Free delivery threshold warnings.

### 📁 Code Files
- **Component**: `src/components/SmartPurchaseTerminal.jsx`
- **Backend Route**: `src/app/api/terminal/analyze/route.js`
- **Service**: `src/services/terminalStrategyService.js`

---

## 8. Authentic Coupon Engine & Deals Vault

### 🎯 Business Intent
90% of coupon sites show expired or fake promo codes to generate ad clicks. ShopSmart AI strictly enforces an **Authentic Coupon Policy**: only verified, store-tested promo codes are displayed.

### 🖥️ UX & User Touchpoints
- Clicking "Coupons" tab shows `CouponResultView`.
- Filter by store (Swiggy, Zomato, Amazon, Myntra, Flipkart, Ajio, Domino's).
- Each `CouponCard` shows:
  - Code (e.g., `FLAT500`).
  - Discount terms (e.g., "₹500 off on orders above ₹1,999").
  - "Copy Code" button with instant haptic/clipboard feedback ("Copied!").
  - Verified timestamp ("Verified 2 hours ago").

### 📁 Code Files
- **Components**: `src/components/CouponCard.jsx`, `src/components/CouponResultView.jsx`, `src/components/CouponBadge.jsx`
- **Backend Routes**:
  - `src/app/api/coupons/route.js`
  - `src/app/api/coupons/analyze-cart/route.js`
- **Services**: `src/services/couponService.js`, `src/services/zyteService.js`, `src/services/couponDatabase.js`

### 🔑 APIs & Keys Used
- **Zyte API**: `ZYTE_API_KEY` (Scrapes real-time coupon payloads from merchant promo endpoints)
- **Upstash Redis**: Stores validated coupons with 12-hour TTL

---

## 9. User Identity, Session Security & Account Management

### 🎯 Business Intent
Seamless, frictionless authentication using Clerk. Users can search and compare without signing in; sign-in is only requested when saving preferences, managing wishlists, or accessing admin tools.

### 🖥️ UX & Technical Flow:
- Uses `@clerk/nextjs` App Router integration.
- Dedicated styled routes:
  - `/sign-in` -> `src/app/sign-in/[[...sign-in]]/page.js`
  - `/sign-up` -> `src/app/sign-up/[[...sign-up]]/page.js`
  - `/reset-password` -> `src/app/reset-password/page.js`
- Middleware (`src/middleware.js`):
  - Protects private admin routes.
  - Automatically exempts public routes (`/`, `/robots.txt`, `/sitemap.xml`, `/api/search`, `/api/redirect`).
- GDPR / DPDP "Delete Account" button in `UnifiedAccountModal` calls `DELETE /api/user/delete-account` to purge user data from Redis.

### 🔑 Keys Used
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

---

## 10. Customer Support & Ticket Vault

### 🎯 Business Intent
Allows users to report broken product links, incorrect prices, or request specific deals directly from the app.

### 🖥️ UX & User Touchpoints
- "Help & Support" button in footer opens `SupportTicketModal`.
- User selects category: `Broken Link`, `Incorrect Price`, `Feature Request`, `Other`.
- Inputs description and optional email.
- Saves ticket in Redis under `support:tickets:list`. Admin can view and resolve tickets in `/admin`.

### 📁 Code Files
- **Component**: `src/components/SupportTicketModal.jsx`
- **Backend Route**: `src/app/api/support/tickets/route.js`
- **Service**: `src/services/supportTickets.js`

---

## 11. Two-Tier Redis Caching Engine

### 🎯 Business Intent
Prevents redundant calls to expensive upstream scraping APIs (OpenWeb Ninja & Zyte), provides instantaneous **0-10ms** response times for popular searches, and protects the system during traffic spikes.

### ⚙️ Two-Tier Architecture:
- **Tier 1 (Semantic Exact Cache)**:
  - Key format: `cache:search:v14:{country}:{normalized_query}`
  - TTL: 4 hours (ensures prices stay fresh throughout the shopping day).
- **Tier 2 (Inventory Pool)**:
  - Every scraped product is saved in Redis hash pool `inventory:pool:v2`.
  - Used for instant auto-complete suggestions and category cross-pollination.

### 📁 Code Files
- **Core Service**: `src/services/redis.js`
- **Cache Logic**: `src/services/semanticCache.js`

### 🔑 APIs & Keys Used
- **Upstash Redis**: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

---

## 12. Security Radar, Bot Defense & Rate Limiter

### 🎯 Business Intent
Protects ShopSmart AI from malicious scrapers, automated bot spam, denial-of-service attacks, and prompt injection attempts.

### 🛡️ Multi-Layer Defense Shield:
1. **Stealth Tarpit for Scrapers**:
   - Detects `curl`, `wget`, `python-requests`, `headless`, and scraper user agents.
   - Applies intentional 2-second sleep delay (tarpit) and returns HTTP 503 (`SERVER_BUSY`).
2. **Passive Burst Tripwire**:
   - Detects rapid bursts (> 4 queries in 2.5 seconds from same IP).
3. **Sliding-Window Rate Limiter**:
   - Upstash Redis token bucket allows 60 searches per hour per IP.
   - If exceeded, returns HTTP 429 (`RATE_LIMITED`) and opens `QuotaModal` with cooldown timer.
4. **Content Moderation & Clamping**:
   - Queries clamped to 200 characters.
   - Strips malicious XSS, SQL injection, and adversarial system prompts via `checkSearchContentSafety()`.

### 📁 Code Files
- **Services**: `src/services/rateLimiter.js`, `src/services/securityRadar.js`, `src/services/securityShield.js`
- **Component**: `src/components/QuotaModal.jsx`

---

## 13. Admin Command Dashboard & Live Telemetry

### 🎯 Business Intent
Centralized command center for the store owner/admin to monitor platform health, view search traffic, flush Redis cache, toggle feature flags, and inspect error logs.

### 🖥️ UX & Security:
- Route: `/admin` (`src/app/admin/page.js`).
- Protected by `ADMIN_USER_IDS=user_3JGg_MnXc5O3td`. Any unauthorized user is strictly redirected to home.
- **Controls & Widgets**:
  1. **Live Search Telemetry**: Total queries today, cache hit ratio, average response time.
  2. **API Health Gauges**: Green/Yellow/Red status for OpenWeb Ninja, Redis, Gemini, Groq, Zyte.
  3. **1-Click Cache Flush**: Clears search cache or comparison cache instantly.
  4. **Feature Flag Switches**: Toggle Affiliate Monetization, VTON Studio, or In-Chat Copilot.
  5. **Crash Vault**: Displays recent handled server exceptions with error codes and timestamps.

### 📁 Code Files
- **Page**: `src/app/admin/page.js`
- **Backend Routes**:
  - `src/app/api/admin/settings/route.js`
  - `src/app/api/admin/health-audit/route.js`
- **Services**: `src/services/admin.js`, `src/services/adminMetrics.js`, `src/services/crashVault.js`

---

## 14. Sentinel Autonomous Self-Healing Cron Probe

### 🎯 Business Intent
Runs periodically in the background (via GitHub Actions or Vercel Cron) to verify system integrity. If any external API fails or a circuit breaker trips, the Sentinel automatically heals the circuit and alerts the admin.

### ⚙️ How It Works:
- Route: `GET /api/cron/heal-sentinel`
- Secured by Bearer Header: `Authorization: Bearer <CRON_SECRET>`
- Executes synthetic micro-probes on Redis, OpenWeb Ninja, and Gemini.
- Automatically resets any tripped `CircuitBreaker` states from `OPEN` to `HALF-OPEN` / `CLOSED`.

### 📁 Code Files
- **Backend Route**: `src/app/api/cron/heal-sentinel/route.js`
- **Service**: `src/services/autoHealingSentinel.js`, `src/services/circuitBreaker.js`
- **Automation**: `.github/workflows/sentinel-health-probe.yml`

### 🔑 Keys Used
- `CRON_SECRET` (`cron_b0280b0f7c4d36ecc2cd057df1dfc3335e316277`)

---

## 15. Adaptive SEO, Dynamic Robots & Sitemap Engine

### 🎯 Business Intent
Maximizes organic search engine traffic from Google, Bing, and social shares, while adapting dynamically to preview domains, Vercel URLs, or custom production domains without requiring manual code edits.

### ⚙️ How It Works:
- **Dynamic `robots.txt`** (`src/app/robots.js`):
  - Allows public crawling of `/`.
  - Disallows private admin and auth paths (`/admin`, `/api/*`, `/sign-in`, `/sign-up`, `/reset-password`).
  - Points to dynamic sitemap URL.
- **Dynamic `sitemap.xml`** (`src/app/sitemap.js`):
  - Generates XML sitemap entries for public deal pages.
  - Resolves domain dynamically via `process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || 'https://shopsmart-ai.com'`.
- **Clerk Middleware Bypass** (`src/middleware.js`):
  - `robots.txt` and `sitemap.xml` are explicitly excluded from Clerk route matching so crawlers never encounter login walls.

---

## 16. Master API Key & Environment Variable Matrix

This comprehensive table explains every environment variable configured in `.env.local` and Vercel:

| # | Environment Variable | Category | Purpose & Associated Features |
| :---: | :--- | :--- | :--- |
| **1** | `OPENWEBNINJA_API_KEY` | Primary Search | Powers real-time Google Shopping product scraping, pricing, and merchant offers in `/api/search` and `/api/products/compare`. |
| **2** | `UPSTASH_REDIS_REST_URL` | Cache Database | Connection URL for Upstash Redis database (`https://moved-mallard...`). |
| **3** | `UPSTASH_REDIS_REST_TOKEN` | Cache Database | Secret authentication token for Upstash Redis database operations. |
| **4** | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Authentication | Client-side Clerk publishable key (`pk_test_...`) for rendering sign-in modals and user buttons. |
| **5** | `CLERK_SECRET_KEY` | Authentication | Server-side Clerk secret key (`sk_test_...`) for protecting private routes and verifying JWT sessions. |
| **6** | `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Auth Routing | Defines sign-in route (`/sign-in`). |
| **7** | `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Auth Routing | Defines sign-up route (`/sign-up`). |
| **8** | `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Auth Routing | Redirect target after successful sign-in (`/`). |
| **9** | `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Auth Routing | Redirect target after successful registration (`/`). |
| **10** | `GEMINI_API_KEY` | AI Intelligence | Google Gemini 2.5 Flash API key for AI Shopkeeper chat, Trust Sheet review analysis, and deal curation. |
| **11** | `GROQ_API_KEY` | High-Speed AI | Groq Llama-3 API key for ultra-fast (sub-500ms) AI Shopping Guide suggestions and fashion styling. |
| **12** | `OPENROUTER_API_KEY` | AI Backup | Fallback provider for AI chat if Gemini or Groq hit temporary rate limits. |
| **13** | `PIXELAPI_KEY` | Virtual Try-On | Human body detection and background segmentation API key for the VTON Studio. |
| **14** | `MODAL_VTON_ENDPOINT` | Virtual Try-On | Serverless GPU diffusion inference endpoint URL for rendering garments on user photos. |
| **15** | `ZYTE_API_KEY` | Coupon Scraper | Pay-as-you-go proxy API for scraping verified promo codes from D2C merchant websites. |
| **16** | `GATEWAY_URL` | Microservices | Render gateway microservice endpoint URL (`https://ai-shopping-ucde.onrender.com`). |
| **17** | `GATEWAY_API_KEY` | Microservices | Secret token for communicating with the Render gateway microservice. |
| **18** | `ADMIN_USER_IDS` | Security & Admin | Comma-separated list of Clerk User IDs allowed to access `/admin` (`user_3JGg_MnXc5O3td`). |
| **19** | `CRON_SECRET` | Security & Sentinel | 48-character cryptographic secret protecting `/api/cron/heal-sentinel` from unauthorized access. |
| **20** | `EARNKARO_KEY` | Monetization | Future EarnKaro affiliate network key (kept on standby until affiliate approval). |
| **21** | `CUELINKS_CID` | Monetization | Future Cuelinks campaign ID (kept on standby until affiliate approval). |

---

---

## 17. Global OTT & Digital Subscriptions Hub

The Subscriptions & OTT Engine provides a verified, zero-fake-deal streaming and software subscriptions directory covering 6 Tier-1 countries with interactive plan switchers, 4-Level Savings Blueprints, AI-powered on-demand ingestion, weekly automated synchronization, and user retention funnels.

### 17.1 Supported Countries & Verified Brand Distribution (150 Total Brands)
- **India (IN 🇮🇳)**: 25 Brands (`subscriptionsCatalog.js`) — Netflix, Hotstar, JioCinema, Prime, SonyLIV, Zee5, YouTube Premium, Spotify, etc.
- **United States (US 🇺🇸)**: 25 Brands (`subscriptionsCatalogUS.js`) — Netflix US, Hulu, Max, Peacock, Paramount+, Apple TV+, Disney+ Bundle, etc.
- **United Kingdom (UK 🇬🇧)**: 25 Brands (`subscriptionsCatalogUK.js`) — Netflix UK, BBC iPlayer, ITVX, NOW, Channel 4+, Sky Stream, etc.
- **Canada (CA 🇨🇦)**: 25 Brands (`subscriptionsCatalogCA.js`) — Crave, CBC Gem, Sportsnet+, TSN, Citytv+, StackTV, etc.
- **Australia (AU 🇦🇺)**: 25 Brands (`subscriptionsCatalogAU.js`) — Stan, BINGE, Foxtel Now, Kayo Sports, Optus SubHub, etc.
- **United Arab Emirates (AE 🇦🇪)**: 25 Brands (`subscriptionsCatalogAE.js`) — OSN+, Shahid VIP, TOD, Starzplay Arabia, Careem Plus, etc.

### 17.2 The 4-Level Savings Blueprint Architecture
Every brand features our proprietary 4-level savings stack:
1. **Level 1 (Telecom Free Perk)**: Operators offering 100% complimentary access (Jio/Airtel/Vi in India, T-Mobile/Verizon in US, EE/O2 in UK, Telus in CA, Telstra/Optus in AU, Etisalat/du in UAE).
2. **Level 2 (Voucher / Gift Card Discount)**: 5%–15% cash savings via gift vouchers (Amazon Pay, Target Circle, Tesco Clubcard, Smiles UAE).
3. **Level 3 (Super Combo Pass)**: Curated multi-service bundles saving $10–$25/month over individual subscriptions.
4. **Level 4 (Promo Code with 1-Click Copy)**: Verified coupon codes with instant clipboard copying.

### 17.3 User Retention & CTA Architecture
- **Catalog Card CTA**: Unified single high-converting button **`✨ Reveal Secret Offers & Plans ↗`** (`w-full`, mobile touch-friendly 44px height, responsive desktop hover animation). Direct external exit buttons are completely removed from catalog cards to eliminate bounce rates.
- **Internal Landing Pages (`/subscriptions/[slug]`)**: Fully responsive SSR pages featuring interactive plan tier switches, 3-Mo / 1-Yr projection calculators, device/audio streaming matrices, and dynamic FAQs.
- **Safe Activation**: The official site button (`Visit Official [Brand] Site`) is placed exclusively at the bottom of the internal landing page, guarded with `rel="noopener noreferrer nofollow"`.

### 17.4 Zero-Scraping On-Demand AI Ingestion (`/api/subscriptions/on-demand`)
- When users search for uncataloged brands, Groq Llama-3 / Qwen AI generates verified catalog entries using pure LLM knowledge (0% web scraping, 0% server IP exposure).
- Input Whitelist regex (`/^[a-zA-Z0-9\s\-+&.'’]{2,40}$/`) and prompt injection shield block malicious payloads with HTTP 400.
- Schema sanitization guarantees positive numeric prices and secure `https://` URLs.
- Results are saved to Upstash Redis with a 90-day auto-expiry TTL (`ex: 7776000`) preventing database bloat.

### 17.5 Weekly Automated Synchronization Cron Job (`/api/cron/sync-subscriptions`)
- Scheduled in `vercel.json` every Sunday across staggered regional windows (IN 02:00, US 04:00, UK 06:00, CA 08:00, AU 10:00, AE 12:00 UTC).
- Cryptographically guarded by `CRON_SECRET` Bearer header or query parameter (unauthorized callers receive HTTP 401).
- Audits baseline plans and telecom bundles with AI; writes detected changes as Redis live overlays so production displays fresh pricing without requiring a redeploy.

---

## 🎯 Quick-Reference Troubleshooting Matrix

If any feature behaves unexpectedly in future sessions, look here first:

| Symptom / Error | Probable Root Cause | Immediate Fix Location |
| :--- | :--- | :--- |
| Search returns `SERVER_BUSY` | Request header matched bot regex (`curl`, `scraper`, `python-requests`). | Check line 167 of `src/app/api/search/route.js`. Normal browsers with `Mozilla/5.0` are unaffected. |
| Search returns `UNAUTHORIZED` | User is anonymous on production build without Clerk session. | Search requires sign-in on production unless `x-internal-test-auth` is provided. Check line 197 of `src/app/api/search/route.js`. |
| Missing products / Empty grid | Upstream query returned no matching items. Zero Fake Deals Policy engaged. | Expected behavior for obscure queries. Check `ProductNotFoundState.jsx`. |
| Redirect (`/api/redirect`) fails | Destination URL domain is not in the allowed merchant whitelist. | Inspect `src/services/openweb.js` (`isAuthenticPDP()`). |
| VTON Studio loading indefinitely | Modal Serverless GPU is in cold-start or image exceeded 10MB. | Inspect `src/app/api/vton/render/route.js` and `MODAL_VTON_ENDPOINT`. |
| Admin panel redirects to `/` | User's Clerk ID does not match `ADMIN_USER_IDS`. | Check Clerk ID in `ADMIN_USER_IDS` environment variable. |
| Robots or Sitemap returns 404 | Intercepted by Clerk middleware. | Ensure `/robots.txt` and `/sitemap.xml` are in `isPublicRoute` in `src/middleware.js`. |

---
*Last Updated: 2026-10-19 | Maintained by Antigravity AI Assistant for ShopSmart AI*
