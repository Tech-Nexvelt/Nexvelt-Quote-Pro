export type UserRole = 'Super Admin' | 'Owner' | 'Manager' | 'Sales' | 'Staff' | 'Viewer';

export interface Company {
  id: string; // Internal UUID
  company_code: string; // NEX-000001
  workspace_slug: string; // abc-furniture
  company_name: string;
  business_name?: string;
  owner_name: string;
  email: string;
  phone?: string;
  business_type: string;
  gst_number?: string;
  logo_url?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  currency: string;
  timezone: string;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface CompanySettings {
  id: string;
  company_id: string;
  theme: string;
  logo?: string;
  quotation_prefix: string;
  quotation_format: string;
  currency: string;
  timezone: string;
  paper_size: string;
  tax_configuration: {
    default_tax_rate: number;
    tax_name: string;
    tax_type: 'inclusive' | 'exclusive';
  };
  invoice_footer: string;
  quotation_footer: string;
  signature_url?: string;
  default_terms: string;
  privacy_url?: string;
  support_email?: string;
  brand_colors: {
    primary: string;
    secondary: string;
  };
  notification_preferences: {
    email_notifications: boolean;
    sms_notifications: boolean;
  };
}

export interface Profile {
  id: string;
  user_id: string;
  company_id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: string;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface StaffInvitation {
  id: string;
  company_id: string;
  email: string;
  role: UserRole;
  invited_by?: string;
  token: string;
  status: 'pending' | 'accepted' | 'cancelled' | 'expired';
  expires_at: string;
  created_at: string;
}

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description?: string;
  is_enabled_default: boolean;
}

export interface CompanyFeature {
  company_id: string;
  feature_id: string;
  is_enabled: boolean;
}

export interface Permission {
  id: string;
  key: string;
  module: string;
  description?: string;
}

export interface OutboxEvent {
  event_id: string;
  company_id: string;
  event_type: string;
  event_version: number;
  aggregate_type: string;
  aggregate_id: string;
  payload: Record<string, any>;
  metadata: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  retry_count: number;
  error_message?: string;
  idempotency_key: string;
  correlation_id?: string;
  locked_by?: string;
  locked_at?: string;
  created_at: string;
  processed_at?: string;
}

export interface NotificationItem {
  id: string;
  company_id: string;
  user_id?: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  priority: 'low' | 'medium' | 'high';
  action_url?: string;
  icon?: string;
  is_read: boolean;
  created_at: string;
}

export interface ActivityItem {
  id: string;
  company_id: string;
  user_id?: string;
  title: string;
  description?: string;
  module: string;
  action: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface AuditLog {
  id: string;
  company_id?: string;
  user_id?: string;
  action: string;
  module: string;
  correlation_id?: string;
  browser?: string;
  device?: string;
  ip_address?: string;
  created_at: string;
}

export interface UsageMetrics {
  active_users: number;
  customers_count: number;
  projects_count: number;
  products_count: number;
  quotations_count: number;
  storage_used_mb: number;
}
