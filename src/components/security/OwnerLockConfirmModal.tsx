import React from 'react';
import { useSecurityStore } from '@/store/useSecurityStore';
import { useUIStore } from '@/store/useUIStore';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Lock } from 'lucide-react';

export const OwnerLockConfirmModal: React.FC = () => {
  const { isLockConfirmOpen, closeLockConfirm, lockOwnerMode } = useSecurityStore();
  const { addToast } = useUIStore();

  if (!isLockConfirmOpen) return null;

  const handleConfirmLock = () => {
    lockOwnerMode();
    addToast({
      type: 'info',
      title: '🔒 Owner Mode Locked',
      message: 'Returned immediately to Staff Mode.',
    });
  };

  return (
    <Modal
      isOpen={isLockConfirmOpen}
      onClose={closeLockConfirm}
      title="🔒 Lock Owner Mode?"
      subtitle="Returning to Staff Mode will hide all sensitive sales reports and rate controls."
      maxWidth="sm"
    >
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
          <Lock className="w-5 h-5 text-amber-600 shrink-0" />
          <p>Staff members will only see the clean 1-screen quotation builder.</p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={closeLockConfirm}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleConfirmLock}>
            Lock Owner Mode
          </Button>
        </div>
      </div>
    </Modal>
  );
};
