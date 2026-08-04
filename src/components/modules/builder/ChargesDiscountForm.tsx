import React from 'react';
import { useQuotationStore } from '@/store/useQuotationStore';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { Wrench, Tag, Percent, Percent as PercentIcon } from 'lucide-react';

export const ChargesDiscountForm: React.FC = () => {
  const { currentQuotation, updateAdditionalCharges, updateDiscount, updateTax } = useQuotationStore();
  const charges = currentQuotation.additionalCharges;
  const discount = currentQuotation.discount;
  const tax = currentQuotation.tax;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Section 1: Additional Charges */}
      <Card glass className="space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <Wrench className="w-4 h-4 text-[#00D9D9]" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Additional Charges (₹)
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <Input
            label="Installation"
            type="number"
            min="0"
            value={charges.installation}
            onChange={(e) => updateAdditionalCharges({ installation: parseFloat(e.target.value) || 0 })}
            prefixSymbol="₹"
          />
          <Input
            label="Transport"
            type="number"
            min="0"
            value={charges.transportation}
            onChange={(e) => updateAdditionalCharges({ transportation: parseFloat(e.target.value) || 0 })}
            prefixSymbol="₹"
          />
          <Input
            label="Labour / Fitting"
            type="number"
            min="0"
            value={charges.labour}
            onChange={(e) => updateAdditionalCharges({ labour: parseFloat(e.target.value) || 0 })}
            prefixSymbol="₹"
          />
          <Input
            label="Accessories"
            type="number"
            min="0"
            value={charges.accessories}
            onChange={(e) => updateAdditionalCharges({ accessories: parseFloat(e.target.value) || 0 })}
            prefixSymbol="₹"
          />
          <Input
            label="Loading / Unload"
            type="number"
            min="0"
            value={charges.loading}
            onChange={(e) => updateAdditionalCharges({ loading: parseFloat(e.target.value) || 0 })}
            prefixSymbol="₹"
          />
          <Input
            label="Other Charges"
            type="number"
            min="0"
            value={charges.otherCharges}
            onChange={(e) => updateAdditionalCharges({ otherCharges: parseFloat(e.target.value) || 0 })}
            prefixSymbol="₹"
          />
        </div>
      </Card>

      {/* Section 2: Discount Config */}
      <Card glass className="space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <Tag className="w-4 h-4 text-[#00D9D9]" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Discount & Offer
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => updateDiscount({ type: 'flat' })}
              className={`flex-1 py-1.5 rounded-lg transition-colors ${
                discount.type === 'flat'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Flat Amount (₹)
            </button>
            <button
              type="button"
              onClick={() => updateDiscount({ type: 'percentage' })}
              className={`flex-1 py-1.5 rounded-lg transition-colors ${
                discount.type === 'percentage'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Percentage (%)
            </button>
          </div>

          <Input
            label={discount.type === 'flat' ? 'Flat Discount Value' : 'Discount Percentage'}
            type="number"
            min="0"
            max={discount.type === 'percentage' ? 100 : undefined}
            value={discount.value}
            onChange={(e) => updateDiscount({ value: parseFloat(e.target.value) || 0 })}
            prefixSymbol={discount.type === 'flat' ? '₹' : '%'}
          />

          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center justify-between">
            <span>Applied Discount:</span>
            <span className="font-bold font-mono">
              - ₹{currentQuotation.summary.discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </Card>

      {/* Section 3: GST Rules */}
      <Card glass className="space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <PercentIcon className="w-4 h-4 text-[#00D9D9]" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            GST & Tax Rules
          </h3>
        </div>

        <div className="space-y-3">
          <Switch
            checked={tax.enabled}
            onChange={(enabled) => updateTax({ enabled })}
            label="Enable GST Calculation"
            description="Adds statutory GST tax to quotation total"
          />

          {tax.enabled && (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Select
                label="Tax Type"
                value={tax.type}
                onChange={(val: any) => updateTax({ type: (typeof val === 'string' ? val : val.target.value) as any })}
                options={[
                  { value: 'gst', label: 'GST (CGST + SGST)' },
                  { value: 'cgst_sgst', label: 'CGST + SGST (Intrastate)' },
                  { value: 'igst', label: 'IGST (Interstate)' },
                ]}
              />

              <Input
                label="Tax Rate (%)"
                type="number"
                min="0"
                max="28"
                value={tax.ratePercent}
                onChange={(e) => updateTax({ ratePercent: parseFloat(e.target.value) || 0 })}
                suffixSymbol="%"
              />
            </div>
          )}

          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span>Taxable Amount:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">
                ₹{currentQuotation.summary.taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-900 dark:text-slate-100 font-bold">
              <span>Total Tax Output:</span>
              <span className="font-mono text-[#00B8B8] dark:text-[#35F5FF]">
                ₹{currentQuotation.summary.taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
