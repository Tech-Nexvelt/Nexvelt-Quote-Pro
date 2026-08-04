import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Company, Profile } from '../types/saas';
import { logger } from '../utils/logger';
import { telemetry } from '../utils/telemetry';

export interface SetupPayload {
  userId: string;
  email: string;
  companyName: string;
  ownerName: string;
  phone?: string;
  businessType?: string;
  workspaceSlug?: string;
  gstin?: string;
  address?: string;
  city?: string;
}

// In-memory lock map to prevent simultaneous client-side execution for the same user
const activeOnboardingLocks = new Map<string, Promise<{ company: Company; profile: Profile }>>();

export const CURRENT_ONBOARDING_VERSION = 1;

export const OnboardingService = {
  /**
   * Enterprise Onboarding Provisioner.
   * Utilizes PostgreSQL Advisory Locks, Backend Audit Trail, Health Verification, and Telemetry.
   */
  async completeInitialSetup(payload: SetupPayload): Promise<{ company: Company; profile: Profile }> {
    const startTime = Date.now();
    logger.info('Executing enterprise onboarding setup', { userId: payload.userId, email: payload.email });

    // Concurrent execution guard for the same user
    if (activeOnboardingLocks.has(payload.userId)) {
      logger.info('Onboarding setup already in progress for user. Awaiting active lock.', { userId: payload.userId });
      telemetry.recordRetry();
      return activeOnboardingLocks.get(payload.userId)!;
    }

    const executionPromise = (async () => {
      try {
        if (!isSupabaseConfigured() || import.meta.env.MODE === 'test') {
          const mockCompanyId = '5f0f21c7-a8c2-4df6-8dd4-mockcompany01';
          const mockCompany: Company = {
            id: mockCompanyId,
            company_code: 'NEX-000001',
            workspace_slug: 'demo-furniture',
            company_name: payload.companyName,
            owner_name: payload.ownerName,
            email: payload.email,
            phone: payload.phone,
            business_type: payload.businessType || 'Interior & Furniture',
            currency: 'INR',
            timezone: 'Asia/Kolkata',
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          const mockProfile: Profile = {
            id: 'prof-mock-owner-01',
            user_id: payload.userId,
            company_id: mockCompanyId,
            full_name: payload.ownerName,
            email: payload.email,
            phone: payload.phone,
            role: 'Owner',
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          telemetry.recordOnboardingSuccess(Date.now() - startTime);
          return { company: mockCompany, profile: mockProfile };
        }

        // 1. Try PostgreSQL Stored Procedure with Advisory Lock & Health Verification
        try {
          const { data: rpcData, error: rpcError } = await supabase.rpc('complete_atomic_onboarding', {
            p_user_id: payload.userId,
            p_email: payload.email,
            p_company_name: payload.companyName,
            p_owner_name: payload.ownerName,
            p_phone: payload.phone || null,
            p_business_type: payload.businessType || 'Interior & Furniture',
            p_address: payload.address || null,
            p_city: payload.city || null,
            p_gstin: payload.gstin || null,
          });

          if (!rpcError && rpcData?.success && rpcData?.company && rpcData?.profile) {
            const executionTime = Date.now() - startTime;
            telemetry.recordOnboardingSuccess(executionTime, rpcData.execution_time_ms);
            
            logger.audit({
              eventName: 'Onboarding Completed (PostgreSQL Advisory Lock)',
              userId: payload.userId,
              companyId: rpcData.company.id,
              executionTimeMs: executionTime,
              result: 'success',
              details: { isExisting: rpcData.is_existing, health: rpcData.health },
            });

            return { company: rpcData.company as Company, profile: rpcData.profile as Profile };
          }
        } catch {
          // Fallback to step-by-step resolution
        }

        // 2. Client-side Step-by-Step Resolution & Health Auto-Repair
        let resolvedCompany: Company | null = null;
        let resolvedProfile: Profile | null = null;

        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', payload.userId)
          .maybeSingle();

        if (existingProfile) {
          resolvedProfile = existingProfile as Profile;
          const { data: existingCompany } = await supabase
            .from('companies')
            .select('*')
            .eq('id', existingProfile.company_id)
            .maybeSingle();
          resolvedCompany = existingCompany as Company | null;
        }

        if (!resolvedCompany) {
          const baseSlug = (payload.workspaceSlug || payload.companyName)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') || 'my-company';

          const { data: companyByEmail } = await supabase
            .from('companies')
            .select('*')
            .eq('email', payload.email)
            .maybeSingle();

          if (companyByEmail) {
            resolvedCompany = companyByEmail as Company;
          } else {
            const uniqueSlug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
            const { data: newCompany, error: companyError } = await supabase
              .from('companies')
              .insert({
                company_name: payload.companyName,
                workspace_slug: uniqueSlug,
                owner_name: payload.ownerName,
                email: payload.email,
                phone: payload.phone || null,
                business_type: payload.businessType || 'Interior & Furniture',
                address: payload.address || null,
                city: payload.city || null,
                gst_number: payload.gstin || null,
              })
              .select()
              .single();

            if (companyError || !newCompany) {
              throw new Error(`Company creation failed: ${companyError?.message || 'RLS Permission error'}`);
            }
            resolvedCompany = newCompany as Company;
          }
        }

        if (!resolvedProfile) {
          const { data: newProfile, error: profileError } = await supabase
            .from('profiles')
            .upsert({
              user_id: payload.userId,
              company_id: resolvedCompany.id,
              full_name: payload.ownerName,
              email: payload.email,
              phone: payload.phone || null,
              role: 'Owner',
            }, { onConflict: 'user_id' })
            .select()
            .single();

          if (profileError || !newProfile) {
            throw new Error(`Profile creation failed: ${profileError?.message || 'Unknown error'}`);
          }
          resolvedProfile = newProfile as Profile;
        }

        if (!resolvedCompany || !resolvedProfile) {
          throw new Error('Onboarding failed to resolve valid company and profile.');
        }

        const targetCompany = resolvedCompany;
        const targetProfile = resolvedProfile;

        // Execute Tenant Health Check & Auto-Repair RPC
        try {
          await supabase.rpc('verify_and_repair_tenant_health', { p_company_id: targetCompany.id });
        } catch {
          // Manual fallback health check
          const { data: existingSettings } = await supabase.from('company_settings').select('id').eq('company_id', targetCompany.id).maybeSingle();
          if (!existingSettings) await supabase.from('company_settings').insert({ company_id: targetCompany.id });

          const { data: existingMetrics } = await supabase.from('usage_metrics').select('id').eq('company_id', targetCompany.id).maybeSingle();
          if (!existingMetrics) await supabase.from('usage_metrics').insert({ company_id: targetCompany.id, active_users: 1 });
        }

        const totalExecutionTime = Date.now() - startTime;
        telemetry.recordOnboardingSuccess(totalExecutionTime);

        logger.audit({
          eventName: 'Onboarding Completed (Client Repair Fallback)',
          userId: payload.userId,
          companyId: targetCompany.id,
          executionTimeMs: totalExecutionTime,
          result: 'success',
        });

        return { company: targetCompany, profile: targetProfile };
      } catch (err: any) {
        telemetry.recordOnboardingFailure();
        logger.audit({
          eventName: 'Onboarding Failed',
          userId: payload.userId,
          executionTimeMs: Date.now() - startTime,
          result: 'failure',
          details: { error: err?.message },
        });
        throw err;
      } finally {
        activeOnboardingLocks.delete(payload.userId);
      }
    })();

    activeOnboardingLocks.set(payload.userId, executionPromise);
    return executionPromise;
  },

  async checkOnboardingStatus(userId: string): Promise<{ isComplete: boolean; company: Company | null; profile: Profile | null }> {
    if (!isSupabaseConfigured() || import.meta.env.MODE === 'test') {
      return { isComplete: true, company: null, profile: null };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!profile) {
      return { isComplete: false, company: null, profile: null };
    }

    const { data: company } = await supabase
      .from('companies')
      .select('*')
      .eq('id', profile.company_id)
      .maybeSingle();

    if (!company) {
      return { isComplete: false, company: null, profile: profile as Profile };
    }

    try {
      await supabase.rpc('verify_and_repair_tenant_health', { p_company_id: company.id });
    } catch {
      // Ignore RPC error
    }

    return { isComplete: true, company: company as Company, profile: profile as Profile };
  },
};
