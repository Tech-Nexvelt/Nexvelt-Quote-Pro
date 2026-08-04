import React, { useState } from 'react';
import { useCustomerStore } from '@/store/useCustomerStore';
import { useQuotationStore } from '@/store/useQuotationStore';
import { useUIStore } from '@/store/useUIStore';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import {
  Users,
  UserPlus,
  Search,
  Phone,
  MapPin,
  Mail,
  FileSpreadsheet,
  Trash2,
  Building2,
} from 'lucide-react';

export const CustomerManagementModule: React.FC = () => {
  const navigate = useNavigate();
  const { customers, addCustomer, deleteCustomer, searchCustomers } = useCustomerStore();
  const { updateCustomerDetails, updateProjectDetails } = useQuotationStore();
  const { addToast } = useUIStore();

  const [query, setQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [projectLocation, setProjectLocation] = useState('');

  const filtered = searchCustomers(query);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    addCustomer({ name, phone, email, city, projectLocation });
    setIsAddModalOpen(false);
    setName('');
    setPhone('');
    setEmail('');
    setProjectLocation('');
    addToast({ type: 'success', title: 'Customer Added', message: `${name} saved to customer CRM.` });
  };

  const handleLaunchQuotation = (customer: any) => {
    updateCustomerDetails({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || '',
      projectLocation: customer.projectLocation || customer.city || '',
    });
    updateProjectDetails({
      customerName: customer.name,
      projectLocation: customer.projectLocation || customer.city || '',
    });
    addToast({
      type: 'info',
      title: 'Customer Loaded',
      message: `Created draft quotation for ${customer.name}.`,
    });
    navigate('/quotations');
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E2E8F0] pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#111827] flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[#00D9D9]" />
            Customer Management CRM
          </h1>
          <p className="text-xs text-[#6B7280] font-medium mt-1">
            Store client profiles, location details, and launch new quotations instantly.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="crm-search-input"
              name="crmSearch"
              aria-label="Search Customers"
              type="text"
              placeholder="Search customers..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 bg-white border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#111827] placeholder-[#6B7280] focus:outline-none focus:border-[#00D9D9]"
            />
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={<UserPlus className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Customer
          </Button>
        </div>
      </div>

      {/* Customer Directory Grid */}
      {filtered.length === 0 ? (
        <Card glass={false} className="bg-white border border-[#E2E8F0] p-10 rounded-2xl text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#E6F7F7] text-[#00B8B8] flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-extrabold text-[#111827]">No Customer Profiles Found</h3>
          <p className="text-xs text-[#6B7280] font-medium max-w-sm mx-auto">
            {query ? `No clients matching "${query}"` : 'Your customer directory is empty. Add your first customer profile to quickly generate quotations.'}
          </p>
          <div className="pt-2">
            <Button variant="primary" size="sm" icon={<UserPlus className="w-4 h-4" />} onClick={() => setIsAddModalOpen(true)}>
              Add First Customer
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-2xs hover:border-[#00D9D9] transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Avatar & Name Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E6F7F7] text-[#008080] font-black text-base flex items-center justify-center border border-[#00D9D9]/20">
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-[#111827]">{c.name}</h3>
                      <div className="text-xs font-semibold text-[#00B8B8] flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-[#00D9D9]" />
                        {c.phone}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      deleteCustomer(c.id);
                      addToast({ type: 'info', title: 'Customer Removed', message: `Removed ${c.name} from CRM.` });
                    }}
                    className="text-[#9CA3AF] hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete customer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Details Pill Box */}
                <div className="text-xs text-[#374151] space-y-1.5 bg-[#F8FAFC] border border-[#F1F5F9] p-3 rounded-xl font-medium">
                  {c.email ? (
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-[#6B7280] shrink-0" />
                      <span className="truncate">{c.email}</span>
                    </div>
                  ) : (
                    <div className="text-[11px] text-[#9CA3AF] italic">No email added</div>
                  )}
                  {(c.projectLocation || c.city) && (
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#6B7280] shrink-0" />
                      <span className="truncate">
                        {c.projectLocation ? `${c.projectLocation}, ` : ''}{c.city}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-[#F1F5F9]">
                <button
                  onClick={() => handleLaunchQuotation(c)}
                  className="w-full h-9 bg-[#E6F7F7] hover:bg-[#00D9D9] text-[#008080] hover:text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer border border-[#00D9D9]/30"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  Create Quotation
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Customer Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Customer Profile">
        <form onSubmit={handleCreate} className="space-y-4 pt-2">
          <div>
            <label htmlFor="modal-customer-name" className="block text-xs font-bold text-[#111827] mb-1">
              Customer Full Name *
            </label>
            <input
              id="modal-customer-name"
              name="customerName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Kishore"
              className="w-full h-10 bg-white border border-[#E2E8F0] rounded-xl px-3 text-xs text-[#111827] font-medium focus:outline-none focus:border-[#00D9D9]"
              required
            />
          </div>

          <div>
            <label htmlFor="modal-customer-phone" className="block text-xs font-bold text-[#111827] mb-1">
              Phone Number *
            </label>
            <input
              id="modal-customer-phone"
              name="customerPhone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +91 98765 43210"
              className="w-full h-10 bg-white border border-[#E2E8F0] rounded-xl px-3 text-xs text-[#111827] font-medium focus:outline-none focus:border-[#00D9D9]"
              required
            />
          </div>

          <div>
            <label htmlFor="modal-customer-email" className="block text-xs font-bold text-[#111827] mb-1">
              Email Address
            </label>
            <input
              id="modal-customer-email"
              name="customerEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@example.com"
              className="w-full h-10 bg-white border border-[#E2E8F0] rounded-xl px-3 text-xs text-[#111827] font-medium focus:outline-none focus:border-[#00D9D9]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="modal-customer-city" className="block text-xs font-bold text-[#111827] mb-1">
                City
              </label>
              <input
                id="modal-customer-city"
                name="customerCity"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-10 bg-white border border-[#E2E8F0] rounded-xl px-3 text-xs text-[#111827] font-medium focus:outline-none focus:border-[#00D9D9]"
              />
            </div>
            <div>
              <label htmlFor="modal-customer-site" className="block text-xs font-bold text-[#111827] mb-1">
                Site Location
              </label>
              <input
                id="modal-customer-site"
                name="customerSite"
                type="text"
                value={projectLocation}
                onChange={(e) => setProjectLocation(e.target.value)}
                placeholder="e.g. Jubliee Hills"
                className="w-full h-10 bg-white border border-[#E2E8F0] rounded-xl px-3 text-xs text-[#111827] font-medium focus:outline-none focus:border-[#00D9D9]"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-[#F1F5F9]">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Customer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
