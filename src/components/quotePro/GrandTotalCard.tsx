import React from 'react';
import { useProjectStore } from '@/store/useProjectStore';
import { useUIStore } from '@/store/useUIStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatINR } from '@/utils/currency';
import { Printer, FileDown, Share2, Coins } from 'lucide-react';
import { motion } from 'framer-motion';

export const GrandTotalCard: React.FC = () => {
  const { project } = useProjectStore();
  const { setPrintPreviewOpen, addToast } = useUIStore();
  const summary = project.summary;

  const handleShareWhatsApp = () => {
    const text = `*Nexvelt Interior Quotation*\nQuote #: ${project.quotationNumber}\nCustomer: ${project.customer.name || 'Valued Client'}\nGrand Total: ${formatINR(summary.grandTotal)}\n\nThank you for choosing Nexvelt Interiors!`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <Card
      glass={false}
      className="bg-gradient-to-br from-[#E0F7F7] via-white to-white text-[#111827] p-6 rounded-[18px] border-2 border-[#00D9D9] shadow-[0_4px_20px_rgba(0,217,217,0.15)] space-y-4 select-none"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* Left: Dominant Total */}
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#00B8B8]">
            <Coins className="w-4 h-4" />
            <span>Quotation Grand Total (Net Payable Amount)</span>
          </div>

          <motion.div
            key={summary.grandTotal}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-[#111827] my-1.5"
          >
            {formatINR(summary.grandTotal)}
          </motion.div>

          <p className="text-sm font-semibold text-[#6B7280] capitalize">
            {summary.grandTotalInWords}
          </p>
        </div>

        {/* Center: KPI Breakdown Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono font-bold text-[#111827] bg-white border border-[#E5E7EB] p-3.5 rounded-xl shadow-2xs">
          <div>
            <span className="text-[10px] text-[#6B7280] block uppercase">Furniture:</span>
            <span>{formatINR(summary.itemsSubtotal)}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#6B7280] block uppercase">Charges:</span>
            <span>+{formatINR(summary.additionalChargesTotal)}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#6B7280] block uppercase">Discount:</span>
            <span>-{formatINR(summary.discountAmount)}</span>
          </div>
          {project.tax?.enabled && summary.taxAmount > 0 ? (
            <div>
              <span className="text-[10px] text-[#6B7280] block uppercase">GST ({project.tax.ratePercent || 18}%):</span>
              <span>+{formatINR(summary.taxAmount)}</span>
            </div>
          ) : (
            <div>
              <span className="text-[10px] text-[#6B7280] block uppercase">GST:</span>
              <span className="text-slate-400 font-normal">Disabled</span>
            </div>
          )}
        </div>
      </div>

      {/* Primary Actions Bar */}
      <div className="pt-3 border-t border-[#E5E7EB] flex flex-wrap items-center justify-end gap-3">
        <button
          onClick={() => setPrintPreviewOpen(true)}
          className="h-11 px-5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F8FAFC] text-[#111827] text-xs font-bold flex items-center gap-2 transition-colors shadow-2xs"
        >
          <Printer className="w-4 h-4 text-[#6B7280]" />
          Print A4 Invoice
        </button>

        <button
          onClick={() => {
            setPrintPreviewOpen(true);
            addToast({ type: 'success', title: 'PDF Generating', message: 'Downloading PDF quotation.' });
          }}
          className="h-11 px-6 rounded-xl bg-[#00D9D9] hover:bg-[#00B8B8] text-white text-xs font-bold flex items-center gap-2 shadow-sm shadow-[#00D9D9]/30 transition-all hover:scale-[1.02]"
        >
          <FileDown className="w-4 h-4" />
          Generate PDF
        </button>

        <button
          onClick={handleShareWhatsApp}
          className="h-11 px-5 rounded-xl bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all hover:scale-[1.02]"
        >
          <Share2 className="w-4 h-4" />
          Share WhatsApp
        </button>
      </div>
    </Card>
  );
};
