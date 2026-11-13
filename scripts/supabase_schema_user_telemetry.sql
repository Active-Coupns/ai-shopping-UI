-- ============================================================
-- AI Shopping Assistant - Lean User Activity Ledger
-- Supabase Project: hwdhbzazwxjjgnufgpab
-- ============================================================

-- 1. Create the user_activity_ledger table
-- Ultra-lightweight append-only event stream (approx. 150-200 bytes per event)
-- Capable of storing over 2.5 million customer intent logs within Supabase free tier (500 MB)
CREATE TABLE IF NOT EXISTS public.user_activity_ledger (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_email TEXT,                                    -- Customer's email (if logged in, else NULL for guests)
    session_id TEXT NOT NULL,                           -- Anonymous device / session token
    action TEXT NOT NULL,                               -- SEARCH | PRODUCT_CLICK | AI_SUMMARY_ASKED | VISIT | USER_AUTH_SYNC
    category TEXT DEFAULT 'shopping',                   -- shopping | fragrance | electronics | travel | pharma | ott | platform
    details TEXT NOT NULL,                              -- Human-readable intent with [COUNTRY] tag e.g. "[IN] Amazon: iPhone 15" or "[US] Best Buy: MacBook"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. High-Performance Indexes for Instant Marketing Queries & Retargeting
CREATE INDEX IF NOT EXISTS idx_user_activity_email ON public.user_activity_ledger(user_email);
CREATE INDEX IF NOT EXISTS idx_user_activity_action ON public.user_activity_ledger(action);
CREATE INDEX IF NOT EXISTS idx_user_activity_category ON public.user_activity_ledger(category);
CREATE INDEX IF NOT EXISTS idx_user_activity_session ON public.user_activity_ledger(session_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON public.user_activity_ledger(created_at DESC);

-- 3. Row Level Security (RLS)
ALTER TABLE public.user_activity_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on user_activity_ledger" 
ON public.user_activity_ledger 
FOR SELECT 
USING (true);

CREATE POLICY "Allow anon insert on user_activity_ledger" 
ON public.user_activity_ledger 
FOR INSERT 
WITH CHECK (true);
