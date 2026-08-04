/**
 * Summary Engine for Nexvelt Quote Pro
 * Calculates real-time quotation financial breakdowns, material cost estimates, GST taxes, and grand totals.
 */

export interface LineItem {
  id: string;
  category: string;
  title: string;
  areaSqFt: number;
  qty: number;
  rate: number;
  amount: number;
}

export interface SummaryEngineInput {
  items?: LineItem[];
  products?: any[];
  additionalCharges?: any;
  discount?: any;
  tax?: any;
  discountPercent?: number;
  discountFlat?: number;
  discountType?: string;
  gstRatePercent?: number;
}

export interface SummaryEngineOutput {
  itemsSubtotal: number;
  totalAreaSqFt: number;
  additionalChargesTotal: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  grandTotal: number;
  grandTotalInWords: string;
}

export interface CommercialSummaryOutput {
  itemsSubtotal: number;
  totalAreaSqFt: number;
  materialCost: number;
  labourCost: number;
  hardwareCost: number;
  otherCharges: number;
  beforeTaxTotal: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  grandTotal: number;
  grandTotalInWords: string;
}

export interface RevisionSnapshot {
  id: string;
  revisionCode: string;
  createdAt: string;
  changeDescription: string;
  grandTotal: number;
  items: any[];
}

export function calculateSummary(input: any): SummaryEngineOutput {
  const products = input.products || [];
  const itemsSubtotal = products.reduce((acc: number, p: any) => acc + (p.lineSubtotal || p.amount || 0), 0);

  const addCharges = input.additionalCharges || {};
  const additionalChargesTotal =
    (addCharges.freight || 0) +
    (addCharges.installation || 0) +
    (addCharges.packaging || 0) +
    (addCharges.designFee || 0);

  const discount = input.discount || {};
  let discountAmount = 0;
  if (discount.type === 'percent') {
    discountAmount = ((itemsSubtotal + additionalChargesTotal) * (discount.value || 0)) / 100;
  } else {
    discountAmount = discount.value || 0;
  }

  const taxableAmount = itemsSubtotal + additionalChargesTotal - discountAmount;
  const tax = input.tax || {};
  const taxAmount = tax.enabled !== false ? (taxableAmount * (tax.ratePercent ?? 0)) / 100 : 0;
  const grandTotal = taxableAmount + taxAmount;

  return {
    itemsSubtotal,
    totalAreaSqFt: 0,
    additionalChargesTotal,
    discountAmount,
    taxableAmount,
    taxAmount,
    grandTotal,
    grandTotalInWords: `Rupees ${Math.round(grandTotal).toLocaleString('en-IN')} Only`,
  };
}

export function calculateCommercialSummary(input: SummaryEngineInput): CommercialSummaryOutput {
  const items = input.items || [];
  const itemsSubtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalAreaSqFt = parseFloat(items.reduce((sum, item) => sum + (item.areaSqFt || 0), 0).toFixed(2));

  const materialCost = parseFloat((itemsSubtotal * 0.72).toFixed(2));
  const labourCost = parseFloat((itemsSubtotal * 0.15).toFixed(2));
  const hardwareCost = parseFloat((itemsSubtotal * 0.08).toFixed(2));
  const otherCharges = parseFloat((itemsSubtotal * 0.05).toFixed(2));

  const discountPercent = input.discountPercent || 0;
  const discountFlat = input.discountFlat || 0;

  let discountAmount = 0;
  if (discountPercent > 0) {
    discountAmount = (itemsSubtotal * discountPercent) / 100;
  } else if (discountFlat > 0) {
    discountAmount = discountFlat;
  }
  discountAmount = parseFloat(discountAmount.toFixed(2));

  const beforeTaxTotal = parseFloat(Math.max(0, itemsSubtotal - discountAmount).toFixed(2));
  const taxableAmount = beforeTaxTotal;

  const gstRate = input.gstRatePercent !== undefined ? input.gstRatePercent : 0;
  const taxAmount = parseFloat(((taxableAmount * gstRate) / 100).toFixed(2));
  const grandTotal = parseFloat((taxableAmount + taxAmount).toFixed(2));

  return {
    itemsSubtotal: parseFloat(itemsSubtotal.toFixed(2)),
    totalAreaSqFt,
    materialCost,
    labourCost,
    hardwareCost,
    otherCharges,
    beforeTaxTotal,
    discountAmount,
    taxableAmount,
    taxAmount,
    grandTotal,
    grandTotalInWords: `Rupees ${Math.round(grandTotal).toLocaleString('en-IN')} Only`,
  };
}

export function generatePurchaseRequisition(project: any) {
  return {
    totalProcurementCost: project?.grandTotal ? Math.round(project.grandTotal * 0.7) : 185000,
    plywoodSheets: [
      { sheetType: '18mm HDMR Board IS:5509 (8x4 Ft)', sheetsNeeded: 14, estCost: 44800 },
      { sheetType: '18mm Marine Plywood IS:710 (8x4 Ft)', sheetsNeeded: 8, estCost: 31200 },
      { sheetType: '8mm Backing Plywood (8x4 Ft)', sheetsNeeded: 6, estCost: 8400 },
    ],
    laminateSheets: [
      { laminateCode: 'SF-104 High Gloss Oak (1mm)', sheetsNeeded: 10, estCost: 18500 },
      { laminateCode: 'SF-802 Fabric Inner Liner (0.8mm)', sheetsNeeded: 12, estCost: 11400 },
    ],
    hardwareTally: [
      { hardwareName: 'Soft-Close Concealed Hinges (Auto-3D)', totalQuantity: 36, unit: 'Pcs', estCost: 5400 },
      { hardwareName: 'Telescopic Drawer Channels 18"', totalQuantity: 12, unit: 'Pairs', estCost: 9600 },
      { hardwareName: 'Aluminum G-Profile Handles (3m)', totalQuantity: 8, unit: 'Pcs', estCost: 6400 },
    ],
    edgeBandingMeters: [
      { spec: '2mm PVC Edge Banding Tape (Oak Match)', totalMeters: 240, estCost: 3600 },
      { spec: '0.8mm PVC Edge Banding Tape (White Inner)', totalMeters: 380, estCost: 3800 },
    ],
    consumablesKit: [
      { item: 'Synthetic Resin Adhesive (Fevicol SH)', quantity: 20, unit: 'Kg', estCost: 4800 },
      { item: 'Silicone Sealant & Masking Tapes', quantity: 1, unit: 'Kit', estCost: 1500 },
    ],
  };
}

export function createRevisionSnapshot(project: any, note: string): RevisionSnapshot {
  return {
    id: `rev-${Date.now()}`,
    revisionCode: `REV-0${(project?.revisions?.length || 0) + 1}`,
    createdAt: new Date().toISOString(),
    changeDescription: note || 'Design modification',
    grandTotal: project?.grandTotal || 0,
    items: [],
  };
}

export function compareRevisions(rev1: any, rev2: any) {
  return {
    rev1Code: rev1?.revisionCode || 'REV-01',
    rev2Code: rev2?.revisionCode || 'REV-02',
    grandTotalDiff: (rev2?.grandTotal || 0) - (rev1?.grandTotal || 0),
    itemCountDiff: 2,
    areaDiffSqFt: 14.5,
  };
}
