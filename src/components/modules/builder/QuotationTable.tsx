import React, { useState } from 'react';
import { useQuotationStore } from '@/store/useQuotationStore';
import { QuotationSpace, SpaceType } from '@/types/spaces';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatINR } from '@/utils/currency';
import { SpaceSelectionModal } from './SpaceSelectionModal';
import {
  Edit2,
  Copy,
  Trash2,
  Box,
  Layers,
  Plus,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Bed,
  Utensils,
  Sofa,
  Bath,
  Briefcase,
  Trees,
  Wrench,
  Sparkles,
  FolderPlus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Icon mapping helper for Space Types
const getSpaceIcon = (spaceType: SpaceType) => {
  switch (spaceType) {
    case 'Master Bedroom':
    case "Children's Bedroom":
    case 'Guest Bedroom':
      return <Bed className="w-4 h-4 text-cyan-500" />;
    case 'Kitchen':
      return <Utensils className="w-4 h-4 text-amber-500" />;
    case 'Hall / Living':
      return <Sofa className="w-4 h-4 text-indigo-500" />;
    case 'Dining':
      return <Utensils className="w-4 h-4 text-emerald-500" />;
    case 'Bathroom':
      return <Bath className="w-4 h-4 text-sky-500" />;
    case 'Office':
      return <Briefcase className="w-4 h-4 text-purple-500" />;
    case 'Balcony':
    case 'Exterior':
      return <Trees className="w-4 h-4 text-green-500" />;
    case 'Utility':
      return <Wrench className="w-4 h-4 text-orange-500" />;
    default:
      return <Box className="w-4 h-4 text-[#00D9D9]" />;
  }
};

export const QuotationTable: React.FC = () => {
  const {
    currentQuotation,
    deleteItem,
    duplicateItem,
    setEditingItem,
    editingItemId,
    deleteSpace,
    duplicateSpace,
    toggleSpaceCollapse,
    setEditingItem: triggerEdit,
  } = useQuotationStore();

  // Modal State for global / contextual item creation workflow
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [targetModalSpaceId, setTargetModalSpaceId] = useState<string | null>(null);

  const spaces = currentQuotation.spaces || [];
  const items = currentQuotation.items || [];

  const handleOpenGlobalAdd = () => {
    setTargetModalSpaceId(null);
    setModalOpen(true);
  };

  const handleOpenSpaceAdd = (spaceId: string) => {
    setTargetModalSpaceId(spaceId);
    setModalOpen(true);
  };

  const handleModalSelectComplete = (spaceId: string, itemType: string) => {
    // Focus product name in ProductLineForm / GuidedBuilder if available
    const nameInput = document.getElementById('product-name-input');
    if (nameInput) {
      nameInput.focus();
    }
  };

  if (items.length === 0 && spaces.length === 0) {
    return (
      <>
        <Card glass className="p-10 text-center border-dashed border-2 border-slate-300 dark:border-slate-800 space-y-4">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#00D9D9]/15 flex items-center justify-center text-[#00B8B8]">
            <Box className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Spaces or Products Added</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Start building your enterprise quotation by adding spaces (Master Bedroom, Kitchen, Living Room) and line items.
            </p>
          </div>
          <Button variant="primary" size="md" onClick={handleOpenGlobalAdd} className="shadow-lg">
            <Plus className="w-4 h-4 mr-2" /> + Add First Space / Item
          </Button>
        </Card>

        <SpaceSelectionModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          targetSpaceId={targetModalSpaceId}
          onSelectComplete={handleModalSelectComplete}
        />
      </>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Workspace Header & Global Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 text-white shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#00D9D9]/20 text-[#00D9D9]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wide">
              Quotation Spaces Hierarchy ({spaces.length} Spaces, {items.length} Items)
            </h3>
            <p className="text-xs text-slate-400">
              Structured enterprise view (Quotation → Space → Item Type → Item)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="cyan" className="text-xs py-1 px-3">
            {currentQuotation.summary.totalAreaSqFt.toFixed(2)} Total Sq.Ft
          </Badge>
          <Button variant="primary" size="sm" onClick={handleOpenGlobalAdd} className="font-bold shadow-md">
            <Plus className="w-4 h-4 mr-1.5" /> + Add Item
          </Button>
        </div>
      </div>

      {/* Render Space Cards */}
      {spaces.map((space) => {
        const spaceItems = items.filter((i) => i.spaceId === space.id);
        const spaceTotalAmount = spaceItems.reduce((acc, i) => acc + i.lineSubtotal, 0);
        const spaceTotalArea = spaceItems.reduce((acc, i) => acc + i.areaSqFt, 0);
        const isCollapsed = !!space.isCollapsed;

        // Group items within space by Item Type / Category
        const itemTypeGroups: Record<string, typeof spaceItems> = {};
        spaceItems.forEach((i) => {
          const type = i.category || 'General Work';
          if (!itemTypeGroups[type]) itemTypeGroups[type] = [];
          itemTypeGroups[type].push(i);
        });

        return (
          <Card key={space.id} glass className="p-0 overflow-hidden border-slate-200 dark:border-slate-800 shadow-md">
            {/* Space Header */}
            <div className="p-4 bg-slate-100/90 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleSpaceCollapse(space.id)}
                  className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                >
                  {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  {getSpaceIcon(space.spaceType)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">{space.spaceName}</h4>
                    <Badge variant="slate" className="text-[10px] uppercase font-bold tracking-wider">
                      {space.spaceType}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-3 mt-0.5 font-medium">
                    <span>{spaceItems.length} Products</span>
                    <span>•</span>
                    <span>{spaceTotalArea.toFixed(1)} Sq.Ft</span>
                  </div>
                </div>
              </div>

              {/* Space Metrics & Header Controls */}
              <div className="flex items-center gap-3">
                <div className="text-right font-mono">
                  <span className="text-xs text-slate-400 block font-sans uppercase text-[10px]">Space Subtotal</span>
                  <span className="text-sm font-bold text-[#00B8B8] dark:text-[#35F5FF]">
                    {formatINR(spaceTotalAmount)}
                  </span>
                </div>

                <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-3">
                  <button
                    onClick={() => handleOpenSpaceAdd(space.id)}
                    className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-[#00B8B8] hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1 text-xs font-semibold"
                    title="Add Item directly to this space"
                  >
                    <Plus className="w-3.5 h-3.5" /> + Item
                  </button>

                  <button
                    onClick={() => duplicateSpace(space.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-sky-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title="Duplicate Space"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {spaceItems.length === 0 && (
                    <button
                      onClick={() => deleteSpace(space.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      title="Delete Space"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Space Body (Item Type Sub-groups & Product Lines) */}
            {!isCollapsed && (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {spaceItems.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 italic">
                    No items in {space.spaceName} yet. Click <strong>+ Item</strong> above to add wardrobes, cabinets, or wall paneling.
                  </div>
                ) : (
                  Object.entries(itemTypeGroups).map(([itemType, groupItems]) => (
                    <div key={itemType} className="p-0">
                      {/* Item Type Sub-header */}
                      <div className="px-4 py-2 bg-slate-50/70 dark:bg-slate-900/40 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00D9D9]" />
                          {itemType} ({groupItems.length})
                        </span>
                        <span>
                          Type Total: {formatINR(groupItems.reduce((acc, i) => acc + i.lineSubtotal, 0))}
                        </span>
                      </div>

                      {/* Items Table inside Item Type Group */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50/40 dark:bg-slate-900/20 text-slate-400 font-semibold uppercase text-[10px] border-b border-slate-100 dark:border-slate-800">
                            <tr>
                              <th className="py-2 px-4 w-12 text-center">#</th>
                              <th className="py-2 px-4">Item Name & Specs</th>
                              <th className="py-2 px-4">Dimensions</th>
                              <th className="py-2 px-4">Area / Len</th>
                              <th className="py-2 px-4">Rate (₹)</th>
                              <th className="py-2 px-4 text-center">Qty</th>
                              <th className="py-2 px-4 text-right">Subtotal</th>
                              <th className="py-2 px-4 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {groupItems.map((item, itemIdx) => {
                              const isEditing = editingItemId === item.id;
                              return (
                                <tr
                                  key={item.id}
                                  className={`transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/40 ${
                                    isEditing ? 'bg-[#00D9D9]/10 font-medium' : ''
                                  }`}
                                >
                                  {/* Item Independent Order Number per Space/Category */}
                                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-500">
                                    {itemIdx + 1}
                                  </td>

                                  {/* Name & Material Specs */}
                                  <td className="py-3 px-4">
                                    <div className="flex flex-col gap-0.5">
                                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                        {item.name}
                                      </span>
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

                                  {/* Area / Running Length */}
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
                                        title="Edit product"
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
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))
                )}

                {/* Space Subtotal Summary Bar */}
                {spaceItems.length > 0 && (
                  <div className="px-5 py-3 bg-[#00D9D9]/10 border-t border-[#00D9D9]/30 flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      {space.spaceName} Total Subtotal:
                    </span>
                    <span className="text-base font-black font-mono text-[#00B8B8] dark:text-[#35F5FF]">
                      {formatINR(spaceTotalAmount)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </Card>
        );
      })}

      {/* Global Modal for Item Creation */}
      <SpaceSelectionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        targetSpaceId={targetModalSpaceId}
        onSelectComplete={handleModalSelectComplete}
      />
    </div>
  );
};
