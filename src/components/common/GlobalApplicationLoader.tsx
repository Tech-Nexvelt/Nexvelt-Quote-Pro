import React, { useEffect, useState } from 'react';
import { AppStateManager } from '@/utils/appStateManager';
import { motion, AnimatePresence } from 'framer-motion';

export const GlobalApplicationLoader: React.FC<{ isReady?: boolean; embedded?: boolean }> = ({
  isReady = false,
  embedded = false,
}) => {
  const [status, setStatus] = useState(AppStateManager.getStatus());

  useEffect(() => {
    return AppStateManager.subscribe((step, message, progress) => {
      setStatus({ step, message, progress, isReady: step === 'ready' });
    });
  }, []);

  if (!embedded && (isReady || status.isReady)) return null;

  const content = (
    <div className="w-full max-w-sm flex flex-col items-center text-center space-y-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
      {/* Animated Glow Teal 'N' Brand Logo Icon */}
      <motion.div
        animate={{ scale: [0.95, 1.05, 0.95] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00D9D9] to-[#00B8B8] flex items-center justify-center text-white font-black text-3xl shadow-lg shadow-[#00D9D9]/30"
      >
        N
      </motion.div>

      <div className="space-y-1">
        <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
          Preparing Workspace...
        </h2>
        <p className="text-xs font-semibold text-slate-500">
          Connecting Securely...
        </p>
        <p className="text-xs font-medium text-slate-400">
          Synchronizing Data...
        </p>
      </div>

      {/* Progress Bar Container matching Card #1 */}
      <div className="w-full space-y-1.5">
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden relative border border-slate-200">
          <motion.div
            className="h-full bg-gradient-to-r from-[#00D9D9] to-[#00B8B8] rounded-full"
            animate={{ width: `${status.progress || 72}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="flex justify-end text-[10px] font-mono font-bold text-slate-400">
          <span>{status.progress || 72}%</span>
        </div>
      </div>
    </div>
  );

  if (embedded) {
    return <div className="w-full flex items-center justify-center p-2 bg-[#F8FAFC] rounded-2xl">{content}</div>;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 bg-[#F8FAFC] flex flex-col items-center justify-center font-sans p-6 select-none"
        aria-live="polite"
        aria-busy="true"
      >
        {content}
      </motion.div>
    </AnimatePresence>
  );
};

