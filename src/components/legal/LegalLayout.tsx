import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  FileText, 
  Lock, 
  RefreshCcw, 
  Cookie, 
  ShieldAlert, 
  Server, 
  Mail, 
  ArrowLeft,
  ChevronRight,
  Search,
  ExternalLink,
  Building2,
  CheckCircle2
} from 'lucide-react';

interface LegalLayoutProps {
  children: React.ReactNode;
  activePath?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const LEGAL_PAGES = [
  {
    path: '/legal',
    title: 'Legal Center',
    description: 'Overview of all legal policies, terms, data security, and compliance guidelines.',
    icon: ShieldCheck,
    badge: 'Hub',
  },
  {
    path: '/legal/terms-of-service',
    title: 'Terms of Service',
    description: 'Binding terms governing the usage of Nexvelt Quote Pro software & services.',
    icon: FileText,
    badge: 'Agreement',
  },
  {
    path: '/legal/privacy-policy',
    title: 'Privacy Policy',
    description: 'How we collect, protect, process, and respect customer and user data.',
    icon: Lock,
    badge: 'Privacy',
  },
  {
    path: '/legal/refund-policy',
    title: 'Refund Policy',
    description: 'Commercial terms regarding software access, renewals, and cancellations.',
    icon: RefreshCcw,
    badge: 'Commercial',
  },
  {
    path: '/legal/cookie-policy',
    title: 'Cookie Policy',
    description: 'Details on essential, session, authentication, and analytics cookies.',
    icon: Cookie,
    badge: 'Technical',
  },
  {
    path: '/legal/acceptable-use',
    title: 'Acceptable Use Policy',
    description: 'Rules and prohibited actions to ensure platform safety and security.',
    icon: ShieldAlert,
    badge: 'Compliance',
  },
  {
    path: '/legal/data-security',
    title: 'Data Security & Ownership',
    description: 'Customer data ownership rights, encryption, infrastructure, and protection.',
    icon: Server,
    badge: 'Security',
  },
  {
    path: '/legal/contact',
    title: 'Legal & Compliance Contact',
    description: 'Direct communication channels for legal inquiries, security, and support.',
    icon: Mail,
    badge: 'Support',
  },
];

export const LegalLayout: React.FC<LegalLayoutProps> = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const currentPolicy = LEGAL_PAGES.find(p => p.path === currentPath) || LEGAL_PAGES[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 flex flex-col select-none antialiased">
      {/* Top Utility Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Portal Branding */}
          <div className="flex items-center gap-3">
            <Link to="/legal" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <img
                src="/nexvelt_logo.png"
                alt="Nexvelt Logo"
                className="w-9 h-9 object-contain drop-shadow-sm"
              />
              <div className="leading-none">
                <span className="font-extrabold text-base tracking-tight text-slate-900 block">
                  Nexvelt Quote Pro
                </span>
                <span className="text-[10px] font-bold text-[#00B8B8] tracking-widest uppercase block mt-0.5">
                  LEGAL & TRUST CENTER
                </span>
              </div>
            </Link>
          </div>

          {/* Quick Nav & Back to App Button */}
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors border border-slate-200 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
              <span>Back to App</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Sub-Header Navigation Bar */}
      <div className="bg-slate-900 text-white border-b border-slate-800 py-3 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs overflow-x-auto no-scrollbar gap-6">
          <div className="flex items-center gap-1.5 text-slate-400 shrink-0 font-medium">
            <Link to="/legal" className="hover:text-white transition-colors">Legal Center</Link>
            {currentPath !== '/legal' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-[#00D9D9] font-bold">{currentPolicy.title}</span>
              </>
            )}
          </div>

          {/* Policy Tabs Pill Ribbon */}
          <div className="flex items-center gap-1 shrink-0">
            {LEGAL_PAGES.map((page) => {
              const isActive = currentPath === page.path;
              return (
                <Link
                  key={page.path}
                  to={page.path}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#00D9D9] text-slate-950 shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {page.title}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Legal Content Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {children}
      </main>

      {/* Enterprise Legal Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 text-xs text-slate-600 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Top Row: Brand & Security Statement */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-slate-100 pb-8">
            <div className="md:col-span-4 space-y-3">
              <div className="flex items-center gap-2.5">
                <img src="/nexvelt_logo.png" alt="Nexvelt Logo" className="w-7 h-7 object-contain" />
                <span className="font-extrabold text-sm text-slate-900">Nexvelt Technologies</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm font-medium">
                Nexvelt Quote Pro is a commercial B2B SaaS platform for interior furniture quotation, cost calculation, and production management.
              </p>
              <div className="flex items-center gap-2 text-[11px] font-bold text-[#008080] bg-[#E6F7F7] px-3 py-1 rounded-lg border border-[#00D9D9]/30 w-fit">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#008080]" />
                <span>Enterprise SaaS Compliance Standard</span>
              </div>
            </div>

            {/* Quick Links Column 1 */}
            <div className="md:col-span-4 space-y-2.5">
              <h4 className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wider">Legal Policies</h4>
              <ul className="space-y-1.5 font-medium text-slate-600">
                <li><Link to="/legal/terms-of-service" className="hover:text-[#00B8B8] transition-colors">Terms of Service</Link></li>
                <li><Link to="/legal/privacy-policy" className="hover:text-[#00B8B8] transition-colors">Privacy Policy</Link></li>
                <li><Link to="/legal/refund-policy" className="hover:text-[#00B8B8] transition-colors">Refund Policy</Link></li>
                <li><Link to="/legal/cookie-policy" className="hover:text-[#00B8B8] transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>

            {/* Quick Links Column 2 */}
            <div className="md:col-span-4 space-y-2.5">
              <h4 className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wider">Security & Governance</h4>
              <ul className="space-y-1.5 font-medium text-slate-600">
                <li><Link to="/legal/acceptable-use" className="hover:text-[#00B8B8] transition-colors">Acceptable Use Policy</Link></li>
                <li><Link to="/legal/data-security" className="hover:text-[#00B8B8] transition-colors">Data Security & Ownership</Link></li>
                <li><Link to="/legal/contact" className="hover:text-[#00B8B8] transition-colors">Legal & Compliance Contact</Link></li>
                <li><a href="mailto:nexvelt2013@gmail.com" className="hover:text-[#00B8B8] transition-colors flex items-center gap-1">nexvelt2013@gmail.com <ExternalLink className="w-3 h-3 text-slate-400" /></a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & Disclaimer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 font-medium">
            <p>© {new Date().getFullYear()} Nexvelt Technologies. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span className="text-[11px]">Commercial B2B SaaS License</span>
              <span className="text-[11px]">256-bit SSL Encrypted</span>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
};
