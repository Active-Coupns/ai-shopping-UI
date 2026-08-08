# Walkthrough - AI Shopping Assistant Platform

> [!IMPORTANT]
> **ARCHITECTURAL DIRECTIVE: SEARCH PIPELINE IS OFFICIALLY LOCKED 🔒**
> - The core search route (`src/app/api/search/route.js`) is frozen.
> - SerpApi mapping, immersive store resolution, direct PDP URL extraction, and schema payload contracts must remain unchanged to preserve production stability and affiliate tracking.

## What Was Refactored & Deployed

### 📁 Project Repository & Structure
The code is fully committed and pushed to the remote repository: **[Active-Coupns/ai-shopping-UI](https://github.com/Active-Coupns/ai-shopping-UI.git)**

* **`src/app/api/search/route.js`**: Next.js serverless route proxy:
  - **`isValidDirectPDPUrl` Enforcement**: Added a strict URL validator that rejects any URL starting with or containing `google.com`, `google.co.in`, `google.`, `ibp=`, or `serpapi`.
  - **Aggregator Link Drops**: When mapping comparison stores from SerpApi's immersive product details, any store listing containing Google redirect/aggregator paths is automatically dropped from the chip list.
  - **Product Card Filter Policy**: If a product has no valid direct merchant PDP links left after processing, the entire card is dropped from the returned array instead of serving a Google landing page fallback.
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
