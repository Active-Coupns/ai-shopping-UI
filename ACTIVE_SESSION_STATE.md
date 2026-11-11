# 🧭 Benefisto (formerly ShopSmart AI) — Active Session State & Daily Handover Ledger
**File:** `ACTIVE_SESSION_STATE.md` (Project Root)  
**Last Updated:** 2026-11-10 23:50 IST  
**Session Status:** ACTIVE / PRODUCTION SETUP PHASE  

---

## 🚦 1. Current Work Anchor (Where We Are Right Now)
- **Official Domain Acquired**: `benefisto.com` (Registered on BigRock).
- **Active Setup Sequence (In-Progress)**:
  1. `BigRock -> Cloudflare Nameserver Propagation` (Nameservers: `carrera.ns.cloudflare.com`, `cartman.ns.cloudflare.com`).
  2. `Cloudflare Free Email Routing`: Destination verified (`athrav768@gmail.com`), waiting for zone activation to create secure alias (`core@benefisto.com` or `ops@benefisto.com`).
  3. `New Production Credentials`: Create clean private GitHub repo + fresh Vercel production account using `@benefisto.com`.
  4. `Connect Domain & Edge Protection`: Vercel + Cloudflare WAF + Bot Fight Mode.
  5. `Subdomain Activation`: Set up `admin.benefisto.com` for isolated admin dashboard access.
- **Strict Rule**: All existing features, architecture invariants, and partnership pipelines remain 100% frozen and intact. This is purely an infrastructure and branding transition.

---

## 🏛️ 2. Permanent Architectural & Business Invariants (NEVER FORGET)

| Module / Decision | Locked Architecture & Rationale | Current State |
| :--- | :--- | :---: |
| **Brand Transition** | `ShopSmart AI` $\rightarrow$ **`Benefisto`** (`benefisto.com`). Universal benefit & AI shopping advantage. | In Progress |
| **Quota Engine** | Clerk `userId` + Upstash Redis atomic quota (`/api/user/quota`). 0 credits on cache hits, 1 credit on paid external scrapes. | ✅ 100% Locked |
| **Search Engine** | OpenWeb Ninja Google Shopping RPC (1-2s latency). Headline offers first; multi-store comparison lazy-loaded on-demand. | ✅ 100% Locked |
| **Hardware TrustSheet** | Bright Data Residential IPs + Zyte. Unbiased LLM analysis, zero fake/dummy stores, zero-liability disclaimers. | ✅ 100% Locked |
| **Virtual Try-On (VTON)**| Fashn.ai Level-4 neural defense + Supabase storage layer. | ✅ 100% Locked |
| **Pharmacy Privilege** | Tata 1mg Guaranteed Partner Privilege Box (code `SHOPSMART18` $\rightarrow$ `BENEFISTO18`). Flat 18% OFF, 0 extra API latency. | ✅ 100% Locked |
| **SaaS & Software** | Secret (Tier 1 Credits) + NachoNacho/In-House Billing Vault (Tier 2 15-30% off). | ✅ 100% Locked |
| **Coupons & Affiliates** | Direct Feedico catalog (`fdco_`) + Impact.com master publisher. Zero Cuelinks/EarnKaro middlemen. | Phase 1 Target |
| **Security Blueprint** | 21-Layer Security, Hardcoded Admin Clerk ID (`ADMIN_USER_IDS`), HSTS, Anti-SSRF, Cloudflare Bot Shield. | Local Docs Locked |

---

## 🎯 3. Next Steps (In Exact Priority Order)
1. **Immediate Task 1 (DNS & Email)**: Wait for Cloudflare zone activation $\rightarrow$ Create secure corporate alias (`core@benefisto.com`).
2. **Immediate Task 2 (Clean Production Accounts)**: Set up fresh private GitHub repository + new Vercel production deployment.
3. **Immediate Task 3 (Codebase Re-branding)**: Update `ShopSmart AI` references to `Benefisto`, set canonical URLs to `benefisto.com`, verify zero build errors (`npm run build`).
4. **Immediate Task 4 (Subdomain)**: Route `admin.benefisto.com` to the isolated admin portal.
5. **Phase 1 Target**: Submit live `https://benefisto.com` for Feedico and Impact.com partner approvals with audit-ready Terms, Privacy & Compliance footers.

---

## 🛡️ 4. Active Invariants & Watch-Outs
- **Zero Architecture Breaks**: Backend API routing, rate limiters, and core services must NOT be modified.
- **Mobile Viewport Bounds**: Guarantee `320px` to `420px` responsive bounds without horizontal scroll.
- **Data-Fetch Quota Rule**: Paid scrapes cost 1 credit; cache hits cost strictly 0 credits ($0).
