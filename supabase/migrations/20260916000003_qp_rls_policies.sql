-- ============================================================================
-- MIGRATION 3/4: Isolate Quotation Pro into its own schema
-- PART C: RLS policies (table + storage)
-- ============================================================================
-- Run 20260916000001 and 20260916000002 first.
--
-- NOTE: functionally, these policies already keep working post-move —
-- Postgres resolves the auth_company_id() call by OID, not by schema text —
-- but they are re-declared here 1:1 so pg_dump / \d+ output reads cleanly
-- against quotation_pro instead of a stale "public" reference.
--
-- VERIFIED AGAINST THE LIVE DATABASE (information_schema.tables): of the 35
-- objects migration 1 listed, "owner_security" and "licenses" don't exist in
-- this database (same drift as the missing functions in migration 2 — their
-- source migrations were apparently never applied here). Policies for those
-- two tables are omitted below; DROP POLICY's IF EXISTS only covers the
-- policy name, not the target relation, so leaving them in errors out with
-- "relation does not exist" same as CREATE POLICY would.
-- ============================================================================

BEGIN;

-- companies / company_settings / profiles
DROP POLICY IF EXISTS tenant_isolation_companies ON quotation_pro.companies;
CREATE POLICY tenant_isolation_companies ON quotation_pro.companies
    FOR ALL USING (id = quotation_pro.auth_company_id());

DROP POLICY IF EXISTS tenant_isolation_settings ON quotation_pro.company_settings;
CREATE POLICY tenant_isolation_settings ON quotation_pro.company_settings
    FOR ALL USING (company_id = quotation_pro.auth_company_id());

DROP POLICY IF EXISTS tenant_isolation_profiles ON quotation_pro.profiles;
CREATE POLICY tenant_isolation_profiles ON quotation_pro.profiles
    FOR ALL USING (company_id = quotation_pro.auth_company_id());

-- customers / projects / products / quotations (soft-delete filtered)
DROP POLICY IF EXISTS tenant_isolation_customers ON quotation_pro.customers;
CREATE POLICY tenant_isolation_customers ON quotation_pro.customers
    FOR ALL USING (company_id = quotation_pro.auth_company_id() AND deleted_at IS NULL);

DROP POLICY IF EXISTS tenant_isolation_projects ON quotation_pro.projects;
CREATE POLICY tenant_isolation_projects ON quotation_pro.projects
    FOR ALL USING (company_id = quotation_pro.auth_company_id() AND deleted_at IS NULL);

DROP POLICY IF EXISTS tenant_isolation_products ON quotation_pro.products;
CREATE POLICY tenant_isolation_products ON quotation_pro.products
    FOR ALL USING (company_id = quotation_pro.auth_company_id() AND deleted_at IS NULL);

DROP POLICY IF EXISTS tenant_isolation_quotations ON quotation_pro.quotations;
CREATE POLICY tenant_isolation_quotations ON quotation_pro.quotations
    FOR ALL USING (company_id = quotation_pro.auth_company_id() AND deleted_at IS NULL);

DROP POLICY IF EXISTS tenant_isolation_quotation_items ON quotation_pro.quotation_items;
CREATE POLICY tenant_isolation_quotation_items ON quotation_pro.quotation_items
    FOR ALL USING (company_id = quotation_pro.auth_company_id());

-- notifications / activities / outbox
DROP POLICY IF EXISTS tenant_isolation_notifications ON quotation_pro.notifications;
CREATE POLICY tenant_isolation_notifications ON quotation_pro.notifications
    FOR ALL USING (company_id = quotation_pro.auth_company_id());

DROP POLICY IF EXISTS tenant_isolation_activities ON quotation_pro.activities;
CREATE POLICY tenant_isolation_activities ON quotation_pro.activities
    FOR ALL USING (company_id = quotation_pro.auth_company_id());

DROP POLICY IF EXISTS tenant_isolation_outbox ON quotation_pro.outbox_events;
CREATE POLICY tenant_isolation_outbox ON quotation_pro.outbox_events
    FOR ALL USING (company_id = quotation_pro.auth_company_id());

-- roles / categories / materials / inventory / vendors / warehouses / ai_* / company_features
DROP POLICY IF EXISTS tenant_isolation_roles ON quotation_pro.roles;
CREATE POLICY tenant_isolation_roles ON quotation_pro.roles
    FOR ALL USING (company_id = quotation_pro.auth_company_id());

DROP POLICY IF EXISTS tenant_isolation_categories ON quotation_pro.categories;
CREATE POLICY tenant_isolation_categories ON quotation_pro.categories
    FOR ALL USING (company_id = quotation_pro.auth_company_id());

DROP POLICY IF EXISTS tenant_isolation_materials ON quotation_pro.materials;
CREATE POLICY tenant_isolation_materials ON quotation_pro.materials
    FOR ALL USING (company_id = quotation_pro.auth_company_id());

DROP POLICY IF EXISTS tenant_isolation_inventory ON quotation_pro.inventory;
CREATE POLICY tenant_isolation_inventory ON quotation_pro.inventory
    FOR ALL USING (company_id = quotation_pro.auth_company_id());

