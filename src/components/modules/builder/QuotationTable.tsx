import React from 'react';
import { useQuotationStore } from '@/store/useQuotationStore';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatINR } from '@/utils/currency';
import { Edit2, Copy, Trash2, Box, Layers, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const QuotationTable: React.FC = () => {
  const { currentQuotation, deleteItem, duplicateItem, setEditingItem, editingItemId } = useQuotationStore();
  const items = currentQuotation.items;

  if (items.length === 0) {
    return (
      <Card glass className="p-8 text-center border-dashed border-2 border-slate-300 dark:border-slate-800">
        <div className="mx-auto w-12 h-12 rounded-full bg-[#00D9D9]/15 flex items-center justify-center text-[#00B8B8] mb-3">
          <Box className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">No Products Added Yet</h4>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
          Use the form above to add interior products, wardrobes, modular kitchens, or custom furniture into this quotation.
        </p>
      </Card>
    );
  }

  return (
    <Card glass className="p-0 overflow-hidden border-slate-200 dark:border-slate-800">
      <div className="p-4 bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#00D9D9]" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Quotation Items ({items.length})
          </h3>
        </div>
        <Badge variant="cyan">{currentQuotation.summary.totalAreaSqFt.toFixed(2)} Total Sq.Ft</Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 select-none">
            <tr>
              <th className="py-3 px-4">Category & Product</th>
              <th className="py-3 px-4">Dimensions</th>
              <th className="py-3 px-4">Area / Len</th>
              <th className="py-3 px-4">Rate (₹)</th>
              <th className="py-3 px-4 text-center">Qty</th>
              <th className="py-3 px-4 text-right">Subtotal</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            <AnimatePresence>
              {items.map((item, idx) => {
                const isEditing = editingItemId === item.id;
                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className={`transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/40 ${
                      isEditing ? 'bg-[#00D9D9]/10 font-medium' : ''
                    }`}
                  >
                    {/* Category & Product Name */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                            {idx + 1}. {item.name}
                          </span>
                          <Badge variant="slate" className="text-[10px] py-0 px-1.5">
                            {item.category}
                          </Badge>
                        </div>
                        <div className="text-[11px] text-slate-500 space-x-2">
                          {item.carcassMaterialName && <span>Carcass: {item.carcassMaterialName}</span>}
                          {item.shutterMaterialName && <span>• Finish: {item.shutterMaterialName}</span>}
                          {item.hardwarePackageName && <span>• Hardware: {item.hardwarePackageName}</span>}
                        </div>
                      </div>
                    </td>

                    {/* Dimensions */}
                    <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                      {item.heightFt.toFixed(1)}' H × {item.widthFt.toFixed(1)}' W × {item.depthIn}" D
                    </td>

                    {/* Area / Running Feet */}
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {item.pricingModel === 'sqft'
                        ? `${item.areaSqFt.toFixed(2)} sq.ft`
                        : item.pricingModel === 'running-ft'
                        ? `${item.runningLengthFt.toFixed(2)} r.ft`
                        : 'Fixed'}
                    </td>

                    {/* Effective Rate */}
                    <td className="py-3 px-4 font-mono text-slate-800 dark:text-slate-200">
                      {formatINR(item.effectiveRatePerUnit)}
                    </td>

                    {/* Quantity */}
                    <td className="py-3 px-4 text-center font-bold text-slate-900 dark:text-slate-100">
                      {item.quantity}
                    </td>

                    {/* Subtotal */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-sm text-[#00B8B8] dark:text-[#35F5FF]">
                      {formatINR(item.lineSubtotal)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setEditingItem(item.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#00B8B8] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit product line"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => duplicateItem(item.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-sky-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Duplicate item"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Delete item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </Card>
  );
};
