-- PostgreSQL Migration: 20260801000005_active_views.sql
-- Description: Active Views Filtering Soft-Deleted Rows Automatically

CREATE OR REPLACE VIEW public.active_customers AS
SELECT * FROM public.customers WHERE deleted_at IS NULL;

CREATE OR REPLACE VIEW public.active_projects AS
SELECT * FROM public.projects WHERE deleted_at IS NULL;

CREATE OR REPLACE VIEW public.active_products AS
SELECT * FROM public.products WHERE deleted_at IS NULL;

CREATE OR REPLACE VIEW public.active_quotations AS
SELECT * FROM public.quotations WHERE deleted_at IS NULL;

-- Update RLS policies to automatically filter deleted_at IS NULL for normal queries
DROP POLICY IF EXISTS tenant_isolation_customers ON public.customers;
CREATE POLICY tenant_isolation_customers ON public.customers
    FOR ALL USING (company_id = public.auth_company_id() AND deleted_at IS NULL);

DROP POLICY IF EXISTS tenant_isolation_projects ON public.projects;
CREATE POLICY tenant_isolation_projects ON public.projects
    FOR ALL USING (company_id = public.auth_company_id() AND deleted_at IS NULL);

DROP POLICY IF EXISTS tenant_isolation_products ON public.products;
CREATE POLICY tenant_isolation_products ON public.products
    FOR ALL USING (company_id = public.auth_company_id() AND deleted_at IS NULL);

DROP POLICY IF EXISTS tenant_isolation_quotations ON public.quotations;
CREATE POLICY tenant_isolation_quotations ON public.quotations
    FOR ALL USING (company_id = public.auth_company_id() AND deleted_at IS NULL);
