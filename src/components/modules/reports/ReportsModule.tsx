import React from 'react';
import { useQuotationStore } from '@/store/useQuotationStore';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatINR } from '@/utils/currency';
import { BarChart3, TrendingUp, PieChart, Layers, PackageCheck } from 'lucide-react';

export const ReportsModule: React.FC = () => {
  const { savedQuotations } = useQuotationStore();

  // Compute product category popularity
  const categoryCounts: Record<string, { count: number; totalRevenue: number }> = {};
  savedQuotations.forEach((q) => {
    q.items.forEach((item) => {
      if (!categoryCounts[item.category]) {
        categoryCounts[item.category] = { count: 0, totalRevenue: 0 };
      }
      categoryCounts[item.category].count += item.quantity;
      categoryCounts[item.category].totalRevenue += item.lineSubtotal;
    });
  });

  const categoryList = Object.entries(categoryCounts).sort((a, b) => b[1].totalRevenue - a[1].totalRevenue);

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-4">
      <div className="border-b border-[#E2E8F0] pb-4">
        <h2 className="text-xl font-extrabold text-[#111827] flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-[#00B8B8]" />
          Sales & Product Performance Reports
        </h2>
        <p className="text-xs font-semibold text-[#4B5563] mt-0.5">
          Local sales analytics generated from stored quotations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Most Popular Product Categories */}
        <Card glass className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2.5">
            <PieChart className="w-4 h-4 text-[#00B8B8]" />
            <h3 className="text-sm font-extrabold text-[#111827]">
              Top Selling Product Categories
            </h3>
          </div>

          <div className="space-y-3">
            {categoryList.length === 0 ? (
              <p className="text-xs font-semibold text-[#6B7280]">No product sales data available.</p>
            ) : (
              categoryList.map(([cat, data]) => (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#111827] font-bold">{cat}</span>
                    <span className="font-mono font-bold text-[#008080]">
                      {formatINR(data.totalRevenue)} ({data.count} units)
                    </span>
                  </div>
                  <div className="w-full bg-[#F1F5F9] h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#00D9D9] to-[#00B8B8] h-full rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          (data.totalRevenue / (categoryList[0]?.[1]?.totalRevenue || 1)) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Quotation Status Summary */}
        <Card glass className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2.5">
            <PackageCheck className="w-4 h-4 text-[#00B8B8]" />
            <h3 className="text-sm font-extrabold text-[#111827]">
              Quotation Status Breakdown
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            {['draft', 'sent', 'approved', 'rejected'].map((st) => {
              const count = savedQuotations.filter((q) => q.status === st).length;
              return (
                <div key={st} className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <span className="text-[#4B5563] uppercase text-[10px] font-extrabold block">{st} Quotes</span>
                  <span className="text-2xl font-black font-mono text-[#111827]">{count}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};
