import React, { useState } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { getStoredMaterials } from '@/storage/materialMasterStore';
import { getStoredHardware } from '@/storage/hardwareMasterStore';
import { Tag, Search } from 'lucide-react';

export const PriceListModule: React.FC = () => {
  const { addToast } = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');

  const materials = getStoredMaterials();
  const hardware = getStoredHardware();

  const filteredMaterials = materials.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredHardware = hardware.filter((h) =>
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-[#E2E8F0] p-5 rounded-xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E6F7F7] text-[#00B8B8] flex items-center justify-center font-bold">
            <Tag className="w-5 h-5 text-[#00B8B8]" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-[#111827]">Master Material & Hardware Price List</h1>
            <p className="text-xs text-[#4B5563]">Current market rates, GST tax rates, wholesale buying vs client prices</p>
          </div>
        </div>

        <div className="relative w-64">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search price list..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-[#E2E8F0] rounded-lg text-[#111827] focus:outline-none focus:border-[#00D9D9]"
          />
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-xs space-y-3 p-4">
        <h2 className="text-sm font-extrabold text-[#111827]">1. Sheet Goods & Board Price List</h2>
        <div className="overflow-x-auto border border-[#E2E8F0] rounded-lg">
          <table className="w-full text-left text-xs text-[#111827]">
            <thead className="bg-[#F8FAFC] text-[#4B5563] font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="p-3">Item Code</th>
                <th className="p-3">Material Name</th>
                <th className="p-3">Brand</th>
                <th className="p-3">Unit</th>
                <th className="p-3 text-right">Wholesale Rate</th>
                <th className="p-3 text-right">Client Rate</th>
                <th className="p-3 text-center">GST</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredMaterials.map((m) => (
                <tr key={m.id} className="hover:bg-[#F8FAFC]">
                  <td className="p-3 font-mono font-bold text-[#00B8B8]">{m.code}</td>
                  <td className="p-3 font-semibold text-[#111827]">{m.name}</td>
                  <td className="p-3 text-[#4B5563]">{m.brand}</td>
                  <td className="p-3 font-mono">{m.unit}</td>
                  <td className="p-3 text-right font-mono text-[#6B7280]">₹{m.purchaseRate}</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-600">₹{m.clientRate}</td>
                  <td className="p-3 text-center font-mono text-[#6B7280]">{m.gstPercent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hardware Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-xs space-y-3 p-4">
        <h2 className="text-sm font-extrabold text-[#111827]">2. Mechanical Hardware & Fittings Price List</h2>
        <div className="overflow-x-auto border border-[#E2E8F0] rounded-lg">
          <table className="w-full text-left text-xs text-[#111827]">
            <thead className="bg-[#F8FAFC] text-[#4B5563] font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="p-3">Code</th>
                <th className="p-3">Hardware Item</th>
                <th className="p-3">Brand & Tier</th>
                <th className="p-3">Unit</th>
                <th className="p-3 text-right">Wholesale Rate</th>
                <th className="p-3 text-right">Client Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredHardware.map((h) => (
                <tr key={h.id} className="hover:bg-[#F8FAFC]">
                  <td className="p-3 font-mono font-bold text-[#00B8B8]">{h.code}</td>
                  <td className="p-3 font-semibold text-[#111827]">{h.name}</td>
                  <td className="p-3">
                    <span className="font-medium text-[#111827]">{h.brand}</span>{' '}
                    <span className="text-[10px] bg-slate-100 text-[#4B5563] px-1.5 py-0.5 rounded">
                      {h.brandTier}
                    </span>
                  </td>
                  <td className="p-3 font-mono">{h.unit}</td>
                  <td className="p-3 text-right font-mono text-[#6B7280]">₹{h.purchaseRate}</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-600">₹{h.clientRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
