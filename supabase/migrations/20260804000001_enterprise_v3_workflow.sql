-- ============================================================================
-- Enterprise Quotation Builder V3 Migration
-- Schema for quotation_categories, quotation_item_types, and updated quotation_items
-- ============================================================================

-- 1. Create quotation_categories table
CREATE TABLE IF NOT EXISTS public.quotation_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  icon_name TEXT DEFAULT 'Folder',
  is_custom BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create quotation_item_types table
CREATE TABLE IF NOT EXISTS public.quotation_item_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  is_custom BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Extend quotation_items table with category_id, item_type_id, custom names & orders
ALTER TABLE public.quotation_items 
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.quotation_categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS item_type_id UUID REFERENCES public.quotation_item_types(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS custom_category_name TEXT,
  ADD COLUMN IF NOT EXISTS custom_item_type_name TEXT,
  ADD COLUMN IF NOT EXISTS category_order INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS item_order INT DEFAULT 0;

-- 4. Enable RLS and Tenant Isolation
ALTER TABLE public.quotation_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_item_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation policy for quotation_categories"
  ON public.quotation_categories
  FOR ALL USING (company_id = auth.uid());

CREATE POLICY "Tenant isolation policy for quotation_item_types"
  ON public.quotation_item_types
  FOR ALL USING (company_id = auth.uid());

-- 5. Indexes for fast category and item type lookups
CREATE INDEX IF NOT EXISTS idx_quotation_categories_company ON public.quotation_categories(company_id, display_order);
CREATE INDEX IF NOT EXISTS idx_quotation_item_types_company ON public.quotation_item_types(company_id, display_order);
CREATE INDEX IF NOT EXISTS idx_quotation_items_category ON public.quotation_items(category_id, category_order);
