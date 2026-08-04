-- PostgreSQL Migration: 20260801000003_rls_completion.sql
-- Description: Complete Row Level Security (RLS) Policies Across All Tables

-- 1. Enable RLS on auxiliary tables
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_features ENABLE ROW LEVEL SECURITY;

-- 2. Tenant Isolation RLS Policies
CREATE POLICY tenant_isolation_roles ON public.roles
    FOR ALL USING (company_id = public.auth_company_id());

CREATE POLICY tenant_isolation_categories ON public.categories
    FOR ALL USING (company_id = public.auth_company_id());

CREATE POLICY tenant_isolation_materials ON public.materials
    FOR ALL USING (company_id = public.auth_company_id());

CREATE POLICY tenant_isolation_inventory ON public.inventory
    FOR ALL USING (company_id = public.auth_company_id());

CREATE POLICY tenant_isolation_vendors ON public.vendors
    FOR ALL USING (company_id = public.auth_company_id());

CREATE POLICY tenant_isolation_warehouses ON public.warehouses
    FOR ALL USING (company_id = public.auth_company_id());

CREATE POLICY tenant_isolation_ai_settings ON public.ai_settings
    FOR ALL USING (company_id = public.auth_company_id());

CREATE POLICY tenant_isolation_ai_usage ON public.ai_usage
    FOR ALL USING (company_id = public.auth_company_id());

CREATE POLICY tenant_isolation_company_features ON public.company_features
    FOR ALL USING (company_id = public.auth_company_id());

-- 3. Global System Lookup Table Policies (Read-only for authenticated users)
CREATE POLICY authenticated_read_permissions ON public.permissions
    FOR SELECT TO authenticated USING (true);

CREATE POLICY authenticated_read_feature_flags ON public.feature_flags
    FOR SELECT TO authenticated USING (true);
