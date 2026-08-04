import React, { useState, useMemo, useEffect, useRef } from 'react';
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
import {
  DEFAULT_CATEGORIES,
  DEFAULT_ITEM_TYPES,
  CUSTOM_CATEGORY_EXAMPLES,
  CUSTOM_ITEM_TYPE_EXAMPLES,
  CategoryOption,
  ItemTypeOption,
} from '@/constants/quotationMasterData';
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
  ChevronDown,
  ChevronUp,
  Folder,
  Layers,
  Box,
  Utensils,
  Bed,
  Tv,
  Coffee,
  Briefcase,
  Bath,
  Wrench,
  Sun,
  PlusCircle,
  GripVertical,
  Maximize2,
} from 'lucide-react';

export interface CommercialItem {
  id: string;
  category: string;
  itemType: string;
  customCategoryName?: string;
  customItemTypeName?: string;
  categoryOrder?: number;
  itemOrder?: number;
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
  rate: number;
  amount: number;
  pricingMethod?: PricingMethod;
}

export const BUILDER_DRAFT_STORAGE_KEY = 'nqp_active_quotation_builder_draft_v1';

const getCategoryIcon = (categoryName?: string) => {
  const cat = (categoryName || '').toLowerCase();
  if (cat.includes('kitchen')) return <Utensils className="w-4 h-4 text-[#008080]" />;
  if (cat.includes('bedroom')) return <Bed className="w-4 h-4 text-[#008080]" />;
  if (cat.includes('hall') || cat.includes('living')) return <Tv className="w-4 h-4 text-[#008080]" />;
  if (cat.includes('dining')) return <Coffee className="w-4 h-4 text-[#008080]" />;
  if (cat.includes('office')) return <Briefcase className="w-4 h-4 text-[#008080]" />;
  if (cat.includes('bath')) return <Bath className="w-4 h-4 text-[#008080]" />;
  if (cat.includes('utility')) return <Wrench className="w-4 h-4 text-[#008080]" />;
  if (cat.includes('exterior') || cat.includes('balcony')) return <Sun className="w-4 h-4 text-[#008080]" />;
  return <Folder className="w-4 h-4 text-[#008080]" />;
};

const loadSavedBuilderDraft = () => {
  try {
    const raw = localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY) || sessionStorage.getItem(BUILDER_DRAFT_STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data && typeof data === 'object') {
        const sanitizedItems = (Array.isArray(data.items) ? data.items : []).map((i: any) => ({
          ...i,
          category: i.category || 'Kitchen',
          itemType: i.itemType || i.category || 'Box Work',
        }));
        return {
          discountPercent: typeof data.discountPercent === 'number' ? data.discountPercent : 0,
          discountType: data.discountType === 'flat' ? ('flat' as const) : ('%' as const),
          paymentTerms: data.paymentTerms || '50% Advance, 50% After Completion',
          termsAndConditions: data.termsAndConditions || '1. 50% Advance on order confirmation.\n2. Balance 50% before dispatch.\n3. Work completion subject to site readiness.',
          items: sanitizedItems,
        };
      }
    }
  } catch (err) {
    console.error('Failed to parse cached quotation draft:', err);
  }
  return {
    discountPercent: 0,
    discountType: '%' as const,
    paymentTerms: '50% Advance, 50% After Completion',
    termsAndConditions: '1. 50% Advance on order confirmation.\n2. Balance 50% before dispatch.\n3. Work completion subject to site readiness.',
    items: [],
  };
};

