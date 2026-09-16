-- ============================================================================
-- MIGRATION 1/4: Isolate Quotation Pro into its own schema
-- PART A: schema, sequence, tables, views
-- ============================================================================
-- Rewritten as flat, explicit statements (no DO $$ loop over an ARRAY[]).
-- The dashboard SQL runner being used here fails with "unterminated
-- dollar-quoted string" specifically on a DO $$ block containing a large
-- multi-line ARRAY[...] literal, even in a small file, so that pattern is
-- avoided entirely. ALTER TABLE/VIEW/SEQUENCE all support IF EXISTS
-- natively, so this is just as idempotent as the loop version was, with no
-- dollar-quoting at all in this file.
--
-- PREFERRED: run via `supabase db push` instead of pasting into a dashboard
-- SQL editor.
-- ============================================================================

BEGIN;

CREATE SCHEMA IF NOT EXISTS quotation_pro;

-- Sequence used by companies.company_code DEFAULT (defaults reference
-- sequences by OID, not by name, so this keeps working after the move).
ALTER SEQUENCE IF EXISTS public.company_code_seq SET SCHEMA quotation_pro;

-- Move all application tables.
ALTER TABLE IF EXISTS public.companies SET SCHEMA quotation_pro;
ALTER TABLE IF EXISTS public.company_settings SET SCHEMA quotation_pro;
ALTER TABLE IF EXISTS public.profiles SET SCHEMA quotation_pro;
ALTER TABLE IF EXISTS public.staff_invitations SET SCHEMA quotation_pro;
ALTER TABLE IF EXISTS public.roles SET SCHEMA quotation_pro;
ALTER TABLE IF EXISTS public.permissions SET SCHEMA quotation_pro;
ALTER TABLE IF EXISTS public.role_permissions SET SCHEMA quotation_pro;
ALTER TABLE IF EXISTS public.user_permissions SET SCHEMA quotation_pro;
ALTER TABLE IF EXISTS public.feature_flags SET SCHEMA quotation_pro;
ALTER TABLE IF EXISTS public.company_features SET SCHEMA quotation_pro;
ALTER TABLE IF EXISTS public.customers SET SCHEMA quotation_pro;
ALTER TABLE IF EXISTS public.projects SET SCHEMA quotation_pro;
ALTER TABLE IF EXISTS public.categories SET SCHEMA quotation_pro;
ALTER TABLE IF EXISTS public.materials SET SCHEMA quotation_pro;
ALTER TABLE IF EXISTS public.products SET SCHEMA quotation_pro;
ALTER TABLE IF EXISTS public.quotations SET SCHEMA quotation_pro;
ALTER TABLE IF EXISTS public.quotation_items SET SCHEMA quotation_pro;
ALTER TABLE IF EXISTS public.quotation_categories SET SCHEMA quotation_pro;
ALTER TABLE IF EXISTS public.quotation_item_types SET SCHEMA quotation_pro;
ALTER TABLE IF EXISTS public.quotation_spaces SET SCHEMA quotation_pro;
ALTER TABLE IF EXISTS public.documents SET SCHEMA quotation_pro;
ALTER TABLE IF EXISTS public.outbox_events SET SCHEMA quotation_pro;
ALTER TABLE IF EXISTS public.dead_letter_events SET SCHEMA quotation_pro;
ALTER TABLE IF EXISTS public.worker_metrics SET SCHEMA quotation_pro;
ALTER TABLE IF EXISTS public.notifications SET SCHEMA quotation_pro;
ALTER TABLE IF EXISTS public.activities SET SCHEMA quotation_pro;
ALTER TABLE IF EXISTS public.audit_logs SET SCHEMA quotation_pro;
ALTER TABLE IF EXISTS public.usage_metrics SET SCHEMA quotation_pro;
ALTER TABLE IF EXISTS public.ai_settings SET SCHEMA quotation_pro;
ALTER TABLE IF EXISTS public.ai_usage SET SCHEMA quotation_pro;
ALTER TABLE IF EXISTS public.vendors SET SCHEMA quotation_pro;
ALTER TABLE IF EXISTS public.warehouses SET SCHEMA quotation_pro;
ALTER TABLE IF EXISTS public.inventory SET SCHEMA quotation_pro;
ALTER TABLE IF EXISTS public.owner_security SET SCHEMA quotation_pro;
ALTER TABLE IF EXISTS public.licenses SET SCHEMA quotation_pro;

-- Move the active-row views alongside their base tables.
ALTER VIEW IF EXISTS public.active_customers SET SCHEMA quotation_pro;
ALTER VIEW IF EXISTS public.active_projects SET SCHEMA quotation_pro;
ALTER VIEW IF EXISTS public.active_products SET SCHEMA quotation_pro;
ALTER VIEW IF EXISTS public.active_quotations SET SCHEMA quotation_pro;

COMMIT;

-- Sanity check after running this file:
-- SELECT count(*) FROM information_schema.tables WHERE table_schema = 'quotation_pro';
-- Expect 35.
