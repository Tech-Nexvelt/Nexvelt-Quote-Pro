import React from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useQuotationStore } from '@/store/useQuotationStore';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

export const ResetConfirmationModal: React.FC = () => {
  const { isResetModalOpen, setResetModalOpen, addToast } = useUIStore();
  const { resetQuotation } = useQuotationStore();

  const handleConfirmReset = () => {
    resetQuotation();
    setResetModalOpen(false);
    addToast({
      type: 'info',
      title: 'Quotation Reset',
      message: 'All form fields have been restored to default values.',
    });
  };

  return (
    <Modal
      isOpen={isResetModalOpen}
      onClose={() => setResetModalOpen(false)}
      title="Confirm Quotation Reset"
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3.5 bg-amber-500/15 border border-amber-500/30 rounded-xl text-amber-600 dark:text-amber-400 text-xs">
          <AlertTriangle className="w-6 h-6 shrink-0" />
          <p>
            Are you sure you want to reset all current quotation inputs? This action will clear current line items and reset customer fields.
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => setResetModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmReset}>
            Confirm & Reset
          </Button>
        </div>
      </div>
    </Modal>
  );
};
