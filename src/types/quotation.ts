import { UnitSystem, DimensionsInput } from './units';
import { PricingModel } from './pricing';
import { Customer } from './customer';

export interface AdditionalCharges {
  installation: number;
  transportation: number;
  loading: number;
  labour: number;
  accessories: number;
  hardware: number;
  packaging: number;
  otherCharges: number;
}

export type DiscountType = 'flat' | 'percentage';
export type TaxType = 'none' | 'gst' | 'cgst_sgst' | 'igst';

export interface DiscountConfig {
  type: DiscountType;
  value: number;
}

export interface TaxConfig {
  enabled: boolean;
  type: TaxType;
  ratePercent: number; // e.g. 18
}

export interface QuotationItem {
  id: string;
  roomId?: string;
  category: string; // Wardrobe, Kitchen, TV Unit, etc.
  name: string;
  dimensions: DimensionsInput;
  // Computed decimal feet
  heightFt: number;
  widthFt: number;
  depthIn: number;
  areaSqFt: number;
  runningLengthFt: number;
  
  pricingModel: PricingModel;
  baseRate: number;
  quantity: number;
  
  carcassMaterialName?: string;
  carcassRateAddon?: number;
  shutterMaterialName?: string;
  shutterRateAddon?: number;
  hardwarePackageName?: string;
  hardwareCostAddon?: number;
  
  buyingCostPerUnit?: number; // For profit analysis
  notes?: string;
  
  // Calculated financial line output
  effectiveRatePerUnit: number;
  lineSubtotal: number;
  lineCostSubtotal: number; // Product line buying cost total
}

export interface QuotationSummary {
  totalItemsCount: number;
  totalAreaSqFt: number;
  totalRunningLengthFt: number;
  itemsSubtotal: number;
  additionalChargesTotal: number;
  discountAmount: number;
  taxableAmount: number;
  taxableSubtotal?: number;
  taxAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  grandTotal: number;
  grandTotalInWords: string;
  
  // Profit Analysis
  totalCostPrice: number;
  totalSellingPrice: number;
  grossProfitAmount: number;
  profitPercentage: number; // Profit / Cost * 100
  marginPercentage: number; // Profit / Selling * 100
}

export type QuotationStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'archived';

export interface QuotationRevision {
  revisionCode: string; // e.g. REV-01
  createdAt: string;
  summary: QuotationSummary;
}

export interface Quotation {
  id: string;
  quotationNumber: string; // e.g. EST-2026-1042
  revisionCode: string; // e.g. REV-01
  date: string;
  validUntil?: string;
  status: QuotationStatus;
  
  customer: Partial<Customer>;
  projectName: string;
  projectLocation?: string;
  
  items: QuotationItem[];
  additionalCharges: AdditionalCharges;
  discount: DiscountConfig;
  tax: TaxConfig;
  
  summary: QuotationSummary;
  notes?: string;
  terms?: string[];
  termsAndConditions?: string;
  
  createdAt: string;
  updatedAt: string;
}
