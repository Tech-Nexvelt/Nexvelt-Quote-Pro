export type UnitSystem = 'ft-in' | 'dec-ft' | 'inches' | 'mm' | 'cm' | 'meters';

export interface DimensionsInput {
  unit: UnitSystem;
  unitSystem?: UnitSystem;
  // For 'ft-in' mode
  feet?: number;
  inches?: number;
  widthFt?: number;
  heightFt?: number;
  depthIn?: number;
  // For single-number modes
  decimalFeet?: number;
  totalInches?: number;
  mm?: number;
  cm?: number;
  meters?: number;
  // Depth in inches (standard interior representation)
  depthInches?: number;
}

export interface StandardDimensions {
  heightFt: number;
  widthFt: number;
  depthIn: number;
  areaSqFt: number;
  runningLengthFt: number;
  displayFormatted: string;
}
