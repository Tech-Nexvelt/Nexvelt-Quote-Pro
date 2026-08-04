import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ConcurrencyModalProps {
  isOpen: boolean;
  onReload: () => void;
  onClose: () => void;
}

export const ConcurrencyModal: React.FC<ConcurrencyModalProps> = ({ isOpen, onReload, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-4 mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 text-center">Record Version Conflict</h3>
        <p className="text-sm text-slate-600 text-center mt-2 leading-relaxed">
          This record has been updated by another team member. To prevent overwriting their changes, please reload the latest version.
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          <button
            onClick={onReload}
            className="w-full py-2.5 px-4 rounded-xl bg-[#00D9D9] hover:bg-[#00B8B8] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4 animate-spin-hover" /> Reload Latest Version
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
