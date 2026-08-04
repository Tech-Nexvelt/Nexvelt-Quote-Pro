import { create } from 'zustand';
import { AdditionalCharges, DiscountConfig, Quotation, QuotationItem, QuotationStatus, TaxConfig } from '@/types/quotation';
import { Customer } from '@/types/customer';
import { calculateLineItem, calculateQuotationSummary } from '@/core/engines/calculationEngine';
import { LocalStorageAdapter } from '@/storage/localStorageAdapter';

const ACTIVE_DRAFT_KEY = 'ice_active_quotation_draft';
const SAVED_QUOTES_KEY = 'ice_saved_quotations';

const DEFAULT_ADDITIONAL_CHARGES: AdditionalCharges = {
  installation: 3000,
  transportation: 1500,
  loading: 0,
  labour: 0,
  accessories: 0,
  hardware: 0,
  packaging: 0,
  otherCharges: 0,
};

const DEFAULT_DISCOUNT: DiscountConfig = {
  type: 'flat',
  value: 0,
};

const DEFAULT_TAX: TaxConfig = {
  enabled: false,
  type: 'none',
  ratePercent: 0,
};

const SAMPLE_INITIAL_ITEMS: QuotationItem[] = [];

function createInitialQuotation(): Quotation {
  const dateStr = new Date().toISOString().split('T')[0];
  const items: QuotationItem[] = [];
  const summary = calculateQuotationSummary(items, DEFAULT_ADDITIONAL_CHARGES, DEFAULT_DISCOUNT, DEFAULT_TAX);

  return {
    id: `quote_${Date.now()}`,
    quotationNumber: `EST-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
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
    projectName: '',
    items,
    additionalCharges: DEFAULT_ADDITIONAL_CHARGES,
    discount: DEFAULT_DISCOUNT,
    tax: DEFAULT_TAX,
    summary,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

interface QuotationState {
  currentQuotation: Quotation;
  savedQuotations: Quotation[];
  editingItemId: string | null;

  // Active quotation updates
  setCustomer: (cust: Partial<Customer>) => void;
  updateCustomerDetails: (cust: Partial<Customer>) => void;
  setProjectDetails: (details: { projectName?: string; quotationNumber?: string; date?: string; projectLocation?: string; customerName?: string }) => void;
  updateProjectDetails: (details: { projectName?: string; quotationNumber?: string; date?: string; projectLocation?: string; customerName?: string }) => void;

  // Line item actions
  setQuotationItems: (items: any[]) => void;
  addItem: (item: Partial<QuotationItem>) => void;
  updateItem: (id: string, item: Partial<QuotationItem>) => void;
  deleteItem: (id: string) => void;
  duplicateItem: (id: string) => void;
  reorderItems: (items: QuotationItem[]) => void;
  setEditingItem: (id: string | null) => void;

  // Charges, Discount, Tax, Terms
  updateTermsAndConditions: (terms: string) => void;
  updateAdditionalCharges: (charges: Partial<AdditionalCharges>) => void;
  updateDiscount: (discount: Partial<DiscountConfig>) => void;
  updateTax: (tax: Partial<TaxConfig>) => void;

  // Master Quotation Lifecycle
  saveCurrentQuotation: () => void;
  loadQuotation: (id: string) => void;
  deleteSavedQuotation: (id: string) => void;
  createNewQuotation: () => void;
  cloneAsRevision: () => void;
  updateStatus: (status: QuotationStatus) => void;
  resetQuotation: () => void;
}

export const useQuotationStore = create<QuotationState>((set, get) => {
  const initialQuotation = LocalStorageAdapter.getItem<Quotation>(ACTIVE_DRAFT_KEY, createInitialQuotation());
  const initialSaved = LocalStorageAdapter.getItem<Quotation[]>(SAVED_QUOTES_KEY, []);

  const recalculateCurrent = (q: Quotation): Quotation => {
    const summary = calculateQuotationSummary(q.items, q.additionalCharges, q.discount, q.tax);
    const updated = { ...q, summary, updatedAt: new Date().toISOString() };
    LocalStorageAdapter.setItem(ACTIVE_DRAFT_KEY, updated);
    return updated;
  };

  return {
    currentQuotation: initialQuotation,
    savedQuotations: initialSaved,
    editingItemId: null,

    setCustomer: (cust) =>
      set((state) => {
        const updated = recalculateCurrent({
          ...state.currentQuotation,
          customer: { ...state.currentQuotation.customer, ...cust },
        });
        return { currentQuotation: updated };
      }),

    updateCustomerDetails: (cust) =>
      set((state) => {
        const updated = recalculateCurrent({
          ...state.currentQuotation,
          customer: { ...state.currentQuotation.customer, ...cust },
        });
        return { currentQuotation: updated };
      }),

    setProjectDetails: (details) =>
      set((state) => {
        const updated = recalculateCurrent({
          ...state.currentQuotation,
          ...details,
          customer: details.customerName
            ? { ...state.currentQuotation.customer, name: details.customerName }
            : state.currentQuotation.customer,
        });
        return { currentQuotation: updated };
      }),

    updateProjectDetails: (details) =>
      set((state) => {
        const updated = recalculateCurrent({
          ...state.currentQuotation,
          ...details,
          customer: details.customerName
            ? { ...state.currentQuotation.customer, name: details.customerName }
            : state.currentQuotation.customer,
        });
        return { currentQuotation: updated };
      }),

    setQuotationItems: (items: any[]) =>
      set((state) => {
        const mappedItems = items.map((i) => ({
          id: i.id || `item-${Date.now()}`,
          name: i.title || i.name || 'Custom Module',
          title: i.title || i.name || 'Custom Module',
          category: i.category || 'Custom Work',
          pricingMethod: i.pricingMethod || 'per_sqft',
          unit: i.unit || 'mm',
          width: i.width || 0,
          height: i.height || 0,
          depth: i.depth || 0,
          widthFt: i.width ? i.width / 304.8 : 0,
          heightFt: i.height ? i.height / 304.8 : 0,
          depthIn: i.depth ? i.depth / 25.4 : 0,
          areaSqFt: i.areaSqFt || 0,
          baseRate: i.rate || 0,
          rate: i.rate || 0,
          quantity: i.qty || 1,
          qty: i.qty || 1,
          amount: i.amount || 0,
          lineSubtotal: i.amount || 0,
          finish: i.finish || '',
          material: i.material || '',
        }));
        const updated = recalculateCurrent({
          ...state.currentQuotation,
          items: mappedItems as any,
        });
        return { currentQuotation: updated };
      }),

    addItem: (item) =>
      set((state) => {
        const newLine = calculateLineItem(item);
        const updatedItems = [newLine, ...state.currentQuotation.items];
        const updated = recalculateCurrent({
          ...state.currentQuotation,
          items: updatedItems,
        });
        return { currentQuotation: updated, editingItemId: null };
      }),

    updateItem: (id, item) =>
      set((state) => {
        const updatedItems = state.currentQuotation.items.map((i) =>
          i.id === id ? calculateLineItem({ ...i, ...item }) : i
        );
        const updated = recalculateCurrent({
          ...state.currentQuotation,
          items: updatedItems,
        });
        return { currentQuotation: updated, editingItemId: null };
      }),

    deleteItem: (id) =>
      set((state) => {
        const updatedItems = state.currentQuotation.items.filter((i) => i.id !== id);
        const updated = recalculateCurrent({
          ...state.currentQuotation,
          items: updatedItems,
        });
        return { currentQuotation: updated, editingItemId: state.editingItemId === id ? null : state.editingItemId };
      }),

    duplicateItem: (id) =>
      set((state) => {
        const target = state.currentQuotation.items.find((i) => i.id === id);
        if (!target) return state;
        const duplicated = calculateLineItem({
          ...target,
          id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          name: `${target.name} (Copy)`,
        });
        const updatedItems = [duplicated, ...state.currentQuotation.items];
        const updated = recalculateCurrent({
          ...state.currentQuotation,
          items: updatedItems,
        });
        return { currentQuotation: updated };
      }),

    reorderItems: (items) =>
      set((state) => {
        const updated = recalculateCurrent({
          ...state.currentQuotation,
          items,
        });
        return { currentQuotation: updated };
      }),

    setEditingItem: (id) => set({ editingItemId: id }),

    updateTermsAndConditions: (terms) =>
      set((state) => {
        const updated = recalculateCurrent({
          ...state.currentQuotation,
          termsAndConditions: terms,
        });
        return { currentQuotation: updated };
      }),

    updateAdditionalCharges: (charges) =>
      set((state) => {
        const updated = recalculateCurrent({
          ...state.currentQuotation,
          additionalCharges: { ...state.currentQuotation.additionalCharges, ...charges },
        });
        return { currentQuotation: updated };
      }),

    updateDiscount: (discount) =>
      set((state) => {
        const updated = recalculateCurrent({
          ...state.currentQuotation,
          discount: { ...state.currentQuotation.discount, ...discount },
        });
        return { currentQuotation: updated };
      }),

    updateTax: (tax) =>
      set((state) => {
        const updated = recalculateCurrent({
          ...state.currentQuotation,
          tax: { ...state.currentQuotation.tax, ...tax },
        });
        return { currentQuotation: updated };
      }),

    saveCurrentQuotation: () =>
      set((state) => {
        const current = state.currentQuotation;
        const existingIdx = state.savedQuotations.findIndex((q) => q.id === current.id);
        let updatedSaved: Quotation[] = [];
        if (existingIdx >= 0) {
          updatedSaved = state.savedQuotations.map((q) => (q.id === current.id ? current : q));
        } else {
          updatedSaved = [current, ...state.savedQuotations];
        }
        LocalStorageAdapter.setItem(SAVED_QUOTES_KEY, updatedSaved);
        return { savedQuotations: updatedSaved };
      }),

    loadQuotation: (id) =>
      set((state) => {
        const target = state.savedQuotations.find((q) => q.id === id);
        if (!target) return state;
        LocalStorageAdapter.setItem(ACTIVE_DRAFT_KEY, target);
        return { currentQuotation: target, editingItemId: null };
      }),

    deleteSavedQuotation: (id) =>
      set((state) => {
        const updated = state.savedQuotations.filter((q) => q.id !== id);
        LocalStorageAdapter.setItem(SAVED_QUOTES_KEY, updated);
        return { savedQuotations: updated };
      }),

    createNewQuotation: () =>
      set(() => {
        const fresh = createInitialQuotation();
        LocalStorageAdapter.setItem(ACTIVE_DRAFT_KEY, fresh);
        return { currentQuotation: fresh, editingItemId: null };
      }),

    cloneAsRevision: () =>
      set((state) => {
        const cur = state.currentQuotation;
        const currentRevNum = parseInt(cur.revisionCode.replace(/\D/g, '') || '1', 10);
        const nextRevCode = `REV-0${currentRevNum + 1}`;
        const cloned: Quotation = {
          ...cur,
          id: `quote_${Date.now()}`,
          revisionCode: nextRevCode,
          updatedAt: new Date().toISOString(),
        };
        const updatedSaved = [cloned, ...state.savedQuotations];
        LocalStorageAdapter.setItem(SAVED_QUOTES_KEY, updatedSaved);
        LocalStorageAdapter.setItem(ACTIVE_DRAFT_KEY, cloned);
        return { currentQuotation: cloned, savedQuotations: updatedSaved };
      }),

    updateStatus: (status) =>
      set((state) => {
        const updated = recalculateCurrent({ ...state.currentQuotation, status });
        return { currentQuotation: updated };
      }),

    resetQuotation: () =>
      set(() => {
        const fresh = createInitialQuotation();
        LocalStorageAdapter.setItem(ACTIVE_DRAFT_KEY, fresh);
        return { currentQuotation: fresh, editingItemId: null };
      }),
  };
});
