import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ActivityItem } from '../types/saas';

export const ActivityService = {
  async getActivities(companyId: string): Promise<ActivityItem[]> {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) return [];
    return data || [];
  },

  async logActivity(companyId: string, payload: Partial<ActivityItem>): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabase.from('activities').insert({
        company_id: companyId,
        title: payload.title || 'System Action',
        description: payload.description,
        module: payload.module || 'System',
        action: payload.action || 'Performed',
        metadata: payload.metadata || {},
      });
    }
  },
};
