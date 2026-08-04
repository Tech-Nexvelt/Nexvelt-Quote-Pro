import React from 'react';
import { useSecurityStore } from '@/store/useSecurityStore';
import { Lock, Crown } from 'lucide-react';

export const OwnerLockButton: React.FC = () => {
  const { isOwnerMode, openPinDialog, openLockConfirm } = useSecurityStore();

  return (
    <div className="flex items-center">
      {isOwnerMode ? (
        <button
          type="button"
          onClick={openLockConfirm}
          className="px-3.5 py-1.5 rounded-2xl bg-[#00D9D9] hover:bg-[#00B8B8] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          title="Click to lock Owner Mode"
        >
          <Crown className="w-3.5 h-3.5" />
          <span>👑 Owner Mode</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={openPinDialog}
          className="px-3.5 py-1.5 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
          title="Click to enter 4-digit PIN and unlock Owner Mode"
        >
          <Lock className="w-3.5 h-3.5 text-slate-500" />
          <span>🔒 Unlock Owner Mode</span>
        </button>
      )}
    </div>
  );
};
