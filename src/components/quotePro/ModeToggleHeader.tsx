import React from 'react';
import { UserMode, WorkflowStage } from '../../types/enterprise';

interface ModeToggleHeaderProps {
  mode: UserMode;
  onModeChange: (newMode: UserMode) => void;
  workflowStage: WorkflowStage;
  onStageChange: (newStage: WorkflowStage) => void;
  projectName: string;
  projectCode: string;
  currentRevisionCode: string;
  onOpenTemplates: () => void;
  onOpenRevisions: () => void;
  onOpenPurchaseList: () => void;
  onOpenDashboard: () => void;
}

const STAGE_LABELS: Record<WorkflowStage, { label: string; bg: string }> = {
  draft: { label: 'Draft', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  sent: { label: 'Quotation Sent', bg: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  review: { label: 'Customer Review', bg: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  approved: { label: 'Approved', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  advance_received: { label: 'Advance Received', bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
  production: { label: 'In Production', bg: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  installation: { label: 'Installation', bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
  completed: { label: 'Completed', bg: 'bg-green-500/20 text-green-300 border-green-500/30' },
  archived: { label: 'Archived', bg: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
};

export const ModeToggleHeader: React.FC<ModeToggleHeaderProps> = ({
  mode,
  onModeChange,
  workflowStage,
  onStageChange,
  projectName,
  projectCode,
  currentRevisionCode,
  onOpenTemplates,
  onOpenRevisions,
  onOpenPurchaseList,
  onOpenDashboard,
}) => {
  return (
    <header className="bg-slate-900/90 border-b border-slate-800 backdrop-blur sticky top-0 z-30 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Branding & Project Meta */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20">
            NQP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold text-white tracking-wide">{projectName || 'Untitled Project'}</h1>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                {projectCode}
              </span>
              <span className="text-xs font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                {currentRevisionCode}
              </span>
            </div>
            <p className="text-xs text-slate-400">Nexvelt Quote Pro • Enterprise Workshop Edition</p>
          </div>
        </div>

        {/* Middle: Workflow Stage Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden md:inline">Stage:</span>
          <select
            value={workflowStage}
            onChange={(e) => onStageChange(e.target.value as WorkflowStage)}
            className={`text-xs font-medium px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${STAGE_LABELS[workflowStage].bg}`}
          >
            {Object.entries(STAGE_LABELS).map(([stageKey, data]) => (
              <option key={stageKey} value={stageKey} className="bg-slate-900 text-white">
                {data.label}
              </option>
            ))}
          </select>
        </div>

        {/* Right: Actions & Staff vs Owner Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenTemplates}
            className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition border border-slate-700 flex items-center gap-1.5"
          >
            <span>📚 Templates</span>
          </button>

          {mode === 'owner' && (
            <>
              <button
                onClick={onOpenRevisions}
                className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition border border-slate-700 flex items-center gap-1.5"
              >
                <span>🔄 Revisions</span>
              </button>

              <button
                onClick={onOpenPurchaseList}
                className="px-3 py-1.5 text-xs font-medium bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 rounded-lg transition border border-emerald-800/40 flex items-center gap-1.5"
              >
                <span>📦 Purchase Orders</span>
              </button>

              <button
                onClick={onOpenDashboard}
                className="px-3 py-1.5 text-xs font-medium bg-blue-950/60 hover:bg-blue-900/60 text-blue-300 rounded-lg transition border border-blue-800/40 flex items-center gap-1.5"
              >
                <span>📊 Workshop Dashboard</span>
              </button>
            </>
          )}

          {/* User Mode Switch */}
          <div className="bg-slate-950 p-0.5 rounded-lg border border-slate-800 flex items-center">
            <button
              onClick={() => onModeChange('staff')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                mode === 'staff'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Staff Mode
            </button>
            <button
              onClick={() => onModeChange('owner')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                mode === 'owner'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Owner Mode
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
