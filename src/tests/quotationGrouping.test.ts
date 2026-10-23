import { describe, it, expect } from 'vitest';
import { groupItemsBySpaceAndType, resolveItemSpecification } from '@/utils/quotationGrouping';
import { useQuotationStore } from '@/store/useQuotationStore';

const row = (id: string, room: string, itemType: string, title: string, subtitle: string, amount: number) => ({
  id, category: room, itemType, title, subtitle, unit: 'mm', width: 1000, height: 2000, depth: 500,
  areaSqFt: 21.5, material: '18mm HDMR Board', finish: '1mm Premium Laminate', qty: 1, rate: 100, amount,
});

const builderRows = [
  row('1', 'Hall / Living', 'Partition', 'Hall Partition', 'Gurjanwood with 1mm laminate', 1000),
  row('2', 'Master Bedroom', 'Box Work', 'Wardrobe', 'Carcass A', 2000),
  row('3', 'Master Bedroom', 'Frame Work', 'Bedroom Frame', 'Teak frame', 3000),
  row('4', 'Master Bedroom', 'Box Work', 'Loft', 'Carcass B', 500),
  row('5', 'Dining', 'Wall Panel', 'Dining Wall Panel', 'Fluted panel', 700),
  row('6', 'Master Bedroom', 'Frame Work', 'Door Frame', 'Custom Specification'.replace(/^/, 'Frame Work '), 400),
];

describe('quotation grouping: Space → Item Type → Items', () => {
  const load = () => {
    useQuotationStore.getState().setQuotationItems(builderRows);
    const q = useQuotationStore.getState().currentQuotation;
    return { q, groups: groupItemsBySpaceAndType(q.items, q.spaces || []) };
  };

  it('keeps room names as top-level groups, not item types', () => {
    const { groups } = load();
    expect(groups.map((g) => g.spaceName).sort()).toEqual(['Dining', 'Hall / Living', 'Master Bedroom']);
  });

  it('places item types beneath the right room', () => {
    const { groups } = load();
    const master = groups.find((g) => g.spaceName === 'Master Bedroom')!;
    const types = Object.fromEntries(master.itemTypeGroups.map((t) => [t.itemType, t.items.map((i) => i.name)]));
    expect(types['Box Work']).toEqual(['Wardrobe', 'Loft']);
    expect(types['Frame Work']).toEqual(['Bedroom Frame', 'Door Frame']);
    const hall = groups.find((g) => g.spaceName === 'Hall / Living')!;
    expect(hall.itemTypeGroups[0].itemType).toBe('Partition');
    const dining = groups.find((g) => g.spaceName === 'Dining')!;
    expect(dining.itemTypeGroups[0].items[0].name).toBe('Dining Wall Panel');
  });

  it('keeps each item specification and falls back to material/finish for placeholders', () => {
    const { q } = load();
    const spec = (name: string) => q.items.find((i) => i.name === name)!.specification;
    expect(spec('Hall Partition')).toBe('Gurjanwood with 1mm laminate');
    expect(spec('Wardrobe')).toBe('Carcass A');
    expect(spec('Door Frame')).toBe('18mm HDMR Board with 1mm Premium Laminate');
  });

  it('does not change totals and subtotals reconcile', () => {
    const { q, groups } = load();
    const sum = groups.reduce((s, g) => s + g.spaceSubtotal, 0);
    expect(sum).toBe(7600);
    expect(q.summary.itemsSubtotal).toBe(7600);
  });

  it('does not mutate the source items and handles items without space', () => {
    const items = [{ id: 'x', category: 'Box Work', name: 'Legacy' } as any];
    const copy = JSON.stringify(items);
    const groups = groupItemsBySpaceAndType(items, []);
    expect(JSON.stringify(items)).toBe(copy);
    expect(groups[0].spaceName).toBe('General');
  });

  it('resolveItemSpecification returns empty when nothing entered', () => {
    expect(resolveItemSpecification({})).toBe('');
  });
});

