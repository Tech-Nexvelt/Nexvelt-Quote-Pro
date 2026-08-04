import React, { useState } from 'react';
import { Building2, MapPin, FileText, CheckCircle2, ArrowRight, Upload } from 'lucide-react';
import { useCompanyContext } from '../../contexts/CompanyContext';
import { CompanyService } from '../../services/company.service';
import { StorageService } from '../../services/storage.service';

export const OnboardingWizard: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { company } = useCompanyContext();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: company?.company_name || '',
    gstNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    quotationPrefix: 'Q-',
    terms: '1. 50% advance payment required.\n2. Balance before dispatch.',
  });

  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      if (company?.id) {
        await CompanyService.updateCompanySettings(company.id, {
          quotation_prefix: formData.quotationPrefix,
          currency: formData.currency,
          timezone: formData.timezone,
          default_terms: formData.terms,
        });
      }
      onComplete();
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && company?.id) {
      setUploadingLogo(true);
      try {
        const logoUrl = await StorageService.uploadCompanyAsset(company.id, file, 'logos');
        await CompanyService.updateCompanySettings(company.id, { logo: logoUrl });
      } catch {
        // Fallback
      } finally {
        setUploadingLogo(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl p-8 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Welcome to Nexvelt Quote Pro</h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">Configure your business workspace in 4 easy steps</p>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  s === step ? 'bg-[#00D9D9] text-white shadow-md' : s < step ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                }`}
              >
                {s < step ? <CheckCircle2 className="w-4 h-4" /> : s}
              </div>
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#00B8B8]" /> Business Information
            </h3>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Company / Business Name</label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-[#00D9D9] outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">GST / Tax Identification Number (Optional)</label>
              <input
                type="text"
                placeholder="29AAAAA0000A1Z5"
                value={formData.gstNumber}
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-[#00D9D9] outline-none"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#00B8B8]" /> Business Address
            </h3>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Street Address</label>
              <input
                type="text"
                placeholder="Industrial Layout, Sector 4"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-[#00D9D9] outline-none"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Pincode</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#00B8B8]" /> Quotation Settings
            </h3>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Quotation Number Prefix</label>
              <input
                type="text"
                value={formData.quotationPrefix}
                onChange={(e) => setFormData({ ...formData, quotationPrefix: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-[#00D9D9] outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Default Terms & Conditions</label>
              <textarea
                rows={3}
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#00D9D9] outline-none"
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-[#E6F7F7] flex items-center justify-center text-[#00B8B8] mx-auto">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Upload Company Logo</h3>
            <p className="text-xs text-slate-500">Your logo will appear on all exported PDF invoices and quotations</p>
            <input type="file" onChange={handleLogoUpload} accept="image/*" className="hidden" id="logo-input" />
            <label
              htmlFor="logo-input"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer hover:bg-slate-800 transition-all shadow-md"
            >
              {uploadingLogo ? 'Uploading...' : 'Choose Logo File'}
            </label>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
          <button
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-30"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-[#00D9D9] hover:bg-[#00B8B8] text-white text-xs font-extrabold shadow-md transition-all flex items-center gap-2"
          >
            {step === 4 ? 'Complete Onboarding & Go to Dashboard' : 'Next Step'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
