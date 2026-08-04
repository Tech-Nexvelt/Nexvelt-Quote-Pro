import React from 'react';
import { Link } from 'react-router-dom';
import { LegalLayout, LEGAL_PAGES } from './LegalLayout';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  FileText, 
  RefreshCcw, 
  Cookie, 
  ShieldAlert, 
  Server, 
  Mail,
  CheckCircle2,
  Building2,
  Cpu,
  Globe2
} from 'lucide-react';

export const LegalCenterPage: React.FC = () => {
  useDocumentTitle('Nexvelt Quote Pro | Legal & Trust Center');

  // Filter out the Hub card itself for the grid list
  const policyCards = LEGAL_PAGES.filter(p => p.path !== '/legal');

  return (
    <LegalLayout>
      <div className="space-y-12 select-none">
        
        {/* Top Hero Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          
          {/* Subtle Background Accent Pattern */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#00D9D9]/10 to-transparent pointer-events-none" />
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#00D9D9]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#00D9D9]/15 text-[#00D9D9] border border-[#00D9D9]/30 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#00D9D9]" />
              <span>Enterprise SaaS Governance & Transparency</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
              Legal, Privacy & Trust Center
            </h1>

            <p className="text-slate-300 text-sm sm:text-base font-medium leading-relaxed">
              Welcome to the official Nexvelt Quote Pro Legal Center. We are committed to complete transparency, robust data protection, clear commercial terms, and enterprise-grade security for your business.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-300 font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00D9D9]" />
                <span>Commercial B2B SaaS Standards</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#00D9D9]" />
                <span>Customer Data Ownership Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-[#00D9D9]" />
                <span>Last Updated: July 29, 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Policies Grid (7 Cards) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Legal Policies & Documentation</h2>
              <p className="text-xs text-slate-600 font-semibold mt-0.5">Explore our binding terms, data privacy practices, and compliance commitments.</p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              7 Active Governance Documents
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {policyCards.map((card) => {
              const IconComponent = card.icon;
              return (
                <Link
                  key={card.path}
                  to={card.path}
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs hover:shadow-md hover:border-[#00D9D9] transition-all group flex flex-col justify-between space-y-6 cursor-pointer"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-[#E6F7F7] border border-[#00D9D9]/30 flex items-center justify-center text-[#008080] group-hover:bg-[#00D9D9] group-hover:text-white transition-colors">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#008080] bg-[#E6F7F7] px-2.5 py-1 rounded-md border border-[#00D9D9]/20">
                        {card.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#008080] transition-colors flex items-center gap-1.5">
                        <span>{card.title}</span>
                      </h3>
                      <p className="text-xs font-medium text-slate-600 leading-relaxed mt-2">
                        {card.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-[#008080]">
                    <span>View Policy</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Enterprise Commitment Summary Banner */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black">
              100%
            </div>
            <h4 className="text-sm font-extrabold text-slate-900">Customer Data Ownership</h4>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              You retain full ownership of all uploaded quotes, rates, customer data, and material catalog records.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#00D9D9] text-slate-950 flex items-center justify-center font-black">
              256
            </div>
            <h4 className="text-sm font-extrabold text-slate-900">Enterprise Encryption</h4>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              All communications and stored operational databases are encrypted using modern HTTPS and secure protocols.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black">
              0%
            </div>
            <h4 className="text-sm font-extrabold text-slate-900">Zero Data Monetisation</h4>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              We never sell, trade, rent, or share your proprietary quotation pricing or client details with third parties.
            </p>
          </div>
        </div>

      </div>
    </LegalLayout>
  );
};
