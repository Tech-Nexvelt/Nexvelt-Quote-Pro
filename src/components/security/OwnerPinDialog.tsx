import React, { useState, useEffect, useRef } from 'react';
import { useSecurityStore } from '@/store/useSecurityStore';
import { useUIStore } from '@/store/useUIStore';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { KeyRound, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const OwnerPinDialog: React.FC = () => {
  const { isPinDialogOpen, closePinDialog, verifyPin, unlockOwnerMode, isVerifying } = useSecurityStore();
  const { addToast } = useUIStore();

  const [pin, setPin] = useState('');
  const [hasError, setHasError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isPinDialogOpen) {
      setPin('');
      setHasError(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isPinDialogOpen]);

  if (!isPinDialogOpen) return null;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pin.length < 4 || isVerifying) return;

    const isValid = await verifyPin(pin);
    if (isValid) {
      unlockOwnerMode();
      addToast({
        type: 'success',
        title: '✅ Owner Mode Enabled',
        message: 'Sales reports, rates manager, and company settings unlocked.',
      });
    } else {
      setHasError(true);
      addToast({
        type: 'error',
        title: '❌ Incorrect PIN',
        message: 'Please try again (Default PIN: 1234).',
      });
      setTimeout(() => {
        setPin('');
        setHasError(false);
        inputRef.current?.focus();
      }, 500);
    }
  };

  return (
    <Modal
      isOpen={isPinDialogOpen}
      onClose={closePinDialog}
      title="🔒 Owner Access Authorization"
      subtitle="Enter your 4-digit Owner PIN to unlock advanced business settings."
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <motion.div
          animate={hasError ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center space-y-3"
        >
          <div className="p-3 rounded-2xl bg-[#00D9D9]/15 text-[#00B8B8]">
            <KeyRound className="w-8 h-8" />
          </div>

          <div className="w-full relative">
            <input
              ref={inputRef}
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                setPin(val);
                setHasError(false);
                if (val.length === 4) {
                  setTimeout(async () => {
                    const ok = await verifyPin(val);
                    if (ok) {
                      unlockOwnerMode();
                      addToast({
                        type: 'success',
                        title: '✅ Owner Mode Enabled',
                        message: 'Sales reports, rates manager, and company settings unlocked.',
                      });
                    } else {
                      setHasError(true);
                      addToast({
                        type: 'error',
                        title: '❌ Incorrect PIN',
                        message: 'Please try again (Default PIN: 1234).',
                      });
                      setTimeout(() => setPin(''), 400);
                    }
                  }, 150);
                }
              }}
              placeholder="••••"
              className={`w-full text-center text-3xl font-mono tracking-[0.5em] font-black p-3 rounded-2xl border ${
                hasError ? 'border-red-500 bg-red-50 text-red-600' : 'border-slate-300 bg-white text-slate-900'
              } focus:outline-none focus:border-[#00D9D9]`}
            />
          </div>

          {hasError && (
            <p className="text-xs font-bold text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Incorrect PIN. Please try again.
            </p>
          )}

          <p className="text-[11px] text-slate-400 font-mono">
            Default PIN: <strong className="text-slate-600">1234</strong>
          </p>
        </motion.div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="outline" size="sm" type="button" onClick={closePinDialog}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" disabled={pin.length < 4 || isVerifying}>
            {isVerifying ? 'Verifying...' : 'Unlock Owner Mode'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
