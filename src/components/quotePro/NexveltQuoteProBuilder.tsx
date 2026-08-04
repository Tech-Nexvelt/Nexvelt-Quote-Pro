import React, { useState, useMemo, useEffect } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useCompanyStore } from '@/store/useCompanyStore';
import { useQuotationStore } from '@/store/useQuotationStore';
import {
  convertToFeet,
  calculateBoxWorkArea,
  calculateFrameWorkArea,
  calculateShutterArea,
  calculatePanellingArea,
  calculateCountertopArea,
  MeasurementUnit,
} from '@/core/engines/measurementEngine';
import {
  getDefaultRateForCategory,
  calculateLineItemAmount,
  PricingMethod,
} from '@/core/engines/pricingEngine';
import { calculateCommercialSummary } from '@/core/engines/summaryEngine';
import { TemplateLibraryModal } from './TemplateLibraryModal';
import { RevisionManagerModal } from './RevisionManagerModal';
import { WorkshopDashboard } from './WorkshopDashboard';
import { PurchaseListExportModal } from './PurchaseListExportModal';
import { Select } from '@/components/ui/Select';
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  FileDown,
  MessageSquare,
  Mail,
  Calendar,
  Minus,
  Copy,
  CheckCircle2,
  Check,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export interface CommercialItem {
  id: string;
  category: string;
  image: string;
  title: string;
  subtitle: string;
  unit: MeasurementUnit;
  width: number;
  height: number;
  depth: number;
  length?: number;
  areaSqFt: number;
  material: string;
  finish: string;
  qty: number;
  rate: number; // Editable rate per sq.ft
  amount: number;
  pricingMethod?: PricingMethod;
}

export interface ScopeOfWorkItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

export const SCOPE_OF_WORK_OPTIONS: ScopeOfWorkItem[] = [
  {
    id: 'box-work',
    name: 'Box Work',
    icon: (
      <svg className="w-5 h-5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
      </svg>
    ),
    description: 'Cabinet boxes, carcass, wardrobes, kitchen boxes.',
  },
  {
    id: 'frame-work',
    name: 'Frame Work',
    icon: (
      <svg className="w-5 h-5 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="3" y1="9" x2="21" y2="9"></line>
        <line x1="3" y1="15" x2="21" y2="15"></line>
        <line x1="9" y1="3" x2="9" y2="21"></line>
        <line x1="15" y1="3" x2="15" y2="21"></line>
      </svg>
    ),
    description: 'Shelves, internal partitions, framework.',
  },
  {
    id: 'shutters',
    name: 'Shutters',
    icon: (
      <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18"></path>
        <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16"></path>
        <path d="M9 12h.01"></path>
      </svg>
    ),
    description: 'Doors, sliding shutters, acrylic, laminate, veneer.',
  },
  {
    id: 'wall-panelling',
    name: 'Wall Panelling',
    icon: (
      <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="18" rx="2" ry="2"></rect>
        <line x1="2" y1="9" x2="22" y2="9"></line>
        <line x1="2" y1="15" x2="22" y2="15"></line>
        <line x1="12" y1="3" x2="12" y2="9"></line>
        <line x1="7" y1="9" x2="7" y2="15"></line>
        <line x1="17" y1="9" x2="17" y2="15"></line>
        <line x1="12" y1="15" x2="12" y2="21"></line>
      </svg>
    ),
    description: 'Bedroom panels, TV wall, living room panelling.',
  },
  {
    id: 'countertops',
    name: 'Countertops',
    icon: (
      <svg className="w-5 h-5 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
        <polyline points="2 17 12 22 22 17"></polyline>
        <polyline points="2 12 12 17 22 12"></polyline>
      </svg>
    ),
    description: 'Kitchen counters, office counters, worktops.',
  },
  {
    id: 'other-items',
    name: 'Other Items',
    icon: (
      <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        <line x1="12" y1="11" x2="12" y2="17"></line>
        <line x1="9" y1="14" x2="15" y2="14"></line>
      </svg>
    ),
    description: 'Hardware, accessories, labour, blinds, custom fittings & consumables.',
  },
];

// Helper to strip leading zeros and convert string to clean numeric value
const parseCleanNumber = (val: string): number => {
  const clean = val.replace(/^0+(?=\d)/, '');
  if (clean === '') return 0;
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
};

export const BUILDER_DRAFT_STORAGE_KEY = 'nqp_active_quotation_builder_draft_v1';

const loadSavedBuilderDraft = () => {
  try {
    const raw = localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY) || sessionStorage.getItem(BUILDER_DRAFT_STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data && typeof data === 'object') {
        return {
          selectedScopes: Array.isArray(data.selectedScopes) && data.selectedScopes.length > 0 ? data.selectedScopes : ['box-work'],
          activeCategory: data.activeCategory || 'Box Work',
          discountPercent: typeof data.discountPercent === 'number' ? data.discountPercent : 0,
          discountType: data.discountType === 'flat' ? ('flat' as const) : ('%' as const),
          paymentTerms: data.paymentTerms || '50% Advance, 50% After Completion',
          items: Array.isArray(data.items) ? data.items : [],
        };
      }
    }
  } catch (err) {
    console.error('Failed to parse cached quotation draft:', err);
  }
  return {
    selectedScopes: ['box-work'],
    activeCategory: 'Box Work',
    discountPercent: 0,
    discountType: '%' as const,
    paymentTerms: '50% Advance, 50% After Completion',
    termsAndConditions: '1. 50% Advance on order confirmation.\n2. Balance 50% before dispatch.\n3. Work completion subject to site readiness.',
    items: [],
  };
};

