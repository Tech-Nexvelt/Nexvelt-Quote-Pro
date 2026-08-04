import React, { useState } from 'react';
import { LegalLayout } from './LegalLayout';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Mail, Building2, Clock, Send, CheckCircle2, ShieldCheck, Phone, MapPin, Globe } from 'lucide-react';

export const ContactLegalPage: React.FC = () => {
  useDocumentTitle('Nexvelt Quote Pro | Legal & Compliance Contact');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [subject, setSubject] = useState('Legal Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <LegalLayout>
      <div className="max-w-5xl mx-auto space-y-10 select-none">
        
        {/* Header Banner */}
        <div className="border-b border-slate-200 pb-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-extrabold text-[#008080] uppercase tracking-wider bg-[#E6F7F7] px-3 py-1 rounded-md border border-[#00D9D9]/30 w-fit">
            <Mail className="w-4 h-4 text-[#00B8B8]" />
            <span>Direct Commercial & Legal Communication Desk</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Contact Legal & Compliance
          </h1>

          <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-3xl">
            Have questions regarding our Terms of Service, Privacy Policy, Data Protection, or commercial agreements? Get in touch with our legal team.
          </p>
        </div>

        {/* 2-Column Layout: Left Contact Card + Right Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Official Business Details Card */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl space-y-6 relative overflow-hidden">
              {/* Background Glow Accent */}
              <div className="absolute right-0 top-0 w-32 h-32 bg-[#00D9D9]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <img src="/nexvelt_logo.png" alt="Nexvelt Logo" className="w-8 h-8 object-contain" />
                  <span className="font-extrabold text-base tracking-tight text-white">Nexvelt Technologies</span>
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  Official Legal, Security & Governance Desk for Nexvelt Quote Pro.
                </p>
              </div>

              <div className="border-t border-slate-800 pt-6 space-y-4 text-xs font-medium text-slate-300">
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-[#00D9D9] shrink-0 mt-0.5">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Company</span>
                    <span className="font-extrabold text-white text-sm">Nexvelt Technologies</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-[#00D9D9] shrink-0 mt-0.5">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Product</span>
                    <span className="font-extrabold text-white text-sm">Nexvelt Quote Pro</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-[#00D9D9] shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Support Email</span>
                    <a href="mailto:nexvelt2013@gmail.com" className="font-extrabold text-[#00D9D9] hover:underline text-sm block">
                      nexvelt2013@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-[#00D9D9] shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Business Hours</span>
                    <span className="font-extrabold text-white block">Monday – Saturday</span>
                    <span className="text-slate-400 text-[11px]">9:00 AM – 6:00 PM IST</span>
                  </div>
                </div>

              </div>

              <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 font-semibold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#00D9D9]" />
                <span>SSL Encrypted Communication</span>
              </div>
            </div>

            {/* Quick Note Box */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-2">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Response SLA</h4>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Legal and compliance messages are reviewed directly by our executive desk. Standard response time is within 24 to 48 business hours.
              </p>
            </div>

          </div>

          {/* Right Column: Professional Contact Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
            
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Submit Legal Query</h3>
              <p className="text-xs text-slate-600 font-semibold mt-1">
                Fill out the form below to connect directly with Nexvelt Legal & Compliance.
              </p>
            </div>

            {submitted ? (
              <div className="bg-[#E6F7F7] border border-[#00D9D9]/40 rounded-2xl p-6 text-center space-y-3 py-10">
                <div className="w-12 h-12 rounded-full bg-[#00D9D9] text-slate-950 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-black text-slate-900">Message Dispatched Successfully!</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto font-semibold">
                  Thank you, <span className="text-slate-900 font-extrabold">{fullName}</span>. Your inquiry regarding <span className="text-[#008080] font-extrabold">{subject}</span> has been securely logged. Our legal team will respond to <span className="text-slate-900 font-bold">{email}</span> within 24-48 business hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setMessage(''); }}
                  className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-900 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full h-11 px-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-[#00D9D9] focus:bg-white transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-900 mb-1">Work Email *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. ramesh@furniture.com"
                      className="w-full h-11 px-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-[#00D9D9] focus:bg-white transition"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-900 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Ramesh Furniture Works"
                      className="w-full h-11 px-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-[#00D9D9] focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-900 mb-1">Inquiry Category *</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full h-11 px-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-[#00D9D9] focus:bg-white transition"
                    >
                      <option value="Terms of Service Inquiry">Terms of Service Inquiry</option>
                      <option value="Privacy & Data Protection">Privacy & Data Protection</option>
                      <option value="Billing & Refund Request">Billing & Subscription Inquiry</option>
                      <option value="Security Vulnerability Report">Security Vulnerability Report</option>
                      <option value="Commercial SaaS Licensing">Commercial SaaS Licensing</option>
                      <option value="General Legal Questions">General Legal Questions</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-900 mb-1">Inquiry Message *</label>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details regarding your legal or compliance question..."
                    className="w-full p-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-[#00D9D9] focus:bg-white transition leading-relaxed"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-12 bg-[#00D9D9] hover:bg-[#00B8B8] text-slate-950 font-black text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Legal Inquiry</span>
                </button>

              </form>
            )}

          </div>

        </div>

      </div>
    </LegalLayout>
  );
};
