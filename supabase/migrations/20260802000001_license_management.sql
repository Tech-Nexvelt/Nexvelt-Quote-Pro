-- PostgreSQL Migration: 20260802000001_license_management.sql
-- Description: Enterprise License Management Platform Schema & RPC Engine
-- Replaces subscription architecture with direct B2B License Management.

-- 1. Create Core licenses Table
CREATE TABLE IF NOT EXISTS public.licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID UNIQUE NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    license_key TEXT UNIQUE NOT NULL,
    license_name TEXT NOT NULL DEFAULT 'Enterprise Commercial License',
    license_type VARCHAR(50) NOT NULL DEFAULT 'Enterprise', -- Lifetime, Annual, Enterprise, Trial, Custom
    status VARCHAR(50) NOT NULL DEFAULT 'Active', -- Inactive, Pending, Active, Expired, Suspended, Revoked
    issued_by VARCHAR(255) DEFAULT 'Nexvelt Platform Admin',
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    activated_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ, -- NULLABLE for Lifetime
    support_until TIMESTAMPTZ, -- NULLABLE
    max_users INTEGER DEFAULT 10 CHECK (max_users > 0),
    max_branches INTEGER DEFAULT 1 CHECK (max_branches > 0),
    max_projects INTEGER DEFAULT 1000 CHECK (max_projects > 0),
    max_storage_mb INTEGER DEFAULT 5000 CHECK (max_storage_mb > 0),
    allowed_features JSONB DEFAULT '{
        "quotation_builder": true,
        "inventory": true,
        "crm": true,
        "reports": true,
        "analytics": true,
        "ai_assistant": true,
        "api_access": true,
        "exports": true,
        "templates": true,
        "branch_management": true
    }'::jsonb,
    software_version VARCHAR(50) DEFAULT '1.0.0',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_licenses_company_status ON public.licenses(company_id, status);
CREATE INDEX IF NOT EXISTS idx_licenses_key ON public.licenses(license_key);

-- 3. Row-Level Security Policies
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_licenses ON public.licenses
    FOR ALL USING (company_id = public.auth_company_id());

-- 4. Helper Function: Auto-provision Default Enterprise License for New Companies
CREATE OR REPLACE FUNCTION public.provision_default_license(p_company_id UUID, p_license_type TEXT DEFAULT 'Enterprise')
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_license_id UUID;
    v_key TEXT;
    v_expires TIMESTAMPTZ;
BEGIN
    v_key := 'NEX-LIC-' || UPPER(substring(md5(random()::text || clock_timestamp()::text) from 1 for 16));

    IF p_license_type = 'Lifetime' THEN
        v_expires := NULL;
    ELSIF p_license_type = 'Trial' THEN
        v_expires := NOW() + INTERVAL '30 days';
    ELSE
        v_expires := NOW() + INTERVAL '1 year';
    END IF;

    INSERT INTO public.licenses (
        company_id, license_key, license_name, license_type, status, expires_at, support_until
    ) VALUES (
        p_company_id, v_key, 'Nexvelt ' || p_license_type || ' Commercial License', p_license_type, 'Active', v_expires, v_expires
    )
    ON CONFLICT (company_id) DO NOTHING
    RETURNING id INTO v_license_id;

    RETURN v_license_id;
END;
$$;

-- 5. Hardened RPC: Activate License Key
CREATE OR REPLACE FUNCTION public.activate_company_license(
    p_company_id UUID,
    p_license_key TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_user_company_id UUID;
    v_user_role TEXT;
    v_license RECORD;
BEGIN
    SELECT company_id, role INTO v_user_company_id, v_user_role
    FROM public.profiles
    WHERE user_id = auth.uid();

    IF v_user_company_id IS NULL OR v_user_company_id <> p_company_id THEN
        RAISE EXCEPTION 'Forbidden: Cannot update license for company %', p_company_id;
    END IF;

    IF v_user_role <> 'Owner' AND v_user_role <> 'Super Admin' THEN
        RAISE EXCEPTION 'Forbidden: Only Owner or Super Admin can activate license keys';
    END IF;

    UPDATE public.licenses
    SET status = 'Active',
        activated_at = NOW(),
        updated_at = NOW()
    WHERE company_id = p_company_id AND license_key = p_license_key
    RETURNING * INTO v_license;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Invalid license key or company mismatch');
    END IF;

    -- Audit Trail Log
    INSERT INTO public.activities (
        company_id, user_id, action, entity_type, entity_id, details
    ) VALUES (
        p_company_id, auth.uid(), 'License Activated', 'License', v_license.id,
        jsonb_build_object('license_key', p_license_key, 'license_type', v_license.license_type)
    );

    RETURN jsonb_build_object('success', true, 'license', to_jsonb(v_license));
END;
$$;

-- Update verify_and_repair_tenant_health to ensure license auto-repair
CREATE OR REPLACE FUNCTION public.verify_and_repair_tenant_health(p_company_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_user_company_id UUID;
    v_has_settings BOOLEAN;
    v_has_metrics BOOLEAN;
    v_has_license BOOLEAN;
BEGIN
    SELECT company_id INTO v_user_company_id FROM public.profiles WHERE user_id = auth.uid();
    IF v_user_company_id IS NOT NULL AND v_user_company_id <> p_company_id THEN
        RAISE EXCEPTION 'Forbidden: Cannot access tenant health for company %', p_company_id;
    END IF;

    -- Repair Settings
    SELECT EXISTS (SELECT 1 FROM public.company_settings WHERE company_id = p_company_id) INTO v_has_settings;
    IF NOT v_has_settings THEN
        INSERT INTO public.company_settings (company_id) VALUES (p_company_id) ON CONFLICT (company_id) DO NOTHING;
    END IF;

    -- Repair Usage Metrics
    SELECT EXISTS (SELECT 1 FROM public.usage_metrics WHERE company_id = p_company_id) INTO v_has_metrics;
    IF NOT v_has_metrics THEN
        INSERT INTO public.usage_metrics (company_id, active_users) VALUES (p_company_id, 1) ON CONFLICT (company_id) DO NOTHING;
    END IF;

    -- Repair License
    SELECT EXISTS (SELECT 1 FROM public.licenses WHERE company_id = p_company_id) INTO v_has_license;
    IF NOT v_has_license THEN
        PERFORM public.provision_default_license(p_company_id, 'Enterprise');
    END IF;

    RETURN jsonb_build_object(
        'company_id', p_company_id,
        'healthy', true,
        'repaired', NOT (v_has_settings AND v_has_metrics AND v_has_license)
    );
END;
$$;
