-- ============================================================================
-- MIGRATION 4/4: Isolate Quotation Pro into its own schema
-- PART D: grants for the new schema
-- ============================================================================
-- Run 20260916000001/2/3 first.
--
-- Per-table/function grants already on these objects travel with them
-- automatically across a schema move (ACLs are attached to the object, not
-- the schema). What a BRAND NEW schema does NOT have by default is USAGE,
-- and default privileges for objects added to it in future. This file adds
-- both, mirroring what Supabase's own bootstrap grants on "public".
-- ============================================================================

BEGIN;

GRANT USAGE ON SCHEMA quotation_pro TO anon, authenticated, service_role;

GRANT ALL ON ALL TABLES IN SCHEMA quotation_pro TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA quotation_pro TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA quotation_pro TO anon;

GRANT ALL ON ALL SEQUENCES IN SCHEMA quotation_pro TO service_role, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA quotation_pro TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA quotation_pro
    GRANT ALL ON TABLES TO service_role, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA quotation_pro
    GRANT SELECT ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA quotation_pro
    GRANT EXECUTE ON FUNCTIONS TO anon, authenticated, service_role;

COMMIT;

-- ============================================================================
-- REQUIRED MANUAL STEP (cannot be scripted via SQL on hosted Supabase):
-- Dashboard -> Project Settings -> API -> "Exposed schemas" -> add
-- "quotation_pro" to the comma-separated list (alongside "public").
-- Without this, PostgREST will 404 every .from()/.rpc() call even though
-- the schema, grants, and RLS above are all correct.
--
-- Self-hosted / Docker Supabase equivalent (run separately, only if you
-- manage PostgREST yourself):
--   ALTER ROLE authenticator SET pgrst.db_schemas = 'public, quotation_pro';
--   NOTIFY pgrst, 'reload config';
-- ============================================================================
