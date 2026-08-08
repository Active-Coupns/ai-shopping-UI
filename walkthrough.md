# Walkthrough - AI Shopping Assistant Platform

> [!IMPORTANT]
> **ARCHITECTURAL DIRECTIVE: SEARCH PIPELINE IS OFFICIALLY LOCKED 🔒**
> - The core search route (`src/app/api/search/route.js`) is frozen.
> - SerpApi mapping, immersive store resolution, direct PDP URL extraction, and schema payload contracts must remain unchanged to preserve production stability and affiliate tracking.

## What Was Refactored & Deployed

### 📁 Project Repository & Structure
The code is fully committed and pushed to the remote repository: **[Active-Coupns/ai-shopping-UI](https://github.com/Active-Coupns/ai-shopping-UI.git)**

* **`src/app/api/search/route.js`**: Next.js serverless route proxy:
  - **Dynamic AI Insights**: Generates unique, item-specific matching insights ("Best For", "Why This Deal", "Trade-off") by parsing the product's actual title, category keywords, and price tiers dynamically.
  - **Dynamic Specifications**: Computes dynamic specs arrays on-the-fly (e.g. CPU, RAM, storage, form factor, sound driver, noise control) matching the specific product details returned by SerpApi instead of relying on hardcoded static templates.
  - **Immersive Store Details Integration**: Fetches SerpApi's immersive product details (`engine=google_immersive_product`) concurrently for the top 3 search results.
  - **Direct Merchant PDP Links**: Extracts direct seller checkout links (e.g. `flipkart.com/...`, `amazon.in/...`, `apple.com/...` PDP URLs) from `product_results.stores`. The primary product link is overridden with the lowest priced direct checkout URL, bypassing Google aggregator pages completely.
  - **Multi-Store Price Comparisons**: Dynamically maps all sellers from the immersive response's `stores` list into the `price_comparison` array. This populates multiple comparison store chips on our UI (e.g. Flipkart, Reliance Digital, Apple) with their specific pricing.
  - **Fail-safe Concurrent Timeouts**: Fetch operations use a 5-second AbortSignal timeout and a 5.5-second Promise.race timeout to avoid Vercel edge timeouts. If immersive details fail to load, the backend falls back gracefully to top-level search link formats without crashing. page fallback.
* **`src/components/ProductCard.jsx`**: Product card UI component updated to support `whitespace-pre-line` formatting in AI Matching Insights, allowing multi-paragraph insights to render beautifully.
* **`src/services/api.js`**: Frontend service mapping updated to compile raw arrays of category-specific specification strings directly, bypassing static hardcoded laptop label prefixes.

---

## Technical Features & API Integrations

### 1. Direct Merchant Redirect & Comparison Chips Verification
* **Direct Merchant PDP Link**: Overridden to the lowest priced direct seller:
  - **Link**: `http://www.flipkart.com/apple-iphone-16-black-128-gb/p/itmb07d67f995271?pid=MOBH4DQFG8NKFRDY...` (direct Flipkart PDP page, no Google aggregator).
* **Multi-Store Comparison Chips**: Dynamic direct PDP links mapped:
  - **Store 1**: Flipkart (₹66,749) — `is_lowest: true`
  - **Store 2**: Reliance Digital (₹68,990) — `is_lowest: false`
  - **Store 3**: Apple (₹69,900) — `is_lowest: false`
  - *No Google aggregator chips remain.*

### 2. Verified Local Build
Production build compiles cleanly in **5.6 seconds** and is deployed to the remote main repository.

---

## Environment Configuration Checklist

Configure the following secrets in your Vercel environment settings:

| Variable Name | Description | Example |
| :--- | :--- | :--- |
| `SERPAPI_API_KEY` | SerpApi search scraping authorization key | `e9b1512a6388a398c05d44895597291a52d0677e7e312420aee30998467c3e30` |
| `GEMINI_API_KEY` | Gemini AI search insights generation key | `YOUR_GEMINI_KEY` |
