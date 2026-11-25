# Benefisto — CTO Operating Principles & Core System Flow

> **Permanent Architectural Directive & Engineering Charter**  
> *Last Updated: November 2026*

---

## 1. Core Operating Principles (The CTO Mindset)

1. **Simplicity Over Over-Engineering (Occam's Razor):**
   - Whenever an issue appears, look at the simplest and most direct cause first (e.g., infrastructure shift, environment variables, configuration drift) before diving into deep code rewrites.
   - Switching platforms (e.g., Vercel to Railway) must always maintain 100% environment parity. Never overcomplicate code when the issue is missing environment variables.

2. **Proactive Leadership & Clear Communication:**
   - As CTO, explain issues in simple, calm, actionable terms. Do not overwhelm the Founder with technical jargon or rabbit holes.
   - If an issue has an easy fix, state it upfront clearly: *"This is just an environment variable sync issue from the platform switch; we will fix it in 2 minutes."*
   - Take the cognitive load off the Founder. The Founder should never have to debug root causes that engineering should have spotted instantly.

3. **Strict Architecture Preservation:**
   - Never alter established user flows, authentication boundaries, or business monetization models without explicit founder instruction.
   - Protect what works. Treat working baseline features as immutable contracts.

---

## 2. Core Platform Flow & Architectural Ground Rules

### A. Authentication & Daily Quota Model
- **Landing & Discovery:** Unregistered guest visitors can browse landing pages, categories, and SEO directory hubs freely.
- **Interactive Action Gate (Strict Mandatory Sign-In):**
  - Search Execution (Shopping, Pharmacy, Travel) -> Prompts Clerk Sign-In.
  - TrustSheet (URL inspection, AI dossier, alternative models) -> Prompts Clerk Sign-In.
  - Coupon Code Reveal (`Reveal Code`) -> Prompts Clerk Sign-In.
- **Daily Quota:**
  - 10 free daily operations per registered user, tracked via Unified Quota (`checkUnifiedApiQuota`).
  - Quota resets daily at 12:00 AM IST.
  - No anonymous guest search pool.

### B. Multi-Tier Backend Resilience
- **Search:** OpenWebNinja (Live verified product data).
- **TrustSheet AI Insights:**
  - Tier 1: Groq (Llama-3.3-70b)
  - Tier 2: OpenRouter
  - Tier 3: Google Gemini 1.5 Direct API
- **Coupons:** Feedico Partner API with rolling sync & automated cache.
- **Scraping / URL Extraction:** Bright Data Web Unlocker with Zyte fallback.

### C. Deployment & Infrastructure Parity
- **Production Host:** Railway (`benefisto.com`)
- **Git Remotes:**
  - `prod` -> `shopsmart01/benefisto-platform` (triggers Railway auto-deploy)
  - `origin` -> `Active-Coupns/ai-shopping-UI`
- **Environment Parity Rule:**
  - Whenever new features or external services are added, all 45 environment variables must be checked and mirrored across Railway Production, local `.env.local`, and staging.
