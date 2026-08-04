import { MaterialMasterItem } from '../types/enterprise';

const STORAGE_KEY = 'nexvelt_material_master';

export const DEFAULT_MATERIALS: MaterialMasterItem[] = [
  {
    id: 'mat-01',
    code: 'MAT-PLY-710-18',
    name: 'Greenply Club International BWP 18mm',
    category: 'Plywood',
    brand: 'Greenply',
    thicknessMm: 18,
    unit: 'Sheet',
    purchaseRate: 2450,
    clientRate: 2900,
    gstPercent: 18,
    preferredVendor: 'Greenply Regional Depot',
    status: 'active',
  },
  {
    id: 'mat-02',
    code: 'MAT-HDMR-18',
    name: 'Century Prowud Action TESA HDMR 18mm',
    category: 'HDMR',
    brand: 'Century / Action TESA',
    thicknessMm: 18,
    unit: 'Sheet',
    purchaseRate: 1850,
    clientRate: 2200,
    gstPercent: 18,
    preferredVendor: 'CenturyPly Official Dealer',
    status: 'active',
  },
  {
    id: 'mat-03',
    code: 'MAT-LAM-1MM',
    name: 'Merino / Royal Touch 1mm Suede Laminate',
    category: 'Laminate',
    brand: 'Merino',
    thicknessMm: 1,
    unit: 'Sheet',
    purchaseRate: 1100,
    clientRate: 1450,
    gstPercent: 18,
    preferredVendor: 'Merino Laminate Hub',
    status: 'active',
  },
  {
    id: 'mat-04',
    code: 'MAT-EB-2MM',
    name: 'Rehau 2mm PVC Edge Banding Roll (50m)',
    category: 'EdgeBand',
    brand: 'Rehau',
    thicknessMm: 2,
    unit: 'Meter',
    purchaseRate: 22,
    clientRate: 32,
    gstPercent: 18,
    preferredVendor: 'Rehau India Distributor',
    status: 'active',
  },
  {
    id: 'mat-05',
    code: 'MAT-ADH-FEV-10',
    name: 'Fevicol SH Synthetic Resin Adhesive (10kg Bucket)',
    category: 'Adhesive',
    brand: 'Pidilite Fevicol',
    unit: 'Kg',
    purchaseRate: 240,
    clientRate: 280,
    gstPercent: 18,
    preferredVendor: 'Pidilite Direct',
    status: 'active',
  },
];

export function getStoredMaterials(): MaterialMasterItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to read material master', e);
  }
  return DEFAULT_MATERIALS;
}

export function saveStoredMaterials(materials: MaterialMasterItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(materials));
  } catch (e) {
    console.error('Failed to save material master', e);
  }
}
