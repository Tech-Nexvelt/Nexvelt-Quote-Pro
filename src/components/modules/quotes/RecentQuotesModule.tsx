import React, { useState } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { Clock, Search, FileText, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';

interface QuoteRecord {
  id: string;
  code: string;
  revision: string;
  client: string;
  projectTitle: string;
  location: string;
  amount: number;
  status: 'Draft' | 'Sent' | 'Approved' | 'In Production';
  date: string;
}

export const RecentQuotesModule: React.FC = () => {
  const { addToast, setCurrentView } = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');

  const recentQuotes: QuoteRecord[] = [
    { id: 'q1', code: 'QTN-2026-1084', revision: 'REV-02', client: 'Dr. Rajesh Sharma', projectTitle: 'Modern Villa Interior Project', location: 'Jubilee Hills, Hyderabad', amount: 208861, status: 'Draft', date: 'Today, 02:45 PM' },
    { id: 'q2', code: 'QTN-2026-1082', revision: 'REV-01', client: 'Srinivas Rao', projectTitle: '3BHK Apartment Interiors', location: 'Gachibowli, Hyderabad', amount: 175400, status: 'Sent', date: 'Yesterday, 05:20 PM' },
    { id: 'q3', code: 'QTN-2026-1079', revision: 'REV-03', client: 'Anita Reddy', projectTitle: 'Modular Kitchen & Wardrobe Renovation', location: 'Banjara Hills, Hyderabad', amount: 342000, status: 'Approved', date: '26 Jul 2026' },
    { id: 'q4', code: 'QTN-2026-1075', revision: 'REV-01', client: 'Venkatesh Builders', projectTitle: 'Sample Flat Interior Package', location: 'Nallagandla, Hyderabad', amount: 512000, status: 'In Production', date: '22 Jul 2026' },
  ];

  const filtered = recentQuotes.filter((q) =>
    q.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.projectTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-[#E2E8F0] p-5 rounded-xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E6F7F7] text-[#00B8B8] flex items-center justify-center font-bold">
            <Clock className="w-5 h-5 text-[#00B8B8]" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-[#111827]">Recent Quotation Logs</h1>
            <p className="text-xs text-[#4B5563]">Historical estimates, version snapshots, and active proposals</p>
          </div>
        </div>

        <div className="relative w-64">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search recent quotes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-[#E2E8F0] rounded-lg text-[#111827] focus:outline-none focus:border-[#00D9D9]"
          />
        </div>
      </div>

      {/* Quotations List */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs text-[#111827]">
          <thead className="bg-[#F8FAFC] text-[#4B5563] font-semibold border-b border-[#E2E8F0]">
            <tr>
              <th className="p-3.5">Quote Code</th>
              <th className="p-3.5">Revision</th>
              <th className="p-3.5">Client & Project</th>
              <th className="p-3.5">Date</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Grand Total</th>
              <th className="p-3.5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {filtered.map((q) => (
              <tr key={q.id} className="hover:bg-[#F8FAFC] transition">
                <td className="p-3.5 font-mono font-bold text-[#00B8B8]">{q.code}</td>
                <td className="p-3.5 font-mono text-[#374151]">{q.revision}</td>
                <td className="p-3.5">
                  <span className="font-bold text-[#111827] block">{q.client}</span>
                  <span className="text-[11px] text-[#6B7280]">{q.projectTitle} • {q.location}</span>
                </td>
                <td className="p-3.5 text-[#6B7280]">{q.date}</td>
                <td className="p-3.5">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    q.status === 'Approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : q.status === 'In Production'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-sky-100 text-sky-800'
                  }`}>
                    {q.status}
                  </span>
                </td>
                <td className="p-3.5 text-right font-mono font-extrabold text-[#111827]">
                  ₹{q.amount.toLocaleString('en-IN')}
                </td>
                <td className="p-3.5 text-center">
                  <button
                    onClick={() => {
                      setCurrentView('builder');
                      addToast({ type: 'success', title: 'Quote Loaded', message: `Opened ${q.code} in builder.` });
                    }}
                    className="px-3 py-1 bg-[#E6F7F7] hover:bg-[#00D9D9] text-[#008080] hover:text-white font-bold rounded-lg transition"
                  >
                    Open Quote
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
