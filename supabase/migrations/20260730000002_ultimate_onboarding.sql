-- PostgreSQL Migration: Ultimate Enterprise Onboarding Hardening

-- 1. Add onboarding_version column to companies table
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS onboarding_version INTEGER DEFAULT 1;

-- 2. PostgreSQL Health Verification & Auto-Repair Function
CREATE OR REPLACE FUNCTION public.verify_and_repair_tenant_health(p_company_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_has_settings BOOLEAN;
    v_has_subscription BOOLEAN;
    v_has_metrics BOOLEAN;
BEGIN
    -- Check & Repair Settings
    SELECT EXISTS (SELECT 1 FROM public.company_settings WHERE company_id = p_company_id) INTO v_has_settings;
    IF NOT v_has_settings THEN
        INSERT INTO public.company_settings (company_id) VALUES (p_company_id)
        ON CONFLICT (company_id) DO NOTHING;
    END IF;

    -- Check & Repair Subscription
    SELECT EXISTS (SELECT 1 FROM public.subscriptions WHERE company_id = p_company_id) INTO v_has_subscription;
    IF NOT v_has_subscription THEN
        INSERT INTO public.subscriptions (company_id, status) VALUES (p_company_id, 'active')
        ON CONFLICT (company_id) DO NOTHING;
    END IF;

    -- Check & Repair Usage Metrics
    SELECT EXISTS (SELECT 1 FROM public.usage_metrics WHERE company_id = p_company_id) INTO v_has_metrics;
    IF NOT v_has_metrics THEN
        INSERT INTO public.usage_metrics (company_id, active_users) VALUES (p_company_id, 1)
        ON CONFLICT (company_id) DO NOTHING;
    END IF;

    RETURN jsonb_build_object(
        'company_id', p_company_id,
        'healthy', true,
        'repaired', NOT (v_has_settings AND v_has_subscription AND v_has_metrics)
    );
END;
$$;

-- 3. Hardened PostgreSQL Atomic Onboarding Function with Advisory Locking & Backend Audit Logging
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
    v_lock_key BIGINT;
    v_health JSONB;
    v_start_ts TIMESTAMP := clock_timestamp();
    v_execution_time_ms NUMERIC;
BEGIN
    -- STEP 1: Database-Level Transactional Advisory Lock
    -- Generates a 64-bit integer lock key based on user_id string hash
    v_lock_key := hashtext(p_user_id::text);
    PERFORM pg_advisory_xact_lock(v_lock_key);

    -- STEP 2: Check if profile & company already exist (Resumption & Idempotency)
    SELECT id, company_id INTO v_profile_id, v_company_id
    FROM public.profiles
    WHERE user_id = p_user_id;

    IF FOUND THEN
        -- Run Health Check & Auto-Repair before returning
        v_health := public.verify_and_repair_tenant_health(v_company_id);

        SELECT * INTO v_company FROM public.companies WHERE id = v_company_id;
        SELECT * INTO v_profile FROM public.profiles WHERE id = v_profile_id;
        
        v_execution_time_ms := EXTRACT(EPOCH FROM (clock_timestamp() - v_start_ts)) * 1000;

        -- Backend Audit Log
        INSERT INTO public.activities (
            company_id, user_id, action, entity_type, entity_id, details
        ) VALUES (
            v_company_id,
            p_user_id,
            'Onboarding Resumed & Verified',
            'Company',
            v_company_id,
            jsonb_build_object(
                'event', 'Onboarding Resumed',
                'email', p_email,
                'health', v_health,
                'execution_time_ms', v_execution_time_ms
            )
        );

        RETURN jsonb_build_object(
            'success', true,
            'is_existing', true,
            'company', to_jsonb(v_company),
            'profile', to_jsonb(v_profile),
            'health', v_health,
            'execution_time_ms', v_execution_time_ms
        );
    END IF;

    -- STEP 3: Company Resolution / Insertion
    SELECT id INTO v_company_id
    FROM public.companies
    WHERE email = p_email;

    IF NOT FOUND THEN
        v_slug := lower(regexp_replace(p_company_name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || floor(random() * 9000 + 1000)::text;
        
        INSERT INTO public.companies (
            company_name, workspace_slug, owner_name, email, phone, business_type, address, city, gst_number, onboarding_version
        ) VALUES (
            p_company_name, v_slug, p_owner_name, p_email, p_phone, p_business_type, p_address, p_city, p_gstin, 1
        )
        RETURNING id INTO v_company_id;

        -- Backend Audit Log for Company Creation
        INSERT INTO public.activities (
            company_id, user_id, action, entity_type, entity_id, details
        ) VALUES (
            v_company_id, p_user_id, 'Company Created', 'Company', v_company_id,
            jsonb_build_object('company_name', p_company_name, 'email', p_email)
        );
    END IF;

    -- STEP 4: Profile Upsert
    INSERT INTO public.profiles (
        user_id, company_id, full_name, email, phone, role
    ) VALUES (
        p_user_id, v_company_id, p_owner_name, p_email, p_phone, 'Owner'
    )
    ON CONFLICT (user_id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        company_id = EXCLUDED.company_id
    RETURNING id INTO v_profile_id;

    -- Backend Audit Log for Profile Creation
    INSERT INTO public.activities (
        company_id, user_id, action, entity_type, entity_id, details
    ) VALUES (
        v_company_id, p_user_id, 'Profile Created', 'Profile', v_profile_id,
        jsonb_build_object('owner_name', p_owner_name, 'role', 'Owner')
    );

    -- STEP 5: Health Check & Auxiliary Record Auto-Repair
    v_health := public.verify_and_repair_tenant_health(v_company_id);

    -- STEP 6: Final Backend Audit Trail Event
    v_execution_time_ms := EXTRACT(EPOCH FROM (clock_timestamp() - v_start_ts)) * 1000;

    INSERT INTO public.activities (
        company_id, user_id, action, entity_type, entity_id, details
    ) VALUES (
        v_company_id,
        p_user_id,
        'Onboarding Completed',
        'Company',
        v_company_id,
        jsonb_build_object(
            'event', 'Onboarding Completed',
            'email', p_email,
            'owner_name', p_owner_name,
            'onboarding_version', 1,
            'health', v_health,
            'execution_time_ms', v_execution_time_ms
        )
    );

    SELECT * INTO v_company FROM public.companies WHERE id = v_company_id;
    SELECT * INTO v_profile FROM public.profiles WHERE id = v_profile_id;

    RETURN jsonb_build_object(
        'success', true,
        'is_existing', false,
        'company', to_jsonb(v_company),
        'profile', to_jsonb(v_profile),
        'health', v_health,
        'execution_time_ms', v_execution_time_ms
    );
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Atomic onboarding transaction failed: %', SQLERRM;
END;
$$;
