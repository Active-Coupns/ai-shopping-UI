# Benefisto Platform — Project Chronicle, Master State & AI Consciousness

**Workspace Path:** `C:\Users\ASUS\.gemini\antigravity\scratch\ai-shopping-assistant`  
**Production URL:** `https://benefisto.com`  
**Latest Git Commit:** `326b0d4` (Branch: `main`)  
**Parent Conversation ID:** `f2a88c90-b68a-4f91-bca0-98e5335a16b2`  
**Creation Date:** 2026-11-21  
**Last Updated:** 2026-11-23  

---

## 0. MANDATORY DIRECTIVES FOR THE INCOMING AI ASSISTANT

> [!IMPORTANT]
> **READ THIS BEFORE ENGAGING WITH THE USER:**
> 1. **Working Relationship & Personality**: You are NOT a junior reactive chatbot or a generic code generator. You are the **Dedicated Principal Architect & Virtual CTO** collaborating with the Founder.
> 2. **Intellectual Pushback (Zero "Yes-Man")**: If the Founder proposes an approach that creates technical debt, breaks existing infrastructure, wastes budget, or violates past architectural lessons, you MUST respectfully push back with clear reasons, data, and a superior alternative.
> 3. **Communication Tone**: Respond in articulate, polite, clear, and professional **Hindi** (with natural technical English terms like API, Redis, Checkout, Webhook). Maintain a collaborative, respectful, and sharp partner-level tone.
> 4. **Zero Hallucination Policy**: Never invent fake promo codes, never hallucinate retailer specs, never introduce middleman affiliate networks (Cuelinks, EarnKaro), and never create dummy data. If a store cannot be scraped, report it honestly.
> 5. **Single Source of Truth (SSOT)**: Multi-device user state must always anchor to Upstash Redis and server endpoints (`/api/user/quota`). Never rely on client-side ephemeral state (`useState`) for quota tracking.
> 6. **Local Preservation**: Keep work verified locally on `http://localhost:3000` before committing or pushing. Never push to Git or deploy without explicit approval from the user.

---

## 1. THE CHRONOLOGICAL JOURNEY & EVOLUTION (Day 1 to Live Launch)

This project has evolved through deliberate architectural pivots based on real-world engineering lessons:

### Episode 1: Scraping Shield & WAF Bypassing
- **Initial Problem**: Traditional datacenter proxies (basic Zyte, raw curl) were consistently blocked by enterprise Cloudflare, Akamai, and PerimeterX with blank HTML or false 200 responses.
- **The Pivot**: Transitioned exclusively to **Bright Data Web Unlocker** with a pool of 72M+ residential IPs dynamically geo-targeted to 6 regions (IN, US, GB, CA, AU, AE). For core product intelligence and Google Shopping feeds, integrated **OpenWeb Ninja API**.

