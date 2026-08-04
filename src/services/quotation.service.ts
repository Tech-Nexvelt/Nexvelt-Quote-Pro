import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { validateRecordVersion } from '../utils/concurrency';
import { logger } from '../utils/logger';

export interface QuotationRecord {
  id: string;
  company_id: string;
  quotation_number: string;
  customer_id?: string;
  project_id?: string;
  title: string;
  status: 'Draft' | 'Sent' | 'Approved' | 'Rejected' | 'Expired' | 'Archived';
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  grand_total: number;
  terms?: string;
  notes?: string;
  version: number;
  created_at: string;
  updated_at: string;
}

export const QuotationService = {
  async getQuotations(companyId: string): Promise<QuotationRecord[]> {
    logger.info('Fetching quotations', { companyId });
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('quotations')
      .select('*')
      .eq('company_id', companyId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createQuotation(companyId: string, payload: Partial<QuotationRecord>): Promise<QuotationRecord> {
    logger.info('Creating quotation', { companyId, title: payload.title });
    const quoteNumber = payload.quotation_number || `QT-${Date.now().toString().slice(-6)}`;

    if (!isSupabaseConfigured()) {
      return {
        id: `q-${Date.now()}`,
        company_id: companyId,
        quotation_number: quoteNumber,
        title: payload.title || 'New Interior Quotation',
        status: 'Draft',
        subtotal: payload.subtotal || 0,
        discount_amount: payload.discount_amount || 0,
        tax_amount: payload.tax_amount || 0,
        grand_total: payload.grand_total || 0,
        version: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...payload,
      } as QuotationRecord;
    }

    const { data, error } = await supabase
      .from('quotations')
      .insert({ ...payload, company_id: companyId, quotation_number: quoteNumber })
      .select()
      .single();

    if (error) throw error;

    // Outbox Event Triggering
    await supabase.from('outbox_events').insert({
      company_id: companyId,
      event_type: 'quotation.created',
      aggregate_type: 'quotation',
      aggregate_id: data.id,
      idempotency_key: `q_created_${data.id}_${Date.now()}`,
      payload: { quotation_id: data.id, quotation_number: data.quotation_number, grand_total: data.grand_total },
    });

    return data;
  },

  async updateQuotationStatus(companyId: string, quotationId: string, status: QuotationRecord['status']): Promise<void> {
    logger.info('Updating quotation status', { companyId, quotationId, status });
    if (isSupabaseConfigured()) {
      await supabase
        .from('quotations')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', quotationId)
        .eq('company_id', companyId);

      await supabase.from('outbox_events').insert({
        company_id: companyId,
        event_type: `quotation.${status.toLowerCase()}`,
        aggregate_type: 'quotation',
        aggregate_id: quotationId,
        idempotency_key: `q_status_${quotationId}_${status}_${Date.now()}`,
        payload: { quotation_id: quotationId, new_status: status },
      });
    }
  },
};
