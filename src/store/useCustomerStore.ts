import { create } from 'zustand';
import { Customer } from '@/types/customer';
import { CustomerService } from '@/services/customer.service';

interface CustomerState {
  customers: Customer[];
  loading: boolean;
  fetchCustomers: (companyId: string, search?: string) => Promise<void>;
  addCustomer: (cust: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>, companyId?: string) => Customer;
  updateCustomer: (id: string, cust: Partial<Customer>, companyId?: string) => void;
  deleteCustomer: (id: string, companyId?: string) => void;
  searchCustomers: (query: string) => Customer[];
  resetCustomers: () => void;
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  loading: false,

  fetchCustomers: async (companyId: string, search?: string) => {
    set({ loading: true });
    try {
      const records = await CustomerService.getCustomers(companyId, search);
      const mapped: Customer[] = records.map((r) => ({
        id: r.id,
        name: r.name,
        phone: r.phone || '',
        email: r.email || '',
        address: r.address,
        city: r.city,
        gstNumber: r.gstin,
        projectLocation: r.address || r.city || '',
        notes: r.notes,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      }));
      set({ customers: mapped });
    } catch {
      // Keep current state
    } finally {
      set({ loading: false });
    }
  },

  addCustomer: (cust, companyId = '5f0f21c7-a8c2-4df6-8dd4-mockcompany01') => {
    const now = new Date().toISOString();
    const newCust: Customer = {
      ...cust,
      id: `cust_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };

    CustomerService.createCustomer(companyId, {
      name: cust.name,
      phone: cust.phone,
      email: cust.email,
      gstin: cust.gstNumber,
      address: cust.address || cust.projectLocation,
      city: cust.city,
      notes: cust.notes,
    }).catch(() => {});

    set((state) => ({ customers: [newCust, ...state.customers] }));
    return newCust;
  },

  updateCustomer: (id, cust, companyId = '5f0f21c7-a8c2-4df6-8dd4-mockcompany01') => {
    const now = new Date().toISOString();

    CustomerService.updateCustomer(companyId, id, 1, {
      name: cust.name,
      phone: cust.phone,
      email: cust.email,
      address: cust.address || cust.projectLocation,
      city: cust.city,
      notes: cust.notes,
    }).catch(() => {});

    set((state) => ({
      customers: state.customers.map((c) => (c.id === id ? { ...c, ...cust, updatedAt: now } : c)),
    }));
  },

  deleteCustomer: (id, companyId = '5f0f21c7-a8c2-4df6-8dd4-mockcompany01') => {
    CustomerService.softDeleteCustomer(companyId, id).catch(() => {});
    set((state) => ({ customers: state.customers.filter((c) => c.id !== id) }));
  },

  searchCustomers: (query) => {
    if (!query.trim()) return get().customers;
    const q = query.toLowerCase();
    return get().customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q)) ||
        (c.city && c.city.toLowerCase().includes(q)) ||
        (c.projectLocation && c.projectLocation.toLowerCase().includes(q))
    );
  },

  resetCustomers: () => {
    set({ customers: [] });
  },
}));
