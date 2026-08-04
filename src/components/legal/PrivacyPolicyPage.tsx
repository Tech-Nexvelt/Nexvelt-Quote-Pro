import React from 'react';
import { LegalLayout } from './LegalLayout';
import { LegalSidebarTOC, TOCSection } from './LegalSidebarTOC';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Lock, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';

const TOC_SECTIONS: TOCSection[] = [
  { id: 'sec-intro', title: '1. Introduction' },
  { id: 'sec-[#00B8B8]', title: '2. Information We Collect' },
  { id: 'sec-[#00B8B8]-usage', title: '3. How We Use Data (ONLY List)' },
  { id: 'sec-guarantees', title: '4. Data Non-Monetisation (DO NOT List)' },
  { id: 'sec-security', title: '5. Data Security & Storage' },
  { id: 'sec-retention', title: '6. Data Retention & Deletion' },
  { id: 'sec-rights', title: '7. Customer & User Rights' },
  { id: 'sec-cookies', title: '8. Cookies & Tracking' },
  { id: 'sec-contact', title: '9. Privacy Contact Information' },
];

export const PrivacyPolicyPage: React.FC = () => {
  useDocumentTitle('Nexvelt Quote Pro | Privacy Policy');

  return (
    <LegalLayout>
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Main Content Area */}
        <div className="flex-1 min-w-0 max-w-4xl space-y-10">
          
          {/* Header Banner */}
          <div className="border-b border-slate-200 pb-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#008080] uppercase tracking-wider bg-[#E6F7F7] px-3 py-1 rounded-md border border-[#00D9D9]/30 w-fit">
              <Lock className="w-4 h-4 text-[#00B8B8]" />
              <span>Data Protection & Privacy Standard</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Privacy Policy
            </h1>

            <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-3xl">
              Nexvelt Technologies is deeply committed to safeguarding the privacy and security of your business, client data, material pricing records, and quotation documents within Nexvelt Quote Pro.
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-500 font-semibold pt-2">
              <span>Last Updated: July 29, 2026</span>
              <span>•</span>
              <span>Privacy Version 2.4</span>
            </div>
          </div>

          {/* Document Content */}
          <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-10">
            
            {/* Section 1 */}
            <section id="sec-intro" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                1. Introduction
              </h2>
              <p>
                This Privacy Policy explains how <strong>Nexvelt Technologies</strong> ("Nexvelt", "We", "Us", or "Our") collects, uses, stores, protects, and handles information when you access or use <strong>Nexvelt Quote Pro</strong>. This policy applies to all registered business entities, trial users, and authorized team members accessing our commercial SaaS platform.
              </p>
            </section>

            {/* Section 2 */}
            <section id="sec-[#00B8B8]" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                2. Information We Collect
              </h2>
              <p>
                We collect only the minimum required business data necessary to deliver a seamless interior quotation and calculation experience:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1.5">
                  <h4 className="font-extrabold text-slate-900 text-xs">Account Information</h4>
                  <p className="text-xs text-slate-600 font-medium">User full name, work email address, phone number, encrypted password credentials, and account preference settings.</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1.5">
                  <h4 className="font-extrabold text-slate-900 text-xs">Company Information</h4>
                  <p className="text-xs text-slate-600 font-medium">Business entity name, GSTIN, business address, tagline, company logo, and quotation terms & conditions defaults.</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1.5">
                  <h4 className="font-extrabold text-slate-900 text-xs">Client & Quotation Data</h4>
                  <p className="text-xs text-slate-600 font-medium">Client contact records, project dimensions, room names, material catalogs, unit rates, discount rules, and quote history.</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1.5">
                  <h4 className="font-extrabold text-slate-900 text-xs">Usage & Device Information</h4>
                  <p className="text-xs text-slate-600 font-medium">Browser type, IP address, device operating system, session tokens, error logs, and platform interaction metrics.</p>
                </div>
              </div>
            </section>

            {/* Section 3 - MANDATORY ONLY LIST */}
            <section id="sec-[#00B8B8]-usage" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                3. How We Use Data (Exclusive Purpose List)
              </h2>
              
              <div className="bg-[#E6F7F7] border border-[#00D9D9]/40 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 font-extrabold text-xs text-[#008080] uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-[#00B8B8]" />
                  <span>Strict Commercial Purpose Bound Usage</span>
                </div>
                <p className="font-extrabold text-slate-900 text-xs leading-relaxed">
                  Customer information, business pricing, and quotation records are collected and processed ONLY for the following explicit operational purposes:
                </p>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-0 list-none pt-1">
                  {[
                    'Providing the software application & features',
                    'Maintaining customer business accounts',
                    'Generating calculations & client quotations',
                    'Delivering requested workspace features',
                    'Software performance & reliability updates',
                    'Maintaining platform security & fraud prevention',
                    'Providing direct customer technical support',
                    'Routine platform maintenance & backup ops'
                  ].map((purpose, idx) => (
                    <li key={idx} className="bg-white p-2.5 rounded-xl border border-[#00D9D9]/30 flex items-center gap-2 text-xs font-bold text-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#008080] shrink-0" />
                      <span>{purpose}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Section 4 - MANDATORY DO NOT LIST */}
            <section id="sec-guarantees" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                4. Data Non-Monetisation & Privacy Commitments
              </h2>
              
              <div className="bg-red-50/70 border border-red-200 rounded-2xl p-5 space-y-3">
                <h4 className="font-black text-xs text-red-900 uppercase tracking-wider">
                  We DO NOT engage in the following activities under any circumstances:
                </h4>

                <ul className="space-y-2 text-xs font-bold text-red-950">
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>We DO NOT sell customer business data or client records.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>We DO NOT rent or trade customer pricing information.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>We DO NOT share quotation details for third-party advertising or marketing.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>We DO NOT use customer business information for unrelated commercial purposes.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>We DO NOT access customer quotation data except when required to provide technical support, maintain the service, comply with legal obligations, or when authorized by the customer.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section id="sec-security" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                5. Data Security & Encryption
              </h2>
              <p>
                We employ industry-standard technical and organizational security measures to protect your information against unauthorized access, destruction, loss, or disclosure. All data in transit is encrypted using 256-bit SSL/TLS HTTPS protocols. Please review our <a href="/legal/data-security" className="text-[#00B8B8] font-bold underline">Data Security Policy</a> for architecture specifics.
              </p>
            </section>

            {/* Section 6 */}
            <section id="sec-retention" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                6. Data Retention & Deletion
              </h2>
              <p>
                We retain your account and quotation data for as long as your account remains active or as required to fulfill our legal and accounting obligations. Upon your explicit written request or account termination, we will permanently purge your workspace records in accordance with our deletion protocols.
              </p>
            </section>

            {/* Section 7 */}
            <section id="sec-rights" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                7. Customer & User Privacy Rights
              </h2>
              <p>
                You possess full rights regarding your stored business data, including the right to inspect, edit, export, or request deletion of your information at any time directly through your Nexvelt Quote Pro dashboard or by contacting our legal support.
              </p>
            </section>

            {/* Section 8 */}
            <section id="sec-cookies" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                8. Cookies & Tracking Technologies
              </h2>
              <p>
                We use essential session and authentication cookies strictly required for secure login and platform navigation. For complete details, see our <a href="/legal/cookie-policy" className="text-[#00B8B8] font-bold underline">Cookie Policy</a>.
              </p>
            </section>

            {/* Section 9 */}
            <section id="sec-contact" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                9. Privacy Officer Contact Information
              </h2>
              <p>
                If you have questions, concerns, or requests regarding this Privacy Policy or data privacy compliance, please email our Privacy Officer at:
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-1.5 font-medium">
                <div className="font-extrabold text-slate-900">Nexvelt Technologies — Data Privacy Office</div>
                <div>Email: <a href="mailto:nexvelt2013@gmail.com" className="text-[#00B8B8] font-bold underline">nexvelt2013@gmail.com</a></div>
                <div>Response Time: Within 24-48 Business Hours</div>
              </div>
            </section>

          </div>
        </div>

        {/* Sidebar Sticky TOC */}
        <LegalSidebarTOC sections={TOC_SECTIONS} lastUpdated="July 29, 2026" />

      </div>
    </LegalLayout>
  );
};
