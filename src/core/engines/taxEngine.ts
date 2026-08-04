/**
 * Statutory Tax Engine for Nexvelt Quote Pro
 * Calculates CGST, SGST, IGST, and Total Tax.
 */

export interface TaxConfig {
  enabled: boolean;
  type?: 'gst' | 'igst' | 'vat' | 'none' | string;
  ratePercent?: number;
}

export interface TaxOutput {
  taxableAmount: number;
  totalTax: number;
  cgst: number;
  sgst: number;
  igst: number;
  taxAmount: number;
}

export function calculateTax(taxableAmount: number | { taxableAmount: number; enabled: boolean; ratePercent?: number }, taxConfig?: TaxConfig): TaxOutput {
  let amount = 0;
  let enabled = true;
  let ratePercent = 18;
  let type = 'gst';

  if (typeof taxableAmount === 'object') {
    amount = taxableAmount.taxableAmount || 0;
    enabled = taxableAmount.enabled;
    ratePercent = taxableAmount.ratePercent ?? 18;
  } else {
    amount = taxableAmount || 0;
    if (taxConfig) {
      enabled = taxConfig.enabled;
      ratePercent = taxConfig.ratePercent ?? 18;
      type = taxConfig.type || 'gst';
    }
  }

  if (!enabled || type === 'none') {
    return { taxableAmount: amount, totalTax: 0, cgst: 0, sgst: 0, igst: 0, taxAmount: 0 };
  }

  const totalTax = Math.round(amount * (ratePercent / 100) * 100) / 100;
  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (type === 'igst') {
    igst = totalTax;
  } else {
    cgst = Math.round((totalTax / 2) * 100) / 100;
    sgst = Math.round((totalTax - cgst) * 100) / 100;
  }

  return {
    taxableAmount: amount,
    totalTax,
    cgst,
    sgst,
    igst,
    taxAmount: totalTax,
  };
}
