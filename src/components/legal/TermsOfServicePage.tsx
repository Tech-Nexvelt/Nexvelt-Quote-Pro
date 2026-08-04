import React from 'react';
import { LegalLayout } from './LegalLayout';
import { LegalSidebarTOC, TOCSection } from './LegalSidebarTOC';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { FileText, AlertTriangle, ShieldCheck, CheckCircle2, Building2 } from 'lucide-react';

const TOC_SECTIONS: TOCSection[] = [
  { id: 'sec-intro', title: '1. Introduction' },
  { id: 'sec-acceptance', title: '2. Acceptance of Terms' },
  { id: 'sec-eligibility', title: '3. Eligibility' },
  { id: 'sec-account', title: '4. Account Registration & Security' },
  { id: 'sec-license', title: '5. Software License Grant' },
  { id: 'sec-subscriptions', title: '6. Subscriptions & Payments' },
  { id: 'sec-responsibilities', title: '7. User Responsibilities & Accuracy Disclaimer' },
  { id: 'sec-[#00B8B8]', title: '8. Acceptable Use' },
  { id: 'sec-ip', title: '9. Intellectual Property' },
  { id: 'sec-data', title: '10. Customer Data Ownership' },
  { id: 'sec-thirdparty', title: '11. Third-Party Services' },
  { id: 'sec-maintenance', title: '12. Maintenance & Service Availability' },
  { id: 'sec-disclaimer', title: '13. Disclaimer of Warranties' },
  { id: 'sec-liability', title: '14. Limitation of Liability' },
  { id: 'sec-indemnification', title: '15. Indemnification' },
  { id: 'sec-termination', title: '16. Termination' },
  { id: 'sec-forcemajeure', title: '17. Force Majeure' },
  { id: 'sec-governing', title: '18. Governing Law & Dispute Resolution' },
  { id: 'sec-changes', title: '19. Changes to Terms' },
  { id: 'sec-contact', title: '20. Contact Information' },
];

