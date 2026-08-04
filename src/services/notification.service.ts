import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { NotificationItem } from '../types/saas';

export const NotificationService = {
  async getNotifications(companyId: string): Promise<NotificationItem[]> {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) return [];
    return data || [];
  },

  async markAsRead(companyId: string, notificationId: string): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('company_id', companyId);
    }
  },

  async markAllAsRead(companyId: string): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('company_id', companyId)
        .eq('is_read', false);
    }
  },
};
