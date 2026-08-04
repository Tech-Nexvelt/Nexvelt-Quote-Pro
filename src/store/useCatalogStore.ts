import { create } from 'zustand';
import { MaterialOption, HardwareOption, ProductCategoryPreset } from '@/types/catalog';
import { DEFAULT_MATERIALS, DEFAULT_HARDWARE, DEFAULT_PRODUCT_PRESETS } from '@/constants/defaultData';
import { LocalStorageAdapter } from '@/storage/localStorageAdapter';

const MAT_KEY = 'ice_catalog_materials';
const HW_KEY = 'ice_catalog_hardware';
const PRESET_KEY = 'ice_catalog_presets';

interface CatalogState {
  materials: MaterialOption[];
  hardware: HardwareOption[];
  presets: ProductCategoryPreset[];

  addMaterial: (mat: Omit<MaterialOption, 'id'>) => void;
  updateMaterial: (id: string, mat: Partial<MaterialOption>) => void;
  deleteMaterial: (id: string) => void;

  addHardware: (hw: Omit<HardwareOption, 'id'>) => void;
  updateHardware: (id: string, hw: Partial<HardwareOption>) => void;
  deleteHardware: (id: string) => void;

  addPreset: (preset: Omit<ProductCategoryPreset, 'id'>) => void;
  updatePreset: (id: string, preset: Partial<ProductCategoryPreset>) => void;
  deletePreset: (id: string) => void;

  resetCatalog: () => void;
}

export const useCatalogStore = create<CatalogState>((set) => ({
  materials: LocalStorageAdapter.getItem<MaterialOption[]>(MAT_KEY, DEFAULT_MATERIALS),
  hardware: LocalStorageAdapter.getItem<HardwareOption[]>(HW_KEY, DEFAULT_HARDWARE),
  presets: LocalStorageAdapter.getItem<ProductCategoryPreset[]>(PRESET_KEY, DEFAULT_PRODUCT_PRESETS),

  addMaterial: (mat) =>
    set((state) => {
      const newMat = { ...mat, id: `mat_${Date.now()}` };
      const updated = [...state.materials, newMat];
      LocalStorageAdapter.setItem(MAT_KEY, updated);
      return { materials: updated };
    }),

  updateMaterial: (id, mat) =>
    set((state) => {
      const updated = state.materials.map((m) => (m.id === id ? { ...m, ...mat } : m));
      LocalStorageAdapter.setItem(MAT_KEY, updated);
      return { materials: updated };
    }),

  deleteMaterial: (id) =>
    set((state) => {
      const updated = state.materials.filter((m) => m.id !== id);
      LocalStorageAdapter.setItem(MAT_KEY, updated);
      return { materials: updated };
    }),

  addHardware: (hw) =>
    set((state) => {
      const newHw = { ...hw, id: `hw_${Date.now()}` };
      const updated = [...state.hardware, newHw];
      LocalStorageAdapter.setItem(HW_KEY, updated);
      return { hardware: updated };
    }),

  updateHardware: (id, hw) =>
    set((state) => {
      const updated = state.hardware.map((h) => (h.id === id ? { ...h, ...hw } : h));
      LocalStorageAdapter.setItem(HW_KEY, updated);
      return { hardware: updated };
    }),

  deleteHardware: (id) =>
    set((state) => {
      const updated = state.hardware.filter((h) => h.id !== id);
      LocalStorageAdapter.setItem(HW_KEY, updated);
      return { hardware: updated };
    }),

  addPreset: (preset) =>
    set((state) => {
      const newPreset = { ...preset, id: `preset_${Date.now()}` };
      const updated = [...state.presets, newPreset];
      LocalStorageAdapter.setItem(PRESET_KEY, updated);
      return { presets: updated };
    }),

  updatePreset: (id, preset) =>
    set((state) => {
      const updated = state.presets.map((p) => (p.id === id ? { ...p, ...preset } : p));
      LocalStorageAdapter.setItem(PRESET_KEY, updated);
      return { presets: updated };
    }),

  deletePreset: (id) =>
    set((state) => {
      const updated = state.presets.filter((p) => p.id !== id);
      LocalStorageAdapter.setItem(PRESET_KEY, updated);
      return { presets: updated };
    }),

  resetCatalog: () => {
    LocalStorageAdapter.setItem(MAT_KEY, DEFAULT_MATERIALS);
    LocalStorageAdapter.setItem(HW_KEY, DEFAULT_HARDWARE);
    LocalStorageAdapter.setItem(PRESET_KEY, DEFAULT_PRODUCT_PRESETS);
    set({
      materials: DEFAULT_MATERIALS,
      hardware: DEFAULT_HARDWARE,
      presets: DEFAULT_PRODUCT_PRESETS,
    });
  },
}));
