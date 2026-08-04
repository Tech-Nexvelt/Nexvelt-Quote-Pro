import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Company, CompanySettings, UsageMetrics } from '../types/saas';
import { logger } from '../utils/logger';

export const CompanyService = {
  async getCompanyById(companyId: string): Promise<Company | null> {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase.from('companies').select('*').eq('id', companyId).single();
    if (error) return null;
    return data;
  },

  async getCompanySettings(companyId: string): Promise<CompanySettings | null> {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase.from('company_settings').select('*').eq('company_id', companyId).single();
    if (error) return null;
    return data;
  },

  async updateCompanySettings(companyId: string, updates: Partial<CompanySettings>): Promise<CompanySettings> {
    logger.info('Updating company settings', { companyId, updates });
    if (!isSupabaseConfigured()) {
      return updates as CompanySettings;
    }
    const { data, error } = await supabase
      .from('company_settings')
      .update(updates)
      .eq('company_id', companyId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUsageMetrics(companyId: string): Promise<UsageMetrics> {
    if (!isSupabaseConfigured()) {
      return { active_users: 3, customers_count: 42, projects_count: 18, products_count: 12, quotations_count: 35, storage_used_mb: 14.5 };
    }
    const { data, error } = await supabase.from('usage_metrics').select('*').eq('company_id', companyId).single();
    if (error || !data) {
      return { active_users: 1, customers_count: 0, projects_count: 0, products_count: 0, quotations_count: 0, storage_used_mb: 0 };
    }
    return data;
  },
};
