# Walkthrough - AI Shopping Assistant Platform

We have successfully completed **Phase 1: Step 2 - In-Memory Request Queue System** across the platform.

## What Was Refactored & Deployed

### 📁 Project Repository & Structure
The code is fully committed and pushed to the remote repository: **[Active-Coupns/ai-shopping-UI](https://github.com/Active-Coupns/ai-shopping-UI.git)**

* **`src/app/api/search/route.js`**: Next.js serverless route proxy:
  - **`RequestQueue` Class** [NEW]: Defined an async FIFO request queue limiting active outbound executions to a concurrency of 3, with a 5-second waiting timeout safeguard.
  - **Queued Execution**: Wrapped all SerpApi search, fallback retry, and immersive detail requests inside the global `searchQueue` instance to restrict serverless concurrency.
  - **HTTP 429 Busy State**: Rejects queued requests that exceed the 5-second waiting limit immediately with an **HTTP 429 Too Many Requests** response and an appropriate JSON error payload.
* **`src/app/page.js`**: Home landing client page:
  - **HTTP 429 State Handling**: Updates the catch block to intercept 429 / busy status codes. Displays a friendly banner advising the user that the server is currently busy and to try again shortly, maintaining a clean visual state.

---

## Technical Features & API Integrations

### 1. Concurrency Queue Verification
* **Isolated Concurrency Simulator (`scratch/test-queue-concurrency.js`)**:
  - Enqueued 5 concurrent tasks with a limit of 3 and a 2-second timeout.
  - Tasks 1, 2, and 3 executed immediately.
  - Tasks 4 and 5 queued up, timed out at 2 seconds, and rejected with the correct `QueueTimeout` error as expected.
* **Search Route Block Status**:
  - Overloaded requests beyond bounds fail gracefully with **HTTP 429** (`{ "error": "Server is busy processing other search requests. Please try again in a moment." }`).

### 2. Verified Local Build
Production build compiles cleanly in **3.9 seconds** and is deployed to the remote main repository.

---

## Environment Configuration Checklist

Configure the following secrets in your Vercel/Supabase environment settings:

| Variable Name | Description | Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project API gateway endpoint URL | `https://your-proj.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project anonymous client API key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SERPAPI_API_KEY` | SerpApi search scraping authorization key | `e9b1512a6388a398c05d44895597291a52d0677e7e312420aee30998467c3e30` |
| `GEMINI_API_KEY` | Gemini AI search insights generation key | `YOUR_GEMINI_KEY` |
