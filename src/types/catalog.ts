export interface MaterialOption {
  id: string;
  name: string;
  type: 'carcass' | 'shutter' | 'both';
  category: string; // Laminate, PVC, Acrylic, Veneer, PU, Glass, Solid Wood, Membrane
  brand?: string;
  thicknessMm?: number;
  finish?: string; // Gloss, Matte, Suede, Textured
  rateModifierSqFt: number; // Additional rate per sq.ft (+/- ₹)
}

export interface HardwareOption {
  id: string;
  name: string;
  brand: string; // Hettich, Hafele, Ebco, Godrej, Local
  description?: string;
  packagePricePerUnit: number; // Flat add-on cost per product line
}

export interface ProductCategoryPreset {
  id: string;
  category: string; // Wardrobe, Cupboard, TV Unit, Kitchen, Crockery Unit, Loft, Pooja Unit, Study Unit, Office Furniture, Custom
  defaultName: string;
  defaultPricingModel: 'sqft' | 'running-ft' | 'piece' | 'manual';
  defaultRate: number;
  defaultDepthInches: number;
  carcassMaterialId?: string;
  shutterMaterialId?: string;
  hardwareOptionId?: string;
}
