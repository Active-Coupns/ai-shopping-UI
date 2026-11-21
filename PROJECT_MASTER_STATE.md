# Benefisto Platform — Master Architecture, State & Handover

**Project Directory:** `C:\Users\ASUS\.gemini\antigravity\scratch\ai-shopping-assistant`  
**Production URL:** `https://www.benefisto.com`  
**Current Branch:** `main` (Latest Local Commit: `76f45ff`)  
**Previous Context ID:** `1b4980bf-3ef0-4ba5-b726-d42c052d6f5b`  
**Date & Timestamp:** 2026-11-21  

---

## 1. Executive Summary & Core Platform

Benefisto is an AI Shopping Co-Pilot and Virtual Try-On platform built for Indian & Global shoppers.
- **Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS, Lucide icons.
- **Authentication:** Clerk Auth (`@clerk/nextjs`).
  - Dev Publishable Key: `pk_test_ZWxlY3RyaWMtY3ViLTQ5NDQuY2xlcmsuYWNjb3VudHMuZGV2JA`
  - Prod Publishable Key: `pk_live_Y2xlcmsuYmVuZWZpc3RvLmNvbSQ`
- **Database / Cache:** Upstash Redis (Multi-Tier with L1 in-memory LRU + Upstash REST).
  - URL: `https://moved-mallard-184770.upstash.io`
- **AI & ML Engines:**
  - Gemini AI (Gemini 2.5 Flash / Flash-Lite) for Deep Shopping Search & Truth Sheet generation.
  - Modal / PixelAPI for Virtual Try-On (VTON) rendering.
- **Affiliate & Scraping:** OpenWebNinja (Google Shopping/Deals), Feedico, Cuelinks, EarnKaro, Zyte API, Bright Data.

---

## 2. Dodo Payments Integration (Live Production State)

Payment provider: **Dodo Payments** (Merchant of Record).

### Live Credentials & Endpoints:
- **API Key:** `dodo_live_pQWKvpsGTOXYkzcM.nEHz22_vfTtc8dd0koCFS7X6qhUFhQ4Cs8bWZEjsM3MThsei`
- **Webhook Endpoint:** `https://www.benefisto.com/api/webhooks/dodo` (ID: `ep_3MP9VjqLZlJkDUoPmrlUWOPrsgo`)
- **Webhook Secret:** `whsec_ONyvWHyRPIY7ykO53V4k5mCsO7WbB/z9`
- **Base URL:** `https://live.dodopayments.com`

### Active 4 Products in Live Mode:
| Plan Key | Product Name | Live Product ID | Price (INR) | Tax Setting | Credits & Validity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `tryon_medium` | TryOn Medium (14 Try-Ons) | `pdt_0NsPQyJ5kRsnh2Ez2iz5z` | ₹49 | Tax Exclusive (18% GST extra) | 14 Virtual Try-Ons (60 Days) |
| `tryon_large` | TryOn Large (30 Try-Ons) | `pdt_0NsPR1cPQuX4dgkldfe1c` | ₹99 | Tax Exclusive (18% GST extra) | 30 Virtual Try-Ons (60 Days) |
| `search_medium` | AI Search Medium (120 Searches) | `pdt_0NsPR1fUYu9UvLugIhLBo` | ₹39 | Tax Exclusive (18% GST extra) | 120 Deep Searches (60 Days) |
| `search_large` | AI Search Large (260 Searches) | `pdt_0NsPR1hEd0GbVRSCUSSnA` | ₹79 | Tax Exclusive (18% GST extra) | 260 Deep Searches (60 Days) |

*Note: All products are configured with `tax_inclusive: false` so that 18% GST is added on top at checkout and paid by the customer, preserving 100% of the net margin for Benefisto.*

---

## 3. Credit Architecture & Wallet Rules

1. **Mandatory Sign-In Rule:**
   - Guest/anonymous checkouts are disallowed.
   - When an unauthenticated user clicks "Top Up" anywhere on the platform (e.g. `/pricing` or modal), Clerk's sign-in modal triggers immediately.
   - Once authenticated, checkout creates a session with their permanent Clerk `userId` and verified `email`.
   - Redis maintains `email_to_user_id:<email>` mapping for 90 days.

2. **Redis Quota & Wallet Storage Keys:**
   - **Virtual Try-On (VTON):**
     - Credits: `user_tryon_credits:<userId>` (Atomic `incrby` on purchase, `decrby` on successful render)
     - Expiry: `user_tryon_expiry:<userId>` (Timestamp ms, set to `max(currentExpiry, now + 60 days)`)
     - Free Tier: 3 lifetime free try-ons tracked via `vton_trial:<userId_or_IP>`
   - **AI Search Engine:**
     - Free Tier: 10 daily searches per IP/user (`daily_search:<userId_or_IP>:<YYYY-MM-DD>`, resets daily)
     - Top-Up Credits: `user_search_credits:<userId>` (Used after daily free searches are exhausted)
     - Expiry: `user_search_expiry:<userId>` (60 days validity)
   - **Transaction Receipts:**
     - `user_payments:<userId>` (JSON list of successful top-up transactions)

3. **UI Indicators:**
   - `UnifiedAccountModal.jsx` (Preferences in header): Displays live dual-wallet breakdown: AI Search (free daily + active 60-day top-up credits) and Virtual Try-On (active paid credits + expiry date).
   - `FashionTrialRoom.jsx`: Dynamic badge below photo upload showing active paid try-ons or 3 free dots with a direct `+ Top Up` link.
   - `src/app/pricing/page.js`: Direct checkout handler with auto-resume upon login and verified user email badge.

---

## 4. Key Files & Working Tree State

- `src/services/dodoService.js`: Contains `LIVE_PRODUCT_IDS`, `TEST_PRODUCT_IDS`, and `createDodoCheckoutSession`.
- `src/app/api/webhooks/dodo/route.js`: Webhook listener for `payment.succeeded`, automatically adds additive credits to Redis and sets 60-day expiry.
- `src/app/api/payments/checkout/route.js`: API endpoint that creates checkout sessions with mandatory auth check.
- `src/app/api/user/quota/route.js`: Endpoint returning user's active search and tryon wallet balances & expiries.
- `src/app/pricing/page.js`: Clean pricing grid with ₹39/₹79/₹49/₹99 packages.
- `src/components/UnifiedAccountModal.jsx`: Modal displaying user preferences and credit balances.
- `src/components/FashionTrialRoom.jsx`: Virtual dressing room with live quota status.
- `.env.local`: Local environment variables configured with live Dodo keys and Upstash Redis.

---

## 5. Next Steps for New Session

1. **Production Deployment:**
   - Push commit `76f45ff` to `origin main`.
   - In Vercel Project Dashboard (`benefisto-platform`), ensure the 3 environment variables are set for Production:
     - `DODO_PAYMENTS_API_KEY = dodo_live_pQWKvpsGTOXYkzcM.nEHz22_vfTtc8dd0koCFS7X6qhUFhQ4Cs8bWZEjsM3MThsei`
     - `DODO_PAYMENTS_MODE = live`
     - `DODO_WEBHOOK_SECRET = whsec_ONyvWHyRPIY7ykO53V4k5mCsO7WbB/z9`
   - Trigger production deployment or deploy via Vercel CLI.
2. **Live Transaction Test:**
   - Sign in on `https://www.benefisto.com`.
   - Perform a live ₹39 or ₹49 top-up via UPI / Card.
   - Verify that Dodo webhook responds 200 and credits reflect in Preferences & Trial Room.
