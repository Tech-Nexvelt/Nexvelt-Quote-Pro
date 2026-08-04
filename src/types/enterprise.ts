import { Customer } from './customer';
import { UnitSystem, DimensionsInput } from './units';
import { TaxConfig, DiscountConfig, AdditionalCharges } from './quotation';

export type UserMode = 'staff' | 'owner';

export type WorkflowStage = 
  | 'draft'
  | 'sent'
  | 'review'
  | 'approved'
  | 'advance_received'
  | 'production'
  | 'installation'
  | 'completed'
  | 'archived';

export type WorkCategoryType = 
  | 'box_work'
  | 'frame_work'
  | 'shutters'
  | 'wall_panelling'
  | 'hardware'
  | 'accessories'
  | 'consumables'
  | 'labour';

export type PricingModelType = 
  | 'per_sqft'
  | 'running_ft'
  | 'per_sheet'
  | 'per_unit'
  | 'per_module'
  | 'labour_based'
  | 'material_plus_labour'
  | 'custom_formula';

export interface PricingProfile {
  id: string;
  name: string;
  type: PricingModelType;
  baseRate: number;
  yieldFactor?: number; // Default 0.80 (80% yield, 20% waste)
  grainContinuityMultiplier?: number; // 1.30 (30% waste)
  overheadPercent?: number; // 12%
  profitPercent?: number; // 20%
}

// 1. Box Work Specification
export interface BoxWorkSpec {
  id: string;
  boxType: 'Wardrobe Box' | 'Kitchen Base Box' | 'Kitchen Wall Box' | 'Loft Box' | 'TV Unit Box' | 'Bookshelf Box' | 'Study Table Box' | 'Storage Box' | 'Drawer Unit' | 'Crockery Unit';
  boardType: 'BWP Plywood (IS:710)' | 'BWR Plywood (IS:303)' | 'Commercial Plywood' | 'HDMR' | 'MDF' | 'Particle Board' | 'Blockboard';
  boardThicknessMm: 18 | 16 | 12 | 25;
  backPanelThicknessMm: 6 | 9 | 12;
  innerLining: '0.8mm Off-White Fabric Liner' | '0.7mm Off-White Liner' | 'PU Lacquer Coat' | 'Balancer Sheet';
  edgeBanding: '0.8mm PVC' | '1mm PVC' | '2mm PVC';
  joinery: 'Dado Joint' | 'Screwed & Dowelled' | 'Cam-Lock Knock-Down' | 'Pocket Screws';
  unitRate: number;
}

// 2. Frame Work Specification
export interface FrameWorkSpec {
  id: string;
  supportType: 'Hardwood Battens' | 'Aluminium Section' | 'MS Square Tube' | 'Marine Ply Ribs';
  skirtingHeightIn: number;
  fixedShelfCount: number;
  adjustableShelfCount: number;
  partitionCount: number;
  unitRate: number;
}

// 3. Shutter Specification
export interface ShutterSpec {
  id: string;
  shutterType: 'Openable / Hinged' | 'Top-Hung Sliding' | 'Bottom-Roller Sliding' | 'In-Line Coplanar' | 'Flap-Up Lift' | 'Pocket Door';
  finishType: '1mm Laminate' | '2mm Acrylic Sheet' | 'Fluted CNC Louver' | 'Membrane Vacuum Wrapped' | 'PU Paint / Lacquer' | 'Natural Veneer + PU' | 'Tinted Glass in Alum Profile';
  coreBoard: '18mm HDMR' | '18mm BWR Plywood' | '18mm MDF' | 'Aluminium Profile';
  edgeFinish: '2mm PVC Edge Band' | '2mm 3D Acrylic Edge' | 'Seamless Painted Chamfer' | 'Solid Wood Beading';
  handleType: 'G-Profile Alum' | 'Concealed J-Pull' | 'Edge Profile Handle' | 'Brass Knob / Pull' | 'Tip-On Push Latch';
  grainContinuityRequired: boolean;
  unitRate: number;
}

// 4. Wall Panelling Specification
export interface WallPanellingSpec {
  id: string;
  applicationZone: 'Bedroom Accent' | 'Living Room TV Wall' | 'Dining Feature' | 'Office / Reception';
  substrate: '9mm Plywood Grid' | '12mm Plywood Grid' | 'WPC Backer Board';
  claddingMaterial: '1mm Laminate' | 'Fluted Louver Panel' | 'Charcoal Panel' | 'Natural Veneer + PU' | 'Acoustic Fabric Pad' | 'Wallpaper Base';
  trimProfiles: 'Brass T-Inlay' | 'SS Black Chrome Strip' | 'Alum LED Channel' | 'None';
  unitRate: number;
}

// 5. Hardware Item Specification
export interface HardwareSpec {
  id: string;
  masterHardwareId?: string;
  category: 'Concealed Hinge' | 'Drawer Channel' | 'Tandem Box' | 'Lock' | 'Lift-Up Stay' | 'Sliding Fitting' | 'Catch / Latch' | 'Handle';
  brandTier: 'Premium' | 'Mid' | 'Budget';
  brand: string; // Blum, Hettich, Ebco, Ozone, Local
  name: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}

// 6. Accessory Specification
export interface AccessorySpec {
  id: string;
  name: string; // Trouser Rack, Cutlery Tray, Magic Corner, LED COB Strip, etc.
  category: 'Wardrobe Fitting' | 'Kitchen Organizer' | 'Illumination' | 'Glass & Mirrors';
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}

// 7. Consumable Specification
export interface ConsumableSpec {
  id: string;
  item: string; // Screws, Edge band tape, Fevicol SH, Silicone, Wood filler, Sandpaper
  quantity: number;
  unit: 'Box' | 'Meter' | 'Kg' | 'Liter' | 'Tube' | 'Packet' | 'Sheet';
  unitRate: number;
  totalAmount: number;
}

