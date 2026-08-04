import React, { useEffect, useState } from 'react';
import { useQuotationStore } from '@/store/useQuotationStore';
import { useCatalogStore } from '@/store/useCatalogStore';
import { useUIStore } from '@/store/useUIStore';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ElevationVisualizer } from '../visualizer/ElevationVisualizer';
import { UnitSystem } from '@/types/units';
import { PricingModel } from '@/types/pricing';
import { calculateItemDimensions } from '@/core/engines/measurementEngine';
import { Plus, Check, RotateCcw, Box, Sparkles } from 'lucide-react';

export const ProductLineForm: React.FC = () => {
  const { currentQuotation, addItem, updateItem, editingItemId, setEditingItem } = useQuotationStore();
  const { materials, hardware, presets } = useCatalogStore();
  const { addToast } = useUIStore();

  const editingItem = currentQuotation.items.find((i) => i.id === editingItemId);

  // Form State
  const spaces = currentQuotation.spaces || [];
  const [spaceId, setSpaceId] = useState<string>(spaces[0]?.id || 'space_general');
  const [category, setCategory] = useState<string>('Wardrobe');
  const [name, setName] = useState<string>('Master Bedroom Wardrobe');
  const [unit, setUnit] = useState<UnitSystem>('ft-in');

  // Dimension Inputs
  const [heightFeet, setHeightFeet] = useState<number>(7);
  const [heightInches, setHeightInches] = useState<number>(6);
  const [widthFeet, setWidthFeet] = useState<number>(6);
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
      if (editingItem.spaceId) setSpaceId(editingItem.spaceId);
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
    }
  }, [editingItemId, editingItem]);

  // Handle Preset selection change
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

  // Calculate live computed area
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (computedDimensions.areaSqFt <= 0 && pricingModel === 'sqft') {
      addToast({
        type: 'error',
        title: 'Invalid Dimensions',
        message: 'Height and Width must be greater than zero.',
      });
      return;
    }

    const currentSpaceObj = spaces.find((s) => s.id === spaceId);

    const payload = {
      spaceId: spaceId || 'space_general',
      spaceName: currentSpaceObj?.spaceName || 'General',
      category,
      name,
      dimensions: {
        unit,
        feet: heightFeet,
        inches: heightInches,
        decimalFeet: computedDimensions.heightFt,
        depthInches,
      },
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
      addToast({ type: 'success', title: 'Product Updated', message: `${name} modified successfully.` });
    } else {
      addItem(payload);
      addToast({ type: 'success', title: 'Product Added', message: `${name} added to quotation.` });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 2-Column Section: Product Form + 2D Elevation Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input Section */}
        <div className="lg:col-span-7 space-y-5">
          <Card glass className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-[#00D9D9]" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {editingItemId ? 'Edit Product Line Item' : 'Add Product Line Item'}
                </h3>
              </div>
              {editingItemId && (
                <Button variant="ghost" size="sm" onClick={() => setEditingItem(null)}>
                  Cancel Edit
                </Button>
              )}
            </div>

            {/* Space, Product Category & Title */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select
                label="Target Space"
                value={spaceId}
                onChange={(val: any) => setSpaceId(typeof val === 'string' ? val : val.target.value)}
                options={
                  spaces.length > 0
                    ? spaces.map((s) => ({ value: s.id, label: `${s.spaceName} (${s.spaceType})` }))
                    : [{ value: 'space_general', label: 'General Space' }]
                }
              />

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
                id="product-name-input"
                required
              />
            </div>

            {/* Unit Measurement System */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Measurement Unit & Dimensions
                </label>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-semibold">
                  {(['ft-in', 'dec-ft', 'inches', 'mm', 'cm', 'meters'] as UnitSystem[]).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUnit(u)}
                      className={`px-2 py-1 rounded-md transition-colors ${
                        unit === u
                          ? 'bg-[#00D9D9] text-gray-900 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      {u === 'ft-in' ? 'Ft + In' : u === 'dec-ft' ? 'Dec Ft' : u.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Dimension Inputs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/70 dark:border-slate-800/70">
                {unit === 'ft-in' ? (
                  <>
                    <Input
                      label="Height (Ft)"
                      type="number"
                      min="0"
                      step="1"
                      value={heightFeet}
                      onChange={(e) => setHeightFeet(parseFloat(e.target.value) || 0)}
                      suffixSymbol="ft"
                    />
                    <Input
                      label="Height (In)"
                      type="number"
                      min="0"
                      max="11"
                      step="1"
                      value={heightInches}
                      onChange={(e) => setHeightInches(parseFloat(e.target.value) || 0)}
                      suffixSymbol="in"
                    />
                    <Input
                      label="Width (Ft)"
                      type="number"
                      min="0"
                      step="1"
                      value={widthFeet}
                      onChange={(e) => setWidthFeet(parseFloat(e.target.value) || 0)}
                      suffixSymbol="ft"
                    />
                    <Input
                      label="Width (In)"
                      type="number"
                      min="0"
                      max="11"
                      step="1"
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
                      step="0.1"
                      value={heightFeet}
                      onChange={(e) => setHeightFeet(parseFloat(e.target.value) || 0)}
                      suffixSymbol={unit}
                    />
                    <Input
                      label={`Width (${unit})`}
                      type="number"
                      min="0"
                      step="0.1"
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

              {/* Calculated Area Indicator Badge */}
              <div className="flex items-center justify-between bg-[#00D9D9]/10 border border-[#00D9D9]/30 p-2.5 rounded-xl text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Calculated Surface Area:
                </span>
                <span className="font-mono font-bold text-[#00B8B8] dark:text-[#35F5FF] text-sm">
                  {computedDimensions.areaSqFt.toFixed(2)} sq.ft ({computedDimensions.heightFt.toFixed(2)}' H × {computedDimensions.widthFt.toFixed(2)}' W)
                </span>
              </div>
            </div>

            {/* Pricing Model & Rates */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select
                label="Pricing Model"
                value={pricingModel}
                onChange={(val: any) => setPricingModel((typeof val === 'string' ? val : val.target.value) as PricingModel)}
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

            {/* Carcass & Shutter Material Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-100 dark:border-slate-800 pt-3">
              <Select
                label="Carcass Material (Structure)"
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
                label="Shutter Finish (External Door)"
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

            {/* Hardware Selection & Optional Cost Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Hardware Fittings Package"
                value={hardwareId}
                onChange={(val: any) => setHardwareId(typeof val === 'string' ? val : val.target.value)}
                options={[
                  { value: '', label: 'Standard Soft-Close Hardware' },
                  ...hardware.map((h) => ({
                    value: h.id,
                    label: `${h.brand} - ${h.name} (+₹${h.packagePricePerUnit})`,
                  })),
                ]}
              />

              <Input
                label="Buying Cost Price (Optional for Profit)"
                type="number"
                min="0"
                value={buyingCost}
                onChange={(e) => setBuyingCost(parseFloat(e.target.value) || 0)}
                prefixSymbol="₹"
                helperText="Used for profit margin analysis"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                icon={editingItemId ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              >
                {editingItemId ? 'Update Line Item' : 'Add Line Item to Quotation'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Section: Dynamic 2D SVG Elevation Visualizer */}
        <div className="lg:col-span-5 space-y-4">
          <ElevationVisualizer
            category={category}
            heightFt={computedDimensions.heightFt}
            widthFt={computedDimensions.widthFt}
            depthIn={depthInches}
            carcassMaterial={carcassMat?.name}
            shutterMaterial={shutterMat?.name}
            hardwareName={selectedHw?.name}
            quantity={quantity}
          />

          <Card glass className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
              <span>Effective Rate / Unit:</span>
              <span className="font-mono text-[#00B8B8] dark:text-[#35F5FF]">
                ₹{effectiveRate.toFixed(2)} / {pricingModel === 'sqft' ? 'sq.ft' : pricingModel === 'running-ft' ? 'r.ft' : 'pc'}
              </span>
            </div>
            <div className="flex items-center justify-between font-bold text-sm text-slate-900 dark:text-slate-100 border-t border-slate-200 dark:border-slate-800 pt-2">
              <span>Line Item Total:</span>
              <span className="font-mono text-lg text-[#00D9D9]">
                ₹{lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
};
