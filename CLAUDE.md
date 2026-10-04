# 🛡️ ShopSmart Master Project Strategy & Architecture Guidelines

@AGENTS.md

## 📌 1. Search Provider & Failover Strategy (LOCKED)

The project operates on a **3-Layer Zero-Friction Provider Hierarchy**:

1. **Layer 1: SerpApi (Primary Engine)**
   - Used for initial launch and 2–3 months beta runway (~5,000 free searches across 2 accounts with 2,500 enterprise credits).
   - High speed, residential proxies, 1-call Google Shopping extraction with in-memory direct merchant PDP resolver.
   - Configured via `SERPAPI_KEY` or `SERPAPI_KEYS`.

2. **Layer 2: SearchApi.io (Secondary Pool)**
   - Multi-key rotation support via `SEARCHAPI_KEYS`.
   - Used as secondary pool.

3. **Layer 3: RapidAPI Real-Time Product Search (Permanent Backup Guard)**
   - **DO NOT REMOVE OR BREAK RAPIDAPI CODE.**
   - Serves as the permanent, battle-tested failover layer ($25 / 2,500 searches ~ ₹1/search).
   - When free credits exhaust and paid transition begins, if SerpApi does not discount, the system seamlessly transitions to RapidAPI without any code refactoring or debugging.

---

## 🔒 2. Absolute Rules for AI Assistants (DO NOT VIOLATE)

1. **NO SELF-MADE SCRAPERS:** Never introduce home-grown HTML scrapers that trigger anti-bot / Cloudflare / IP blocks.
2. **NO GENERIC SEARCH PAGE REDIRECTS:** Always ensure exact direct merchant Product Detail Page (PDP) URLs (`amazon.in/dp/...`, `flipkart.com/.../p/...`, `croma.com/p/...`).
3. **ZERO-DEBUGGING DEPLOYMENT GUARANTEE:** When the user supplies an API key, the system must work instantly without requiring debugging or architectural rewrites.
4. **RAPIDAPI INTEGRATION INTEGRITY:** Keep `rapidapi.js` fully intact, tested, and ready at all times as the permanent failover guard.
5. **TIER-1 TRUSTED MERCHANTS ONLY:** Maintain the strict allowlist filtering out B2B wholesale sites (TradeIndia, IndiaMART, Snapmint, etc.).
6. **CATEGORY SAFETY GUARDS:** Ensure medicines, cosmetics, fragrances, tech, and fashion maintain their respective classification guards and correct UI representations.

---

## 🛠️ 3. Environment Variable Protocol

- `SERPAPI_KEY` / `SERPAPI_KEYS`: SerpApi Primary Key(s)
- `SEARCHAPI_KEYS`: SearchApi.io Secondary Key(s)
- `RAPIDAPI_KEY` / `RAPIDAPI_KEYS`: RapidAPI Fallback Key(s)
- `GEMINI_API_KEY`: AI Summarization & Classification
