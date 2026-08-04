import React, { useState } from 'react';
import { useQuotationStore } from '@/store/useQuotationStore';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatINR } from '@/utils/currency';
import { Edit2, Copy, Trash2, ChevronDown, ChevronUp, Box, Layers, Wrench } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const RichProductCardsList: React.FC = () => {
  const { currentQuotation, deleteItem, duplicateItem, setEditingItem, editingItemId } = useQuotationStore();
  const items = currentQuotation.items;

  // Track expanded card IDs
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (items.length === 0) {
    return (
      <Card glass className="p-8 text-center border-dashed border-2 border-slate-300 dark:border-slate-800">
        <div className="mx-auto w-12 h-12 rounded-full bg-[#00D9D9]/15 flex items-center justify-center text-[#00B8B8] mb-3">
          <Box className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">No Products Configured</h4>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
          Use the guided builder above to add wardrobe, modular kitchen, TV unit, or custom furniture product cards.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          Configured Products List ({items.length})
        </h3>
        <Badge variant="cyan">{currentQuotation.summary.totalAreaSqFt.toFixed(2)} Total Sq.Ft</Badge>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {items.map((item, idx) => {
            const isEditing = editingItemId === item.id;
            const isExpanded = !!expandedIds[item.id];

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card
                  glass
                  className={`p-4 transition-all duration-200 border-slate-200/90 dark:border-slate-800 ${
                    isEditing ? 'border-[#00D9D9] shadow-md shadow-[#00D9D9]/10' : ''
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left: Thumbnail & Details */}
                    <div className="flex items-center gap-3.5">
                      <div className="h-12 w-12 rounded-xl bg-slate-900 text-[#00D9D9] flex items-center justify-center font-bold text-lg shrink-0 border border-slate-800">
                        <Box className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-slate-900 dark:text-slate-100">
                            {idx + 1}. {item.name}
                          </span>
                          <Badge variant="cyan">{item.category}</Badge>
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5 space-x-2">
                          <span>{item.heightFt.toFixed(1)}' H × {item.widthFt.toFixed(1)}' W × {item.depthIn}" D</span>
                          <span>• ({item.areaSqFt.toFixed(2)} sq.ft)</span>
                          <span>• Qty: {item.quantity}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Amount & Action Icons */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 block font-mono">
                          @ {formatINR(item.effectiveRatePerUnit)}/sq.ft
                        </span>
                        <span className="font-mono font-extrabold text-lg text-[#00B8B8] dark:text-[#35F5FF]">
                          {formatINR(item.lineSubtotal)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingItem(item.id)}
                          className="p-2 rounded-xl text-slate-500 hover:text-[#00B8B8] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit product configuration"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => duplicateItem(item.id)}
                          className="p-2 rounded-xl text-slate-500 hover:text-sky-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Duplicate item"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="p-2 rounded-xl text-slate-500 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Delete item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleExpand(item.id)}
                          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Toggle details"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Specifications Drawer */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-600 dark:text-slate-400 bg-slate-50/60 dark:bg-slate-900/60 p-3 rounded-xl"
                    >
                      <div>
                        <span className="text-slate-500 font-bold block">Carcass Board:</span>
                        <span>{item.carcassMaterialName || 'Standard Board'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-bold block">Shutter Door Finish:</span>
                        <span className="text-[#35F5FF] font-semibold">{item.shutterMaterialName || 'Standard Finish'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-bold block">Hardware Fitting Set:</span>
                        <span>{item.hardwarePackageName || 'Standard Hardware'}</span>
                      </div>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
