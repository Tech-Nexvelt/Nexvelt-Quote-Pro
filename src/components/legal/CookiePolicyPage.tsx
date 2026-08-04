import React from 'react';
import { LegalLayout } from './LegalLayout';
import { LegalSidebarTOC, TOCSection } from './LegalSidebarTOC';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Cookie, ShieldCheck, CheckCircle2, Settings } from 'lucide-react';

const TOC_SECTIONS: TOCSection[] = [
  { id: 'sec-overview', title: '1. What Are Cookies?' },
  { id: 'sec-categories', title: '2. Cookie Categories We Use' },
  { id: 'sec-experience', title: '3. How Cookies Improve Experience' },
  { id: 'sec-management', title: '4. Managing Browser Cookie Settings' },
  { id: 'sec-updates', title: '5. Policy Updates & Contact' },
];

export const CookiePolicyPage: React.FC = () => {
  useDocumentTitle('Nexvelt Quote Pro | Cookie Policy');

  return (
    <LegalLayout>
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Main Content Area */}
        <div className="flex-1 min-w-0 max-w-4xl space-y-10">
          
          {/* Header Banner */}
          <div className="border-b border-slate-200 pb-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#008080] uppercase tracking-wider bg-[#E6F7F7] px-3 py-1 rounded-md border border-[#00D9D9]/30 w-fit">
              <Cookie className="w-4 h-4 text-[#00B8B8]" />
              <span>Technical Cookie & Session Governance</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Cookie Policy
            </h1>

            <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-3xl">
              This Cookie Policy explains how Nexvelt Quote Pro uses cookies, local storage, and session tokens to provide secure, fast, and reliable software functionality.
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-500 font-semibold pt-2">
              <span>Last Updated: July 29, 2026</span>
              <span>•</span>
              <span>Cookie Specification v1.8</span>
            </div>
          </div>

          {/* Document Content */}
          <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-10">
            
            {/* Section 1 */}
            <section id="sec-overview" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                1. What Are Cookies & Local Storage?
              </h2>
              <p>
                Cookies are small data files or encrypted session tokens placed on your computer or mobile device when you access <strong>Nexvelt Quote Pro</strong>. Local storage allows us to store user preferences, active quote drafts, and UI layout states locally within your web browser so you never lose ongoing quotation work.
              </p>
            </section>

            {/* Section 2 - DETAILED COOKIE CATEGORIES */}
            <section id="sec-categories" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                2. Cookie Categories Used in Nexvelt Quote Pro
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-900 text-sm">1. Essential Cookies</h4>
                    <span className="text-[10px] font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">Strictly Mandatory</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Necessary for core application functions such as page navigation, workspace routing, and security validation. The application cannot function properly without these.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-900 text-sm">2. Authentication Cookies</h4>
                    <span className="text-[10px] font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">Security</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Used to identify your authenticated user session, prevent unauthorized login attempts, and maintain secure access across workspace modules.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-900 text-sm">3. Session Cookies</h4>
                    <span className="text-[10px] font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">Temporary</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Temporary tokens that store current quote building states, active material selections, and calculation drawer preferences. Expire when you close your session.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-900 text-sm">4. Preference Cookies</h4>
                    <span className="text-[10px] font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">User Experience</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Remember your UI preferences such as sidebar collapse state, preferred dimension units (mm/inches), default discount settings, and dark/light mode.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-900 text-sm">5. Security Cookies</h4>
                    <span className="text-[10px] font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">Protection</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Used to detect Cross-Site Request Forgery (CSRF), verify owner PIN locks, and enforce security policies.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-900 text-sm">6. Performance & Analytics Cookies</h4>
                    <span className="text-[10px] font-extrabold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">Optional</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Aggregate non-identifying telemetry metrics to evaluate calculation speeds, error frequencies, and optimize application responsiveness.
                  </p>
                </div>

              </div>
            </section>

            {/* Section 3 */}
            <section id="sec-experience" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                3. How Cookies Improve Your Quote Building Experience
              </h2>
              <p>
                Cookies and local storage enable automatic draft saving, instant material price lookups, seamless session restoration after browser reloads, and quick export of PDF invoices without requiring re-authentication on every page.
              </p>
            </section>

            {/* Section 4 - BROWSER MANAGEMENT */}
            <section id="sec-management" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                4. Managing Browser Cookie Settings
              </h2>
              <p>
                Most modern web browsers accept cookies by default. You can manage or disable cookies through your browser settings. Please note that disabling essential cookies may prevent you from logging into Nexvelt Quote Pro or saving quotations.
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 text-xs">
                <div className="font-extrabold text-slate-900 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-[#00B8B8]" />
                  <span>How to adjust settings in major web browsers:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 font-medium">
                  <div>• <strong>Google Chrome:</strong> Settings &gt; Privacy and Security &gt; Cookies and other site data.</div>
                  <div>• <strong>Mozilla Firefox:</strong> Options &gt; Privacy &amp; Security &gt; Cookies and Site Data.</div>
                  <div>• <strong>Apple Safari:</strong> Preferences &gt; Privacy &gt; Manage Website Data.</div>
                  <div>• <strong>Microsoft Edge:</strong> Settings &gt; Cookies and Site Permissions.</div>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="sec-updates" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                5. Policy Updates & Support
              </h2>
              <p>
                If you have questions about our cookie usage, email us at <a href="mailto:nexvelt2013@gmail.com" className="text-[#00B8B8] font-bold underline">nexvelt2013@gmail.com</a>.
              </p>
            </section>

          </div>
        </div>

        {/* Sidebar Sticky TOC */}
        <LegalSidebarTOC sections={TOC_SECTIONS} lastUpdated="July 29, 2026" />

      </div>
    </LegalLayout>
  );
};
