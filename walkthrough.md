# Walkthrough - AI Shopping Assistant Platform

We have successfully connected our application to the real **Supabase Cloud database instance** and improved the unauthenticated user UX.

## What Was Refactored & Deployed

### 📁 Project Repository & Structure
The code is fully committed and pushed to the remote repository: **[Active-Coupns/ai-shopping-UI](https://github.com/Active-Coupns/ai-shopping-UI.git)**

* **`.env.local`**: Configured with live Supabase credentials:
  - `NEXT_PUBLIC_SUPABASE_URL`: `https://ekpmaffkxzxwboevcnrm.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrcG1hZmZreHp4d2JvZXZjbnJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyOTI0OTAsImV4cCI6MjEwMTg2ODQ5MH0.cNrI0LYSWBVgRJclKHFJ2mJkNJSJzjiBoKpOqoL9CZo`
* **`src/services/supabase.js`**:
  - Automatically switches off Mock Auth Mode to consume the real Supabase SDK client.
  - **Server-Side Token Auth**: Updated `updateUserMetadata` to support token-based authentication on the server-side, initializing a dynamic user client instance for the request token header to update user quota metadata fields directly on the cloud database.
* **`src/components/AuthModal.jsx`**:
  - Added support for a custom `message` prop, displaying context-aware banner headers to prompt or alert the user during authentication.
* **`src/app/page.js`**:
  - Updated unauthenticated search interception logic to set a polite banner message inside the Auth Modal instead of rendering raw HTTP 401 overlays.

---

## Technical Features & API Integrations

### 1. Cloud Database Connection Verification
* **Cloud Auth Tester (`scratch/test-real-supabase.js`)**:
  - Initiated a real sign-up call for `tester_1786297282608@smartshop.com` to the Supabase Cloud REST gateway.
  - Confirmed receipt of active user ID: `99e89ef7-1d8c-4b30-bb82-50a78a85839e`.
  - Verified user metadata keys (`full_name`, `country`, `search_count_today`, `last_search_date`) are properly created and persisted on the cloud database.

### 2. Unauthenticated Search Interception
* When a guest attempts a search query without logging in, the app triggers the Auth Modal with the following notice:
  *"Account Required to Search 🔒 To search products and compare prices, please create a free account or sign in first."*

### 3. Verified Local Build
Production build compiles cleanly in **6.7 seconds** and is deployed to the remote main repository.

---

## Environment Configuration Checklist

Configure the following secrets in your Vercel/Supabase environment settings:

| Variable Name | Description | Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project API gateway endpoint URL | `https://ekpmaffkxzxwboevcnrm.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project anonymous client API key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SERPAPI_API_KEY` | SerpApi search scraping authorization key | `e9b1512a6388a398c05d44895597291a52d0677e7e312420aee30998467c3e30` |
| `GEMINI_API_KEY` | Gemini AI search insights generation key | `YOUR_GEMINI_KEY` |
