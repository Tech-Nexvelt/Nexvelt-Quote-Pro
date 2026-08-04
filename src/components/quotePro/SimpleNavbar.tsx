import React from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useCompanyStore } from '@/store/useCompanyStore';
import { Printer, FileDown, Cloud, Building2 } from 'lucide-react';

export const SimpleNavbar: React.FC = () => {
  const { setPrintPreviewOpen, addToast } = useUIStore();
  const { project, resetProject } = useProjectStore();
  const { company } = useCompanyStore();

  return (
    <header className="h-[72px] w-full border-b border-[#E5E7EB] bg-white sticky top-0 z-40 px-6 flex items-center justify-between shadow-[0_2px_12px_rgba(15,23,42,0.04)] select-none">
      {/* Brand Logo & Title */}
      <div className="flex items-center gap-3">
        <img
          src="/nexvelt_logo.png"
          alt="Nexvelt Logo"
          className="w-10 h-10 object-contain drop-shadow-sm"
        />
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[20px] font-extrabold text-[#111827] tracking-tight leading-tight">
              Nexvelt Quote Pro
            </h1>
            <span className="px-3 py-1 rounded-full bg-[#E0F7F7] text-[#008080] font-bold text-xs font-mono">
              {project.quotationNumber}
            </span>
            <span className="text-[#16A34A] text-xs font-semibold flex items-center gap-1">
              <Cloud className="w-3.5 h-3.5" /> Auto Saved
            </span>
          </div>
          <p className="text-[13px] text-[#6B7280] font-medium mt-0.5">
            Interior & Commercial Furniture Quotation Software
          </p>
        </div>
      </div>

      {/* Center Company Workspace Information Badge */}
      <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-left shadow-2xs">
        <div className="w-7 h-7 rounded-lg bg-[#E6F7F7] border border-[#00D9D9]/30 flex items-center justify-center text-[#008080] shrink-0">
          <Building2 className="w-4 h-4 text-[#00B8B8]" />
        </div>
        <div className="leading-tight">
          <span className="text-xs font-extrabold text-[#111827] block">{company.name || 'Nexvelt Demo'}</span>
          <span className="text-[10px] text-[#4B5563] font-semibold block">{company.city || 'Main Workshop'}</span>
        </div>
      </div>

      {/* Right Primary Action Buttons */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => {
            resetProject();
            addToast({ type: 'info', title: 'New Quote Started', message: 'Cleared form for fresh quotation.' });
          }}
          className="h-11 px-4 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F8FAFC] text-[#111827] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
        >
          <span className="text-base font-normal">+</span> New Quote
        </button>

        <button
          onClick={() => setPrintPreviewOpen(true)}
          className="h-11 px-4 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F8FAFC] text-[#111827] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
        >
          <Printer className="w-4 h-4 text-[#6B7280]" />
          Print
        </button>

        <button
          onClick={() => setPrintPreviewOpen(true)}
          className="h-11 px-5 rounded-xl bg-[#00D9D9] hover:bg-[#00B8B8] text-white text-xs font-bold flex items-center gap-2 transition-all hover:scale-[1.01] shadow-xs"
        >
          <FileDown className="w-4 h-4" />
          Generate Quote PDF
        </button>
      </div>
    </header>
  );
};
