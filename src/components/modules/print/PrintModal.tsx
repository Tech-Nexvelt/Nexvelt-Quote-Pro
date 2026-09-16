import React, { useRef, useState } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useQuotationStore } from '@/store/useQuotationStore';
import { useAuthStore } from '@/store/useAuthStore';
import { QuotationService } from '@/services/quotation.service';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { A4PrintableInvoice } from './A4PrintableInvoice';
import { Printer, Download, Save, CheckCircle, Loader2 } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Isolated Print Window
// Collects all page styles and renders ONLY the invoice in a new blank window,
// then calls window.print() on that window — no app shell, no duplicate pages.
// The @media print rules from index.css are also collected, but we override
// them inside the new window so they don't conflict (those rules were written
// for printing from within the main app and use visibility:hidden + position:absolute
// which would cause a 2-copy bug in an otherwise empty document).
// ─────────────────────────────────────────────────────────────────────────────
function collectPageStyles(): string {
  let css = '';
  document.querySelectorAll('style').forEach((el) => {
    css += el.innerHTML + '\n';
  });
  document.querySelectorAll('link[rel="stylesheet"]').forEach((el) => {
    const href = (el as HTMLLinkElement).href;
    if (href) css += `@import url("${href}");\n`;
  });
  return css;
}

function printInIsolatedWindow(invoiceHtml: string, saveAsPDF = false) {
  const styles = collectPageStyles();

  const printWindow = window.open('', '_blank', 'width=900,height=700,scrollbars=yes');
  if (!printWindow) {
    alert('Pop-up blocked — please allow pop-ups for this site and try again.');
    return;
  }

  const hint = saveAsPDF
    ? `<p style="font-family:sans-serif;font-size:13px;color:#555;text-align:center;margin-bottom:8px">
         ℹ️ Change <b>Destination</b> to <b>"Save as PDF"</b>, then click Save.
       </p>`
    : '';

  printWindow.document.open();
  printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Quotation — VLR Interior Solutions</title>
  <style>
    /* ── Inject all app styles (Tailwind + custom CSS including @media print rules) ── */
    ${styles}

    /*
     * CRITICAL OVERRIDES: The collected CSS above includes the main app's
     * @media print rules (body*{visibility:hidden}, #quotation-printable-area{position:absolute}).
     * Those rules are for printing from within the full app window (to hide the sidebar etc.).
     * In this isolated window the invoice IS the only element — applying those rules would
     * cause it to render twice (once in flow + once at absolute position 0,0).
     * We cancel every one of them here.
     */
    @media print {
      /* 1. Everything is visible here — nothing to hide */
      body * { visibility: visible !important; }

      /* 2. Invoice renders as normal static document flow (NOT absolute/fixed) */
      #quotation-printable-area {
        position: static !important;
        top: auto !important; left: auto !important; right: auto !important;
        width: 100% !important;
        max-width: 210mm !important;
        margin: 0 auto !important;
        padding: 0 !important;
        box-shadow: none !important;
        border: none !important;
      }

      /* 3. Body scrolls normally — no clipping */
      html, body {
        overflow: visible !important;
        height: auto !important;
        width: 210mm !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      /* 4. Hide the hint paragraph during actual print */
      body > p { display: none !important; }

      /* 5. Preserve coloured backgrounds (dark rows, etc.) */
      *, tr, td, th {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      /* 6. Grand total amount: force bold white so it's visible on dark bg */
      .grand-total-amount {
        color: #ffffff !important;
        font-weight: 900 !important;
      }
    }

    @page { size: A4 portrait; margin: 8mm; }

    /* Screen preview styles */
    html, body { margin: 0; padding: 0; background: #f1f5f9; }
    body > p  { display: block; }
    #quotation-printable-area { background: #ffffff; }
  </style>
</head>
<body>
  ${hint}
  ${invoiceHtml}
  <script>
    window.onload = function () {
      setTimeout(function () {
        window.focus();
        window.print();
        setTimeout(function () { window.close(); }, 600);
      }, 300);
    };
  </script>
</body>
</html>`);
  printWindow.document.close();
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export const PrintModal: React.FC = () => {
  const { isPrintPreviewOpen, setPrintPreviewOpen, addToast } = useUIStore();
  const { currentQuotation, saveCurrentQuotation } = useQuotationStore();
  const { company } = useAuthStore();

  const printRef = useRef<HTMLDivElement>(null);
  const [saveState, setSaveState] = useState<SaveState>('idle');

  // ── helpers ──────────────────────────────────────────────────────────────
  const getInvoiceHtml = (): string | null => {
    if (!printRef.current) {
      addToast({ type: 'error', title: 'Print Error', message: 'Invoice not ready. Please try again.' });
      return null;
    }
    return printRef.current.outerHTML;
  };

  // ── Save to localStorage + Supabase DB ───────────────────────────────────
  const handleSave = async () => {
    setSaveState('saving');

    // 1. Always save to localStorage (works offline / without Supabase)
    saveCurrentQuotation();

    // 2. Attempt Supabase DB upsert
    const companyId = company?.id;
    let dbResult: { success: boolean; error?: string } = { success: true };

    if (companyId) {
      dbResult = await QuotationService.upsertQuotation(companyId, currentQuotation);
    }

    if (dbResult.success) {
      setSaveState('saved');
      addToast({
        type: 'success',
        title: 'Quotation Saved',
        message: companyId
          ? `"${currentQuotation.quotationNumber}" saved to local storage & database.`
          : `"${currentQuotation.quotationNumber}" saved locally (login to sync to DB).`,
      });
      // Reset button after 2.5s
      setTimeout(() => setSaveState('idle'), 2500);
    } else {
      setSaveState('error');
      addToast({
        type: 'warning',
        title: 'Saved Locally',
        message: `Saved to local storage. DB sync failed: ${dbResult.error}`,
      });
      setTimeout(() => setSaveState('idle'), 3000);
    }
  };

  // ── Print / PDF ───────────────────────────────────────────────────────────
  const handleNativePrint = () => {
    const html = getInvoiceHtml();
    if (!html) return;
    printInIsolatedWindow(html, false);
  };

  const handleDownloadPDF = () => {
    const html = getInvoiceHtml();
    if (!html) return;
    addToast({
      type: 'info',
      title: 'Save as PDF',
      message: 'In the print dialog → change Destination to "Save as PDF" → Save.',
    });
    printInIsolatedWindow(html, true);
  };

  // ── Save button label / icon ──────────────────────────────────────────────
  const saveIcon =
    saveState === 'saving' ? (
      <Loader2 className="w-4 h-4 animate-spin" />
    ) : saveState === 'saved' ? (
      <CheckCircle className="w-4 h-4" />
    ) : (
      <Save className="w-4 h-4" />
    );

  const saveLabel =
    saveState === 'saving' ? 'Saving…' : saveState === 'saved' ? 'Saved!' : 'Save Quotation';

  const saveVariant: 'success' | 'outline' =
    saveState === 'saved' ? 'success' : 'outline';

  return (
    <Modal
      isOpen={isPrintPreviewOpen}
      onClose={() => setPrintPreviewOpen(false)}
      title="Print & Export A4 Quotation"
      maxWidth="4xl"
    >
      <div className="space-y-4">
        {/* ── Action Header ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F8FAFC] border border-[#E2E8F0] p-3.5 rounded-xl">
          <div>
            <p className="text-xs font-semibold text-[#4B5563]">
              Save to database or export as PDF / Print.
            </p>
            <p className="text-[11px] text-[#6B7280] mt-0.5">
              {currentQuotation.quotationNumber} &bull; {currentQuotation.customer?.name || 'No customer'}
              {' '}
              &bull; ₹{currentQuotation.summary?.grandTotal?.toLocaleString('en-IN') ?? '0'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Save button */}
            <Button
              id="btn-save-quotation"
              variant={saveVariant}
              size="sm"
              icon={saveIcon}
              onClick={handleSave}
              disabled={saveState === 'saving'}
            >
              {saveLabel}
            </Button>

            {/* Divider */}
            <div className="w-px h-6 bg-[#E2E8F0]" />

            {/* Print / PDF buttons */}
            <Button
              id="btn-print-browser"
              variant="outline"
              size="sm"
              icon={<Printer className="w-4 h-4" />}
              onClick={handleNativePrint}
            >
              Print (Browser)
            </Button>
            <Button
              id="btn-download-pdf"
              variant="primary"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={handleDownloadPDF}
            >
              Download PDF
            </Button>
          </div>
        </div>

        {/* ── Scrollable A4 Preview ── */}
        <div className="max-h-[72vh] overflow-y-auto overflow-x-auto bg-[#F1F5F9] border border-[#E2E8F0] p-2 sm:p-5 rounded-xl flex justify-center shadow-inner">
          <div className="w-full max-w-[210mm]">
            <A4PrintableInvoice ref={printRef} />
          </div>
        </div>
      </div>
    </Modal>
  );
};
