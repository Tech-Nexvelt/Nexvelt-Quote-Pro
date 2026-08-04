import React from 'react';
import { useProjectStore } from '@/store/useProjectStore';
import { useUIStore } from '@/store/useUIStore';

export const NexveltStatusBar: React.FC = () => {
  const { project, selectedRoomId, selectedProductId } = useProjectStore();
  const { workspaceMode, cadViewMode } = useUIStore();

  const selectedRoom = project.rooms.find((r) => r.id === selectedRoomId);
  const selectedProduct = project.products.find((p) => p.id === selectedProductId);

  return (
    <footer className="h-7 w-full border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-[11px] font-mono px-4 flex items-center justify-between select-none no-print">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-slate-800 dark:text-slate-200">Ready</span>
        </span>
        <span>•</span>
        <span>Autosave: Active</span>
        <span>•</span>
        <span>Mode: <strong className="text-slate-800 dark:text-slate-200 uppercase">{workspaceMode}</strong></span>
        <span>•</span>
        <span>CAD View: <strong className="text-[#00B8B8] dark:text-[#35F5FF] uppercase">{cadViewMode}</strong></span>
      </div>

      <div className="flex items-center gap-3">
        <span>Room: {selectedRoom?.name || 'All Rooms'}</span>
        <span>•</span>
        <span>Product: {selectedProduct?.name || 'None'}</span>
        <span>•</span>
        <span>Units: Ft+In / Sq.Ft</span>
        <span>•</span>
        <span className="font-bold text-[#00D9D9]">v2.4 Production Candidate</span>
      </div>
    </footer>
  );
};
