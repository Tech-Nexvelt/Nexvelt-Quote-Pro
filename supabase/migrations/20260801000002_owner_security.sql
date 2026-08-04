-- PostgreSQL Migration: 20260801000002_owner_security.sql
-- Description: Server-Side Owner PIN Security & bcrypt Hashing

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Create owner_security Table
CREATE TABLE IF NOT EXISTS public.owner_security (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID UNIQUE NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    hashed_pin TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE public.owner_security ENABLE ROW LEVEL SECURITY;

-- Policy: Only tenant users can query/modify their own company's owner_security record
CREATE POLICY tenant_isolation_owner_security ON public.owner_security
    FOR ALL USING (company_id = public.auth_company_id());

-- 2. RPC: Verify Owner PIN Server-side (bcrypt match)
CREATE OR REPLACE FUNCTION public.verify_owner_pin(p_company_id UUID, p_pin TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_user_company_id UUID;
    v_stored_hash TEXT;
BEGIN
    -- Security Guard: Caller must belong to company
    SELECT company_id INTO v_user_company_id FROM public.profiles WHERE user_id = auth.uid();
    IF v_user_company_id IS NULL OR v_user_company_id <> p_company_id THEN
        RETURN false;
    END IF;

    SELECT hashed_pin INTO v_stored_hash
    FROM public.owner_security
    WHERE company_id = p_company_id;

    -- Default fallback PIN: 1234 if not explicitly provisioned
    IF NOT FOUND OR v_stored_hash IS NULL THEN
        RETURN p_pin = '1234';
    END IF;

    -- Compare bcrypt hash using crypt()
    RETURN (v_stored_hash = crypt(p_pin, v_stored_hash));
END;
$$;

-- 3. RPC: Update Owner PIN Server-side
CREATE OR REPLACE FUNCTION public.update_owner_pin(p_company_id UUID, p_old_pin TEXT, p_new_pin TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_user_company_id UUID;
    v_profile_id UUID;
    v_is_valid BOOLEAN;
    v_new_hash TEXT;
BEGIN
    SELECT id, company_id INTO v_profile_id, v_user_company_id FROM public.profiles WHERE user_id = auth.uid();
    IF v_user_company_id IS NULL OR v_user_company_id <> p_company_id THEN
        RAISE EXCEPTION 'Unauthorized company access';
    END IF;

    -- Verify current old PIN first
    v_is_valid := public.verify_owner_pin(p_company_id, p_old_pin);
    IF NOT v_is_valid THEN
        RETURN jsonb_build_object('success', false, 'message', 'Incorrect current PIN');
    END IF;

    -- Hash new PIN using blowfish algorithm (bf)
    v_new_hash := crypt(p_new_pin, gen_salt('bf', 10));

    INSERT INTO public.owner_security (company_id, hashed_pin, updated_by)
    VALUES (p_company_id, v_new_hash, v_profile_id)
    ON CONFLICT (company_id) DO UPDATE SET
        hashed_pin = EXCLUDED.hashed_pin,
        updated_at = NOW(),
        updated_by = EXCLUDED.updated_by;

    RETURN jsonb_build_object('success', true, 'message', 'Owner PIN updated successfully');
END;
$$;
