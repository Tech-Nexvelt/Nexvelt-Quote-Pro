import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { validateRecordVersion } from '../utils/concurrency';
import { logger } from '../utils/logger';

export interface CustomerRecord {
  id: string;
  company_id: string;
  name: string;
  email?: string;
  phone?: string;
  company_name?: string;
  gstin?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  notes?: string;
  status: string;
  version: number;
  created_at: string;
  updated_at: string;
}

export const CustomerService = {
  async getCustomers(companyId: string, search?: string): Promise<CustomerRecord[]> {
    logger.info('Fetching customers for company', { companyId, search });
    if (!isSupabaseConfigured()) {
      return [];
    }

    let query = supabase.from('customers').select('*').eq('company_id', companyId).is('deleted_at', null);

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createCustomer(companyId: string, payload: Partial<CustomerRecord>): Promise<CustomerRecord> {
    logger.info('Creating customer', { companyId, name: payload.name });
    if (!isSupabaseConfigured()) {
      return {
        id: `cust-${Date.now()}`,
        company_id: companyId,
        name: payload.name || 'Untitled Customer',
        email: payload.email,
        phone: payload.phone,
        status: 'active',
        version: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...payload,
      } as CustomerRecord;
    }

    const { data, error } = await supabase
      .from('customers')
      .insert({ ...payload, company_id: companyId })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCustomer(companyId: string, customerId: string, clientVersion: number, updates: Partial<CustomerRecord>): Promise<CustomerRecord> {
    if (isSupabaseConfigured()) {
      const { data: existing } = await supabase.from('customers').select('*').eq('id', customerId).single();
      validateRecordVersion(existing, clientVersion);

      const { data, error } = await supabase
        .from('customers')
        .update({ ...updates, version: clientVersion + 1, updated_at: new Date().toISOString() })
        .eq('id', customerId)
        .eq('company_id', companyId)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
    return updates as CustomerRecord;
  },

  async softDeleteCustomer(companyId: string, customerId: string): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabase
        .from('customers')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', customerId)
        .eq('company_id', companyId);
    }
  },
};
