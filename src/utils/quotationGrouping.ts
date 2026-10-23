/**
 * quotationGrouping.ts
 * --------------------
 * Shared, strongly-typed utility for grouping QuotationItems by
 *   Space → Item Type → Items
 *
 * Used by QuotationTable (builder), A4PrintableInvoice (print/PDF), and tests.
 * Do NOT duplicate this logic elsewhere.
 */

import { QuotationItem } from '@/types/quotation';
import { QuotationSpace } from '@/types/spaces';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ItemTypeGroup {
  /** The item's category/itemType value (e.g. "Box Work", "Partition") */
  itemType: string;
  /** All items belonging to this type within this space */
  items: QuotationItem[];
  /** Pre-calculated subtotal for this type group */
  typeSubtotal: number;
}

export interface SpaceGroup {
  spaceId: string;
  spaceName: string;
  spaceType?: string;
  /** displayOrder from the QuotationSpace definition (used for stable sort) */
  displayOrder: number;
  /** Item-type groups within this space, in stable insertion order */
  itemTypeGroups: ItemTypeGroup[];
  /** Pre-calculated space subtotal (sum of all items in space) */
  spaceSubtotal: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main grouping function
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Groups quotation items into the hierarchy:
 *   Space → Item Type → Items
 *
 * Rules:
 * - Items are grouped first by their spaceId (falling back to 'space_general').
 * - Within each space, items are grouped by their `category` field
 *   (which holds the Item Type: "Box Work", "Partition", etc.).
 * - Groups preserve the original item ordering (itemOrder / insertion order).
 * - Spaces are sorted by their displayOrder from the spaces array.
 * - Only spaces that actually contain items are returned (empty spaces omitted).
 *
 * @param items    - Flat list of QuotationItem from the store.
 * @param spaces   - Ordered list of QuotationSpace from the store.
 * @returns        - Ordered list of SpaceGroup, each containing ordered ItemTypeGroups.
 */
export function groupItemsBySpaceAndType(
  items: QuotationItem[],
  spaces: QuotationSpace[]
): SpaceGroup[] {
  // Build a lookup map: spaceId → QuotationSpace
  const spaceMap = new Map<string, QuotationSpace>(spaces.map((s) => [s.id, s]));

  // Intermediate accumulator: spaceId → { meta, itemTypeMap }
  const acc = new Map<
    string,
    {
      spaceId: string;
      spaceName: string;
      spaceType?: string;
      displayOrder: number;
      itemTypeMap: Map<string, QuotationItem[]>;
    }
  >();

  for (const item of items) {
    const spaceId = item.spaceId || 'space_general';
    const spaceMeta = spaceMap.get(spaceId);
    const spaceName = item.spaceName || spaceMeta?.spaceName || 'General';
    const spaceType = spaceMeta?.spaceType;
    const displayOrder = spaceMeta?.displayOrder ?? 9999;

    if (!acc.has(spaceId)) {
      acc.set(spaceId, {
        spaceId,
        spaceName,
        spaceType,
        displayOrder,
        itemTypeMap: new Map<string, QuotationItem[]>(),
      });
    }

    const spaceEntry = acc.get(spaceId)!;

    // The category field holds the Item Type (e.g. "Box Work", "Partition")
    // Fall back to 'Uncategorized' — never silently classify as 'Box Work'.
    const itemType = resolveItemType(item);

    if (!spaceEntry.itemTypeMap.has(itemType)) {
      spaceEntry.itemTypeMap.set(itemType, []);
    }
    spaceEntry.itemTypeMap.get(itemType)!.push(item);
  }

  // Convert accumulator to ordered SpaceGroup[]
  const spaceGroups: SpaceGroup[] = [];

  for (const entry of acc.values()) {
    const itemTypeGroups: ItemTypeGroup[] = [];

    for (const [itemType, typeItems] of entry.itemTypeMap) {
      const typeSubtotal = typeItems.reduce(
        (sum, i) => sum + (i.lineSubtotal ?? (i as any).amount ?? 0),
        0
      );
      itemTypeGroups.push({ itemType, items: typeItems, typeSubtotal });
    }

    const spaceSubtotal = itemTypeGroups.reduce((sum, g) => sum + g.typeSubtotal, 0);

    spaceGroups.push({
      spaceId: entry.spaceId,
      spaceName: entry.spaceName,
      spaceType: entry.spaceType,
      displayOrder: entry.displayOrder,
      itemTypeGroups,
      spaceSubtotal,
    });
  }

  // Sort spaces by their displayOrder (stable; preserves insertion order for ties)
  spaceGroups.sort((a, b) => a.displayOrder - b.displayOrder);

  return spaceGroups;
}

// ─────────────────────────────────────────────────────────────────────────────
// Item Type resolution helper
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolves the display Item Type string from a QuotationItem.
 *
 * Field priority:
 *   1. item.category        — the canonical field in QuotationItem (holds item type)
 *   2. (item as any).itemType — legacy field name used in some older saved drafts
 *   3. 'Uncategorized'      — neutral fallback; never defaults to 'Box Work'
 *
 * This function must NOT infer the category from the product name.
 */
export function resolveItemType(item: QuotationItem | Record<string, unknown>): string {
  const raw = (item as any).category || (item as any).itemType;
  if (typeof raw === 'string' && raw.trim() !== '') {
    return raw.trim();
  }
  return 'Uncategorized';
}

// ─────────────────────────────────────────────────────────────────────────────
// Specification resolution helper
// ─────────────────────────────────────────────────────────────────────────────

const isPlaceholderSpec = (v: string) => /custom specification$/i.test(v.trim());

/**
 * Resolves the specification text shown for an item.
 *   1. explicit `specification`
 *   2. `subtitle` (builder's Specification field) unless blank / a generated placeholder
 *   3. "<material> with <finish>" built from the item's own fields
 * Returns '' when nothing was entered — never invents a value.
 */
export function resolveItemSpecification(item: {
  specification?: string | null;
  subtitle?: string | null;
  material?: string | null;
  finish?: string | null;
}): string {
  const spec = item.specification?.trim();
  if (spec) return spec;
  const sub = item.subtitle?.trim();
  if (sub && !isPlaceholderSpec(sub)) return sub;
  const material = item.material?.trim();
  const finish = item.finish?.trim();
  if (material && finish) return `${material} with ${finish}`;
  return material || finish || '';
}
