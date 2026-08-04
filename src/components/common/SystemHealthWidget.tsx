import React, { useState, useEffect } from 'react';
import { HealthService, SystemHealthStatus } from '../../services/health.service';
import { Activity, Database, ShieldCheck, HardDrive, Wifi } from 'lucide-react';

export const SystemHealthWidget: React.FC = () => {
  const [health, setHealth] = useState<SystemHealthStatus | null>(null);

  useEffect(() => {
    HealthService.checkSystemHealth().then(setHealth);
  }, []);

  if (!health) return null;

  return (
    <div className="flex items-center gap-3 text-xs bg-slate-900 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-800">
      <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <Activity className="w-3.5 h-3.5" />
        <span>System Status: Healthy</span>
      </div>
      <span className="text-slate-600">|</span>
      <div className="flex items-center gap-3 text-[11px]">
        <span className="flex items-center gap-1"><Database className="w-3 h-3 text-cyan-400" /> DB</span>
        <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-teal-400" /> RLS</span>
        <span className="flex items-center gap-1"><HardDrive className="w-3 h-3 text-indigo-400" /> Storage</span>
        <span className="flex items-center gap-1"><Wifi className="w-3 h-3 text-emerald-400" /> Realtime</span>
      </div>
    </div>
  );
};
