import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useUIStore, NavView } from '@/store/useUIStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useCompanyStore } from '@/store/useCompanyStore';
import { useAuthStore } from '@/store/useAuthStore';
import {
  Search,
  ChevronDown,
  Plus,
  LayoutDashboard,
  FileText,
  Users,
  Box,
  Library,
  Layers,
  BarChart3,
  Settings,
  Tag,
  Clock,
  Bookmark,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Building2,
  AlertCircle,
  BookOpen,
  ChevronRightIcon,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const SIDEBAR_COLLAPSED_KEY = 'nexvelt_sidebar_collapsed';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentView, setCurrentView, addToast, setPrintPreviewOpen } = useUIStore();
  const { project, resetProject } = useProjectStore();
  const { company } = useCompanyStore();
  const { logout } = useAuthStore();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Mobile drawer state
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const [activeStep, setActiveStep] = useState(1);
  const [showConfirmNewQuoteModal, setShowConfirmNewQuoteModal] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, isCollapsed.toString());
    } catch (e) {
      console.error('Failed to save sidebar collapse state', e);
    }
  }, [isCollapsed]);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileDrawerOpen(false);
  }, [location.pathname]);

  // Sync currentView with React Router URL path
  useEffect(() => {
    const p = location.pathname;
    if (p === '/dashboard') setCurrentView('dashboard');
    else if (p === '/quotations') setCurrentView('builder');
    else if (p === '/customers') setCurrentView('customers');
    else if (p === '/products') setCurrentView('products');
    else if (p === '/material-library') setCurrentView('catalog');
    else if (p === '/templates') setCurrentView('templates');
    else if (p === '/reports') setCurrentView('reports');
    else if (p === '/settings') setCurrentView('settings');
  }, [location.pathname, setCurrentView]);

  const handleSaveDraft = () => {
    addToast({
      type: 'success',
      title: 'Quotation Saved',
      message: `Saved draft ${project.quotationNumber || '#Q-2025-0001'} to local workspace.`,
    });
  };

  const handleNewQuotationClick = () => {
    try {
      const cached = localStorage.getItem('nqp_active_quotation_builder_draft_v1') || sessionStorage.getItem('nqp_active_quotation_builder_draft_v1');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && Array.isArray(parsed.items) && parsed.items.length > 0) {
          setShowConfirmNewQuoteModal(true);
          return;
        }
      }
    } catch (e) {}
    confirmStartNewQuotation();
  };

  const confirmStartNewQuotation = () => {
    try {
      localStorage.removeItem('nqp_active_quotation_builder_draft_v1');
      sessionStorage.removeItem('nqp_active_quotation_builder_draft_v1');
    } catch (e) {}
    resetProject();
    navigate('/quotations');
    window.dispatchEvent(new Event('nqp_clear_builder_draft'));
    addToast({ type: 'info', title: 'New Quotation Started', message: 'Cleared form for fresh quotation.' });
    setShowConfirmNewQuoteModal(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveDraft();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (location.pathname !== '/quotations') return;

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const stepNum = parseInt(entry.target.id.replace('quotation-step-', ''), 10);
          if (!isNaN(stepNum)) {
            setActiveStep(stepNum);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '-10% 0px -50% 0px',
      threshold: 0.2,
    });

    const steps = [1, 2, 3, 4];
    steps.forEach((step) => {
      const el = document.getElementById(`quotation-step-${step}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  const navItems: { id: string; label: string; icon: React.ComponentType<{ className?: string }>; view: NavView; path: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, view: 'dashboard', path: '/dashboard' },
    { id: 'quotations', label: 'Quotations', icon: FileText, view: 'builder', path: '/quotations' },
    { id: 'customers', label: 'Customers', icon: Users, view: 'customers', path: '/customers' },
    { id: 'products', label: 'Products', icon: Box, view: 'products', path: '/products' },
    { id: 'catalog', label: 'Material Library', icon: Library, view: 'catalog', path: '/material-library' },
    { id: 'templates', label: 'Templates', icon: Layers, view: 'templates', path: '/templates' },
    { id: 'reports', label: 'Reports', icon: BarChart3, view: 'reports', path: '/reports' },
    { id: 'settings', label: 'Settings', icon: Settings, view: 'settings', path: '/settings' },
  ];

  const shortcutItems: { id: string; label: string; icon: React.ComponentType<{ className?: string }>; view: NavView; path: string }[] = [
    { id: 'price-list', label: 'Price List', icon: Tag, view: 'price-list', path: '/material-library' },
    { id: 'recent-quotes', label: 'Recent Quotes', icon: Clock, view: 'recent-quotes', path: '/quotations' },
    { id: 'my-templates', label: 'My Templates', icon: Bookmark, view: 'my-templates', path: '/templates' },
  ];

  // Bottom tab nav items (5 most important for mobile)
  const mobileTabItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'quotations', label: 'Quotes', icon: FileText, path: '/quotations' },
    { id: 'customers', label: 'Clients', icon: Users, path: '/customers' },
    { id: 'reports', label: 'Reports', icon: BarChart3, path: '/reports' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const renderBreadcrumb = () => {
    const path = location.pathname;
    switch (path) {
      case '/dashboard':
        return <span className="font-extrabold text-[#111827]">Dashboard</span>;
      case '/quotations':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-xs text-[#6B7280]">
            <Link to="/dashboard" className="hover:text-[#111827] hidden sm:inline">Dashboard</Link>
            <ChevronRightIcon className="w-3.5 h-3.5 text-[#9CA3AF] hidden sm:inline" />
            <span className="font-extrabold text-[#111827]">Quotations</span>
          </div>
        );
      case '/customers':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-xs text-[#6B7280]">
            <Link to="/dashboard" className="hover:text-[#111827] hidden sm:inline">Dashboard</Link>
            <ChevronRightIcon className="w-3.5 h-3.5 text-[#9CA3AF] hidden sm:inline" />
            <span className="font-extrabold text-[#111827]">Customers</span>
          </div>
        );
      case '/products':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-xs text-[#6B7280]">
            <Link to="/dashboard" className="hover:text-[#111827] hidden sm:inline">Dashboard</Link>
            <ChevronRightIcon className="w-3.5 h-3.5 text-[#9CA3AF] hidden sm:inline" />
            <span className="font-extrabold text-[#111827]">Products</span>
          </div>
        );
      case '/material-library':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-xs text-[#6B7280]">
            <Link to="/dashboard" className="hover:text-[#111827] hidden sm:inline">Dashboard</Link>
            <ChevronRightIcon className="w-3.5 h-3.5 text-[#9CA3AF] hidden sm:inline" />
            <span className="font-extrabold text-[#111827]">Material Library</span>
          </div>
        );
      case '/templates':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-xs text-[#6B7280]">
            <Link to="/dashboard" className="hover:text-[#111827] hidden sm:inline">Dashboard</Link>
            <ChevronRightIcon className="w-3.5 h-3.5 text-[#9CA3AF] hidden sm:inline" />
            <span className="font-extrabold text-[#111827]">Templates</span>
          </div>
        );
      case '/reports':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-xs text-[#6B7280]">
            <Link to="/dashboard" className="hover:text-[#111827] hidden sm:inline">Dashboard</Link>
            <ChevronRightIcon className="w-3.5 h-3.5 text-[#9CA3AF] hidden sm:inline" />
            <span className="font-extrabold text-[#111827]">Reports</span>
          </div>
        );
      case '/settings':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-xs text-[#6B7280]">
            <Link to="/dashboard" className="hover:text-[#111827] hidden sm:inline">Dashboard</Link>
            <ChevronRightIcon className="w-3.5 h-3.5 text-[#9CA3AF] hidden sm:inline" />
            <span className="font-extrabold text-[#111827]">Settings</span>
          </div>
        );
      default:
        return <span className="font-extrabold text-[#111827]">Dashboard</span>;
    }
  };

  /* ---- Shared Sidebar Nav Content (used in both desktop sidebar & mobile drawer) ---- */
  const SidebarContent = ({ onNavClick }: { onNavClick?: () => void }) => (
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-5">
        {/* Logo */}
        <div
          onClick={() => { navigate('/dashboard'); onNavClick?.(); }}
          className="flex items-center gap-2.5 px-1 cursor-pointer"
        >
          <img src="/nexvelt_logo.png" alt="Nexvelt Logo" className="w-9 h-9 object-contain drop-shadow-sm shrink-0" />
          {(!isCollapsed || onNavClick) && (
            <div>
              <span className="font-extrabold text-sm tracking-tight text-[#111827] block leading-none">Nexvelt</span>
              <span className="text-[9px] font-bold text-[#00B8B8] tracking-widest uppercase block mt-0.5">QUOTE PRO</span>
            </div>
          )}
        </div>

        {/* New Quotation Button */}
        <button
          onClick={() => { handleNewQuotationClick(); onNavClick?.(); }}
          className={`w-full bg-[#00D9D9] hover:bg-[#00B8B8] text-white font-bold rounded-xl flex items-center justify-center transition-all hover:scale-[1.01] shadow-xs cursor-pointer ${
            isCollapsed && !onNavClick ? 'h-10 px-0' : 'h-10 px-3 text-xs gap-2'
          }`}
        >
          <Plus className="w-4 h-4 shrink-0" />
          {(!isCollapsed || onNavClick) && <span>+ New Quotation</span>}
        </button>

        {/* Primary Nav */}
        <nav className="space-y-1">
          {navItems.map((nav) => {
            const isActive = location.pathname === nav.path;
            return (
              <button
                key={nav.id}
                onClick={() => { setCurrentView(nav.view); navigate(nav.path); onNavClick?.(); }}
                className={`w-full h-9.5 rounded-xl text-xs font-semibold flex items-center transition-all cursor-pointer ${
                  isCollapsed && !onNavClick ? 'justify-center px-0' : 'justify-between px-3'
                } ${
                  isActive
                    ? 'bg-[#E6F7F7] text-[#008080] font-bold border border-[#00D9D9]/30 shadow-2xs'
                    : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F1F5F9]'
                }`}
                title={nav.label}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <nav.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#00B8B8]' : 'text-[#6B7280]'}`} />
                  {(!isCollapsed || onNavClick) && <span className="truncate">{nav.label}</span>}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Shortcuts (only in full view) */}
        {(!isCollapsed || onNavClick) && (
          <div className="pt-3 border-t border-[#F1F5F9] space-y-1">
            <span className="px-3 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block mb-1">Shortcuts</span>
            {shortcutItems.map((sc) => {
              const isActive = location.pathname === sc.path;
              return (
                <button
                  key={sc.id}
                  onClick={() => { setCurrentView(sc.view); navigate(sc.path); onNavClick?.(); }}
                  className={`w-full h-8.5 px-3 text-xs rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#E6F7F7] text-[#008080] font-bold border border-[#00D9D9]/30'
                      : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F1F5F9]'
                  }`}
                >
                  <sc.icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#00B8B8]' : 'text-[#6B7280]'}`} />
                  <span>{sc.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom: Help + Sign Out */}
      {(!isCollapsed || onNavClick) ? (
        <div className="space-y-3 pt-3 border-t border-[#F1F5F9]">
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-[#111827]">Documentation & Support</h4>
            <p className="text-[11px] text-[#4B5563] leading-relaxed">Read user guides or view keyboard shortcuts.</p>
            <button
              onClick={() => addToast({ type: 'info', title: 'Help & Shortcuts', message: 'Press Ctrl+K for quick commands or Ctrl+S to save.' })}
              className="w-full py-1.5 bg-white border border-[#CBD5E1] hover:bg-[#F1F5F9] text-[#111827] text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#00B8B8]" /> User Guide & Help
            </button>
          </div>

          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full h-9 bg-white hover:bg-red-50 text-red-600 hover:text-red-700 font-bold border border-[#E2E8F0] rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>

          <div className="text-[10px] font-semibold text-[#6B7280] px-1 leading-tight flex items-center justify-between">
            <span>© {new Date().getFullYear()} Nexvelt</span>
            <Link to="/legal" className="text-[#00B8B8] font-bold hover:underline">Legal & Trust</Link>
          </div>
        </div>
      ) : (
        <div className="text-center pt-3 border-t border-[#F1F5F9] space-y-2">
          <button
            onClick={() => addToast({ type: 'info', title: 'Help & Shortcuts', message: 'Press Ctrl+K for quick commands or Ctrl+S to save.' })}
            className="w-9 h-9 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#374151] flex items-center justify-center mx-auto hover:bg-[#F1F5F9] cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#00B8B8]" />
          </button>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-9 h-9 rounded-xl bg-white border border-[#E2E8F0] text-red-600 flex items-center justify-center mx-auto hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex font-sans select-none antialiased">

      {/* ======================================================= */}
      {/* MOBILE DRAWER OVERLAY                                    */}
      {/* ======================================================= */}
      {isMobileDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 lg:hidden"
          onClick={() => setIsMobileDrawerOpen(false)}
        />
      )}

      {/* Mobile Slide-In Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-[#E2E8F0] z-50 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col p-4 lg:hidden ${
          isMobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Close Button */}
        <button
          onClick={() => setIsMobileDrawerOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#4B5563] hover:text-[#111827] hover:bg-[#F1F5F9] transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
        <SidebarContent onNavClick={() => setIsMobileDrawerOpen(false)} />
      </div>

      {/* ======================================================= */}
      {/* DESKTOP SIDEBAR (hidden on mobile, always shown on lg+)  */}
      {/* ======================================================= */}
      <aside
        className={`hidden lg:flex bg-white border-r border-[#E2E8F0] flex-col p-3.5 shrink-0 shadow-xs z-40 transition-all duration-300 ease-in-out relative ${
          isCollapsed ? 'w-18' : 'w-60'
        }`}
      >
        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-7 h-7 rounded-full border-2 border-[#E2E8F0] bg-white hover:bg-white text-[#111827] hover:text-[#00B8B8] hover:border-[#00D9D9] shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center absolute -right-3.5 top-6 z-50 cursor-pointer active:scale-95"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4 stroke-[2.5]" /> : <ChevronLeft className="w-4 h-4 stroke-[2.5]" />}
        </button>

        <SidebarContent />
      </aside>

      {/* ======================================================= */}
      {/* MAIN VIEW CONTENT                                        */}
      {/* ======================================================= */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* TOP HEADER BAR */}
        <header className="bg-white border-b border-[#E2E8F0] px-3 sm:px-6 py-3 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center justify-between gap-2 sm:gap-4">

            {/* Left: Hamburger (mobile) + Back + Breadcrumb */}
            <div className="flex items-center gap-2">
              {/* Hamburger — mobile only */}
              <button
                onClick={() => setIsMobileDrawerOpen(true)}
                className="lg:hidden p-1.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#4B5563] hover:text-[#111827] transition cursor-pointer"
                title="Open Navigation"
              >
                <Menu className="w-4 h-4" />
              </button>

              {/* Back button — hidden on xs */}
              <button
                onClick={() => navigate('/dashboard')}
                className="hidden sm:flex p-1.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#4B5563] hover:text-[#111827] transition cursor-pointer"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="text-sm">{renderBreadcrumb()}</div>

              {location.pathname === '/quotations' && (
                <span className="hidden xs:inline px-2.5 py-0.5 text-[11px] font-extrabold bg-[#E6F7F7] text-[#008080] rounded-md border border-[#00D9D9]/30">
                  Draft
                </span>
              )}
            </div>

            {/* Centre: Global Search (hidden on small screens) */}
            <div className="relative flex-1 max-w-md hidden md:block">
              <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="global-search-input"
                name="globalSearch"
                aria-label="Global Search"
                type="text"
                placeholder="Search customers, quotes, materials, templates..."
                className="w-full h-9 pl-9 pr-14 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#111827] placeholder-[#6B7280] focus:outline-none focus:border-[#00D9D9] transition-colors font-medium"
              />
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono bg-[#E2E8F0] text-[#4B5563] rounded hidden sm:block">
                Ctrl + K
              </kbd>
            </div>

            {/* Right: Company badge + actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Company Badge — hidden on xs */}
              <div className="hidden sm:flex items-center gap-2 px-2.5 sm:px-3 py-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-left shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-[#E6F7F7] border border-[#00D9D9]/30 flex items-center justify-center text-[#008080] shrink-0">
                  <Building2 className="w-4 h-4 text-[#00B8B8]" />
                </div>
                <div className="leading-tight hidden md:block">
                  <span className="text-xs font-extrabold text-[#111827] block">{company.name || 'Nexvelt Demo'}</span>
                  <span className="text-[10px] text-[#4B5563] font-semibold block">{company.city || 'Main Workshop'}</span>
                </div>
              </div>

              {/* Save Draft — hidden on xs */}
              <button
                onClick={handleSaveDraft}
                className="hidden sm:flex h-9 px-3 text-xs font-bold bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#111827] rounded-lg transition-colors shadow-2xs items-center gap-1.5 cursor-pointer"
                title="Save Draft (Ctrl + S)"
              >
                <span>Save Draft</span>
              </button>

              {/* Quick Actions — always visible */}
              <button
                onClick={() => setPrintPreviewOpen(true)}
                className="h-9 px-2.5 sm:px-3.5 text-xs font-bold bg-[#00D9D9] hover:bg-[#00B8B8] text-white rounded-lg transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
              >
                <span className="hidden sm:inline">Quick Actions</span>
                <span className="sm:hidden">Actions</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Stepper Progress Bar (Quotation Builder only) */}
          {location.pathname === '/quotations' && (
            <div className="flex items-center justify-start gap-4 sm:gap-6 mt-3 pt-3 border-t border-[#F1F5F9] text-xs font-bold overflow-x-auto pb-0.5">
              {[
                { step: 1, label: 'Customer' },
                { step: 2, label: 'Scope' },
                { step: 3, label: 'Items' },
                { step: 4, label: 'Summary' },
              ].map((s, i) => {
                const isCurrent = activeStep === s.step;
                return (
                  <div
                    key={s.step}
                    className="flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-colors shrink-0"
                    onClick={() => {
                      setActiveStep(s.step);
                      const el = document.getElementById(`quotation-step-${s.step}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-[#00D9D9] text-white shadow-xs ring-2 ring-[#00D9D9]/30'
                          : 'bg-[#F1F5F9] text-[#6B7280] hover:bg-[#E2E8F0] hover:text-[#111827]'
                      }`}
                    >
                      {s.step}
                    </div>
                    <span className={isCurrent ? 'text-[#111827] font-extrabold' : 'text-[#6B7280]'}>{s.label}</span>
                    {i < 3 && <div className="w-6 sm:w-8 h-px bg-[#E2E8F0] ml-1 sm:ml-2 hidden sm:block" />}
                  </div>
                );
              })}
            </div>
          )}
        </header>

        {/* WORKSPACE PAGE BODY */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-16 lg:pb-0">
          {children}
        </div>

        {/* BOTTOM FIXED STATUS BAR — desktop only */}
        <footer className="hidden lg:flex bg-white border-t border-[#E2E8F0] px-6 py-2 items-center justify-between text-[11px] text-[#4B5563] shrink-0 z-20">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <span className="font-bold text-[#111827]">Save Draft</span> Ctrl + S
            </span>
            <span className="flex items-center gap-1.5">
              <span className="font-bold text-[#111827]">Quick Search</span> Ctrl + K
            </span>
            <span className="flex items-center gap-1.5">
              <span className="font-bold text-[#111827]">Auto Calculation</span> All totals updated
            </span>
            <span className="flex items-center gap-1.5">
              <span className="font-bold text-[#111827]">Draft ID</span> {project.quotationNumber || '#Q-2025-0001'}
            </span>
          </div>
          <div className="flex items-center gap-2 font-bold text-[#111827]">
            <Building2 className="w-4 h-4 text-[#00B8B8]" />
            <span>{company.name || 'Nexvelt Demo'} ({company.city || 'Main Workshop'})</span>
          </div>
        </footer>
      </div>

      {/* ======================================================= */}
      {/* MOBILE BOTTOM TAB BAR                                    */}
      {/* ======================================================= */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] z-40 flex items-center justify-around px-2 py-1.5 shadow-xl">
        {mobileTabItems.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-[#008080]' : 'text-[#6B7280]'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${isActive ? 'text-[#00B8B8]' : 'text-[#9CA3AF]'}`} />
              <span className={`text-[9px] font-bold ${isActive ? 'text-[#008080]' : 'text-[#9CA3AF]'}`}>{tab.label}</span>
              {isActive && <div className="w-1 h-1 rounded-full bg-[#00D9D9]" />}
            </button>
          );
        })}
        {/* Extra "More" button to open the full drawer */}
        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all cursor-pointer text-[#6B7280]"
        >
          <Menu className="w-5 h-5 text-[#9CA3AF]" />
          <span className="text-[9px] font-bold text-[#9CA3AF]">More</span>
        </button>
      </nav>

      {/* Unsaved Quotation Approval Dialog */}
      {showConfirmNewQuoteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl text-[#111827]">
            <div className="flex items-center gap-3 border-b border-[#E2E8F0] pb-3 text-amber-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="text-base font-extrabold text-[#111827]">Unsaved Quotation Draft</h3>
                <p className="text-xs font-semibold text-[#6B7280]">Approval Required Before Starting New Quotation</p>
              </div>
            </div>
            <p className="text-xs text-[#374151] leading-relaxed font-medium">
              You currently have an active quotation draft with configured items. Starting a new quotation will discard these items. Are you sure you want to proceed?
            </p>
            <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
              <button
                onClick={() => setShowConfirmNewQuoteModal(false)}
                className="px-4 py-2 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#111827] font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Keep Working
              </button>
              <button
                onClick={confirmStartNewQuotation}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-2xs transition cursor-pointer"
              >
                Yes, Start New Quotation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
