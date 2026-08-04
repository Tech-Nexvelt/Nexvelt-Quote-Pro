import { create } from 'zustand';
import { AuthService, SignUpCompanyPayload } from '@/services/auth.service';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Company, Profile } from '@/types/saas';

export interface UserProfile {
  email: string;
  ownerName: string;
  companyName: string;
  phone?: string;
  businessType?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  user: UserProfile | null;
  company: Company | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;

  initializeSession: () => Promise<void>;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (data: SignUpCompanyPayload) => Promise<boolean>;
  completeOnboarding: () => void;
  logout: () => Promise<void>;
}

const CACHED_PROFILE_KEY = 'nqp_cached_auth_profile_v1';
const CACHED_COMPANY_KEY = 'nqp_cached_auth_company_v1';

let activeSessionInitPromise: Promise<void> | null = null;

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  hasCompletedOnboarding: false,
  user: null,
  company: null,
  profile: null,
  loading: true,
  error: null,

  initializeSession: async () => {
    if (activeSessionInitPromise) return activeSessionInitPromise;

    activeSessionInitPromise = (async () => {
      // 1. Instant Cache Hydration (< 10ms response time)
      try {
        const cachedProfileRaw = localStorage.getItem(CACHED_PROFILE_KEY);
        const cachedCompanyRaw = localStorage.getItem(CACHED_COMPANY_KEY);
        if (cachedProfileRaw) {
          const cachedProfile = JSON.parse(cachedProfileRaw);
          const cachedCompany = cachedCompanyRaw ? JSON.parse(cachedCompanyRaw) : null;
          set({
            isAuthenticated: true,
            hasCompletedOnboarding: true,
            user: {
              email: cachedProfile.email,
              ownerName: cachedProfile.full_name,
              companyName: cachedCompany?.company_name || 'My Company',
              phone: cachedProfile.phone,
              businessType: cachedCompany?.business_type,
            },
            company: cachedCompany,
            profile: cachedProfile,
            loading: false,
            error: null,
          });
        }
      } catch (e) {}

      if (!isSupabaseConfigured()) {
        set({
          isAuthenticated: false,
          hasCompletedOnboarding: false,
          user: null,
          company: null,
          profile: null,
          loading: false,
          error: 'Backend authentication connection missing (VITE_SUPABASE_URL unconfigured)',
        });
        return;
      }

      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Auth fetch network timeout')), 2500)
        );

        const sessionRes = (await Promise.race([
          supabase.auth.getSession(),
          timeoutPromise,
        ])) as any;

        const session = sessionRes?.data?.session;

        if (session?.user) {
          // Fast Single Joined Query (cuts network round-trips by 50%+)
          let profile: any = null;
          let company: any = null;

          try {
            const joinedRes = (await Promise.race([
              supabase
                .from('profiles')
                .select('*, company:companies(*)')
                .eq('user_id', session.user.id)
                .maybeSingle(),
              timeoutPromise,
            ])) as any;

            if (joinedRes?.data) {
              profile = joinedRes.data;
              company = (joinedRes.data as any).company;
            }
          } catch (e) {}

          if (!profile) {
            // Fallback parallel execution
            const [profRes, compRes] = await Promise.all([
              supabase.from('profiles').select('*').eq('user_id', session.user.id).maybeSingle(),
              supabase.from('companies').select('*').limit(1).maybeSingle(),
            ]);
            profile = profRes.data;
            company = compRes.data;
          }

          if (profile) {
            // Cache results for instant future reloads (< 10ms)
            try {
              localStorage.setItem(CACHED_PROFILE_KEY, JSON.stringify(profile));
              if (company) localStorage.setItem(CACHED_COMPANY_KEY, JSON.stringify(company));
            } catch (e) {}

            set({
              isAuthenticated: true,
              hasCompletedOnboarding: true,
              user: {
                email: profile.email,
                ownerName: profile.full_name,
                companyName: company?.company_name || 'My Company',
                phone: profile.phone,
                businessType: company?.business_type,
              },
              company,
              profile,
              loading: false,
            });
            return;
          }
        }
      } catch (err: any) {
        // Catch ERR_CONNECTION_CLOSED or timeout without crashing UI
      } finally {
        activeSessionInitPromise = null;
      }

      const currentState = useAuthStore.getState();
      if (!currentState.profile) {
        set({ isAuthenticated: false, hasCompletedOnboarding: false, loading: false });
      } else {
        set({ loading: false });
      }
    })();

    return activeSessionInitPromise;
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await AuthService.login(email, password);
      set({
        isAuthenticated: true,
        hasCompletedOnboarding: true,
        user: {
          email: res.profile.email,
          ownerName: res.profile.full_name,
          companyName: res.company.company_name,
          phone: res.profile.phone,
          businessType: res.company.business_type,
        },
        company: res.company,
        profile: res.profile,
        loading: false,
      });
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Login failed', loading: false, isAuthenticated: false });
      return false;
    }
  },

  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await AuthService.signUpCompany(payload);
      set({
        isAuthenticated: true,
        hasCompletedOnboarding: false,
        user: {
          email: res.profile.email,
          ownerName: res.profile.full_name,
          companyName: res.company.company_name,
          phone: res.profile.phone,
          businessType: res.company.business_type,
        },
        company: res.company,
        profile: res.profile,
        loading: false,
      });
      return true;
    } catch (err: any) {
      const msg = err?.message || 'Company registration failed';
      set({ error: msg, loading: false, isAuthenticated: false });
      throw err;
    }
  },

  completeOnboarding: () => {
    set({ hasCompletedOnboarding: true });
  },

  logout: async () => {
    set({ loading: true });
    try {
      await AuthService.logout();
    } catch {
      // Ignore
    }
    set({
      isAuthenticated: false,
      hasCompletedOnboarding: false,
      user: null,
      company: null,
      profile: null,
      loading: false,
      error: null,
    });
  },
}));
