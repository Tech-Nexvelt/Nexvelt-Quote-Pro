import React, { useState } from 'react';
import { useQuotationStore } from '@/store/useQuotationStore';
import { useCustomerStore } from '@/store/useCustomerStore';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { User, Phone, MapPin, Search, PlusCircle, Calendar, Hash } from 'lucide-react';

export const CustomerSelector: React.FC = () => {
  const { currentQuotation, setCustomer, setProjectDetails } = useQuotationStore();
  const { customers, searchCustomers, addCustomer } = useCustomerStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const matchedCustomers = searchCustomers(searchQuery);

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
            Project & Client Details
          </h3>
        </div>

        {/* Quick Customer Search Auto-complete */}
        <div className="relative w-48 sm:w-64">
          <Input
            placeholder="Search saved customer..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            prefixSymbol="🔍"
          />
          {showSearchResults && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {matchedCustomers.length === 0 ? (
                <div className="p-3 text-xs text-slate-500">No customer matches found.</div>
              ) : (
                matchedCustomers.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectCustomer(c)}
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
          onChange={(e) => setCustomer({ name: e.target.value })}
          placeholder="Client full name"
          required
        />

        <Input
          label="Phone Number"
          value={currentQuotation.customer.phone || ''}
          onChange={(e) => setCustomer({ phone: e.target.value })}
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
          onChange={(e) => setCustomer({ projectLocation: e.target.value })}
          placeholder="Building name, flat number, locality"
        />

        <Input
          label="Quotation Date"
          type="date"
          value={currentQuotation.date || ''}
          onChange={(e) => setProjectDetails({ date: e.target.value })}
        />
      </div>
    </Card>
  );
};
