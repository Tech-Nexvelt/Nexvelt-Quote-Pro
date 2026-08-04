import React from 'react';
import { useUIStore, NavView } from '@/store/useUIStore';
import { useCompanyStore } from '@/store/useCompanyStore';
import { useQuotationStore } from '@/store/useQuotationStore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  LayoutDashboard,
  Calculator,
  Users,
  Layers,
  Building2,
  BarChart3,
  Settings,
  PlusCircle,
  Printer,
  FileDown,
  RotateCcw,
  Sun,
  Moon,
} from 'lucide-react';
import html2pdf from 'html2pdf.js';

export const Navbar: React.FC = () => {
  const { currentView, setCurrentView, theme, toggleTheme, setResetModalOpen, setPrintPreviewOpen, addToast } = useUIStore();
  const { company } = useCompanyStore();
  const { currentQuotation, createNewQuotation, saveCurrentQuotation } = useQuotationStore();

  const navItems: { id: NavView; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'builder', label: 'Quotation Builder', icon: <Calculator className="w-4 h-4" /> },
    { id: 'customers', label: 'Customers', icon: <Users className="w-4 h-4" /> },
    { id: 'catalog', label: 'Catalog & Materials', icon: <Layers className="w-4 h-4" /> },
    { id: 'company', label: 'Company Profile', icon: <Building2 className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleExportPDF = async () => {
    // Open print preview modal or directly generate PDF
    saveCurrentQuotation();
    setPrintPreviewOpen(true);
    addToast({
      type: 'info',
      title: 'Preparing Quotation PDF',
      message: 'Generating high-resolution printable A4 quotation template.',
    });
  };

  const handleNewEstimate = () => {
    saveCurrentQuotation();
    createNewQuotation();
    setCurrentView('builder');
    addToast({
      type: 'success',
      title: 'New Quotation Created',
      message: 'Draft initialized with default settings.',
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Company Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#00D9D9] to-[#00B8B8] flex items-center justify-center text-slate-950 font-bold text-xl shadow-md shadow-[#00D9D9]/20">
              {company.name ? company.name.charAt(0) : 'I'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">
                  {company.name || 'Interior Cost Estimator'}
                </h1>
                <Badge variant="cyan">{currentQuotation.revisionCode}</Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentQuotation.quotationNumber} • {currentQuotation.customer.name || 'Draft Client'}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/60 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
            {navItems.map((item) => {
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    active
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<PlusCircle className="w-4 h-4 text-[#00B8B8]" />}
              onClick={handleNewEstimate}
              title="Start a new quotation draft"
            >
              <span className="hidden sm:inline">New Estimate</span>
            </Button>

            <Button
              variant="glass"
              size="sm"
              icon={<Printer className="w-4 h-4" />}
              onClick={() => {
                saveCurrentQuotation();
                setPrintPreviewOpen(true);
              }}
              title="Print A4 Quotation"
            >
              <span className="hidden sm:inline">Print</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              icon={<FileDown className="w-4 h-4" />}
              onClick={handleExportPDF}
              title="Export high quality PDF"
            >
              <span className="hidden sm:inline">Export PDF</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              icon={<RotateCcw className="w-4 h-4 text-red-500" />}
              onClick={() => setResetModalOpen(true)}
              title="Reset quotation inputs"
            />

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle theme mode"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-[#35F5FF]" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center justify-between gap-1 py-2 overflow-x-auto border-t border-slate-100 dark:border-slate-800">
          {navItems.map((item) => {
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap ${
                  active
                    ? 'bg-[#00D9D9]/20 text-[#00B8B8] dark:text-[#35F5FF]'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