DROP POLICY IF EXISTS tenant_isolation_vendors ON quotation_pro.vendors;
CREATE POLICY tenant_isolation_vendors ON quotation_pro.vendors
    FOR ALL USING (company_id = quotation_pro.auth_company_id());

DROP POLICY IF EXISTS tenant_isolation_warehouses ON quotation_pro.warehouses;
CREATE POLICY tenant_isolation_warehouses ON quotation_pro.warehouses
    FOR ALL USING (company_id = quotation_pro.auth_company_id());

DROP POLICY IF EXISTS tenant_isolation_ai_settings ON quotation_pro.ai_settings;
CREATE POLICY tenant_isolation_ai_settings ON quotation_pro.ai_settings
    FOR ALL USING (company_id = quotation_pro.auth_company_id());

DROP POLICY IF EXISTS tenant_isolation_ai_usage ON quotation_pro.ai_usage;
CREATE POLICY tenant_isolation_ai_usage ON quotation_pro.ai_usage
    FOR ALL USING (company_id = quotation_pro.auth_company_id());

DROP POLICY IF EXISTS tenant_isolation_company_features ON quotation_pro.company_features;
CREATE POLICY tenant_isolation_company_features ON quotation_pro.company_features
    FOR ALL USING (company_id = quotation_pro.auth_company_id());

-- global read-only lookup tables
DROP POLICY IF EXISTS authenticated_read_permissions ON quotation_pro.permissions;
CREATE POLICY authenticated_read_permissions ON quotation_pro.permissions
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS authenticated_read_feature_flags ON quotation_pro.feature_flags;
CREATE POLICY authenticated_read_feature_flags ON quotation_pro.feature_flags
    FOR SELECT TO authenticated USING (true);

-- PRE-EXISTING ISSUES (preserved as-is, out of scope for this migration —
-- see chat for details): quotation_categories / quotation_item_types compare
-- company_id to auth.uid() (should be quotation_pro.auth_company_id()), and
-- quotation_spaces has no tenant scoping at all.
DROP POLICY IF EXISTS "Tenant isolation policy for quotation_categories" ON quotation_pro.quotation_categories;
CREATE POLICY "Tenant isolation policy for quotation_categories"
    ON quotation_pro.quotation_categories
    FOR ALL USING (company_id = auth.uid());

DROP POLICY IF EXISTS "Tenant isolation policy for quotation_item_types" ON quotation_pro.quotation_item_types;
CREATE POLICY "Tenant isolation policy for quotation_item_types"
    ON quotation_pro.quotation_item_types
    FOR ALL USING (company_id = auth.uid());

DROP POLICY IF EXISTS quotation_spaces_select_policy ON quotation_pro.quotation_spaces;
CREATE POLICY quotation_spaces_select_policy ON quotation_pro.quotation_spaces
    FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS quotation_spaces_insert_policy ON quotation_pro.quotation_spaces;
CREATE POLICY quotation_spaces_insert_policy ON quotation_pro.quotation_spaces
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS quotation_spaces_update_policy ON quotation_pro.quotation_spaces;
CREATE POLICY quotation_spaces_update_policy ON quotation_pro.quotation_spaces
    FOR UPDATE USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS quotation_spaces_delete_policy ON quotation_pro.quotation_spaces;
CREATE POLICY quotation_spaces_delete_policy ON quotation_pro.quotation_spaces
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- Storage: storage.objects itself stays in the storage schema; only the
-- referenced helper function's schema changes.
DROP POLICY IF EXISTS "Users can view own company files" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own company files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own company files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own company files" ON storage.objects;

CREATE POLICY "Users can view own company files"
ON storage.objects FOR SELECT TO authenticated
USING (
    bucket_id = 'company-assets'
    AND array_length(storage.foldername(name), 1) >= 1
    AND (storage.foldername(name))[1] = quotation_pro.auth_company_id()::text
);

CREATE POLICY "Users can upload own company files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'company-assets'
    AND array_length(storage.foldername(name), 1) >= 1
    AND (storage.foldername(name))[1] = quotation_pro.auth_company_id()::text
);

CREATE POLICY "Users can update own company files"
ON storage.objects FOR UPDATE TO authenticated
USING (
    bucket_id = 'company-assets'
    AND array_length(storage.foldername(name), 1) >= 1
    AND (storage.foldername(name))[1] = quotation_pro.auth_company_id()::text
)
WITH CHECK (
    bucket_id = 'company-assets'
    AND array_length(storage.foldername(name), 1) >= 1
    AND (storage.foldername(name))[1] = quotation_pro.auth_company_id()::text
);

CREATE POLICY "Users can delete own company files"
ON storage.objects FOR DELETE TO authenticated
USING (
    bucket_id = 'company-assets'
    AND array_length(storage.foldername(name), 1) >= 1
    AND (storage.foldername(name))[1] = quotation_pro.auth_company_id()::text
);

COMMIT;
