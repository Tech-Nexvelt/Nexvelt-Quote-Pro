import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { AppLayout } from '@/components/layout/AppLayout';
import { CommandPalette } from '@/components/common/CommandPalette';
import { PrintModal } from '@/components/modules/print/PrintModal';
import { ResetConfirmationModal } from '@/components/modules/common/ResetConfirmationModal';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { CompanyProvider } from '@/contexts/CompanyContext';
import { OfflineBanner } from '@/components/common/OfflineBanner';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { logger } from '@/utils/logger';
import { telemetry } from '@/utils/telemetry';

// Auth & Onboarding Pages
import { LoginPage } from '@/components/auth/LoginPage';
import { RegisterPage } from '@/components/auth/RegisterPage';
import { ForgotPasswordPage } from '@/components/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@/components/auth/ResetPasswordPage';
import { OnboardingPage } from '@/components/auth/OnboardingPage';
import { AuthCallback } from '@/pages/auth/AuthCallback';

// Enterprise Team & Super Admin Modules
import { TeamManagementModule } from '@/components/modules/team/TeamManagementModule';
import { SuperAdminDashboard } from '@/components/admin/SuperAdminDashboard';
import { QueueMonitoringDashboard } from '@/components/admin/QueueMonitoringDashboard';

// Enterprise Legal Module Pages
import { LegalCenterPage } from '@/components/legal/LegalCenterPage';
import { TermsOfServicePage } from '@/components/legal/TermsOfServicePage';
import { PrivacyPolicyPage } from '@/components/legal/PrivacyPolicyPage';
import { RefundPolicyPage } from '@/components/legal/RefundPolicyPage';
import { CookiePolicyPage } from '@/components/legal/CookiePolicyPage';
import { AcceptableUsePage } from '@/components/legal/AcceptableUsePage';
import { DataSecurityPage } from '@/components/legal/DataSecurityPage';
import { ContactLegalPage } from '@/components/legal/ContactLegalPage';

// Protected View Modules
import { DashboardModule } from '@/components/modules/dashboard/DashboardModule';
import { NexveltQuoteProBuilder } from '@/components/quotePro/NexveltQuoteProBuilder';
import { CustomerManagementModule } from '@/components/modules/customers/CustomerManagementModule';
import { ProductsModule } from '@/components/modules/products/ProductsModule';
import { MaterialCatalogModule } from '@/components/modules/catalog/MaterialCatalogModule';
import { TemplatesModule } from '@/components/modules/templates/TemplatesModule';
import { ReportsModule } from '@/components/modules/reports/ReportsModule';
import { SettingsModule } from '@/components/modules/settings/SettingsModule';
import { RecentQuotesModule } from '@/components/modules/quotes/RecentQuotesModule';

import { GlobalApplicationLoader } from '@/components/common/GlobalApplicationLoader';
import { EnterpriseStateGallery } from '@/components/common/EnterpriseStateGallery';

// Protected Workspace Guard Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  title: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, title }) => {
  useDocumentTitle(title);
  const { isAuthenticated, hasCompletedOnboarding, loading } = useAuthStore();

  if (loading) {
    return <GlobalApplicationLoader embedded={false} />;
  }

  if (!isAuthenticated) {
    telemetry.recordRouteGuardRedirect('unauthenticated -> /login');
    return <Navigate to="/login" replace />;
  }

  if (!hasCompletedOnboarding) {
    telemetry.recordRouteGuardRedirect('incomplete_onboarding -> /onboarding');
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <AppLayout>
      {children}
    </AppLayout>
  );
};

