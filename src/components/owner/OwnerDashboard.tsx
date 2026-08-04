import React from 'react';
import { useProjectStore } from '@/store/useProjectStore';
import { useUIStore } from '@/store/useUIStore';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatINR } from '@/utils/currency';
import { Shield, TrendingUp, Building, Layers } from 'lucide-react';

export const OwnerDashboard: React.FC = () => {
  const { project } = useProjectStore();
  const { setCurrentView } = useUIStore();
  const summary = project.summary;

  return (
    <Card glass={false} className="bg-[#E0F7F7]/80 border-2 border-[#00D9D9]/40 text-[#111827] p-5 rounded-[18px] shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-[#00D9D9]/20 pb-2.5">
        <div className="flex items-center gap-2.5">
          <Shield className="w-5 h-5 text-[#00B8B8]" />
          <h3 className="text-sm font-extrabold text-[#111827]">
            Owner Mode — Business Analytics & Margin Analysis
          </h3>
        </div>
        <Badge variant="cyan">Admin Authorized</Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="bg-white border border-[#E5E7EB] p-3 rounded-xl shadow-2xs">
          <span className="text-[#6B7280] text-[10px] block uppercase">Selling Price:</span>
          <span className="text-base font-extrabold text-[#111827]">{formatINR(summary.totalSellingPrice)}</span>
        </div>
        <div className="bg-white border border-[#E5E7EB] p-3 rounded-xl shadow-2xs">
          <span className="text-[#6B7280] text-[10px] block uppercase">Cost Price:</span>
          <span className="text-base font-extrabold text-[#6B7280]">{formatINR(summary.totalCostPrice)}</span>
        </div>
        <div className="bg-white border border-[#E5E7EB] p-3 rounded-xl shadow-2xs">
          <span className="text-[#6B7280] text-[10px] block uppercase">Gross Profit ₹:</span>
          <span className="text-base font-extrabold text-[#16A34A]">+{formatINR(summary.grossProfitAmount)}</span>
        </div>
        <div className="bg-white border border-[#E5E7EB] p-3 rounded-xl shadow-2xs">
          <span className="text-[#6B7280] text-[10px] block uppercase">Profit Margin %:</span>
          <span className="text-base font-extrabold text-[#00B8B8]">{summary.marginPercentage.toFixed(1)}%</span>
        </div>
      </div>

      <div className="flex items-center gap-2.5 pt-1">
        <button
          onClick={() => setCurrentView('catalog')}
          className="h-10 px-4 rounded-xl bg-white border border-[#E5E7EB] hover:bg-[#F8FAFC] text-xs font-bold text-[#111827] flex items-center gap-2 shadow-2xs transition-colors"
        >
          <Layers className="w-4 h-4 text-[#00B8B8]" />
          <span>Material Rates Manager</span>
        </button>
        <button
          onClick={() => setCurrentView('company')}
          className="h-10 px-4 rounded-xl bg-white border border-[#E5E7EB] hover:bg-[#F8FAFC] text-xs font-bold text-[#111827] flex items-center gap-2 shadow-2xs transition-colors"
        >
          <Building className="w-4 h-4 text-sky-600" />
          <span>Company & Bank/UPI Profile</span>
        </button>
        <button
          onClick={() => setCurrentView('reports')}
          className="h-10 px-4 rounded-xl bg-white border border-[#E5E7EB] hover:bg-[#F8FAFC] text-xs font-bold text-[#111827] flex items-center gap-2 shadow-2xs transition-colors"
        >
          <TrendingUp className="w-4 h-4 text-[#16A34A]" />
          <span>Sales Reports</span>
        </button>
      </div>
    </Card>
  );
};
