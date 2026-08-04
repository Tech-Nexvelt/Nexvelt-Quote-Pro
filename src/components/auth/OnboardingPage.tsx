import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useCompanyStore } from '@/store/useCompanyStore';
import { OnboardingService } from '@/services/onboarding.service';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  useDocumentTitle('Nexvelt Quote Pro | Company Setup');
  const navigate = useNavigate();
  const { user, completeOnboarding, initializeSession } = useAuthStore();
  const { company, updateCompany } = useCompanyStore();

  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState(user?.companyName || company.name || 'Ramesh Furniture');
  const [tagline, setTagline] = useState('Interior & Commercial Quotations');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [email, setEmail] = useState(user?.email || 'admin@nexvelt.com');
  const [city, setCity] = useState('Hyderabad');

  const [gstin, setGstin] = useState('36AAACR1234F1Z5');
  const [address, setAddress] = useState('Plot 42, Industrial Park, Cherlapally');
  const [terms, setTerms] = useState('50% Advance along with work order. 40% on delivery of materials. 10% post completion.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      updateCompany({
        name: companyName,
        tagline,
        phone,
        email,
        city,
        gstin,
        address,
        quotationTerms: terms,
      });

      if (isSupabaseConfigured()) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await OnboardingService.completeInitialSetup({
            userId: session.user.id,
            email: email.trim().toLowerCase(),
            companyName: companyName.trim(),
            ownerName: user?.ownerName || 'Business Owner',
            phone: phone.trim(),
            businessType: user?.businessType,
            gstin: gstin.trim(),
            address: address.trim(),
            city: city.trim(),
          });
        }
      }

      await initializeSession();
      completeOnboarding();
      navigate('/dashboard');
    } catch (err) {
      // Complete onboarding and proceed even if already existing
      completeOnboarding();
      navigate('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-8 select-none font-sans text-[#111827]">
      <div className="w-full max-w-2xl bg-white border border-[#E2E8F0] rounded-3xl shadow-2xl p-8 sm:p-10 space-y-6">
        {/* Top Header Logo */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-6">
          <div className="flex items-center gap-3">
            <img
              src="/nexvelt_logo.png"
              alt="Nexvelt Logo"
              className="w-10 h-10 object-contain drop-shadow-sm"
            />
            <div>
              <span className="font-extrabold text-base text-[#111827] block leading-none">Nexvelt Quote Pro</span>
              <span className="text-[10px] font-bold text-[#00B8B8] tracking-widest uppercase block mt-0.5">Company Setup</span>
            </div>
          </div>
          <span className="text-xs font-bold text-[#008080] bg-[#E6F7F7] px-3 py-1 rounded-full border border-[#00D9D9]/30">
            Step {step} of 2
          </span>
        </div>

        {/* Title */}
        <div>
          <h2 className="text-xl font-black text-[#111827]">
            {step === 1 ? '🏢 Setup Your Company Profile' : '📋 Quotation & Tax Settings'}
          </h2>
          <p className="text-xs font-semibold text-[#4B5563] mt-0.5">
            This information will automatically appear on your customer quotation PDFs and invoices.
          </p>
        </div>

        {/* Wizard Form */}
        <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2); } : handleFinish} className="space-y-4">
          {step === 1 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">Company / Workshop Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#111827] font-semibold focus:outline-none focus:border-[#00D9D9]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">Tagline / Business Subtitle</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#111827] font-semibold focus:outline-none focus:border-[#00D9D9]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#111827] font-semibold focus:outline-none focus:border-[#00D9D9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#111827] font-semibold focus:outline-none focus:border-[#00D9D9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">City / Branch Location</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#111827] font-semibold focus:outline-none focus:border-[#00D9D9]"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">GSTIN Number (Optional)</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  placeholder="e.g. 36AAACR1234F1Z5"
                  className="w-full h-10 px-3 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#111827] font-semibold focus:outline-none focus:border-[#00D9D9]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">Factory / Office Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="w-full p-3 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#111827] font-semibold focus:outline-none focus:border-[#00D9D9]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">Default Quotation Payment Terms</label>
                <textarea
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  rows={2}
                  className="w-full p-3 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#111827] font-semibold focus:outline-none focus:border-[#00D9D9]"
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
            {step === 2 ? (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#111827] text-xs font-bold rounded-xl"
              >
                Back
              </button>
            ) : <div />}

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-10 px-6 bg-[#00D9D9] hover:bg-[#00B8B8] text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Saving Setup...</span>
                </>
              ) : (
                <>
                  <span>{step === 1 ? 'Continue' : 'Complete Setup & Launch Workspace'}</span>
                  {step === 1 ? <ArrowRight className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
