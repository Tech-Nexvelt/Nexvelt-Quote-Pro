import React from 'react';
import { ShieldCheck, Building, Users, Activity, Layers, Cpu } from 'lucide-react';

export const SuperAdminDashboard: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-[#00B8B8]" /> Super Admin Platform Control Console
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Global multi-tenant system health, active business instances, and infrastructure performance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center text-[#00B8B8]">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 block">1,248</span>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Active Business Tenants</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 block">8,420</span>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Active System Users</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 block">9 Modules</span>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Modular Features</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 block">99.98%</span>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Platform Uptime</span>
          </div>
        </div>
      </div>
    </div>
  );
};
