import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuotationStore } from '@/store/useQuotationStore';
import { useUIStore } from '@/store/useUIStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatINR, formatCompactINR } from '@/utils/currency';
import {
  FileText,
  TrendingUp,
  PlusCircle,
  Users,
  Copy,
  Trash2,
  ExternalLink,
  Award,
  DollarSign,
  Clock,
} from 'lucide-react';

export const DashboardModule: React.FC = () => {
  const navigate = useNavigate();
  const { savedQuotations, loadQuotation, deleteSavedQuotation, createNewQuotation } = useQuotationStore();
  const { addToast } = useUIStore();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Compute analytics
  const totalCount = savedQuotations.length;
  const totalValueSum = savedQuotations.reduce((acc, q) => acc + q.summary.grandTotal, 0);
  const avgQuoteVal = totalCount > 0 ? totalValueSum / totalCount : 0;
  const highestQuoteVal = savedQuotations.reduce((max, q) => Math.max(max, q.summary.grandTotal), 0);

  const filteredQuotes =
    statusFilter === 'all' ? savedQuotations : savedQuotations.filter((q) => q.status === statusFilter);

  const handleOpenQuote = (id: string) => {
    loadQuotation(id);
    addToast({ type: 'info', title: 'Quotation Loaded', message: 'Opened draft in Quotation Builder.' });
    navigate('/quotations');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-4">
      {/* Top Welcome Banner & Quick Start */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <h2 className="heading-page">
            Quotation Management Dashboard
          </h2>
          <p className="text-sm font-semibold text-[#4B5563] mt-1">
            Local business insights, quote history, revision management, and quick actions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="md"
            icon={<PlusCircle className="w-4 h-4" />}
            onClick={() => {
              createNewQuotation();
              addToast({ type: 'info', title: 'New Quotation', message: 'Created new quotation draft.' });
              navigate('/quotations');
            }}
          >
            Create Quotation
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card glass className="space-y-2 border-[#E2E8F0] bg-white">
          <div className="flex items-center justify-between text-[#374151] text-xs font-extrabold uppercase tracking-wider">
            <span>Total Quotations</span>
            <FileText className="w-4 h-4 text-[#00D9D9]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#111827]">
            {totalCount}
          </div>
          <p className="text-xs font-bold text-[#4B5563]">Stored locally in browser</p>
        </Card>

        <Card glass className="space-y-2 border-[#E2E8F0] bg-white">
          <div className="flex items-center justify-between text-[#374151] text-xs font-extrabold uppercase tracking-wider">
            <span>Total Quotation Pipeline</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-700">
            {formatCompactINR(totalValueSum)}
          </div>
          <p className="text-xs font-bold text-[#4B5563]">Gross deal pipeline value</p>
        </Card>

        <Card glass className="space-y-2 border-[#E2E8F0] bg-white">
          <div className="flex items-center justify-between text-[#374151] text-xs font-extrabold uppercase tracking-wider">
            <span>Average Quote Value</span>
            <TrendingUp className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#111827]">
            {formatCompactINR(avgQuoteVal)}
          </div>
          <p className="text-xs font-bold text-[#4B5563]">Per project average</p>
        </Card>

        <Card glass className="space-y-2 border-[#E2E8F0] bg-white">
          <div className="flex items-center justify-between text-[#374151] text-xs font-extrabold uppercase tracking-wider">
            <span>Highest Single Quote</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-amber-700">
            {formatCompactINR(highestQuoteVal)}
          </div>
          <p className="text-xs font-bold text-[#4B5563]">Top deal size</p>
        </Card>
      </div>

      {/* Saved Quotations List */}
      <Card glass className="p-0 overflow-hidden border-[#E2E8F0] bg-white">
        <div className="p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#00D9D9]" />
            <h3 className="text-base font-extrabold text-[#111827]">
              Quotation History & Revisions
            </h3>
          </div>

          <div className="flex items-center gap-1 bg-white border border-[#E2E8F0] p-1 rounded-xl text-xs font-bold">
            {['all', 'draft', 'sent', 'approved'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                  statusFilter === st
                    ? 'bg-[#00D9D9] text-white font-extrabold shadow-2xs'
                    : 'text-[#4B5563] hover:text-[#111827]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F1F5F9] text-[#111827] font-extrabold uppercase tracking-wider border-b border-[#E2E8F0]">
              <tr>
                <th className="py-3.5 px-4 text-[#111827] font-extrabold">Quotation #</th>
                <th className="py-3.5 px-4 text-[#111827] font-extrabold">Client Name</th>
                <th className="py-3.5 px-4 text-[#111827] font-extrabold">Project Title</th>
                <th className="py-3.5 px-4 text-[#111827] font-extrabold">Date</th>
                <th className="py-3.5 px-4 text-[#111827] font-extrabold">Status</th>
                <th className="py-3.5 px-4 text-[#111827] font-extrabold text-right">Grand Total</th>
                <th className="py-3.5 px-4 text-[#111827] font-extrabold text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#4B5563] font-bold">
                    No quotations found under selected filter.
                  </td>
                </tr>
              ) : (
                filteredQuotes.map((q) => (
                  <tr key={q.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#111827]">
                      {q.quotationNumber} <span className="text-xs text-[#008080] font-mono">({q.revisionCode})</span>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-[#111827]">
                      {q.customer.name || 'Unnamed Client'}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#374151]">
                      {q.projectName || 'Interior Work'}
                    </td>
                    <td className="py-3.5 px-4 text-[#4B5563] font-mono font-bold">{q.date}</td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          q.status === 'approved' ? 'green' : q.status === 'sent' ? 'cyan' : 'slate'
                        }
                      >
                        {q.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-sm text-[#008080]">
                      {formatINR(q.summary.grandTotal)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenQuote(q.id)}
                          className="p-1.5 rounded-lg text-[#374151] hover:text-[#008080] hover:bg-[#E6F7F7] transition"
                          title="Open quotation"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteSavedQuotation(q.id)}
                          className="p-1.5 rounded-lg text-[#4B5563] hover:text-red-600 hover:bg-red-50 transition"
                          title="Delete quotation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
