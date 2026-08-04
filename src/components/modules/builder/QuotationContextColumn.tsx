import React, { useState } from 'react';
import { useQuotationStore } from '@/store/useQuotationStore';
import { useCustomerStore } from '@/store/useCustomerStore';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { User, MapPin, Calendar, Hash, FileText, Search } from 'lucide-react';

export const QuotationContextColumn: React.FC = () => {
  const { currentQuotation, setCustomer, setProjectDetails } = useQuotationStore();
  const { searchCustomers } = useCustomerStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const matches = searchCustomers(searchQuery);

  const handleSelectCustomer = (c: any) => {
    setCustomer({
      name: c.name,
      phone: c.phone,
      email: c.email,
      city: c.city,
      projectLocation: c.projectLocation,
    });
    setSearchQuery('');
    setShowSearch(false);
  };

  return (
    <div className="space-y-4">
      {/* Client Information Card */}
      <Card glass className="space-y-3 p-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#00D9D9]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Customer Information
            </h4>
          </div>

          <button
            type="button"
            onClick={() => setShowSearch(!showSearch)}
            className="text-[11px] font-semibold text-[#00B8B8] dark:text-[#35F5FF] hover:underline"
          >
            {showSearch ? 'Close Search' : 'Search CRM'}
          </button>
        </div>

        {showSearch && (
          <div className="relative">
            <Input
              placeholder="Search client by name/phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              prefixSymbol="🔍"
            />
            {searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-h-40 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {matches.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectCustomer(c)}
                    className="w-full text-left p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="font-bold text-slate-900 dark:text-slate-100">{c.name}</div>
                    <div className="text-[10px] text-slate-500">{c.phone} • {c.city || 'Hyderabad'}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

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
          label="Email Address"
          type="email"
          value={currentQuotation.customer.email || ''}
          onChange={(e) => setCustomer({ email: e.target.value })}
          placeholder="client@gmail.com"
        />

        <Input
          label="Project Site Location"
          value={currentQuotation.customer.projectLocation || ''}
          onChange={(e) => setCustomer({ projectLocation: e.target.value })}
          placeholder="Apt flat #, building name, locality"
        />
      </Card>

      {/* Project & Quotation Specs Card */}
      <Card glass className="space-y-3 p-5">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <FileText className="w-4 h-4 text-[#00D9D9]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Quotation Details
          </h4>
        </div>

        <Input
          label="Project Title"
          value={currentQuotation.projectName || ''}
          onChange={(e) => setProjectDetails({ projectName: e.target.value })}
          placeholder="e.g. 3BHK Interior Work"
        />

        <Input
          label="Quotation Number"
          value={currentQuotation.quotationNumber || ''}
          onChange={(e) => setProjectDetails({ quotationNumber: e.target.value })}
          placeholder="EST-2026-1086"
        />

        <Input
          label="Quotation Date"
          type="date"
          value={currentQuotation.date || ''}
          onChange={(e) => setProjectDetails({ date: e.target.value })}
        />
      </Card>
    </div>
  );
};
