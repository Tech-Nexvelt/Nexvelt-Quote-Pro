import React from 'react';
import { CommercialProject } from '@/types/project';
import { generatePurchaseRequisition } from '@/core/engines/summaryEngine';
import { Download, Layers, ShieldCheck, Tag } from 'lucide-react';

interface PurchaseListExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: CommercialProject;
}

export const PurchaseListExportModal: React.FC<PurchaseListExportModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  if (!isOpen) return null;

  const requisition = generatePurchaseRequisition(project);

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,Category,Item Specification,Quantity / Area,Estimated Cost\n';
    
    requisition.plywoodSheets.forEach((s: any) => {
      csvContent += `"Plywood","${s.sheetType}",${s.sheetsNeeded} Sheets,${s.estCost}\n`;
    });
    requisition.laminateSheets.forEach((l: any) => {
      csvContent += `"Laminate","${l.laminateCode}",${l.sheetsNeeded} Sheets,${l.estCost}\n`;
    });
    requisition.hardwareTally.forEach((h: any) => {
      csvContent += `"Hardware","${h.hardwareName}",${h.totalQuantity} ${h.unit},${h.estCost}\n`;
    });
    requisition.edgeBandingMeters.forEach((e: any) => {
      csvContent += `"Edge Banding","${e.spec}",${e.totalMeters} Meters,${e.estCost}\n`;
    });
    requisition.consumablesKit.forEach((c: any) => {
      csvContent += `"Consumable","${c.item}",${c.quantity} ${c.unit},${c.estCost}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Purchase_Requisition_${project.quotationNumber || 'EST'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl text-[#111827]">
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-[#111827] flex items-center gap-2">
              <span>📦 Material Purchase Requisition & BOM Export</span>
            </h2>
            <p className="text-xs font-semibold text-[#4B5563]">Vendor-wise raw sheet requirements, hardware order tally, and edge-band meters</p>
          </div>
          <button onClick={onClose} className="text-[#6B7280] hover:text-[#111827] text-lg font-bold">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-6">
          {/* Summary Callout Banner */}
          <div className="bg-[#E6F7F7] p-4 rounded-xl border border-[#00D9D9]/30 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase text-[#008080]">Estimated Total Procurement Budget</span>
              <div className="text-2xl font-black font-mono text-[#008080]">
                ₹ {requisition.totalProcurementCost.toLocaleString('en-IN')}
              </div>
            </div>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2 text-xs font-bold bg-[#00D9D9] hover:bg-[#00B8B8] text-white rounded-xl transition flex items-center gap-2 shadow-xs"
            >
              <Download className="w-4 h-4" /> Export CSV / Excel BOM
            </button>
          </div>

          {/* Grid Section 1: Plywood & Laminates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Plywood Tally */}
            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-2">
              <h3 className="text-xs font-extrabold uppercase text-[#111827] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#00B8B8]" />
                <span>Plywood Sheet Requirements (8x4 Ft)</span>
              </h3>
              <div className="divide-y divide-[#E2E8F0] text-xs">
                {requisition.plywoodSheets.map((ply: any, i: number) => (
                  <div key={i} className="py-2 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#111827] block">{ply.sheetType}</span>
                      <span className="text-[10px] text-[#4B5563]">Est. Waste Factor: 10%</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-[#008080]">{ply.sheetsNeeded} Sheets</span>
                      <span className="block text-[10px] text-[#4B5563]">~ ₹{ply.estCost.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Laminate Tally */}
            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-2">
              <h3 className="text-xs font-extrabold uppercase text-[#111827] flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#00B8B8]" />
                <span>Laminate & Shutter Sheet Tally</span>
              </h3>
              <div className="divide-y divide-[#E2E8F0] text-xs">
                {requisition.laminateSheets.map((lam: any, i: number) => (
                  <div key={i} className="py-2 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#111827] block">{lam.laminateCode}</span>
                      <span className="text-[10px] text-[#4B5563]">Core: 1mm Standard</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-[#008080]">{lam.sheetsNeeded} Sheets</span>
                      <span className="block text-[10px] text-[#4B5563]">~ ₹{lam.estCost.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hardware & Consumables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-2">
              <h3 className="text-xs font-extrabold uppercase text-[#111827]">🔩 Hardware Order Tally</h3>
              <div className="divide-y divide-[#E2E8F0] text-xs">
                {requisition.hardwareTally.map((hw: any, i: number) => (
                  <div key={i} className="py-2 flex items-center justify-between">
                    <span className="font-medium text-[#111827]">{hw.hardwareName}</span>
                    <span className="font-mono font-bold text-[#008080]">{hw.totalQuantity} {hw.unit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-2">
              <h3 className="text-xs font-extrabold uppercase text-[#111827]">🧪 Edge Banding & Consumables</h3>
              <div className="divide-y divide-[#E2E8F0] text-xs">
                {requisition.edgeBandingMeters.map((eb: any, i: number) => (
                  <div key={i} className="py-2 flex items-center justify-between">
                    <span className="font-medium text-[#111827]">{eb.spec}</span>
                    <span className="font-mono font-bold text-[#008080]">{eb.totalMeters} Mtr</span>
                  </div>
                ))}
                {requisition.consumablesKit.map((ck: any, i: number) => (
                  <div key={i} className="py-2 flex items-center justify-between">
                    <span className="font-medium text-[#111827]">{ck.item}</span>
                    <span className="font-mono font-bold text-[#008080]">{ck.quantity} {ck.unit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#4B5563]">
          <span className="flex items-center gap-1 font-semibold text-[#008080]">
            <ShieldCheck className="w-4 h-4 text-[#00B8B8]" /> Factory BOM verified for exact sheet yield
          </span>
          <button onClick={onClose} className="px-4 py-2 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#111827] font-bold rounded-lg transition">
            Close Requisition
          </button>
        </div>
      </div>
    </div>
  );
};
