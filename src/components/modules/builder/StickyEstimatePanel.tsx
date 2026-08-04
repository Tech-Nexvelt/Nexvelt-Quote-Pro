import React from 'react';
import { useQuotationStore } from '@/store/useQuotationStore';
import { useUIStore } from '@/store/useUIStore';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatINR, formatCompactINR } from '@/utils/currency';
import { Coins, Send, FileDown, Printer, Save, TrendingUp, Layers, Wrench, Percent } from 'lucide-react';
import { motion } from 'framer-motion';

export const StickyEstimatePanel: React.FC = () => {
  const { currentQuotation, saveCurrentQuotation } = useQuotationStore();
  const { setPrintPreviewOpen, addToast } = useUIStore();
  const summary = currentQuotation.summary;

  const handleSendQuotation = () => {
    saveCurrentQuotation();
    addToast({
      type: 'success',
      title: 'Quotation Saved & Ready',
      message: 'Quotation document prepared for client presentation.',
    });
    setPrintPreviewOpen(true);
  };

  return (
    <div className="sticky top-20 space-y-4">
      {/* DOMINANT GRAND TOTAL PANEL */}
      <Card
        glass={false}
        className="relative overflow-hidden bg-gradient-to-br from-[#00D9D9] via-[#00B8B8] to-teal-700 text-slate-950 p-6 rounded-3xl shadow-2xl shadow-[#00D9D9]/30 border-none glow-primary"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-950/80">
            Grand Total
          </span>
          <Badge variant="slate" className="bg-slate-950/20 text-slate-950 border-none font-bold">
            {summary.totalItemsCount} Items • {summary.totalAreaSqFt.toFixed(1)} Sq.Ft
          </Badge>
        </div>

        <div className="my-4">
          <motion.div
            key={summary.grandTotal}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight text-slate-950"
          >
            {formatINR(summary.grandTotal)}
          </motion.div>
          <p className="text-xs font-medium text-slate-950/80 mt-1 capitalize leading-snug italic">
            {summary.grandTotalInWords}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-950/15 font-medium">
          <div>
            <span className="text-slate-950/70 block">Taxable Subtotal:</span>
            <span className="font-mono font-bold">{formatINR(summary.taxableAmount)}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-950/70 block">GST Output:</span>
            <span className="font-mono font-bold">{formatINR(summary.taxAmount)}</span>
          </div>
        </div>
      </Card>

      {/* KPI CARDS BREAKDOWN */}
      <Card glass className="space-y-3 p-5">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-2">
          Cost Breakdown Metrics
        </h4>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
            <span className="text-slate-600 dark:text-slate-400">Total Area:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
              {summary.totalAreaSqFt.toFixed(2)} Sq.Ft
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
            <span className="text-slate-600 dark:text-slate-400">Products Subtotal:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
              {formatINR(summary.itemsSubtotal)}
            </span>
          </div>

          {summary.additionalChargesTotal > 0 && (
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
              <span className="text-slate-600 dark:text-slate-400">Fitting & Transport:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                + {formatINR(summary.additionalChargesTotal)}
              </span>
            </div>
          )}

          {summary.discountAmount > 0 && (
            <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
              <span>Applied Discount:</span>
              <span className="font-mono">- {formatINR(summary.discountAmount)}</span>
            </div>
          )}

          {currentQuotation.tax.enabled && (
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
              <span className="text-slate-600 dark:text-slate-400">Statutory GST ({currentQuotation.tax.ratePercent}%):</span>
              <span className="font-mono font-bold text-[#00B8B8] dark:text-[#35F5FF]">
                + {formatINR(summary.taxAmount)}
              </span>
            </div>
          )}

          {summary.totalCostPrice > 0 && (
            <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Gross Profit Margin:
              </span>
              <span className="font-mono">{summary.marginPercentage.toFixed(1)}%</span>
            </div>
          )}
        </div>
      </Card>

      {/* ACTION BUTTONS PANEL */}
      <div className="space-y-2">
        <Button
          variant="primary"
          size="lg"
          className="w-full shadow-lg shadow-[#00D9D9]/20"
          icon={<Send className="w-4 h-4" />}
          onClick={handleSendQuotation}
        >
          Send / Generate Quotation
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="glass"
            size="md"
            icon={<Save className="w-4 h-4" />}
            onClick={() => {
              saveCurrentQuotation();
              addToast({ type: 'success', title: 'Saved to Local Drafts', message: 'Work saved.' });
            }}
          >
            Save Draft
          </Button>

          <Button
            variant="outline"
            size="md"
            icon={<Printer className="w-4 h-4" />}
            onClick={() => {
              saveCurrentQuotation();
              setPrintPreviewOpen(true);
            }}
          >
            Print / PDF
          </Button>
        </div>
      </div>
    </div>
  );
};
