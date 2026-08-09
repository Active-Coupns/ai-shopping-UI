# Walkthrough - AI Shopping Assistant Platform

We have successfully completed **Phase 1: Step 4 - Upstash Redis Caching System** across the platform.

## What Was Refactored & Deployed

### 📁 Project Repository & Structure
The code is fully committed and pushed to the remote repository: **[Active-Coupns/ai-shopping-UI](https://github.com/Active-Coupns/ai-shopping-UI.git)**

* **`src/services/redis.js`** [NEW]: A dedicated Redis connector initializing the `@upstash/redis` client. It reads the Upstash cloud parameters dynamically and contains an in-memory Map fallback database for zero-config offline tests.
* **`src/app/api/search/route.js`**:
  - **Cache Key Normalization**: Sanitizes input search query titles and country codes into key format: `cache:search:<country_code>:<normalized_query>`.
  - **Caching Pipeline**: Intercepts inbound calls to check for existing entries. If present (Cache Hit), returns the parsed cached products immediately (< 200ms) with `fromCache: true` in the response body.
  - **Quota Exemption**: Cache hits are served instantly to the client and bypass daily search count increments, leaving user daily quota limits untouched.
  - **Cache Set (TTL: 6 Hours)**: On cache misses, runs the standard SerpApi/Gemini pipeline and writes the output back to Upstash Redis with a 6-Hour Time-To-Live (21,600 seconds).

---

## Technical Features & API Integrations

### 1. Redis Caching Verification
* **Cache Miss/Hit Validator (`scratch/test-redis-cache.js`)**:
  - Cleared cache key: `cache:search:in:xbox-series-x-cache-test`.
  - Request #1 (Cache Miss) registered correctly, hitting SerpApi and updating user remaining daily quota from 10 to 9.
  - Request #2 (Cache Hit) completed instantly, returning `fromCache: true` and preserving user daily quota at 9 remaining searches.

### 2. Verified Local Build
Production build compiles cleanly in **4.7 seconds** and is deployed to the remote main repository.

---

## Environment Configuration Checklist

Configure the following secrets in your Vercel/Supabase environment settings:

| Variable Name | Description | Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project API gateway endpoint URL | `https://ekpmaffkxzxwboevcnrm.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project anonymous client API key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SERPAPI_API_KEY` | SerpApi search scraping authorization key | `e9b1512a6388a398c05d44895597291a52d0677e7e312420aee30998467c3e30` |
| `GEMINI_API_KEY` | Gemini AI search insights generation key | `YOUR_GEMINI_KEY` |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis Cloud DB REST Endpoint URL | `https://moved-mallard-184770.upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis Cloud DB Connection Token | `gQAAAAAAAtHCAAIgcDI2MGI1MWRiNDg3NTU0MDIyODQ0MjEwNDVmNzkxZWE1Ng` |
