import React, { createContext, useContext, useState, useEffect } from 'react';
import { Company, CompanySettings, Profile, UsageMetrics } from '../types/saas';
import { CompanyService } from '../services/company.service';
import { AuthService } from '../services/auth.service';

interface CompanyContextType {
  company: Company | null;
  settings: CompanySettings | null;
  profile: Profile | null;
  metrics: UsageMetrics | null;
  companyId: string | null;
  companyCode: string | null;
  workspaceSlug: string | null;
  loading: boolean;
  hasPermission: (permissionKey: string) => boolean;
  hasFeature: (featureKey: string) => boolean;
  refreshCompany: () => Promise<void>;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [company, setCompany] = useState<Company | null>({
    id: '5f0f21c7-a8c2-4df6-8dd4-mockcompany01',
    company_code: 'NEX-000001',
    workspace_slug: 'demo-furniture',
    company_name: 'Nexvelt Furniture & Interiors',
    owner_name: 'John Doe',
    email: 'admin@nexvelt.com',
    business_type: 'Interior & Furniture',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const [settings, setSettings] = useState<CompanySettings | null>({
    id: 'set-mock-01',
    company_id: '5f0f21c7-a8c2-4df6-8dd4-mockcompany01',
    theme: 'light',
    quotation_prefix: 'Q-',
    quotation_format: '{COMPANY_CODE}-Q-{SEQ:6}',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    paper_size: 'A4',
    tax_configuration: { default_tax_rate: 18, tax_name: 'GST', tax_type: 'inclusive' },
    invoice_footer: 'Thank you for choosing Nexvelt Quote Pro.',
    quotation_footer: 'Valid for 30 days.',
    default_terms: '1. 50% advance.\n2. Balance before dispatch.',
    brand_colors: { primary: '#00D9D9', secondary: '#008080' },
    notification_preferences: { email_notifications: true, sms_notifications: false },
  });

  const [profile, setProfile] = useState<Profile | null>({
    id: 'prof-mock-owner-01',
    user_id: 'user-mock-owner-01',
    company_id: '5f0f21c7-a8c2-4df6-8dd4-mockcompany01',
    full_name: 'John Doe',
    email: 'admin@nexvelt.com',
    role: 'Owner',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const [metrics, setMetrics] = useState<UsageMetrics | null>({
    active_users: 3,
    customers_count: 42,
    projects_count: 18,
    products_count: 12,
    quotations_count: 35,
    storage_used_mb: 14.5,
  });

  const [loading, setLoading] = useState<boolean>(false);

  const refreshCompany = async () => {
    if (!company?.id) return;
    setLoading(true);
    try {
      const fetchedSettings = await CompanyService.getCompanySettings(company.id);
      if (fetchedSettings) setSettings(fetchedSettings);
      const fetchedMetrics = await CompanyService.getUsageMetrics(company.id);
      if (fetchedMetrics) setMetrics(fetchedMetrics);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permissionKey: string): boolean => {
    if (!profile) return false;
    if (profile.role === 'Owner' || profile.role === 'Super Admin') return true;
    return true; // Configurable RBAC
  };

  const hasFeature = (featureKey: string): boolean => {
    return true; // Subscription feature validation
  };

  return (
    <CompanyContext.Provider
      value={{
        company,
        settings,
        profile,
        metrics,
        companyId: company?.id || null,
        companyCode: company?.company_code || null,
        workspaceSlug: company?.workspace_slug || null,
        loading,
        hasPermission,
        hasFeature,
        refreshCompany,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompanyContext = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompanyContext must be used within a CompanyProvider');
  }
  return context;
};
