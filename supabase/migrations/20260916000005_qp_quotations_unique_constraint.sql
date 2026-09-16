-- ============================================================================
-- MIGRATION: Add unique constraint on quotations (company_id, quotation_number)
-- Required for upsert with ON CONFLICT (quotation_number, company_id) to work.
-- The quotations table was originally created without this constraint.
-- ============================================================================

BEGIN;

ALTER TABLE quotation_pro.quotations
  ADD CONSTRAINT IF NOT EXISTS uq_quotations_company_number
  UNIQUE (company_id, quotation_number);

COMMIT;
