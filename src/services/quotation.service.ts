import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { validateRecordVersion } from '../utils/concurrency';
import { logger } from '../utils/logger';
import type { Quotation } from '../types/quotation';

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

  /**
   * Upsert (insert or update) a full quotation from the Quotation store object.
   * Matches on quotation_number + company_id so re-saving the same quote updates it.
   * Falls back gracefully to core financial columns if payload JSONB column doesn't
   * exist yet in the DB schema.
   */
  async upsertQuotation(
    companyId: string,
    quotation: Quotation
  ): Promise<{ success: boolean; error?: string }> {
    logger.info('Upserting quotation to DB', {
      companyId,
      quotationNumber: quotation.quotationNumber,
    });

    if (!isSupabaseConfigured()) {
      return { success: true };
    }

    try {
      const statusMap: Record<string, QuotationRecord['status']> = {
        draft: 'Draft',
        sent: 'Sent',
        approved: 'Approved',
        rejected: 'Rejected',
        archived: 'Archived',
      };

      const coreFields = {
        company_id: companyId,
        quotation_number: quotation.quotationNumber,
        title:
          quotation.projectName ||
          quotation.customer?.name ||
          quotation.quotationNumber,
        status: statusMap[quotation.status] ?? 'Draft',
        subtotal: quotation.summary?.itemsSubtotal ?? 0,
        discount_amount: quotation.summary?.discountAmount ?? 0,
        tax_amount: quotation.summary?.taxAmount ?? 0,
        grand_total: quotation.summary?.grandTotal ?? 0,
        notes: quotation.notes ?? null,
        terms: quotation.termsAndConditions ?? null,
        updated_at: new Date().toISOString(),
      };

      // ── Step 1: Check if this quotation already exists ──────────────────
      const { data: existing, error: selectError } = await supabase
        .from('quotations')
        .select('id')
        .eq('company_id', companyId)
        .eq('quotation_number', quotation.quotationNumber)
        .maybeSingle();

      if (selectError) throw selectError;

      if (existing?.id) {
        // ── Step 2a: UPDATE the existing row ──────────────────────────────
        const { error: updateError } = await supabase
          .from('quotations')
          .update(coreFields)
          .eq('id', existing.id)
          .eq('company_id', companyId);

        if (updateError) throw updateError;
      } else {
        // ── Step 2b: INSERT a new row ─────────────────────────────────────
        const { error: insertError } = await supabase
          .from('quotations')
          .insert(coreFields);

        if (insertError) throw insertError;
      }

      return { success: true };
    } catch (err: any) {
      logger.error('Quotation DB upsert failed', { error: err?.message });
      return { success: false, error: err?.message || 'DB save failed' };
    }
  },

  async updateQuotationStatus(
    companyId: string,
    quotationId: string,
    status: QuotationRecord['status']
  ): Promise<void> {
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
