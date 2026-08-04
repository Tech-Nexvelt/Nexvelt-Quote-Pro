import React from 'react';
import { useProjectStore } from '@/store/useProjectStore';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatINR } from '@/utils/currency';
import { Copy, Trash2, Layers } from 'lucide-react';

export const ProductItemsList: React.FC = () => {
  const { project, selectedProductId, selectProduct, duplicateProduct, deleteProduct } = useProjectStore();

  return (
    <Card className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#E0F7F7] text-[#00B8B8]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-[20px] font-extrabold text-[#111827] leading-tight">
              Furniture Items in Quotation ({project.products.length})
            </h2>
            <p className="text-[13px] text-[#6B7280] font-medium mt-0.5">
              Itemized summary of added furniture products.
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-[#00B8B8] bg-[#E0F7F7] px-3 py-1.5 rounded-full">
          Total Area: {project.summary.totalAreaSqFt.toFixed(2)} sq.ft
        </span>
      </div>

      <div className="space-y-2.5">
        {project.products.map((item, idx) => {
          const isSelected = item.id === selectedProductId;
          return (
            <div
              key={item.id}
              onClick={() => selectProduct(item.id)}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'border-2 border-[#00D9D9] bg-[#E0F7F7]/50 shadow-xs'
                  : 'border-[#E5E7EB] bg-white hover:bg-[#F8FAFC]'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#E0F7F7] text-[#00B8B8] flex items-center justify-center text-xs font-bold font-mono border border-[#00D9D9]/30">
                  {idx + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-extrabold text-[#111827]">{item.name}</h4>
                    <Badge variant="cyan">{item.category}</Badge>
                  </div>
                  <p className="text-xs text-[#6B7280] font-mono mt-0.5">
                    {item.heightFt}' H × {item.widthFt}' W × {item.depthIn}" D ({item.areaSqFt.toFixed(2)} sq.ft) • {item.shutterMaterialName || 'Standard Finish'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right font-mono">
                  <span className="text-xs text-[#6B7280] block">{item.quantity} Unit × ₹{item.baseRate}/sq.ft</span>
                  <span className="text-base font-extrabold text-[#00B8B8]">{formatINR(item.lineSubtotal)}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateProduct(item.id);
                    }}
                    className="p-2 rounded-xl text-[#6B7280] hover:text-[#111827] hover:bg-slate-100"
                    title="Duplicate item"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  {project.products.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProduct(item.id);
                      }}
                      className="p-2 rounded-xl text-[#6B7280] hover:text-[#DC2626] hover:bg-red-50"
                      title="Delete item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