export const NexveltQuoteProBuilder: React.FC = () => {
  const { setPrintPreviewOpen, addToast } = useUIStore();
  const { project, updateCustomerDetails, updateProjectDetails } = useProjectStore();
  const { company } = useCompanyStore();
  const { setQuotationItems, updateTermsAndConditions, updateCustomerDetails: updateQuoteCustomer } = useQuotationStore();

  const handleCustomerChange = (field: string, val: string) => {
    updateCustomerDetails({ [field]: val });
    updateQuoteCustomer({ [field]: val });
  };

  const initialDraft = useMemo(() => loadSavedBuilderDraft(), []);

  const [discountPercent, setDiscountPercent] = useState<number>(initialDraft.discountPercent);
  const [discountType, setDiscountType] = useState<'%' | 'flat'>(initialDraft.discountType);
  const [paymentTerms, setPaymentTerms] = useState<string>(initialDraft.paymentTerms);
  const [termsAndConditions, setTermsAndConditions] = useState<string>(initialDraft.termsAndConditions);

  // Commercial Items State
  const [items, setItems] = useState<CommercialItem[]>(initialDraft.items);

  // Collapsed Categories State (Map of categoryName -> boolean)
  const [collapsedCategories, setCollapsedCategories] = useState<{ [category: string]: boolean }>({});

  // Modals State
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showRevisionsModal, setShowRevisionsModal] = useState(false);
  const [showDashboardModal, setShowDashboardModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);

  // ENTERPRISE V3 ADD ITEM WORKFLOW MODAL STATE
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [addItemStep, setAddItemStep] = useState<1 | 2>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('Kitchen');
  const [customCategoryName, setCustomCategoryName] = useState<string>('');
  const [selectedItemType, setSelectedItemType] = useState<string>('Box Work');
  const [customItemTypeName, setCustomItemTypeName] = useState<string>('');

  // Target ref for auto-focusing new item input
  const newItemInputRef = useRef<HTMLInputElement | null>(null);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  // Auto-save active builder draft to session and local storage
  useEffect(() => {
    try {
      setQuotationItems(items);
      updateTermsAndConditions(termsAndConditions);
      const payload = {
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
  }, [discountPercent, discountType, paymentTerms, termsAndConditions, items, setQuotationItems, updateTermsAndConditions]);

  // Handle external clear event
  useEffect(() => {
    const handleClearEvent = () => {
      setItems([]);
      setDiscountPercent(0);
      setDiscountType('%');
    };
    window.addEventListener('nqp_clear_builder_draft', handleClearEvent);
    return () => window.removeEventListener('nqp_clear_builder_draft', handleClearEvent);
  }, []);

  // Helper to identify non-dimensional item types
  const isNonDimensionalType = (itemType?: string) => {
    const t = (itemType || '').toLowerCase();
    return t.includes('hardware') || t.includes('accessories') || t.includes('other');
  };

  // Helper to calculate area & line item amount
  const calculateItemAreaAndAmount = (item: CommercialItem): CommercialItem => {
    const itemTypeSafe = item.itemType || item.category || 'Box Work';
    if (isNonDimensionalType(itemTypeSafe)) {
      const amount = (item.rate || 0) * (item.qty || 1);
      return {
        ...item,
        itemType: itemTypeSafe,
        areaSqFt: 0,
        amount,
        pricingMethod: 'per_unit',
      };
    }

    let area = 0;
    const wFt = convertToFeet(item.width, item.unit);
    const hFt = convertToFeet(item.height, item.unit);

    switch (itemTypeSafe.toLowerCase()) {
      case 'box work':
      case 'wardrobe':
      case 'loft':
      case 'storage':
        area = calculateBoxWorkArea(item.width, item.height, item.unit);
        break;
      case 'frame work':
      case 'shelves':
      case 'partition':
        area = calculateFrameWorkArea(item.width, item.height, item.depth, item.unit).areaSqFt;
        break;
      case 'shutters':
      case 'door':
      case 'window':
        area = calculateShutterArea(item.width, item.height, item.unit);
        break;
      case 'wall panel':
      case 'tv unit':
      case 'ceiling':
        area = calculatePanellingArea(item.length || item.width, item.height, item.unit);
        break;
      case 'countertop':
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

  // Field Updates for an Item
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

  const handleDuplicateItem = (itemToCopy: CommercialItem) => {
    const duplicated: CommercialItem = {
      ...itemToCopy,
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title: `${itemToCopy.title} (Copy)`,
    };
    setItems((prev) => [...prev, duplicated]);
    addToast({ type: 'success', title: 'Item Duplicated', message: `Created copy of ${itemToCopy.title}` });
  };

  // Open Add Item Modal (Global or Per Category)
  const openAddItemModal = (targetCategory?: string) => {
    if (targetCategory) {
      setSelectedCategory(targetCategory);
      setAddItemStep(2); // Jump straight to Step 2 for per-category add
    } else {
      setSelectedCategory('Kitchen');
      setAddItemStep(1); // Start at Step 1 for global add
    }
    setCustomCategoryName('');
    setSelectedItemType('Box Work');
    setCustomItemTypeName('');
    setShowAddItemModal(true);
  };

  // EXECUTE CREATION OF NEW ITEM
  const handleCreateNewItem = (categoryChoice?: string, itemTypeChoice?: string) => {
    const catFinal = (categoryChoice || (selectedCategory === 'Others' ? customCategoryName.trim() : selectedCategory)) || 'Kitchen';
    const typeFinal = (itemTypeChoice || (selectedItemType === 'Other Item' ? customItemTypeName.trim() : selectedItemType)) || 'Box Work';

    const newItemId = `item_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;

    const defaultRate = getDefaultRateForCategory(typeFinal) || 1200;
    const isNonDim = isNonDimensionalType(typeFinal);

    const rawItem: CommercialItem = {
      id: newItemId,
      category: catFinal,
      itemType: typeFinal,
      image: '/furniture/wardrobe_4door.png',
      title: `${catFinal} ${typeFinal}`,
      subtitle: `${typeFinal} Custom Specification`,
      unit: 'mm',
      width: isNonDim ? 0 : 1500,
      height: isNonDim ? 0 : 2000,
      depth: isNonDim ? 0 : 500,
      length: 0,
      areaSqFt: 0,
      material: '18mm HDMR Board',
      finish: '1mm Premium Laminate',
      qty: 1,
      rate: defaultRate,
      amount: 0,
      pricingMethod: isNonDim ? 'per_unit' : 'per_sqft',
    };

    const calculated = calculateItemAreaAndAmount(rawItem);

    // Uncollapse target category
    setCollapsedCategories((prev) => ({ ...prev, [catFinal]: false }));

    // Append item
    setItems((prev) => [...prev, calculated]);
    setRecentlyAddedId(newItemId);
    setShowAddItemModal(false);

    addToast({
      type: 'success',
      title: 'Item Added',
      message: `Added ${typeFinal} under ${catFinal}`,
    });

    // Auto-scroll and focus
    setTimeout(() => {
      const el = document.getElementById(`item-card-${newItemId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);

    setTimeout(() => {
      if (newItemInputRef.current) {
        newItemInputRef.current.focus();
        newItemInputRef.current.select();
      }
    }, 250);
  };

  // Group Items by Category for Canvas Display
  const groupedCategories = useMemo(() => {
    const groups: { [cat: string]: CommercialItem[] } = {};
    items.forEach((item) => {
      const cat = item.category || 'General';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }, [items]);

  const activeCategoryList = Object.keys(groupedCategories);

  // Commercial Summary Engine
  const summary = useMemo(() => {
    return calculateCommercialSummary({ items, discountPercent, discountType });
  }, [items, discountPercent, discountType]);

  // Category Duplicate & Delete Actions
  const handleDuplicateCategory = (categoryName: string) => {
    const categoryItems = groupedCategories[categoryName] || [];
    const duplicatedItems = categoryItems.map((item) => ({
      ...item,
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title: `${item.title} (Copy)`,
    }));
    setItems((prev) => [...prev, ...duplicatedItems]);
    addToast({ type: 'success', title: 'Category Duplicated', message: `Duplicated ${categoryName} category (${categoryItems.length} items)` });
  };

  const handleDeleteCategory = (categoryName: string) => {
    setItems((prev) => prev.filter((item) => item.category !== categoryName));
    addToast({ type: 'info', title: 'Category Deleted', message: `Removed ${categoryName} and its items.` });
  };

  const toggleCategoryCollapse = (categoryName: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* 2-Column Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ========================================================= */}
        {/* LEFT COLUMN (70% Width)                                   */}
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
                className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline flex items-center gap-1 transition-colors cursor-pointer"
                title="Clear all customer fields"
              >
                <span>✕ Clear</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  onChange={(e) => handleCustomerChange('name', e.target.value)}
                  className={`w-full h-9 bg-white border rounded-lg px-3 text-xs text-[#111827] focus:outline-none font-medium transition-colors ${
                    !project.customer.name?.trim() ? 'border-red-300 focus:border-red-500 bg-red-50/30' : 'border-[#E2E8F0] focus:border-[#00D9D9]'
                  }`}
                />
              </div>
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
                  onChange={(e) => handleCustomerChange('phone', e.target.value)}
                  className={`w-full h-9 bg-white border rounded-lg px-3 text-xs text-[#111827] focus:outline-none font-medium transition-colors ${
                    !project.customer.phone?.trim() ? 'border-red-300 focus:border-red-500 bg-red-50/30' : 'border-[#E2E8F0] focus:border-[#00D9D9]'
                  }`}
                />
              </div>
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
                  onChange={(e) => handleCustomerChange('email', e.target.value)}
                  className={`w-full h-9 bg-white border rounded-lg px-3 text-xs text-[#111827] focus:outline-none font-medium transition-colors ${
                    !project.customer.email?.trim() ? 'border-red-300 focus:border-red-500 bg-red-50/30' : 'border-[#E2E8F0] focus:border-[#00D9D9]'
                  }`}
                />
              </div>
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
                    handleCustomerChange('projectLocation', val);
                  }}
                  className={`w-full h-9 bg-white border rounded-lg px-3 text-xs text-[#111827] focus:outline-none font-medium transition-colors ${
                    !project.projectLocation?.trim() ? 'border-red-300 focus:border-red-500 bg-red-50/30' : 'border-[#E2E8F0] focus:border-[#00D9D9]'
                  }`}
                />
              </div>
            </div>
          </section>

          {/* STEP 2: CATEGORY-GROUPED ITEMS BUILDER */}
          <section id="quotation-step-2" className="space-y-6">
            
            {/* Top Global Add Item Header Banner */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#00D9D9] text-white text-xs font-bold flex items-center justify-center">
                  2
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-[#111827]">Quotation Items ({items.length})</h2>
                  <p className="text-[11px] text-[#6B7280]">Grouped by Category & Item Type</p>
                </div>
              </div>

              {/* Primary + Add Item Button */}
              <button
                onClick={() => openAddItemModal()}
                className="px-4 py-2 bg-[#00D9D9] hover:bg-[#00B8B8] text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-xs transition transform hover:scale-[1.01] cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Add Item</span>
              </button>
            </div>

            {/* CATEGORY GROUPS CANVAS */}
            {activeCategoryList.length > 0 ? (
              activeCategoryList.map((catName) => {
                const catItems = groupedCategories[catName];
                const isCollapsed = Boolean(collapsedCategories[catName]);
                const catTotalArea = catItems.reduce((a, b) => a + (b.areaSqFt || 0), 0);
                const catTotalAmount = catItems.reduce((a, b) => a + (b.amount || 0), 0);

                return (
                  <div
                    key={catName}
                    className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xs overflow-hidden transition-all duration-200"
                  >
                    {/* CATEGORY HEADER */}
                    <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#E6F7F7] border border-[#00D9D9]/30">
                          {getCategoryIcon(catName)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-black text-[#111827]">{catName}</h3>
                            <span className="text-[10px] font-extrabold bg-[#E2E8F0] text-[#4B5563] px-2 py-0.5 rounded-full">
                              {catItems.length} {catItems.length === 1 ? 'Item' : 'Items'}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#6B7280] font-semibold space-x-3 mt-0.5">
                            <span>Total Area: <strong>{catTotalArea.toFixed(2)} sq.ft</strong></span>
                            <span>• Total: <strong className="text-[#008080]">₹{catTotalAmount.toLocaleString('en-IN')}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Category Header Controls */}
                      <div className="flex items-center gap-1.5">
                        {/* Duplicate Category */}
                        <button
                          onClick={() => handleDuplicateCategory(catName)}
                          className="p-1.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F1F5F9] text-[#4B5563] hover:text-[#111827] text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                          title="Duplicate Category"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Duplicate</span>
                        </button>

                        {/* Delete Category */}
                        <button
                          onClick={() => handleDeleteCategory(catName)}
                          className="p-1.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-red-50 text-red-600 text-xs font-bold transition cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Collapse / Expand Toggle */}
                        <button
                          onClick={() => toggleCategoryCollapse(catName)}
                          className="p-1.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F1F5F9] text-[#4B5563] transition cursor-pointer"
                          title={isCollapsed ? 'Expand Category' : 'Collapse Category'}
                        >
                          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* CATEGORY ITEMS LIST */}
                    {!isCollapsed && (
                      <div className="p-4 sm:p-5 space-y-4">
                        {catItems.map((item, idx) => {
                          const isRecentlyAdded = item.id === recentlyAddedId;

                          return (
                            <div
                              key={item.id}
                              id={`item-card-${item.id}`}
                              className={`bg-white border rounded-xl p-4 sm:p-5 space-y-4 transition-all duration-300 ${
                                isRecentlyAdded ? 'border-[#00D9D9] ring-2 ring-[#00D9D9]/20 shadow-md' : 'border-[#E2E8F0] shadow-2xs hover:border-[#CBD5E1]'
                              }`}
                            >
                              {/* Item Card Badges Header */}
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F1F5F9] pb-3">
                                <div className="flex items-center gap-2">
                                  <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-[#E6F7F7] text-[#008080] rounded-md border border-[#00D9D9]/30">
                                    {item.category}
                                  </span>
                                  <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-[#F1F5F9] text-[#4B5563] rounded-md border border-[#E2E8F0]">
                                    {item.itemType}
                                  </span>
                                  <span className="text-xs font-bold text-[#6B7280]">
                                    Item #{idx + 1}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => handleDuplicateItem(item)}
                                    className="p-1 rounded bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#F1F5F9] text-[#4B5563] text-xs font-bold flex items-center gap-1 cursor-pointer"
                                    title="Duplicate Item"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="p-1 rounded bg-white border border-[#E2E8F0] hover:bg-red-50 text-red-600 cursor-pointer"
                                    title="Delete Item"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Item Card Body */}
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                {/* Thumbnail */}
                                <div className="md:col-span-2 flex justify-center">
                                  <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-16 h-16 object-contain rounded-lg border border-[#E2E8F0] p-1 bg-[#F8FAFC]"
                                  />
                                </div>

                                {/* Title & Specification Input */}
                                <div className="md:col-span-5 space-y-2">
                                  <div>
                                    <label className="text-[10px] font-bold text-[#4B5563] uppercase block mb-0.5">Product Name</label>
                                    <input
                                      type="text"
                                      ref={isRecentlyAdded ? newItemInputRef : undefined}
                                      value={item.title}
                                      onChange={(e) => handleItemUpdate(item.id, { title: e.target.value })}
                                      className="w-full h-8 bg-white border border-[#E2E8F0] rounded-lg px-2.5 text-xs text-[#111827] font-bold focus:outline-none focus:border-[#00D9D9]"
                                      placeholder="e.g. Master Bedroom Wardrobe"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-bold text-[#4B5563] uppercase block mb-0.5">Specification / Details</label>
                                    <input
                                      type="text"
                                      value={item.subtitle}
                                      onChange={(e) => handleItemUpdate(item.id, { subtitle: e.target.value })}
                                      className="w-full h-7 bg-white border border-[#E2E8F0] rounded-lg px-2.5 text-[11px] text-[#4B5563] font-medium focus:outline-none focus:border-[#00D9D9]"
                                      placeholder="e.g. 18mm HDMR with 1mm Acrylic"
                                    />
                                  </div>
                                </div>

                                {/* Dimensions / Rate / Qty */}
                                <div className="md:col-span-5 grid grid-cols-3 gap-2 text-center bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                                  {/* Width x Height */}
                                  <div>
                                    <span className="text-[9px] font-bold text-[#6B7280] uppercase block">Dimensions</span>
                                    {!isNonDimensionalType(item.itemType) ? (
                                      <div className="flex items-center justify-center gap-1 mt-1">
                                        <input
                                          type="number"
                                          value={item.width || ''}
                                          onChange={(e) => handleItemUpdate(item.id, { width: parseFloat(e.target.value) || 0 })}
                                          className="w-11 h-6 text-center text-xs font-mono font-bold bg-white border border-[#E2E8F0] rounded"
                                        />
                                        <span className="text-xs font-bold text-slate-400">×</span>
                                        <input
                                          type="number"
                                          value={item.height || ''}
                                          onChange={(e) => handleItemUpdate(item.id, { height: parseFloat(e.target.value) || 0 })}
                                          className="w-11 h-6 text-center text-xs font-mono font-bold bg-white border border-[#E2E8F0] rounded"
                                        />
                                      </div>
                                    ) : (
                                      <span className="text-xs font-semibold text-[#6B7280] block mt-1">Fixed Unit</span>
                                    )}
                                    <span className="text-[10px] font-mono text-[#008080] font-bold block mt-1">
                                      {item.areaSqFt > 0 ? `${item.areaSqFt.toFixed(2)} sq.ft` : 'N/A'}
                                    </span>
                                  </div>

                                  {/* Rate */}
                                  <div>
                                    <span className="text-[9px] font-bold text-[#6B7280] uppercase block">Rate (₹)</span>
                                    <input
                                      type="number"
                                      value={item.rate || ''}
                                      onChange={(e) => handleItemUpdate(item.id, { rate: parseFloat(e.target.value) || 0 })}
                                      className="w-16 h-6 text-center text-xs font-mono font-bold bg-white border border-[#E2E8F0] rounded mx-auto mt-1"
                                    />
                                    <span className="text-[9px] text-[#6B7280] block mt-1">/ {item.pricingMethod === 'per_unit' ? 'unit' : 'sq.ft'}</span>
                                  </div>

                                  {/* Qty & Line Amount */}
                                  <div>
                                    <span className="text-[9px] font-bold text-[#6B7280] uppercase block">Qty & Amount</span>
                                    <div className="flex items-center justify-center gap-1 mt-1">
                                      <button
                                        onClick={() => handleQtyChange(item.id, -1)}
                                        className="w-5 h-5 rounded bg-white border border-[#E2E8F0] flex items-center justify-center text-xs font-bold"
                                      >
                                        -
                                      </button>
                                      <span className="text-xs font-bold font-mono px-1">{item.qty}</span>
                                      <button
                                        onClick={() => handleQtyChange(item.id, 1)}
                                        className="w-5 h-5 rounded bg-white border border-[#E2E8F0] flex items-center justify-center text-xs font-bold"
                                      >
                                        +
                                      </button>
                                    </div>
                                    <span className="text-xs font-extrabold font-mono text-[#111827] block mt-1">
                                      ₹{item.amount.toLocaleString('en-IN')}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        {/* CATEGORY FOOTER TOTALS & PER-CATEGORY + ADD ITEM BUTTON */}
                        <div className="pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 bg-[#F8FAFC] p-3 rounded-xl">
                          <div className="text-xs font-semibold text-[#4B5563] space-x-4">
                            <span>{catName} Items: <strong>{catItems.length}</strong></span>
                            <span>Total Area: <strong>{catTotalArea.toFixed(2)} sq.ft</strong></span>
                            <span>Total Amount: <strong className="text-[#008080]">₹{catTotalAmount.toLocaleString('en-IN')}</strong></span>
                          </div>

                          {/* Per-Category Add Item Button */}
                          <button
                            onClick={() => openAddItemModal(catName)}
                            className="px-3 py-1.5 bg-white hover:bg-[#E6F7F7] text-[#008080] font-bold text-xs rounded-lg border border-[#00D9D9]/40 transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>+ Add Item to {catName}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              /* EMPTY STATE */
              <div className="bg-white border-2 border-dashed border-[#CBD5E1] rounded-2xl p-10 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#E6F7F7] text-[#008080] flex items-center justify-center mx-auto">
                  <Box className="w-6 h-6" />
                </div>
                <div className="max-w-md mx-auto">
                  <h3 className="text-base font-extrabold text-[#111827]">No Items Added Yet</h3>
                  <p className="text-xs text-[#6B7280] mt-1">
                    Click <strong>+ Add Item</strong> to start building your quotation by Category and Item Type.
                  </p>
                </div>
                <button
                  onClick={() => openAddItemModal()}
                  className="px-5 py-2.5 bg-[#00D9D9] hover:bg-[#00B8B8] text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-2 mx-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>+ Add First Item</span>
                </button>
              </div>
            )}
          </section>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN (30% Width)                                  */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 space-y-6">

          {/* STEP 3: SUMMARY & EXPORT PANEL */}
          <section id="quotation-step-3" className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4 sticky top-20">
            <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
              <div className="w-6 h-6 rounded-full bg-[#00D9D9] text-white text-xs font-bold flex items-center justify-center">
                3
              </div>
              <h2 className="text-sm font-extrabold text-[#111827]">Summary & Export</h2>
            </div>

            {/* Category Summary Breakdown */}
            {activeCategoryList.length > 0 && (
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3.5 rounded-xl space-y-2 text-xs">
                <span className="text-[10px] font-extrabold uppercase text-[#008080] block border-b border-[#E2E8F0] pb-1">
                  Category Summary Breakdown
                </span>
                <div className="space-y-1.5">
                  {activeCategoryList.map((catName) => {
                    const catTotal = (groupedCategories[catName] || []).reduce((a, b) => a + (b.amount || 0), 0);
                    return (
                      <div key={catName} className="flex justify-between items-center text-[#111827]">
                        <span className="font-semibold text-[#4B5563]">{catName}</span>
                        <span className="font-mono font-bold">₹{catTotal.toLocaleString('en-IN')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-xs font-medium border-b border-[#E2E8F0] pb-4">
              <div className="flex justify-between text-[#4B5563]">
                <span>Items Subtotal ({items.length} items):</span>
                <span className="font-mono font-bold text-[#111827]">₹{(summary.itemsSubtotal || 0).toLocaleString('en-IN')}</span>
              </div>

              {/* Discount Controls */}
              <div className="flex items-center justify-between text-[#4B5563]">
                <span>Discount:</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={discountPercent || ''}
                    onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                    className="w-16 h-7 bg-white border border-[#E2E8F0] rounded text-center text-xs font-bold font-mono"
                    placeholder="0"
                  />
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as '%' | 'flat')}
                    className="h-7 bg-[#F8FAFC] border border-[#E2E8F0] rounded text-xs font-bold px-1"
                  >
                    <option value="%">%</option>
                    <option value="flat">₹</option>
                  </select>
                </div>
              </div>

              {summary.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Applied Discount:</span>
                  <span className="font-mono">- ₹{summary.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            {/* Grand Total */}
            <div className="bg-[#E6F7F7] border border-[#00D9D9]/40 p-4 rounded-xl space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-[#008080] tracking-wider block">Grand Total</span>
              <div className="text-2xl font-black font-mono text-[#008080]">
                ₹{summary.grandTotal.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Payment Terms */}
            <div>
              <label htmlFor="nqp-payment-terms" className="text-xs font-bold text-[#4B5563] block mb-1">
                Payment Terms
              </label>
              <input
                id="nqp-payment-terms"
                type="text"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="w-full h-9 bg-white border border-[#E2E8F0] rounded-lg px-3 text-xs text-[#111827] font-medium"
              />
            </div>

            {/* Terms & Conditions */}
            <div>
              <label htmlFor="nqp-terms-conditions" className="text-xs font-bold text-[#4B5563] block mb-1">
                Terms & Conditions
              </label>
              <textarea
                id="nqp-terms-conditions"
                rows={3}
                value={termsAndConditions}
                onChange={(e) => setTermsAndConditions(e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] rounded-lg p-2.5 text-xs text-[#111827] font-medium focus:outline-none focus:border-[#00D9D9] leading-relaxed"
              />
            </div>

            {/* Print & PDF Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => setPrintPreviewOpen(true)}
                className="w-full py-3 bg-[#00D9D9] hover:bg-[#00B8B8] text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileDown className="w-4 h-4" /> Print / Export A4 PDF
              </button>

              <button
                onClick={() => setShowPurchaseModal(true)}
                className="w-full py-2 bg-white hover:bg-[#F8FAFC] text-[#111827] font-bold text-xs rounded-xl border border-[#E2E8F0] transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Layers className="w-4 h-4 text-[#00B8B8]" /> Export Material BOM
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ENTERPRISE V3 ADD ITEM WORKFLOW MODAL                      */}
      {/* ========================================================= */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl text-[#111827] overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#E6F7F7] border border-[#00D9D9]/30 flex items-center justify-center text-[#008080]">
                  <Plus className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#111827]">
                    {addItemStep === 1 ? 'Step 1: Select Category' : 'Step 2: Select Item Type'}
                  </h3>
                  <p className="text-xs font-semibold text-[#6B7280]">
                    {addItemStep === 1 ? 'Choose the room or area category' : `Select item type for ${selectedCategory}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddItemModal(false)}
                className="text-[#6B7280] hover:text-[#111827] text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              
              {/* STEP 1: SELECT CATEGORY */}
              {addItemStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {DEFAULT_CATEGORIES.map((cat) => {
                      const isSelected = selectedCategory === cat.name;
                      return (
                        <div
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategory(cat.name);
                            if (!cat.isCustom) {
                              setAddItemStep(2);
                            }
                          }}
                          className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer text-left space-y-1.5 ${
                            isSelected
                              ? 'bg-[#E6F7F7] border-[#00D9D9] text-[#008080] shadow-xs'
                              : 'bg-white border-[#E2E8F0] text-[#111827] hover:border-[#00D9D9]/40 hover:bg-[#F8FAFC]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(cat.name)}
                            <span className="font-extrabold text-xs block">{cat.name}</span>
                          </div>
                          {cat.description && (
                            <p className="text-[10px] text-[#6B7280] line-clamp-2">{cat.description}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Custom Category Input if "Others" Selected */}
                  {selectedCategory === 'Others' && (
                    <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-xl space-y-2.5">
                      <label className="text-xs font-extrabold text-[#111827] block">
                        Custom Category Name *
                      </label>
                      <input
                        type="text"
                        value={customCategoryName}
                        onChange={(e) => setCustomCategoryName(e.target.value)}
                        placeholder="e.g. Temple, Balcony, Study Room, False Ceiling"
                        className="w-full h-9 bg-white border border-[#E2E8F0] rounded-lg px-3 text-xs text-[#111827] font-bold focus:outline-none focus:border-[#00D9D9]"
                      />

                      {/* Example Pills */}
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] font-bold text-[#6B7280] block">Suggestions:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {CUSTOM_CATEGORY_EXAMPLES.map((ex) => (
                            <button
                              key={ex}
                              onClick={() => setCustomCategoryName(ex)}
                              className="text-[10px] font-bold bg-white border border-[#E2E8F0] hover:border-[#00D9D9] text-[#4B5563] px-2 py-0.5 rounded-full transition cursor-pointer"
                            >
                              + {ex}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: SELECT ITEM TYPE */}
              {addItemStep === 2 && (
                <div className="space-y-4">
                  {/* Category Indicator Badge */}
                  <div className="flex items-center justify-between bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 rounded-xl text-xs font-bold text-[#4B5563]">
                    <div className="flex items-center gap-2">
                      <span>Category:</span>
                      <span className="bg-[#E6F7F7] text-[#008080] px-2.5 py-0.5 rounded-md border border-[#00D9D9]/30">
                        {selectedCategory === 'Others' ? (customCategoryName || 'Custom Category') : selectedCategory}
                      </span>
                    </div>
                    <button
                      onClick={() => setAddItemStep(1)}
                      className="text-[11px] text-[#00B8B8] font-bold hover:underline cursor-pointer"
                    >
                      ← Change Category
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {DEFAULT_ITEM_TYPES.map((type) => {
                      const isSelected = selectedItemType === type.name;
                      return (
                        <div
                          key={type.id}
                          onClick={() => {
                            setSelectedItemType(type.name);
                            if (!type.isCustom) {
                              handleCreateNewItem(undefined, type.name);
                            }
                          }}
                          className={`p-3 rounded-xl border-2 transition-all cursor-pointer text-center font-extrabold text-xs ${
                            isSelected
                              ? 'bg-[#E6F7F7] border-[#00D9D9] text-[#008080] shadow-xs'
                              : 'bg-white border-[#E2E8F0] text-[#111827] hover:border-[#00D9D9]/40 hover:bg-[#F8FAFC]'
                          }`}
                        >
                          {type.name}
                        </div>
                      );
                    })}
                  </div>

                  {/* Custom Item Type Input if "Other Item" Selected */}
                  {selectedItemType === 'Other Item' && (
                    <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-xl space-y-2.5">
                      <label className="text-xs font-extrabold text-[#111827] block">
                        Item Type Name *
                      </label>
                      <input
                        type="text"
                        value={customItemTypeName}
                        onChange={(e) => setCustomItemTypeName(e.target.value)}
                        placeholder="e.g. Mirror Frame, Shoe Rack, Mandir, Study Table"
                        className="w-full h-9 bg-white border border-[#E2E8F0] rounded-lg px-3 text-xs text-[#111827] font-bold focus:outline-none focus:border-[#00D9D9]"
                      />

                      {/* Example Pills */}
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] font-bold text-[#6B7280] block">Suggestions:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {CUSTOM_ITEM_TYPE_EXAMPLES.map((ex) => (
                            <button
                              key={ex}
                              onClick={() => setCustomItemTypeName(ex)}
                              className="text-[10px] font-bold bg-white border border-[#E2E8F0] hover:border-[#00D9D9] text-[#4B5563] px-2 py-0.5 rounded-full transition cursor-pointer"
                            >
                              + {ex}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 border-t border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              {addItemStep === 2 ? (
                <button
                  onClick={() => setAddItemStep(1)}
                  className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#111827] font-bold text-xs rounded-xl hover:bg-[#F1F5F9] cursor-pointer"
                >
                  ← Back to Categories
                </button>
              ) : (
                <div />
              )}

              <button
                onClick={() => {
                  if (addItemStep === 1) {
                    if (selectedCategory === 'Others' && !customCategoryName.trim()) {
                      addToast({ type: 'warning', title: 'Category Name Required', message: 'Please enter custom category name' });
                      return;
                    }
                    setAddItemStep(2);
                  } else {
                    if (selectedItemType === 'Other Item' && !customItemTypeName.trim()) {
                      addToast({ type: 'warning', title: 'Item Type Required', message: 'Please enter custom item type name' });
                      return;
                    }
                    handleCreateNewItem();
                  }
                }}
                className="px-5 py-2 bg-[#00D9D9] hover:bg-[#00B8B8] text-white font-extrabold text-xs rounded-xl shadow-xs transition cursor-pointer"
              >
                {addItemStep === 1 ? 'Next: Select Item Type →' : '✓ Create Item'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auxiliary Modals */}
      {showPurchaseModal && (
        <PurchaseListExportModal
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
          project={project as any}
        />
      )}
    </div>
  );
};
