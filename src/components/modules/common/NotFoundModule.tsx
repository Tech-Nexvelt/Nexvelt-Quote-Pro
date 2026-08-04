import React from 'react';
import { useUIStore } from '@/store/useUIStore';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export const NotFoundModule: React.FC = () => {
  const { setCurrentView } = useUIStore();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-[#E0F7F7] text-[#00B8B8] flex items-center justify-center text-2xl font-bold shadow-sm">
        <FileQuestion className="w-8 h-8 text-[#00B8B8]" />
      </div>
      <div>
        <h2 className="text-xl font-extrabold text-[#0F172A]">Page / View Not Found</h2>
        <p className="text-xs text-[#64748B] mt-1 max-w-sm">
          The requested section does not exist or has been relocated. Return to the Quotation Builder below.
        </p>
      </div>
      <button
        onClick={() => setCurrentView('builder')}
        className="px-5 py-2.5 bg-[#00D9D9] hover:bg-[#00B8B8] text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Quotation Builder
      </button>
    </div>
  );
};