export const TermsOfServicePage: React.FC = () => {
  useDocumentTitle('Nexvelt Quote Pro | Terms of Service');

  return (
    <LegalLayout>
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Main Content Area */}
        <div className="flex-1 min-w-0 max-w-4xl space-y-10">
          
          {/* Header Banner */}
          <div className="border-b border-slate-200 pb-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#008080] uppercase tracking-wider bg-[#E6F7F7] px-3 py-1 rounded-md border border-[#00D9D9]/30 w-fit">
              <FileText className="w-4 h-4 text-[#00B8B8]" />
              <span>Commercial SaaS Agreement</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Terms of Service
            </h1>

            <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-3xl">
              These Terms of Service ("Terms") govern your access to and commercial use of the Nexvelt Quote Pro software application, services, and associated platforms provided by Nexvelt Technologies.
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-500 font-semibold pt-2">
              <span>Last Updated: July 29, 2026</span>
              <span>•</span>
              <span>Effective Date: Immediate</span>
            </div>
          </div>

          {/* Policy Document Content */}
          <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-10">
            
            {/* Section 1 */}
            <section id="sec-intro" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                1. Introduction
              </h2>
              <p>
                Welcome to <strong>Nexvelt Quote Pro</strong>, a specialized commercial B2B Software-as-a-Service (SaaS) platform developed and operated by <strong>Nexvelt Technologies</strong> ("Nexvelt", "Company", "We", "Us", or "Our"). Nexvelt Quote Pro provides furniture manufacturers, interior contractors, interior designers, carpenters, and commercial dealers with tools for modular quotation building, dimension calculation, material pricing, and client estimation management.
              </p>
              <p>
                By registering for, accessing, or using Nexvelt Quote Pro, you ("Customer", "User", "You", or "Your") enter into a legally binding agreement with Nexvelt Technologies and agree to comply with all provisions set forth in these Terms of Service.
              </p>
            </section>

            {/* Section 2 */}
            <section id="sec-acceptance" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                2. Acceptance of Terms
              </h2>
              <p>
                By creating an account, selecting a subscription plan, or utilizing any feature of Nexvelt Quote Pro, you confirm that you have read, understood, and agreed to be bound by these Terms, as well as our Privacy Policy, Refund Policy, Acceptable Use Policy, and Data Security Policy.
              </p>
              <p>
                If you are entering into these Terms on behalf of a company, partnership, or other legal entity, you represent and warrant that you have full legal authority to bind such entity to these Terms. If you do not have such authority or do not agree with any part of these Terms, you must not access or use the software.
              </p>
            </section>

            {/* Section 3 */}
            <section id="sec-eligibility" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                3. Eligibility
              </h2>
              <p>
                Nexvelt Quote Pro is strictly designed for commercial business entity use and professional trade usage. To register and use the service, you must be at least 18 years of age or the age of legal majority in your legal jurisdiction, and capable of forming legally binding commercial contracts under applicable law.
              </p>
            </section>

            {/* Section 4 */}
            <section id="sec-account" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                4. Account Registration & Security
              </h2>
              <p>
                To access Nexvelt Quote Pro, you must register a business account by providing true, accurate, current, and complete information including your full name, business name, valid email address, contact phone number, and commercial details.
              </p>
              <p>
                You are solely responsible for maintaining the confidentiality of your login credentials (username, password, PINs) and for all activities that occur under your account. You agree to immediately notify Nexvelt Technologies of any unauthorized access or security breach regarding your credentials.
              </p>
            </section>

            {/* Section 5 */}
            <section id="sec-license" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                5. Commercial Software License Grant
              </h2>
              <p>
                Subject to your compliance with these Terms and payment of applicable subscription fees, Nexvelt Technologies grants you a non-exclusive, non-transferable, non-sublicensable, revocable, limited license to access and use Nexvelt Quote Pro via web web browser or authorized client interface strictly for your internal business operations.
              </p>
            </section>

            {/* Section 6 */}
            <section id="sec-subscriptions" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                6. Subscriptions & Payments
              </h2>
              <p>
                Access to Nexvelt Quote Pro is provided on a subscription basis or commercial plan as specified during purchase. Subscription fees are billed in advance on a recurring monthly or annual schedule depending on your chosen plan. All prices are exclusive of applicable taxes (including GST/VAT), which shall be calculated and charged where required by law.
              </p>
            </section>

            {/* Section 7 - MANDATORY DETAILED DISCLAIMER */}
            <section id="sec-responsibilities" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                7. User Responsibilities & Verification Disclaimer
              </h2>
              
              <div className="bg-[#FFFBEB] border-2 border-amber-400/80 rounded-2xl p-6 space-y-3 text-amber-950 shadow-xs">
                <div className="flex items-center gap-2 font-extrabold text-sm text-amber-900 uppercase">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>Important Commercial & Quotation Responsibility Notice</span>
                </div>
                <p className="font-semibold text-xs leading-relaxed">
                  <strong>Nexvelt Quote Pro is a software platform designed to assist users in creating quotations and managing business operations.</strong> The customer is solely and exclusively responsible for reviewing, verifying, and confirming all generated quotations, mathematical calculations, measurements, pricing models, tax schedules, and business documents before issuing them to clients or relying on them for commercial commitments.
                </p>
              </div>

              <p className="font-bold text-slate-900">
                Without limiting the generality of the foregoing, Users are solely and exclusively responsible for verifying:
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-0 list-none">
                {[
                  'Physical Site Measurements & Dimensions',
                  'Unit Material Rates & Hardware Costs',
                  'Pricing Formulas & Labour Calculations',
                  'Taxes, Duties & GST/VAT Schedules',
                  'Quotation Completeness & Accuracy',
                  'Project Specifications & Client Details',
                  'Uploaded Specifications & Documents',
                  'Commercial Bidding & Business Decisions'
                ].map((item, idx) => (
                  <li key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-2 font-semibold text-xs text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-[#00B8B8] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <p className="text-slate-600 text-xs leading-relaxed">
                Nexvelt Technologies shall have zero legal or financial liability for any quotation errors, mathematical mismatches, incorrect measurements, unapplied tax rates, underquoted job estimates, profit margin losses, or commercial disputes arising between the Customer and third-party end clients.
              </p>
            </section>

            {/* Section 8 */}
            <section id="sec-[#00B8B8]" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                8. Acceptable Use
              </h2>
              <p>
                You agree to use Nexvelt Quote Pro only for lawful commercial purposes. You must comply with our <a href="/legal/acceptable-use" className="text-[#00B8B8] font-bold underline">Acceptable Use Policy</a>. Reverse engineering, security probing, automated scraping, malware distribution, or unauthorized account access is strictly prohibited.
              </p>
            </section>

            {/* Section 9 */}
            <section id="sec-ip" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                9. Intellectual Property
              </h2>
              <p>
                Nexvelt Technologies retains all rights, title, and interest in and to Nexvelt Quote Pro, including all software code, visual UI elements, design systems, algorithms, documentation, trademarks, and brand assets. Nothing in these Terms grants you any ownership rights in the platform.
              </p>
            </section>

            {/* Section 10 */}
            <section id="sec-data" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                10. Customer Data Ownership
              </h2>
              <p>
                You retain full and complete ownership of all business data, customer records, quotation line items, project dimensions, material rates, and files created or uploaded by you within Nexvelt Quote Pro. Please refer to our <a href="/legal/data-security" className="text-[#00B8B8] font-bold underline">Data Security Policy</a> for complete details.
              </p>
            </section>

            {/* Section 11 */}
            <section id="sec-thirdparty" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                11. Third-Party Services
              </h2>
              <p>
                Nexvelt Quote Pro may integrate with or utilize third-party cloud infrastructure, payment gateways, or notification services. We are not responsible for third-party service interruptions outside our direct control.
              </p>
            </section>

            {/* Section 12 */}
            <section id="sec-maintenance" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                12. Maintenance, Updates & Service Availability
              </h2>
              <p>
                We perform routine maintenance, security upgrades, and feature enhancements to ensure system reliability. While we strive to maintain high service availability, service may occasionally be interrupted for scheduled or emergency maintenance.
              </p>
            </section>

            {/* Section 13 */}
            <section id="sec-disclaimer" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                13. Disclaimer of Warranties
              </h2>
              <p className="uppercase text-xs font-bold text-slate-500">
                NEXVELT QUOTE PRO IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
              </p>
            </section>

            {/* Section 14 */}
            <section id="sec-liability" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                14. Limitation of Liability
              </h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL NEXVELT TECHNOLOGIES, ITS DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, OR BUSINESS OPPORTUNITY ARISING OUT OF OR IN CONNECTION WITH THE SOFTWARE.
              </p>
            </section>

            {/* Section 15 */}
            <section id="sec-indemnification" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                15. Indemnification
              </h2>
              <p>
                You agree to indemnify, defend, and hold harmless Nexvelt Technologies and its officers from any claims, liabilities, damages, losses, and expenses (including legal fees) arising out of your breach of these Terms, misuse of the service, or customer quotations issued to end clients.
              </p>
            </section>

            {/* Section 16 */}
            <section id="sec-termination" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                16. Termination
              </h2>
              <p>
                You may terminate your account at any time by contacting support or cancelling your active subscription. Nexvelt Technologies reserves the right to suspend or terminate accounts in cases of non-payment, legal violation, or breach of these Terms.
              </p>
            </section>

            {/* Section 17 */}
            <section id="sec-forcemajeure" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                17. Force Majeure
              </h2>
              <p>
                Neither party shall be liable for failure or delay in performance caused by circumstances beyond reasonable control, including acts of God, natural disasters, telecommunications outages, government actions, or major internet infrastructure failures.
              </p>
            </section>

            {/* Section 18 */}
            <section id="sec-governing" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                18. Governing Law & Dispute Resolution
              </h2>
              <p>
                These Terms shall be governed by and construed in accordance with the commercial laws of India. Any legal dispute or claim arising out of these Terms shall be subject to the exclusive jurisdiction of the competent commercial courts in Hyderabad, Telangana, India.
              </p>
            </section>

            {/* Section 19 */}
            <section id="sec-changes" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                19. Changes to Terms
              </h2>
              <p>
                We reserve the right to update these Terms from time to time. When changes are made, we will update the "Last Updated" date at the top of this page. Continued use of Nexvelt Quote Pro after updates constitutes acceptance of the revised Terms.
              </p>
            </section>

            {/* Section 20 */}
            <section id="sec-contact" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                20. Legal Contact Information
              </h2>
              <p>
                For legal inquiries, contract clarifications, or formal notices regarding these Terms, please contact Nexvelt Technologies at:
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2 font-medium">
                <div className="font-extrabold text-slate-900">Nexvelt Technologies — Legal & Compliance Dept.</div>
                <div>Product: Nexvelt Quote Pro</div>
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