describe('room preservation through store actions', () => {
  const setup = () => {
    useQuotationStore.getState().setQuotationItems(builderRows);
    return useQuotationStore.getState();
  };
  const find = (name: string) =>
    useQuotationStore.getState().currentQuotation.items.find((i) => i.name === name)!;

  it('keeps the room when an item is updated', () => {
    setup();
    const it0 = find('Wardrobe');
    useQuotationStore.getState().updateItem(it0.id, { specification: 'Edited spec' });
    const after = find('Wardrobe');
    expect(after.spaceName).toBe('Master Bedroom');
    expect(after.spaceId).toBe(it0.spaceId);
    expect(after.specification).toBe('Edited spec');
    expect(after.category).toBe('Box Work');
  });

  it('keeps the room and spec when an item is duplicated', () => {
    setup();
    const src = find('Hall Partition');
    useQuotationStore.getState().duplicateItem(src.id);
    const copy = find('Hall Partition (Copy)');
    expect(copy.spaceName).toBe('Hall / Living');
    expect(copy.specification).toBe('Gurjanwood with 1mm laminate');
  });

  it('keeps the room when an item is added with a space', () => {
    setup();
    const dining = find('Dining Wall Panel');
    useQuotationStore.getState().addItem({
      name: 'Crockery Unit', category: 'Box Work', spaceId: dining.spaceId, spaceName: 'Dining',
    });
    const added = find('Crockery Unit');
    expect(added.spaceName).toBe('Dining');
    const groups = groupItemsBySpaceAndType(
      useQuotationStore.getState().currentQuotation.items,
      useQuotationStore.getState().currentQuotation.spaces || []
    );
    const d = groups.find((g) => g.spaceName === 'Dining')!;
    expect(d.itemTypeGroups.map((t) => t.itemType).sort()).toEqual(['Box Work', 'Wall Panel']);
  });

  it('same item type in different rooms stays separate; reorder keeps rooms', () => {
    useQuotationStore.getState().setQuotationItems([
      ...builderRows,
      row('7', 'Dining', 'Box Work', 'Crockery', 'Spec C', 300),
    ]);
    const q = useQuotationStore.getState().currentQuotation;
    const groups = groupItemsBySpaceAndType(q.items, q.spaces || []);
    const boxRooms = groups.filter((g) => g.itemTypeGroups.some((t) => t.itemType === 'Box Work')).map((g) => g.spaceName).sort();
    expect(boxRooms).toEqual(['Dining', 'Master Bedroom']);
    useQuotationStore.getState().reorderItems([...q.items].reverse());
    const q2 = useQuotationStore.getState().currentQuotation;
    expect(q2.items.find((i) => i.name === 'Crockery')!.spaceName).toBe('Dining');
  });

  it('save then load preserves rooms, types, specs, numbers and totals', () => {
    setup();
    const before = useQuotationStore.getState().currentQuotation;
    useQuotationStore.getState().saveCurrentQuotation();
    useQuotationStore.getState().createNewQuotation();
    expect(useQuotationStore.getState().currentQuotation.items).toHaveLength(0);
    useQuotationStore.getState().loadQuotation(before.id);
    const after = useQuotationStore.getState().currentQuotation;
    const shape = (q: typeof before) =>
      groupItemsBySpaceAndType(q.items, q.spaces || []).map((g) => ({
        room: g.spaceName,
        types: g.itemTypeGroups.map((t) => ({
          type: t.itemType,
          items: t.items.map((i) => [i.name, i.specification, i.heightFt, i.widthFt, i.areaSqFt, i.baseRate, i.quantity, i.lineSubtotal]),
        })),
      }));
    expect(shape(after)).toEqual(shape(before));
    expect(after.summary.grandTotal).toBe(before.summary.grandTotal);
  });

  it('legacy items with no room fall back to General', () => {
    useQuotationStore.getState().addItem({ name: 'Old item', category: 'Wardrobe' });
    const old = find('Old item');
    expect(old.spaceName).toBe('General');
  });
});

describe('resolveItemSpecification cases', () => {
  it('prefers user text, falls back from blank/placeholder, never fabricates', () => {
    expect(resolveItemSpecification({ specification: 'User spec', material: 'M', finish: 'F' })).toBe('User spec');
    expect(resolveItemSpecification({ specification: '', material: 'M', finish: 'F' })).toBe('M with F');
    expect(resolveItemSpecification({ subtitle: 'Box Work Custom Specification', material: 'M', finish: 'F' })).toBe('M with F');
    expect(resolveItemSpecification({ subtitle: 'Box Work Custom Specification', material: 'M' })).toBe('M');
    expect(resolveItemSpecification({ subtitle: 'Box Work Custom Specification' })).toBe('');
  });
});

import { resolveBuilderInit, commercialItemsFromQuotation } from '@/utils/builderHydration';

