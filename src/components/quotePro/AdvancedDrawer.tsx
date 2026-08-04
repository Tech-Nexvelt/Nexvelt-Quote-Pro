import React from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useProjectStore } from '@/store/useProjectStore';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';

export const AdvancedDrawer: React.FC = () => {
  const { isAdvancedDrawerOpen, toggleAdvancedDrawer } = useUIStore();
  const { project, updateCharges, updateDiscount, updateTax } = useProjectStore();

  const discountTypeOptions = [
    { value: 'flat', label: 'Flat Cash Discount (₹)' },
    { value: 'percentage', label: 'Percentage Off (%)' },
  ];

  return (
    <Card className="space-y-4">
      {/* Drawer Toggle Bar */}
      <div
        onClick={toggleAdvancedDrawer}
        className="flex items-center justify-between cursor-pointer py-1"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#E0F7F7] text-[#00B8B8]">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-[20px] font-extrabold text-[#111827] leading-tight">
              Advanced Options
            </h2>
            <p className="text-[13px] text-[#6B7280] font-medium mt-0.5">
              Fitting, transport, labour, GST rules, discount, and notes.
            </p>
          </div>
        </div>

        <button className="h-10 px-4 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F8FAFC] text-[#111827] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs">
          <span>{isAdvancedDrawerOpen ? 'Hide Advanced Options' : 'Show Advanced Options'}</span>
          {isAdvancedDrawerOpen ? <ChevronUp className="w-4 h-4 text-[#6B7280]" /> : <ChevronDown className="w-4 h-4 text-[#6B7280]" />}
        </button>
      </div>

      {/* Progressive Disclosure Content */}
      {isAdvancedDrawerOpen && (
        <div className="pt-3 border-t border-[#F1F5F9] space-y-5 text-xs">
          {/* Section 1: Additional Charges */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-[#111827] uppercase text-[11px] tracking-wider">Fitting & Additional Charges</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Input
                label="Installation & Fitting (₹)"
                type="number"
                min="0"
                value={project.additionalCharges.installation}
                onChange={(e) => updateCharges({ installation: parseFloat(e.target.value) || 0 })}
                prefixSymbol="₹"
              />
              <Input
                label="Transportation (₹)"
                type="number"
                min="0"
                value={project.additionalCharges.transportation}
                onChange={(e) => updateCharges({ transportation: parseFloat(e.target.value) || 0 })}
                prefixSymbol="₹"
              />
              <Input
                label="Loading & Labour (₹)"
                type="number"
                min="0"
                value={project.additionalCharges.labour}
                onChange={(e) => updateCharges({ labour: parseFloat(e.target.value) || 0 })}
                prefixSymbol="₹"
              />
              <Input
                label="Packaging Charges (₹)"
                type="number"
                min="0"
                value={project.additionalCharges.packaging}
                onChange={(e) => updateCharges({ packaging: parseFloat(e.target.value) || 0 })}
                prefixSymbol="₹"
              />
            </div>
          </div>

          {/* Section 2: Discount & Tax */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <h4 className="font-bold text-[#111827] uppercase text-[11px] tracking-wider">Applied Discount</h4>
              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Discount Type"
                  value={project.discount.type}
                  onChange={(val) => updateDiscount({ type: val as any })}
                  options={discountTypeOptions}
                />
                <Input
                  label="Discount Value"
                  type="number"
                  min="0"
                  value={project.discount.value}
                  onChange={(e) => updateDiscount({ value: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <h4 className="font-bold text-[#111827] uppercase text-[11px] tracking-wider">Statutory GST Tax Rules</h4>
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC]">
                <div>
                  <span className="font-bold text-[#111827] block">Apply Statutory 18% GST</span>
                  <span className="text-[11px] text-[#6B7280]">CGST (9%) + SGST (9%) Breakdown</span>
                </div>
                <Switch
                  checked={project.tax.enabled}
                  onChange={(checked) => updateTax({ enabled: checked })}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
