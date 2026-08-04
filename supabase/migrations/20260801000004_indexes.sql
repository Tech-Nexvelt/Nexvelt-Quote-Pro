-- PostgreSQL Migration: 20260801000004_indexes.sql
-- Description: Composite Indexes for High-Frequency Tenant Queries

CREATE INDEX IF NOT EXISTS idx_customers_company_created ON public.customers(company_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_company_created ON public.projects(company_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotations_company_created ON public.quotations(company_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotation_items_quotation_company ON public.quotation_items(quotation_id, company_id);
CREATE INDEX IF NOT EXISTS idx_activities_company_created ON public.activities(company_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_company_user ON public.notifications(company_id, user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_customers_company_deleted ON public.customers(company_id, deleted_at);
CREATE INDEX IF NOT EXISTS idx_projects_company_deleted ON public.projects(company_id, deleted_at);
CREATE INDEX IF NOT EXISTS idx_quotations_company_deleted ON public.quotations(company_id, deleted_at);
