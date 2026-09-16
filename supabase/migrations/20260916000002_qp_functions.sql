-- ============================================================================
-- MIGRATION 2/4: Isolate Quotation Pro into its own schema
-- PART B: move + rewrite all SECURITY DEFINER functions
-- ============================================================================
-- Run 20260916000001_qp_schema_tables_views.sql first.
--
-- Function bodies are stored as opaque source text and re-resolve
-- "public.table_name" text at every execution (unlike FKs/views/policies,
-- which are OID-bound and survive a schema move untouched). So every
-- function that references a moved table must be rewritten here.
--
-- Unlike ALTER TABLE/VIEW/SEQUENCE, ALTER FUNCTION has no IF EXISTS clause
-- in PostgreSQL — it is a hard syntax error, not a runner quirk. So these
-- are flat statements with no IF EXISTS, meaning this file must run exactly
-- once, immediately after 20260916000001, while the functions still live in
-- "public". (These are also not wrapped in a DO $$ loop — the dashboard SQL
-- runner being used here fails with "unterminated dollar-quoted string" on
-- DO $$ blocks containing large multi-line literals.)
--
-- VERIFIED AGAINST THE LIVE DATABASE (pg_proc), not just migration-file
-- history, which turned out to have drifted from what's actually applied:
-- only these 3 functions exist in "public" today. The other 7 functions
-- that earlier migration files (owner_security, audit_logging,
-- health_monitoring, license_management) would have created —
-- verify_and_repair_tenant_health, verify_owner_pin, update_owner_pin,
-- log_audit_event, check_system_health, provision_default_license,
-- activate_company_license — do not exist anywhere in this database (not in
-- public, not already moved to quotation_pro). This migration does not
-- create them; doing so would be adding functionality outside the scope of
-- a schema move. Note complete_atomic_onboarding's body below still calls
-- quotation_pro.verify_and_repair_tenant_health(...), which will fail at
-- runtime exactly as public.complete_atomic_onboarding already does today —
-- that pre-existing breakage is unrelated to this migration and is left
-- untouched.
-- ============================================================================

BEGIN;

ALTER FUNCTION public.auth_company_id() SET SCHEMA quotation_pro;
ALTER FUNCTION public.claim_outbox_events(text, integer) SET SCHEMA quotation_pro;
ALTER FUNCTION public.complete_atomic_onboarding(uuid, text, text, text, text, text, text, text, text) SET SCHEMA quotation_pro;

CREATE OR REPLACE FUNCTION quotation_pro.auth_company_id()
RETURNS UUID AS $$
  SELECT company_id FROM quotation_pro.profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = quotation_pro, pg_temp;

CREATE OR REPLACE FUNCTION quotation_pro.claim_outbox_events(p_worker_id TEXT, p_batch_size INT)
RETURNS SETOF quotation_pro.outbox_events AS $$
BEGIN
  RETURN QUERY
  UPDATE quotation_pro.outbox_events
  SET status = 'processing', locked_by = p_worker_id, locked_at = NOW()
  WHERE event_id IN (
    SELECT event_id FROM quotation_pro.outbox_events
    WHERE status = 'pending' OR (status = 'processing' AND locked_at < NOW() - INTERVAL '5 minutes')
    ORDER BY created_at ASC
    FOR UPDATE SKIP LOCKED
    LIMIT p_batch_size
  )
  RETURNING *;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = quotation_pro, pg_temp;

CREATE OR REPLACE FUNCTION quotation_pro.complete_atomic_onboarding(
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
SET search_path = quotation_pro, pg_temp
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
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Unauthorized: Unauthenticated user context';
    END IF;

    IF p_user_id <> auth.uid() THEN
        RAISE EXCEPTION 'Forbidden: RPC caller % cannot onboard user %', auth.uid(), p_user_id;
    END IF;

    v_lock_key := hashtext(p_user_id::text);
    PERFORM pg_advisory_xact_lock(v_lock_key);

    SELECT id, company_id INTO v_profile_id, v_company_id
    FROM quotation_pro.profiles
    WHERE user_id = p_user_id;

    IF FOUND THEN
        v_health := quotation_pro.verify_and_repair_tenant_health(v_company_id);

        SELECT * INTO v_company FROM quotation_pro.companies WHERE id = v_company_id;
        SELECT * INTO v_profile FROM quotation_pro.profiles WHERE id = v_profile_id;

        v_execution_time_ms := EXTRACT(EPOCH FROM (clock_timestamp() - v_start_ts)) * 1000;

        INSERT INTO quotation_pro.activities (
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

    SELECT id INTO v_company_id
    FROM quotation_pro.companies
    WHERE email = p_email;

    IF NOT FOUND THEN
        v_slug := lower(regexp_replace(p_company_name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || floor(random() * 9000 + 1000)::text;

        INSERT INTO quotation_pro.companies (
            company_name, workspace_slug, owner_name, email, phone, business_type, address, city, gst_number, onboarding_version
        ) VALUES (
            p_company_name, v_slug, p_owner_name, p_email, p_phone, p_business_type, p_address, p_city, p_gstin, 1
        )
        RETURNING id INTO v_company_id;

        INSERT INTO quotation_pro.activities (
            company_id, user_id, action, entity_type, entity_id, details
        ) VALUES (
            v_company_id, p_user_id, 'Company Created', 'Company', v_company_id,
            jsonb_build_object('company_name', p_company_name, 'email', p_email)
        );
    END IF;

    INSERT INTO quotation_pro.profiles (
        user_id, company_id, full_name, email, phone, role
    ) VALUES (
        p_user_id, v_company_id, p_owner_name, p_email, p_phone, 'Owner'
    )
    ON CONFLICT (user_id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        company_id = EXCLUDED.company_id
    RETURNING id INTO v_profile_id;

    v_health := quotation_pro.verify_and_repair_tenant_health(v_company_id);

    v_execution_time_ms := EXTRACT(EPOCH FROM (clock_timestamp() - v_start_ts)) * 1000;

    INSERT INTO quotation_pro.activities (
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

    SELECT * INTO v_company FROM quotation_pro.companies WHERE id = v_company_id;
    SELECT * INTO v_profile FROM quotation_pro.profiles WHERE id = v_profile_id;

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

COMMIT;

-- Sanity check after running this file:
-- SELECT count(*) FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'quotation_pro';
-- Expect 3.

-- ============================================================================
-- NOT MOVED (do not exist in "public" in this database — see header note):
-- verify_and_repair_tenant_health, verify_owner_pin, update_owner_pin,
-- log_audit_event, check_system_health, provision_default_license,
-- activate_company_license.
-- ============================================================================

