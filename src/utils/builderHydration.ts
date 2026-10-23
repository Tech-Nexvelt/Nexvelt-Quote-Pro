/**
 * builderHydration.ts
 * -------------------
 * Decides what the Quote Pro builder shows on mount and converts stored
 * QuotationItems back into builder CommercialItems, so opening a saved
 * quotation is never overwritten by an unrelated local draft.
 */

import type { Quotation } from '@/types/quotation';
import type { CommercialItem } from '@/components/quotePro/NexveltQuoteProBuilder';

export type BuilderInitSource = 'draft' | 'saved' | 'new';

export interface BuilderDraftPayload {
  quotationId?: string;
  discountPercent?: number;
  discountType?: 'flat' | '%';
  paymentTerms?: string;
  termsAndConditions?: string;
  items?: CommercialItem[];
}

const MEASURE_UNITS = ['mm', 'cm', 'm', 'inch', 'ft'];
const FT_TO_MM = 304.8;

/** Reverse of the store's setQuotationItems mapping. */
export function commercialItemsFromQuotation(q: Quotation): CommercialItem[] {
  return (q.items || []).map((raw) => {
    const it = raw as any;
    const unit = MEASURE_UNITS.includes(it.unit) ? it.unit : 'mm';
    const hasRaw = MEASURE_UNITS.includes(it.unit);
    return {
      id: it.id,
      category: it.spaceName || 'General',
      itemType: it.category || '',
      image: it.image || '/furniture/wardrobe_4door.png',
      title: it.title || it.name || '',
      subtitle: it.specification || '',
      unit,
      width: hasRaw && it.width != null ? it.width : Math.round((it.widthFt || 0) * FT_TO_MM),
      height: hasRaw && it.height != null ? it.height : Math.round((it.heightFt || 0) * FT_TO_MM),
      depth: hasRaw && it.depth != null ? it.depth : Math.round(((it.depthIn || 0) / 12) * FT_TO_MM),
      areaSqFt: it.areaSqFt || 0,
      material: it.material || '',
      finish: it.finish || '',
      qty: it.qty ?? it.quantity ?? 1,
      rate: it.rate ?? it.baseRate ?? 0,
      amount: it.amount ?? it.lineSubtotal ?? 0,
      pricingMethod: it.pricingMethod,
      itemOrder: it.itemOrder,
    } as CommercialItem;
  });
}

/**
 * - draft belongs to the active quotation (same id, or a legacy draft with no id
 *   and an empty active quotation)  → resume the draft
 * - active quotation has items (e.g. a saved quotation was opened)  → hydrate from it
 * - otherwise → start empty; a draft of some other quotation is ignored
 */
export function resolveBuilderInit(
  draft: BuilderDraftPayload | null,
  quotation: Quotation
): { source: BuilderInitSource; items: CommercialItem[] } {
  const hasItems = (quotation.items || []).length > 0;
  const draftMatches =
    !!draft && (draft.quotationId === quotation.id || (!draft.quotationId && !hasItems));
  if (draftMatches && draft) return { source: 'draft', items: draft.items || [] };
  if (hasItems) {
    // Quotations saved before room names were kept have every item in "General".
    // Recover the room from a local builder draft that still has the same item id.
    const draftById = new Map((draft?.items || []).map((d) => [d.id, d]));
    const items = commercialItemsFromQuotation(quotation).map((it) => {
      const isUnassigned = !it.category || it.category.toLowerCase() === 'general';
      const d = draftById.get(it.id);
      return isUnassigned && d?.category && d.category.toLowerCase() !== 'general'
        ? { ...it, category: d.category }
        : it;
    });
    return { source: 'saved', items };
  }
  return { source: 'new', items: [] };
}
