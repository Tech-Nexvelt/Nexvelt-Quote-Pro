import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useQuotationStore } from '@/store/useQuotationStore';
import { useCustomerStore } from '@/store/useCustomerStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { User, Phone, MapPin, Search, CheckCircle2 } from 'lucide-react';

/**
 * Debounce helper — fires callback only after `delay` ms of no new calls.
 */
function useDebounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  return useCallback(
    (...args: Parameters<T>) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => fn(...args), delay);
    },
    [fn, delay]
  );
}

export const CustomerSelector: React.FC = () => {
  const { currentQuotation, setCustomer, setProjectDetails } = useQuotationStore();
  const { customers, searchCustomers, addCustomer, fetchCustomers } = useCustomerStore();
  const { company } = useAuthStore();
  const { addToast } = useUIStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);

  const matchedCustomers = searchCustomers(searchQuery);
  const companyId = company?.id || '5f0f21c7-a8c2-4df6-8dd4-mockcompany01';

  useEffect(() => {
    fetchCustomers(companyId);
  }, [companyId, fetchCustomers]);

  // ── Auto-save customer to DB when name + phone are both filled ────────────
  const persistCustomer = useCallback(
    (cust: { name: string; phone: string; email?: string; city?: string; projectLocation?: string }) => {
      if (!cust.name?.trim() || !cust.phone?.trim()) return;

      // Check if a customer with this phone already exists (avoid duplicates)
      const existing = customers.find(
        (c) => c.phone?.trim() === cust.phone.trim() || c.name?.toLowerCase().trim() === cust.name.toLowerCase().trim()
      );

      if (!existing) {
        addCustomer(
          {
            name: cust.name,
            phone: cust.phone,
            email: cust.email || '',
            city: cust.city || '',
            projectLocation: cust.projectLocation || '',
          },
          companyId ?? undefined
        );
        setAutoSaved(true);
        addToast({
          type: 'success',
          title: 'Customer Auto-Saved',
          message: `"${cust.name}" added to customer database.`,
        });
        // Reset saved indicator after 3s
        setTimeout(() => setAutoSaved(false), 3000);
      }
    },
    [customers, addCustomer, companyId, addToast]
  );

  const debouncedPersist = useDebounce(persistCustomer, 1200);

  // ── Field change handler ──────────────────────────────────────────────────
  const handleCustomerField = (field: string, value: string) => {
    setCustomer({ [field]: value });

    // Trigger auto-save with latest values merged
    const current = currentQuotation.customer;
    const merged = { ...current, [field]: value };
    debouncedPersist({
      name: merged.name || '',
      phone: merged.phone || '',
      email: merged.email || '',
      city: merged.city || '',
      projectLocation: merged.projectLocation || '',
    });
  };

  // ── Select from search dropdown ───────────────────────────────────────────
  const handleSelectCustomer = (c: any) => {
    setCustomer({
      name: c.name,
      phone: c.phone,
      email: c.email,
      city: c.city,
      projectLocation: c.projectLocation,
      gstNumber: c.gstNumber,
    });
    setSearchQuery('');
    setShowSearchResults(false);
  };

  return (
    <Card glass className="space-y-4 border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-[#00D9D9]" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Project &amp; Client Details
          </h3>
          {/* Auto-saved indicator */}
          {autoSaved && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              Auto-saved to DB
            </span>
          )}
        </div>

        {/* Quick Customer Search Auto-complete */}
        <div className="relative w-48 sm:w-64">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search saved customer..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
              className="w-full h-9 pl-8 pr-3 bg-white border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#00D9D9]"
            />
          </div>
          {showSearchResults && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {matchedCustomers.length === 0 ? (
                <div className="p-3 text-xs text-slate-500">No customer matches found.</div>
              ) : (
                matchedCustomers.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onMouseDown={() => handleSelectCustomer(c)}
                    className="w-full text-left p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{c.name}</div>
                      <div className="text-[11px] text-slate-500">{c.phone} • {c.city || 'Hyderabad'}</div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <Input
          label="Customer Name"
          value={currentQuotation.customer.name || ''}
          onChange={(e) => handleCustomerField('name', e.target.value)}
          placeholder="Client full name"
          required
        />

        <Input
          label="Phone Number"
          value={currentQuotation.customer.phone || ''}
          onChange={(e) => handleCustomerField('phone', e.target.value)}
          placeholder="+91 98765 43210"
          required
        />

        <Input
          label="Project Title"
          value={currentQuotation.projectName || ''}
          onChange={(e) => setProjectDetails({ projectName: e.target.value })}
          placeholder="e.g. 3BHK Interior Quotation"
        />

        <Input
          label="Quotation Number"
          value={currentQuotation.quotationNumber || ''}
          onChange={(e) => setProjectDetails({ quotationNumber: e.target.value })}
          placeholder="EST-2026-1001"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <Input
          label="Project Location / Site Address"
          value={currentQuotation.customer.projectLocation || ''}
          onChange={(e) => handleCustomerField('projectLocation', e.target.value)}
          placeholder="Building name, flat number, locality"
        />

        <Input
          label="Quotation Date"
          type="date"
          value={currentQuotation.date || ''}
          onChange={(e) => setProjectDetails({ date: e.target.value })}
        />
      </div>

      {/* Hint text */}
      <p className="text-[11px] text-[#9CA3AF] font-medium flex items-center gap-1.5">
        <MapPin className="w-3 h-3 shrink-0" />
        Customer details are automatically saved to the database when Name &amp; Phone are filled.
      </p>
    </Card>
  );
};
