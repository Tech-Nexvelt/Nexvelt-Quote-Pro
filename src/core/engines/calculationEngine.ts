import { AdditionalCharges, DiscountConfig, QuotationItem, QuotationSummary, TaxConfig } from '@/types/quotation';
import { calculateTax } from './taxEngine';
import { calculateProfitMetrics } from './profitEngine';
import { numberToWordsINR } from '@/utils/numberToWords';

/**
 * Line Item Financial Calculation Strategy Engine
 */
export function calculateLineItem(item: Partial<QuotationItem>): QuotationItem {
  const quantity = Math.max(1, item.quantity || 1);
  const baseRate = Math.max(0, item.baseRate || 0);
  const carcassAddon = Math.max(0, item.carcassRateAddon || 0);
  const shutterAddon = Math.max(0, item.shutterRateAddon || 0);
  const hardwareAddon = Math.max(0, item.hardwareCostAddon || 0);

  const effectiveRatePerUnit = baseRate + carcassAddon + shutterAddon;
  const areaSqFt = Math.max(0, item.areaSqFt || 0);
  const runningLengthFt = Math.max(0, item.runningLengthFt || 0);

  let rawSubtotal = 0;
  const model = item.pricingModel || 'sqft';

  switch (model) {
    case 'sqft':
      rawSubtotal = areaSqFt * effectiveRatePerUnit * quantity;
      break;
    case 'running-ft':
      rawSubtotal = runningLengthFt * effectiveRatePerUnit * quantity;
      break;
    case 'piece':
      rawSubtotal = effectiveRatePerUnit * quantity;
      break;
    case 'manual':
      rawSubtotal = effectiveRatePerUnit * quantity;
      break;
    default:
      rawSubtotal = areaSqFt * effectiveRatePerUnit * quantity;
  }

  const lineSubtotal = Math.round((rawSubtotal + hardwareAddon * quantity) * 100) / 100;

  const buyingRate = Math.max(0, item.buyingCostPerUnit || 0);
  let lineCostSubtotal = 0;
  if (buyingRate > 0) {
    if (model === 'sqft') {
      lineCostSubtotal = areaSqFt * buyingRate * quantity;
    } else if (model === 'running-ft') {
      lineCostSubtotal = runningLengthFt * buyingRate * quantity;
    } else {
      lineCostSubtotal = buyingRate * quantity;
    }
  }
  lineCostSubtotal = Math.round(lineCostSubtotal * 100) / 100;

  return {
    id: item.id || `item_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    roomId: item.roomId,
    category: item.category || 'Wardrobe',
    name: item.name || 'Custom Product',
    dimensions: item.dimensions || { unit: 'ft-in', feet: 7, inches: 0, depthInches: 24 },
    heightFt: item.heightFt || 7,
    widthFt: item.widthFt || 4,
    depthIn: item.depthIn || 24,
    areaSqFt,
    runningLengthFt,
    pricingModel: model,
    baseRate,
    quantity,
    carcassMaterialName: item.carcassMaterialName,
    carcassRateAddon: carcassAddon,
    shutterMaterialName: item.shutterMaterialName,
    shutterRateAddon: shutterAddon,
    hardwarePackageName: item.hardwarePackageName,
    hardwareCostAddon: hardwareAddon,
    buyingCostPerUnit: buyingRate,
    notes: item.notes,
    effectiveRatePerUnit,
    lineSubtotal,
    lineCostSubtotal,
  };
}

/**
 * Master Financial Calculation Engine for Quotations
 */
export function calculateQuotationSummary(
  items: QuotationItem[],
  additionalCharges: AdditionalCharges,
  discount: DiscountConfig,
  tax: TaxConfig
): QuotationSummary {
  let itemsSubtotal = 0;
  let totalAreaSqFt = 0;
  let totalRunningLengthFt = 0;
  let totalItemsCount = 0;
  let totalItemsCost = 0;

  items.forEach((item) => {
    itemsSubtotal += item.lineSubtotal;
    totalAreaSqFt += item.areaSqFt;
    totalRunningLengthFt += item.runningLengthFt;
    totalItemsCount += item.quantity;
    totalItemsCost += item.lineCostSubtotal;
  });

  itemsSubtotal = Math.round(itemsSubtotal * 100) / 100;
  totalAreaSqFt = Math.round(totalAreaSqFt * 100) / 100;
  totalRunningLengthFt = Math.round(totalRunningLengthFt * 100) / 100;

  const additionalChargesTotal = Math.round(
    ((additionalCharges.installation || 0) +
      (additionalCharges.transportation || 0) +
      (additionalCharges.loading || 0) +
      (additionalCharges.labour || 0) +
      (additionalCharges.accessories || 0) +
      (additionalCharges.hardware || 0) +
      (additionalCharges.packaging || 0) +
      (additionalCharges.otherCharges || 0)) *
      100
  ) / 100;

  const grossPreDiscountTotal = itemsSubtotal + additionalChargesTotal;

  let discountAmount = 0;
  if (discount.type === 'flat') {
    discountAmount = Math.min(grossPreDiscountTotal, Math.max(0, discount.value || 0));
  } else if (discount.type === 'percentage') {
    const pct = Math.min(100, Math.max(0, discount.value || 0));
    discountAmount = Math.round(grossPreDiscountTotal * (pct / 100) * 100) / 100;
  }

  const taxableAmount = Math.max(0, Math.round((grossPreDiscountTotal - discountAmount) * 100) / 100);
  const taxBreakdown = calculateTax(taxableAmount, tax);
  const grandTotal = Math.round((taxableAmount + taxBreakdown.totalTax) * 100) / 100;

  const profitMetrics = calculateProfitMetrics(taxableAmount, totalItemsCost);

  return {
    totalItemsCount,
    totalAreaSqFt,
    totalRunningLengthFt,
    itemsSubtotal,
    additionalChargesTotal,
    discountAmount,
    taxableAmount,
    taxAmount: taxBreakdown.totalTax,
    cgstAmount: taxBreakdown.cgst,
    sgstAmount: taxBreakdown.sgst,
    igstAmount: taxBreakdown.igst,
    grandTotal,
    grandTotalInWords: numberToWordsINR(grandTotal),

    totalCostPrice: profitMetrics.totalCostPrice,
    totalSellingPrice: profitMetrics.totalSellingPrice,
    grossProfitAmount: profitMetrics.grossProfitAmount,
    profitPercentage: profitMetrics.profitPercentage,
    marginPercentage: profitMetrics.marginPercentage,
  };
}
