-- Migration: Enterprise Quotation Spaces Hierarchy
-- Description: Adds quotation_spaces table and space_id / item_order to quotation_items

CREATE TABLE IF NOT EXISTS public.quotation_spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id UUID NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
  space_type VARCHAR(100) NOT NULL DEFAULT 'Others',
  space_name VARCHAR(255) NOT NULL DEFAULT 'General',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for quotation_spaces lookup
CREATE INDEX IF NOT EXISTS idx_quotation_spaces_quotation_id ON public.quotation_spaces(quotation_id);
CREATE INDEX IF NOT EXISTS idx_quotation_spaces_display_order ON public.quotation_spaces(quotation_id, display_order);

-- Enable RLS on quotation_spaces
ALTER TABLE public.quotation_spaces ENABLE ROW LEVEL SECURITY;

-- Policies for quotation_spaces
CREATE POLICY quotation_spaces_select_policy ON public.quotation_spaces
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY quotation_spaces_insert_policy ON public.quotation_spaces
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY quotation_spaces_update_policy ON public.quotation_spaces
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY quotation_spaces_delete_policy ON public.quotation_spaces
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Add space_id and item_order to quotation_items if columns don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'quotation_items' AND column_name = 'space_id'
  ) THEN
    ALTER TABLE public.quotation_items ADD COLUMN space_id UUID REFERENCES public.quotation_spaces(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'quotation_items' AND column_name = 'item_order'
  ) THEN
    ALTER TABLE public.quotation_items ADD COLUMN item_order INTEGER DEFAULT 1;
  END IF;
END $$;
