# Walkthrough - AI Shopping Assistant Platform

We have successfully completed **Phase 1: Step 1 - Supabase Authentication & Profile Menu** across the platform.

## What Was Refactored & Deployed

### 📁 Project Repository & Structure
The code is fully committed and pushed to the remote repository: **[Active-Coupns/ai-shopping-UI](https://github.com/Active-Coupns/ai-shopping-UI.git)**

* **`src/services/supabase.js`** [NEW]: A unified Supabase driver. To support rapid local development, this driver features an automatic **Mock Auth Fallback Mode** that triggers when Supabase environmental keys are unconfigured. It mimics the official Supabase Auth SDK exactly, enabling login, signup, session checking, and metadata registration without requiring database configuration.
* **`src/components/AuthModal.jsx`** [NEW]: A sleek glassmorphic login/signup modal collecting the user's Full Name, Email, Password, and target shopping country preference ("IN" / "US").
* **`src/components/ProfileMenu.jsx`** [NEW]: A dropdown navbar profile menu displaying initials, full name, email, target country, and log out options.
* **`src/app/page.js`**: Home landing client page:
  - Hooks up `useEffect` to retrieve and restore session states from Supabase auth.
  - Controls Auth Modal visibility, triggers signup/login/logout flows, and intercepts search requests if the user is unauthenticated.
  - Dynamically passes the user's country preference (`IN` / `US`) to the search API.
* **`src/services/api.js`**: Appends the active session token in the authorization header using the standard format `Authorization: Bearer <token>`.
* **`src/app/api/search/route.js`**: Protects the serverless search endpoint:
  - Verifies the Authorization header Bearer token against Supabase auth.
  - Rejects unauthenticated callers immediately with **HTTP 401 Unauthorized** error codes and descriptive message payloads.

---

## Technical Features & API Integrations

### 1. Protection Verification
* **Blocked Unauthenticated Request**:
  - `POST /api/search` -> **HTTP 401 Unauthorized** (`{ "error": "Unauthorized: Missing active session token" }`).
* **Successful Authenticated Request**:
  - `POST /api/search` (with valid mock token) -> **HTTP 200 OK** (processes SerpApi results).

### 2. Verified Local Build
Production build compiles cleanly in **3.8 seconds** and is deployed to the remote main repository.

---

## Environment Configuration Checklist

Configure the following secrets in your Vercel/Supabase environment settings:

| Variable Name | Description | Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project API gateway endpoint URL | `https://your-proj.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project anonymous client API key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SERPAPI_API_KEY` | SerpApi search scraping authorization key | `e9b1512a6388a398c05d44895597291a52d0677e7e312420aee30998467c3e30` |
| `GEMINI_API_KEY` | Gemini AI search insights generation key | `YOUR_GEMINI_KEY` |
