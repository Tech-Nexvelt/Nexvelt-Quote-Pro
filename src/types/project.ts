import { UnitSystem, DimensionsInput } from './units';
import { PricingModel } from './pricing';
import { Customer } from './customer';
import { QuotationSummary, AdditionalCharges, DiscountConfig, TaxConfig } from './quotation';

export type CADViewMode = 'front' | 'side' | 'top' | 'isometric' | 'section';

export interface VisualizerState {
  viewMode: CADViewMode;
  zoomLevel: number;
  panX: number;
  panY: number;
  showDimensions: boolean;
  showHandles: boolean;
  showTextureOverlay: boolean;
}

export interface ProductObject {
  id: string;
  roomId: string;
  templateId?: string;
  category: string; // Wardrobe, Kitchen, TV Unit, Crockery, Pooja, Study, Loft, Custom
  name: string;
  previewImage?: string; // e.g. /furniture/wardrobe_2door.png
  
  // Dimensions Value Object
  dimensions: DimensionsInput;
  heightFt: number;
  widthFt: number;
  depthIn: number;
  areaSqFt: number;
  runningLengthFt: number;

  // Materials & Hardware Value Objects
  carcassMaterialId?: string;
  carcassMaterialName?: string;
  carcassRateAddon?: number;
  shutterMaterialId?: string;
  shutterMaterialName?: string;
  shutterRateAddon?: number;
  hardwareOptionId?: string;
  hardwarePackageName?: string;
  hardwareCostAddon?: number;

  // Pricing & Profit
  pricingModel: PricingModel;
  baseRate: number;
  quantity: number;
  buyingCostPerUnit?: number;
  
  notes?: string;
  visualizerState?: Partial<VisualizerState>;

  // Calculated Line Totals
  effectiveRatePerUnit: number;
  lineSubtotal: number;
  lineCostSubtotal: number;
}

export interface RoomEntity {
  id: string;
  name: string; // Master Bedroom, Living Room, Kitchen, Pooja Room, Kids Bedroom, etc.
  floor?: string;
  ceilingHeightFt?: number;
  wallLengthFt?: number;
  notes?: string;
  productIds: string[];
}

export interface ProjectAggregate {
  id: string;
  title: string;
  quotationNumber: string; // EST-2026-1286
  revisionCode?: string;
  date?: string;
  workflowStage?: string;
  stageTimestamps?: any;
  currentRevisionCode?: string;
  grandTotal?: number;
  projectCode?: string;
  revisions?: any[];
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'archived';
  
  customer: Partial<Customer>;
  projectLocation?: string;
  
  rooms: RoomEntity[];
  products: ProductObject[];
  
  additionalCharges: AdditionalCharges;
  discount: DiscountConfig;
  tax: TaxConfig;
  
  summary: QuotationSummary;
  createdAt: string;
  updatedAt: string;
}

export type CommercialProject = ProjectAggregate;
