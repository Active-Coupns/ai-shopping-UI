# 🛡️ ARCHITECTURE RULES & SYSTEM BLUEPRINT

> **CRITICAL DIRECTIVE**: This document defines the permanent, verified architecture of the AI Shopping Assistant. 
> **NEVER MODIFY, REFACTOR, OR BREAK THESE RULES DURING UI OR FEATURE UPDATES.**

---

## 1. Product Search & PDP Architecture (LOCKED)

### A. Exact Product Pipeline (Medicines, Single Models, Pasted URLs)
- **Target Queries:** Specific brand/model searches (`Apple iPhone 15`, `Dolo 650`, pasted product URLs).
- **Behavior:** Renders **1 Single Master Card** with multi-store comparison.
- **API Calls:** Exactly **2 Calls**:
  1. `Call 1 (RapidAPI /search)`: Fetches initial raw product list.
  2. `Call 2 (RapidAPI /product-details)`: Fetches real-time multi-store offers (`details.offers`) and attributes for the top product.

### B. Broad Intent Pipeline (Categories, Budgets)
- **Target Queries:** Category queries (`laptop under 50000`, `washing machine`, `running shoes`).
- **Behavior:** Renders **3 Product Cards**.
- **API Calls:** Exactly **4 Calls**:
  1. `Call 1 (RapidAPI /search)`: Fetches raw products list, filtered by budget and tier-1 merchants.
  2. `Calls 2, 3, 4 (RapidAPI /product-details)`: Fired concurrently via `Promise.all` **only on the sliced top 3 products (`slice(0, 3)`)**.
- **Timeout Rule:** `fetchExactProductDetails` has `AbortSignal.timeout(15000)`. Do NOT reduce this timeout (calls need 8–12s under concurrent network load).

---

## 2. Store Offers & Direct Merchant PDP Links (LOCKED)

1. **100% Direct Product Pages Only (Zero Search Pages):**
   - Every deal link MUST be a direct product page (`/dp/...`, `/product/...`, `/p/...`).
   - Generic search fallbacks (`/s?k=`, `/search?q=`, `/searchB?q=`) are **STRICTLY FORBIDDEN**.
   - Helper `isSearchPageUrl(url)` validates every link.

2. **Key Name Compatibility (`deal_link` vs `link`):**
   - In `src/services/api.js`: All mapped offers MUST include both `link` and `deal_link`.
   - In `src/components/ProductCard.jsx`: Store links MUST always be resolved as:
     ```javascript
     const url = offer.deal_link || offer.link || offer.url;
     ```
   - Never check `offer.deal_link` alone, as it will evaluate to `undefined` and hide the comparison matrix!

3. **Comparison Matrix Rendering Rule:**
   - In `ProductCard.jsx`:
     ```javascript
     if (validOffers.length === 0) return null;
     ```
   - As long as `validOffers.length >= 1`, the store pricing pill MUST render. Never use `length <= 1`.

---

## 3. Blacklisted Domains & Platforms Filter (LOCKED)

The following platforms must **NEVER** appear in product listings or store comparisons:
- **EMI / Pay Later / Financing:** `snapmint`, `bajajfinserv`
- **B2B / Classifieds / Unofficial:** `indiamart`, `tradeindia`, `yourchoiz`, `exportersindia`, `quikr`, `olx`, `justdial`, `barbietales`, `glitz party`
- **Second-Hand / Refurbished:** `refurbished`, `pre-owned`, `second hand`, `unboxed`, `renewed`

**Filter Implementation:**
`isBlacklistedOffer(storeName, url, title)` in `src/services/rapidapi.js` filters both Call 1 results and Call 2 `details.offers`.

---

## 4. AI Shopping Guide & Questionnaire (LOCKED)

1. **Zero Premature Triggers:**
   - Clicking an option in `AiShoppingGuide.jsx` MUST only update `selectedAnswers` state.
   - It MUST NOT trigger premature API calls or close remaining questions.
2. **Explicit User Confirmation:**
   - The Search CTA button (`Confirm Preferences & Search Best Deals`) is enabled ONLY when all questions are answered (`allAnswered === true`).
   - Search begins **ONLY** when the user explicitly clicks the button.

---

## 5. Safe Rule for Any New Features (Chatbot, In-Chat Agent, UI Tweaks)
- Any new conversational layer (e.g., In-Chat Shopping Agent) must be implemented as a **pure consumer of the existing state**.
- New features must call `handleDirectSearch(newQuery)` to execute searches, preserving the existing locked engine.
- **NEVER EDIT `src/services/rapidapi.js` OR CORE PRODUCT DATA FLOW TO ADD UI FEATURES.**
