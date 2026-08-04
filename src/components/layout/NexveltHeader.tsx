import React, { useEffect } from 'react';
import { useUIStore, WorkspaceMode } from '@/store/useUIStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useCompanyStore } from '@/store/useCompanyStore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Layers,
  Search,
  Printer,
  FileDown,
  RotateCcw,
  PlusCircle,
  Command,
  Sun,
  Moon,
  Save,
  CheckCircle2,
} from 'lucide-react';

export const NexveltHeader: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    theme,
    toggleTheme,
    workspaceMode,
    setWorkspaceMode,
    toggleCommandPalette,
    setPrintPreviewOpen,
    setResetModalOpen,
    addToast,
  } = useUIStore();

  const { company } = useCompanyStore();
  const { project, cloneAsRevision, resetProject } = useProjectStore();

  // Handle Ctrl+K global keyboard shortcut for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleCommandPalette]);

  const modes: { id: WorkspaceMode; label: string }[] = [
    { id: 'design', label: 'Design' },
    { id: 'estimate', label: 'Estimate' },
    { id: 'review', label: 'Review' },
    { id: 'presentation', label: 'Presentation' },
    { id: 'print', label: 'Print' },
  ];

  return (
    <header className="h-[72px] w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 no-print flex items-center px-4 sm:px-6">
      <div className="flex items-center justify-between w-full gap-4">
        {/* Left: Branding & Project Title */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#00D9D9] to-[#00B8B8] flex items-center justify-center text-slate-950 font-black text-xl shadow-md shadow-[#00D9D9]/20 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
            N
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
                Nexvelt Interior Quotation Estimator
              </h1>
              <Badge variant="cyan">{project.revisionCode}</Badge>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <span>{project.quotationNumber}</span>
              <span>•</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{project.title}</span>
              <span>•</span>
              <span className="text-emerald-500 flex items-center gap-0.5 text-[10px]">
                <CheckCircle2 className="w-3 h-3" /> Saved 2s ago
              </span>
            </p>
          </div>
        </div>

        {/* Center: Command Palette Search & Workspace Mode Selector */}
        <div className="hidden md:flex items-center gap-3">
          {/* Quick Command Palette Launcher */}
          <button
            onClick={toggleCommandPalette}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors text-xs font-medium w-48 shadow-xs"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="flex-1 text-left">Quick Search...</span>
            <kbd className="bg-slate-200 dark:bg-slate-800 text-[10px] font-mono px-1.5 py-0.5 rounded-md text-slate-600 dark:text-slate-400">
              Ctrl+K
            </kbd>
          </button>

          {/* Workspace Modes Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setWorkspaceMode(m.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  workspaceMode === m.id
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<PlusCircle className="w-4 h-4 text-[#00B8B8]" />}
            onClick={() => {
              cloneAsRevision();
              addToast({ type: 'success', title: 'New Revision Cloned', message: `Created ${project.revisionCode}` });
            }}
            title="Clone current quotation revision"
          >
            <span className="hidden sm:inline">New Rev</span>
          </Button>

          <Button
            variant="glass"
            size="sm"
            icon={<Printer className="w-4 h-4" />}
            onClick={() => setPrintPreviewOpen(true)}
          >
            <span className="hidden sm:inline">Print</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<FileDown className="w-4 h-4" />}
            onClick={() => setPrintPreviewOpen(true)}
          >
            <span className="hidden sm:inline">Generate Quote</span>
          </Button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle theme mode"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-[#35F5FF]" />}
          </button>
        </div>
      </div>
    </header>
  );
};
