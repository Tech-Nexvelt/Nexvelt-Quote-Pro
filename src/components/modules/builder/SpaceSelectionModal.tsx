import React, { useState } from 'react';
import { useQuotationStore } from '@/store/useQuotationStore';
import { useCatalogStore } from '@/store/useCatalogStore';
import { SPACE_TYPES, SPACE_TYPE_NAME_PRESETS, SpaceType } from '@/types/spaces';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Layers, Plus, Check, ChevronRight, Sparkles, X, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SpaceSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetSpaceId?: string | null;
  onSelectComplete: (spaceId: string, itemType: string) => void;
}

export const SpaceSelectionModal: React.FC<SpaceSelectionModalProps> = ({
  isOpen,
  onClose,
  targetSpaceId,
  onSelectComplete,
}) => {
  const { currentQuotation, addSpace } = useQuotationStore();
  const { presets } = useCatalogStore();

  const spaces = currentQuotation.spaces || [];
  const existingSpace = targetSpaceId ? spaces.find((s) => s.id === targetSpaceId) : null;

  // Multi-step modal state
  // Step 1: Space Type Selection (if not contextual)
  // Step 2: Space Name Input / Selection
  // Step 3: Item Type Selection
  const [step, setStep] = useState<number>(existingSpace ? 3 : 1);
  const [selectedSpaceType, setSelectedSpaceType] = useState<SpaceType>('Master Bedroom');
  const [spaceName, setSpaceName] = useState<string>('Master Bedroom');
  const [chosenSpaceId, setChosenSpaceId] = useState<string>(targetSpaceId || '');
  const [selectedItemType, setSelectedItemType] = useState<string>('Box Work');

  // Available Item Types from catalog presets or default list
  const defaultCategories = [
    'Box Work',
    'Frame Work',
    'Wall Panel',
    'Countertop',
    'Loft',
    'TV Unit',
    'Wardrobe',
    'Partition',
    'False Ceiling',
    'Accessories',
    'Hardware',
  ];
  const catalogCategories = Array.from(new Set(presets.map((p) => p.category)));
  const itemTypes = Array.from(new Set([...defaultCategories, ...catalogCategories]));

  if (!isOpen) return null;

  const handleSpaceTypeSelect = (st: SpaceType) => {
    setSelectedSpaceType(st);
    const presetsForType = SPACE_TYPE_NAME_PRESETS[st] || [];
    if (presetsForType.length > 0) {
      setSpaceName(presetsForType[0]);
    } else {
      setSpaceName(`${st} Space`);
    }
    setStep(2);
  };

  const handleSpaceConfirm = () => {
    if (!spaceName.trim()) return;

    // Check if space with exact name already exists
    const existing = spaces.find(
      (s) => s.spaceName.toLowerCase() === spaceName.trim().toLowerCase()
    );

    let sid = chosenSpaceId;
    if (existing) {
      sid = existing.id;
    } else {
      const created = addSpace({
        spaceType: selectedSpaceType,
        spaceName: spaceName.trim(),
      });
      sid = created.id;
    }

    setChosenSpaceId(sid);
    setStep(3);
  };

  const handleFinalSubmit = (itemType: string) => {
    let sid = chosenSpaceId;
    if (!sid) {
      // Create space if step 3 reached directly
      const created = addSpace({
        spaceType: selectedSpaceType,
        spaceName: spaceName.trim() || 'General',
      });
      sid = created.id;
    }

    onSelectComplete(sid, itemType);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#00D9D9]/20 text-[#00D9D9]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {existingSpace ? `Add Product to ${existingSpace.spaceName}` : 'Add New Item to Project'}
              </h3>
              <p className="text-xs text-slate-400">
                {existingSpace ? 'Select Item Type to insert into space' : 'Select Space and Item Type hierarchy'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Breadcrumb */}
        {!existingSpace && (
          <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs font-semibold">
            <span className={step >= 1 ? 'text-[#00B8B8]' : 'text-slate-400'}>1. Select Space Type</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className={step >= 2 ? 'text-[#00B8B8]' : 'text-slate-400'}>2. Space Name</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className={step >= 3 ? 'text-[#00B8B8]' : 'text-slate-400'}>3. Select Item Type</span>
          </div>
        )}

        {/* Body Steps */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* STEP 1: Select Space Type */}
          {step === 1 && !existingSpace && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Step 1: Select Space Category / Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {SPACE_TYPES.map((st) => (
                  <button
                    key={st}
                    onClick={() => handleSpaceTypeSelect(st)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                      selectedSpaceType === st
                        ? 'border-[#00D9D9] bg-[#00D9D9]/10 text-slate-900 dark:text-slate-100 font-semibold shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-sm font-medium">{st}</span>
                    <span className="text-[10px] text-slate-500">
                      {SPACE_TYPE_NAME_PRESETS[st]?.[0] || 'Custom'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Space Name Input & Suggestions */}
          {step === 2 && !existingSpace && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Step 2: Enter or Choose Space Name
                </label>
                <Input
                  value={spaceName}
                  onChange={(e) => setSpaceName(e.target.value)}
                  placeholder="e.g. Master Bedroom, Wet Kitchen, CEO Cabin..."
                  className="w-full text-base font-semibold"
                  autoFocus
                />
              </div>

              {/* Suggestions */}
              <div>
                <span className="text-xs text-slate-500 font-medium block mb-2">
                  Quick Name Presets for {selectedSpaceType}:
                </span>
                <div className="flex flex-wrap gap-2">
                  {(SPACE_TYPE_NAME_PRESETS[selectedSpaceType] || []).map((presetName) => (
                    <button
                      key={presetName}
                      onClick={() => setSpaceName(presetName)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                        spaceName === presetName
                          ? 'border-[#00D9D9] bg-[#00D9D9]/20 text-[#00B8B8] font-bold'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {presetName}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button variant="primary" size="sm" onClick={handleSpaceConfirm}>
                  Next: Select Item Type <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Select Item Type */}
          {(step === 3 || existingSpace) && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select Item Type to Create
                </label>
                {spaceName && (
                  <Badge variant="cyan" className="text-xs">
                    Space: {existingSpace ? existingSpace.spaceName : spaceName}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {itemTypes.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedItemType(cat);
                      handleFinalSubmit(cat);
                    }}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#00D9D9] hover:bg-[#00D9D9]/10 text-slate-800 dark:text-slate-200 text-left text-xs font-bold transition-all flex items-center justify-between group"
                  >
                    <span>{cat}</span>
                    <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#00B8B8] transition-colors" />
                  </button>
                ))}
              </div>

              {!existingSpace && (
                <div className="pt-2">
                  <Button variant="outline" size="sm" onClick={() => setStep(2)}>
                    Back to Space Name
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
