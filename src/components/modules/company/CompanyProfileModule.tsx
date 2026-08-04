import React, { useState } from 'react';
import { useCompanyStore } from '@/store/useCompanyStore';
import { useUIStore } from '@/store/useUIStore';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Building2, Save, RotateCcw, Landmark, FileText, CheckCircle2 } from 'lucide-react';

export const CompanyProfileModule: React.FC = () => {
  const { company, updateCompany, resetCompany } = useCompanyStore();
  const { addToast } = useUIStore();

  const [formData, setFormData] = useState(company);
  const [termsText, setTermsText] = useState((company.termsAndConditions || []).join('\n'));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const termsArray = termsText.split('\n').filter((line) => line.trim().length > 0);
    updateCompany({ ...formData, termsAndConditions: termsArray });
    addToast({
      type: 'success',
      title: 'Company Profile Updated',
      message: 'Vendor information saved and applied to all quotations.',
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-5xl mx-auto py-4">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#00D9D9]" />
            Company & Branding Profile
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure your business details, bank info, and terms. Automatically populated on all print & PDF quotations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={resetCompany} icon={<RotateCcw className="w-4 h-4" />}>
            Reset Defaults
          </Button>
          <Button type="submit" variant="primary" size="md" icon={<Save className="w-4 h-4" />}>
            Save Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Business Branding & Contact */}
        <Card glass className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
            Business Branding & Contact Info
          </h3>

          <Input
            label="Company / Firm Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Tagline / Business Subtitle"
            value={formData.tagline || ''}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            placeholder="e.g. Premium Modular Kitchens & Interiors"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <Input
            label="Office / Showroom Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="City & Pincode"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
            />
            <Input
              label="Website URL"
              value={formData.website || ''}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="www.vlrinteriors.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Input
              label="GSTIN Number"
              value={formData.gstin || ''}
              onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
              placeholder="36ABCDE1234F1Z5"
            />
            <Input
              label="PAN Number"
              value={formData.pan || ''}
              onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
              placeholder="ABCDE1234F"
            />
          </div>
        </Card>

        {/* Section 2: Bank & Payment Gateway Details */}
        <Card glass className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <Landmark className="w-4 h-4 text-[#00D9D9]" />
            Bank & Payment QR Details
          </h3>

          <Input
            label="Bank Name"
            value={formData.bankDetails?.bankName || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                bankDetails: { ...formData.bankDetails, bankName: e.target.value },
              })
            }
            placeholder="e.g. HDFC Bank Ltd"
          />

          <Input
            label="Account Name"
            value={formData.bankDetails?.accountName || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                bankDetails: { ...formData.bankDetails, accountName: e.target.value },
              })
            }
            placeholder="Account holder name"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Account Number"
              value={formData.bankDetails?.accountNumber || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bankDetails: { ...formData.bankDetails, accountNumber: e.target.value },
                })
              }
            />
            <Input
              label="IFSC Code"
              value={formData.bankDetails?.ifscCode || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bankDetails: { ...formData.bankDetails, ifscCode: e.target.value },
                })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Branch Name"
              value={formData.bankDetails?.branchName || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bankDetails: { ...formData.bankDetails, branchName: e.target.value },
                })
              }
            />
            <Input
              label="UPI ID for Instant Payment"
              value={formData.bankDetails?.upiId || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bankDetails: { ...formData.bankDetails, upiId: e.target.value },
                })
              }
              placeholder="vlrinteriors@upi"
            />
          </div>

          <div className="pt-2">
            <Input
              label="Warranty Notes / Guarantee"
              value={formData.warrantyNotes || ''}
              onChange={(e) => setFormData({ ...formData, warrantyNotes: e.target.value })}
              placeholder="e.g. 5-Year Warranty on Plywood"
            />
          </div>
        </Card>
      </div>

      {/* Section 3: Terms & Conditions Presets */}
      <Card glass className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <FileText className="w-4 h-4 text-[#00D9D9]" />
          Default Terms & Conditions (One item per line)
        </h3>

        <textarea
          rows={6}
          value={termsText}
          onChange={(e) => setTermsText(e.target.value)}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs p-3.5 focus:ring-2 focus:ring-[#00D9D9] focus:outline-none"
          placeholder="Enter terms line by line..."
        />
      </Card>
    </form>
  );
};
