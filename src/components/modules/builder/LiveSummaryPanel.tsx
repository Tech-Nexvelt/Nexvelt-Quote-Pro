import React from 'react';
import { useQuotationStore } from '@/store/useQuotationStore';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatINR } from '@/utils/currency';
import { Calculator, TrendingUp, ShieldCheck, Coins, Percent } from 'lucide-react';
import { motion } from 'framer-motion';

export const LiveSummaryPanel: React.FC = () => {
  const { currentQuotation } = useQuotationStore();
  const summary = currentQuotation.summary;

  return (
    <div className="space-y-4">
      {/* Master Highlighted Grand Total Card */}
      <Card
        glass={false}
        className="relative overflow-hidden bg-gradient-to-br from-[#00D9D9] via-[#00B8B8] to-cyan-700 text-slate-950 p-6 rounded-2xl shadow-xl shadow-[#00D9D9]/25 border-none"
      >
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-slate-900" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900/80">
              Quotation Grand Total
            </h3>
          </div>
          <Badge variant="slate" className="bg-slate-950/20 text-slate-950 border-none font-bold">
            {summary.totalItemsCount} Items • {summary.totalAreaSqFt.toFixed(1)} Sq.Ft
          </Badge>
        </div>

        <div className="my-4">
          <motion.div
            key={summary.grandTotal}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-slate-950"
          >
            {formatINR(summary.grandTotal)}
          </motion.div>
          <p className="text-xs font-medium text-slate-900/80 mt-1 capitalize leading-snug italic">
            {summary.grandTotalInWords}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-950/15 font-medium">
          <div>
            <span className="text-slate-900/70 block">Taxable Amount:</span>
            <span className="font-mono font-bold">{formatINR(summary.taxableAmount)}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-900/70 block">GST ({currentQuotation.tax.ratePercent}%):</span>
            <span className="font-mono font-bold">{formatINR(summary.taxAmount)}</span>
          </div>
        </div>
      </Card>

      {/* Itemized Calculation Summary Breakdown */}
      <Card glass className="space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <Calculator className="w-4 h-4 text-[#00D9D9]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
            Price Breakdown Summary
          </h4>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
            <span>Products Subtotal ({summary.totalItemsCount} items):</span>
            <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
              {formatINR(summary.itemsSubtotal)}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
            <span>Additional Charges Total:</span>
            <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
              + {formatINR(summary.additionalChargesTotal)}
            </span>
          </div>

          {summary.discountAmount > 0 && (
            <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-medium">
              <span>Applied Discount:</span>
              <span className="font-mono font-bold">- {formatINR(summary.discountAmount)}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-slate-800 dark:text-slate-200 font-bold border-t border-slate-100 dark:border-slate-800 pt-2">
            <span>Net Taxable Total:</span>
            <span className="font-mono text-sm">{formatINR(summary.taxableAmount)}</span>
          </div>

          {currentQuotation.tax.enabled && summary.taxAmount > 0 && (
            <div className="flex items-center justify-between text-slate-500 text-[11px] pt-1">
              <span>
                {currentQuotation.tax.type === 'cgst_sgst'
                  ? `CGST (${currentQuotation.tax.ratePercent / 2}%) + SGST (${currentQuotation.tax.ratePercent / 2}%)`
                  : `GST Output (${currentQuotation.tax.ratePercent}%)`}
              </span>
              <span className="font-mono font-semibold text-[#00B8B8] dark:text-[#35F5FF]">
                + {formatINR(summary.taxAmount)}
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Profit Margin Analysis Indicator (Optional View) */}
      {summary.totalCostPrice > 0 && (
        <Card glass className="space-y-2 border-emerald-500/20 bg-emerald-500/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
              <span>Profit Margin Analysis</span>
            </div>
            <Badge variant="green">{summary.marginPercentage.toFixed(1)}% Margin</Badge>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div>
              <span className="text-slate-500 text-[11px] block">Estimated Cost Price:</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                {formatINR(summary.totalCostPrice)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 text-[11px] block">Estimated Gross Profit:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {formatINR(summary.grossProfitAmount)} ({summary.profitPercentage.toFixed(1)}% Markup)
              </span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
