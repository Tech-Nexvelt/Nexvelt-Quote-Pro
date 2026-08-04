import React, { useState } from 'react';
import {
  Search,
  Sun,
  Bell,
  ChevronDown,
  LayoutDashboard,
  Users,
  FileText,
  Folder,
  BarChart3,
  TrendingUp,
  Settings,
  Layers,
  Activity,
  UserCheck,
} from 'lucide-react';
import { GlobalApplicationLoader } from './GlobalApplicationLoader';
import {
  DashboardSkeleton,
  CustomerLoadingSkeleton,
  QuotationBuilderSkeleton,
  ReportsLoadingSkeleton,
  AnalyticsLoadingSkeleton,
  SettingsLoadingSkeleton,
  SearchLoadingSkeleton,
} from './SkeletonLoaders';
import { EmptyState } from './EmptyState';
import {
  OfflineStateCard,
  LowDataStateCard,
  SlowNetworkCard,
  ServerErrorCard,
  NotFoundCard,
  AccessDeniedCard,
  SessionExpiredCard,
  BackgroundSyncCard,
  FileUploadCard,
  PrintGenerationCard,
  MaintenanceCard,
  SuccessStateCard,
} from './EnterpriseStateCards';
import { Button } from '@/components/ui/Button';

export const EnterpriseStateGallery: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'loaders' | 'empty' | 'errors' | 'sync'>('all');
  const [progressVal, setProgressVal] = useState(72);
  const [rippled, setRippled] = useState(false);

  const colors = [
    { name: 'Primary', hex: '#00D9D9', bgClass: 'bg-[#00D9D9]' },
    { name: 'Secondary', hex: '#00B8B8', bgClass: 'bg-[#00B8B8]' },
    { name: 'Accent', hex: '#35F5FF', bgClass: 'bg-[#35F5FF]' },
    { name: 'Background', hex: '#F8FAFC', bgClass: 'bg-[#F8FAFC]' },
    { name: 'Surface', hex: '#FFFFFF', bgClass: 'bg-white' },
    { name: 'Border', hex: '#E5E7EB', bgClass: 'bg-[#E5E7EB]' },
    { name: 'Primary Text', hex: '#111827', bgClass: 'bg-[#111827]' },
    { name: 'Secondary Text', hex: '#6B7280', bgClass: 'bg-[#6B7280]' },
    { name: 'Success', hex: '#10B981', bgClass: 'bg-[#10B981]' },
    { name: 'Warning', hex: '#F59E0B', bgClass: 'bg-[#F59E0B]' },
    { name: 'Danger', hex: '#EF4444', bgClass: 'bg-[#EF4444]' },
    { name: 'Info', hex: '#3B82F6', bgClass: 'bg-[#3B82F6]' },
  ];

  const sidebarLinks = [
    { label: 'Dashboard', icon: LayoutDashboard, active: true },
    { label: 'Customers', icon: Users },
    { label: 'Quotations', icon: FileText },
    { label: 'Projects', icon: Folder },
    { label: 'Reports', icon: BarChart3 },
    { label: 'Analytics', icon: TrendingUp },
    { label: 'Settings', icon: Settings },
    { label: 'Integrations', icon: Layers },
    { label: 'Activity', icon: Activity },
    { label: 'Users', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans p-4 sm:p-6 lg:p-8 space-y-6 select-none">
      {/* Top Application Header Bar */}
      <header className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00D9D9] to-[#00B8B8] flex items-center justify-center text-white font-black text-xl shadow-md shadow-[#00D9D9]/20">
              N
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-wide text-slate-900 leading-tight uppercase">
                Nexvelt
              </span>
              <span className="text-[10px] font-bold text-[#00B8B8] tracking-widest uppercase">
                Quote Pro
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors">
            <span>Nexvelt Solutions Pvt. Ltd.</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-12 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#00D9D9] focus:ring-1 focus:ring-[#00D9D9] transition-all"
            readOnly
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-mono text-[10px] font-bold">
            ⌘ K
          </kbd>
        </div>

        {/* Action Controls & Profile */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <button className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors">
            <Sun className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 relative transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00D9D9]" />
          </button>

          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-[#00D9D9] flex items-center justify-center text-white font-bold text-xs">
              KY
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 leading-tight">Kishore Yadav</span>
              <span className="text-[10px] font-medium text-slate-500">Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Layout: Left Design System Panel + Right 25 Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar: Brand Colors & Sidebar Examples */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header Banner */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="inline-block px-2.5 py-1 rounded-md bg-[#00D9D9]/10 text-[#00B8B8] font-bold text-[10px] uppercase tracking-wider">
              Design System
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
              Enterprise Application States
            </h1>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              A complete reference for all application states in Nexvelt Quote Pro.
            </p>
          </div>

          {/* Brand Colors Legend */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Brand Colors</h3>
            <div className="space-y-2">
              {colors.map((c) => (
                <div key={c.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3.5 h-3.5 rounded-full border border-slate-200 ${c.bgClass}`} />
                    <span className="font-semibold text-slate-700">{c.name}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 font-bold">{c.hex}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Examples (Expanded vs Collapsed) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Sidebar Examples</h3>
            <div className="grid grid-cols-3 gap-3">
              {/* Expanded Sidebar */}
              <div className="col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-3">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Expanded</div>
                <div className="flex items-center gap-1.5 pb-2 border-b border-slate-200">
                  <div className="w-5 h-5 rounded-md bg-[#00D9D9] flex items-center justify-center text-white font-black text-[10px]">
                    N
                  </div>
                  <span className="font-extrabold text-[10px] text-slate-900">Nexvelt Quote Pro</span>
                </div>
                <div className="space-y-1">
                  {sidebarLinks.slice(0, 7).map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center gap-2 px-2 py-1 rounded-lg text-[10px] font-bold ${
                        item.active
                          ? 'bg-cyan-50 text-[#00B8B8] border border-cyan-200'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <item.icon className="w-3 h-3" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Collapsed Sidebar */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col items-center space-y-3">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Collapsed</div>
                <div className="w-5 h-5 rounded-md bg-[#00D9D9] flex items-center justify-center text-white font-black text-[10px]">
                  N
                </div>
                <div className="space-y-2 pt-2 border-t border-slate-200 w-full flex flex-col items-center">
                  {sidebarLinks.slice(0, 6).map((item) => (
                    <div
                      key={item.label}
                      className={`p-1 rounded-md ${
                        item.active ? 'bg-cyan-50 text-[#00B8B8]' : 'text-slate-500'
                      }`}
                    >
                      <item.icon className="w-3.5 h-3.5" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 25 Cards Reference Grid */}
        <div className="lg:col-span-9 space-y-6">
          {/* Category Filter Tabs */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto">
            {(['all', 'loaders', 'empty', 'errors', 'sync'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-[#00D9D9] text-white shadow-md shadow-[#00D9D9]/20'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab === 'all' ? 'All 25 Application States' : tab}
              </button>
            ))}
          </div>

          {/* 25 Cards Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Global Application Loading */}
            <CardWrapper number={1} title="Global Application Loading">
              <GlobalApplicationLoader embedded={true} />
            </CardWrapper>

            {/* Card 2: Dashboard Skeleton */}
            <CardWrapper number={2} title="Dashboard Skeleton">
              <div className="scale-90 transform-gpu -m-2">
                <DashboardSkeleton />
              </div>
            </CardWrapper>

            {/* Card 3: Customer Loading */}
            <CardWrapper number={3} title="Customer Loading">
              <div className="scale-90 transform-gpu -m-2">
                <CustomerLoadingSkeleton />
              </div>
            </CardWrapper>

            {/* Card 4: Quotation Builder Loading */}
            <CardWrapper number={4} title="Quotation Builder Loading">
              <div className="scale-90 transform-gpu -m-2">
                <QuotationBuilderSkeleton />
              </div>
            </CardWrapper>

            {/* Card 5: Empty Customers */}
            <CardWrapper number={5} title="Empty Customers">
              <EmptyState type="customers" onPrimaryAction={() => alert('Create Customer')} />
            </CardWrapper>

            {/* Card 6: Empty Quotations */}
            <CardWrapper number={6} title="Empty Quotations">
              <EmptyState type="quotations" onPrimaryAction={() => alert('Create Quote')} />
            </CardWrapper>

            {/* Card 7: Empty Projects */}
            <CardWrapper number={7} title="Empty Projects">
              <EmptyState type="projects" onPrimaryAction={() => alert('Create Project')} />
            </CardWrapper>

            {/* Card 8: Empty Search */}
            <CardWrapper number={8} title="Empty Search">
              <EmptyState type="search" />
            </CardWrapper>

            {/* Card 9: Offline Mode */}
            <CardWrapper number={9} title="Offline Mode">
              <OfflineStateCard />
            </CardWrapper>

            {/* Card 10: Low Data Mode */}
            <CardWrapper number={10} title="Low Data Mode">
              <LowDataStateCard />
            </CardWrapper>

            {/* Card 11: Slow Network */}
            <CardWrapper number={11} title="Slow Network">
              <SlowNetworkCard />
            </CardWrapper>

            {/* Card 12: Server Error */}
            <CardWrapper number={12} title="Server Error">
              <ServerErrorCard />
            </CardWrapper>

            {/* Card 13: 404 Not Found */}
            <CardWrapper number={13} title="404 Not Found">
              <NotFoundCard />
            </CardWrapper>

            {/* Card 14: Access Denied */}
            <CardWrapper number={14} title="Access Denied">
              <AccessDeniedCard />
            </CardWrapper>

            {/* Card 15: Session Expired */}
            <CardWrapper number={15} title="Session Expired">
              <SessionExpiredCard />
            </CardWrapper>

            {/* Card 16: Background Sync */}
            <CardWrapper number={16} title="Background Sync">
              <BackgroundSyncCard />
            </CardWrapper>

            {/* Card 17: File Upload */}
            <CardWrapper number={17} title="File Upload">
              <FileUploadCard />
            </CardWrapper>

            {/* Card 18: Print Generation */}
            <CardWrapper number={18} title="Print Generation">
              <PrintGenerationCard />
            </CardWrapper>

            {/* Card 19: Notifications Empty */}
            <CardWrapper number={19} title="Notifications Empty">
              <EmptyState type="notifications" />
            </CardWrapper>

            {/* Card 20: Reports Loading */}
            <CardWrapper number={20} title="Reports Loading">
              <div className="scale-90 transform-gpu -m-2">
                <ReportsLoadingSkeleton />
              </div>
            </CardWrapper>

            {/* Card 21: Analytics Loading */}
            <CardWrapper number={21} title="Analytics Loading">
              <div className="scale-90 transform-gpu -m-2">
                <AnalyticsLoadingSkeleton />
              </div>
            </CardWrapper>

            {/* Card 22: Settings Loading */}
            <CardWrapper number={22} title="Settings Loading">
              <div className="scale-90 transform-gpu -m-2">
                <SettingsLoadingSkeleton />
              </div>
            </CardWrapper>

            {/* Card 23: Search Loading */}
            <CardWrapper number={23} title="Search Loading">
              <SearchLoadingSkeleton />
            </CardWrapper>

            {/* Card 24: Maintenance Mode */}
            <CardWrapper number={24} title="Maintenance Mode">
              <MaintenanceCard />
            </CardWrapper>

            {/* Card 25: Success State */}
            <CardWrapper number={25} title="Success State">
              <SuccessStateCard />
            </CardWrapper>
          </div>

          {/* Micro Interactions & Interactive Controls Showcase */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Micro Interactions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {/* Feature List */}
              <div className="space-y-2 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00D9D9]" /> Hover Elevation
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00D9D9]" /> Smooth Transitions
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00D9D9]" /> Fade Animations
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00D9D9]" /> Skeleton Shimmer
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00D9D9]" /> Button Ripple
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00D9D9]" /> Animated Progress
                </div>
              </div>

              {/* Hover card demo */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center justify-center text-center cursor-pointer">
                <span className="text-xs font-bold text-slate-800">Hover Me</span>
                <span className="text-[10px] text-slate-400 font-medium">Elevation Effect</span>
              </div>

              {/* Button Ripple demo */}
              <div className="flex flex-col items-center justify-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Button Ripple</span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setRippled(true);
                    setTimeout(() => setRippled(false), 500);
                  }}
                  className={rippled ? 'scale-95 transition-transform' : ''}
                >
                  Click Me
                </Button>
              </div>

              {/* Progress animation demo */}
              <div className="flex flex-col justify-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Progress Animation</span>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-gradient-to-r from-[#00D9D9] to-[#00B8B8] rounded-full transition-all duration-300"
                    style={{ width: `${progressVal}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400 font-bold">
                  <button onClick={() => setProgressVal(25)} className="hover:text-slate-700">
                    25%
                  </button>
                  <button onClick={() => setProgressVal(72)} className="hover:text-slate-700">
                    72%
                  </button>
                  <button onClick={() => setProgressVal(100)} className="hover:text-slate-700">
                    100%
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CardWrapperProps {
  number: number;
  title: string;
  children: React.ReactNode;
}

const CardWrapper: React.FC<CardWrapperProps> = ({ number, title, children }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3 flex flex-col justify-between hover:border-cyan-300 transition-colors">
    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
      <span className="w-5 h-5 rounded-md bg-cyan-50 border border-cyan-200 text-[#00B8B8] font-mono text-[10px] font-black flex items-center justify-center">
        {number}
      </span>
      <h4 className="text-xs font-bold text-slate-900 truncate">{title}</h4>
    </div>
    <div className="flex-1 flex items-center justify-center">{children}</div>
  </div>
);
