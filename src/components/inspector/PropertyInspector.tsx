import React from 'react';
import { useProjectStore } from '@/store/useProjectStore';
import { useCatalogStore } from '@/store/useCatalogStore';
import { useUIStore, InspectorTab } from '@/store/useUIStore';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatINR } from '@/utils/currency';
import { PricingModel } from '@/types/pricing';
import { Sliders, Layers, Wrench, DollarSign, FileText, Send, Coins } from 'lucide-react';
import { motion } from 'framer-motion';

export const PropertyInspector: React.FC = () => {
  const { project, selectedProductId, updateProduct } = useProjectStore();
  const { materials, hardware } = useCatalogStore();
  const { inspectorTab, setInspectorTab, setPrintPreviewOpen, addToast } = useUIStore();

  const selectedProduct =
    project.products.find((p) => p.id === selectedProductId) || project.products[0];

  const summary = project.summary;

  if (!selectedProduct) {
    return (
      <Card glass className="h-full p-4 text-center text-slate-400">
        No product object selected.
      </Card>
    );
  }

  const carcassMat = materials.find((m) => m.name === selectedProduct.carcassMaterialName);
  const shutterMat = materials.find((m) => m.name === selectedProduct.shutterMaterialName);
  const selectedHw = hardware.find((h) => h.name === selectedProduct.hardwarePackageName);

  const tabs: { id: InspectorTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dimensions', label: 'Dim', icon: <Sliders className="w-3.5 h-3.5" /> },
    { id: 'materials', label: 'Mat', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'hardware', label: 'HW', icon: <Wrench className="w-3.5 h-3.5" /> },
    { id: 'pricing', label: 'Rate', icon: <DollarSign className="w-3.5 h-3.5" /> },
    { id: 'notes', label: 'Notes', icon: <FileText className="w-3.5 h-3.5" /> },
  ];

  return (
    <Card glass className="h-full flex flex-col p-4 space-y-4 border-slate-200 dark:border-slate-800 select-none">
      {/* Property Inspector Header & Tabs */}
      <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Property Inspector
          </h3>
          <Badge variant="cyan">{selectedProduct.category}</Badge>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setInspectorTab(t.id)}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
                inspectorTab === t.id
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Tab Body */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
        {/* DIMENSIONS TAB */}
        {inspectorTab === 'dimensions' && (
          <div className="space-y-3">
            <Input
              label="Product Title"
              value={selectedProduct.name}
              onChange={(e) => updateProduct(selectedProduct.id, { name: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Height (Ft)"
                type="number"
                min="1"
                value={selectedProduct.heightFt}
                onChange={(e) =>
                  updateProduct(selectedProduct.id, { heightFt: parseFloat(e.target.value) || 1 })
                }
                suffixSymbol="ft"
              />
              <Input
                label="Width (Ft)"
                type="number"
                min="1"
                value={selectedProduct.widthFt}
                onChange={(e) =>
                  updateProduct(selectedProduct.id, { widthFt: parseFloat(e.target.value) || 1 })
                }
                suffixSymbol="ft"
              />
            </div>
            <Input
              label="Depth (Inches)"
              type="number"
              min="6"
              max="48"
              value={selectedProduct.depthIn}
              onChange={(e) =>
                updateProduct(selectedProduct.id, { depthIn: parseFloat(e.target.value) || 24 })
              }
              suffixSymbol="in"
            />
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 font-mono text-xs flex justify-between">
              <span className="text-slate-500">Calculated Area:</span>
              <span className="font-bold text-[#00B8B8] dark:text-[#35F5FF]">
                {selectedProduct.areaSqFt.toFixed(2)} sq.ft
              </span>
            </div>
          </div>
        )}

        {/* MATERIALS TAB */}
        {inspectorTab === 'materials' && (
          <div className="space-y-3">
            <Select
              label="Carcass Material"
              value={carcassMat?.id || ''}
              onChange={(val: any) => {
                const value = typeof val === 'string' ? val : val.target.value;
                const mat = materials.find((m) => m.id === value);
                updateProduct(selectedProduct.id, {
                  carcassMaterialId: mat?.id,
                  carcassMaterialName: mat?.name,
                  carcassRateAddon: mat?.rateModifierSqFt || 0,
                });
              }}
              options={[
                { value: '', label: 'Standard Board (Included)' },
                ...materials
                  .filter((m) => m.type === 'carcass' || m.type === 'both')
                  .map((m) => ({ value: m.id, label: `${m.name} (+₹${m.rateModifierSqFt})` })),
              ]}
            />

            <Select
              label="Shutter Finish Material"
              value={shutterMat?.id || ''}
              onChange={(val: any) => {
                const value = typeof val === 'string' ? val : val.target.value;
                const mat = materials.find((m) => m.id === value);
                updateProduct(selectedProduct.id, {
                  shutterMaterialId: mat?.id,
                  shutterMaterialName: mat?.name,
                  shutterRateAddon: mat?.rateModifierSqFt || 0,
                });
              }}
              options={[
                { value: '', label: 'Standard Finish (Included)' },
                ...materials
                  .filter((m) => m.type === 'shutter' || m.type === 'both')
                  .map((m) => ({ value: m.id, label: `${m.name} (+₹${m.rateModifierSqFt})` })),
              ]}
            />
          </div>
        )}

        {/* HARDWARE TAB */}
        {inspectorTab === 'hardware' && (
          <div className="space-y-3">
            <Select
              label="Hardware Package"
              value={selectedHw?.id || ''}
              onChange={(val: any) => {
                const value = typeof val === 'string' ? val : val.target.value;
                const hw = hardware.find((h) => h.id === value);
                updateProduct(selectedProduct.id, {
                  hardwareOptionId: hw?.id,
                  hardwarePackageName: hw?.name,
                  hardwareCostAddon: hw?.packagePricePerUnit || 0,
                });
              }}
              options={[
                { value: '', label: 'Standard Soft-Close Hardware' },
                ...hardware.map((h) => ({
                  value: h.id,
                  label: `${h.brand} - ${h.name} (+₹${h.packagePricePerUnit})`,
                })),
              ]}
            />
          </div>
        )}

        {/* PRICING TAB */}
        {inspectorTab === 'pricing' && (
          <div className="space-y-3">
            <Select
              label="Pricing Model"
              value={selectedProduct.pricingModel}
              onChange={(val: any) => {
                const value = typeof val === 'string' ? val : val.target.value;
                updateProduct(selectedProduct.id, { pricingModel: value as PricingModel });
              }}
              options={[
                { value: 'sqft', label: 'Per Square Foot (sq.ft)' },
                { value: 'running-ft', label: 'Per Running Foot (r.ft)' },
                { value: 'piece', label: 'Per Piece / Fixed' },
                { value: 'manual', label: 'Manual Rate' },
              ]}
            />

            <Input
              label="Base Rate (₹)"
              type="number"
              min="0"
              value={selectedProduct.baseRate}
              onChange={(e) =>
                updateProduct(selectedProduct.id, { baseRate: parseFloat(e.target.value) || 0 })
              }
              prefixSymbol="₹"
            />

            <Input
              label="Quantity"
              type="number"
              min="1"
              value={selectedProduct.quantity}
              onChange={(e) =>
                updateProduct(selectedProduct.id, { quantity: parseInt(e.target.value) || 1 })
              }
            />

            <div className="p-2.5 rounded-xl bg-[#00D9D9]/10 border border-[#00D9D9]/30 text-xs flex justify-between font-mono">
              <span className="text-slate-700 dark:text-slate-300 font-semibold">Effective Rate:</span>
              <span className="font-bold text-[#00B8B8] dark:text-[#35F5FF]">
                {formatINR(selectedProduct.effectiveRatePerUnit)}/sq.ft
              </span>
            </div>
          </div>
        )}

        {/* NOTES TAB */}
        {inspectorTab === 'notes' && (
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-500">Custom Notes & Specs</label>
            <textarea
              rows={5}
              value={selectedProduct.notes || ''}
              onChange={(e) => updateProduct(selectedProduct.id, { notes: e.target.value })}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00D9D9]"
              placeholder="Enter product notes or drawing details..."
            />
          </div>
        )}
      </div>

      {/* DOMINANT GRAND TOTAL BANNER AT BOTTOM OF INSPECTOR */}
      <Card
        glass={false}
        className="relative overflow-hidden bg-gradient-to-br from-[#00D9D9] via-[#00B8B8] to-teal-700 text-slate-950 p-4 rounded-2xl shadow-xl shadow-[#00D9D9]/20 border-none mt-auto"
      >
        <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-slate-950/80">
          <span>Project Grand Total</span>
          <Coins className="w-4 h-4" />
        </div>

        <motion.div
          key={summary.grandTotal}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-2xl font-black font-mono tracking-tight text-slate-950 my-1"
        >
          {formatINR(summary.grandTotal)}
        </motion.div>

        <Button
          variant="secondary"
          size="sm"
          className="w-full mt-2 bg-slate-950 text-white hover:bg-slate-900 font-bold"
          icon={<Send className="w-4 h-4 text-[#00D9D9]" />}
          onClick={() => {
            setPrintPreviewOpen(true);
            addToast({ type: 'success', title: 'Quotation Ready', message: 'Generating printable PDF invoice.' });
          }}
        >
          Generate Quotation
        </Button>
      </Card>
    </Card>
  );
};
