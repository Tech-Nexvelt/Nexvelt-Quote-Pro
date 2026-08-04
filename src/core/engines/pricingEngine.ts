/**
 * Pricing Engine for Nexvelt Quote Pro
 * Handles Master Rate Library defaults, custom rate overrides, and multi-model pricing calculations.
 */

import { LocalStorageAdapter } from '@/storage/localStorageAdapter';

export type PricingMethod = 'per_sqft' | 'running_ft' | 'per_sheet' | 'per_unit' | 'lump_sum';

export interface PricingInput {
  areaSqFt: number;
  baseRate: number;
  quantity: number;
}

export interface PricingOutput {
  amount: number;
}

export function calculateLineAmount(input: PricingInput): PricingOutput {
  const area = Math.max(0, input.areaSqFt || 0);
  const rate = Math.max(0, input.baseRate || 0);
  const qty = Math.max(1, input.quantity || 1);
  return { amount: parseFloat((area * rate * qty).toFixed(2)) };
}

export interface MasterRateItem {
  id: string;
  category: string;
  materialName: string;
  defaultRatePerSqFt: number;
  unit: string;
}

const MASTER_RATES_KEY = 'nexvelt_master_rate_library';

export const DEFAULT_MASTER_RATES: MasterRateItem[] = [
  { id: 'mr-1', category: 'Box Work', materialName: '18mm HDMR Water Resistant Board', defaultRatePerSqFt: 950, unit: 'sq.ft' },
  { id: 'mr-2', category: 'Box Work', materialName: '18mm IS:710 Marine Plywood', defaultRatePerSqFt: 1250, unit: 'sq.ft' },
  { id: 'mr-3', category: 'Shutters', materialName: '1mm Premium Laminate Finish', defaultRatePerSqFt: 450, unit: 'sq.ft' },
  { id: 'mr-4', category: 'Shutters', materialName: '2mm High Gloss Acrylic Finish', defaultRatePerSqFt: 750, unit: 'sq.ft' },
  { id: 'mr-5', category: 'Shutters', materialName: 'PU Paint Gloss Finish', defaultRatePerSqFt: 950, unit: 'sq.ft' },
  { id: 'mr-6', category: 'Wall Panelling', materialName: 'Fluted Charcoal Panel', defaultRatePerSqFt: 650, unit: 'sq.ft' },
  { id: 'mr-7', category: 'Countertops', materialName: 'Quartz Stone Countertop', defaultRatePerSqFt: 1100, unit: 'sq.ft' },
  { id: 'mr-8', category: 'Labour', materialName: 'Carpenter & helper Installation', defaultRatePerSqFt: 180, unit: 'sq.ft' },
];

export function getMasterRateLibrary(): MasterRateItem[] {
  return LocalStorageAdapter.getItem<MasterRateItem[]>(MASTER_RATES_KEY, DEFAULT_MASTER_RATES);
}

export function saveMasterRateLibrary(rates: MasterRateItem[]): void {
  LocalStorageAdapter.setItem(MASTER_RATES_KEY, rates);
}

export function getDefaultRateForCategory(category?: string, materialName?: string): number {
  const catSafe = (category || '').toLowerCase();
  const matSafe = (materialName || '').toLowerCase();

  const library = getMasterRateLibrary();
  const found = library.find(
    (r) => (r.category || '').toLowerCase() === catSafe && (!matSafe || (r.materialName || '').toLowerCase().includes(matSafe))
  );
  if (found) return found.defaultRatePerSqFt;

  switch (catSafe) {
    case 'box work':
    case 'modular furniture':
      return 950;
    case 'wardrobes':
      return 1450;
    case 'kitchen':
      return 1550;
    case 'tv units':
    case 'tv unit':
      return 1350;
    case 'shutters':
      return 450;
    case 'wall panelling':
      return 650;
    case 'countertops':
      return 1100;
    case 'labour':
      return 180;
    default:
      return 1000;
  }
}

export interface CalculateLineItemInput {
  areaSqFt: number;
  rate: number;
  quantity: number;
  pricingMethod?: PricingMethod;
  runningLengthFt?: number;
}

export function calculateLineItemAmount(input: CalculateLineItemInput): number {
  const area = Math.max(0, input.areaSqFt || 0);
  const rate = Math.max(0, input.rate || 0);
  const qty = Math.max(1, input.quantity || 1);

  switch (input.pricingMethod) {
    case 'running_ft':
      return parseFloat(((input.runningLengthFt || 0) * rate * qty).toFixed(2));
    case 'per_unit':
    case 'lump_sum':
      return parseFloat((rate * qty).toFixed(2));
    case 'per_sqft':
    default:
      return parseFloat((area * rate * qty).toFixed(2));
  }
}
