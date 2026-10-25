-- ============================================================
-- AI Shopping Assistant - Fashion Catalog Database Schema
-- Supabase Project: hwdhbzazwxjjgnufgpab
-- ============================================================

-- 1. Create the fashion_catalog table
CREATE TABLE IF NOT EXISTS public.fashion_catalog (
    id TEXT PRIMARY KEY,
    gender TEXT NOT NULL,
    category TEXT NOT NULL,
    category_label TEXT,
    title TEXT NOT NULL,
    brand TEXT,
    color TEXT,
    price TEXT,
    raw_price NUMERIC DEFAULT 0,
    original_price TEXT,
    discount_percent INTEGER DEFAULT 0,
    store TEXT,
    direct_link TEXT,
    deal_link TEXT,
    image TEXT,
    image_url TEXT,
    description TEXT,
    fabric TEXT,
    occasion TEXT,
    fit TEXT,
    rating NUMERIC DEFAULT 4.0,
    reviews_count INTEGER DEFAULT 0,
    tryon_compatible BOOLEAN DEFAULT true,
    price_comparison JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create High-Performance Indexes for Sub-Millisecond Filtering
CREATE INDEX IF NOT EXISTS idx_fashion_gender_category ON public.fashion_catalog(gender, category);
CREATE INDEX IF NOT EXISTS idx_fashion_gender ON public.fashion_catalog(gender);
CREATE INDEX IF NOT EXISTS idx_fashion_category ON public.fashion_catalog(category);
CREATE INDEX IF NOT EXISTS idx_fashion_raw_price ON public.fashion_catalog(raw_price);
CREATE INDEX IF NOT EXISTS idx_fashion_tryon ON public.fashion_catalog(tryon_compatible);

-- 3. Row Level Security (RLS) Configuration
-- Allow anyone (public/anon) to read products and allow initial data seeding
ALTER TABLE public.fashion_catalog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" 
ON public.fashion_catalog 
FOR SELECT 
USING (true);

CREATE POLICY "Allow anon insert and update for catalog sync" 
ON public.fashion_catalog 
FOR ALL 
USING (true) 
WITH CHECK (true);
