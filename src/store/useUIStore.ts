import { create } from 'zustand';

export type NavView =
  | 'builder'
  | 'dashboard'
  | 'customers'
  | 'products'
  | 'catalog'
  | 'company'
  | 'templates'
  | 'reports'
  | 'settings'
  | 'price-list'
  | 'recent-quotes'
  | 'my-templates';

export type WorkspaceMode = 'design' | 'cad' | 'pricing' | 'preview' | 'estimate' | 'review' | 'presentation' | 'print';
export type CADViewMode = 'front' | 'top' | 'side' | 'isometric' | '3d' | 'section';
export type InspectorTab = 'dimensions' | 'materials' | 'hardware' | 'cutlist' | 'pricing' | 'notes';
export type BottomDockTab = 'timeline' | 'cutting_list' | 'cost_breakdown' | 'audit_log' | 'products' | 'validation' | 'history' | 'console';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

interface UIState {
  currentView: NavView;
  theme: 'light';
  isAdvancedDrawerOpen: boolean;
  isCommandPaletteOpen: boolean;
  isPrintPreviewOpen: boolean;
  isResetModalOpen: boolean;

  workspaceMode: WorkspaceMode;
  cadViewMode: CADViewMode;
  inspectorTab: InspectorTab;
  bottomDockTab: BottomDockTab;
  isBottomDockExpanded: boolean;

  toasts: ToastMessage[];

  setCurrentView: (view: NavView) => void;
  setTheme: (theme: 'light') => void;
  toggleTheme: () => void;
  toggleAdvancedDrawer: () => void;

  setWorkspaceMode: (mode: WorkspaceMode) => void;
  setCADViewMode: (mode: CADViewMode) => void;
  setInspectorTab: (tab: InspectorTab) => void;
  setBottomDockTab: (tab: BottomDockTab) => void;
  toggleBottomDock: () => void;

  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
  setPrintPreviewOpen: (open: boolean) => void;
  setResetModalOpen: (open: boolean) => void;

  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set, get) => {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }

  return {
    currentView: 'dashboard',
    theme: 'light',
    isAdvancedDrawerOpen: false,
    isCommandPaletteOpen: false,
    isPrintPreviewOpen: false,
    isResetModalOpen: false,

    workspaceMode: 'design',
    cadViewMode: 'front',
    inspectorTab: 'dimensions',
    bottomDockTab: 'timeline',
    isBottomDockExpanded: false,

    toasts: [],

    setCurrentView: (view) => set({ currentView: view }),
    setTheme: () => set({ theme: 'light' }),
    toggleTheme: () => set({ theme: 'light' }),
    toggleAdvancedDrawer: () => set((state) => ({ isAdvancedDrawerOpen: !state.isAdvancedDrawerOpen })),

    setWorkspaceMode: (mode) => set({ workspaceMode: mode }),
    setCADViewMode: (mode) => set({ cadViewMode: mode }),
    setInspectorTab: (tab) => set({ inspectorTab: tab }),
    setBottomDockTab: (tab) => set({ bottomDockTab: tab }),
    toggleBottomDock: () => set((state) => ({ isBottomDockExpanded: !state.isBottomDockExpanded })),

    setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
    toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
    setPrintPreviewOpen: (open) => set({ isPrintPreviewOpen: open }),
    setResetModalOpen: (open) => set({ isResetModalOpen: open }),

    addToast: (toast) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      set((state) => ({
        toasts: [...state.toasts, { ...toast, id }],
      }));
      setTimeout(() => {
        get().removeToast(id);
      }, 4000);
    },
    removeToast: (id) =>
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      })),
  };
});
