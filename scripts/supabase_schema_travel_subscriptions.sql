-- ============================================================
-- AI Shopping Assistant - Travel & Subscriptions Database Schema
-- Supabase Project: hwdhbzazwxjjgnufgpab
-- ============================================================

-- 1. Create the travel_catalog table (160 Curated Multi-Country Travel Deals)
CREATE TABLE IF NOT EXISTS public.travel_catalog (
    id TEXT PRIMARY KEY,
    country TEXT NOT NULL,
    platform_id TEXT NOT NULL,
    platform_name TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    tagline TEXT,
    deal_type TEXT,
    promo_code TEXT,
    discount_value TEXT,
    estimated_savings TEXT,
    verified_score NUMERIC DEFAULT 95,
    verified_date TEXT DEFAULT 'Today',
    min_spend TEXT,
    expiry_note TEXT,
    is_evergreen BOOLEAN DEFAULT true,
    terms TEXT,
    direct_url TEXT,
    badge TEXT,
    accent_color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for lightning fast travel queries (< 10ms)
CREATE INDEX IF NOT EXISTS idx_travel_country_category ON public.travel_catalog(country, category);
CREATE INDEX IF NOT EXISTS idx_travel_country ON public.travel_catalog(country);
CREATE INDEX IF NOT EXISTS idx_travel_category ON public.travel_catalog(category);

-- RLS for travel_catalog
ALTER TABLE public.travel_catalog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on travel_catalog" 
ON public.travel_catalog 
FOR SELECT 
USING (true);

CREATE POLICY "Allow anon insert and update on travel_catalog" 
ON public.travel_catalog 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- ------------------------------------------------------------

-- 2. Create the subscription_catalog table (150 Global OTT & Software Platforms)
CREATE TABLE IF NOT EXISTS public.subscription_catalog (
    id TEXT PRIMARY KEY,
    country TEXT NOT NULL,
    platform_id TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    tagline TEXT,
    logo_text TEXT,
    accent_color TEXT,
    badge TEXT,
    popular_shows JSONB DEFAULT '[]'::jsonb,
    plans JSONB DEFAULT '[]'::jsonb,
    savings_blueprint JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for lightning fast subscription queries (< 10ms)
CREATE INDEX IF NOT EXISTS idx_subscription_country_category ON public.subscription_catalog(country, category);
CREATE INDEX IF NOT EXISTS idx_subscription_country ON public.subscription_catalog(country);
CREATE INDEX IF NOT EXISTS idx_subscription_category ON public.subscription_catalog(category);

-- RLS for subscription_catalog
ALTER TABLE public.subscription_catalog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on subscription_catalog" 
ON public.subscription_catalog 
FOR SELECT 
USING (true);

CREATE POLICY "Allow anon insert and update on subscription_catalog" 
ON public.subscription_catalog 
FOR ALL 
USING (true) 
WITH CHECK (true);
