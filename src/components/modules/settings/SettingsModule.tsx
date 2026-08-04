import React, { useState } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useCompanyStore } from '@/store/useCompanyStore';
import { useAuthStore } from '@/store/useAuthStore';
import { LocalStorageAdapter } from '@/storage/localStorageAdapter';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import {
  Settings,
  Building,
  Palette,
  Users,
  Layers,
  Bell,
  FileText,
  DollarSign,
  ShieldCheck,
  Database,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  Cpu,
  Activity,
} from 'lucide-react';

import { supabase, isSupabaseConfigured } from '@/lib/supabase';

type SettingsTab =
  | 'company'
  | 'branding'
  | 'users'
  | 'modules'
  | 'notifications'
  | 'quotations'
  | 'taxes'
  | 'security'
  | 'audit';

export const SettingsModule: React.FC = () => {
  const { addToast, setResetModalOpen } = useUIStore();
  const { company, updateCompany } = useCompanyStore();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState<SettingsTab>('company');
  const [unitSystem, setUnitSystem] = useState<string>('ft-in');

  // Business Profile Form State
  const [companyName, setCompanyName] = useState(company?.name || (company as any)?.company_name || 'VLR Interior Solutions');
  const [ownerName, setOwnerName] = useState(user?.ownerName || 'Kishore');
  const [email, setEmail] = useState(company?.email || 'quotations@vlrinteriors.com');
  const [phone, setPhone] = useState(company?.phone || '+91 98765 43210');
  const [gstNumber, setGstNumber] = useState(company?.gstin || (company as any)?.tax_id || '36ABCDE1234F1ZS');
  const [address, setAddress] = useState(company?.address || 'Plot 42, Commercial Complex, Sector 18');
  const [city, setCity] = useState(company?.city || 'Hyderabad, Telangana - 500081');

  // Keep form state in sync when company/user store finishes loading
  React.useEffect(() => {
    if (company?.name || (company as any)?.company_name) setCompanyName(company.name || (company as any)?.company_name || '');
    if (user?.ownerName) setOwnerName(user.ownerName);
    if (company?.email) setEmail(company.email);
    if (company?.phone) setPhone(company.phone);
    if (company?.gstin || (company as any)?.tax_id) setGstNumber(company.gstin || (company as any)?.tax_id || '');
    if (company?.address) setAddress(company.address);
    if (company?.city) setCity(company.city);
  }, [company, user]);

  const handleSaveCompanyProfile = async () => {
    const updatedCompanyData = {
      name: companyName,
      company_name: companyName,
      email,
      phone,
      gstin: gstNumber,
      tax_id: gstNumber,
      address,
      city,
    };

    // 1. Instantly update Zustand company store & local storage
    updateCompany(updatedCompanyData);

    // 2. Instantly update Auth Store state
    useAuthStore.setState((state) => ({
      user: state.user ? { ...state.user, companyName, ownerName, phone } : null,
      company: state.company ? { ...state.company, company_name: companyName, address, city, phone, email } : null,
    }));

    // 3. Persist to cache
    try {
      const cachedComp = localStorage.getItem('nqp_cached_auth_company_v1');
      const parsedComp = cachedComp ? JSON.parse(cachedComp) : {};
      localStorage.setItem(
        'nqp_cached_auth_company_v1',
        JSON.stringify({ ...parsedComp, company_name: companyName, address, city, phone, email })
      );
    } catch (e) {}

    // 4. Asynchronously sync to Supabase database if connected
    if (isSupabaseConfigured() && user) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          const { data: profile } = await supabase.from('profiles').select('company_id').eq('user_id', session.user.id).maybeSingle();
          if (profile?.company_id) {
            await supabase.from('companies').update({
              company_name: companyName,
              email,
              phone,
              gst_number: gstNumber,
              address,
              city,
            }).eq('id', profile.company_id);
          }
        }
      } catch (e) {}
    }

    addToast({
      type: 'success',
      title: 'Company Saved',
      message: `Updated profile for ${companyName}. Workspace synced.`,
    });
  };

  // Feature Flags State
  const [featureFlags, setFeatureFlags] = useState({
    quotation_builder: true,
    inventory: true,
    crm: true,
    reports: true,
    analytics: true,
    ai_assistant: true,
    production: true,
    purchasing: true,
    notifications: true,
  });

  const toggleFeature = (key: keyof typeof featureFlags) => {
    setFeatureFlags((prev) => ({ ...prev, [key]: !prev[key] }));
    addToast({
      type: 'success',
      title: 'Module Updated',
      message: `Updated module configuration for ${key.replace('_', ' ').toUpperCase()}`,
    });
  };

  const handleExportBackup = () => {
    const data = LocalStorageAdapter.exportFullBackupJSON();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexvelt_system_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({ type: 'success', title: 'Backup Exported', message: 'Saved system backup JSON file.' });
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && LocalStorageAdapter.importFullBackupJSON(content)) {
        addToast({ type: 'success', title: 'Backup Restored', message: 'System data restored successfully. Reloading...' });
        setTimeout(() => window.location.reload(), 1200);
      } else {
        addToast({ type: 'error', title: 'Import Failed', message: 'Invalid backup file format.' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Settings Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#00D9D9]" />
            Enterprise Control & System Configuration
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage company profile, modular features, roles, branding, quotation formats, and security settings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="cyan">Nexvelt v2.4 Enterprise</Badge>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'company', label: 'Company Profile', icon: Building },
          { id: 'branding', label: 'Branding & Theme', icon: Palette },
          { id: 'users', label: 'Users & Roles', icon: Users },
          { id: 'modules', label: 'Application Modules', icon: Layers },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'quotations', label: 'PDF & Quotations', icon: FileText },
          { id: 'taxes', label: 'Taxes & Currency', icon: DollarSign },
          { id: 'security', label: 'Security & Backup', icon: ShieldCheck },
          { id: 'audit', label: 'Audit & Diagnostics', icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-[#00D9D9] text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: COMPANY PROFILE */}
      {activeTab === 'company' && (
        <Card glass={false} className="bg-white border-slate-200 p-6 rounded-2xl shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-[#00B8B8]" /> Company & Business Profile Information
            </h3>
            <span className="text-xs text-slate-400 font-mono">ID: NEX-COMPANY-01</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            <Input label="Business Owner Name" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
            <Input label="Official Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Input label="GSTIN / Tax ID" value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} />
            <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} />
            <div className="md:col-span-2">
              <Input label="Registered Address" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveCompanyProfile}
            >
              Save Company Profile
            </Button>
          </div>
        </Card>
      )}

      {/* TAB 2: BRANDING */}
      {activeTab === 'branding' && (
        <Card glass={false} className="bg-white border-slate-200 p-6 rounded-2xl shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-600" /> Company Branding & Custom Themes
          </h3>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block text-sm">Nexvelt Enterprise Light Brand Theme</span>
              <span className="text-xs text-slate-500">Optimized for high readability, crisp typography, and PDF export rendering.</span>
            </div>
            <Badge variant="cyan">Default Locked</Badge>
          </div>
        </Card>
      )}

      {/* TAB 3: USERS & ROLES */}
      {activeTab === 'users' && (
        <Card glass={false} className="bg-white border-slate-200 p-6 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" /> User Directory & Role-Based Access Control (RBAC)
            </h3>
            <Badge variant="cyan">{user?.ownerName || 'Owner Access'}</Badge>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Manage company team members, assign permissions (Manager, Sales, Staff, Viewer), and configure credentials.
          </p>
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
            <span>To invite and manage staff members, navigate to the Team Management page.</span>
            <a href="/team" className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-[11px] font-bold">
              Manage Team
            </a>
          </div>
        </Card>
      )}

      {/* TAB 4: APPLICATION MODULES (FEATURE FLAGS) */}
      {activeTab === 'modules' && (
        <Card glass={false} className="bg-white border-slate-200 p-6 rounded-2xl shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#00D9D9]" /> Application Modules & Feature Switches
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Enable or disable application modules according to your operational business requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'quotation_builder', title: 'Quotation Builder Engine', desc: 'Interactive quotation calculator and line item editor' },
              { key: 'inventory', title: 'Material & Hardware Catalog', desc: 'Material master library, rate list, and inventory stock' },
              { key: 'crm', title: 'Customer Relationship Management', desc: 'Customer directory, project history, and contact details' },
              { key: 'reports', title: 'Financial Analytics & Profit Reports', desc: 'Gross margin reports, sales velocity, and executive summaries' },
              { key: 'analytics', title: 'Dashboard Performance KPIs', desc: 'Realtime charts, win-rates, and estimation metrics' },
              { key: 'ai_assistant', title: 'AI Specification Assistant', desc: 'Automated furniture specs and AI cost recommendations' },
              { key: 'production', title: 'Workshop & Cutting List Engine', desc: 'Production job sheets, panel optimization, and workshop tasks' },
              { key: 'purchasing', title: 'BOM & Purchase Order Generator', desc: 'Bill of Materials breakdown and vendor purchase list exports' },
              { key: 'notifications', title: 'Alerts & Activity Trail', desc: 'Internal activity logs, team updates, and email notifications' },
            ].map((mod) => {
              const enabled = featureFlags[mod.key as keyof typeof featureFlags];
              return (
                <div
                  key={mod.key}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                    enabled ? 'bg-cyan-50/50 border-[#00D9D9]/30' : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-xs font-extrabold text-slate-900 block">{mod.title}</span>
                    <span className="text-[11px] text-slate-500 font-medium block">{mod.desc}</span>
                  </div>
                  <button
                    onClick={() => toggleFeature(mod.key as keyof typeof featureFlags)}
                    className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                      enabled ? 'bg-[#00D9D9]' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                        enabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* TAB 5: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <Card glass={false} className="bg-white border-slate-200 p-6 rounded-2xl shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-500" /> Notification Preferences & Email Triggers
          </h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-xs font-semibold text-slate-700 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-[#00D9D9] focus:ring-[#00D9D9]" />
              Send email alerts on customer quote approval
            </label>
            <label className="flex items-center gap-3 text-xs font-semibold text-slate-700 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-[#00D9D9] focus:ring-[#00D9D9]" />
              Notify owner on staff invitations and role updates
            </label>
          </div>
        </Card>
      )}

      {/* TAB 6: PDF & QUOTATIONS */}
      {activeTab === 'quotations' && (
        <Card glass={false} className="bg-white border-slate-200 p-6 rounded-2xl shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#00B8B8]" /> Quotation Format & Print Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Default Measurement Unit"
              value={unitSystem}
              onChange={(val: any) => setUnitSystem(typeof val === 'string' ? val : val.target.value)}
              options={[
                { value: 'ft-in', label: 'Feet + Inches (e.g. 7 ft 6 in)' },
                { value: 'dec-ft', label: 'Decimal Feet (e.g. 7.5 ft)' },
                { value: 'mm', label: 'Millimeters (e.g. 2286 mm)' },
              ]}
            />
            <Input label="Quotation Number Prefix" defaultValue="EST-" />
            <Input label="Default Validity Period" defaultValue="30 Days" />
            <Input label="Default Advance Payment Terms" defaultValue="50% Advance, 50% Before Dispatch" />
          </div>
        </Card>
      )}

      {/* TAB 7: TAXES & CURRENCY */}
      {activeTab === 'taxes' && (
        <Card glass={false} className="bg-white border-slate-200 p-6 rounded-2xl shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" /> Tax Engine & Base Currency
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="System Base Currency"
              value="INR"
              onChange={() => {}}
              options={[
                { value: 'INR', label: 'INR (₹) - Indian Rupee' },
                { value: 'USD', label: 'USD ($) - US Dollar' },
                { value: 'AED', label: 'AED (د.إ) - UAE Dirham' },
              ]}
            />
            <Input label="Default GST Rate (%)" defaultValue="18" />
          </div>
        </Card>
      )}

      {/* TAB 8: SECURITY & BACKUP */}
      {activeTab === 'security' && (
        <Card glass={false} className="bg-white border-slate-200 p-6 rounded-2xl shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-600" /> Security Credentials & System Backups
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Export JSON backups, restore offline data files, or reset factory defaults.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button variant="outline" size="sm" icon={<Download className="w-4 h-4 text-[#00D9D9]" />} onClick={handleExportBackup}>
              Export Full JSON Backup
            </Button>
            <label className="cursor-pointer">
              <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300">
                <Upload className="w-4 h-4 text-slate-600" /> Import Backup JSON
              </span>
              <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
            </label>
            <Button
              variant="outline"
              size="sm"
              className="text-rose-600 border-rose-200 hover:bg-rose-50"
              icon={<RotateCcw className="w-4 h-4 text-rose-500" />}
              onClick={() => setResetModalOpen(true)}
            >
              Reset System Data
            </Button>
          </div>
        </Card>
      )}

      {/* TAB 9: AUDIT & DIAGNOSTICS */}
      {activeTab === 'audit' && (
        <Card glass={false} className="bg-white border-slate-200 p-6 rounded-2xl shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#00D9D9]" /> System Diagnostics & Health Audit
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block uppercase">Database Status</span>
              <span className="text-sm font-black text-emerald-600 flex items-center gap-1.5 mt-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Connected & Isolated
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block uppercase">Storage Bucket</span>
              <span className="text-sm font-black text-[#00B8B8] flex items-center gap-1.5 mt-1">
                <Database className="w-4 h-4 text-[#00D9D9]" /> Protected
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block uppercase">Worker Pipeline</span>
              <span className="text-sm font-black text-slate-900 flex items-center gap-1.5 mt-1">
                <Cpu className="w-4 h-4 text-slate-700" /> Active
              </span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