// 8. Labour Specification
export interface LabourSpec {
  id: string;
  trade: 'Main Carpenter' | 'Helper Carpenter' | 'Polisher / Painter' | 'Site Installer' | 'Freight / Logistics' | 'Loading & Unloading';
  billingMode: 'Per Sq.Ft' | 'Daily Wage' | 'Lump Sum';
  rate: number;
  quantity: number; // Days or Sq.Ft or Trips
  totalAmount: number;
}

export interface LineItemCalculation {
  netAreaSqFt: number;
  runningLengthFt: number;
  grossSheetsNeeded: number;
  boxWorkCost: number;
  frameWorkCost: number;
  shuttersCost: number;
  panellingCost: number;
  hardwareTotal: number;
  accessoriesTotal: number;
  consumablesTotal: number;
  labourTotal: number;
  directMaterialCost: number;
  overheadAmount: number;
  profitAmount: number;
  lineSubtotal: number;
  sellingPrice: number;
}

export interface WorkItem {
  id: string;
  roomId: string;
  name: string; // e.g. "Main Wardrobe", "TV Unit"
  category: 'Wardrobe' | 'Kitchen' | 'TV Unit' | 'Crockery' | 'Pooja' | 'Study' | 'Loft' | 'Wall Panelling' | 'Custom';
  dimensions: DimensionsInput;
  heightFt: number;
  widthFt: number;
  depthIn: number;
  quantity: number;
  pricingProfileId: string;
  
  boxWork?: BoxWorkSpec;
  frameWork?: FrameWorkSpec;
  shutters?: ShutterSpec;
  wallPanelling?: WallPanellingSpec;
  hardware: HardwareSpec[];
  accessories: AccessorySpec[];
  consumables: ConsumableSpec[];
  labour: LabourSpec[];
  
  calculations: LineItemCalculation;
  notes?: string;
}

export interface RoomCostSummary {
  materialsCost: number;
  hardwareCost: number;
  labourCost: number;
  consumablesCost: number;
  subtotal: number;
}

export interface RoomZone {
  id: string;
  name: string; // Master Bedroom, Living Room, Kitchen, etc.
  floor?: string;
  items: WorkItem[];
  summary: RoomCostSummary;
}

export interface QuotationRevision {
  revisionCode: string; // e.g. REV-01, REV-02
  createdAt: string;
  notes: string;
  author: string;
  snapshotData: {
    rooms: RoomZone[];
    additionalCharges: AdditionalCharges;
    discount: DiscountConfig;
    tax: TaxConfig;
    grandTotal: number;
  };
}

export interface ProjectEntity {
  id: string;
  projectCode: string; // e.g. PRJ-2026-108
  title: string; // Modern Villa Interior
  customer: Partial<Customer>;
  location?: string;
  workflowStage: WorkflowStage;
  stageTimestamps: Partial<Record<WorkflowStage, string>>;
  currentRevisionCode: string;
  revisions: QuotationRevision[];
  rooms: RoomZone[];
  additionalCharges: AdditionalCharges;
  discount: DiscountConfig;
  tax: TaxConfig;
  grandTotal: number;
  createdAt: string;
  updatedAt: string;
}

// Master Catalogues
export interface MaterialMasterItem {
  id: string;
  code: string;
  name: string;
  category: 'Plywood' | 'HDMR' | 'MDF' | 'Laminate' | 'Veneer' | 'Acrylic' | 'EdgeBand' | 'Adhesive';
  brand: string;
  thicknessMm?: number;
  unit: 'Sheet' | 'Sq.Ft' | 'Meter' | 'Kg' | 'Liter';
  purchaseRate: number;
  clientRate: number;
  gstPercent: number;
  preferredVendor: string;
  status: 'active' | 'discontinued';
}

export interface HardwareMasterItem {
  id: string;
  code: string;
  name: string;
  brandTier: 'Premium' | 'Mid' | 'Budget';
  brand: string; // Blum, Hettich, Ebco, Ozone, etc.
  category: 'Concealed Hinge' | 'Drawer Channel' | 'Tandem Box' | 'Lock' | 'Lift-Up Stay' | 'Sliding Fitting' | 'Catch / Latch' | 'Handle';
  warrantyYears: number;
  unit: 'Piece' | 'Pair' | 'Set' | 'Meter';
  purchaseRate: number;
  clientRate: number;
  supplier: string;
}

export interface FurnitureTemplate {
  id: string;
  name: string; // e.g. "3-Door Sliding Wardrobe - Premium"
  category: 'Wardrobe' | 'Kitchen' | 'TV Unit' | 'Study Table' | 'Reception' | 'Office Furniture';
  isFavorite: boolean;
  dimensions: DimensionsInput;
  defaultBoxWork?: Partial<BoxWorkSpec>;
  defaultShutters?: Partial<ShutterSpec>;
  defaultHardware: HardwareSpec[];
  defaultLabour: LabourSpec[];
}

export interface PurchaseRequisition {
  id: string;
  projectId: string;
  projectTitle: string;
  generatedAt: string;
  sheetMaterials: { name: string; sheetsToOrder: number; vendor: string; estCost: number }[];
  hardwareItems: { code: string; name: string; quantity: number; unit: string; vendor: string; estCost: number }[];
  edgeBandingMeters: { spec: string; totalMeters: number; estCost: number }[];
  consumablesKit: { item: string; quantity: number; unit: string; estCost: number }[];
  totalPurchaseCost: number;
}

export interface WorkshopKPIs {
  todaysActiveJobs: number;
  pendingQuotations: number;
  projectsInProduction: number;
  upcomingInstallations: number;
  monthlyRevenue: number;
  conversionRatePercent: number;
}
