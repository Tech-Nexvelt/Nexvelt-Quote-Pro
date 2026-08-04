import React from 'react';
import { CommercialProject } from '@/types/project';
import { LayoutDashboard, CheckCircle2, Clock, Truck, ShieldAlert } from 'lucide-react';

interface WorkshopDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  projects: CommercialProject[];
}

export const WorkshopDashboard: React.FC<WorkshopDashboardProps> = ({
  isOpen,
  onClose,
  projects,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-5xl w-full max-h-[85vh] flex flex-col shadow-2xl text-[#111827]">
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E6F7F7] border border-[#00D9D9]/30 flex items-center justify-center text-[#008080]">
              <LayoutDashboard className="w-4 h-4 text-[#00B8B8]" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#111827]">Workshop Operations & Job Tracking</h2>
              <p className="text-xs font-semibold text-[#4B5563]">Real-time cutting list status, material readiness, and site dispatch tracking</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#6B7280] hover:text-[#111827] text-lg font-bold">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-1">
              <span className="text-[11px] font-extrabold text-[#4B5563] uppercase">Active Factory Jobs</span>
              <div className="text-2xl font-black font-mono text-[#111827]">8 Jobs</div>
              <span className="text-[10px] text-[#008080] font-bold">In Production</span>
            </div>

            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-1">
              <span className="text-[11px] font-extrabold text-[#4B5563] uppercase">Sheets Cut Today</span>
              <div className="text-2xl font-black font-mono text-emerald-700">42 Sheets</div>
              <span className="text-[10px] text-emerald-700 font-bold">CNC Router Active</span>
            </div>

            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-1">
              <span className="text-[11px] font-extrabold text-[#4B5563] uppercase">Edge Banding Done</span>
              <div className="text-2xl font-black font-mono text-[#111827]">620 Meters</div>
              <span className="text-[10px] text-[#008080] font-bold">2mm PVC Tape</span>
            </div>

            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-1">
              <span className="text-[11px] font-extrabold text-[#4B5563] uppercase">Pending Dispatches</span>
              <div className="text-2xl font-black font-mono text-amber-700">3 Sites</div>
              <span className="text-[10px] text-amber-700 font-bold">Scheduled for Friday</span>
            </div>
          </div>

          {/* Jobs Table */}
          <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-3">
            <h3 className="text-xs font-extrabold text-[#111827] uppercase tracking-wider">
              Live Factory Job Status
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white text-[#111827] font-extrabold uppercase border-b border-[#E2E8F0]">
                  <tr>
                    <th className="p-2.5">Job Code</th>
                    <th className="p-2.5">Customer & Site</th>
                    <th className="p-2.5">Cutting List</th>
                    <th className="p-2.5">Edge Banding</th>
                    <th className="p-2.5">Assembly</th>
                    <th className="p-2.5 text-right">Target Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  <tr className="hover:bg-white transition">
                    <td className="p-2.5 font-mono font-bold text-[#008080]">JOB-2025-089</td>
                    <td className="p-2.5 font-bold text-[#111827]">Ramesh Furniture (Wardrobes)</td>
                    <td className="p-2.5">
                      <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[11px] font-bold border border-emerald-300">
                        Completed (24 Sheets)
                      </span>
                    </td>
                    <td className="p-2.5">
                      <span className="bg-[#E6F7F7] text-[#008080] px-2 py-0.5 rounded text-[11px] font-bold border border-[#00D9D9]/30">
                        In Progress (80%)
                      </span>
                    </td>
                    <td className="p-2.5">
                      <span className="bg-[#F1F5F9] text-[#4B5563] px-2 py-0.5 rounded text-[11px] font-bold">
                        Pending
                      </span>
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-[#111827]">30 July 2025</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E2E8F0] flex items-center justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#111827] font-bold text-xs rounded-lg">
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
