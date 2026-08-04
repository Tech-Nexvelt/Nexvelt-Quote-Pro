/**
 * Bill of Materials (BOM) Engine for Nexvelt Quote Pro (10/10 Edition)
 * Converts high-level room items and work categories into detailed workshop cut lists,
 * panel sheet breakdowns, edge-band lengths, hardware quantities, and site kits.
 */

import { WorkItem, RoomZone } from '../../types/enterprise';
import { calculateSheetYield } from './yieldEngine';

export interface BOMLineItem {
  id: string;
  category: 'Carcass Board' | 'Back Panel' | 'Shutter Material' | 'Edge Banding' | 'Hardware' | 'Accessory' | 'Consumable';
  description: string;
  specifications: string;
  quantity: number;
  unit: 'Sheets' | 'Meters' | 'Pcs' | 'Pairs' | 'Sets' | 'Kg' | 'Boxes' | 'Tubes';
  unitCost: number;
  totalCost: number;
}

export interface RoomBOMResult {
  roomId: string;
  roomName: string;
  bomLines: BOMLineItem[];
  totalSheetsCount: number;
  totalEdgeBandMeters: number;
  totalRoomMaterialCost: number;
}

export function generateRoomBOM(room: RoomZone): RoomBOMResult {
  const bomLines: BOMLineItem[] = [];
  let totalSheetsCount = 0;
  let totalEdgeBandMeters = 0;
  let totalRoomMaterialCost = 0;

  room.items.forEach((item) => {
    const height = item.heightFt || 0;
    const width = item.widthFt || 0;
    const qty = item.quantity || 1;
    const netAreaSqFt = height * width * qty;

    // 1. Box Work / Carcass Sheets
    if (item.boxWork) {
      const yieldData = calculateSheetYield({
        netAreaSqFt,
        heightFt: height,
        widthFt: width,
      });

      const carcassSheets = yieldData.sheetsNeeded;
      totalSheetsCount += carcassSheets;
      totalEdgeBandMeters += yieldData.edgeBandMeters1mm;

      const carcassCost = carcassSheets * 2400; // Estimated 18mm board cost
      totalRoomMaterialCost += carcassCost;

      bomLines.push({
        id: `bom-${item.id}-carcass`,
        category: 'Carcass Board',
        description: `${item.name} - ${item.boxWork.boxType} Body`,
        specifications: `${item.boxWork.boardType} (${item.boxWork.boardThicknessMm}mm)`,
        quantity: carcassSheets,
        unit: 'Sheets',
        unitCost: 2400,
        totalCost: carcassCost,
      });

      // Back Panel 6mm/9mm (1 sheet per 64 sqft)
      const backPanelSheets = Math.ceil(netAreaSqFt / 55);
      const backCost = backPanelSheets * 950;
      totalSheetsCount += backPanelSheets;

      bomLines.push({
        id: `bom-${item.id}-back`,
        category: 'Back Panel',
        description: `${item.name} - Back Panel`,
        specifications: `6mm/9mm Commercial Ply`,
        quantity: backPanelSheets,
        unit: 'Sheets',
        unitCost: 950,
        totalCost: backCost,
      });

      // 1mm Edge Banding
      bomLines.push({
        id: `bom-${item.id}-eb1`,
        category: 'Edge Banding',
        description: `${item.name} - Carcass Interior Edge Tape`,
        specifications: `1mm PVC Edge Band (${item.boxWork.edgeBanding})`,
        quantity: yieldData.edgeBandMeters1mm,
        unit: 'Meters',
        unitCost: 18,
        totalCost: yieldData.edgeBandMeters1mm * 18,
      });
    }

    // 2. Shutters
    if (item.shutters) {
      const shutterYield = calculateSheetYield({
        netAreaSqFt,
        heightFt: height,
        widthFt: width,
        isGrainContinuityRequired: item.shutters.grainContinuityRequired,
      });

      const shutterSheets = shutterYield.sheetsNeeded;
      totalSheetsCount += shutterSheets;
      totalEdgeBandMeters += shutterYield.edgeBandMeters2mm;

      const shutterCost = shutterSheets * 3800; // Finish + core sheet cost
      totalRoomMaterialCost += shutterCost;

      bomLines.push({
        id: `bom-${item.id}-shutter`,
        category: 'Shutter Material',
        description: `${item.name} - Shutter Front Face`,
        specifications: `${item.shutters.finishType} on ${item.shutters.coreBoard}`,
        quantity: shutterSheets,
        unit: 'Sheets',
        unitCost: 3800,
        totalCost: shutterCost,
      });

      // 2mm Edge Banding
      bomLines.push({
        id: `bom-${item.id}-eb2`,
        category: 'Edge Banding',
        description: `${item.name} - Shutter Visible Edge Tape`,
        specifications: `2mm PVC / 3D Edge Band`,
        quantity: shutterYield.edgeBandMeters2mm,
        unit: 'Meters',
        unitCost: 28,
        totalCost: shutterYield.edgeBandMeters2mm * 28,
      });
    }

    // 3. Hardware Items
    item.hardware.forEach((hdw) => {
      totalRoomMaterialCost += hdw.totalAmount;
      bomLines.push({
        id: `bom-hdw-${hdw.id}`,
        category: 'Hardware',
        description: `${item.name} - ${hdw.name}`,
        specifications: `Brand: ${hdw.brand} (${hdw.brandTier} Tier)`,
        quantity: hdw.quantity,
        unit: 'Pcs',
        unitCost: hdw.unitPrice,
        totalCost: hdw.totalAmount,
      });
    });

    // 4. Accessories
    item.accessories.forEach((acc) => {
      totalRoomMaterialCost += acc.totalAmount;
      bomLines.push({
        id: `bom-acc-${acc.id}`,
        category: 'Accessory',
        description: `${item.name} - ${acc.name}`,
        specifications: `Category: ${acc.category}`,
        quantity: acc.quantity,
        unit: 'Pcs',
        unitCost: acc.unitPrice,
        totalCost: acc.totalAmount,
      });
    });

    // 5. Consumables
    item.consumables.forEach((con) => {
      totalRoomMaterialCost += con.totalAmount;
      bomLines.push({
        id: `bom-con-${con.id}`,
        category: 'Consumable',
        description: `${item.name} - ${con.item}`,
        specifications: `Site Hardware / Adhesives`,
        quantity: con.quantity,
        unit: con.unit as any,
        unitCost: con.unitRate,
        totalCost: con.totalAmount,
      });
    });
  });

  return {
    roomId: room.id,
    roomName: room.name,
    bomLines,
    totalSheetsCount,
    totalEdgeBandMeters: parseFloat(totalEdgeBandMeters.toFixed(1)),
    totalRoomMaterialCost: parseFloat(totalRoomMaterialCost.toFixed(2)),
  };
}
