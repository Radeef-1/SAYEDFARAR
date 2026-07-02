-- Supabase Database Setup Script
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
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    transaction_number TEXT UNIQUE,
    type TEXT NOT NULL CHECK (type IN ('topup', 'withdrawal')),
    platform_id UUID REFERENCES public.platforms(id) ON DELETE SET NULL,
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'Completed' CHECK (status IN ('Completed', 'Pending', 'Cancelled')),
    notes TEXT,
    created_by TEXT, -- Email/Name of creator
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. User Settings Table
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    low_balance_warning NUMERIC(15, 2) NOT NULL DEFAULT 500.00,
    critical_balance NUMERIC(15, 2) NOT NULL DEFAULT 100.00,
    currency TEXT NOT NULL DEFAULT 'SAR',
    default_language TEXT NOT NULL DEFAULT 'ar' CHECK (default_language IN ('ar', 'en')),
    theme TEXT NOT NULL DEFAULT 'dark' CHECK (theme IN ('light', 'dark')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Activity Logs (Audit Trail)
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    transaction_id UUID, -- NULL if transaction was deleted
    action TEXT NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE')),
    details TEXT NOT NULL, -- JSON-like string showing changes
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies
-- Platforms: Read is public or authenticated; modifications restricted
DROP POLICY IF EXISTS "Allow read access to platforms" ON public.platforms;
CREATE POLICY "Allow read access to platforms" ON public.platforms FOR SELECT USING (true);

-- Transactions Policies
DROP POLICY IF EXISTS "Users can manage their own transactions" ON public.transactions;
CREATE POLICY "Users can manage their own transactions" ON public.transactions
    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Settings Policies
DROP POLICY IF EXISTS "Users can manage their own settings" ON public.settings;
CREATE POLICY "Users can manage their own settings" ON public.settings
    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Activity Logs Policies
DROP POLICY IF EXISTS "Users can view their own activity logs" ON public.activity_logs;
CREATE POLICY "Users can view their own activity logs" ON public.activity_logs
    USING (auth.uid() = user_id);

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

DROP TRIGGER IF EXISTS trigger_set_trx_number ON public.transactions;
CREATE TRIGGER trigger_set_trx_number
BEFORE INSERT ON public.transactions
FOR EACH ROW EXECUTE FUNCTION set_transaction_number();
