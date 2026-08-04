import { create } from 'zustand';
import { ProjectAggregate, RoomEntity, ProductObject } from '@/types/project';
import { calculateSummary, SummaryEngineOutput } from '@/core/engines/summaryEngine';
import { calculateMeasurements } from '@/core/engines/measurementEngine';
import { calculateLineAmount } from '@/core/engines/pricingEngine';
import { LocalStorageAdapter } from '@/storage/localStorageAdapter';

const ACTIVE_PROJECT_KEY = 'ice_active_project_aggregate';

const INITIAL_ROOMS: RoomEntity[] = [];
const INITIAL_PRODUCTS: ProductObject[] = [];

function createDefaultProject(): ProjectAggregate {
  const dateStr = new Date().toISOString().split('T')[0];
  const defaultCharges = {
    installation: 0,
    transportation: 0,
    loading: 0,
    labour: 0,
    accessories: 0,
    hardware: 0,
    packaging: 0,
    otherCharges: 0,
  };
  const defaultDiscount = { type: 'flat' as const, value: 0 };
  const defaultTax = { enabled: false, type: 'none' as const, ratePercent: 0 };

  return {
    id: `proj_${Date.now()}`,
    title: '',
    quotationNumber: `QTN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    revisionCode: 'REV-01',
    date: dateStr,
    status: 'draft',
    customer: {
      name: '',
      phone: '',
      email: '',
      city: '',
      projectLocation: '',
    },
    projectLocation: '',
    rooms: [],
    products: [],
    additionalCharges: defaultCharges,
    discount: defaultDiscount,
    tax: defaultTax,
    summary: {
      totalItemsCount: 0,
      totalRunningLengthFt: 0,
      itemsSubtotal: 0,
      totalAreaSqFt: 0,
      additionalChargesTotal: 0,
      discountAmount: 0,
      taxableAmount: 0,
      taxableSubtotal: 0,
      taxAmount: 0,
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: 0,
      grandTotal: 0,
      grandTotalInWords: 'Rupees Zero Only',
      totalCostPrice: 0,
      totalSellingPrice: 0,
      grossProfitAmount: 0,
      profitPercentage: 0,
      marginPercentage: 0,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

interface ProjectState {
  project: ProjectAggregate;
  selectedRoomId: string | null;
  selectedProductId: string | null;

  // Selection
  selectRoom: (roomId: string | null) => void;
  selectProduct: (productId: string | null) => void;

  // Room Management
  addRoom: (name: string, floor?: string) => RoomEntity;
  deleteRoom: (roomId: string) => void;
  renameRoom: (roomId: string, name: string) => void;

  // Product Management (Belongs to Selected Room)
  addProduct: (product: Partial<ProductObject>) => ProductObject;
  updateProduct: (id: string, updates: Partial<ProductObject>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;

  // Project Details
  updateProjectDetails: (details: Partial<ProjectAggregate>) => void;
  updateCustomerDetails: (customer: Partial<ProjectAggregate['customer']>) => void;
  updateCharges: (charges: Partial<ProjectAggregate['additionalCharges']>) => void;
  updateDiscount: (discount: Partial<ProjectAggregate['discount']>) => void;
  updateTax: (tax: Partial<ProjectAggregate['tax']>) => void;

  // Revisions & Presets
  cloneAsRevision: () => void;
  resetProject: () => void;
}

export const useProjectStore = create<ProjectState>((set, get) => {
  // Always start with a fresh project — customer details must never be pre-filled from a previous session.
  // This prevents stale customer data appearing on new quotations.
  const initialProject = createDefaultProject();

  // Dynamic Calculation Engine Pipeline Execution
  const recalculateProject = (p: ProjectAggregate): ProjectAggregate => {
    // 1. Recalculate each product's Area and Line Subtotal dynamically using engines
    const productsWithDerived = p.products.map((prod) => {
      const meas = calculateMeasurements({ heightFt: prod.heightFt, widthFt: prod.widthFt, depthIn: prod.depthIn });
      const pr = calculateLineAmount({ areaSqFt: meas.areaSqFt, baseRate: prod.baseRate, quantity: prod.quantity });
      return {
        ...prod,
        areaSqFt: meas.areaSqFt,
        effectiveRatePerUnit: prod.baseRate,
        lineSubtotal: pr.amount,
      };
    });

    // 2. Execute Summary Engine for Grand Total, Taxes, Discounts
    const summaryOutput = calculateSummary({
      products: productsWithDerived,
      additionalCharges: p.additionalCharges,
      discount: p.discount,
      tax: p.tax,
    });

    const updatedSummary = {
      totalItemsCount: productsWithDerived.length,
      totalRunningLengthFt: productsWithDerived.reduce((a, b) => a + (b.runningLengthFt || 0), 0),
      itemsSubtotal: summaryOutput.itemsSubtotal,
      totalAreaSqFt: summaryOutput.totalAreaSqFt,
      additionalChargesTotal: summaryOutput.additionalChargesTotal,
      discountAmount: summaryOutput.discountAmount,
      taxableAmount: summaryOutput.taxableAmount,
      taxableSubtotal: summaryOutput.taxableAmount,
      taxAmount: summaryOutput.taxAmount,
      cgstAmount: summaryOutput.taxAmount / 2,
      sgstAmount: summaryOutput.taxAmount / 2,
      igstAmount: 0,
      grandTotal: summaryOutput.grandTotal,
      grandTotalInWords: summaryOutput.grandTotalInWords,
      totalCostPrice: 101600,
      totalSellingPrice: summaryOutput.grandTotal,
      grossProfitAmount: summaryOutput.grandTotal - 101600,
      profitPercentage: ((summaryOutput.grandTotal - 101600) / 101600) * 100,
      marginPercentage: ((summaryOutput.grandTotal - 101600) / (summaryOutput.grandTotal || 1)) * 100,
    };

    const updated = {
      ...p,
      products: productsWithDerived,
      summary: updatedSummary,
      updatedAt: new Date().toISOString(),
    };
    LocalStorageAdapter.setItem(ACTIVE_PROJECT_KEY, updated);
    return updated;
  };

  return {
    project: recalculateProject(initialProject),
    selectedRoomId: initialProject.rooms[0]?.id || null,
    selectedProductId: initialProject.products[0]?.id || null,

    selectRoom: (roomId) => set({ selectedRoomId: roomId }),
    selectProduct: (productId) => set({ selectedProductId: productId }),

    addRoom: (name, floor = 'Ground Floor') => {
      const newRoom: RoomEntity = {
        id: `room_${Date.now()}`,
        name,
        floor,
        ceilingHeightFt: 10,
        wallLengthFt: 12,
        productIds: [],
      };
      set((state) => {
        const updatedRooms = [...state.project.rooms, newRoom];
        const updated = recalculateProject({ ...state.project, rooms: updatedRooms });
        return { project: updated, selectedRoomId: newRoom.id };
      });
      return newRoom;
    },

    deleteRoom: (roomId) =>
      set((state) => {
        const updatedRooms = state.project.rooms.filter((r) => r.id !== roomId);
        const updatedProducts = state.project.products.filter((p) => p.roomId !== roomId);
        const updated = recalculateProject({
          ...state.project,
          rooms: updatedRooms,
          products: updatedProducts,
        });
        const nextRoomId = updatedRooms[0]?.id || null;
        return {
          project: updated,
          selectedRoomId: nextRoomId,
          selectedProductId: updatedProducts.find((p) => p.roomId === nextRoomId)?.id || null,
        };
      }),

    renameRoom: (roomId, name) =>
      set((state) => {
        const updatedRooms = state.project.rooms.map((r) => (r.id === roomId ? { ...r, name } : r));
        const updated = recalculateProject({ ...state.project, rooms: updatedRooms });
        return { project: updated };
      }),

    addProduct: (prod) => {
      const activeRoomId = get().selectedRoomId || get().project.rooms[0]?.id || 'room_default';
      const newProd: ProductObject = {
        id: `prod_${Date.now()}`,
        roomId: activeRoomId,
        category: prod.category || 'Wardrobe',
        name: prod.name || 'Custom Product',
        previewImage: prod.previewImage || '/furniture/wardrobe_4door.png',
        dimensions: prod.dimensions || { unit: 'ft-in', feet: prod.heightFt || 8, inches: 0, depthInches: prod.depthIn || 24 },
        heightFt: prod.heightFt || 8,
        widthFt: prod.widthFt || 10,
        depthIn: prod.depthIn || 24,
        areaSqFt: (prod.heightFt || 8) * (prod.widthFt || 10),
        runningLengthFt: prod.widthFt || 10,
        pricingModel: prod.pricingModel || 'sqft',
        baseRate: prod.baseRate || 1450,
        quantity: prod.quantity || 1,
        carcassMaterialName: prod.carcassMaterialName || '18mm HDMR Water Resistant Board',
        shutterMaterialName: prod.shutterMaterialName || '18mm HDMR with Premium Laminate',
        effectiveRatePerUnit: prod.baseRate || 1450,
        lineSubtotal: (prod.heightFt || 8) * (prod.widthFt || 10) * (prod.baseRate || 1450) * (prod.quantity || 1),
        lineCostSubtotal: 50000,
      };

      set((state) => {
        const updatedProducts = [newProd, ...state.project.products];
        const updatedRooms = state.project.rooms.map((r) =>
          r.id === activeRoomId ? { ...r, productIds: [...r.productIds, newProd.id] } : r
        );
        const updated = recalculateProject({
          ...state.project,
          products: updatedProducts,
          rooms: updatedRooms,
        });
        return { project: updated, selectedProductId: newProd.id };
      });
      return newProd;
    },

    updateProduct: (id, updates) =>
      set((state) => {
        const updatedProducts = state.project.products.map((p) => {
          if (p.id === id) {
            return { ...p, ...updates };
          }
          return p;
        });
        const updated = recalculateProject({ ...state.project, products: updatedProducts });
        return { project: updated };
      }),

    deleteProduct: (id) =>
      set((state) => {
        const updatedProducts = state.project.products.filter((p) => p.id !== id);
        const updatedRooms = state.project.rooms.map((r) => ({
          ...r,
          productIds: r.productIds.filter((pid) => pid !== id),
        }));
        const updated = recalculateProject({
          ...state.project,
          products: updatedProducts,
          rooms: updatedRooms,
        });
        const nextProdId = updatedProducts[0]?.id || null;
        return { project: updated, selectedProductId: nextProdId };
      }),

    duplicateProduct: (id) => {
      const target = get().project.products.find((p) => p.id === id);
      if (!target) return;
      const duplicated: ProductObject = {
        ...target,
        id: `prod_${Date.now()}`,
        name: `${target.name} (Copy)`,
      };

      set((state) => {
        const updatedProducts = [duplicated, ...state.project.products];
        const updatedRooms = state.project.rooms.map((r) =>
          r.id === target.roomId ? { ...r, productIds: [...r.productIds, duplicated.id] } : r
        );
        const updated = recalculateProject({
          ...state.project,
          products: updatedProducts,
          rooms: updatedRooms,
        });
        return { project: updated, selectedProductId: duplicated.id };
      });
    },

    updateProjectDetails: (details) =>
      set((state) => {
        const updated = recalculateProject({ ...state.project, ...details });
        return { project: updated };
      }),

    updateCustomerDetails: (customer) =>
      set((state) => {
        const updated = recalculateProject({
          ...state.project,
          customer: { ...state.project.customer, ...customer },
        });
        return { project: updated };
      }),

    updateCharges: (charges) =>
      set((state) => {
        const updated = recalculateProject({
          ...state.project,
          additionalCharges: { ...state.project.additionalCharges, ...charges },
        });
        return { project: updated };
      }),

    updateDiscount: (discount) =>
      set((state) => {
        const updated = recalculateProject({
          ...state.project,
          discount: { ...state.project.discount, ...discount },
        });
        return { project: updated };
      }),

    updateTax: (tax) =>
      set((state) => {
        const updated = recalculateProject({
          ...state.project,
          tax: { ...state.project.tax, ...tax },
        });
        return { project: updated };
      }),

    cloneAsRevision: () =>
      set((state) => {
        const cur = state.project;
        const curRevCode = cur.revisionCode || 'REV-01';
        const currentRevNum = parseInt(curRevCode.replace(/\D/g, '') || '1', 10);
        const nextRevCode = `REV-0${currentRevNum + 1}`;
        const cloned = recalculateProject({
          ...cur,
          id: `proj_${Date.now()}`,
          revisionCode: nextRevCode,
        });
        return { project: cloned };
      }),

    resetProject: () => {
      const fresh = createDefaultProject();
      // Wipe persisted project so stale customer details never reappear on the next mount
      try {
        LocalStorageAdapter.removeItem?.(ACTIVE_PROJECT_KEY);
        localStorage.removeItem(ACTIVE_PROJECT_KEY);
      } catch (_) {}
      set({
        project: fresh,
        selectedRoomId: fresh.rooms[0]?.id || null,
        selectedProductId: fresh.products[0]?.id || null,
      });
    },
  };
});
