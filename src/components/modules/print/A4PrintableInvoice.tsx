import React, { forwardRef } from 'react';
import { useQuotationStore } from '@/store/useQuotationStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useCompanyStore } from '@/store/useCompanyStore';
import { formatINR } from '@/utils/currency';
import { numberToWordsINR } from '@/utils/numberToWords';

export const A4PrintableInvoice = forwardRef<HTMLDivElement>((_, ref) => {
  const { currentQuotation } = useQuotationStore();
  const { project } = useProjectStore();
  const { company } = useCompanyStore();

  // Prefer live currentQuotation from useQuotationStore if items exist
  const isQuotationActive = Boolean(currentQuotation?.items && currentQuotation.items.length > 0);

  const activeItems: any[] = isQuotationActive ? currentQuotation.items : (project.products || []);
  const activeCustomer = isQuotationActive ? currentQuotation.customer : project.customer;
  const activeQuotationNumber = isQuotationActive ? currentQuotation.quotationNumber : project.quotationNumber;
  const activeRevisionCode = isQuotationActive ? currentQuotation.revisionCode : project.revisionCode;
  const activeDate = isQuotationActive ? currentQuotation.date : project.date;
  const activeSummary = isQuotationActive ? currentQuotation.summary : project.summary;
  const activeTax = isQuotationActive ? currentQuotation.tax : project.tax;

  const companyDisplayName = company?.name || (company as any)?.company_name || 'VLR Interior Solutions';
  const companyPhone = company?.phone || '+91 98765 43210';
  const companyEmail = company?.email || 'quotations@vlrinteriors.com';
  const companyAddress = company?.address || 'Plot 42, Commercial Complex, Sector 18';
  const companyCity = company?.city || 'Siddipet Telangana 502103';
  const companyGstin = company?.gstin || (company as any)?.tax_id || (company as any)?.gst_number || '';

  const bankDetails = company?.bankDetails || {
    bankName: 'HDFC Bank Ltd',
    accountName: companyDisplayName,
    accountNumber: '50200012345678',
    ifscCode: 'HDFC0001234',
    upiId: companyEmail,
  };

  const grandTotal = activeSummary?.grandTotal || 0;
  const grandTotalInWords = activeSummary?.grandTotalInWords || numberToWordsINR(Math.round(grandTotal));

  return (
    <div
      ref={ref}
      id="quotation-printable-area"
      className="w-full max-w-[210mm] bg-white text-slate-900 p-5 sm:p-6 font-sans mx-auto text-xs leading-normal shadow-lg print:shadow-none print:p-6 print:m-0 print:w-[210mm] print:border-none print:top-0 print:left-0"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Printable Header with Official Logo */}
      <div className="flex items-start justify-between border-b-2 border-[#00D9D9] pb-3 mb-4">
        <div className="flex items-center gap-3">
          <img
            src="/nexvelt_logo.png"
            alt="Nexvelt Logo"
            className="w-12 h-12 shrink-0"
            style={{ width: '48px', height: '48px', maxWidth: '48px', maxHeight: '48px', objectFit: 'contain' }}
          />
          <div>
            <h1 className="text-lg font-black uppercase tracking-tight text-slate-900 leading-tight">
              {companyDisplayName}
            </h1>
            {company?.tagline && <p className="text-[10px] font-medium text-slate-600 italic">{company.tagline}</p>}
            <div className="text-[10px] text-slate-600 space-x-2 font-medium mt-0.5">
              <span>{companyAddress}, {companyCity}</span>
              <span>• Phone: {companyPhone}</span>
              {companyGstin && <span>• GSTIN: {companyGstin}</span>}
            </div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="inline-block bg-[#00D9D9] text-white px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider mb-1 rounded">
            OFFICIAL QUOTATION
          </div>
          <div className="text-[10px] font-mono space-y-0.5 text-slate-800">
            <p><span className="text-slate-500">Quote #:</span> <strong>{activeQuotationNumber}</strong></p>
            <p><span className="text-slate-500">Revision:</span> <strong>{activeRevisionCode}</strong></p>
            <p><span className="text-slate-500">Date:</span> <strong>{activeDate}</strong></p>
          </div>
        </div>
      </div>

      {/* Customer & Project Details Card */}
      <div className="grid grid-cols-2 gap-3 bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-lg mb-4 text-[11px]">
        <div>
          <h3 className="text-[10px] font-black uppercase text-[#00B8B8] border-b border-[#E2E8F0] pb-0.5 mb-1">
            Quotation Prepared For:
          </h3>
          <p className="font-extrabold text-xs text-slate-900">{activeCustomer?.name || 'Valued Client'}</p>
          {activeCustomer?.phone && <p className="text-slate-700">Phone: {activeCustomer.phone}</p>}
          {activeCustomer?.email && <p className="text-slate-700">Email: {activeCustomer.email}</p>}
        </div>
        <div>
          <h3 className="text-[10px] font-black uppercase text-[#00B8B8] border-b border-[#E2E8F0] pb-0.5 mb-1">
            Project & Site Location:
          </h3>
          <p className="font-extrabold text-xs text-slate-900">
            {activeCustomer?.projectLocation || project.title || '3BHK Residential Interior Project'}
          </p>
          {activeCustomer?.city && <p className="text-slate-700">{activeCustomer.city}</p>}
        </div>
      </div>

      {/* Itemized Products Table */}
      <table className="w-full text-left text-[11px] mb-4 border-collapse">
        <thead>
          <tr className="bg-[#111827] text-white font-extrabold uppercase text-[10px]">
            <th className="py-2 px-2.5 border border-[#111827] w-6 text-center">#</th>
            <th className="py-2 px-2.5 border border-[#111827]">Product & Finish Specs</th>
            <th className="py-2 px-2.5 border border-[#111827]">Dimensions</th>
            <th className="py-2 px-2.5 border border-[#111827]">Total Area</th>
            <th className="py-2 px-2.5 border border-[#111827] text-right">Rate</th>
            <th className="py-2 px-2.5 border border-[#111827] text-center">Qty</th>
            <th className="py-2 px-2.5 border border-[#111827] text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {activeItems.map((item, idx) => {
            const title = item.title || item.name || `Item #${idx + 1}`;
            const category = item.category || 'Custom Work';
            const finish = item.finish || item.shutterMaterialName || item.material || '';
            const area = item.areaSqFt ?? item.area ?? 0;
            const rate = item.rate ?? item.baseRate ?? 0;
            const qty = item.qty ?? item.quantity ?? 1;
            const amount = item.amount ?? (rate * area * qty);

            // Format dimensions string
            const heightStr = item.height ? `${item.height}mm` : item.heightFt ? `${item.heightFt.toFixed(1)}'` : '';
            const widthStr = item.width ? `${item.width}mm` : item.widthFt ? `${item.widthFt.toFixed(1)}'` : '';
            const depthStr = item.depth ? `${item.depth}mm` : item.depthIn ? `${item.depthIn}"` : '';
            const dimStr = [heightStr && `${heightStr} H`, widthStr && `${widthStr} W`, depthStr && `${depthStr} D`].filter(Boolean).join(' × ') || 'Custom Spec';

            return (
              <tr key={item.id || idx} className="border border-[#E2E8F0]">
                <td className="py-1.5 px-2.5 font-semibold text-center">{idx + 1}</td>
                <td className="py-1.5 px-2.5">
                  <p className="font-bold text-slate-900">{title}</p>
                  <div className="text-[9px] text-slate-600 space-x-1">
                    <span className="font-extrabold text-[#008080]">[{category}]</span>
                    {finish && <span>• Finish: {finish}</span>}
                  </div>
                </td>
                <td className="py-1.5 px-2.5 font-mono text-[10px] text-slate-800">{dimStr}</td>
                <td className="py-1.5 px-2.5 font-mono font-semibold">
                  {area > 0 ? `${area.toFixed(2)} sq.ft` : 'N/A'}
                </td>
                <td className="py-1.5 px-2.5 text-right font-mono font-semibold">{formatINR(rate)}</td>
                <td className="py-1.5 px-2.5 text-center font-bold">{qty}</td>
                <td className="py-1.5 px-2.5 text-right font-mono font-bold text-slate-900">{formatINR(amount)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Summary Financial Totals */}
      <div className="flex flex-row justify-between items-start gap-4 mb-4">
        {/* Left: Bank Account Details */}
        <div className="w-1/2 bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 rounded-lg text-[10px] space-y-0.5">
          <h4 className="font-extrabold uppercase text-[#00B8B8] text-[10px] border-b border-[#E2E8F0] pb-0.5 mb-1">
            Bank Account Details for Payment
          </h4>
          <p><span className="text-slate-500">Bank Name:</span> <strong>{bankDetails.bankName}</strong></p>
          <p><span className="text-slate-500">Account Name:</span> <strong>{bankDetails.accountName}</strong></p>
          <p><span className="text-slate-500">Account Number:</span> <strong>{bankDetails.accountNumber}</strong></p>
          <p><span className="text-slate-500">IFSC Code:</span> <strong>{bankDetails.ifscCode}</strong></p>
          {bankDetails.upiId && (
            <p><span className="text-slate-500">UPI ID:</span> <strong>{bankDetails.upiId}</strong></p>
          )}
        </div>

        {/* Right: Calculations Breakdown */}
        <div className="w-1/2 space-y-1 text-[11px] font-mono">
          <div className="flex justify-between text-slate-700">
            <span>Products Subtotal:</span>
            <span>{formatINR(activeSummary?.itemsSubtotal || (activeSummary as any)?.subTotal || 0)}</span>
          </div>

          {activeSummary?.additionalChargesTotal > 0 && (
            <div className="flex justify-between text-slate-700">
              <span>Additional Charges:</span>
              <span>+ {formatINR(activeSummary.additionalChargesTotal)}</span>
            </div>
          )}

          {activeSummary?.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>Applied Discount:</span>
              <span>- {formatINR(activeSummary.discountAmount)}</span>
            </div>
          )}

          {activeTax?.enabled && activeSummary?.taxAmount > 0 && (
            <div className="flex justify-between text-slate-700">
              <span>GST ({activeTax.ratePercent || 18}%):</span>
              <span>+ {formatINR(activeSummary.taxAmount)}</span>
            </div>
          )}

          <div className="flex justify-between font-extrabold text-xs border-t-2 border-[#00D9D9] pt-1 text-[#00B8B8]">
            <span>Grand Total:</span>
            <span>{formatINR(grandTotal)}</span>
          </div>
          <p className="text-[9px] font-sans font-medium text-slate-500 italic text-right">
            ({grandTotalInWords})
          </p>
        </div>
      </div>

      {/* Terms & Conditions Block */}
      {Boolean(currentQuotation?.termsAndConditions) && (
        <div className="mb-3 p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[9.5px]">
          <h4 className="font-extrabold uppercase text-[#008080] text-[10px] mb-0.5">Terms & Conditions</h4>
          <p className="text-slate-700 whitespace-pre-line leading-tight font-medium">
            {currentQuotation.termsAndConditions}
          </p>
        </div>
      )}

      {/* Signature & Footer */}
      <div className="flex justify-between items-end pt-3 border-t border-slate-300">
        <div>
          <p className="text-[10px] font-semibold text-slate-700">Client Acceptance Signature</p>
          <div className="w-32 border-b border-slate-400 mt-6"></div>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-900">For {companyDisplayName}</p>
          <div className="w-32 border-b border-slate-400 mt-6 ml-auto"></div>
          <p className="text-[9px] text-slate-500 mt-0.5">Authorized Signatory</p>
        </div>
      </div>

      <div className="text-center text-[9px] text-slate-400 mt-4 pt-2 border-t border-slate-200">
        Generated by Nexvelt Quote Pro — Professional Interior & Furniture Quotation Software
      </div>
    </div>
  );
});

A4PrintableInvoice.displayName = 'A4PrintableInvoice';
