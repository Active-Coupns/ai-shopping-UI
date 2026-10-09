# 🔒 ShopSmart AI - Coupon & Deals System (Official Locked Architecture)
**Last Updated:** October 9, 2026  
**Status:** 100% LOCKED & CONFIRMED • DO NOT MODIFY WITHOUT EXPLICIT USER CONSENT  

---

## 1. Executive Summary & Purpose
The Coupon & Deals Discovery subsystem of ShopSmart AI allows users to find, evaluate, and verify promotional codes across 50+ major Indian and Global merchants (Zomato, Swiggy, Myntra, Blinkit, Zepto, Domino's, etc.), as well as scan their checkout cart screenshots using Vision AI to automatically discover the #1 highest savings coupon.

---

## 2. Core Components & Technical Implementation

### A. Snap & Save AI Cart Scanner (Hero Spotlight)
- **File:** `src/components/SearchHero.jsx` (Coupons Mode)
- **Functionality:** 
  - Positioned prominently at the very top of the Coupons discovery view.
  - Accepts image upload or camera snapshot of a checkout screen (e.g. Swiggy/Zomato/Myntra cart bill).
  - Routes to `POST /api/coupons/analyze-cart`.
  - Uses **Google Gemini 1.5 Flash Vision** (`GEMINI_API_KEY`) to extract:
    1. Merchant store name (e.g. "Zomato", "Swiggy", "Domino's").
    2. Cart subtotal bill (e.g. ₹349, ₹899).
  - Runs deterministic optimizer against the store's verified coupon slabs to output:
    - **Best Coupon Pick** (highest net rupee savings).
    - **Next Tier Opportunity** (e.g. "Add ₹101 more to qualify for ₹150 OFF").

### B. Master Deterministic Coupon Database
- **File:** `src/services/couponDatabase.js`
- **Schema per Coupon:**
  - `id`: Unique identifier (e.g. `zom-cravings`)
  - `code`: Promo code string (e.g. `CRAVINGS`)
  - `title`: Short discount summary (e.g. `Flat 40% OFF up to ₹80`)
  - `description`: Eligibility details
  - `discount_type`: `"PERCENT"` or `"FLAT"`
  - `discount_val`: Number (e.g. 40 or 100)
  - `min_order`: Cart threshold in INR
  - `max_discount`: Cap limit in INR
  - `payment_method`: E.g. "All Payment Methods" or "HDFC Bank Credit/Debit Cards"
  - `valid_till`: Expiration date
  - `verified_rate`: Success rate metric (e.g. "98% Success Rate")
  - `badge`: E.g. "VERIFIED ACTIVE", "NEW USER SPECIAL", "BANK OFFER"
  - `link`: Merchant website URL

### C. Store Discovery Carousel
- **File:** `src/components/StoreCardCarousel.jsx`
- **Functionality:**
  - Category selector pills: `All`, `🍕 Food & Dining`, `🛒 Grocery & Quick Commerce`, `👗 Fashion & Lifestyle`, `📱 Tech & Electronics`, `✈️ Travel & Cabs`.
  - Responsive swipeable cards with brand logos, color accents, active promo count, and instant click-to-store navigation.

### D. In-Page Click-to-Reveal System
- **File:** `src/components/CouponResultView.jsx`
- **Zero-Redirect Rule:**
  - Clicking "Reveal Code" unmasks the code directly in-page and copies it to clipboard (`navigator.clipboard.writeText`).
  - Triggers a celebratory confetti particle explosion (`AnimatePresence`).
  - Does NOT kick the user out of the website.
  - A subtle secondary link ("Open Store in new tab ↗") allows optional manual navigation.

### E. ✨ AI Coupon Fit Guide ("Will this work for me?")
- **File:** `src/components/CouponResultView.jsx`
- **Algorithm:** `getCouponAiFitGuide(coupon)` (0ms client-side calculation).
- **Interactive Accordion:** 1-tap expandable pill on each coupon card and on the Best Pick hero card.
- **Data Provided to User:**
  1. 🎯 **Valid For**: Who qualifies (New accounts only, Bank cardholders, Universal).
  2. ⚡ **Best Cart Size (Sweet Spot)**: Exact rupee cart calculation for maximum discount yield.
  3. ⚠️ **The Hidden Catch**: Unmasks discount caps, subtotal requirements, and payment restrictions.
  4. 💳 **Payment Mode**: Accepted payments (UPI, All cards, or specific bank cards).

### F. Rock-Solid Back Navigation
- **File:** `src/app/page.js` & `src/components/CouponResultView.jsx`
- **Architecture:**
  - `handleReset(returnTab)` sanitizes incoming arguments to ignore React `SyntheticEvent` objects.
  - Defaults to `searchIntent = "COUPONS"` whenever the user is in `coupon_results`.
  - Both the `ArrowLeft` back button and the `← Browse All Stores` button pass `"COUPONS"` explicitly.
  - Returning from any coupon page lands 100% reliably on the Coupons main homepage.

---

## 3. Production Deployment & Automation Pipeline

### A. Existing Connected Services
1. **ScraperAPI:** `SCRAPERAPI_KEY=c062c77fb597678b33bf1849c34c989a` (4,954 active credits) for real-time coupon scraping.
2. **Upstash Redis:** `UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN` (Active cloud cache & database).
3. **Google Gemini:** `GEMINI_API_KEY` (Active Vision OCR & AI Chat).

### B. Daily 100-Store Auto-Sync Strategy (Production Cron)
- **Runner:** GitHub Actions (`.github/workflows/sync-coupons.yml`) running at 2:30 AM IST daily.
- **Workflow:**
  1. Iterates top 100 Indian stores (Zomato, Swiggy, Myntra, Blinkit, etc.).
  2. Scrapes active vouchers via ScraperAPI.
  3. Upserts clean coupons into Upstash Redis under `store:<store_key>`.
  4. Day-time traffic serves 100% from Upstash Redis at 50ms latency (0 ScraperAPI credits spent during daytime).

### C. On-Demand Long-Tail Fallback
- For stores not in the top 100:
  1. Next.js API checks Upstash Redis.
  2. If not found, calls ScraperAPI on-demand.
  3. Caches result in Redis for 24 hours.

### D. Rolling SEO Strategy (15-20 Days Auto-Refresh)
- **Dynamic Timestamps:** Automatic Month/Year invalidator (`getActiveSeoPeriod()`) ensuring titles like "November 2026 Verified Codes" update automatically without redeployment.
- **Semantic FAQs:** Pre-indexed Schema.org FAQPage accordions and Insider Savings Hacks per store.

---
**END OF SPECIFICATION - REMAINS PERMANENTLY LOCKED**
