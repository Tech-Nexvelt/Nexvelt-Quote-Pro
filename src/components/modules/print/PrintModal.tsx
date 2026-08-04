import React, { useRef } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { A4PrintableInvoice } from './A4PrintableInvoice';
import { Printer, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';

export const PrintModal: React.FC = () => {
  const { isPrintPreviewOpen, setPrintPreviewOpen, addToast } = useUIStore();
  const printRef = useRef<HTMLDivElement>(null);

  const handleNativePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    if (!printRef.current) return;
    const element = printRef.current;
    const opt = {
      margin: 10,
      filename: `Quotation_${Date.now()}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        addToast({ type: 'success', title: 'PDF Downloaded', message: 'PDF generated successfully.' });
      })
      .catch((err: any) => {
        console.error('PDF error:', err);
        addToast({ type: 'error', title: 'PDF Export Failed', message: 'Use browser print option.' });
      });
  };

  return (
    <Modal
      isOpen={isPrintPreviewOpen}
      onClose={() => setPrintPreviewOpen(false)}
      title="Print & Export A4 Quotation"
      maxWidth="4xl"
    >
      <div className="space-y-4">
        {/* Action Header (Strictly Hidden during Print) */}
        <div className="flex items-center justify-between bg-[#F8FAFC] border border-[#E2E8F0] p-3.5 rounded-xl no-print">
          <p className="text-xs font-semibold text-[#4B5563]">
            Preview A4 printable invoice. Choose native high-precision print or direct PDF download.
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={<Printer className="w-4 h-4" />} onClick={handleNativePrint}>
              Print (Browser)
            </Button>
            <Button variant="primary" size="sm" icon={<Download className="w-4 h-4" />} onClick={handleDownloadPDF}>
              Download PDF
            </Button>
          </div>
        </div>

        {/* Scrollable A4 Container */}
        <div className="max-h-[72vh] overflow-y-auto overflow-x-auto bg-[#F1F5F9] border border-[#E2E8F0] p-2 sm:p-5 rounded-xl flex justify-center shadow-inner print:p-0 print:border-none print:shadow-none print:max-h-none print:overflow-visible print:bg-transparent">
          <div className="w-full max-w-[210mm]">
            <A4PrintableInvoice ref={printRef} />
          </div>
        </div>
      </div>
    </Modal>
  );
};
