import React, { useEffect, useState } from 'react';
import { NetworkManager, NetworkState } from '@/utils/networkManager';
import { SyncManager, SyncState } from '@/utils/syncManager';
import { WifiOff, AlertTriangle, RefreshCw, ZapOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const OfflineBanner: React.FC = () => {
  const [network, setNetwork] = useState<NetworkState>(NetworkManager.getState());
  const [sync, setSync] = useState<SyncState>(SyncManager.getState());

  useEffect(() => {
    const unsubNet = NetworkManager.subscribe(setNetwork);
    const unsubSync = SyncManager.subscribe(setSync);
    return () => {
      unsubNet();
      unsubSync();
    };
  }, []);

  const showBanner = !network.isOnline || network.quality === 'poor' || sync.status === 'syncing' || sync.status === 'failed';

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`w-full py-2 px-4 text-xs font-bold flex items-center justify-between shadow-md z-40 select-none ${
          !network.isOnline
            ? 'bg-rose-600 text-white'
            : network.quality === 'poor'
            ? 'bg-amber-500 text-white'
            : sync.status === 'failed'
            ? 'bg-red-700 text-white'
            : 'bg-[#00D9D9] text-white'
        }`}
        aria-live="assertive"
      >
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            {!network.isOnline ? (
              <WifiOff className="w-4 h-4" />
            ) : network.quality === 'poor' ? (
              <ZapOff className="w-4 h-4" />
            ) : sync.status === 'syncing' ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}

            <span>
              {!network.isOnline
                ? "You're currently offline. Local changes will sync automatically once restored."
                : network.quality === 'poor'
                ? 'Low Data / Poor Network Mode Enabled. Reduced animations & background polling.'
                : sync.status === 'syncing'
                ? `Synchronizing ${sync.pendingCount} pending mutations...`
                : `Sync Error: ${sync.errorMessage || 'Failed to update remote records.'}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {network.isLowDataMode && (
              <span className="px-2 py-0.5 rounded-full bg-black/20 text-[10px] uppercase tracking-wider">
                Low Data Mode
              </span>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-2.5 py-1 rounded bg-white/20 hover:bg-white/30 text-white text-[11px] font-extrabold transition-all flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Reconnect
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
