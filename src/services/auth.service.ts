import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Company, Profile, StaffInvitation } from '../types/saas';
import { OnboardingService } from './onboarding.service';
import { logger } from '../utils/logger';

export interface SignUpCompanyPayload {
  email: string;
  password: string;
  companyName: string;
  ownerName: string;
  phone?: string;
  businessType?: string;
}

export const AuthService = {
  async signUpCompany(payload: SignUpCompanyPayload): Promise<{ user: any; company: Company; profile: Profile }> {
    logger.info('Starting company registration', { email: payload.email, companyName: payload.companyName });

    if (!isSupabaseConfigured()) {
      const mockResult = await OnboardingService.completeInitialSetup({
        userId: 'user-mock-owner-01',
        email: payload.email,
        companyName: payload.companyName,
        ownerName: payload.ownerName,
        phone: payload.phone,
        businessType: payload.businessType,
      });
      return {
        user: { id: 'user-mock-owner-01', email: payload.email },
        company: mockResult.company,
        profile: mockResult.profile,
      };
    }

    // 1. Call supabase.auth.signUp()
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          full_name: payload.ownerName,
          company_name: payload.companyName,
          business_type: payload.businessType,
          phone: payload.phone,
        },
      },
    });

    if (authError || !authData.user) {
      logger.error('Auth signup failed', { error: authError });
      throw authError || new Error('Auth signup failed');
    }

    // 2. Wait for & establish active authenticated session
    let session = authData.session;
    if (!session) {
      const { data: sessionData } = await supabase.auth.getSession();
      session = sessionData.session;
    }

    if (!session) {
      const { data: signInData } = await supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
      });
      session = signInData.session;
    }

    if (!session || !session.access_token) {
      logger.warn('User created, but session access_token is pending. Email verification may be required.');
      throw new Error('Account created successfully! Please check your email inbox to verify your account before completing setup.');
    }

    // Explicitly set session on client to ensure Authorization: Bearer <USER_ACCESS_TOKEN> is used
    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });

    // 3. Retrieve verified authenticated user
    const { data: { session: verifiedSession } } = await supabase.auth.getSession();
    if (!verifiedSession?.user || !verifiedSession.access_token) {
      throw new Error('Failed to retrieve authenticated user session.');
    }

    // 4. Delegate tenant record provisioning to OnboardingService
    const { company, profile } = await OnboardingService.completeInitialSetup({
      userId: verifiedSession.user.id,
      email: payload.email,
      companyName: payload.companyName,
      ownerName: payload.ownerName,
      phone: payload.phone,
      businessType: payload.businessType,
    });

    return { user: verifiedSession.user, company, profile };
  },

  async login(email: string, password: string): Promise<{ user: any; company: Company; profile: Profile }> {
    logger.info('Attempting login', { email });
    if (!isSupabaseConfigured()) {
      return this.signUpCompany({ email, password, companyName: 'Demo Company', ownerName: 'Demo User' });
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError || !authData.user) {
      throw authError || new Error('Invalid login credentials');
    }

    if (authData.session) {
      await supabase.auth.setSession({
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
      });
    }

    const { isComplete, company, profile } = await OnboardingService.checkOnboardingStatus(authData.user.id);

    if (!isComplete || !company || !profile) {
      // If user signed in but profile/company don't exist yet, complete setup dynamically
      const meta = authData.user.user_metadata || {};
      const setupResult = await OnboardingService.completeInitialSetup({
        userId: authData.user.id,
        email: authData.user.email || email,
        companyName: meta.company_name || 'My Furniture Company',
        ownerName: meta.full_name || 'Business Owner',
        phone: meta.phone,
        businessType: meta.business_type,
      });
      return { user: authData.user, company: setupResult.company, profile: setupResult.profile };
    }

    return { user: authData.user, company, profile };
  },

  async logout(): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
  },

  async inviteStaff(companyId: string, email: string, role: string): Promise<StaffInvitation> {
    logger.info('Inviting staff member', { companyId, email, role });
    if (!isSupabaseConfigured()) {
      return {
        id: `inv-${Date.now()}`,
        company_id: companyId,
        email,
        role: role as any,
        token: `tok-${Date.now()}`,
        status: 'pending',
        expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
        created_at: new Date().toISOString(),
      };
    }

    const { data, error } = await supabase
      .from('staff_invitations')
      .insert({ company_id: companyId, email, role })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async resetPassword(email: string): Promise<void> {
    if (!isSupabaseConfigured()) return;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    });
    if (error) throw error;
  },

  async updatePassword(newPassword: string): Promise<void> {
    if (!isSupabaseConfigured()) return;
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  },
};
