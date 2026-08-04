import React from 'react';
import { LegalLayout } from './LegalLayout';
import { LegalSidebarTOC, TOCSection } from './LegalSidebarTOC';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { ShieldAlert, XCircle, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

const TOC_SECTIONS: TOCSection[] = [
  { id: 'sec-purpose', title: '1. Purpose & Scope' },
  { id: 'sec-prohibited', title: '2. Prohibited Activities (Explicit List)' },
  { id: 'sec-security-violations', title: '3. Security Attacks & Integrity Violations' },
  { id: 'sec-content-standards', title: '4. Content & Business Data Standards' },
  { id: 'sec-enforcement', title: '5. Monitoring, Enforcement & Account Suspension' },
  { id: 'sec-reporting', title: '6. Reporting Abuse & Violations' },
];

export const PROHIBITED_ACTIVITIES = [
  { title: 'Illegal Activities & Law Violations', desc: 'Using the platform for fraudulent trading, illicit transactions, or violating local, national, or international laws.' },
  { title: 'Fraud & Commercial Deception', desc: 'Issuing intentionally misleading or fraudulent quotations, deceptive pricing, or impersonating other business entities.' },
  { title: 'Identity Theft & Impersonation', desc: 'Registering accounts under false identities, stealing business credentials, or impersonating Nexvelt staff.' },
  { title: 'Spamming & Unsolicited Distribution', desc: 'Sending mass unsolicited commercial emails, abusive quote spam, or automated system requests.' },
  { title: 'Malware & Virus Dissemination', desc: 'Uploading, transmitting, or linking to viruses, Trojan horses, ransomware, spyware, or malicious code.' },
  { title: 'Reverse Engineering & Code Theft', desc: 'Attempting to decompile, disassemble, reverse engineer, or extract source code or calculation engines from Nexvelt Quote Pro.' },
  { title: 'Copyright & IP Infringement', desc: 'Uploading copyrighted designs, trademarked assets, or proprietary material templates without legal authorization.' },
  { title: 'Harassment & Abusive Behavior', desc: 'Transmitting abusive, defamatory, harassing, discriminatory, or offensive language within quotations or support channels.' },
  { title: 'Security Attacks & Probing', desc: 'Conducting unauthorized vulnerability scanning, penetration testing, denial-of-service (DoS) attacks, or security exploits.' },
  { title: 'Unauthorized Access & Authentication Bypass', desc: 'Attempting to access unauthorized accounts, bypass owner PIN locks, escalate user privileges, or crack login tokens.' },
  { title: 'Uploading Malicious Content', desc: 'Injecting cross-site scripting (XSS) payloads, SQL injection strings, or corrupted binary files into quotation forms.' },
  { title: 'System Compromise & Disruption', desc: 'Interfering with server infrastructure, overloading database workers, or compromising the availability of Nexvelt Quote Pro.' }
];

export const AcceptableUsePage: React.FC = () => {
  useDocumentTitle('Nexvelt Quote Pro | Acceptable Use Policy');

  return (
    <LegalLayout>
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Main Content Area */}
        <div className="flex-1 min-w-0 max-w-4xl space-y-10">
          
          {/* Header Banner */}
          <div className="border-b border-slate-200 pb-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-extrabold text-red-800 uppercase tracking-wider bg-red-50 px-3 py-1 rounded-md border border-red-200 w-fit">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>Platform Safety & Compliance Standard</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Acceptable Use Policy
            </h1>

            <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-3xl">
              This Acceptable Use Policy (AUP) defines the mandatory standards of conduct and prohibited activities for all users and subscribers of Nexvelt Quote Pro.
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-500 font-semibold pt-2">
              <span>Last Updated: July 29, 2026</span>
              <span>•</span>
              <span>Compliance Ref: AUP-2026</span>
            </div>
          </div>

          {/* Document Content */}
          <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-10">
            
            {/* Section 1 */}
            <section id="sec-purpose" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                1. Purpose & Scope
              </h2>
              <p>
                To maintain a secure, reliable, and trustworthy B2B quotation ecosystem for all furniture dealers, contractors, and interior professionals, Nexvelt Technologies enforces strict operational guidelines. By accessing Nexvelt Quote Pro, you agree to comply with all rules set forth in this policy.
              </p>
            </section>

            {/* Section 2 - PROHIBITED ACTIVITIES LIST */}
            <section id="sec-prohibited" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                2. Strictly Prohibited Activities (Explicit List)
              </h2>
              <p className="font-semibold text-slate-900">
                You are strictly prohibited from engaging in any of the following activities on or through Nexvelt Quote Pro:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PROHIBITED_ACTIVITIES.map((act, idx) => (
                  <div key={idx} className="bg-red-50/50 border border-red-200 p-4 rounded-2xl space-y-1.5">
                    <div className="flex items-center gap-2 font-extrabold text-xs text-red-950">
                      <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{act.title}</span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {act.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3 */}
            <section id="sec-security-violations" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                3. Security Attacks & Integrity Violations
              </h2>
              <p>
                Any attempt to breach platform security, probe infrastructure vulnerabilities, bypass authentication tokens, intercept web traffic, or disrupt platform availability will result in immediate permanent account termination and legal action.
              </p>
            </section>

            {/* Section 4 */}
            <section id="sec-content-standards" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                4. Content & Business Data Standards
              </h2>
              <p>
                You are solely responsible for all content, company details, customer records, and product information uploaded to your account. You warrant that all uploaded media and text comply with applicable intellectual property laws and commercial standards.
              </p>
            </section>

            {/* Section 5 */}
            <section id="sec-enforcement" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                5. Monitoring, Enforcement & Account Suspension
              </h2>
              <p>
                Nexvelt Technologies reserves the right, but not the obligation, to investigate reported violations of this policy. In the event of a verified violation, we reserve the right to suspend or permanently terminate account access, remove non-compliant data, and notify law enforcement authorities where appropriate.
              </p>
            </section>

            {/* Section 6 */}
            <section id="sec-reporting" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                6. Reporting Abuse & Violations
              </h2>
              <p>
                To report suspected security abuse, fraudulent activity, or violations of this Acceptable Use Policy, please contact our compliance desk immediately:
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-1 font-medium text-xs">
                <div className="font-extrabold text-slate-900">Nexvelt Technologies — Security & Abuse Compliance</div>
                <div>Email: <a href="mailto:nexvelt2013@gmail.com" className="text-[#00B8B8] font-bold underline">nexvelt2013@gmail.com</a></div>
                <div>Urgent Abuse Hotline: Active Mon-Sat 9:00 AM – 6:00 PM IST</div>
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