### Episode 2: Monetization & Partnership Architecture
- **Initial Problem**: Middleman affiliate networks (Cuelinks, EarnKaro) took 20%–40% revenue cuts, delayed link approvals by weeks, and offered zero checkout discount codes.
- **The Pivot**:
  - Direct brand alliance with India's #1 trusted pharmacy (**Tata 1mg** via exclusive code `SHOPSMART18` giving flat 18% Rx and 10% health/supplements discount).
  - Direct publisher contracts on **Impact.com** for US/global SaaS tools.
  - Zero-maintenance automated daily coupon feed via **Feedico Managed Catalog** ($0/mo, 65% rev-share).
  - Wholesale Travel B2B infrastructure blueprint mapped in [`STRATEGY_BLUEPRINT_PARTNERSHIP.md`](file:///C:/Users/ASUS/.gemini/antigravity/scratch/ai-shopping-assistant/STRATEGY_BLUEPRINT_PARTNERSHIP.md).

### Episode 3: The 5-Vertical Consumer Platform
Benefisto is structured around 5 high-intent vertical savings engines:
1. **Retail & D2C Coupons (`/coupons`, `/coupons/[store]`)**: 600+ brands, Feedico cron sync, auto-copy promo codes, and affiliate handoff.
2. **Software & SaaS Hub (`/subscriptions`)**: 140+ tools, direct pricing math, annual vs monthly discount calculations, student blueprints.
3. **OTT & Streaming Passes (`/subscriptions`)**: Multi-screen 4K comparisons, telecom bundle cheat sheets.
4. **Travel, Flights & Hotels (`/travel`, `/travel/[slug]`)**: 76+ airlines & hotel chains, student extra baggage hacks, 21-day advance booking windows.
5. **Events & Entertainment BOGO (`/events`, `/events/[slug]`)**: 47+ ticketing platforms, BOGO bank card matrices, concert/festival phase blueprints.

### Episode 4: Virtual Try-On (VTON) Engine
- Powered by high-speed GPU clusters on **Modal.run** (`athrav0707--shopsmart-vton-engine-render-tryon.modal.run`) with PixelAPI backup.
- Provides a photo-realistic virtual dressing room where users upload their photo and try clothes dynamically with sub-second garment parsing.

### Episode 6: VTON Mobile-First Transformation & Haute Couture Atelier Engine
- **Original AI Studio Models**: Generated and saved 3 high-resolution, copyright-free photorealistic AI studio models (`/models/ai_model_men.jpg`, `/models/ai_model_women.jpg`, `/models/ai_model_kids.jpg`), replacing all external Unsplash URLs.
- **Mobile-First Trial Room Layout**: Streamlined `src/components/FashionTrialRoom.jsx` to eliminate cluttered guideline boxes and duplicated privacy notices. Embedded non-intrusive `[ ℹ️ Tips & Privacy ]` modal, placed mirror canvas at the top with side-by-side photo/garment upload buttons, and added horizontal category carousels directly beneath gender switches.
- **Organic Haute Couture Atelier Loader**: Built `src/components/FuturisticVtonLoader.jsx` featuring a breathing studio model backdrop, 60 FPS floating champagne bokeh canvas, minimalist frosted glass aura orb, and rotating consumer-friendly status stages (`PREPARING` → `FITTING` → `STYLING` → `READY`). Zero clunky boxes or fake geometric polygons.
- **Local Rate Limiter Quota Audit & Fix**: In `src/services/rateLimiter.js`, fixed the development loopback fallback where `remaining: 999` was hardcoded, replacing it with `remaining: limit` (10) so the Account modal consistently displays accurate quota.

### Episode 7: Complete Production Migration from Vercel to Railway.app (`sin1` Singapore)
- **Problem**: Vercel free tier constraints (serverless cold starts, execution timeouts, memory limits) restricted heavy background processing and AI orchestration for scaling.
- **The Solution**: Full backend-to-backend migration to **Railway.app** project `perfect-inspiration` running in Singapore edge region `sin1` (~35ms latency to India).
- **Environment & Database**: Programmatically injected all 32 production secrets (Supabase URL/keys, Upstash Redis, Clerk, Dodo Payments, Groq, Feedico, PixelAPI, CRON_SECRET).
- **Zero-Downtime Cloudflare DNS Cutover**:
  - Bound custom domain `benefisto.com` to Railway CNAME target `gekx0i2m.up.railway.app`.
  - Injected DNS ownership validation TXT record (`_railway-verify.benefisto.com`).
  - Active SSL certificate issued (`CERTIFICATE_STATUS_TYPE_VALID`).
  - Updated Cloudflare DNS records: deleted legacy Vercel A/TXT records, updated CNAME for `benefisto.com`, `www.benefisto.com`, and `sentinelx9.benefisto.com` with Cloudflare proxy active.
  - Preserved all Clerk auth, Cloudflare Email (MX/SPF), and Google Search Console verification records intact.
- **Verification**: Verified `https://benefisto.com/` returns HTTP 200 OK from `sin1` Railway edge with zero seconds of downtime.

### Episode 5: Google AI Scraping Shield & Programmatic SEO
- **Protection**: Injected `data-nosnippet="true"` on all promo code containers, masked codes with `••••••••`, and strictly omitted raw promo codes from Schema.org JSON-LD to prevent Google AI Overviews and scrapers from stealing proprietary codes without sending click traffic.
- **SEO & Discovery**:
  - Programmatic HowTo Schema across Travel, Events, and Subscriptions.
  - Hreflang alternate tags across 6 countries (`en-IN`, `en-US`, `en-GB`, `en-CA`, `en-AU`, `en-AE`).
  - Google Search Console (GSC) & Bing Webmaster Tools verified with 1,000+ page `sitemap.xml`.
  - IndexNow discovery protocol batch-submitted 603 URLs (Key: `e82fa9163b494191a34b22c74d812f90`).
  - Google Analytics (GA4) live: Measurement ID `G-9PGXEVPZB7` (Stream ID: 1636577983) and Tag `GTM-M7LDN8TZ`.

### Episode 6: Dodo Payments Integration Evolution (The Climax)
- **Phase A (The Sparks Experiment - Discarded)**:
  - Initially created a 3-tier "Sparks" micro-credit model (Starter 30 Sparks @ ₹19, Power Shopper 100 Sparks @ ₹49, VIP Pass @ ₹99).
  - *Why Discarded:* Sparks were vague and confusing to shoppers. Customers want to know exactly how many Try-Ons or Searches they are buying.
- **Phase B (The Clean 2-Tier Product Architecture)**:
  - Replaced with 4 explicit, dedicated top-up packs:
    * `tryon_medium` (14 Try-Ons @ ₹49)
    * `tryon_large` (30 Try-Ons @ ₹99)
    * `search_medium` (120 Searches @ ₹39)
    * `search_large` (260 Searches @ ₹79)
  - All packs strictly carry **60 Days Validity** with additive stacking.
- **Phase C (Tax Setting - Tax Exclusive)**:
  - Dodo defaulted to "Tax Inclusive", taking 18% GST out of Benefisto's margin.
  - Formally switched all products to **`tax_inclusive: false`**. 18% GST is added on top at checkout and paid by the buyer, leaving 100% net revenue to Benefisto.
- **Phase D (The Guest Checkout Flaw & Mandatory Clerk Login)**:
  - During test checkout, a purchase was made without signing in. Credits were assigned to an ephemeral IP hash rather than the user's permanent Clerk account.
  - *The Architectural Fix:* Enforced **Mandatory Authentication** at both UI and API level (`/api/payments/checkout`). Clicking "Top Up" immediately pops Clerk's Sign-In modal. Guest checkouts return `401 UNAUTHORIZED`.
- **Phase E (Dual Credit Wallets in Preferences & Trial Room)**:
  - Upgraded `UnifiedAccountModal.jsx` (Header -> Preferences) to display dual live balances: AI Search Engine (free daily searches + active 60-day top-ups) and Virtual Try-On (active paid try-ons + exact expiry date).
  - Upgraded `FashionTrialRoom.jsx` to dynamically display paid quota badge (`✨ Active Try-On Pack: X Paid Try-Ons Active (High GPU Speed • 60-Day Active)`).
- **Phase F (Live Mode Production Cutover & Railway Migration)**:
  - Generated Live Dodo API Key: `dodo_live_pQWKvpsGTOXYkzcM.nEHz22_vfTtc8dd0koCFS7X6qhUFhQ4Cs8bWZEjsM3MThsei`.
  - Created 4 official live products via Dodo Live API with `tax_inclusive: false`.
  - Registered Live Webhook endpoint `https://benefisto.com/api/webhooks/dodo` (Secret: `whsec_ONyvWHyRPIY7ykO53V4k5mCsO7WbB/z9`).
  - Production host migrated to Railway.app (`gekx0i2m.up.railway.app`) in `sin1` Singapore region.
  - Vercel project decommissioned and permanently deleted via API.
  - Production live and verified at `https://benefisto.com`.

### Episode 7: Virtual Try-On Mobile-First Layout & Haute Couture Atelier Loader
- Replaced external Unsplash model URLs with 3 high-definition, copyright-free photorealistic studio portraits (`/models/ai_model_men.jpg`, `/models/ai_model_women.jpg`, `/models/ai_model_kids.jpg`).
- Streamlined `FashionTrialRoom.jsx` with a mobile-first mirror canvas, action buttons, and interactive `[ ℹ️ Tips & Privacy ]` drawer modal.
- Engineered `FuturisticVtonLoader.jsx` featuring an organic breathing studio backdrop, 60 FPS floating champagne bokeh canvas, minimalist frosted glass aura orb, and 4 consumer-friendly rotating stages (`PREPARING` → `FITTING` → `STYLING` → `READY`).

### Episode 8: AI Trust Sheet 2.0 (Hardware Capabilities & Pure Product Truth Engine)
- Redefined backend prompt role in `src/services/trustSheetService.js` to a senior Chief Hardware Engineer: 100% objective, scientific, and free from brand-bashing.
- Replaced raw specs with a **Hardware Capability Matrix** (`keySpecs`), giving actionable everyday context (gaming FPS, thermal dissipation, screen nits legibility, multi-app headroom).
- Introduced **"6 Months Later: The Long-Term Reality"** timeline (`shelfLife.timeline`), projecting 3-stage degradation (First 6 Months, Year 1-2, Year 3+).
- Engineered **In-The-Box Reality & Day-1 Extras** (`inTheBox`), itemizing packaged accessories and warning of missing essentials (chargers, HDMI cables, wall brackets) with estimated initial setup expenses. Set to `null` for non-tech.
- Completely purged all coupon codes, bank discount cards, and promo clutter from Trust Sheet to guarantee an uncompromised Consumer Reports-level authority.
- Supercharged the **AI Product Truth Assistant** (`askProductAssistant`): Connected directly to the full 360-degree Trust Sheet context and configured to reply in the user's query language (Hindi/Hinglish/English) with decisive verdicts for personalized workloads.

---

## 2. PRODUCTION CREDENTIALS & SERVICE REGISTRY (CONFIDENTIAL)

### Dodo Payments (Merchant of Record - Live Production)
- **Mode:** `live`
- **Base URL:** `https://live.dodopayments.com`
- **API Key:** `dodo_live_pQWKvpsGTOXYkzcM.nEHz22_vfTtc8dd0koCFS7X6qhUFhQ4Cs8bWZEjsM3MThsei`
- **Webhook Endpoint ID:** `ep_3MP9VjqLZlJkDUoPmrlUWOPrsgo`
- **Webhook URL:** `https://benefisto.com/api/webhooks/dodo`
- **Webhook Secret:** `whsec_ONyvWHyRPIY7ykO53V4k5mCsO7WbB/z9`

### 4 Live Registered Products:
| Plan Key | Product Name | Live Product ID | Price | Tax | Credits & Validity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `tryon_medium` | TryOn Medium (14 Try-Ons) | `pdt_0NsPQyJ5kRsnh2Ez2iz5z` | ₹49 | 18% GST extra | 14 Virtual Try-Ons (60 Days) |
| `tryon_large` | TryOn Large (30 Try-Ons) | `pdt_0NsPR1cPQuX4dgkldfe1c` | ₹99 | 18% GST extra | 30 Virtual Try-Ons (60 Days) |
| `search_medium` | AI Search Medium (120 Searches) | `pdt_0NsPR1fUYu9UvLugIhLBo` | ₹39 | 18% GST extra | 120 Deep Searches (60 Days) |
| `search_large` | AI Search Large (260 Searches) | `pdt_0NsPR1hEd0GbVRSCUSSnA` | ₹79 | 18% GST extra | 260 Deep Searches (60 Days) |

### Upstash Redis (Cache & Atomic Credit Wallets)
- **REST URL:** `https://moved-mallard-184770.upstash.io`
- **REST Token:** `[STORED SECURELY IN RAILWAY PRODUCTION ENV & .env.local]`

### Clerk Authentication
- **Dev Publishable Key:** `pk_test_ZWxlY3RyaWMtY3ViLTQ5NDQuY2xlcmsuYWNjb3VudHMuZGV2JA`
- **Dev Secret Key:** `[STORED SECURELY IN .env.local]`
- **Prod Publishable Key:** `pk_live_Y2xlcmsuYmVuZWZpc3RvLmNvbSQ`
- **Prod Secret Key:** `[STORED SECURELY IN RAILWAY PRODUCTION ENV]`

### Production Hosting & Edge CDN
- **Production Host:** Railway.app container (`gekx0i2m.up.railway.app`, `sin1` Singapore region, ~35ms latency to India)
- **Edge CDN & WAF:** Cloudflare (Apex domain `benefisto.com` proxied, 301 canonical redirect for `www.benefisto.com`, Bot Fight Mode, Always HTTPS, Full SSL)
- **Production Crons:** GitHub Actions (`.github/workflows/production-crons.yml`) triggering coupon and travel deal syncs daily
- **Legacy Host:** Vercel (Project `prj_Wik7uVe6mNHJgryMw44VUsZ4N40Z` permanently deleted via API)
- **Active Production Aliases:** `https://www.benefisto.com`, `https://benefisto.com`

### Railway High-Performance Compute Engine
- **Project ID:** `1edcc2cd-4446-41c3-bd05-4eec29419749` (`perfect-inspiration`)
- **Service ID:** `08d0bc47-1202-4df3-91f4-84f13212d02a` (`benefisto-platform`)
- **Environment:** `production` (`790ebfd8-7cff-4b1a-a36f-8a81799d3792`)
- **Active Edge Region:** `sin1` (Singapore High-Speed Edge, optimized for India/APAC/Global)
- **Staging / Testing URL:** `https://benefisto-platform-production.up.railway.app`
- **Synced Secrets:** 32 Production environment variables synced directly from Vercel & `.env.local`.

---

## 3. REDIS STORAGE KEYS & WALLET ARCHITECTURE

| Data Domain | Redis Key Format | TTL / Logic | Purpose |
| :--- | :--- | :--- | :--- |
| **Virtual Try-On Paid Balance** | `user_tryon_credits:<userId>` | No TTL (Persistent) | Atomic integer incremented via `incrby` on top-up; decremented via `decrby` on successful render. |
| **Virtual Try-On Expiry** | `user_tryon_expiry:<userId>` | Timestamp ms | `Math.max(currentExpiry, now + 60 days)`. Additive window extension. |
| **Virtual Try-On Free Tier** | `vton_trial:<userId_or_IP>` | Persistent | Tracks 3 lifetime free try-ons. |
| **AI Search Paid Balance** | `user_search_credits:<userId>` | Persistent | Atomic integer for paid top-up searches, used after daily quota exhausts. |
| **AI Search Expiry** | `user_search_expiry:<userId>` | Timestamp ms | `Math.max(currentExpiry, now + 60 days)`. Additive window extension. |
| **AI Search Free Tier** | `daily_search:<userId_or_IP>:<YYYY-MM-DD>` | 24 Hours | 10 free daily searches. Resets midnight UTC. |
| **Email-to-User Mapping** | `email_to_user_id:<email>` | 90 Days | Bridges webhook payload to Clerk user ID if metadata is disrupted. |
| **Payment Receipts** | `user_payments:<userId>` | Persistent List | JSON array storing order ID, amount, planKey, credits, and ISO timestamp. |

---

## 4. MASTER FILE ATLAS & SUBSYSTEM DIRECTORY

- [`GEMINI.md`](file:///C:/Users/ASUS/.gemini/antigravity/scratch/ai-shopping-assistant/GEMINI.md): Master Architecture Constitution & Memory Lock (Immutable source of truth).
- [`ACTIVE_SESSION_STATE.md`](file:///C:/Users/ASUS/.gemini/antigravity/scratch/ai-shopping-assistant/ACTIVE_SESSION_STATE.md): Daily progress stack & live verification ledger.
- [`DEVELOPMENT_LOG.md`](file:///C:/Users/ASUS/.gemini/antigravity/scratch/ai-shopping-assistant/DEVELOPMENT_LOG.md): Detailed day-by-day changelog and release history.
- [`deployment.logs`](file:///C:/Users/ASUS/.gemini/antigravity/scratch/ai-shopping-assistant/deployment.logs): Production deployment timestamps & commit hashes.
- [`src/services/dodoService.js`](file:///C:/Users/ASUS/.gemini/antigravity/scratch/ai-shopping-assistant/src/services/dodoService.js): Dodo Payments client configuration, live/test mode detection, and product catalog mapping.
- [`src/app/api/webhooks/dodo/route.js`](file:///C:/Users/ASUS/.gemini/antigravity/scratch/ai-shopping-assistant/src/app/api/webhooks/dodo/route.js): Webhook endpoint listening for `payment.succeeded`, atomic credit grants, and 60-day expiry extension.
- [`src/app/api/payments/checkout/route.js`](file:///C:/Users/ASUS/.gemini/antigravity/scratch/ai-shopping-assistant/src/app/api/payments/checkout/route.js): Checkout session generator enforcing mandatory Clerk user authentication.
- [`src/app/api/user/quota/route.js`](file:///C:/Users/ASUS/.gemini/antigravity/scratch/ai-shopping-assistant/src/app/api/user/quota/route.js): Centralized quota endpoint returning live search and try-on balances and expiries.
- [`src/app/pricing/page.js`](file:///C:/Users/ASUS/.gemini/antigravity/scratch/ai-shopping-assistant/src/app/pricing/page.js): Dedicated pricing page with dual tabs, auto-checkout resume, and logged-in account badge.
- [`src/components/UnifiedAccountModal.jsx`](file:///C:/Users/ASUS/.gemini/antigravity/scratch/ai-shopping-assistant/src/components/UnifiedAccountModal.jsx): Preferences hub displaying dual live credit wallets and expiry dates.
- [`src/components/FashionTrialRoom.jsx`](file:///C:/Users/ASUS/.gemini/antigravity/scratch/ai-shopping-assistant/src/components/FashionTrialRoom.jsx): Dressing room with dynamic paid quota badge and 3-dot free tier indicators.
- [`src/services/redis.js`](file:///C:/Users/ASUS/.gemini/antigravity/scratch/ai-shopping-assistant/src/services/redis.js): Upstash multi-tier Redis client with native atomic `incrby` and `decrby`.

---

## 5. HOW TO CONTINUE IN A NEW CONVERSATION

When starting a fresh conversation, provide this prompt:
```
Read PROJECT_MASTER_STATE.md and continue assisting me as the Principal Architect & Virtual CTO for Benefisto.
```
The new agent will immediately load this document, inherit full contextual memory, adopt the CTO partnership mindset, communicate in polite professional Hindi, and continue with zero lag.
