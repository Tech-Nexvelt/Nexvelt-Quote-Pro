-- ============================================================================
-- NEXVELT QUOTE PRO - ENTERPRISE MULTI-TENANT SAAS BACKEND MIGRATION
-- Database: Supabase PostgreSQL
-- Features: Multi-Tenancy (company_id UUID), RLS, Sequential Generators,
--           Distributed Outbox Pattern (FOR UPDATE SKIP LOCKED), Dead Letter Queue,
--           RBAC Permissions, Feature Flags, Billing Foundation, AI Foundation,
--           Generic Document Engine, Inventory Foundation, Trigram FTS.
-- ============================================================================

-- 1. EXTENSIONS & SCHEMAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. SEQUENCES FOR COMPANY CODE & QUOTATION NUMBERING
CREATE SEQUENCE IF NOT EXISTS company_code_seq START WITH 1 INCREMENT BY 1;

-- 3. CORE COMPANIES TABLE
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_code VARCHAR(20) UNIQUE NOT NULL DEFAULT ('NEX-' || LPAD(nextval('company_code_seq')::text, 6, '0')),
    workspace_slug VARCHAR(100) UNIQUE NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    business_name VARCHAR(255),
    owner_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    business_type VARCHAR(100) DEFAULT 'Interior & Furniture',
    gst_number VARCHAR(50),
    logo_url TEXT,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    postal_code VARCHAR(20),
    currency VARCHAR(10) DEFAULT 'INR',
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    subscription_plan VARCHAR(50) DEFAULT 'Trial',
    subscription_status VARCHAR(50) DEFAULT 'active',
    trial_end_date TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- 4. COMPANY SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.company_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID UNIQUE NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    theme VARCHAR(50) DEFAULT 'light',
    logo TEXT,
    quotation_prefix VARCHAR(20) DEFAULT 'Q-',
    quotation_format VARCHAR(100) DEFAULT '{COMPANY_CODE}-Q-{SEQ:6}',
    currency VARCHAR(10) DEFAULT 'INR',
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    paper_size VARCHAR(10) DEFAULT 'A4',
    tax_configuration JSONB DEFAULT '{"default_tax_rate": 18, "tax_name": "GST", "tax_type": "inclusive"}'::jsonb,
    invoice_footer TEXT DEFAULT 'Thank you for your business!',
    quotation_footer TEXT DEFAULT 'Valid for 30 days from date of issue.',
    signature_url TEXT,
    default_terms TEXT DEFAULT '1. 50% advance payment required.\n2. Balance before dispatch.',
    privacy_url TEXT,
    support_email VARCHAR(255),
    brand_colors JSONB DEFAULT '{"primary": "#00D9D9", "secondary": "#008080"}'::jsonb,
    notification_preferences JSONB DEFAULT '{"email_notifications": true, "sms_notifications": false}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'Owner', -- Super Admin, Owner, Manager, Sales, Staff, Viewer
    status VARCHAR(50) DEFAULT 'active',
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. STAFF INVITATIONS TABLE
CREATE TABLE IF NOT EXISTS public.staff_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Staff',
    invited_by UUID REFERENCES public.profiles(id),
    token VARCHAR(100) UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
    status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, cancelled, expired
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ROLES & PERMISSIONS SCHEMAS
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_custom BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    module VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS public.user_permissions (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, permission_id)
);

-- 8. FEATURE FLAGS & COMPANY FEATURES
CREATE TABLE IF NOT EXISTS public.feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_enabled_default BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS public.company_features (
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    feature_id UUID REFERENCES public.feature_flags(id) ON DELETE CASCADE,
    is_enabled BOOLEAN DEFAULT true,
    PRIMARY KEY (company_id, feature_id)
);

