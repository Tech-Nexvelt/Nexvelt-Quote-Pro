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

const LOCAL_CUSTOMERS_KEY = 'nqp_saved_customers_v1';

function getLocalCustomers(): Customer[] {
  try {
    const raw = localStorage.getItem(LOCAL_CUSTOMERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalCustomers(customers: Customer[]) {
  try {
    localStorage.setItem(LOCAL_CUSTOMERS_KEY, JSON.stringify(customers));
  } catch {}
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: getLocalCustomers(),
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

      // Merge fetched remote records with local state to preserve any local offline records
      const mergedMap = new Map<string, Customer>();
      mapped.forEach((c) => mergedMap.set(c.id, c));
      get().customers.forEach((c) => {
        if (!mergedMap.has(c.id)) mergedMap.set(c.id, c);
      });
      const mergedList = Array.from(mergedMap.values());

      saveLocalCustomers(mergedList);
      set({ customers: mergedList });
    } catch {
      // Keep local state on error
    } finally {
      set({ loading: false });
    }
  },

  addCustomer: (cust, companyId) => {
    const now = new Date().toISOString();
    const newCust: Customer = {
      ...cust,
      id: `cust_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };

    set((state) => {
      const updated = [newCust, ...state.customers];
      saveLocalCustomers(updated);
      return { customers: updated };
    });

    const activeCompanyId = companyId || '5f0f21c7-a8c2-4df6-8dd4-mockcompany01';
    if (activeCompanyId) {
      CustomerService.createCustomer(activeCompanyId, {
        name: cust.name,
        phone: cust.phone,
        email: cust.email,
        gstin: cust.gstNumber,
        address: cust.address || cust.projectLocation,
        city: cust.city,
        notes: cust.notes,
      })
        .then((record) => {
          if (record?.id) {
            set((state) => {
              const updated = state.customers.map((c) => (c.id === newCust.id ? { ...c, id: record.id } : c));
              saveLocalCustomers(updated);
              return { customers: updated };
            });
          }
        })
        .catch((err) => {
          console.warn('[CustomerStore] DB save skipped or failed:', err?.message || err);
        });
    }

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

    set((state) => {
      const updated = state.customers.map((c) => (c.id === id ? { ...c, ...cust, updatedAt: now } : c));
      saveLocalCustomers(updated);
      return { customers: updated };
    });
  },

  deleteCustomer: (id, companyId = '5f0f21c7-a8c2-4df6-8dd4-mockcompany01') => {
    CustomerService.softDeleteCustomer(companyId, id).catch(() => {});
    set((state) => {
      const updated = state.customers.filter((c) => c.id !== id);
      saveLocalCustomers(updated);
      return { customers: updated };
    });
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
    saveLocalCustomers([]);
    set({ customers: [] });
  },
}));