describe('saved quotation loading into the builder', () => {
  const store = () => useQuotationStore.getState();

  it('duplicating a space keeps its items in the new room', () => {
    store().setQuotationItems(builderRows);
    const dining = store().currentQuotation.spaces!.find((s) => s.spaceName === 'Dining')!;
    store().duplicateSpace(dining.id);
    const q = store().currentQuotation;
    const copy = q.spaces!.find((s) => s.id !== dining.id && s.spaceName.startsWith('Dining'))!;
    const moved = q.items.filter((i) => i.spaceId === copy.id);
    expect(moved).toHaveLength(1);
    expect(moved[0].spaceName).toBe(copy.spaceName);
  });

  it('opening a saved quotation uses it, not an unrelated local draft', () => {
    store().setQuotationItems(builderRows);
    const saved = store().currentQuotation;
    const staleDraft = { quotationId: 'some-other-quote', items: [row('z', 'Kitchen', 'Countertop', 'Stale', 'x', 1)] as any };
    const init = resolveBuilderInit(staleDraft, saved);
    expect(init.source).toBe('saved');
    expect(init.items.map((i) => i.title).sort()).toEqual(builderRows.map((r) => r.title).sort());
  });

  it('resumes the draft when it belongs to the active quotation', () => {
    store().setQuotationItems(builderRows);
    const q = store().currentQuotation;
    const draft = { quotationId: q.id, items: [row('d', 'Dining', 'Box Work', 'Draft item', 's', 1)] as any };
    expect(resolveBuilderInit(draft, q)).toMatchObject({ source: 'draft' });
  });

  it('resumes a legacy draft without id only for an empty quotation; new stays empty', () => {
    store().createNewQuotation();
    const fresh = store().currentQuotation;
    const legacy = { items: [row('d', 'Dining', 'Box Work', 'Legacy draft', 's', 1)] as any };
    expect(resolveBuilderInit(legacy, fresh).source).toBe('draft');
    expect(resolveBuilderInit({ quotationId: 'old', items: legacy.items }, fresh)).toEqual({ source: 'new', items: [] });
    expect(resolveBuilderInit(null, fresh)).toEqual({ source: 'new', items: [] });
  });

  it('round trip: saved → builder items → store keeps rooms, specs, totals and identity', () => {
    store().setQuotationItems(builderRows);
    store().saveCurrentQuotation();
    const saved = store().currentQuotation;
    store().createNewQuotation();
    store().loadQuotation(saved.id);
    const loaded = store().currentQuotation;
    const builderItems = commercialItemsFromQuotation(loaded);
    // builder edits one specification and re-syncs
    builderItems.find((i) => i.title === 'Wardrobe')!.subtitle = 'Edited in builder';
    store().setQuotationItems(builderItems);
    store().saveCurrentQuotation();
    const after = store().currentQuotation;
    expect(after.id).toBe(saved.id);
    expect(store().savedQuotations.filter((q) => q.id === saved.id)).toHaveLength(1);
    expect(after.items.find((i) => i.name === 'Wardrobe')!.specification).toBe('Edited in builder');
    expect(after.items.find((i) => i.name === 'Wardrobe')!.spaceName).toBe('Master Bedroom');
    expect(after.summary.itemsSubtotal).toBe(saved.summary.itemsSubtotal);
    expect(after.spaces!.length).toBe(saved.spaces!.length);
    const shape = (q: typeof after) =>
      groupItemsBySpaceAndType(q.items, q.spaces || []).map((g) => [g.spaceName, g.itemTypeGroups.map((t) => [t.itemType, t.items.map((i) => i.name)])]);
    expect(shape(after)).toEqual(shape(saved));
  });
});

describe('legacy saved quotation with every item in General', () => {
  it('recovers room names from the local builder draft by item id', () => {
    useQuotationStore.getState().setQuotationItems(builderRows);
    const q = useQuotationStore.getState().currentQuotation;
    const legacy = {
      ...q,
      spaces: [],
      items: q.items.map((i) => ({ ...i, spaceId: 'space_general', spaceName: 'General' })),
    };
    const init = resolveBuilderInit({ quotationId: 'old', items: builderRows as any }, legacy);
    expect(init.source).toBe('saved');
    expect(init.items.find((i) => i.title === 'Wardrobe')!.category).toBe('Master Bedroom');
    expect(init.items.find((i) => i.title === 'Dining Wall Panel')!.category).toBe('Dining');
  });
});
