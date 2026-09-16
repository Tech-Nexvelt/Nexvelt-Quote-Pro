import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuotationStore } from '@/store/useQuotationStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import { QuotationService, QuotationRecord } from '@/services/quotation.service';
import { Quotation, QuotationItem } from '@/types/quotation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatINR } from '@/utils/currency';
import {
  Clock,
  Search,
  FileText,
  PlusCircle,
  RefreshCw,
  Eye,
  Printer,
  Trash2,
  ExternalLink,
  MapPin,
  Phone,
  Calendar,
  Layers,
  Sparkles,
  LayoutGrid,
  List,
  Filter,
  CheckCircle2,
  AlertCircle,
  X,
  FileEdit,
  DollarSign,
  Box,
} from 'lucide-react';

export interface CombinedQuote {
  id: string;
  quotationNumber: string;
  title: string;
  customerName: string;
  customerPhone?: string;
  projectLocation?: string;
  status: 'Draft' | 'Sent' | 'Approved' | 'Rejected' | 'Expired' | 'Archived';
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  grandTotal: number;
  updatedAt: string;
  createdAt: string;
  notes?: string;
  terms?: string;
  source: 'db' | 'local' | 'both';
  rawLocal?: Quotation;
  rawDb?: QuotationRecord;
}

export const RecentQuotesModule: React.FC = () => {
  const navigate = useNavigate();
  const { savedQuotations, loadQuotation, deleteSavedQuotation, createNewQuotation } = useQuotationStore();
  const { company } = useAuthStore();
  const { addToast, setPrintPreviewOpen: setPrintModalOpen } = useUIStore();

  const [dbQuotations, setDbQuotations] = useState<QuotationRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'amount-desc' | 'amount-asc'>('newest');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const [inspectingQuote, setInspectingQuote] = useState<CombinedQuote | null>(null);

  const companyId = company?.id || '5f0f21c7-a8c2-4df6-8dd4-mockcompany01';

  // ── 1. Fetch recent quotations from DB ─────────────────────────────────────
  const fetchDbQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const records = await QuotationService.getQuotations(companyId);
      setDbQuotations(records || []);
    } catch (err: any) {
      console.warn('[RecentQuotes] Failed to fetch DB quotations:', err?.message || err);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchDbQuotes();
  }, [fetchDbQuotes]);

  // ── 2. Combine & Deduplicate DB + Local Quotations ──────────────────────────
  const combinedQuotes = useMemo(() => {
    const list: CombinedQuote[] = [];
    const dbMap = new Map<string, QuotationRecord>();

    dbQuotations.forEach((dbq) => {
      if (dbq.quotation_number) {
        dbMap.set(dbq.quotation_number, dbq);
      }
    });

    const processedNumbers = new Set<string>();

    // Process local savedQuotations
    savedQuotations.forEach((lq) => {
      const num = lq.quotationNumber;
      if (num) processedNumbers.add(num);

      const dbMatch = dbMap.get(num);
      list.push({
        id: lq.id,
        quotationNumber: lq.quotationNumber || dbMatch?.quotation_number || 'QT-DRAFT',
        title: lq.projectName || lq.customer?.name || dbMatch?.title || 'Untitled Quotation',
        customerName: lq.customer?.name || dbMatch?.title || 'Client',
        customerPhone: lq.customer?.phone,
        projectLocation: lq.customer?.projectLocation || lq.customer?.city,
        status: (dbMatch?.status as any) || (lq.status ? lq.status.charAt(0).toUpperCase() + lq.status.slice(1) : 'Draft'),
        subtotal: lq.summary?.itemsSubtotal ?? dbMatch?.subtotal ?? 0,
        discountAmount: lq.summary?.discountAmount ?? dbMatch?.discount_amount ?? 0,
        taxAmount: lq.summary?.taxAmount ?? dbMatch?.tax_amount ?? 0,
        grandTotal: lq.summary?.grandTotal ?? dbMatch?.grand_total ?? 0,
        updatedAt: lq.updatedAt || dbMatch?.updated_at || new Date().toISOString(),
        createdAt: lq.createdAt || dbMatch?.created_at || new Date().toISOString(),
        notes: lq.notes || dbMatch?.notes || undefined,
        terms: lq.termsAndConditions || dbMatch?.terms || undefined,
        source: dbMatch ? 'both' : 'local',
        rawLocal: lq,
        rawDb: dbMatch,
      });
    });

    // Process DB quotations that are not in local storage
    dbQuotations.forEach((dbq) => {
      if (dbq.quotation_number && processedNumbers.has(dbq.quotation_number)) return;

      list.push({
        id: dbq.id,
        quotationNumber: dbq.quotation_number,
        title: dbq.title || 'Untitled Quotation',
        customerName: dbq.title || 'Client',
        status: dbq.status || 'Draft',
        subtotal: dbq.subtotal || 0,
        discountAmount: dbq.discount_amount || 0,
        taxAmount: dbq.tax_amount || 0,
        grandTotal: dbq.grand_total || 0,
        updatedAt: dbq.updated_at || new Date().toISOString(),
        createdAt: dbq.created_at || new Date().toISOString(),
        notes: dbq.notes || undefined,
        terms: dbq.terms || undefined,
        source: 'db',
        rawDb: dbq,
      });
    });

    // ── Apply Search & Status Filter ──────────────────────────────────────────
    let filtered = list;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.quotationNumber.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          item.customerName.toLowerCase().includes(q) ||
          (item.projectLocation && item.projectLocation.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((item) => item.status.toLowerCase() === statusFilter.toLowerCase());
    }

    // ── Apply Sorting ─────────────────────────────────────────────────────────
    filtered.sort((a, b) => {
      if (sortBy === 'amount-desc') return b.grandTotal - a.grandTotal;
      if (sortBy === 'amount-asc') return a.grandTotal - b.grandTotal;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    return filtered;
  }, [dbQuotations, savedQuotations, searchQuery, statusFilter, sortBy]);

  // ── Prepare store state for print without navigating ─────────────────────
  const prepareQuoteForPrint = (quote: CombinedQuote) => {
    if (quote.rawLocal) {
      loadQuotation(quote.rawLocal.id);
    } else if (quote.rawDb) {
      const fullQuote: Quotation = {
        id: quote.rawDb.id,
        quotationNumber: quote.rawDb.quotation_number,
        revisionCode: 'REV-01',
        projectName: quote.rawDb.title,
        customer: {
          id: quote.rawDb.customer_id || `cust_${Date.now()}`,
          name: quote.rawDb.title,
          phone: quote.customerPhone || '',
          email: '',
          city: '',
          projectLocation: quote.projectLocation || '',
          createdAt: quote.rawDb.created_at,
          updatedAt: quote.rawDb.updated_at,
        },
        date: quote.rawDb.created_at ? quote.rawDb.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        status: (quote.rawDb.status.toLowerCase() as any) || 'draft',
        items: [],
        spaces: [],
        additionalCharges: { installation: 0, transportation: 0, loading: 0, labour: 0, accessories: 0, hardware: 0, packaging: 0, otherCharges: 0 },
        discount: { type: 'flat', value: quote.rawDb.discount_amount },
        tax: { enabled: quote.rawDb.tax_amount > 0, type: 'gst', ratePercent: 18 },
        summary: {
          totalItemsCount: 0,
          totalAreaSqFt: 0,
          totalRunningLengthFt: 0,
          itemsSubtotal: quote.rawDb.subtotal,
          additionalChargesTotal: 0,
          discountAmount: quote.rawDb.discount_amount,
          taxableAmount: quote.rawDb.subtotal - quote.rawDb.discount_amount,
          taxAmount: quote.rawDb.tax_amount,
          cgstAmount: 0,
          sgstAmount: 0,
          igstAmount: 0,
          grandTotal: quote.rawDb.grand_total,
          grandTotalInWords: '',
          totalCostPrice: 0,
          totalSellingPrice: quote.rawDb.grand_total,
          grossProfitAmount: 0,
          profitPercentage: 0,
          marginPercentage: 0,
        },
        notes: quote.rawDb.notes || '',
        termsAndConditions: quote.rawDb.terms || '',
        createdAt: quote.rawDb.created_at || new Date().toISOString(),
        updatedAt: quote.rawDb.updated_at || new Date().toISOString(),
      };

      useQuotationStore.setState((state) => ({
        currentQuotation: fullQuote,
        savedQuotations: state.savedQuotations.some((q) => q.id === fullQuote.id)
          ? state.savedQuotations
          : [fullQuote, ...state.savedQuotations],
      }));
    }
  };

  const handleQuickPrint = (quote: CombinedQuote) => {
    prepareQuoteForPrint(quote);
    setPrintModalOpen(true);
  };

  const handleEditInBuilder = (quote: CombinedQuote) => {
    prepareQuoteForPrint(quote);
    addToast({
      type: 'info',
      title: 'Quotation Builder',
      message: `Opened ${quote.quotationNumber} in Quotation Builder.`,
    });
    setInspectingQuote(null);
    navigate('/quotations');
  };

  const handleDelete = (quote: CombinedQuote) => {
    deleteSavedQuotation(quote.id);
    addToast({ type: 'info', title: 'Quotation Deleted', message: `Removed ${quote.quotationNumber}.` });
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'approved') return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Approved</span>;
    if (s === 'sent') return <span className="bg-sky-50 text-sky-700 border border-sky-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">Sent</span>;
    if (s === 'rejected') return <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">Rejected</span>;
    if (s === 'expired') return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">Expired</span>;
    return <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">Draft</span>;
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* ── Top Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#E2E8F0] pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E6F7F7] text-[#00B8B8] flex items-center justify-center font-bold border border-[#00D9D9]/20">
            <Clock className="w-5 h-5 text-[#00B8B8]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#111827]">Recent Quotation Logs</h1>
            <p className="text-xs text-[#6B7280] font-medium mt-0.5">
              Historical estimates, version snapshots, and active proposals stored in database.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <Button
            variant="outline"
            size="sm"
            icon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
            onClick={fetchDbQuotes}
            disabled={loading}
          >
            Refresh DB
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<PlusCircle className="w-3.5 h-3.5" />}
            onClick={() => {
              createNewQuotation();
              navigate('/quotations');
            }}
          >
            New Quotation
          </Button>
        </div>
      </div>

      {/* ── Search, Filters & View Toggle ─────────────────────────────────── */}
      <div className="bg-white border border-[#E2E8F0] p-3.5 rounded-2xl shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search recent quotes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-[#E2E8F0] rounded-xl text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#00D9D9]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-between md:justify-end">
          {/* Status Tabs */}
          <div className="flex items-center bg-[#F8FAFC] border border-[#E2E8F0] p-1 rounded-xl text-xs font-bold text-[#4B5563]">
            {['all', 'draft', 'sent', 'approved'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                  statusFilter === st ? 'bg-white text-[#008080] shadow-2xs font-extrabold' : 'hover:text-[#111827]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-9 bg-white border border-[#E2E8F0] rounded-xl px-2.5 text-xs font-medium text-[#111827] focus:outline-none focus:border-[#00D9D9]"
          >
            <option value="newest">Newest First</option>
            <option value="amount-desc">Amount: High to Low</option>
            <option value="amount-asc">Amount: Low to High</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#F8FAFC] border border-[#E2E8F0] p-1 rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'table' ? 'bg-white text-[#008080] shadow-2xs' : 'text-[#6B7280]'}`}
              title="Compact Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-white text-[#008080] shadow-2xs' : 'text-[#6B7280]'}`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Loading Skeleton ───────────────────────────────────────────────── */}
      {loading && combinedQuotes.length === 0 && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 text-center space-y-3 animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/4 mx-auto"></div>
          <div className="h-4 bg-slate-100 rounded w-1/2 mx-auto"></div>
        </div>
      )}

      {/* ── Empty State ────────────────────────────────────────────────────── */}
      {!loading && combinedQuotes.length === 0 && (
        <Card glass={false} className="bg-white border border-[#E2E8F0] p-12 text-center rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#E6F7F7] text-[#00B8B8] flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-[#111827]">No Quotations Found</h3>
          <p className="text-xs text-[#6B7280] font-medium max-w-sm mx-auto">
            {searchQuery ? `No quotes matching "${searchQuery}"` : 'Your quotation logs are empty. Create your first quotation to store it in database.'}
          </p>
        </Card>
      )}

      {/* ── 1. COMPACT TABLE VIEW (Matching User Screenshot Layout) ───────── */}
      {!loading && combinedQuotes.length > 0 && viewMode === 'table' && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#111827]">
              <thead className="bg-[#F8FAFC] text-[#4B5563] font-bold border-b border-[#E2E8F0]">
                <tr>
                  <th className="p-3.5">Quote Code</th>
                  <th className="p-3.5">Revision</th>
                  <th className="p-3.5">Client &amp; Project</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Grand Total</th>
                  <th className="p-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {combinedQuotes.map((q) => (
                  <tr key={q.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="p-3.5 font-mono font-extrabold text-[#008080]">{q.quotationNumber}</td>
                    <td className="p-3.5 font-mono text-[#374151]">{q.rawLocal?.revisionCode || 'REV-01'}</td>
                    <td className="p-3.5">
                      <span className="font-extrabold text-[#111827] block">{q.customerName}</span>
                      <span className="text-[11px] text-[#6B7280]">
                        {q.title} {q.projectLocation ? `• ${q.projectLocation}` : ''}
                      </span>
                    </td>
                    <td className="p-3.5 text-[#6B7280]">
                      {new Date(q.updatedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-3.5">{getStatusBadge(q.status)}</td>
                    <td className="p-3.5 text-right font-mono font-extrabold text-[#111827]">
                      {formatINR(q.grandTotal)}
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setInspectingQuote(q)}
                          className="px-3 py-1 bg-[#E6F7F7] hover:bg-[#00D9D9] text-[#008080] hover:text-white font-extrabold rounded-lg text-xs transition cursor-pointer flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Open Quote
                        </button>
                        <button
                          onClick={() => handleQuickPrint(q)}
                          className="p-1.5 text-[#6B7280] hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          title="Print / Export PDF"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(q)}
                          className="p-1.5 text-[#9CA3AF] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Delete quote"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 2. CATALOGUE GRID VIEW ────────────────────────────────────────── */}
      {!loading && combinedQuotes.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {combinedQuotes.map((q) => (
            <div
              key={q.id}
              className="bg-white border border-[#E2E8F0] hover:border-[#00D9D9] rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-extrabold text-xs text-[#008080] bg-[#E6F7F7] border border-[#00D9D9]/30 px-2.5 py-0.5 rounded-lg">
                    {q.quotationNumber}
                  </span>
                  {getStatusBadge(q.status)}
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-[#111827] group-hover:text-[#008080] transition-colors line-clamp-1">
                    {q.title}
                  </h3>
                  <div className="text-xs font-semibold text-[#4B5563] mt-0.5">{q.customerName}</div>
                  {q.projectLocation && (
                    <div className="text-xs text-[#6B7280] flex items-center gap-1.5 mt-1 truncate">
                      <MapPin className="w-3 h-3 text-[#9CA3AF] shrink-0" />
                      <span className="truncate">{q.projectLocation}</span>
                    </div>
                  )}
                </div>

                <div className="text-[11px] text-[#9CA3AF] font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(q.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>

              <div className="pt-3 border-t border-[#F1F5F9] space-y-3">
                <div className="bg-[#F8FAFC] border border-[#F1F5F9] p-3 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-bold text-[#6B7280]">Grand Total</span>
                  <span className="text-base font-black font-mono text-[#111827]">
                    {formatINR(q.grandTotal)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setInspectingQuote(q)}
                    className="flex-1 h-9 bg-[#E6F7F7] hover:bg-[#00D9D9] text-[#008080] hover:text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-[#00D9D9]/30"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Open Quote
                  </button>

                  <button
                    onClick={() => handleQuickPrint(q)}
                    className="p-2 border border-[#E2E8F0] hover:border-[#00D9D9] text-[#6B7280] hover:text-[#008080] bg-white rounded-xl transition-all cursor-pointer"
                    title="Print / PDF"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── 3. IN-PAGE DETAILED QUOTATION VIEWER MODAL ────────────────────── */}
      {inspectingQuote && (
        <Modal
          isOpen={!!inspectingQuote}
          onClose={() => setInspectingQuote(null)}
          title={`Quotation Detail — ${inspectingQuote.quotationNumber}`}
          maxWidth="4xl"
        >
          <div className="space-y-6 pt-1 max-h-[78vh] overflow-y-auto pr-1">
            {/* ── Top Overview Banner ────────────────────────────────────── */}
            <div className="bg-gradient-to-r from-[#F8FAFC] to-[#E6F7F7]/40 border border-[#E2E8F0] p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-black text-sm text-[#008080] bg-white border border-[#00D9D9]/40 px-3 py-1 rounded-xl shadow-2xs">
                    {inspectingQuote.quotationNumber}
                  </span>
                  <span className="text-xs font-mono text-[#6B7280]">
                    {inspectingQuote.rawLocal?.revisionCode || 'REV-01'}
                  </span>
                  {getStatusBadge(inspectingQuote.status)}
                </div>
                <h2 className="text-lg font-black text-[#111827]">{inspectingQuote.title}</h2>
                <div className="text-xs text-[#6B7280] font-medium flex items-center gap-3 mt-1 flex-wrap">
                  <span className="font-bold text-[#111827]">Client: {inspectingQuote.customerName}</span>
                  {inspectingQuote.customerPhone && <span>• Phone: {inspectingQuote.customerPhone}</span>}
                  {inspectingQuote.projectLocation && <span>• Location: {inspectingQuote.projectLocation}</span>}
                </div>
              </div>

              <div className="text-left sm:text-right bg-white border border-[#E2E8F0] p-3.5 rounded-xl shadow-2xs min-w-[180px]">
                <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Grand Total</div>
                <div className="text-2xl font-black font-mono text-[#008080]">
                  {formatINR(inspectingQuote.grandTotal)}
                </div>
              </div>
            </div>

            {/* ── Itemized Line Items Table (if local items exist) ───────────── */}
            {inspectingQuote.rawLocal?.items && inspectingQuote.rawLocal.items.length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
                  <Box className="w-4 h-4 text-[#00D9D9]" />
                  Quotation Itemized Line Items ({inspectingQuote.rawLocal.items.length} items)
                </h4>

                <div className="border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8FAFC] text-[#4B5563] font-bold border-b border-[#E2E8F0]">
                      <tr>
                        <th className="p-3">#</th>
                        <th className="p-3">Item Name &amp; Description</th>
                        <th className="p-3">Space / Room</th>
                        <th className="p-3 text-center">Dimensions</th>
                        <th className="p-3 text-center">Qty</th>
                        <th className="p-3 text-right">Unit Rate</th>
                        <th className="p-3 text-right">Total Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0] bg-white">
                      {inspectingQuote.rawLocal.items.map((item: QuotationItem, idx: number) => (
                        <tr key={item.id || idx} className="hover:bg-slate-50">
                          <td className="p-3 text-[#9CA3AF] font-mono">{idx + 1}</td>
                          <td className="p-3">
                            <span className="font-bold text-[#111827] block">{item.name}</span>
                            {item.category && <span className="text-[11px] text-[#6B7280]">{item.category}</span>}
                          </td>
                          <td className="p-3">
                            <span className="bg-[#E6F7F7] text-[#008080] px-2 py-0.5 rounded font-semibold text-[11px]">
                              {item.spaceName || item.category || 'General'}
                            </span>
                          </td>
                          <td className="p-3 text-center font-mono text-[#6B7280]">
                            {item.heightFt || item.widthFt ? `${item.heightFt || 0}' H × ${item.widthFt || 0}' W` : '—'}
                          </td>
                          <td className="p-3 text-center font-bold text-[#111827]">{item.quantity || 1}</td>
                          <td className="p-3 text-right font-mono text-[#4B5563]">{formatINR(item.effectiveRatePerUnit || item.baseRate || 0)}</td>
                          <td className="p-3 text-right font-mono font-extrabold text-[#111827]">{formatINR(item.lineSubtotal || 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-[#F8FAFC] border border-dashed border-[#E2E8F0] p-6 rounded-2xl text-center space-y-1">
                <p className="text-xs font-bold text-[#111827]">Summary Record from Database</p>
                <p className="text-[11px] text-[#6B7280]">
                  Full itemized specifications are stored in local draft or can be edited in builder.
                </p>
              </div>
            )}

            {/* ── Detailed Financial Calculation Summary ───────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: Notes & Terms */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-[#111827] uppercase tracking-wider">
                  Terms &amp; Notes
                </h4>
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-xl space-y-2 text-xs text-[#374151]">
                  {inspectingQuote.notes ? (
                    <div>
                      <span className="font-extrabold text-[#111827] block mb-0.5">Notes:</span>
                      <p className="text-[#6B7280]">{inspectingQuote.notes}</p>
                    </div>
                  ) : (
                    <p className="text-[#9CA3AF] italic">No additional notes specified.</p>
                  )}

                  {inspectingQuote.terms && (
                    <div className="pt-2 border-t border-[#E2E8F0]">
                      <span className="font-extrabold text-[#111827] block mb-0.5">Terms &amp; Conditions:</span>
                      <p className="text-[#6B7280] whitespace-pre-line">{inspectingQuote.terms}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Financial Calculation Box */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-[#111827] uppercase tracking-wider">
                  Financial Breakdown
                </h4>
                <div className="bg-white border border-[#E2E8F0] p-4 rounded-xl space-y-2.5 text-xs">
                  <div className="flex justify-between text-[#4B5563]">
                    <span>Items Subtotal:</span>
                    <span className="font-mono font-bold text-[#111827]">{formatINR(inspectingQuote.subtotal)}</span>
                  </div>

                  {inspectingQuote.discountAmount > 0 && (
                    <div className="flex justify-between text-rose-600 font-medium">
                      <span>Discount:</span>
                      <span className="font-mono font-bold">- {formatINR(inspectingQuote.discountAmount)}</span>
                    </div>
                  )}

                  {inspectingQuote.taxAmount > 0 && (
                    <div className="flex justify-between text-[#4B5563]">
                      <span>GST / Tax Amount:</span>
                      <span className="font-mono font-bold text-[#111827]">{formatINR(inspectingQuote.taxAmount)}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-[#E2E8F0] flex justify-between items-center text-sm font-black text-[#111827]">
                    <span>Final Amount:</span>
                    <span className="font-mono text-lg text-[#008080]">{formatINR(inspectingQuote.grandTotal)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Modal Bottom Action Bar ──────────────────────────────────── */}
            <div className="pt-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInspectingQuote(null)}
              >
                Close View
              </Button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Printer className="w-4 h-4 text-emerald-600" />}
                  onClick={() => handleQuickPrint(inspectingQuote)}
                >
                  Print / PDF
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  icon={<FileEdit className="w-4 h-4" />}
                  onClick={() => handleEditInBuilder(inspectingQuote)}
                >
                  Edit in Builder
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