export const NexveltQuoteProBuilder: React.FC = () => {
  const { setPrintPreviewOpen, addToast } = useUIStore();
  const { project, updateCustomerDetails, updateProjectDetails, resetProject } = useProjectStore();
  const { company } = useCompanyStore();

  // Always clear customer fields on fresh mount so old customer never leaks into a new quotation
  React.useEffect(() => {
    updateCustomerDetails({ name: '', phone: '', email: '', city: '', projectLocation: '' });
    updateProjectDetails({ projectLocation: '', title: '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialDraft = useMemo(() => loadSavedBuilderDraft(), []);

  // Step 2: Scope of Work Multi-Select State
  const [selectedScopes, setSelectedScopes] = useState<string[]>(initialDraft.selectedScopes);

  const [activeCategory, setActiveCategory] = useState<string>(initialDraft.activeCategory);
  const [discountPercent, setDiscountPercent] = useState<number>(initialDraft.discountPercent);
  const [discountType, setDiscountType] = useState<'%' | 'flat'>(initialDraft.discountType);
  const [paymentTerms, setPaymentTerms] = useState<string>(initialDraft.paymentTerms);
  const [termsAndConditions, setTermsAndConditions] = useState<string>(
    initialDraft.termsAndConditions ||
      '1. 50% Advance on order confirmation.\n2. Balance 50% before dispatch.\n3. Work completion subject to site readiness.'
  );
  
  // Modals State
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showRevisionsModal, setShowRevisionsModal] = useState(false);
  const [showDashboardModal, setShowDashboardModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showAddScopeModal, setShowAddScopeModal] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);

  // Helper to identify non-dimensional categories (Other Items, Hardware, Accessories, Labour)
  const isNonDimensionalCategory = (category: string) => {
    const cat = category.toLowerCase();
    return cat === 'other items' || cat === 'hardware' || cat === 'accessories' || cat === 'labour';
  };

  // New Item Dimension State Prompt
  const [modalWizardStep, setModalWizardStep] = useState<1 | 2>(1);
  const [targetScope, setTargetScope] = useState<string>('Box Work');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newSubtitle, setNewSubtitle] = useState<string>('');
  const [newWidth, setNewWidth] = useState<number>(1500);
  const [newHeight, setNewHeight] = useState<number>(2000);
  const [newDepth, setNewDepth] = useState<number>(500);
  const [newUnit, setNewUnit] = useState<MeasurementUnit>('mm');
  const [newRate, setNewRate] = useState<number>(1000);
  const [newQty, setNewQty] = useState<number>(1);

  const { setQuotationItems, updateTermsAndConditions } = useQuotationStore();

  // Dynamic Commercial Items
  const [items, setItems] = useState<CommercialItem[]>(initialDraft.items);

  // Auto-save active builder draft to session and local storage and sync with store
  React.useEffect(() => {
    try {
      setQuotationItems(items);
      updateTermsAndConditions(termsAndConditions);
      const payload = {
        selectedScopes,
        activeCategory,
        discountPercent,
        discountType,
        paymentTerms,
        termsAndConditions,
        items,
        updatedAt: new Date().toISOString(),
      };
      const json = JSON.stringify(payload);
      localStorage.setItem(BUILDER_DRAFT_STORAGE_KEY, json);
      sessionStorage.setItem(BUILDER_DRAFT_STORAGE_KEY, json);
    } catch (err) {
      console.error('Failed to save quotation draft to storage:', err);
    }
  }, [selectedScopes, activeCategory, discountPercent, discountType, paymentTerms, termsAndConditions, items, setQuotationItems, updateTermsAndConditions]);

  // Prevent accidental loss of unsaved draft items on tab reload or navigation
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (items.length > 0) {
        e.preventDefault();
        e.returnValue = 'You have an active quotation draft with items. Are you sure you want to reload or leave?';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [items]);

  // Handle external reset event from AppLayout
  React.useEffect(() => {
    const handleClearEvent = () => {
      setItems([]);
      setSelectedScopes(['box-work']);
      setActiveCategory('Box Work');
      setDiscountPercent(0);
      setDiscountType('%');
    };
    window.addEventListener('nqp_clear_builder_draft', handleClearEvent);
    return () => window.removeEventListener('nqp_clear_builder_draft', handleClearEvent);
  }, []);

  const handleClearDraftConfirmed = () => {
    setItems([]);
    setSelectedScopes(['box-work']);
    setActiveCategory('Box Work');
    setDiscountPercent(0);
    setDiscountType('%');
    try {
      localStorage.removeItem(BUILDER_DRAFT_STORAGE_KEY);
      sessionStorage.removeItem(BUILDER_DRAFT_STORAGE_KEY);
    } catch (e) {}
    addToast({ type: 'info', title: 'Draft Cleared', message: 'Cleared active quotation draft.' });
    setShowClearConfirmModal(false);
  };

  // Toggle Scope of Work Selection & Auto-Sync Category
  const toggleScope = (scopeId: string) => {
    const scopeObj = SCOPE_OF_WORK_OPTIONS.find((s) => s.id === scopeId);
    setSelectedScopes((prev) => {
      if (prev.includes(scopeId)) {
        return prev.filter((id) => id !== scopeId);
      } else {
        return [...prev, scopeId];
      }
    });

    if (scopeObj) {
      setActiveCategory(scopeObj.name);
    }
  };

  const handleCategorySelect = (categoryName: string) => {
    setActiveCategory(categoryName);
    const scopeObj = SCOPE_OF_WORK_OPTIONS.find((s) => s.name === categoryName);
    if (scopeObj && !selectedScopes.includes(scopeObj.id)) {
      setSelectedScopes((prev) => [...prev, scopeObj.id]);
    }
  };

  // Helper to re-calculate area & amount dynamically
  const calculateItemAreaAndAmount = (item: CommercialItem): CommercialItem => {
    if (isNonDimensionalCategory(item.category)) {
      const amount = (item.rate || 0) * (item.qty || 1);
      return {
        ...item,
        areaSqFt: 0,
        amount,
        pricingMethod: 'per_unit',
      };
    }

    let area = 0;
    const wFt = convertToFeet(item.width, item.unit);
    const hFt = convertToFeet(item.height, item.unit);

    switch (item.category.toLowerCase()) {
      case 'box work':
        area = calculateBoxWorkArea(item.width, item.height, item.unit);
        break;
      case 'frame work':
        area = calculateFrameWorkArea(item.width, item.height, item.depth, item.unit).areaSqFt;
        break;
      case 'shutters':
        area = calculateShutterArea(item.width, item.height, item.unit);
        break;
      case 'wall panelling':
        area = calculatePanellingArea(item.length || item.width, item.height, item.unit);
        break;
      case 'countertops':
        area = calculateCountertopArea(item.length || item.width, item.height || item.depth, item.unit);
        break;
      default:
        area = parseFloat((wFt * hFt).toFixed(2));
        break;
    }

    if (area <= 0 && wFt > 0) {
      area = parseFloat((wFt * (hFt || 1)).toFixed(2));
    }

    const amount = calculateLineItemAmount({
      areaSqFt: area,
      rate: item.rate,
      quantity: item.qty,
      pricingMethod: item.pricingMethod || 'per_sqft',
    });

    return {
      ...item,
      areaSqFt: area,
      amount,
    };
  };

  // Field Updates
  const handleItemUpdate = (id: string, updates: Partial<CommercialItem>) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const merged = { ...item, ...updates };
          return calculateItemAreaAndAmount(merged);
        }
        return item;
      })
    );
  };

  const handleQtyChange = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.qty + delta);
          return calculateItemAreaAndAmount({ ...item, qty: newQty });
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleAddItemForCategory = (
    targetCategory: string = targetScope,
    widthVal: number = newWidth,
    heightVal: number = newHeight,
    depthVal: number = newDepth,
    unitVal: MeasurementUnit = newUnit,
    rateVal: number = newRate,
    qtyVal: number = newQty,
    customTitle?: string,
    customSubtitle?: string
  ) => {
    const scopeObj = SCOPE_OF_WORK_OPTIONS.find((s) => s.name === targetCategory);
    if (scopeObj && !selectedScopes.includes(scopeObj.id)) {
      setSelectedScopes((prev) => [...prev, scopeObj.id]);
    }
    setActiveCategory(targetCategory);

    const isNonDim = isNonDimensionalCategory(targetCategory);
    const defaultRate = rateVal || getDefaultRateForCategory(targetCategory);

    const itemTitle = customTitle?.trim() || newTitle.trim() || `${targetCategory} Item`;
    const itemSubtitle = customSubtitle?.trim() || newSubtitle.trim() || (isNonDim ? 'Unit Item Specification' : 'Custom Specification');

    const rawItem: CommercialItem = {
      id: `item-${Date.now()}`,
      category: targetCategory,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=150&auto=format&fit=crop&q=80',
      title: itemTitle,
      subtitle: itemSubtitle,
      unit: unitVal,
      width: isNonDim ? 0 : widthVal,
      height: isNonDim ? 0 : heightVal,
      depth: isNonDim ? 0 : depthVal,
      areaSqFt: 0,
      material: isNonDim ? 'Standard Spec' : '18mm HDMR Board',
      finish: isNonDim ? 'Standard Finish' : '1mm Premium Laminate',
      qty: qtyVal || 1,
      rate: defaultRate,
      amount: 0,
      pricingMethod: isNonDim ? 'per_unit' : 'per_sqft',
    };
    const calculated = calculateItemAreaAndAmount(rawItem);
    setItems((prev) => [calculated, ...prev]);
    addToast({ type: 'success', title: 'Item Added', message: `Added ${itemTitle} to quotation.` });
    setShowAddScopeModal(false);
    setNewTitle('');
    setNewSubtitle('');
  };

  const handleDuplicateItem = (itemToCopy: CommercialItem) => {
    const duplicated: CommercialItem = {
      ...itemToCopy,
      id: `item-${Date.now()}`,
      title: `${itemToCopy.title} (Copy)`,
    };
    setItems((prev) => [duplicated, ...prev]);
    addToast({ type: 'success', title: 'Item Duplicated', message: `Duplicated ${itemToCopy.title}.` });
  };

  // Real-Time Commercial Summary Calculation Engine
  const summaryOutput = useMemo(() => {
    return calculateCommercialSummary({
      items: items.map((i) => ({
        id: i.id,
        category: i.category,
        title: i.title,
        areaSqFt: i.areaSqFt,
        qty: i.qty,
        rate: i.rate,
        amount: i.amount,
      })),
      discountPercent: discountType === '%' ? discountPercent : 0,
      discountFlat: discountType === 'flat' ? discountPercent : 0,
      gstRatePercent: 0,
    });
  }, [items, discountPercent, discountType]);

  const handleShareWhatsApp = () => {
    const text = `*Nexvelt Quotation*\nGrand Total: ₹${summaryOutput.grandTotal.toLocaleString('en-IN')}\nCustomer: ${project.customer.name || 'Valued Client'}\nThank you!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSendEmail = () => {
    const customerEmail = project.customer.email || '';
    const customerName = project.customer.name || 'Valued Client';
    const grandTotalFormatted = `₹${summaryOutput.grandTotal.toLocaleString('en-IN')}`;
    const companyName = company?.name || company?.company_name || 'VLR Interior Solutions';

    if (!customerEmail.trim()) {
      addToast({
        type: 'warning',
        title: 'Missing Customer Email',
        message: 'Please enter a customer email address in Customer Details before sending email.',
      });
      return;
    }

    const subject = encodeURIComponent(`Quotation Estimate from ${companyName} - ${customerName}`);
    const body = encodeURIComponent(
      `Dear ${customerName},\n\n` +
      `Thank you for contacting ${companyName}.\n\n` +
      `Here is your quotation estimate details:\n` +
      `Quotation Number: ${project.quotationNumber}\n` +
      `Grand Total: ${grandTotalFormatted}\n` +
      `Project Location: ${project.projectLocation || 'As specified'}\n\n` +
      `Please let us know if you have any questions or require modifications.\n\n` +
      `Best regards,\n` +
      `${companyName}\n` +
      `${company?.phone || ''}`
    );

    window.open(`mailto:${customerEmail.trim()}?subject=${subject}&body=${body}`, '_blank');

    addToast({
      type: 'success',
      title: 'Email Client Opened',
      message: `Composed quotation email for ${customerEmail}.`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* 2-Column Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================= */}
        {/* LEFT COLUMN (70% Width) */}
        {/* ========================================================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: CUSTOMER DETAILS */}
          <section id="quotation-step-1" className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#00D9D9] text-white text-xs font-bold flex items-center justify-center">
                  1
                </div>
                <h2 className="text-sm font-extrabold text-[#111827]">Customer Details</h2>
                <span className="text-[10px] font-semibold text-[#6B7280] bg-[#F1F5F9] px-2 py-0.5 rounded-full">All fields required</span>
              </div>
              <button
                onClick={() => {
                  updateCustomerDetails({ name: '', phone: '', email: '', city: '', projectLocation: '' });
                  updateProjectDetails({ projectLocation: '', title: '' });
                  addToast({ type: 'info', title: 'Customer Cleared', message: 'Customer details have been reset.' });
                }}
                className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline flex items-center gap-1 transition-colors"
                title="Clear all customer fields"
              >
                <span>✕ Clear</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Customer Name */}
              <div>
                <label htmlFor="nqp-customer-name" className="text-xs font-semibold text-[#4B5563] block mb-1">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="nqp-customer-name"
                  name="customerName"
                  type="text"
                  required
                  placeholder="e.g. Rajesh Kumar"
                  value={project.customer.name || ''}
                  onChange={(e) => updateCustomerDetails({ name: e.target.value })}
                  className={`w-full h-9 bg-white border rounded-lg px-3 text-xs text-[#111827] focus:outline-none font-medium transition-colors ${
                    !project.customer.name?.trim()
                      ? 'border-red-300 focus:border-red-500 bg-red-50/30'
                      : 'border-[#E2E8F0] focus:border-[#00D9D9]'
                  }`}
                />
                {!project.customer.name?.trim() && (
                  <p className="text-[10px] text-red-500 font-semibold mt-0.5">Required</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="nqp-customer-phone" className="text-xs font-semibold text-[#4B5563] block mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  id="nqp-customer-phone"
                  name="customerPhone"
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={project.customer.phone || ''}
                  onChange={(e) => updateCustomerDetails({ phone: e.target.value })}
                  className={`w-full h-9 bg-white border rounded-lg px-3 text-xs text-[#111827] focus:outline-none font-medium transition-colors ${
                    !project.customer.phone?.trim()
                      ? 'border-red-300 focus:border-red-500 bg-red-50/30'
                      : 'border-[#E2E8F0] focus:border-[#00D9D9]'
                  }`}
                />
                {!project.customer.phone?.trim() && (
                  <p className="text-[10px] text-red-500 font-semibold mt-0.5">Required</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="nqp-customer-email" className="text-xs font-semibold text-[#4B5563] block mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="nqp-customer-email"
                  name="customerEmail"
                  type="email"
                  required
                  placeholder="client@example.com"
                  value={project.customer.email || ''}
                  onChange={(e) => updateCustomerDetails({ email: e.target.value })}
                  className={`w-full h-9 bg-white border rounded-lg px-3 text-xs text-[#111827] focus:outline-none font-medium transition-colors ${
                    !project.customer.email?.trim()
                      ? 'border-red-300 focus:border-red-500 bg-red-50/30'
                      : 'border-[#E2E8F0] focus:border-[#00D9D9]'
                  }`}
                />
                {!project.customer.email?.trim() && (
                  <p className="text-[10px] text-red-500 font-semibold mt-0.5">Required</p>
                )}
              </div>

              {/* Site / Project Location */}
              <div>
                <label htmlFor="nqp-customer-site" className="text-xs font-semibold text-[#4B5563] block mb-1">
                  Site / Project <span className="text-red-500">*</span>
                </label>
                <input
                  id="nqp-customer-site"
                  name="projectLocation"
                  type="text"
                  required
                  placeholder="e.g. Flat 4B, Siddipet"
                  value={project.projectLocation ?? ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateProjectDetails({ projectLocation: val });
                    updateCustomerDetails({ projectLocation: val });
                  }}
                  className="w-full h-9 bg-white border border-[#E2E8F0] rounded-lg px-3 text-xs text-[#111827] focus:outline-none focus:border-[#00D9D9] font-medium"
                />
              </div>
            </div>
          </section>

          {/* STEP 2: SELECT SCOPE OF WORK (WORK TYPE SELECTION SCREEN) */}
          <section id="quotation-step-2" className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#00D9D9] text-white text-xs font-bold flex items-center justify-center">
                  2
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-[#111827]">Select Scope of Work</h2>
                  <p className="text-[11px] text-[#6B7280]">Select one or multiple work types included in this quotation</p>
                </div>
              </div>

              <span className="text-xs font-bold text-[#008080] bg-[#E6F7F7] px-3 py-1 rounded-full border border-[#00D9D9]/30">
                {selectedScopes.length} Work Types Selected
              </span>
            </div>

            {/* Scope of Work Multi-Select Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {SCOPE_OF_WORK_OPTIONS.map((scope) => {
                const isSelected = selectedScopes.includes(scope.id);
                return (
                  <div
                    key={scope.id}
                    onClick={() => toggleScope(scope.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-[#E6F7F7] border-[#00D9D9] text-[#008080] shadow-2xs'
                        : 'bg-white border-[#E2E8F0] text-[#4B5563] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    {/* Selected Checkmark Badge */}
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#00D9D9] text-white flex items-center justify-center absolute top-3 right-3 shadow-2xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}

                    <div className="w-11 h-11 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                      {scope.icon}
                    </div>

                    <div className="space-y-0.5 pr-4">
                      <h3 className={`text-xs font-extrabold ${isSelected ? 'text-[#008080]' : 'text-[#111827]'}`}>
                        {scope.name}
                      </h3>
                      <p className="text-[11px] text-[#6B7280] leading-snug font-medium">
                        {scope.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Scope Validation Alert */}
            {selectedScopes.length === 0 && (
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center gap-2 text-xs font-bold text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Please select at least one scope of work to configure products.</span>
              </div>
            )}
          </section>

          {/* STEP 3: ITEM CONFIGURATION (FILTERED BY SCOPE OF WORK) */}
          <section id="quotation-step-3" className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F1F5F9] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#00D9D9] text-white text-xs font-bold flex items-center justify-center">
                  3
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-[#111827]">Configure Products</h2>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    <span className="text-[11px] text-[#6B7280] font-medium">Active Scope:</span>
                    {selectedScopes.map((scopeId) => {
                      const found = SCOPE_OF_WORK_OPTIONS.find((s) => s.id === scopeId);
                      return (
                        <span key={scopeId} className="text-[10px] font-bold text-[#008080] bg-[#E6F7F7] px-2 py-0.5 rounded font-mono">
                          {found?.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Custom Category Selector */}
              <div className="flex items-center gap-2">
                <div className="w-44">
                  <Select
                    value={activeCategory}
                    onChange={(val) => handleCategorySelect(val)}
                    options={SCOPE_OF_WORK_OPTIONS.map((c) => ({ value: c.name, label: c.name }))}
                  />
                </div>

                <button
                  onClick={() => {
                    setModalWizardStep(1);
                    setShowAddScopeModal(true);
                  }}
                  className="h-12 px-3 text-xs font-bold text-[#00B8B8] bg-white border border-[#00D9D9] hover:bg-[#E6F7F7] rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#00B8B8]" /> Add Item Card
                </button>
              </div>
            </div>

            {/* Vertically Stacked Carpenter-Friendly Quotation Cards */}
            <div className="space-y-6">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white border border-[#E2E8F0] hover:border-[#00D9D9] rounded-2xl p-6 shadow-xs space-y-6 transition-all duration-200"
                >
                  {/* 1. CARD TOP BAR: Image, Title, Category Badge & Index */}
                  <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#F1F5F9]">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 rounded-xl object-cover border border-[#E2E8F0] shadow-2xs shrink-0"
                      />
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold font-mono text-[#008080] bg-[#E6F7F7] px-2.5 py-0.5 rounded-full uppercase">
                            {item.category}
                          </span>
                          <span className="text-xs font-mono text-[#6B7280] font-bold">Item #{index + 1}</span>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-[#4B5563] uppercase block mb-0.5">Product Name / Specification</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handleItemUpdate(item.id, { title: e.target.value })}
                            placeholder="e.g. Master Bedroom Wardrobe, Custom Blinds, Labour"
                            className="text-sm font-extrabold text-[#111827] bg-white border border-[#E2E8F0] hover:border-[#00D9D9] focus:border-[#00D9D9] rounded-lg px-2.5 py-1 block w-full focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-medium text-[#6B7280] uppercase block mb-0.5">Item Details / Notes</label>
                          <input
                            type="text"
                            value={item.subtitle}
                            onChange={(e) => handleItemUpdate(item.id, { subtitle: e.target.value })}
                            placeholder="e.g. Custom Specification, 18mm HDMR with Premium Laminate"
                            className="text-xs text-[#4B5563] bg-white border border-[#E2E8F0] hover:border-[#00D9D9] focus:border-[#00D9D9] rounded-lg px-2.5 py-1 block w-full focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Unit Selector (mm / ft / inch) - Only for dimensional categories */}
                    {!isNonDimensionalCategory(item.category) && (
                      <div className="flex items-center gap-1.5 bg-[#F8FAFC] border border-[#E2E8F0] p-1 rounded-xl">
                        {(['mm', 'ft', 'inch'] as MeasurementUnit[]).map((u) => (
                          <button
                            key={u}
                            onClick={() => handleItemUpdate(item.id, { unit: u })}
                            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                              item.unit === u
                                ? 'bg-[#00D9D9] text-white shadow-2xs'
                                : 'text-[#6B7280] hover:text-[#111827]'
                            }`}
                          >
                            {u}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 2. MEASUREMENTS SECTION (Rendered ONLY for dimensional categories) */}
                  {!isNonDimensionalCategory(item.category) && (
                    <div className="space-y-2">
                      <label className="text-xs font-black tracking-wider uppercase text-[#111827] flex items-center gap-2">
                        <span>📐 Measurements</span>
                        <span className="text-[11px] font-normal text-[#6B7280] capitalize">({item.category} Dimensions)</span>
                      </label>

                    {/* Dynamic Measurement Grid per Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {item.category.toLowerCase() === 'wall panelling' ? (
                        <>
                          <div className="bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-xl p-3 focus-within:border-[#00D9D9] transition">
                            <span className="text-[11px] font-black text-[#4B5563] uppercase block mb-1">LENGTH</span>
                            <div className="flex items-center justify-between gap-2">
                              <input
                                type="number"
                                value={item.width === 0 ? '' : item.width}
                                onChange={(e) => handleItemUpdate(item.id, { width: parseCleanNumber(e.target.value) })}
                                className="w-full text-xl font-black font-mono text-[#111827] bg-transparent focus:outline-none"
                              />
                              <span className="text-xs font-bold text-[#6B7280] uppercase">{item.unit}</span>
                            </div>
                          </div>
                          <div className="bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-xl p-3 focus-within:border-[#00D9D9] transition">
                            <span className="text-[11px] font-black text-[#4B5563] uppercase block mb-1">HEIGHT</span>
                            <div className="flex items-center justify-between gap-2">
                              <input
                                type="number"
                                value={item.height === 0 ? '' : item.height}
                                onChange={(e) => handleItemUpdate(item.id, { height: parseCleanNumber(e.target.value) })}
                                className="w-full text-xl font-black font-mono text-[#111827] bg-transparent focus:outline-none"
                              />
                              <span className="text-xs font-bold text-[#6B7280] uppercase">{item.unit}</span>
                            </div>
                          </div>
                        </>
                      ) : item.category.toLowerCase() === 'countertops' ? (
                        <>
                          <div className="bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-xl p-3 focus-within:border-[#00D9D9] transition">
                            <span className="text-[11px] font-black text-[#4B5563] uppercase block mb-1">LENGTH</span>
                            <div className="flex items-center justify-between gap-2">
                              <input
                                type="number"
                                value={item.width === 0 ? '' : item.width}
                                onChange={(e) => handleItemUpdate(item.id, { width: parseCleanNumber(e.target.value) })}
                                className="w-full text-xl font-black font-mono text-[#111827] bg-transparent focus:outline-none"
                              />
                              <span className="text-xs font-bold text-[#6B7280] uppercase">{item.unit}</span>
                            </div>
                          </div>
                          <div className="bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-xl p-3 focus-within:border-[#00D9D9] transition">
                            <span className="text-[11px] font-black text-[#4B5563] uppercase block mb-1">WIDTH</span>
                            <div className="flex items-center justify-between gap-2">
                              <input
                                type="number"
                                value={item.height === 0 ? '' : item.height}
                                onChange={(e) => handleItemUpdate(item.id, { height: parseCleanNumber(e.target.value) })}
                                className="w-full text-xl font-black font-mono text-[#111827] bg-transparent focus:outline-none"
                              />
                              <span className="text-xs font-bold text-[#6B7280] uppercase">{item.unit}</span>
                            </div>
                          </div>
                          <div className="bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-xl p-3 focus-within:border-[#00D9D9] transition">
                            <span className="text-[11px] font-black text-[#4B5563] uppercase block mb-1">THICKNESS</span>
                            <div className="flex items-center justify-between gap-2">
                              <input
                                type="number"
                                value={item.depth === 0 ? '' : item.depth}
                                onChange={(e) => handleItemUpdate(item.id, { depth: parseCleanNumber(e.target.value) })}
                                className="w-full text-xl font-black font-mono text-[#111827] bg-transparent focus:outline-none"
                              />
                              <span className="text-xs font-bold text-[#6B7280] uppercase">mm</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-xl p-3 focus-within:border-[#00D9D9] transition">
                            <span className="text-[11px] font-black text-[#4B5563] uppercase block mb-1">HEIGHT</span>
                            <div className="flex items-center justify-between gap-2">
                              <input
                                type="number"
                                value={item.height === 0 ? '' : item.height}
                                onChange={(e) => handleItemUpdate(item.id, { height: parseCleanNumber(e.target.value) })}
                                className="w-full text-xl font-black font-mono text-[#111827] bg-transparent focus:outline-none"
                              />
                              <span className="text-xs font-bold text-[#6B7280] uppercase">{item.unit}</span>
                            </div>
                          </div>

                          <div className="bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-xl p-3 focus-within:border-[#00D9D9] transition">
                            <span className="text-[11px] font-black text-[#4B5563] uppercase block mb-1">WIDTH</span>
                            <div className="flex items-center justify-between gap-2">
                              <input
                                type="number"
                                value={item.width === 0 ? '' : item.width}
                                onChange={(e) => handleItemUpdate(item.id, { width: parseCleanNumber(e.target.value) })}
                                className="w-full text-xl font-black font-mono text-[#111827] bg-transparent focus:outline-none"
                              />
                              <span className="text-xs font-bold text-[#6B7280] uppercase">{item.unit}</span>
                            </div>
                          </div>

                          <div className="bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-xl p-3 focus-within:border-[#00D9D9] transition">
                            <span className="text-[11px] font-black text-[#4B5563] uppercase block mb-1">DEPTH</span>
                            <div className="flex items-center justify-between gap-2">
                              <input
                                type="number"
                                value={item.depth === 0 ? '' : item.depth}
                                onChange={(e) => handleItemUpdate(item.id, { depth: parseCleanNumber(e.target.value) })}
                                className="w-full text-xl font-black font-mono text-[#111827] bg-transparent focus:outline-none"
                              />
                              <span className="text-xs font-bold text-[#6B7280] uppercase">{item.unit === 'ft' ? 'in' : item.unit}</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  )}

                  {/* 3. MATERIAL, FINISH, RATE & QUANTITY */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-[#F1F5F9]">
                    <div>
                      <label htmlFor={`material-${item.id}`} className="text-xs font-bold text-[#4B5563] block mb-1">Core Material</label>
                      <input
                        id={`material-${item.id}`}
                        name="coreMaterial"
                        type="text"
                        value={item.material}
                        onChange={(e) => handleItemUpdate(item.id, { material: e.target.value })}
                        className="w-full h-10 text-xs font-bold text-[#111827] bg-white border border-[#E2E8F0] rounded-xl px-3 focus:outline-none focus:border-[#00D9D9]"
                      />
                    </div>

                    <div>
                      <label htmlFor={`finish-${item.id}`} className="text-xs font-bold text-[#4B5563] block mb-1">Shutter Finish</label>
                      <input
                        id={`finish-${item.id}`}
                        name="shutterFinish"
                        type="text"
                        value={item.finish}
                        onChange={(e) => handleItemUpdate(item.id, { finish: e.target.value })}
                        className="w-full h-10 text-xs font-bold text-[#111827] bg-white border border-[#E2E8F0] rounded-xl px-3 focus:outline-none focus:border-[#00D9D9]"
                      />
                    </div>

                    {/* Editable Rate */}
                    <div>
                      <label htmlFor={`rate-${item.id}`} className="text-xs font-bold text-[#4B5563] block mb-1">Rate (₹ / sq.ft)</label>
                      <div className="relative">
                        <span className="text-xs font-bold text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2">₹</span>
                        <input
                          id={`rate-${item.id}`}
                          name="itemRate"
                          type="number"
                          value={item.rate === 0 ? '' : item.rate}
                          onChange={(e) => handleItemUpdate(item.id, { rate: parseCleanNumber(e.target.value) })}
                          className="w-full h-10 text-sm font-black font-mono text-[#111827] bg-white border border-[#E2E8F0] rounded-xl pl-7 pr-3 focus:outline-none focus:border-[#00D9D9]"
                        />
                      </div>
                    </div>

                    {/* Large Touch Stepper Quantity */}
                    <div>
                      <label className="text-xs font-bold text-[#4B5563] block mb-1">Quantity</label>
                      <div className="flex items-center h-10 border border-[#E2E8F0] rounded-xl bg-white overflow-hidden">
                        <button
                          onClick={() => handleQtyChange(item.id, -1)}
                          className="w-10 h-full flex items-center justify-center text-[#111827] hover:bg-[#F1F5F9] font-black text-sm"
                        >
                          -
                        </button>
                        <span className="flex-1 text-center font-mono font-black text-sm text-[#111827]">{item.qty}</span>
                        <button
                          onClick={() => handleQtyChange(item.id, 1)}
                          className="w-10 h-full flex items-center justify-center text-[#111827] hover:bg-[#F1F5F9] font-black text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 4. CALCULATED RESULTS CALLOUT BOX & CARD ACTIONS */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#F1F5F9] bg-[#E6F7F7]/60 -mx-6 -mb-6 p-4 rounded-b-2xl border-t border-[#00D9D9]/30">
                    <div className="flex items-center gap-6">
                      {!isNonDimensionalCategory(item.category) ? (
                        <>
                          <div>
                            <span className="text-[10px] font-bold uppercase text-[#008080] block font-mono">Calculated Area</span>
                            <span className="text-base font-black font-mono text-[#111827]">{item.areaSqFt} Sq.ft</span>
                          </div>
                          <div className="h-8 w-px bg-[#00D9D9]/40" />
                        </>
                      ) : (
                        <>
                          <div>
                            <span className="text-[10px] font-bold uppercase text-[#008080] block font-mono">Quantity</span>
                            <span className="text-base font-black font-mono text-[#111827]">{item.qty} Items/Units</span>
                          </div>
                          <div className="h-8 w-px bg-[#00D9D9]/40" />
                        </>
                      )}

                      <div>
                        <span className="text-[10px] font-bold uppercase text-[#008080] block font-mono">Calculated Amount</span>
                        <span className="text-xl font-black font-mono text-[#00B8B8]">
                          ₹ {item.amount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDuplicateItem(item)}
                        className="px-3.5 py-1.5 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#374151] text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-2xs"
                      >
                        <Copy className="w-3.5 h-3.5 text-[#6B7280]" /> Duplicate
                      </button>

                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="px-3.5 py-1.5 bg-white border border-red-200 hover:bg-red-50 text-red-600 text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-2xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN (30% Width - REAL-TIME SUMMARY & GENERATE QUOTE) */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          {/* STEP 4: QUOTATION SUMMARY CARD */}
          <section id="quotation-step-4" className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[#F1F5F9] pb-3">
              <div className="w-6 h-6 rounded-full bg-[#00D9D9] text-white text-xs font-bold flex items-center justify-center">
                4
              </div>
              <h2 className="text-sm font-extrabold text-[#111827]">Quotation Summary</h2>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-[#4B5563]">
                <span>Sub Total ({summaryOutput.totalAreaSqFt} sq.ft)</span>
                <span className="font-mono font-bold text-[#111827]">₹ {summaryOutput.itemsSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#6B7280]">
                <span>Est. Material Cost</span>
                <span className="font-mono font-medium text-[#111827]">₹ {summaryOutput.materialCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#6B7280]">
                <span>Est. Labour Cost</span>
                <span className="font-mono font-medium text-[#111827]">₹ {summaryOutput.labourCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#6B7280]">
                <span>Est. Hardware & Fittings</span>
                <span className="font-mono font-medium text-[#111827]">₹ {summaryOutput.hardwareCost.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between font-bold border-t border-[#E2E8F0] pt-2 text-[#111827]">
                <span>Total (Before Tax)</span>
                <span className="font-mono">₹ {summaryOutput.beforeTaxTotal.toLocaleString('en-IN')}</span>
              </div>

              {/* Editable Discount Row */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <span className="text-[#4B5563]">Discount</span>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-0.5 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setDiscountType('%')}
                      className={`px-2 py-0.5 rounded transition-colors ${discountType === '%' ? 'bg-[#00D9D9] text-white shadow-2xs' : 'text-[#4B5563] hover:text-[#111827]'}`}
                    >
                      %
                    </button>
                    <button
                      type="button"
                      onClick={() => setDiscountType('flat')}
                      className={`px-2 py-0.5 rounded transition-colors ${discountType === 'flat' ? 'bg-[#00D9D9] text-white shadow-2xs' : 'text-[#4B5563] hover:text-[#111827]'}`}
                    >
                      Flat
                    </button>
                  </div>
                  <input
                    id="nqp-discount-input"
                    name="discountValue"
                    aria-label="Discount Value"
                    type="number"
                    value={discountPercent === 0 ? '' : discountPercent}
                    onChange={(e) => setDiscountPercent(parseCleanNumber(e.target.value))}
                    className="w-14 h-7 text-[11px] font-mono text-center border border-[#E2E8F0] rounded text-[#111827] font-bold"
                  />
                  <span className="font-mono font-bold text-red-600">- ₹ {summaryOutput.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {summaryOutput.taxAmount > 0 && (
                <div className="flex justify-between text-[#4B5563]">
                  <span>Tax (GST)</span>
                  <span className="font-mono font-bold text-[#111827]">₹ {summaryOutput.taxAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              {/* Total Amount Callout */}
              <div className="border-t border-[#E2E8F0] pt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[#00B8B8]">Total Amount</span>
                <span className="text-2xl font-black font-mono text-[#00B8B8]">
                  ₹ {summaryOutput.grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Terms, Validity & Notes */}
            <div className="space-y-3 pt-3 border-t border-[#F1F5F9]">
              <div>
                <Select
                  label="Payment Terms"
                  value={paymentTerms}
                  onChange={(val) => setPaymentTerms(val)}
                  options={[
                    { value: '50% Advance, 50% After Completion', label: '50% Advance, 50% After Completion' },
                    { value: '40% Advance, 50% Delivery, 10% Installation', label: '40% Advance, 50% Delivery, 10% Installation' },
                    { value: '100% Full Advance', label: '100% Full Advance' },
                  ]}
                />
              </div>

              <div>
                <label htmlFor="nqp-terms-conditions" className="text-[11px] font-extrabold text-[#4B5563] block mb-1">
                  Terms & Conditions
                </label>
                <textarea
                  id="nqp-terms-conditions"
                  name="termsAndConditions"
                  rows={3}
                  value={termsAndConditions}
                  onChange={(e) => setTermsAndConditions(e.target.value)}
                  placeholder="Enter custom terms & conditions..."
                  className="w-full text-xs p-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[#111827] resize-y font-medium focus:outline-none focus:border-[#00D9D9]"
                />
              </div>

              <div>
                <label htmlFor="nqp-quote-validity" className="text-[11px] font-semibold text-[#4B5563] block mb-1">Validity</label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-[#6B7280] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="nqp-quote-validity"
                    name="quoteValidity"
                    type="text"
                    defaultValue="30 Days"
                    className="w-full h-8 pl-8 text-xs bg-white border border-[#E2E8F0] rounded-lg text-[#111827] font-medium"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="nqp-quote-notes" className="text-[11px] font-semibold text-[#4B5563] block mb-1">Notes</label>
                <textarea
                  id="nqp-quote-notes"
                  name="quoteNotes"
                  rows={2}
                  defaultValue="Thank you for considering Nexvelt. We look forward to working with you."
                  className="w-full text-xs p-2 bg-white border border-[#E2E8F0] rounded-lg text-[#111827] resize-none font-medium"
                />
              </div>
            </div>
          </section>

          {/* GENERATE QUOTE CARD */}
          <section className="bg-[#E6F7F7] border border-[#B2EBF2] rounded-xl p-5 shadow-xs space-y-3">
            <div>
              <h3 className="text-sm font-extrabold text-[#008080]">Generate Quote</h3>
              <p className="text-xs text-[#008080]/90 mt-0.5 font-medium">
                Create professional PDF quotation with company branding.
              </p>
            </div>

            <button
              onClick={() => setPrintPreviewOpen(true)}
              className="w-full h-10 bg-[#00D9D9] hover:bg-[#00B8B8] text-white text-xs font-bold rounded-lg shadow-sm transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              <FileDown className="w-4 h-4" /> Generate & Download PDF
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleShareWhatsApp}
                className="h-9 bg-white border border-[#B2EBF2] hover:bg-[#E0F7F7] text-[#008080] text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" /> Share via WhatsApp
              </button>
              <button
                onClick={handleSendEmail}
                className="h-9 bg-white border border-[#B2EBF2] hover:bg-[#E0F7F7] text-[#008080] text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-blue-600" /> Send Email
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Modals */}
      <TemplateLibraryModal
        isOpen={showTemplatesModal}
        onClose={() => setShowTemplatesModal(false)}
        onApplyTemplate={(template) => {
          addToast({ type: 'success', title: 'Template Applied', message: `Added ${template.name}` });
        }}
      />

      <RevisionManagerModal
        isOpen={showRevisionsModal}
        onClose={() => setShowRevisionsModal(false)}
        project={project as any}
        onSaveRevision={() => {}}
        onRestoreRevision={() => {}}
      />

      <WorkshopDashboard
        isOpen={showDashboardModal}
        onClose={() => setShowDashboardModal(false)}
        projects={[]}
      />

      <PurchaseListExportModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        project={project as any}
      />

      {/* 2-Step Sequential Product Creation Wizard Modal */}
      {showAddScopeModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl text-[#111827]">
            {/* Header with Step Indicator */}
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#E6F7F7] text-[#008080] font-mono">
                    Step {modalWizardStep} of 2
                  </span>
                  <h3 className="text-base font-extrabold text-[#111827]">
                    {modalWizardStep === 1 ? 'Select Work Type' : `Enter Dimensions for ${targetScope}`}
                  </h3>
                </div>
                <p className="text-xs font-semibold text-[#6B7280] mt-0.5">
                  {modalWizardStep === 1
                    ? 'Click a work type to configure its dimensions'
                    : 'Enter custom dimensions before adding the item card'}
                </p>
              </div>
              <button
                onClick={() => setShowAddScopeModal(false)}
                className="text-[#6B7280] hover:text-[#111827] text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* STEP 1: Select Work Type */}
            {modalWizardStep === 1 ? (
              <div className="space-y-3">
                <label className="text-xs font-extrabold uppercase tracking-wide text-[#4B5563] block">
                  Select Scope of Work
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto p-1">
                  {SCOPE_OF_WORK_OPTIONS.map((scope) => (
                    <button
                      key={scope.id}
                      type="button"
                      onClick={() => {
                        setTargetScope(scope.name);
                        setModalWizardStep(2);
                      }}
                      className={`p-3 rounded-xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group ${
                        targetScope === scope.name
                          ? 'border-[#00D9D9] bg-[#E6F7F7] ring-2 ring-[#00D9D9]/30'
                          : 'border-[#E2E8F0] hover:border-[#00D9D9] hover:bg-[#E6F7F7]/50 bg-[#F8FAFC]'
                      }`}
                    >
                      <span className="text-2xl group-hover:scale-110 transition-transform">{scope.icon}</span>
                      <span className={`text-xs font-extrabold text-center ${targetScope === scope.name ? 'text-[#008080]' : 'text-[#111827]'}`}>
                        {scope.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* STEP 2: Enter Dimensions or Rate/Qty */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      {SCOPE_OF_WORK_OPTIONS.find((s) => s.name === targetScope)?.icon}
                    </span>
                    <span className="text-sm font-extrabold text-[#111827]">{targetScope}</span>
                  </div>

                  {!isNonDimensionalCategory(targetScope) && (
                    <div className="flex items-center gap-1 bg-[#F8FAFC] border border-[#E2E8F0] p-1 rounded-lg">
                      {(['mm', 'ft', 'inch'] as MeasurementUnit[]).map((u) => (
                        <button
                          key={u}
                          type="button"
                          onClick={() => setNewUnit(u)}
                          className={`px-2.5 py-1 text-xs font-bold rounded transition ${
                            newUnit === u ? 'bg-[#00D9D9] text-white shadow-2xs' : 'text-[#6B7280] hover:text-[#111827]'
                          }`}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Name & Subtitle Input */}
                <div className="space-y-2.5 bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-xl">
                  <div>
                    <label htmlFor="nqp-modal-item-name" className="text-xs font-extrabold text-[#4B5563] uppercase tracking-wide block mb-1">
                      Product / Item Name *
                    </label>
                    <input
                      id="nqp-modal-item-name"
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder={`e.g. ${targetScope === 'Other Items' ? 'Custom Blinds, Soft Close Hinges, Labour' : targetScope + ' Module'}`}
                      className="w-full h-9 px-3 text-xs font-bold text-[#111827] bg-white border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#00D9D9]"
                    />
                  </div>
                  <div>
                    <label htmlFor="nqp-modal-item-sub" className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wide block mb-1">
                      Specification Details / Subtitle
                    </label>
                    <input
                      id="nqp-modal-item-sub"
                      type="text"
                      value={newSubtitle}
                      onChange={(e) => setNewSubtitle(e.target.value)}
                      placeholder="e.g. Warm white LED strip lights, 18mm HDMR with Premium Laminate"
                      className="w-full h-8 px-3 text-xs font-medium text-[#111827] bg-white border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#00D9D9]"
                    />
                  </div>
                </div>

                {/* Conditional Grid for Dimensional vs Non-Dimensional */}
                {isNonDimensionalCategory(targetScope) ? (
                  <div className="space-y-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4">
                    <p className="text-xs font-semibold text-[#6B7280]">
                      {targetScope} items are priced per unit / package and do not require height/width dimensions.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white border-2 border-[#E2E8F0] rounded-xl p-3 focus-within:border-[#00D9D9] transition">
                        <span className="text-[10px] font-extrabold text-[#4B5563] uppercase block mb-1">UNIT RATE (₹)</span>
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-[#6B7280]">₹</span>
                          <input
                            type="number"
                            value={newRate === 0 ? '' : newRate}
                            onChange={(e) => setNewRate(parseCleanNumber(e.target.value))}
                            placeholder="e.g. 1000"
                            className="w-full text-base font-extrabold font-mono text-[#111827] bg-transparent focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="bg-white border-2 border-[#E2E8F0] rounded-xl p-3 focus-within:border-[#00D9D9] transition">
                        <span className="text-[10px] font-extrabold text-[#4B5563] uppercase block mb-1">QUANTITY</span>
                        <div className="flex items-center justify-between gap-1">
                          <input
                            type="number"
                            value={newQty === 0 ? '' : newQty}
                            onChange={(e) => setNewQty(parseCleanNumber(e.target.value))}
                            placeholder="e.g. 1"
                            className="w-full text-base font-extrabold font-mono text-[#111827] bg-transparent focus:outline-none"
                          />
                          <span className="text-xs font-bold text-[#6B7280]">Units</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Dimensional Grid */
                  <div className={`grid gap-3 ${targetScope.toLowerCase() === 'box work' ? 'grid-cols-3' : 'grid-cols-2'}`}>
                    <div className="bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-xl p-3.5 focus-within:border-[#00D9D9] transition">
                      <span className="text-[10px] font-extrabold text-[#4B5563] uppercase block mb-1">
                        {targetScope.toLowerCase() === 'wall panelling' || targetScope.toLowerCase() === 'countertops' ? 'LENGTH' : 'HEIGHT'}
                      </span>
                      <div className="flex items-center justify-between gap-1">
                        <input
                          type="number"
                          value={newHeight === 0 ? '' : newHeight}
                          onChange={(e) => setNewHeight(parseCleanNumber(e.target.value))}
                          placeholder="e.g. 2000"
                          className="w-full text-lg font-black font-mono text-[#111827] bg-transparent focus:outline-none"
                        />
                        <span className="text-xs font-bold text-[#6B7280] uppercase">{newUnit}</span>
                      </div>
                    </div>

                    <div className="bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-xl p-3.5 focus-within:border-[#00D9D9] transition">
                      <span className="text-[10px] font-extrabold text-[#4B5563] uppercase block mb-1">WIDTH</span>
                      <div className="flex items-center justify-between gap-1">
                        <input
                          type="number"
                          value={newWidth === 0 ? '' : newWidth}
                          onChange={(e) => setNewWidth(parseCleanNumber(e.target.value))}
                          placeholder="e.g. 1500"
                          className="w-full text-lg font-black font-mono text-[#111827] bg-transparent focus:outline-none"
                        />
                        <span className="text-xs font-bold text-[#6B7280] uppercase">{newUnit}</span>
                      </div>
                    </div>

                    {/* DEPTH IS ASKED ONLY FOR BOX WORK */}
                    {targetScope.toLowerCase() === 'box work' && (
                      <div className="bg-[#F8FAFC] border-2 border-[#00D9D9]/40 rounded-xl p-3.5 focus-within:border-[#00D9D9] transition">
                        <span className="text-[10px] font-extrabold text-[#008080] uppercase block mb-1">DEPTH (BOX)</span>
                        <div className="flex items-center justify-between gap-1">
                          <input
                            type="number"
                            value={newDepth === 0 ? '' : newDepth}
                            onChange={(e) => setNewDepth(parseCleanNumber(e.target.value))}
                            placeholder="e.g. 500"
                            className="w-full text-lg font-black font-mono text-[#111827] bg-transparent focus:outline-none"
                          />
                          <span className="text-xs font-bold text-[#6B7280] uppercase">{newUnit === 'ft' ? 'in' : newUnit}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between gap-2">
              {modalWizardStep === 2 ? (
                <button
                  type="button"
                  onClick={() => setModalWizardStep(1)}
                  className="px-3.5 py-2 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#4B5563] hover:text-[#111827] font-bold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer"
                >
                  ← Change Work Type
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddScopeModal(false)}
                  className="px-4 py-2 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#111827] font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                {modalWizardStep === 2 && (
                  <button
                    type="button"
                    onClick={() => handleAddItemForCategory(targetScope, newWidth, newHeight, newDepth, newUnit)}
                    className="px-5 py-2 bg-[#00D9D9] hover:bg-[#00B8B8] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Item Card
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unsaved Draft Clear Confirmation Modal */}
      {showClearConfirmModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl text-[#111827]">
            <div className="flex items-center gap-3 border-b border-[#E2E8F0] pb-3 text-amber-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="text-base font-extrabold text-[#111827]">Unsaved Quotation Draft</h3>
                <p className="text-xs font-semibold text-[#6B7280]">Approval Required Before Discarding</p>
              </div>
            </div>

            <p className="text-xs text-[#374151] leading-relaxed font-medium">
              You currently have <strong className="text-[#111827]">{items.length} item card(s)</strong> configured in your active quotation draft.
              Discarding this draft will permanently delete these item cards.
            </p>

            <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
              <button
                onClick={() => setShowClearConfirmModal(false)}
                className="px-4 py-2 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#111827] font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Keep Working
              </button>
              <button
                onClick={handleClearDraftConfirmed}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-2xs transition cursor-pointer"
              >
                Yes, Discard Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
