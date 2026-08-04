import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface SystemHealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  database: boolean;
  auth: boolean;
  storage: boolean;
  realtime: boolean;
  version: string;
}

export const HealthService = {
  async checkSystemHealth(): Promise<SystemHealthStatus> {
    const timestamp = new Date().toISOString();
    let dbStatus = false;

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('companies').select('count', { count: 'exact', head: true });
        dbStatus = !error;
      } catch {
        dbStatus = false;
      }
    } else {
      dbStatus = true; // Local mode healthy
    }

    return {
      status: dbStatus ? 'healthy' : 'degraded',
      timestamp,
      database: dbStatus,
      auth: true,
      storage: true,
      realtime: true,
      version: '1.0.0-enterprise',
    };
  },
};
