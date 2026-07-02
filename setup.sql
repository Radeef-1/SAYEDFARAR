-- Supabase Database Setup Script (No Authentication - Fresh Setup)
-- Paste this script directly in the Supabase SQL Editor

-- 1. Drop old tables, triggers, and sequences to clean up previous schema version
DROP TRIGGER IF EXISTS trigger_set_trx_number ON public.transactions;
DROP FUNCTION IF EXISTS set_transaction_number();
DROP TABLE IF EXISTS public.activity_logs CASCADE;
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.settings CASCADE;
DROP TABLE IF EXISTS public.platforms CASCADE;
DROP SEQUENCE IF EXISTS trx_number_seq CASCADE;

-- 2. Enable UUID Extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. Platforms Table
CREATE TABLE public.platforms (
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

-- 4. Transactions Table (Consolidated)
CREATE SEQUENCE trx_number_seq;

CREATE TABLE public.transactions (
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

-- 5. User Settings Table (Single Global Row)
CREATE TABLE public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    low_balance_warning NUMERIC(15, 2) NOT NULL DEFAULT 500.00,
    critical_balance NUMERIC(15, 2) NOT NULL DEFAULT 100.00,
    currency TEXT NOT NULL DEFAULT 'SAR',
    default_language TEXT NOT NULL DEFAULT 'ar' CHECK (default_language IN ('ar', 'en')),
    theme TEXT NOT NULL DEFAULT 'dark' CHECK (theme IN ('light', 'dark')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Prepopulate Default Settings
INSERT INTO public.settings (low_balance_warning, critical_balance, currency, default_language, theme)
VALUES (500.00, 100.00, 'SAR', 'ar', 'dark');

-- 6. Activity Logs (Audit Trail)
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID, -- NULL if transaction was deleted
    action TEXT NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE')),
    details TEXT NOT NULL, -- JSON-like string showing changes
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Disable Row Level Security (RLS) since authentication is disabled
ALTER TABLE public.platforms DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs DISABLE ROW LEVEL SECURITY;

-- 8. Trigger for Transaction Numbers
CREATE OR REPLACE FUNCTION set_transaction_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.transaction_number IS NULL THEN
        NEW.transaction_number := 'TRX-' || LPAD(nextval('trx_number_seq')::text, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_trx_number
BEFORE INSERT ON public.transactions
FOR EACH ROW EXECUTE FUNCTION set_transaction_number();