-- 9. BUSINESS CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    company_name VARCHAR(255),
    gstin VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'active',
    version INTEGER NOT NULL DEFAULT 1,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- 10. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'In Progress', -- In Progress, Completed, On Hold, Cancelled
    budget DECIMAL(12, 2) DEFAULT 0 CHECK (budget >= 0),
    version INTEGER NOT NULL DEFAULT 1,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- 11. PRODUCTS CATALOG & CATEGORIES & MATERIALS
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    unit VARCHAR(50) DEFAULT 'sqft',
    rate DECIMAL(12, 2) DEFAULT 0 CHECK (rate >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    sku VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    base_rate_sqft DECIMAL(12, 2) DEFAULT 0 CHECK (base_rate_sqft >= 0),
    carcass_material VARCHAR(255),
    shutter_finish VARCHAR(255),
    preview_image TEXT,
    description TEXT,
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- 12. QUOTATIONS TABLE
CREATE TABLE IF NOT EXISTS public.quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    quotation_number VARCHAR(100) NOT NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Sent', 'Approved', 'Rejected', 'Expired', 'Archived')),
    subtotal DECIMAL(12, 2) DEFAULT 0 CHECK (subtotal >= 0),
    discount_amount DECIMAL(12, 2) DEFAULT 0 CHECK (discount_amount >= 0),
    tax_amount DECIMAL(12, 2) DEFAULT 0 CHECK (tax_amount >= 0),
    grand_total DECIMAL(12, 2) DEFAULT 0 CHECK (grand_total >= 0),
    terms TEXT,
    notes TEXT,
    version INTEGER NOT NULL DEFAULT 1,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- 13. QUOTATION ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.quotation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    quotation_id UUID NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    width_mm DECIMAL(10, 2) DEFAULT 0,
    height_mm DECIMAL(10, 2) DEFAULT 0,
    depth_mm DECIMAL(10, 2) DEFAULT 0,
    area_sqft DECIMAL(10, 2) DEFAULT 0 CHECK (area_sqft >= 0),
    rate_per_sqft DECIMAL(12, 2) DEFAULT 0 CHECK (rate_per_sqft >= 0),
    quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
    amount DECIMAL(12, 2) DEFAULT 0 CHECK (amount >= 0),
    specifications JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. GENERIC DOCUMENT ENGINE TABLE
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- Quotation, Invoice, Purchase Order, Estimate, Receipt
    document_number VARCHAR(100) NOT NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    total_amount DECIMAL(12, 2) DEFAULT 0 CHECK (total_amount >= 0),
    status VARCHAR(50) DEFAULT 'Draft',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. TRANSACTIONAL OUTBOX & DEAD LETTER QUEUE
CREATE TABLE IF NOT EXISTS public.outbox_events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL, -- quotation.created, customer.created, staff.invited
    event_version INTEGER DEFAULT 1,
    aggregate_type VARCHAR(100) NOT NULL, -- quotation, customer, staff_invitation
    aggregate_id UUID NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
    retry_count INTEGER DEFAULT 0,
    error_message TEXT,
    idempotency_key VARCHAR(255) UNIQUE NOT NULL,
    correlation_id VARCHAR(255),
    locked_by VARCHAR(255),
    locked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.dead_letter_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_event_id UUID NOT NULL,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    metadata JSONB,
    failure_reason TEXT,
    retry_count INTEGER DEFAULT 0,
    failed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.worker_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id VARCHAR(255) NOT NULL,
    processed_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    queue_latency_ms INTEGER DEFAULT 0,
    heartbeat_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. NOTIFICATIONS & ACTIVITIES & AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info', -- info, success, warning, error
    priority VARCHAR(50) DEFAULT 'medium',
    action_url TEXT,
    icon VARCHAR(50),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    module VARCHAR(100) NOT NULL, -- Quotations, Customers, Projects, Team, Settings
    action VARCHAR(100) NOT NULL, -- Created, Updated, Deleted, Approved, Invited
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    module VARCHAR(100) NOT NULL,
    correlation_id VARCHAR(255),
    browser VARCHAR(100),
    device VARCHAR(100),
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. BILLING & USAGE TRACKING FOUNDATION
CREATE TABLE IF NOT EXISTS public.plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL, -- trial, starter, pro, enterprise
    price_monthly DECIMAL(10, 2) DEFAULT 0,
    price_yearly DECIMAL(10, 2) DEFAULT 0,
    max_users INTEGER DEFAULT 1,
    max_customers INTEGER DEFAULT 100,
    max_quotations INTEGER DEFAULT 50,
    max_storage_mb INTEGER DEFAULT 500,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID UNIQUE NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES public.plans(id),
    status VARCHAR(50) DEFAULT 'active', -- active, trial, past_due, cancelled, expired
    current_period_start TIMESTAMPTZ DEFAULT NOW(),
    current_period_end TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.usage_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID UNIQUE NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    active_users INTEGER DEFAULT 1,
    customers_count INTEGER DEFAULT 0,
    projects_count INTEGER DEFAULT 0,
    products_count INTEGER DEFAULT 0,
    quotations_count INTEGER DEFAULT 0,
    storage_used_mb DECIMAL(10, 2) DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. AI FOUNDATION TABLES
CREATE TABLE IF NOT EXISTS public.ai_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID UNIQUE NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    provider VARCHAR(50) DEFAULT 'google_gemini', -- google_gemini, openai, anthropic
    api_key_encrypted TEXT,
    model_name VARCHAR(100) DEFAULT 'gemini-1.5-pro',
    is_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    prompt_tokens INTEGER DEFAULT 0,
    completion_tokens INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. INVENTORY FOUNDATION TABLES
CREATE TABLE IF NOT EXISTS public.vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.warehouses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    quantity_on_hand DECIMAL(10, 2) DEFAULT 0,
    reorder_level DECIMAL(10, 2) DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outbox_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dead_letter_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_metrics ENABLE ROW LEVEL SECURITY;

-- HELPER RLS FUNCTION: Gets authenticated user's company_id
CREATE OR REPLACE FUNCTION public.auth_company_id()
RETURNS UUID AS $$
  SELECT company_id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- RLS POLICIES FOR TENANT DATA ISOLATION
CREATE POLICY tenant_isolation_companies ON public.companies
    FOR ALL USING (id = public.auth_company_id());

CREATE POLICY tenant_isolation_settings ON public.company_settings
    FOR ALL USING (company_id = public.auth_company_id());

CREATE POLICY tenant_isolation_profiles ON public.profiles
    FOR ALL USING (company_id = public.auth_company_id());

CREATE POLICY tenant_isolation_customers ON public.customers
    FOR ALL USING (company_id = public.auth_company_id());

CREATE POLICY tenant_isolation_projects ON public.projects
    FOR ALL USING (company_id = public.auth_company_id());

CREATE POLICY tenant_isolation_products ON public.products
    FOR ALL USING (company_id = public.auth_company_id());

CREATE POLICY tenant_isolation_quotations ON public.quotations
    FOR ALL USING (company_id = public.auth_company_id());

CREATE POLICY tenant_isolation_quotation_items ON public.quotation_items
    FOR ALL USING (company_id = public.auth_company_id());

CREATE POLICY tenant_isolation_notifications ON public.notifications
    FOR ALL USING (company_id = public.auth_company_id());

CREATE POLICY tenant_isolation_activities ON public.activities
    FOR ALL USING (company_id = public.auth_company_id());

CREATE POLICY tenant_isolation_outbox ON public.outbox_events
    FOR ALL USING (company_id = public.auth_company_id());

-- 21. STORED PROCEDURE: ROW-LEVEL OUTBOX LOCK CLAIMING
CREATE OR REPLACE FUNCTION public.claim_outbox_events(p_worker_id TEXT, p_batch_size INT)
RETURNS SETOF public.outbox_events AS $$
BEGIN
  RETURN QUERY
  UPDATE public.outbox_events
  SET status = 'processing', locked_by = p_worker_id, locked_at = NOW()
  WHERE event_id IN (
    SELECT event_id FROM public.outbox_events
    WHERE status = 'pending' OR (status = 'processing' AND locked_at < NOW() - INTERVAL '5 minutes')
    ORDER BY created_at ASC
    FOR UPDATE SKIP LOCKED
    LIMIT p_batch_size
  )
  RETURNING *;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 22. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_customers_company_status ON public.customers(company_id, status);
CREATE INDEX IF NOT EXISTS idx_quotations_company_status ON public.quotations(company_id, status);
CREATE INDEX IF NOT EXISTS idx_projects_company_customer ON public.projects(company_id, customer_id);
CREATE INDEX IF NOT EXISTS idx_outbox_status_created ON public.outbox_events(status, created_at);
CREATE INDEX IF NOT EXISTS idx_customers_trgm_name ON public.customers USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_trgm_name ON public.products USING gin(name gin_trgm_ops);

-- Allow authenticated users to view files inside their own company folder
CREATE POLICY "Users can view own company files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'company-assets'
    AND (storage.foldername(name))[1] = public.auth_company_id()::text
);

-- Allow authenticated users to upload files into their own company folder
CREATE POLICY "Users can upload own company files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'company-assets'
    AND (storage.foldername(name))[1] = public.auth_company_id()::text
);

-- Allow authenticated users to update files in their own company folder
CREATE POLICY "Users can update own company files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'company-assets'
    AND (storage.foldername(name))[1] = public.auth_company_id()::text
)
WITH CHECK (
    bucket_id = 'company-assets'
    AND (storage.foldername(name))[1] = public.auth_company_id()::text
);

-- Allow authenticated users to delete files in their own company folder
CREATE POLICY "Users can delete own company files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'company-assets'
    AND (storage.foldername(name))[1] = public.auth_company_id()::text
);