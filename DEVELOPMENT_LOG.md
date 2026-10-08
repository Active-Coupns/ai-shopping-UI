# 🚀 ShopSmart AI — Daily Development & Git Release Log

> **Project Tracking Sheet**: Daily development logs, bug fixes, feature releases, and Git commit history for ShopSmart AI (Antigravity Assistant).

---

## 📊 Quick System & Release Overview

| Metric | Details |
| :--- | :--- |
| **Active Branch** | `main` |
| **Remote Repository** | `https://github.com/Active-Coupns/ai-shopping-UI.git` |
| **Framework & Engine** | Next.js 16 (App Router + Turbopack), React 19, Tailwind CSS |
| **AI Models & Backend** | Google Gemini 2.5 Flash / Flash-Lite, Upstash Redis, RapidAPI / OpenWebNinja |
| **Last Verified Build** | `next build` Passing (19/19 routes static/dynamic, 0 compile errors) |

---

## 📅 Daily Changelog & Feature Timeline

### 🗓️ 2026-10-07 (Latest Release)

* **Git Commit**: `7d6f74a`
* **Commit Message**: `feat: carousel comparison, pixel-perfect card alignment, pure metadata specs, and in-browser price alerts`
* **Status**: ✅ Pushed to GitHub `main`

#### 🌟 New Features & Enhancements Added:
1. **Interactive Carousel Comparison (`HeadToHeadModal.jsx`)**:
   - Replaced static lists with a fluid carousel/slider for selecting the second product for side-by-side comparison.
   - Removed distracting floating compare dock / bottom notification banner from `page.js`.
2. **Pure Metadata-Driven Specifications (No Rules, 0 Extra API Calls)**:
   - Eliminated hardcoded category `if/else` rule trees in both backend and prompt.
   - Initial 20-product search response directly supplies merchant `product_attributes` and descriptions.
   - AI extracts genuine specifications strictly from the product's actual metadata (Fabric/Fit for clothing, Hardware/RAM for laptops, Capacity/Stars for appliances).
   - Rendered sleek dark-theme **"Verified Technical & Hardware Sheet"** (`Real-Time AI Verified ✓`) inside the "Ask AI" modal.
3. **Zero-Email In-Browser Price Drop Tracker (`PriceDropModal.jsx`)**:
   - Replaced legacy email collection forms with instant in-browser push alerts and LocalStorage price tracking.
   - Accessible from both the card's Price Alert button and inside the Ask AI modal.
4. **Saved Deals Drawer (`SavedDealsDrawer.jsx`)**:
   - Added instant bookmarking drawer for user deal shortlisting without mandatory login friction.
5. **High-Contrast Re-Designed Action Buttons**:
   - Polished Market Avg section with distinct Amber/Gold **Price Alert** pill and Indigo **Compare Stores** pill.

#### 🛠️ Bugs & UI Alignment Fixed:
* **Pixel-Perfect Horizontal Button Alignment**:
  - Completely removed the uneven `VERIFIED TECHNICAL SPECIFICATIONS` checkmark list from the card face.
  - Pinned both main CTAs (`✨ Ask AI About This Product` and `Buy Directly at {Store}`) inside `mt-auto pt-3 flex flex-col gap-2` at the bottom of each card.
  - Added `min-h-[44px]` to title `<h3>` so 1-line and 2-line product titles remain level.
  - All cards across rows and carousels now maintain identical horizontal button alignment.
* **Syntax / Variable Deduplication**:
  - Removed duplicate `rawKeys` declaration in `src/services/rapidapi.js`.

#### 📂 Files Modified / Created:
* `src/app/page.js`
* `src/components/ProductCard.jsx`
* `src/services/rapidapi.js`
* `src/app/api/ai/review/route.js`
* `src/app/api/ai/chat/route.js`
* `src/components/HeadToHeadModal.jsx` *(New)*
* `src/components/PriceDropModal.jsx` *(New)*
* `src/components/SavedDealsDrawer.jsx` *(New)*

