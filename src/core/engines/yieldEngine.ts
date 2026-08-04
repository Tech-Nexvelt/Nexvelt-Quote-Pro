/**
 * Yield Engine for Nexvelt Quote Pro (10/10 Edition)
 * Computes raw sheet stock consumption (8x4 ft = 32 sqft), wastage factors,
 * grain continuity multipliers, and total edge-banding running meters.
 */

export interface YieldCalculationInput {
  netAreaSqFt: number;
  heightFt: number;
  widthFt: number;
  depthIn?: number;
  sheetSizeSqFt?: number; // Default 32 (8x4)
  isGrainContinuityRequired?: boolean;
}

export interface YieldCalculationOutput {
  netAreaSqFt: number;
  yieldFactor: number;
  grossAreaSqFt: number;
  sheetsNeeded: number;
  edgeBandMeters1mm: number;
  edgeBandMeters2mm: number;
}

export function calculateSheetYield(input: YieldCalculationInput): YieldCalculationOutput {
  const netArea = Math.max(0, input.netAreaSqFt || 0);
  const sheetArea = Math.max(1, input.sheetSizeSqFt || 32);
  
  // Yield Factor: 0.80 (20% standard wastage) vs 0.70 (30% grain continuous wastage)
  const yieldFactor = input.isGrainContinuityRequired ? 0.70 : 0.80;
  
  const grossAreaSqFt = parseFloat((netArea / yieldFactor).toFixed(2));
  const sheetsNeeded = Math.ceil(grossAreaSqFt / sheetArea);

  // Edge Banding Calculation: Perimeter = 2 * (Height + Width) in meters
  // Convert Ft to Meters: 1 Ft = 0.3048 Meters
  const heightMeters = (input.heightFt || 0) * 0.3048;
  const widthMeters = (input.widthFt || 0) * 0.3048;
  
  // Carcass interior edges (1mm PVC) vs Visible Shutter edges (2mm PVC)
  const perimeterPerPanelMeters = (heightMeters + widthMeters) * 2;
  const edgeBandMeters1mm = parseFloat((perimeterPerPanelMeters * 3.5).toFixed(1)); // Front & shelf edges
  const edgeBandMeters2mm = parseFloat((perimeterPerPanelMeters * 1.5).toFixed(1)); // Shutter door perimeter

  return {
    netAreaSqFt: netArea,
    yieldFactor,
    grossAreaSqFt,
    sheetsNeeded,
    edgeBandMeters1mm,
    edgeBandMeters2mm,
  };
}
