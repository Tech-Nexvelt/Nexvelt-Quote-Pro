/**
 * Measurement Engine for Nexvelt Quote Pro
 * Handles unit conversion, area calculation, volume calculation, and category-specific measurement formulas.
 */

export type MeasurementUnit = 'mm' | 'cm' | 'm' | 'inch' | 'ft';

export interface MeasurementInput {
  heightFt: number;
  widthFt: number;
  depthIn: number;
}

export interface MeasurementOutput {
  heightFeet: number;
  widthFeet: number;
  depthInches: number;
  areaSqFt: number;
}

export function calculateMeasurements(input: MeasurementInput): MeasurementOutput {
  const heightFeet = Math.max(0.1, input.heightFt || 0);
  const widthFeet = Math.max(0.1, input.widthFt || 0);
  const depthInches = Math.max(0, input.depthIn || 0);
  const areaSqFt = parseFloat((heightFeet * widthFeet).toFixed(2));
  return {
    heightFeet,
    widthFeet,
    depthInches,
    areaSqFt,
  };
}

export function calculateItemDimensions(
  unitOrObj: any,
  heightFtVal?: number,
  heightInVal?: number,
  widthFtVal?: number,
  widthInVal?: number,
  depthInVal?: number
): { areaSqFt: number; runningLengthFt: number; heightFt: number; widthFt: number; depthIn: number } {
  if (typeof unitOrObj === 'object' && unitOrObj !== null) {
    const feet = unitOrObj.feet || 0;
    const inches = unitOrObj.inches || 0;
    const totalFeet = feet + inches / 12;
    return {
      areaSqFt: parseFloat((totalFeet * 7).toFixed(2)),
      runningLengthFt: totalFeet,
      heightFt: 7,
      widthFt: totalFeet,
      depthIn: unitOrObj.depthInches || 24,
    };
  }

  const unit = (typeof unitOrObj === 'string' ? unitOrObj : 'ft-in') as MeasurementUnit | string;
  const hFt = (heightFtVal || 0) + (heightInVal || 0) / 12;
  const wFt = (widthFtVal || 0) + (widthInVal || 0) / 12;
  const dIn = depthInVal || 24;

  let areaSqFt = 0;
  if (unit === 'mm') {
    const hM = convertToFeet(heightFtVal || 0, 'mm');
    const wM = convertToFeet(widthFtVal || 0, 'mm');
    areaSqFt = parseFloat((hM * wM).toFixed(2));
  } else {
    areaSqFt = parseFloat((hFt * wFt).toFixed(2));
  }

  return {
    areaSqFt,
    runningLengthFt: wFt,
    heightFt: hFt,
    widthFt: wFt,
    depthIn: dIn,
  };
}

/**
 * Converts any length measurement to Feet (ft)
 */
export function convertToFeet(value: number, unit: MeasurementUnit | string = 'mm'): number {
  if (!value || value <= 0) return 0;
  switch (unit) {
    case 'mm':
      return value / 304.8;
    case 'cm':
      return value / 30.48;
    case 'm':
      return value * 3.28084;
    case 'inch':
      return value / 12;
    case 'ft':
    default:
      return value;
  }
}

/**
 * Converts any length measurement to Millimeters (mm)
 */
export function convertToMM(value: number, unit: MeasurementUnit | string = 'ft'): number {
  if (!value || value <= 0) return 0;
  switch (unit) {
    case 'ft':
      return value * 304.8;
    case 'inch':
      return value * 25.4;
    case 'cm':
      return value * 10;
    case 'm':
      return value * 1000;
    case 'mm':
    default:
      return value;
  }
}

// 1. BOX WORK: Width × Height -> Area (Sq.Ft)
export function calculateBoxWorkArea(width: number, height: number, unit: MeasurementUnit | string = 'mm'): number {
  const wFt = convertToFeet(width, unit as MeasurementUnit);
  const hFt = convertToFeet(height, unit as MeasurementUnit);
  return parseFloat((wFt * hFt).toFixed(2));
}

// 2. FRAME WORK: Width × Height × Depth -> Area (Sq.Ft) & Volume (Cu.Ft)
export function calculateFrameWorkArea(
  width: number,
  height: number,
  depth: number,
  unit: MeasurementUnit | string = 'mm'
): { areaSqFt: number; volumeCuFt: number } {
  const wFt = convertToFeet(width, unit as MeasurementUnit);
  const hFt = convertToFeet(height, unit as MeasurementUnit);
  const dFt = convertToFeet(depth, unit as MeasurementUnit);
  return {
    areaSqFt: parseFloat((wFt * hFt).toFixed(2)),
    volumeCuFt: parseFloat((wFt * hFt * dFt).toFixed(2)),
  };
}

// 3. SHUTTERS: Width × Height -> Area (Sq.Ft)
export function calculateShutterArea(width: number, height: number, unit: MeasurementUnit | string = 'mm'): number {
  const wFt = convertToFeet(width, unit as MeasurementUnit);
  const hFt = convertToFeet(height, unit as MeasurementUnit);
  return parseFloat((wFt * hFt).toFixed(2));
}

// 4. WALL PANELLING: Length × Height -> Area (Sq.Ft)
export function calculatePanellingArea(length: number, height: number, unit: MeasurementUnit | string = 'mm'): number {
  const lFt = convertToFeet(length, unit as MeasurementUnit);
  const hFt = convertToFeet(height, unit as MeasurementUnit);
  return parseFloat((lFt * hFt).toFixed(2));
}

// 5. COUNTERTOPS: Length × Width -> Area (Sq.Ft)
export function calculateCountertopArea(length: number, width: number, unit: MeasurementUnit | string = 'mm'): number {
  const lFt = convertToFeet(length, unit as MeasurementUnit);
  const wFt = convertToFeet(width, unit as MeasurementUnit);
  return parseFloat((lFt * wFt).toFixed(2));
}

export function validateDimensions(width: number, height: number): { isValid: boolean; error?: string } {
  if (width <= 0) return { isValid: false, error: 'Width must be greater than 0.' };
  if (height <= 0) return { isValid: false, error: 'Height must be greater than 0.' };
  return { isValid: true };
}