---

### 🗓️ 2026-10-07 (Earlier Release)

* **Git Commit**: `7126633`
* **Commit Message**: `feat: unified AI session ledger, spec-driven smart chips, redis category isolation, and voice search`
* **Status**: ✅ Pushed to GitHub `main`

#### 🌟 Features & Improvements:
1. **AI Session Ledger**: Cross-card memory tracking what the user previously inspected so subsequent reviews avoid repetition.
2. **Spec-Driven Smart Filter Chips (`SmartFilterChips.jsx`)**: 0ms client-side instant filtering by processor (Intel, Ryzen), RAM (8GB, 16GB), price tier, or category.
3. **Redis Category Isolation**: Cleaned query cache collision issues between electronics, clothing, and medicines.
4. **Voice Search Support**: Web Speech API integration in search hero for hands-free query input.

---

### 🗓️ 2026-10-06

* **Git Commit**: `d776098` & `b69089d`
* **Commit Messages**:
  - `chore: remove conflicting legacy architecture docs, dead supabase code, obsolete scripts and fake catalog fallbacks`
  - `feat: lock pure 2-call architecture, strictly 3-card display, and verified direct PDPs`
* **Status**: ✅ Pushed to GitHub `main`

#### 🌟 Features & Improvements:
1. **Pure 2-Call Architecture Locked**:
   - Call 1: Fetches 20 candidate products from RapidAPI / OpenWebNinja.
   - Call 2: Fetches exact multi-store offers only on-demand for the top anchor product.
   - Strict quota protection and 0 wasted API credits.
2. **Strict 3-Card Display**: Screen displays the top 3 best-matched products, with hidden pool products accessible via chat and filter chips.
3. **Direct Merchant PDPs**: Complete elimination of Google Shopping redirects and `ibp=oshop` intermediate links, replacing them with direct Amazon, Flipkart, Myntra, and Reliance links.
4. **Codebase Cleanup**: Purged dead legacy Supabase code, obsolete scripts, and artificial catalog fallbacks.

---

### 🗓️ 2026-10-05 to 2026-10-01 (Foundational Milestones)

* **Commits**: `1e1b89f`, `ba91acd`, `59d4563`, `bb23fcf`, `6277d78`
* **Key Achievements**:
  - Tier-1 merchant whitelist / B2B blacklist (filtering out TradeIndia, IndiaMart, pre-owned items).
  - URL-based direct product search (pasting Amazon / Flipkart links).
  - Pharmacy & OTC Medicine Clinical Safety Sheet with doctor warnings.
  - Supplements Nutrition & Purity Factsheet.
  - Automated Coupon Engine with real store promo codes.
  - Responsive Mobile-first header and country preference selector (IN / US).

---

## 🧭 Future Roadmap & Discussion Backlog

| Feature Area | Current Status | Notes / Plan |
| :--- | :--- | :--- |
| **In-Chat Shopping Agent** | 🔒 Intentionally Frozen & Protected | User instructed not to touch until core card UI is stable. Ready for safe discussion when needed. |
| **Virtual Try-On (VTON) / AI Stylist** | 🧪 Backend Scaffolded | APIs ready (`/api/vton/extract`, `render`, `stylist`) for fashion trial room. |
| **Cart Coupon Optimizer** | 🧩 Engine Implemented | Cart analysis API ready (`/api/coupons/analyze-cart`). |
| **Production Deployment** | 🚀 Build Verified (0 errors) | Ready for Vercel / Live custom domain setup. |

---

## 📝 Daily Entry Template (For Future Updates)

```markdown
### 🗓️ YYYY-MM-DD
* **Git Commit**: `<hash>`
* **Commit Message**: `<message>`
* **Status**: ✅ Pushed to GitHub `main`

#### 🌟 New Features & Enhancements Added:
- Item 1...
- Item 2...

#### 🛠️ Bugs & Issues Fixed:
- Fix 1...

#### 📂 Files Modified / Created:
- `path/to/file`
```
