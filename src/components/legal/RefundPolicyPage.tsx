import React from 'react';
import { LegalLayout } from './LegalLayout';
import { LegalSidebarTOC, TOCSection } from './LegalSidebarTOC';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { RefreshCcw, AlertCircle, XCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

const TOC_SECTIONS: TOCSection[] = [
  { id: 'sec-overview', title: '1. Commercial Product Overview' },
  { id: 'sec-instant', title: '2. Immediate Access & Finality' },
  { id: 'sec-nonrefundable', title: '3. Non-Refundable Circumstances (Complete List)' },
  { id: 'sec-cancellation', title: '4. Subscription Cancellation Terms' },
  { id: 'sec-exceptions', title: '5. Exceptional Billing Circumstances' },
  { id: 'sec-[#00B8B8]', title: '6. Mandatory Statutory Consumer Rights' },
  { id: 'sec-contact', title: '7. Billing & Commercial Enquiries' },
];

export const REFUND_REASONS = [
  'Change of Mind',
  'Loss of Interest',
  'Failure to Use the Software',
  'Business Closure',
  'Change in Business Plans',
  'Wrong Subscription Selection',
  'Purchasing by Mistake',
  'Failure to Read Product Features',
  'Failure to Read Policies',
  'Internet Connectivity Issues',
  'Device Compatibility Issues',
  'Personal Preference',
  'Customer Decision',
  'Business Performance Expectations',
  'Technical Knowledge Requirements',
  'Training Requirements',
  'Any reason based solely on a customer\'s personal decision after purchase'
];

export const RefundPolicyPage: React.FC = () => {
  useDocumentTitle('Nexvelt Quote Pro | Refund Policy');

  return (
    <LegalLayout>
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Main Content Area */}
        <div className="flex-1 min-w-0 max-w-4xl space-y-10">
          
          {/* Header Banner */}
          <div className="border-b border-slate-200 pb-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-extrabold text-amber-800 uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-md border border-amber-300 w-fit">
              <RefreshCcw className="w-4 h-4 text-amber-600" />
              <span>Commercial Terms & Cancellation Governance</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Refund & Cancellation Policy
            </h1>

            <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-3xl">
              This Commercial Refund Policy governs all software licenses, subscription purchases, and digital feature access provided by Nexvelt Technologies for Nexvelt Quote Pro.
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-500 font-semibold pt-2">
              <span>Last Updated: July 29, 2026</span>
              <span>•</span>
              <span>Commercial Term Ref: RF-2026</span>
            </div>
          </div>

          {/* Document Content */}
          <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-10">
            
            {/* Section 1 */}
            <section id="sec-overview" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                1. Commercial Digital Product Overview
              </h2>
              <p>
                <strong>Nexvelt Quote Pro</strong> is a specialized commercial B2B digital software application. When you purchase a subscription or digital software plan, access to our estimation engines, calculation formulas, catalog databases, and PDF quote generation features is unlocked immediately for your registered business account.
              </p>
            </section>

            {/* Section 2 */}
            <section id="sec-instant" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                2. Immediate Provisioning & Finality of Purchases
              </h2>
              
              <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-3 shadow-md">
                <div className="flex items-center gap-2 font-extrabold text-xs text-[#00D9D9] uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-[#00D9D9]" />
                  <span>Immediate Digital Delivery Notice</span>
                </div>
                <p className="text-slate-200 text-xs sm:text-sm font-semibold leading-relaxed">
                  Because software access and digital workspace tools are provisioned immediately upon successful transaction completion, all subscription payments, renewal fees, and software purchases are <strong>FINAL and NON-REFUNDABLE</strong> except as explicitly outlined in Section 5 of this policy.
                </p>
              </div>
            </section>

            {/* Section 3 - MANDATORY COMPLETE REFUND REASONS LIST */}
            <section id="sec-nonrefundable" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                3. Non-Refundable Circumstances (Explicit Exclusion List)
              </h2>
              <p className="font-semibold text-slate-900">
                To prevent commercial ambiguity, refunds are strictly NOT provided for any of the following circumstances:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {REFUND_REASONS.map((reason, idx) => (
                  <div key={idx} className="bg-red-50/60 border border-red-200/80 p-3 rounded-xl flex items-start gap-2 text-xs font-bold text-red-950">
                    <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 4 */}
            <section id="sec-cancellation" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                4. Subscription Renewal & Cancellation Terms
              </h2>
              <p>
                Customers may cancel their subscription auto-renewal at any time prior to the next billing date directly through the workspace Account Settings or by contacting customer support.
              </p>

              <div className="bg-[#E6F7F7] border border-[#00D9D9]/40 p-4 rounded-2xl space-y-2 text-xs text-slate-800">
                <div className="font-extrabold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#008080]" />
                  <span>Cancellation Principles:</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 font-medium text-slate-700">
                  <li><strong>Future Billing Protection:</strong> Cancellation prevents all future recurring renewal charges.</li>
                  <li><strong>Continued Access:</strong> You retain full platform access until the end of your currently paid billing period.</li>
                  <li><strong>No Retroactive Refund:</strong> Cancellation stops future billing but does NOT refund subscription payments already processed for the active period.</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section id="sec-exceptions" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                5. Exceptional Billing Circumstances
              </h2>
              <p>
                In rare technical instances involving proven duplicate charges, system billing errors, or payment gateway glitches, Nexvelt Technologies may review refund requests on a case-by-case basis at its sole commercial discretion.
              </p>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1 text-xs text-slate-600 font-medium">
                <div>• Duplicate payment for the same account resulting from a network timeout.</div>
                <div>• Billing error where an incorrect plan fee was processed due to a platform glitch.</div>
                <div className="text-[11px] text-slate-500 pt-1">All exceptional refund claims must be submitted to <strong>nexvelt2013@gmail.com</strong> within 7 business days of the charge.</div>
              </div>
            </section>

            {/* Section 6 */}
            <section id="sec-[#00B8B8]" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                6. Mandatory Statutory Consumer Rights
              </h2>
              <p className="font-semibold text-slate-800">
                Nothing in this Refund Policy is intended to exclude, restrict, or modify any mandatory statutory legal rights that cannot be excluded or limited under applicable jurisdiction laws.
              </p>
            </section>

            {/* Section 7 */}
            <section id="sec-contact" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                7. Billing & Commercial Enquiries
              </h2>
              <p>
                For questions regarding invoices, billing statements, or subscription cancellations, please contact:
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-1 font-medium">
                <div className="font-extrabold text-slate-900">Nexvelt Technologies — Commercial Billing Dept.</div>
                <div>Email: <a href="mailto:nexvelt2013@gmail.com" className="text-[#00B8B8] font-bold underline">nexvelt2013@gmail.com</a></div>
                <div>Business Hours: Monday – Saturday, 9:00 AM – 6:00 PM IST</div>
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
