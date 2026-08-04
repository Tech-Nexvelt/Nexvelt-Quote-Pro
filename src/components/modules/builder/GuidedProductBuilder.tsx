import React, { useEffect, useState } from 'react';
import { useQuotationStore } from '@/store/useQuotationStore';
import { useCatalogStore } from '@/store/useCatalogStore';
import { useUIStore } from '@/store/useUIStore';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EnlargedHeroVisualizer } from '../visualizer/EnlargedHeroVisualizer';
import { UnitSystem } from '@/types/units';
import { PricingModel } from '@/types/pricing';
import { calculateItemDimensions } from '@/core/engines/measurementEngine';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  Plus,
  Box,
  Layers,
  Wrench,
  DollarSign,
  Eye,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const GuidedProductBuilder: React.FC = () => {
  const { currentQuotation, addItem, updateItem, editingItemId, setEditingItem } = useQuotationStore();
  const { materials, hardware, presets } = useCatalogStore();
  const { addToast } = useUIStore();

  const editingItem = currentQuotation.items.find((i) => i.id === editingItemId);

  // Stepper Stage (1: Product -> 2: Dimensions -> 3: Materials -> 4: Hardware -> 5: Pricing -> 6: Review)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form States
  const [category, setCategory] = useState<string>('Wardrobe');
  const [name, setName] = useState<string>('Master Bedroom Wardrobe');
  const [unit, setUnit] = useState<UnitSystem>('ft-in');

  // Dimension Inputs
  const [heightFeet, setHeightFeet] = useState<number>(8);
  const [heightInches, setHeightInches] = useState<number>(0);
  const [widthFeet, setWidthFeet] = useState<number>(10);
  const [widthInches, setWidthInches] = useState<number>(0);
  const [depthInches, setDepthInches] = useState<number>(24);

  // Pricing & Quantities
  const [pricingModel, setPricingModel] = useState<PricingModel>('sqft');
  const [baseRate, setBaseRate] = useState<number>(1450);
  const [quantity, setQuantity] = useState<number>(1);

  // Material & Hardware selections
  const [carcassMatId, setCarcassMatId] = useState<string>('');
  const [shutterMatId, setShutterMatId] = useState<string>('');
  const [hardwareId, setHardwareId] = useState<string>('');
  const [buyingCost, setBuyingCost] = useState<number>(950);

  // Fill editing item values if editing mode is active
  useEffect(() => {
    if (editingItem) {
      setCategory(editingItem.category);
      setName(editingItem.name);
      setUnit(editingItem.dimensions.unit || 'ft-in');
      setHeightFeet(editingItem.dimensions.feet || Math.floor(editingItem.heightFt));
      setHeightInches(editingItem.dimensions.inches || Math.round((editingItem.heightFt % 1) * 12));
      setWidthFeet(editingItem.dimensions.feet || Math.floor(editingItem.widthFt));
      setWidthInches(editingItem.dimensions.inches || Math.round((editingItem.widthFt % 1) * 12));
      setDepthInches(editingItem.depthIn);
      setPricingModel(editingItem.pricingModel);
      setBaseRate(editingItem.baseRate);
      setQuantity(editingItem.quantity);
      setBuyingCost(editingItem.buyingCostPerUnit || 0);
      setCurrentStep(1);
    }
  }, [editingItemId, editingItem]);

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    const preset = presets.find((p) => p.category === cat);
    if (preset) {
      setName(preset.defaultName);
      setPricingModel(preset.defaultPricingModel);
      setBaseRate(preset.defaultRate);
      setDepthInches(preset.defaultDepthInches);
      if (preset.carcassMaterialId) setCarcassMatId(preset.carcassMaterialId);
      if (preset.shutterMaterialId) setShutterMatId(preset.shutterMaterialId);
      if (preset.hardwareOptionId) setHardwareId(preset.hardwareOptionId);
    }
  };

  const computedDimensions = calculateItemDimensions(
    unit,
    heightFeet,
    heightInches,
    widthFeet,
    widthInches,
    depthInches
  );

  const carcassMat = materials.find((m) => m.id === carcassMatId);
  const shutterMat = materials.find((m) => m.id === shutterMatId);
  const selectedHw = hardware.find((h) => h.id === hardwareId);

  const carcassRateAddon = carcassMat ? carcassMat.rateModifierSqFt : 0;
  const shutterRateAddon = shutterMat ? shutterMat.rateModifierSqFt : 0;
  const hardwareCostAddon = selectedHw ? selectedHw.packagePricePerUnit : 0;

  const effectiveRate = baseRate + carcassRateAddon + shutterRateAddon;
  const lineTotal =
    pricingModel === 'sqft'
      ? (computedDimensions.areaSqFt * effectiveRate + hardwareCostAddon) * quantity
      : pricingModel === 'running-ft'
      ? (computedDimensions.runningLengthFt * effectiveRate + hardwareCostAddon) * quantity
      : (effectiveRate + hardwareCostAddon) * quantity;

  const steps = [
    { num: 1, label: 'Product & Name', icon: <Box className="w-3.5 h-3.5" /> },
    { num: 2, label: 'Dimensions & Visualizer', icon: <Eye className="w-3.5 h-3.5" /> },
    { num: 3, label: 'Materials', icon: <Layers className="w-3.5 h-3.5" /> },
    { num: 4, label: 'Hardware', icon: <Wrench className="w-3.5 h-3.5" /> },
    { num: 5, label: 'Pricing & Qty', icon: <DollarSign className="w-3.5 h-3.5" /> },
    { num: 6, label: 'Review & Save', icon: <Check className="w-3.5 h-3.5" /> },
  ];

  const handleSubmit = () => {
    if (computedDimensions.areaSqFt <= 0 && pricingModel === 'sqft') {
      addToast({ type: 'error', title: 'Invalid Dimensions', message: 'Height and Width must be greater than zero.' });
      return;
    }

    const payload = {
      category,
      name,
      dimensions: { unit, feet: heightFeet, inches: heightInches, decimalFeet: computedDimensions.heightFt, depthInches },
      heightFt: computedDimensions.heightFt,
      widthFt: computedDimensions.widthFt,
      depthIn: depthInches,
      areaSqFt: computedDimensions.areaSqFt,
      runningLengthFt: computedDimensions.runningLengthFt,
      pricingModel,
      baseRate,
      quantity,
      carcassMaterialName: carcassMat ? carcassMat.name : undefined,
      carcassRateAddon,
      shutterMaterialName: shutterMat ? shutterMat.name : undefined,
      shutterRateAddon,
      hardwarePackageName: selectedHw ? selectedHw.name : undefined,
      hardwareCostAddon,
      buyingCostPerUnit: buyingCost,
    };

    if (editingItemId) {
      updateItem(editingItemId, payload);
      addToast({ type: 'success', title: 'Product Updated', message: `${name} updated successfully.` });
    } else {
      addItem(payload);
      addToast({ type: 'success', title: 'Product Added', message: `${name} added to quotation.` });
    }
    setCurrentStep(1);
  };

  return (
    <Card glass className="space-y-6 p-6 border-slate-200 dark:border-slate-800 shadow-md">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#00D9D9]/15 text-[#00B8B8] dark:text-[#35F5FF]">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
              {editingItemId ? 'Edit Product Configuration' : 'Guided Product Configuration Builder'}
            </h3>
            <p className="text-xs text-slate-500">Step-by-step guided configuration with live 300% enlarged 2D visualizer.</p>
          </div>
        </div>
        {editingItemId && (
          <Button variant="ghost" size="sm" onClick={() => setEditingItem(null)}>
            Cancel Edit
          </Button>
        )}
      </div>

      {/* Stepper Navigation Bar */}
      <div className="flex items-center justify-between gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-1.5 rounded-2xl overflow-x-auto">
        {steps.map((st) => {
          const isActive = currentStep === st.num;
          const isDone = currentStep > st.num;
          return (
            <button
              key={st.num}
              onClick={() => setCurrentStep(st.num)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm border border-slate-200/60 dark:border-slate-700/60'
                  : isDone
                  ? 'text-[#00B8B8] dark:text-[#35F5FF]'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isActive
                    ? 'bg-[#00D9D9] text-gray-900'
                    : isDone
                    ? 'bg-[#00B8B8]/20 text-[#00B8B8]'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {isDone ? <Check className="w-3 h-3" /> : st.num}
              </span>
              <span>{st.label}</span>
            </button>
          );
        })}
      </div>

      {/* Step Content Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* STEP 1: Product & Name */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Product Category"
                  value={category}
                  onChange={(val: any) => handleCategoryChange(typeof val === 'string' ? val : val.target.value)}
                  options={[
                    { value: 'Wardrobe', label: 'Wardrobe / Almirah' },
                    { value: 'Cupboard', label: 'Storage Cupboard' },
                    { value: 'TV Unit', label: 'TV Wall Unit' },
                    { value: 'Kitchen', label: 'Modular Kitchen' },
                    { value: 'Crockery Unit', label: 'Crockery / Display' },
                    { value: 'Loft', label: 'Overhead Loft' },
                    { value: 'Pooja Unit', label: 'Pooja Unit / Mandir' },
                    { value: 'Study Unit', label: 'Study Table & Desk' },
                    { value: 'Office Furniture', label: 'Office & Reception' },
                    { value: 'Custom Furniture', label: 'Custom Product' },
                  ]}
                />

                <Input
                  label="Product Description / Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Master Bedroom Wardrobe"
                  required
                />
              </div>

              {/* Preset Shortcuts */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Quick Presets:</label>
                <div className="flex flex-wrap gap-2">
                  {presets.slice(0, 6).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleCategoryChange(p.category)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-medium hover:border-[#00D9D9] transition-colors"
                    >
                      {p.defaultName}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Dimensions & Visualizer (Enlarged 300% Visualizer Positioned Directly Below Inputs) */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase text-slate-500">Unit & Input Measurements</label>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
                  {(['ft-in', 'dec-ft', 'inches', 'mm', 'cm', 'meters'] as UnitSystem[]).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUnit(u)}
                      className={`px-2.5 py-1 rounded-lg transition-colors ${
                        unit === u ? 'bg-[#00D9D9] text-gray-900 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      {u === 'ft-in' ? 'Ft + In' : u.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
                {unit === 'ft-in' ? (
                  <>
                    <Input
                      label="Height (Ft)"
                      type="number"
                      min="0"
                      value={heightFeet}
                      onChange={(e) => setHeightFeet(parseFloat(e.target.value) || 0)}
                      suffixSymbol="ft"
                    />
                    <Input
                      label="Height (In)"
                      type="number"
                      min="0"
                      max="11"
                      value={heightInches}
                      onChange={(e) => setHeightInches(parseFloat(e.target.value) || 0)}
                      suffixSymbol="in"
                    />
                    <Input
                      label="Width (Ft)"
                      type="number"
                      min="0"
                      value={widthFeet}
                      onChange={(e) => setWidthFeet(parseFloat(e.target.value) || 0)}
                      suffixSymbol="ft"
                    />
                    <Input
                      label="Width (In)"
                      type="number"
                      min="0"
                      max="11"
                      value={widthInches}
                      onChange={(e) => setWidthInches(parseFloat(e.target.value) || 0)}
                      suffixSymbol="in"
                    />
                  </>
                ) : (
                  <>
                    <Input
                      label={`Height (${unit})`}
                      type="number"
                      min="0"
                      value={heightFeet}
                      onChange={(e) => setHeightFeet(parseFloat(e.target.value) || 0)}
                      suffixSymbol={unit}
                    />
                    <Input
                      label={`Width (${unit})`}
                      type="number"
                      min="0"
                      value={widthFeet}
                      onChange={(e) => setWidthFeet(parseFloat(e.target.value) || 0)}
                      suffixSymbol={unit}
                    />
                  </>
                )}
                <Input
                  label="Depth (Inches)"
                  type="number"
                  min="6"
                  max="48"
                  value={depthInches}
                  onChange={(e) => setDepthInches(parseFloat(e.target.value) || 24)}
                  suffixSymbol="in"
                />
              </div>

              {/* Hero Enlarged Visualizer Positioned Directly Below Inputs */}
              <div className="pt-2">
                <EnlargedHeroVisualizer
                  category={category}
                  heightFt={computedDimensions.heightFt}
                  widthFt={computedDimensions.widthFt}
                  depthIn={depthInches}
                  carcassMaterial={carcassMat?.name}
                  shutterMaterial={shutterMat?.name}
                  hardwareName={selectedHw?.name}
                />
              </div>
            </div>
          )}

          {/* STEP 3: Materials */}
          {currentStep === 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Carcass Structure Material"
                value={carcassMatId}
                onChange={(val: any) => setCarcassMatId(typeof val === 'string' ? val : val.target.value)}
                options={[
                  { value: '', label: 'Standard Board (Included)' },
                  ...materials
                    .filter((m) => m.type === 'carcass' || m.type === 'both')
                    .map((m) => ({
                      value: m.id,
                      label: `${m.name} ${m.rateModifierSqFt ? `(+₹${m.rateModifierSqFt}/sq.ft)` : ''}`,
                    })),
                ]}
              />

              <Select
                label="Shutter Door Finish Material"
                value={shutterMatId}
                onChange={(val: any) => setShutterMatId(typeof val === 'string' ? val : val.target.value)}
                options={[
                  { value: '', label: 'Standard Finish (Included)' },
                  ...materials
                    .filter((m) => m.type === 'shutter' || m.type === 'both')
                    .map((m) => ({
                      value: m.id,
                      label: `${m.name} ${m.rateModifierSqFt ? `(+₹${m.rateModifierSqFt}/sq.ft)` : ''}`,
                    })),
                ]}
              />
            </div>
          )}

          {/* STEP 4: Hardware */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <Select
                label="Branded Hardware Package"
                value={hardwareId}
                onChange={(val: any) => setHardwareId(typeof val === 'string' ? val : val.target.value)}
                options={[
                  { value: '', label: 'Standard Soft-Close Hardware (Included)' },
                  ...hardware.map((h) => ({
                    value: h.id,
                    label: `${h.brand} - ${h.name} (+₹${h.packagePricePerUnit} flat)`,
                  })),
                ]}
              />
            </div>
          )}

          {/* STEP 5: Pricing & Qty */}
          {currentStep === 5 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Pricing Strategy Model"
                value={pricingModel}
                onChange={(val: any) => setPricingModel((typeof val === 'string' ? val : val.target.value) as PricingModel)}
                options={[
                  { value: 'sqft', label: 'Per Square Foot (sq.ft)' },
                  { value: 'running-ft', label: 'Per Running Foot (r.ft)' },
                  { value: 'piece', label: 'Per Piece / Fixed' },
                  { value: 'manual', label: 'Manual Price' },
                ]}
              />

              <Input
                label="Base Rate (₹)"
                type="number"
                min="0"
                value={baseRate}
                onChange={(e) => setBaseRate(parseFloat(e.target.value) || 0)}
                prefixSymbol="₹"
                required
              />

              <Input
                label="Quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                required
              />
            </div>
          )}

          {/* STEP 6: Review & Add */}
          {currentStep === 6 && (
            <div className="space-y-4 bg-slate-50 dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Review Line Item Summary</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Product:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{name} ({category})</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Dimensions:</span>
                  <span className="font-mono">{computedDimensions.heightFt.toFixed(1)}' × {computedDimensions.widthFt.toFixed(1)}' ({computedDimensions.areaSqFt.toFixed(2)} sq.ft)</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Effective Rate:</span>
                  <span className="font-mono text-[#00B8B8] font-bold">₹{effectiveRate.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Total Amount:</span>
                  <span className="font-mono text-base font-extrabold text-[#00D9D9]">₹{lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Action Footer Navigation Buttons */}
      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
        <Button
          variant="outline"
          size="md"
          disabled={currentStep === 1}
          onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
          icon={<ChevronLeft className="w-4 h-4" />}
        >
          Previous
        </Button>

        {currentStep < 6 ? (
          <Button
            variant="primary"
            size="md"
            onClick={() => setCurrentStep((s) => Math.min(6, s + 1))}
            icon={<ChevronRight className="w-4 h-4" />}
          >
            Next Step
          </Button>
        ) : (
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            icon={editingItemId ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          >
            {editingItemId ? 'Update Line Item' : 'Add Line Item to Quotation'}
          </Button>
        )}
      </div>
    </Card>
  );
};
