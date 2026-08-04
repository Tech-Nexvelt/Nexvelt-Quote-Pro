-- PostgreSQL Migration: Atomic Onboarding & Database-Level Idempotency

-- 1. Ensure UNIQUE constraints exist for atomic upserts
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_user_id_key') THEN
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'company_settings_company_id_key') THEN
        ALTER TABLE public.company_settings ADD CONSTRAINT company_settings_company_id_key UNIQUE (company_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'subscriptions_company_id_key') THEN
        ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_company_id_key UNIQUE (company_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'usage_metrics_company_id_key') THEN
        ALTER TABLE public.usage_metrics ADD CONSTRAINT usage_metrics_company_id_key UNIQUE (company_id);
    END IF;
END $$;

-- 2. PostgreSQL Atomic Onboarding Function (RPC)
CREATE OR REPLACE FUNCTION public.complete_atomic_onboarding(
    p_user_id UUID,
    p_email TEXT,
    p_company_name TEXT,
    p_owner_name TEXT,
    p_phone TEXT DEFAULT NULL,
    p_business_type TEXT DEFAULT 'Interior & Furniture',
    p_address TEXT DEFAULT NULL,
    p_city TEXT DEFAULT NULL,
    p_gstin TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_company_id UUID;
    v_profile_id UUID;
    v_company RECORD;
    v_profile RECORD;
    v_slug TEXT;
BEGIN
    -- Check 1: Does profile already exist for this user?
    SELECT id, company_id INTO v_profile_id, v_company_id
    FROM public.profiles
    WHERE user_id = p_user_id;

    IF FOUND THEN
        SELECT * INTO v_company FROM public.companies WHERE id = v_company_id;
        SELECT * INTO v_profile FROM public.profiles WHERE id = v_profile_id;
        
        RETURN jsonb_build_object(
            'success', true,
            'is_existing', true,
            'company', to_jsonb(v_company),
            'profile', to_jsonb(v_profile)
        );
    END IF;

    -- Check 2: Does company with this email exist?
    SELECT id INTO v_company_id
    FROM public.companies
    WHERE email = p_email;

    IF NOT FOUND THEN
        v_slug := lower(regexp_replace(p_company_name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || floor(random() * 9000 + 1000)::text;
        
        INSERT INTO public.companies (
            company_name, workspace_slug, owner_name, email, phone, business_type, address, city, gst_number
        ) VALUES (
            p_company_name, v_slug, p_owner_name, p_email, p_phone, p_business_type, p_address, p_city, p_gstin
        )
        RETURNING id INTO v_company_id;
    END IF;

    -- Step 3: Insert Owner Profile with ON CONFLICT DO NOTHING
    INSERT INTO public.profiles (
        user_id, company_id, full_name, email, phone, role
    ) VALUES (
        p_user_id, v_company_id, p_owner_name, p_email, p_phone, 'Owner'
    )
    ON CONFLICT (user_id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        company_id = EXCLUDED.company_id
    RETURNING id INTO v_profile_id;

    -- Step 4: Atomic Settings, Subscription & Usage Metrics Upsert
    INSERT INTO public.company_settings (company_id) VALUES (v_company_id)
    ON CONFLICT (company_id) DO NOTHING;

    INSERT INTO public.subscriptions (company_id, status) VALUES (v_company_id, 'active')
    ON CONFLICT (company_id) DO NOTHING;

    INSERT INTO public.usage_metrics (company_id) VALUES (v_company_id)
    ON CONFLICT (company_id) DO NOTHING;

    -- Step 5: Audit Activity Trail Log
    INSERT INTO public.activities (
        company_id, user_id, action, entity_type, entity_id, details
    ) VALUES (
        v_company_id,
        p_user_id,
        'Onboarding Completed',
        'Company',
        v_company_id,
        jsonb_build_object('event', 'Onboarding Completed', 'email', p_email, 'owner_name', p_owner_name)
    );

    SELECT * INTO v_company FROM public.companies WHERE id = v_company_id;
    SELECT * INTO v_profile FROM public.profiles WHERE id = v_profile_id;

    RETURN jsonb_build_object(
        'success', true,
        'is_existing', false,
        'company', to_jsonb(v_company),
        'profile', to_jsonb(v_profile)
    );
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Atomic onboarding transaction failed: %', SQLERRM;
END;
$$;
