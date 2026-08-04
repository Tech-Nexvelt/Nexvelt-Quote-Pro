import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { logger } from '../utils/logger';

export const RealtimeService = {
  subscribeToCompanyEvents(companyId: string, onUpdate: (payload: any) => void) {
    if (!isSupabaseConfigured() || !companyId) return () => {};

    logger.info('Subscribing to Supabase Realtime channel', { companyId });

    const channel = supabase
      .channel(`company_realtime_${companyId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          filter: `company_id=eq.${companyId}`,
        },
        (payload) => {
          logger.info('Realtime event received from database', { event: payload.eventType, table: payload.table });
          onUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};
