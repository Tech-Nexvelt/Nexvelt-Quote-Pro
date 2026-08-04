import React from 'react';
import { LegalLayout } from './LegalLayout';
import { LegalSidebarTOC, TOCSection } from './LegalSidebarTOC';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Server, ShieldCheck, Lock, CheckCircle2, XCircle, Database, Key, HardDrive, RefreshCw } from 'lucide-react';

const TOC_SECTIONS: TOCSection[] = [
  { id: 'sec-ownership', title: '1. Data Ownership Rights' },
  { id: 'sec-usage', title: '2. Data Usage Principles (ONLY List)' },
  { id: 'sec-non-monetisation', title: '3. Data Non-Monetisation (DO NOT List)' },
  { id: 'sec-technical-security', title: '4. Technical & Organizational Security' },
  { id: 'sec-sharing', title: '5. Data Sharing Policies' },
  { id: 'sec-rights', title: '6. Customer Control & Data Rights' },
  { id: 'sec-[#00B8B8]-practices', title: '7. Account Security Practices' },
  { id: 'sec-backups', title: '8. Backups & Disaster Recovery' },
  { id: 'sec-availability', title: '9. Service Availability & SLA' },
  { id: 'sec-contact', title: '10. Security Contact Information' },
];

export const DataSecurityPage: React.FC = () => {
  useDocumentTitle('Nexvelt Quote Pro | Data Security & Ownership');

  return (
    <LegalLayout>
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Main Content Area */}
        <div className="flex-1 min-w-0 max-w-4xl space-y-10">
          
          {/* Header Banner */}
          <div className="border-b border-slate-200 pb-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#008080] uppercase tracking-wider bg-[#E6F7F7] px-3 py-1 rounded-md border border-[#00D9D9]/30 w-fit">
              <Server className="w-4 h-4 text-[#00B8B8]" />
              <span>Data Protection & Ownership Architecture</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Data Security & Ownership Policy
            </h1>

            <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-3xl">
              Learn how Nexvelt Technologies safeguards your proprietary quotation data, protects your customer records, and guarantees complete data ownership.
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-500 font-semibold pt-2">
              <span>Last Updated: July 29, 2026</span>
              <span>•</span>
              <span>Architecture v3.2</span>
            </div>
          </div>

          {/* Document Content */}
          <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-10">
            
            {/* Section 1 - DATA OWNERSHIP */}
            <section id="sec-ownership" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                1. Data Ownership Rights
              </h2>
              
              <div className="bg-[#E6F7F7] border border-[#00D9D9]/40 rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-2 font-extrabold text-[#008080] text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-5 h-5 text-[#00B8B8]" />
                  <span>100% Customer Ownership Commitment</span>
                </div>
                <p className="text-slate-900 text-xs sm:text-sm font-bold leading-relaxed">
                  Customers retain full and exclusive ownership of all data created, uploaded, processed, or stored within Nexvelt Quote Pro. Nexvelt Technologies does not claim any ownership rights over your business data.
                </p>

                <p className="text-xs text-slate-700 font-medium pt-1">This complete ownership includes:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-0 list-none pt-1">
                  {[
                    'Customer Records & Contact Information',
                    'Quotation Data & Estimation History',
                    'Custom Products & Module Configurations',
                    'Interior Projects & Room Layouts',
                    'Material Libraries & Rate Catalogs',
                    'Company Information, Logotypes & Taglines',
                    'Unit Pricing, Discounts & Profit Margins',
                    'Custom PDF Templates & Business Documents'
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white p-2.5 rounded-xl border border-[#00D9D9]/30 flex items-center gap-2 text-xs font-bold text-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#008080] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 2 - DATA USAGE ONLY LIST */}
            <section id="sec-usage" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                2. Data Usage Principles (Exclusive Purpose List)
              </h2>
              <p className="font-extrabold text-slate-900">
                Customer information and business data are used ONLY for the following operational purposes:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Providing the Nexvelt Quote Pro platform',
                  'Maintaining customer accounts & access',
                  'Generating calculations & PDF quotations',
                  'Providing requested software features',
                  'Delivering direct customer support',
                  'Software maintenance & platform updates',
                  'Enforcing platform security & integrity',
                  'Improving software performance & reliability'
                ].map((purpose, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-2 text-xs font-semibold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-[#00B8B8] shrink-0" />
                    <span>{purpose}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3 - DATA NON MONETISATION */}
            <section id="sec-non-monetisation" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                3. Data Non-Monetisation Guarantees
              </h2>

              <div className="bg-red-50/70 border border-red-200 rounded-2xl p-5 space-y-3 text-xs font-bold text-red-950">
                <h4 className="font-black text-red-900 uppercase tracking-wider">Our Strict Commercial Guarantees:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-600 shrink-0" /><span>We DO NOT sell customer data under any circumstances.</span></li>
                  <li className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-600 shrink-0" /><span>We DO NOT rent or trade customer data.</span></li>
                  <li className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-600 shrink-0" /><span>We DO NOT use quotation information for advertising or marketing.</span></li>
                  <li className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-600 shrink-0" /><span>We DO NOT use customer pricing information for commercial marketing.</span></li>
                  <li className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-600 shrink-0" /><span>We DO NOT use customer business information for unrelated commercial purposes.</span></li>
                </ul>
              </div>
            </section>

            {/* Section 4 - TECHNICAL SECURITY MEASURES */}
            <section id="sec-technical-security" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                4. Technical & Organizational Security Measures
              </h2>
              <p>
                We implement comprehensive technical and organizational controls to protect customer information from unauthorized access, alteration, or disclosure:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-2 font-extrabold text-slate-900 text-xs">
                    <Lock className="w-4 h-4 text-[#00B8B8]" />
                    <span>Encrypted HTTPS Communication</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">All data transmitted between your browser and our servers is encrypted using 256-bit SSL/TLS HTTPS protocols.</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-2 font-extrabold text-slate-900 text-xs">
                    <Key className="w-4 h-4 text-[#00B8B8]" />
                    <span>Secure Authentication</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">Salted password hashing, owner PIN security modes, and secure session management prevent unauthorized account access.</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-2 font-extrabold text-slate-900 text-xs">
                    <Database className="w-4 h-4 text-[#00B8B8]" />
                    <span>Secure Cloud Infrastructure</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">Hosted in enterprise cloud environments featuring firewall isolation, intrusion detection, and access controls.</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-2 font-extrabold text-slate-900 text-xs">
                    <HardDrive className="w-4 h-4 text-[#00B8B8]" />
                    <span>Software & Security Updates</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">Continuous vulnerability patching, automated dependency updates, and platform security hardening.</p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="sec-sharing" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                5. Data Sharing Policies
              </h2>
              <p>
                Customer information is never shared with third parties except under the following strict conditions:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700 font-medium">
                <li>To provide requested software services (e.g., cloud storage infrastructure or payment processors).</li>
                <li>To comply with mandatory legal obligations or valid government subpoenas under applicable law.</li>
                <li>With explicit customer consent or authorization.</li>
                <li>With trusted service providers acting on Nexvelt's behalf under strict binding confidentiality obligations.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section id="sec-rights" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                6. Customer Data Control & Rights
              </h2>
              <p className="font-semibold text-slate-800">
                Customers maintain total administrative control over their data:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">• Access & view all stored workspace data</div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">• Update & edit business details instantly</div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">• Correct inaccurate customer records</div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">• Download & export backup data formats</div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl sm:col-span-2">• Request complete account & data deletion</div>
              </div>
            </section>

            {/* Section 7 */}
            <section id="sec-[#00B8B8]-practices" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                7. Recommended Account Security Practices
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                To maximize security, we recommend that users utilize strong unique passwords, maintain secure credential management, enable Owner PIN protection for financial rates, and report any unauthorized access immediately.
              </p>
            </section>

            {/* Section 8 */}
            <section id="sec-backups" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                8. Backups & Service Continuity
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Automated background backups may be performed across system databases to enhance service continuity, protect against catastrophic hardware failures, and support disaster recovery.
              </p>
            </section>

            {/* Section 9 */}
            <section id="sec-availability" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                9. Service Availability & Maintenance
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Reasonable commercial efforts are made to maintain continuous platform availability. Occasional scheduled maintenance or emergency updates may cause transient unavailability.
              </p>
            </section>

            {/* Section 10 */}
            <section id="sec-contact" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                10. Security Team Contact Information
              </h2>
              <p>
                For security inquiries, vulnerability reporting, or data protection questions, please contact:
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-1 font-medium text-xs">
                <div className="font-extrabold text-slate-900">Nexvelt Technologies — Information Security Office</div>
                <div>Product: Nexvelt Quote Pro</div>
                <div>Security Email: <a href="mailto:nexvelt2013@gmail.com" className="text-[#00B8B8] font-bold underline">nexvelt2013@gmail.com</a></div>
                <div>Urgent Security Response SLA: Within 12-24 Hours</div>
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
