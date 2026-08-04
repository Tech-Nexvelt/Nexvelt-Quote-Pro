export type PricingModel = 'sqft' | 'running-ft' | 'piece' | 'manual';

export interface PricingConfig {
  model: PricingModel;
  baseRate: number;
  isTaxInclusive?: boolean;
  buyingCost?: number; // Cost Price for Profit Margin calculation
}
