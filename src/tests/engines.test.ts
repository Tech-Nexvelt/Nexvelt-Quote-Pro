import { describe, it, expect } from 'vitest';
import { calculateLineItem, calculateQuotationSummary } from '../core/engines/calculationEngine';
import { calculateTax } from '../core/engines/taxEngine';
import { calculateProfitMetrics } from '../core/engines/profitEngine';
import { convertToFeet, calculateBoxWorkArea } from '../core/engines/measurementEngine';

describe('Financial Calculation Engines Test Suite', () => {
  it('should accurately calculate line item subtotal for sqft model', () => {
    const item = calculateLineItem({
      category: 'Wardrobe',
      name: 'Custom Wardrobe',
      heightFt: 7.5,
      widthFt: 6,
      areaSqFt: 45,
      pricingModel: 'sqft',
      baseRate: 1000,
      carcassRateAddon: 100,
      shutterRateAddon: 200,
      hardwareCostAddon: 500,
      quantity: 2,
    });

    // Effective rate per unit = 1000 + 100 + 200 = 1300
    // Raw subtotal = 45 sqft * 1300 * 2 = 117,000
    // Plus hardware = 117,000 + (500 * 2) = 118,000
    expect(item.effectiveRatePerUnit).toBe(1300);
    expect(item.lineSubtotal).toBe(118000);
  });

  it('should accurately calculate GST tax breakdown for intra-state', () => {
    const tax = calculateTax(10000, { enabled: true, type: 'gst', ratePercent: 18 });
    expect(tax.totalTax).toBe(1800);
    expect(tax.cgst).toBe(900);
    expect(tax.sgst).toBe(900);
    expect(tax.igst).toBe(0);
  });

  it('should calculate gross profit and margin percentage', () => {
    const metrics = calculateProfitMetrics(10000, 6000);
    expect(metrics.grossProfitAmount).toBe(4000);
    expect(metrics.profitPercentage).toBe(66.67); // (4000/6000)*100
    expect(metrics.marginPercentage).toBe(40); // (4000/10000)*100
  });

  it('should convert measurement units and compute box work area', () => {
    expect(convertToFeet(6, 'ft')).toBe(6);
    expect(convertToFeet(7.5, 'ft')).toBe(7.5);
    expect(calculateBoxWorkArea(6, 8, 'ft')).toBe(48);
  });

  it('should compute full quotation summary including discount and tax', () => {
    const item1 = calculateLineItem({
      areaSqFt: 100,
      baseRate: 1000,
      pricingModel: 'sqft',
      quantity: 1,
      buyingCostPerUnit: 600,
    });

    const summary = calculateQuotationSummary(
      [item1],
      { installation: 2000, transportation: 1000, loading: 0, labour: 0, accessories: 0, hardware: 0, packaging: 0, otherCharges: 0 },
      { type: 'percentage', value: 10 },
      { enabled: true, type: 'gst', ratePercent: 18 }
    );

    // Items Subtotal = 100,000
    // Additional Charges = 3,000
    // Gross Pre-discount = 103,000
    // 10% Discount = 10,300
    // Taxable Amount = 92,700
    // GST (18%) = 16,686
    // Grand Total = 109,386
    expect(summary.itemsSubtotal).toBe(100000);
    expect(summary.additionalChargesTotal).toBe(3000);
    expect(summary.discountAmount).toBe(10300);
    expect(summary.taxableAmount).toBe(92700);
    expect(summary.taxAmount).toBe(16686);
    expect(summary.grandTotal).toBe(109386);
  });
});

// ─── Specification Synchronization Tests ────────────────────────────────────
describe('Specification / Details Synchronization', () => {
  it('should preserve specification through calculateLineItem', () => {
    const item = calculateLineItem({
      name: 'Hall Partition',
      category: 'Partition',
      areaSqFt: 20,
      pricingModel: 'sqft',
      baseRate: 900,
      quantity: 1,
      specification: 'Gurjanwood with 1mm laminate',
    });
    expect(item.specification).toBe('Gurjanwood with 1mm laminate');
  });

  it('should preserve specification when item has no spec (backward compat)', () => {
    const item = calculateLineItem({
      name: 'Box Work',
      category: 'Box Work',
      areaSqFt: 15,
      pricingModel: 'sqft',
      baseRate: 800,
      quantity: 1,
      // no specification field — simulates legacy data
    });
    expect(item.specification).toBeUndefined();
    // Ensure financials are still correct
    expect(item.lineSubtotal).toBe(12000);
  });

  it('should keep specifications isolated between items', () => {
    const item1 = calculateLineItem({
      id: 'item_1',
      name: 'Hall Partition',
      areaSqFt: 20,
      pricingModel: 'sqft',
      baseRate: 900,
      quantity: 1,
      specification: 'Gurjanwood with 1mm laminate',
    });
    const item2 = calculateLineItem({
      id: 'item_2',
      name: 'TV Unit',
      areaSqFt: 12,
      pricingModel: 'sqft',
      baseRate: 1200,
      quantity: 1,
      specification: '18mm HDMR board with laminate',
    });
    expect(item1.specification).toBe('Gurjanwood with 1mm laminate');
    expect(item2.specification).toBe('18mm HDMR board with laminate');
    expect(item1.specification).not.toBe(item2.specification);
  });

  it('should preserve specification when duplicating an item (spread)', () => {
    const original = calculateLineItem({
      id: 'orig_1',
      name: 'Frame Work',
      areaSqFt: 18,
      pricingModel: 'sqft',
      baseRate: 750,
      quantity: 1,
      specification: '18mm HDMR board',
    });
    const duplicate = calculateLineItem({
      ...original,
      id: 'dup_1',
      name: 'Frame Work (Copy)',
    });
    expect(duplicate.specification).toBe('18mm HDMR board');
    expect(duplicate.id).toBe('dup_1');
    // Ensure original is unchanged
    expect(original.specification).toBe('18mm HDMR board');
  });

  it('should not overwrite specification when updating unrelated fields', () => {
    const original = calculateLineItem({
      id: 'item_x',
      name: 'Wardrobe',
      areaSqFt: 40,
      pricingModel: 'sqft',
      baseRate: 1200,
      quantity: 1,
      specification: 'Marine Ply with PU finish',
    });
    // Simulate updateItem: spread original + changed quantity
    const updated = calculateLineItem({ ...original, quantity: 2 });
    expect(updated.specification).toBe('Marine Ply with PU finish');
    expect(updated.quantity).toBe(2);
    // Financials must reflect new quantity
    expect(updated.lineSubtotal).toBe(original.lineSubtotal * 2);
  });

  it('should handle empty string specification gracefully', () => {
    const item = calculateLineItem({
      name: 'Loft',
      areaSqFt: 8,
      pricingModel: 'sqft',
      baseRate: 600,
      quantity: 1,
      specification: '',
    });
    // Empty string passes through — caller decides whether to render it
    expect(item.specification).toBe('');
  });
});
