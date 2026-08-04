-- PostgreSQL Migration: 20260802000001_enterprise_architecture_simplification.sql
-- Description: Complete Removal of Subscriptions & Licensing Concepts
-- Simplifies architecture into a clean B2B Enterprise System with Modular Feature Flags.

-- 1. Drop Legacy Subscription & License Tables if present
DROP TABLE IF EXISTS public.licenses CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.plans CASCADE;

-- 2. Clean Up companies Table Columns
ALTER TABLE public.companies
DROP COLUMN IF EXISTS subscription_plan,
DROP COLUMN IF EXISTS subscription_status,
DROP COLUMN IF EXISTS trial_end_date;

-- 3. Standardize Feature Flags Table for Pure Modular Application Controls
CREATE TABLE IF NOT EXISTS public.feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_enabled_default BOOLEAN DEFAULT true
);

-- Seed Enterprise Feature Modules
INSERT INTO public.feature_flags (key, name, description, is_enabled_default) VALUES
    ('quotation_builder', 'Quotation Builder Engine', 'Core quotation creation and interactive builder', true),
    ('inventory', 'Inventory & Materials Management', 'Material catalog, inventory stock, and vendor tracking', true),
    ('crm', 'Customer Management (CRM)', 'Customer profiles, lead tracking, and contact management', true),
    ('reports', 'Analytics & Financial Reporting', 'Sales reports, margin analysis, and profit metrics', true),
    ('analytics', 'Business Intelligence Dashboard', 'Dashboard KPIs, quotation velocity, and performance charts', true),
    ('ai_assistant', 'AI Quotation Assistant', 'AI-assisted product specification and cost estimation', true),
    ('production', 'Production & Workshop Execution', 'Job sheets, cutting lists, and workshop execution', true),
    ('purchasing', 'BOM & Purchase List Engine', 'Purchase orders and Bill of Materials breakdown', true),
    ('notifications', 'Notification & Alert Center', 'Email and internal notification alerts', true)
ON CONFLICT (key) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description;

-- 4. Standardize company_features Table
CREATE TABLE IF NOT EXISTS public.company_features (
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    feature_id UUID REFERENCES public.feature_flags(id) ON DELETE CASCADE,
    is_enabled BOOLEAN DEFAULT true,
    PRIMARY KEY (company_id, feature_id)
);

-- Enable RLS
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_features ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS authenticated_read_feature_flags ON public.feature_flags;
CREATE POLICY authenticated_read_feature_flags ON public.feature_flags
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS tenant_isolation_company_features ON public.company_features;
CREATE POLICY tenant_isolation_company_features ON public.company_features
    FOR ALL USING (company_id = public.auth_company_id());

-- 5. Updated verify_and_repair_tenant_health Function (Without Subscriptions or Licenses)
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

    -- Enable Default Feature Flags for Company
    INSERT INTO public.company_features (company_id, feature_id, is_enabled)
    SELECT p_company_id, id, true FROM public.feature_flags
    ON CONFLICT (company_id, feature_id) DO NOTHING;

    RETURN jsonb_build_object(
        'company_id', p_company_id,
        'healthy', true,
        'repaired', NOT (v_has_settings AND v_has_metrics)
    );
END;
$$;
