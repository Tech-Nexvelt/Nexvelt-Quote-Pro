import { HardwareMasterItem } from '../types/enterprise';

const STORAGE_KEY = 'nexvelt_hardware_master';

export const DEFAULT_HARDWARE: HardwareMasterItem[] = [
  // Premium Tier (Blum & Hettich)
  {
    id: 'hdw-p01',
    code: 'HDW-BLUM-HNG',
    name: 'Blum Clip Top Blumotion 110° Soft-Close Hinge',
    brandTier: 'Premium',
    brand: 'Blum',
    category: 'Concealed Hinge',
    warrantyYears: 25,
    unit: 'Pair',
    purchaseRate: 480,
    clientRate: 650,
    supplier: 'Blum India Flagship',
  },
  {
    id: 'hdw-p02',
    code: 'HDW-HET-TANDEM',
    name: 'Hettich Atira Double-Wall Metal Tandem Drawer Box (45kg)',
    brandTier: 'Premium',
    brand: 'Hettich',
    category: 'Tandem Box',
    warrantyYears: 20,
    unit: 'Set',
    purchaseRate: 3800,
    clientRate: 4800,
    supplier: 'Hettich Official Partner',
  },
  {
    id: 'hdw-p03',
    code: 'HDW-BLUM-AVENTOS',
    name: 'Blum Aventos HF Bi-fold Wall Cabinet Lift Stay System',
    brandTier: 'Premium',
    brand: 'Blum',
    category: 'Lift-Up Stay',
    warrantyYears: 25,
    unit: 'Set',
    purchaseRate: 9800,
    clientRate: 12500,
    supplier: 'Blum India Flagship',
  },

  // Mid Tier (Ebco & Ozone)
  {
    id: 'hdw-m01',
    code: 'HDW-EBC-HNG',
    name: 'Ebco Soft-Close 3D Concealed Hinge',
    brandTier: 'Mid',
    brand: 'Ebco',
    category: 'Concealed Hinge',
    warrantyYears: 10,
    unit: 'Pair',
    purchaseRate: 180,
    clientRate: 260,
    supplier: 'Ebco Hardware Hub',
  },
  {
    id: 'hdw-m02',
    code: 'HDW-EBC-TEL',
    name: 'Ebco Soft-Close Telescopic Drawer Runner 20" (45kg)',
    brandTier: 'Mid',
    brand: 'Ebco',
    category: 'Drawer Channel',
    warrantyYears: 10,
    unit: 'Set',
    purchaseRate: 650,
    clientRate: 920,
    supplier: 'Ebco Hardware Hub',
  },
  {
    id: 'hdw-m03',
    code: 'HDW-OZO-LOCK',
    name: 'Ozone Premium Furniture Cam Lock with Master Key',
    brandTier: 'Mid',
    brand: 'Ozone',
    category: 'Lock',
    warrantyYears: 5,
    unit: 'Piece',
    purchaseRate: 140,
    clientRate: 220,
    supplier: 'Ozone Hardware Dealer',
  },

  // Budget Tier
  {
    id: 'hdw-b01',
    code: 'HDW-LOC-HNG',
    name: 'Harrison / Local SS Soft-Close Hinge 0 Crank',
    brandTier: 'Budget',
    brand: 'Harrison / Local SS',
    category: 'Concealed Hinge',
    warrantyYears: 3,
    unit: 'Pair',
    purchaseRate: 95,
    clientRate: 140,
    supplier: 'City Wholesale Market',
  },
  {
    id: 'hdw-b02',
    code: 'HDW-LOC-TEL',
    name: 'Regular Ball-Bearing Telescopic Channel 18"',
    brandTier: 'Budget',
    brand: 'Local Brand',
    category: 'Drawer Channel',
    warrantyYears: 2,
    unit: 'Set',
    purchaseRate: 280,
    clientRate: 420,
    supplier: 'City Wholesale Market',
  },
];

export function getStoredHardware(): HardwareMasterItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to read hardware master', e);
  }
  return DEFAULT_HARDWARE;
}

export function saveStoredHardware(items: HardwareMasterItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save hardware master', e);
  }
}
