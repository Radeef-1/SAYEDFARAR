-- Supabase Database Setup Script (No Authentication)
-- Paste this script directly in the Supabase SQL Editor

-- 1. Enable UUID Extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Platforms Table
CREATE TABLE IF NOT EXISTS public.platforms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    color TEXT, -- HEX or RGB value
    icon TEXT, -- Lucide icon name or CSS class
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Prepopulate Platforms
INSERT INTO public.platforms (name, color, icon) VALUES 
('Meta', '#1877f2', 'facebook'),
('TikTok', '#000000', 'music'),
('Snapchat', '#fffc00', 'ghost')
ON CONFLICT (name) DO NOTHING;

-- 3. Transactions Table (Consolidated)
CREATE SEQUENCE IF NOT EXISTS trx_number_seq;

CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_number TEXT UNIQUE,
    type TEXT NOT NULL CHECK (type IN ('topup', 'withdrawal')),
    platform_id UUID REFERENCES public.platforms(id) ON DELETE SET NULL,
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'Completed' CHECK (status IN ('Completed', 'Pending', 'Cancelled')),
    notes TEXT,
    created_by TEXT DEFAULT 'Admin', -- Default creator indicator
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. User Settings Table (Single Global Row)
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    low_balance_warning NUMERIC(15, 2) NOT NULL DEFAULT 500.00,
    critical_balance NUMERIC(15, 2) NOT NULL DEFAULT 100.00,
    currency TEXT NOT NULL DEFAULT 'SAR',
    default_language TEXT NOT NULL DEFAULT 'ar' CHECK (default_language IN ('ar', 'en')),
    theme TEXT NOT NULL DEFAULT 'dark' CHECK (theme IN ('light', 'dark')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Prepopulate Default Settings if empty
INSERT INTO public.settings (low_balance_warning, critical_balance, currency, default_language, theme)
SELECT 500.00, 100.00, 'SAR', 'ar', 'dark'
WHERE NOT EXISTS (SELECT 1 FROM public.settings);

-- 5. Activity Logs (Audit Trail)
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID, -- NULL if transaction was deleted
    action TEXT NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE')),
    details TEXT NOT NULL, -- JSON-like string showing changes
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Disable Row Level Security (RLS) since authentication is disabled
ALTER TABLE public.platforms DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs DISABLE ROW LEVEL SECURITY;

-- 7. Trigger for Transaction Numbers
CREATE OR REPLACE FUNCTION set_transaction_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.transaction_number IS NULL THEN
        NEW.transaction_number := 'TRX-' || LPAD(nextval('trx_number_seq')::text, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_trx_number ON public.transactions;
CREATE TRIGGER trigger_set_trx_number
BEFORE INSERT ON public.transactions
FOR EACH ROW EXECUTE FUNCTION set_transaction_number();
