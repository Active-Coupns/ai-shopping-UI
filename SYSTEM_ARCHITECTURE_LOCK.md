# ShopSmart AI - Architecture Lock & Specification
**Status:** LOCKED & PRODUCTION-STABLE  
**Last Updated:** October 2026  

This document serves as the **immutable single source of truth** for ShopSmart AI's core search, comparison, and redirect architecture. Any future AI assistant or developer working on this codebase **MUST strictly follow these non-negotiable rules**.

---

## 1. Unit Economics & Pure 2-Call Model (Non-Negotiable)

The entire user journey must consume **at most 2 external API calls** to RapidAPI / OpenWebNinja:

### Call #1: Product Search (`/api/search`)
- **API Call:** Exactly **1 single call** (`executeSearchRequest(query)`).
- **Behavior:** Fetches 15–20 live products in one request (~1 second).
- **Rule:** **NO background pre-fetching loop**. Do NOT call `executeProductDetailsRequest` for top products during search.
- **Display Limit:** Exactly **3 product cards** are shown on screen (`products.slice(0, 3)`).
- **AI Smart Chips:** Generated dynamically from the 15–20 in-memory products. Clicking chips filters the 3 displayed cards purely on the client side (**0 API calls**).

### Call #2: On-Demand Price Comparison (`/api/products/compare`)
- **API Call:** Exactly **1 call** (`executeProductDetailsRequest(productId)`).
- **Behavior:** Triggered **ONLY** when the user explicitly clicks the "Compare Prices" drawer on a specific card.
- **Rule (Strict Truthfulness):** 
  - **ONLY show stores that ACTUALLY have verified 100% exact direct product pages (PDPs).**
  - **NEVER synthesize or fabricate fake stores** (e.g. Croma, Amazon, Flipkart) with artificial markups (+7%, +11%) and generic search pages (`/s?k=...` or `/search?text=...`).
  - If a product only has 1 verified seller (e.g. official Samsung/Noise store), show that 1 verified store as lowest guaranteed.
  - If a product has 3 verified sellers (e.g. Amazon, Flipkart, Myntra), show all 3 with their exact direct PDPs.
- **Zero-Call Direct Visits:** Every link in the comparison drawer is a direct merchant link (`<a>`). Clicking it opens the store directly (**0 additional API calls**).

---

## 2. Direct PDP Resolution & URL Sanitization

- **Shopify & Brand Parameters:** URLs from Shopify stores (e.g. `gonoise.com`) must have regional query parameters stripped (`country`, `currency`) so that regional country-selection modals and 404 redirection errors are completely prevented.
- **Search URL Protection:** In `getSafeDirectPdpLink` (`ProductCard.jsx`), any URL containing `/search`, `/s?k=`, `/search/?text=`, or `searchterm=` must NEVER be falsely classified as an exact direct PDP.
- **Redis Caching:** All resolved product details and store direct PDPs are cached in Redis (`cache:details:v2:...` and `cache:pdp:direct:v4:...`) for **7 days** (`ex: 604800`). Repeated clicks or comparisons on the same product cost **0 API calls**.

---

## 3. Summary of Core Invariants

| Component | Rule | API Calls |
| :--- | :--- | :---: |
| **Search Bar** | 1 query loads 15–20 products | **1 Call** |
| **Product Cards** | Displays strictly 3 cards (`slice(0, 3)`) | **0 Calls** |
| **Smart Filter Chips** | In-memory filtering of 15–20 products | **0 Calls** |
| **Compare Prices Drawer** | Loads only verified real store PDPs | **1 Call** |
| **Buy Now / Store Clicks** | Direct merchant PDP links | **0 Calls** |
| **Total Session Cost** | Search + 1 Comparison + Clicks | **Flat 2 Calls** |

---
**DO NOT ALTER THESE SPECIFICATIONS WITHOUT EXPLICIT USER APPROVAL.**
