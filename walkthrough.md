# Walkthrough - AI Shopping Assistant Platform

We have successfully implemented the **Email Verification & Password Reset workflows** across the platform.

## What Was Refactored & Deployed

### 📁 Project Repository & Structure
The code is fully committed and pushed to the remote repository: **[Active-Coupns/ai-shopping-UI](https://github.com/Active-Coupns/ai-shopping-UI.git)**

* **`src/services/supabase.js`**:
  - Exposed `resetPasswordForEmail`, `updateUser`, and `onAuthStateChange` methods in the standard `auth` helper object.
* **`src/components/AuthModal.jsx`**:
  - **Email Confirmation view**: Shows a polite glassmorphic verification notice after registering a new account, prompting users to confirm their email before logging in.
  - **Forgot Password flow**: Added a "Forgot Password?" trigger button in the login form which toggles to a reset view. Submitting their email sends a password reset link to their mailbox.
* **`src/app/reset-password/page.js`** [NEW]:
  - A premium, responsive glassmorphic reset password page.
  - Automatically listens to Supabase auth state change callbacks to capture active user sessions on password recovery callback redirection.
  - Features fields for "New Password" and "Confirm New Password", resetting the account credentials via `auth.updateUser({ password })`.
  - Animates a success notification and automatically redirects to the homepage landing view after 3 seconds.

---

## Technical Features & API Integrations

### 1. Verification Notice Triggering
* When sign-up completes, the card header transforms into a mailbox verification screen:
  *"Check Your Email 📩 We have sent a verification link to your email address. Please click the link to confirm your account before logging in."*

### 2. Guarding Unverified Accounts
* Integrated a client check inside `signInWithPassword` in `AuthModal.jsx`: If a user attempts to sign in using an account without a valid `email_confirmed_at` timestamp in production, the authentication is intercepted, their session is signed out, and they are shown a friendly notice to verify their email.

### 3. Verified Local Build
Production build compiles cleanly in **4.6 seconds** and is deployed to the remote main repository.

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
