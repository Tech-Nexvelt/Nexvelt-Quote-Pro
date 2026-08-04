import React, { useState } from 'react';
import { useProjectStore } from '@/store/useProjectStore';
import { useCatalogStore } from '@/store/useCatalogStore';
import { useUIStore } from '@/store/useUIStore';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { formatINR } from '@/utils/currency';
import { Sliders, Maximize2, Box } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { CADVisualizerCanvas } from '@/components/canvas/CADVisualizerCanvas';
import { CADViewMode } from '@/types/project';

export const QuickDimensionCard: React.FC = () => {
  const { project, selectedProductId, updateProduct } = useProjectStore();
  const { materials } = useCatalogStore();
  const { cadViewMode, setCADViewMode } = useUIStore();
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);

  const selectedProduct = project.products.find((p) => p.id === selectedProductId);

  // Empty State if no product is selected
  if (!selectedProduct) {
    return (
      <Card glass={false} className="bg-white border border-[#E5E7EB] p-8 text-center rounded-[18px] shadow-xs space-y-3">
        <div className="w-16 h-16 rounded-full bg-[#E0F7F7] text-[#00B8B8] flex items-center justify-center mx-auto">
          <Box className="w-8 h-8" />
        </div>
        <h3 className="text-base font-extrabold text-[#111827]">No Furniture Selected</h3>
        <p className="text-xs text-[#6B7280]">Click any furniture template above to start customizing dimensions and materials.</p>
      </Card>
    );
  }

  // Dynamic Live Calculation Values
  const h = selectedProduct.heightFt;
  const hFeet = Math.floor(h);
  const hInches = Math.round((h - hFeet) * 12);

  const w = selectedProduct.widthFt;
  const wFeet = Math.floor(w);
  const wInches = Math.round((w - wFeet) * 12);

  const d = selectedProduct.depthIn;

  const catSafe = (selectedProduct.category || '').toLowerCase();
  const previewImg =
    selectedProduct.previewImage ||
    (catSafe.includes('tv')
      ? '/furniture/tv_unit_floating.png'
      : catSafe.includes('kitchen')
      ? '/furniture/kitchen_lshape.png'
      : catSafe.includes('pooja')
      ? '/furniture/pooja_unit_teak.png'
      : catSafe.includes('study')
      ? '/furniture/study_table_book.png'
      : catSafe.includes('storage')
      ? '/furniture/shoe_cabinet_entry.png'
      : '/furniture/wardrobe_4door.png');

  const views: { id: CADViewMode; label: string }[] = [
    { id: 'front', label: 'Front' },
    { id: 'side', label: 'Side' },
    { id: 'top', label: 'Top' },
    { id: 'isometric', label: 'Iso' },
    { id: 'section', label: 'Section' },
  ];

  const categoryOptions = [
    { value: 'Wardrobe', label: 'Wardrobe' },
    { value: 'Kitchen', label: 'Kitchen' },
    { value: 'TV Unit', label: 'TV Unit' },
    { value: 'Pooja Unit', label: 'Pooja Unit' },
    { value: 'Storage', label: 'Storage' },
    { value: 'Study', label: 'Study' },
    { value: 'Bed', label: 'Bed' },
    { value: 'Custom', label: 'Custom' },
  ];

  const materialOptions = [
    { value: '18mm HDMR with Premium Laminate', label: '18mm HDMR with Premium Laminate' },
    { value: '2mm Anti-Scratch Acrylic Finish', label: '2mm Anti-Scratch Acrylic Finish' },
    { value: 'PU Matt Lacquer Polish Finish', label: 'PU Matt Lacquer Polish Finish' },
    { value: 'Natural Teak Wood Veneer Finish', label: 'Natural Teak Wood Veneer Finish' },
  ];

  return (
    <Card className="space-y-4 select-none">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#E0F7F7] text-[#00B8B8]">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-[20px] font-extrabold text-[#111827] leading-tight">
              Edit Item: <span className="text-[#00B8B8]">{selectedProduct.name}</span>
            </h2>
            <p className="text-[13px] text-[#6B7280] font-medium mt-0.5">
              Adjust height, width, depth, material finish, and pricing.
            </p>
          </div>
        </div>

        {/* Dynamic Calculated Area Badge */}
        <span className="text-xs font-mono font-bold text-[#00B8B8] bg-[#E0F7F7] px-3 py-1.5 rounded-full">
          Area: {selectedProduct.areaSqFt.toFixed(2)} sq.ft
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 8 Cols: Input Controls */}
        <div className="lg:col-span-8 space-y-3.5">
          {/* Row 1: Item Title & Custom Select Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[13px] font-medium text-[#6B7280] block mb-1.5">Item Title</label>
              <input
                type="text"
                value={selectedProduct.name}
                onChange={(e) => updateProduct(selectedProduct.id, { name: e.target.value })}
                className="w-full h-12 text-sm font-semibold text-[#111827] bg-white border border-[#D1D5DB] rounded-xl px-3.5 focus:outline-none focus:border-[#00D9D9] focus:ring-2 focus:ring-[#00D9D9]/20"
              />
            </div>
            <div>
              <Select
                label="Category"
                value={selectedProduct.category}
                onChange={(cat) => updateProduct(selectedProduct.id, { category: cat })}
                options={categoryOptions}
              />
            </div>
          </div>

          {/* Row 2: Height, Width, Depth, Quantity */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Height (ft + in) */}
            <div>
              <label className="text-[13px] font-medium text-[#6B7280] block mb-1.5">Height (ft)</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  step="0.5"
                  value={hFeet}
                  onChange={(e) => {
                    const feet = Math.max(1, parseFloat(e.target.value) || 0);
                    updateProduct(selectedProduct.id, { heightFt: feet + hInches / 12 });
                  }}
                  className="w-16 h-12 text-sm font-bold text-[#111827] bg-white border border-[#D1D5DB] rounded-xl text-center focus:border-[#00D9D9]"
                />
                <span className="text-xs text-[#6B7280] font-semibold">ft</span>
                <input
                  type="number"
                  min="0"
                  max="11"
                  value={hInches}
                  onChange={(e) => {
                    const inches = Math.max(0, Math.min(11, parseFloat(e.target.value) || 0));
                    updateProduct(selectedProduct.id, { heightFt: hFeet + inches / 12 });
                  }}
                  className="w-12 h-12 text-sm font-bold text-[#111827] bg-white border border-[#D1D5DB] rounded-xl text-center focus:border-[#00D9D9]"
                />
                <span className="text-xs text-[#6B7280] font-semibold">in</span>
              </div>
            </div>

            {/* Width (ft + in) */}
            <div>
              <label className="text-[13px] font-medium text-[#6B7280] block mb-1.5">Width (ft)</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  step="0.5"
                  value={wFeet}
                  onChange={(e) => {
                    const feet = Math.max(1, parseFloat(e.target.value) || 0);
                    updateProduct(selectedProduct.id, { widthFt: feet + wInches / 12 });
                  }}
                  className="w-16 h-12 text-sm font-bold text-[#111827] bg-white border border-[#D1D5DB] rounded-xl text-center focus:border-[#00D9D9]"
                />
                <span className="text-xs text-[#6B7280] font-semibold">ft</span>
                <input
                  type="number"
                  min="0"
                  max="11"
                  value={wInches}
                  onChange={(e) => {
                    const inches = Math.max(0, Math.min(11, parseFloat(e.target.value) || 0));
                    updateProduct(selectedProduct.id, { widthFt: wFeet + inches / 12 });
                  }}
                  className="w-12 h-12 text-sm font-bold text-[#111827] bg-white border border-[#D1D5DB] rounded-xl text-center focus:border-[#00D9D9]"
                />
                <span className="text-xs text-[#6B7280] font-semibold">in</span>
              </div>
            </div>

            {/* Depth (inches) */}
            <div>
              <label className="text-[13px] font-medium text-[#6B7280] block mb-1.5">Depth (inches)</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  value={d}
                  onChange={(e) => updateProduct(selectedProduct.id, { depthIn: Math.max(6, parseFloat(e.target.value) || 6) })}
                  className="w-full h-12 text-sm font-bold text-[#111827] bg-white border border-[#D1D5DB] rounded-xl text-center focus:border-[#00D9D9]"
                />
                <span className="text-xs text-[#6B7280] font-semibold">in</span>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="text-[13px] font-medium text-[#6B7280] block mb-1.5">Quantity</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="1"
                  value={selectedProduct.quantity}
                  onChange={(e) => updateProduct(selectedProduct.id, { quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                  className="w-full h-12 text-sm font-bold text-[#111827] bg-white border border-[#D1D5DB] rounded-xl text-center focus:border-[#00D9D9]"
                />
                <span className="text-xs text-[#6B7280] font-semibold">Nos</span>
              </div>
            </div>
          </div>

          {/* Row 3: Material / Finish (Custom Select), Rate, Total Area, Amount */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <Select
                label="Material / Finish"
                value={selectedProduct.shutterMaterialName || '18mm HDMR with Premium Laminate'}
                onChange={(mat) => updateProduct(selectedProduct.id, { shutterMaterialName: mat })}
                options={materialOptions}
              />
            </div>

            <div>
              <label className="text-[13px] font-medium text-[#6B7280] block mb-1.5">Rate (₹ / sq.ft)</label>
              <input
                type="number"
                value={selectedProduct.baseRate}
                onChange={(e) => updateProduct(selectedProduct.id, { baseRate: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="w-full h-12 text-sm font-bold text-[#111827] bg-white border border-[#D1D5DB] rounded-xl px-3 font-mono focus:border-[#00D9D9]"
              />
            </div>

            <div>
              <label className="text-[13px] font-medium text-[#6B7280] block mb-1.5">Total Area</label>
              <div className="w-full h-12 text-sm font-bold text-[#111827] bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl px-3 flex items-center font-mono">
                {selectedProduct.areaSqFt.toFixed(2)} sq.ft
              </div>
            </div>

            <div>
              <label className="text-[13px] font-medium text-[#6B7280] block mb-1.5">Amount</label>
              <div className="w-full h-12 text-sm font-extrabold text-[#00B8B8] bg-[#E0F7F7]/60 border border-[#00D9D9]/30 rounded-xl px-3 flex items-center font-mono">
                {formatINR(selectedProduct.lineSubtotal)}
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Light Graphic Preview Container (Synchronized with selected view mode & dynamic dimensions) */}
        <div className="lg:col-span-4 flex flex-col justify-between p-4 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] space-y-3">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-[#6B7280]">Graphic Preview</span>
            <span className="text-[#00B8B8] font-bold font-mono">
              {h.toFixed(1)}' H × {w.toFixed(1)}' W × {d}" D
            </span>
          </div>

          {/* Inline Synchronized View Switcher */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E5E7EB] text-[11px] font-semibold">
            {views.map((v) => (
              <button
                key={v.id}
                onClick={() => setCADViewMode(v.id)}
                className={`flex-1 py-1 rounded-lg transition-all ${
                  cadViewMode === v.id
                    ? 'bg-[#00D9D9] text-white font-bold shadow-xs'
                    : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F8FAFC]'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          {/* Furniture Image Preview Render */}
          <div className="h-36 w-full rounded-xl bg-white border border-[#E5E7EB] overflow-hidden relative shadow-2xs">
            <img
              src={previewImg}
              alt={selectedProduct.name}
              className="w-full h-full object-cover transition-opacity duration-200"
            />
          </div>

          <button
            onClick={() => setIsPreviewExpanded(true)}
            className="w-full h-11 rounded-xl border border-[#00D9D9] bg-white hover:bg-[#E0F7F7] text-[#00B8B8] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
          >
            <Maximize2 className="w-4 h-4 text-[#00B8B8]" />
            <span>Expand Full Preview</span>
          </button>
        </div>
      </div>

      {/* Full Screen Synchronized CAD Preview Modal */}
      {isPreviewExpanded && (
        <Modal
          isOpen={isPreviewExpanded}
          onClose={() => setIsPreviewExpanded(false)}
          title={`CAD Preview — ${selectedProduct.name}`}
          subtitle="Full 2D CAD elevation drawing with scale dimensions and handles"
          maxWidth="2xl"
        >
          <div className="h-[400px]">
            <CADVisualizerCanvas />
          </div>
        </Modal>
      )}
    </Card>
  );
};
