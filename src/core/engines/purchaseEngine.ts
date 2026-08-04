/**
 * Purchase Engine for Nexvelt Quote Pro (10/10 Edition)
 * Aggregates room-level BOM lines across all rooms in a project to build
 * vendor-wise purchase requisitions, sheet requisitions, hardware orders,
 * edge-banding length tallies, and consumable site kits.
 */

import { ProjectEntity, PurchaseRequisition } from '../../types/enterprise';
import { generateRoomBOM } from './bomEngine';

export function generateProjectPurchaseRequisition(project: ProjectEntity): PurchaseRequisition {
  const sheetMap = new Map<string, { sheets: number; estCost: number; vendor: string }>();
  const hardwareMap = new Map<string, { name: string; quantity: number; unit: string; vendor: string; estCost: number }>();
  const edgeBandMap = new Map<string, { meters: number; estCost: number }>();
  const consumableMap = new Map<string, { quantity: number; unit: string; estCost: number }>();

  project.rooms.forEach((room) => {
    const roomBom = generateRoomBOM(room);
    roomBom.bomLines.forEach((line) => {
      if (line.category === 'Carcass Board' || line.category === 'Back Panel' || line.category === 'Shutter Material') {
        const key = `${line.description} [${line.specifications}]`;
        const existing = sheetMap.get(key) || { sheets: 0, estCost: 0, vendor: 'Century/Greenply Dealer' };
        sheetMap.set(key, {
          sheets: existing.sheets + line.quantity,
          estCost: existing.estCost + line.totalCost,
          vendor: existing.vendor,
        });
      } else if (line.category === 'Hardware' || line.category === 'Accessory') {
        const key = line.description;
        const existing = hardwareMap.get(key) || {
          name: line.description,
          quantity: 0,
          unit: line.unit,
          vendor: 'Hettich/Blum Distributor',
          estCost: 0,
        };
        hardwareMap.set(key, {
          ...existing,
          quantity: existing.quantity + line.quantity,
          estCost: existing.estCost + line.totalCost,
        });
      } else if (line.category === 'Edge Banding') {
        const key = line.specifications;
        const existing = edgeBandMap.get(key) || { meters: 0, estCost: 0 };
        edgeBandMap.set(key, {
          meters: existing.meters + line.quantity,
          estCost: existing.estCost + line.totalCost,
        });
      } else if (line.category === 'Consumable') {
        const key = line.description;
        const existing = consumableMap.get(key) || { quantity: 0, unit: line.unit, estCost: 0 };
        consumableMap.set(key, {
          quantity: existing.quantity + line.quantity,
          unit: line.unit,
          estCost: existing.estCost + line.totalCost,
        });
      }
    });
  });

  const sheetMaterials = Array.from(sheetMap.entries()).map(([name, data]) => ({
    name,
    sheetsToOrder: data.sheets,
    vendor: data.vendor,
    estCost: data.estCost,
  }));

  const hardwareItems = Array.from(hardwareMap.entries()).map(([code, data]) => ({
    code,
    name: data.name,
    quantity: data.quantity,
    unit: data.unit,
    vendor: data.vendor,
    estCost: data.estCost,
  }));

  const edgeBandingMeters = Array.from(edgeBandMap.entries()).map(([spec, data]) => ({
    spec,
    totalMeters: data.meters,
    estCost: data.estCost,
  }));

  const consumablesKit = Array.from(consumableMap.entries()).map(([item, data]) => ({
    item,
    quantity: data.quantity,
    unit: data.unit,
    estCost: data.estCost,
  }));

  const totalPurchaseCost =
    sheetMaterials.reduce((a, b) => a + b.estCost, 0) +
    hardwareItems.reduce((a, b) => a + b.estCost, 0) +
    edgeBandingMeters.reduce((a, b) => a + b.estCost, 0) +
    consumablesKit.reduce((a, b) => a + b.estCost, 0);

  return {
    id: `req-${project.id}-${Date.now().toString().slice(-4)}`,
    projectId: project.id,
    projectTitle: project.title,
    generatedAt: new Date().toISOString(),
    sheetMaterials,
    hardwareItems,
    edgeBandingMeters,
    consumablesKit,
    totalPurchaseCost: parseFloat(totalPurchaseCost.toFixed(2)),
  };
}
