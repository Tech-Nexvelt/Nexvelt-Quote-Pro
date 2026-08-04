import React, { useState } from 'react';
import { Cpu, RefreshCw, AlertTriangle, CheckCircle2, Play, Trash2 } from 'lucide-react';

export const QueueMonitoringDashboard: React.FC = () => {
  const [dlqEvents] = useState([
    {
      id: 'dlq-101',
      original_event_id: 'evt-901',
      company_id: '5f0f21c7-a8c2-4df6-8dd4-mockcompany01',
      event_type: 'staff.invited',
      failure_reason: 'SMTP connection timeout on port 587',
      retry_count: 5,
      failed_at: new Date().toISOString(),
    },
  ]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-[#00B8B8]" /> Distributed Outbox & Worker Pipeline Monitor
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Monitor row-level locks, worker heartbeats, queue latency, and Dead Letter Queue (DLQ) replays
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase block">Pending Outbox Events</span>
            <span className="text-xl font-black text-amber-600 block mt-1">0 Pending</span>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase block">Active Worker Locks</span>
            <span className="text-xl font-black text-[#00B8B8] block mt-1">4 Active Workers</span>
          </div>
          <RefreshCw className="w-8 h-8 text-[#00D9D9] animate-spin-hover" />
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase block">Dead Letter Queue (DLQ)</span>
            <span className="text-xl font-black text-rose-600 block mt-1">{dlqEvents.length} Failed Events</span>
          </div>
          <AlertTriangle className="w-8 h-8 text-rose-500" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" /> Dead Letter Queue (DLQ) Inspection & Replay
          </h2>
          <button className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1.5">
            <Play className="w-3.5 h-3.5" /> Replay All Failed Events
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                <th className="py-2.5 px-3">Event Type</th>
                <th className="py-2.5 px-3">Company ID</th>
                <th className="py-2.5 px-3">Failure Reason</th>
                <th className="py-2.5 px-3">Retries</th>
                <th className="py-2.5 px-3">Failed At</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {dlqEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold text-slate-900">{evt.event_type}</td>
                  <td className="py-3 px-3 text-slate-500 font-mono text-[10px]">{evt.company_id}</td>
                  <td className="py-3 px-3 text-rose-600 font-semibold">{evt.failure_reason}</td>
                  <td className="py-3 px-3 text-slate-700 font-bold">{evt.retry_count} / 5</td>
                  <td className="py-3 px-3 text-slate-500">{new Date(evt.failed_at).toLocaleTimeString()}</td>
                  <td className="py-3 px-3 text-right flex items-center justify-end gap-2">
                    <button className="px-2.5 py-1 rounded-md bg-[#00D9D9] text-white font-bold text-[10px] flex items-center gap-1">
                      <Play className="w-3 h-3" /> Replay Event
                    </button>
                    <button className="p-1 rounded-md text-slate-400 hover:text-rose-600">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