// Onboarding Setup Route Guard
const OnboardingRouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, hasCompletedOnboarding, loading } = useAuthStore();

  if (loading) {
    return <GlobalApplicationLoader embedded={false} />;
  }

  if (!isAuthenticated) {
    telemetry.recordRouteGuardRedirect('unauthenticated -> /login');
    return <Navigate to="/login" replace />;
  }

  if (hasCompletedOnboarding) {
    telemetry.recordRouteGuardRedirect('already_onboarded -> /dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export function App() {
  const { initializeSession } = useAuthStore();

  useEffect(() => {
    initializeSession();

    if (isSupabaseConfigured()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        logger.info('Supabase Auth State Event Triggered', { event, userId: session?.user?.id });

        switch (event) {
          case 'SIGNED_IN':
          case 'INITIAL_SESSION':
            if (session?.user) {
              const currentAuth = useAuthStore.getState();
              if (!currentAuth.isAuthenticated || !currentAuth.profile) {
                await initializeSession();
              }
            }
            break;
          case 'SIGNED_OUT':
            useAuthStore.setState({
              isAuthenticated: false,
              hasCompletedOnboarding: false,
              user: null,
              company: null,
              profile: null,
              loading: false,
            });
            break;
          case 'TOKEN_REFRESHED':
            if (session?.user) {
              useAuthStore.setState({ isAuthenticated: true, loading: false });
            }
            break;
          case 'USER_UPDATED':
            if (session?.user) {
              await initializeSession();
            }
            break;
          case 'PASSWORD_RECOVERY':
            logger.info('Password recovery event captured');
            break;
          default:
            break;
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [initializeSession]);

  return (
    <ErrorBoundary>
      <CompanyProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Authentication & Callback Routes */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Onboarding Setup Route with Guard */}
            <Route
              path="/onboarding"
              element={
                <OnboardingRouteGuard>
                  <OnboardingPage />
                </OnboardingRouteGuard>
              }
            />

            {/* Enterprise Legal & Governance Routes */}
            <Route path="/legal" element={<LegalCenterPage />} />
            <Route path="/legal/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/legal/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/legal/refund-policy" element={<RefundPolicyPage />} />
            <Route path="/legal/cookie-policy" element={<CookiePolicyPage />} />
            <Route path="/legal/acceptable-use" element={<AcceptableUsePage />} />
            <Route path="/legal/data-security" element={<DataSecurityPage />} />
            <Route path="/legal/contact" element={<ContactLegalPage />} />

            {/* Super Admin & Queue Monitoring Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute title="Nexvelt Quote Pro | Super Admin">
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/queue"
              element={
                <ProtectedRoute title="Nexvelt Quote Pro | Queue Monitor">
                  <QueueMonitoringDashboard />
                </ProtectedRoute>
              }
            />

            {/* Team Management Route */}
            <Route
              path="/team"
              element={
                <ProtectedRoute title="Nexvelt Quote Pro | Team & Staff">
                  <TeamManagementModule />
                </ProtectedRoute>
              }
            />

            {/* Protected Workspace SaaS Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute title="Nexvelt Quote Pro | Dashboard">
                  <DashboardModule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quotations"
              element={
                <ProtectedRoute title="Nexvelt Quote Pro | Quotations">
                  <NexveltQuoteProBuilder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recent-quotes"
              element={
                <ProtectedRoute title="Nexvelt Quote Pro | Recent Quotes">
                  <RecentQuotesModule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <ProtectedRoute title="Nexvelt Quote Pro | Customers">
                  <CustomerManagementModule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute title="Nexvelt Quote Pro | Products">
                  <ProductsModule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/material-library"
              element={
                <ProtectedRoute title="Nexvelt Quote Pro | Material Library">
                  <MaterialCatalogModule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/templates"
              element={
                <ProtectedRoute title="Nexvelt Quote Pro | Templates">
                  <TemplatesModule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute title="Nexvelt Quote Pro | Reports">
                  <ReportsModule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute title="Nexvelt Quote Pro | Settings">
                  <SettingsModule />
                </ProtectedRoute>
              }
            />

            {/* Enterprise Application States Design System Showcase Routes */}
            <Route path="/app-states" element={<EnterpriseStateGallery />} />
            <Route path="/design-system" element={<EnterpriseStateGallery />} />

            {/* Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Global Overlays & Toasts */}
          <OfflineBanner />
          <CommandPalette />
          <PrintModal />
          <ResetConfirmationModal />
          <ToastContainer />
        </BrowserRouter>
      </CompanyProvider>
    </ErrorBoundary>
  );
}

export default App;
