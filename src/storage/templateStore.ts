import { FurnitureTemplate } from '../types/enterprise';

const STORAGE_KEY = 'nexvelt_furniture_templates';

export const DEFAULT_TEMPLATES: FurnitureTemplate[] = [
  {
    id: 'tpl-wardrobe-01',
    name: '3-Door Sliding Wardrobe (Premium HDMR + Acrylic)',
    category: 'Wardrobe',
    isFavorite: true,
    dimensions: { unit: 'ft-in', widthFt: 7, heightFt: 7, depthIn: 24, feet: 7, inches: 0 },
    defaultBoxWork: {
      boxType: 'Wardrobe Box',
      boardType: 'HDMR',
      boardThicknessMm: 18,
      backPanelThicknessMm: 6,
      innerLining: '0.8mm Off-White Fabric Liner',
      edgeBanding: '1mm PVC',
      joinery: 'Cam-Lock Knock-Down',
      unitRate: 480,
    },
    defaultShutters: {
      shutterType: 'Top-Hung Sliding',
      finishType: '2mm Acrylic Sheet',
      coreBoard: '18mm HDMR',
      edgeFinish: '2mm 3D Acrylic Edge',
      handleType: 'G-Profile Alum',
      grainContinuityRequired: true,
      unitRate: 650,
    },
    defaultHardware: [
      { id: 'th1', name: 'Top-Hung Sliding Track System (Soft-Close)', category: 'Sliding Fitting', brandTier: 'Premium', brand: 'Hettich TopLine XL', quantity: 1, unitPrice: 8500, totalAmount: 8500 },
      { id: 'th2', name: 'Anti-Warp Door Tensioner Rods', category: 'Sliding Fitting', brandTier: 'Premium', brand: 'Hettich', quantity: 3, unitPrice: 1200, totalAmount: 3600 },
    ],
    defaultLabour: [
      { id: 'tl1', trade: 'Main Carpenter', billingMode: 'Per Sq.Ft', rate: 380, quantity: 49, totalAmount: 18620 },
      { id: 'tl2', trade: 'Site Installer', billingMode: 'Per Sq.Ft', rate: 65, quantity: 49, totalAmount: 3185 },
    ],
  },
  {
    id: 'tpl-kitchen-base',
    name: 'L-Shape Kitchen Base Modules (BWP Marine Ply)',
    category: 'Kitchen',
    isFavorite: true,
    dimensions: { unit: 'ft-in', widthFt: 12, heightFt: 2.75, depthIn: 24, feet: 12, inches: 0 },
    defaultBoxWork: {
      boxType: 'Kitchen Base Box',
      boardType: 'BWP Plywood (IS:710)',
      boardThicknessMm: 18,
      backPanelThicknessMm: 6,
      innerLining: '0.8mm Off-White Fabric Liner',
      edgeBanding: '1mm PVC',
      joinery: 'Pocket Screws',
      unitRate: 580,
    },
    defaultShutters: {
      shutterType: 'Openable / Hinged',
      finishType: '1mm Laminate',
      coreBoard: '18mm BWR Plywood',
      edgeFinish: '2mm PVC Edge Band',
      handleType: 'Concealed J-Pull',
      grainContinuityRequired: false,
      unitRate: 420,
    },
    defaultHardware: [
      { id: 'kh1', name: 'Blum Clip Top Soft-Close Hinges', category: 'Concealed Hinge', brandTier: 'Premium', brand: 'Blum', quantity: 8, unitPrice: 650, totalAmount: 5200 },
      { id: 'kh2', name: 'Tandem Box Metal Drawer System', category: 'Tandem Box', brandTier: 'Premium', brand: 'Hettich', quantity: 3, unitPrice: 4800, totalAmount: 14400 },
    ],
    defaultLabour: [
      { id: 'kl1', trade: 'Main Carpenter', billingMode: 'Per Sq.Ft', rate: 420, quantity: 33, totalAmount: 13860 },
    ],
  },
  {
    id: 'tpl-tv-unit',
    name: 'Modern Floating TV Console & Louvered Wall Panel',
    category: 'TV Unit',
    isFavorite: true,
    dimensions: { unit: 'ft-in', widthFt: 8, heightFt: 6.5, depthIn: 16, feet: 8, inches: 0 },
    defaultBoxWork: {
      boxType: 'TV Unit Box',
      boardType: 'HDMR',
      boardThicknessMm: 18,
      backPanelThicknessMm: 6,
      innerLining: '0.8mm Off-White Fabric Liner',
      edgeBanding: '1mm PVC',
      joinery: 'Dado Joint',
      unitRate: 450,
    },
    defaultShutters: {
      shutterType: 'Flap-Up Lift',
      finishType: 'PU Paint / Lacquer',
      coreBoard: '18mm HDMR',
      edgeFinish: 'Seamless Painted Chamfer',
      handleType: 'Tip-On Push Latch',
      grainContinuityRequired: false,
      unitRate: 780,
    },
    defaultHardware: [
      { id: 'tvh1', name: 'Gas Lift Stays 100N', category: 'Lift-Up Stay', brandTier: 'Mid', brand: 'Ebco', quantity: 2, unitPrice: 450, totalAmount: 900 },
      { id: 'tvh2', name: 'Push Latches', category: 'Catch / Latch', brandTier: 'Mid', brand: 'Ebco', quantity: 3, unitPrice: 180, totalAmount: 540 },
    ],
    defaultLabour: [
      { id: 'tvl1', trade: 'Main Carpenter', billingMode: 'Per Sq.Ft', rate: 400, quantity: 52, totalAmount: 20800 },
      { id: 'tvl2', trade: 'Polisher / Painter', billingMode: 'Per Sq.Ft', rate: 250, quantity: 52, totalAmount: 13000 },
    ],
  },
  {
    id: 'tpl-study-table',
    name: 'Executive Home Study Desk with Drawer Pedestal',
    category: 'Study Table',
    isFavorite: false,
    dimensions: { unit: 'ft-in', widthFt: 5, heightFt: 2.5, depthIn: 24, feet: 5, inches: 0 },
    defaultBoxWork: {
      boxType: 'Study Table Box',
      boardType: 'BWR Plywood (IS:303)',
      boardThicknessMm: 18,
      backPanelThicknessMm: 6,
      innerLining: '0.8mm Off-White Fabric Liner',
      edgeBanding: '1mm PVC',
      joinery: 'Dado Joint',
      unitRate: 420,
    },
    defaultShutters: {
      shutterType: 'Openable / Hinged',
      finishType: '1mm Laminate',
      coreBoard: '18mm BWR Plywood',
      edgeFinish: '2mm PVC Edge Band',
      handleType: 'Edge Profile Handle',
      grainContinuityRequired: false,
      unitRate: 380,
    },
    defaultHardware: [
      { id: 'sth1', name: 'Ebco Soft-Close Telescopic Runners 18"', category: 'Drawer Channel', brandTier: 'Mid', brand: 'Ebco', quantity: 3, unitPrice: 920, totalAmount: 2760 },
    ],
    defaultLabour: [
      { id: 'stl1', trade: 'Main Carpenter', billingMode: 'Lump Sum', rate: 3500, quantity: 1, totalAmount: 3500 },
    ],
  },
];

export function getStoredTemplates(): FurnitureTemplate[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to read templates store', e);
  }
  return DEFAULT_TEMPLATES;
}

export function saveStoredTemplates(templates: FurnitureTemplate[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  } catch (e) {
    console.error('Failed to save templates store', e);
  }
}
