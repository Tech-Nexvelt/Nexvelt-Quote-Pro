import React, { forwardRef } from 'react';
import { useQuotationStore } from '@/store/useQuotationStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useCompanyStore } from '@/store/useCompanyStore';
import { formatINR } from '@/utils/currency';
import { groupItemsBySpaceAndType, resolveItemSpecification, resolveItemType } from '@/utils/quotationGrouping';

const UNIT_SUFFIX: Record<string, string> = {
  mm: ' mm',
  cm: ' cm',
  m: ' m',
  inch: '"',
  ft: "'",
};

// Show the dimension in the unit the user entered it in; fall back to feet for legacy items.
const formatDimension = (value: unknown, valueFt: number | undefined, unit: string | undefined): string => {
  const num = typeof value === 'number' ? value : parseFloat(String(value ?? ''));
  if (unit && UNIT_SUFFIX[unit] && num > 0) {
    return `${parseFloat(num.toFixed(2))}${UNIT_SUFFIX[unit]}`;
  }
  if (valueFt) return `${valueFt.toFixed(1)}'`;
  return value ? String(value) : '-';
};

export const A4PrintableInvoice = forwardRef<HTMLDivElement>((_, ref) => {
  const { currentQuotation } = useQuotationStore();
  const { project } = useProjectStore();
  const { company } = useCompanyStore();

  const isQuotationActive = Boolean(currentQuotation?.items && currentQuotation.items.length > 0);

  const activeItems: any[] = isQuotationActive ? currentQuotation.items : (project.products || []);
  const activeSpaces = isQuotationActive ? currentQuotation.spaces || [] : [];
  const activeCustomer = {
    name: currentQuotation?.customer?.name || project?.customer?.name || '',
    phone: currentQuotation?.customer?.phone || project?.customer?.phone || '',
    email: currentQuotation?.customer?.email || project?.customer?.email || '',
    city: currentQuotation?.customer?.city || project?.customer?.city || 'Siddipet',
    projectLocation: currentQuotation?.customer?.projectLocation || project?.customer?.projectLocation || project?.projectLocation || '',
  };
  const activeQuotationNumber = isQuotationActive ? currentQuotation.quotationNumber : project.quotationNumber;
  const activeDate = isQuotationActive ? currentQuotation.date : project.date;
  const activeSummary = isQuotationActive ? currentQuotation.summary : project.summary;

  const companyDisplayName = company?.name || (company as any)?.company_name || 'GALAXY INTERIORS';
  const companyPhone = company?.phone || '9652595384,9063909628';
  const companyAddress = company?.address || 'Opp : Eagle Statue siddipet';
  const companyTagline = company?.tagline || 'Home Interior Design Studio, We listen we create you enjoy';

  const grandTotal = activeSummary?.grandTotal || 0;

  // Use the shared grouping utility: Space → Item Type → Items
  const spaceGroups = groupItemsBySpaceAndType(activeItems, activeSpaces);


  return (
    <div
      ref={ref}
      id="quotation-printable-area"
      className="w-full max-w-[210mm] bg-white text-black font-sans mx-auto text-[11px] leading-tight border-2 border-black p-2 print:p-2 print:m-0 print:w-[210mm] print:border-2 print:border-black print:top-0 print:left-0 select-text"
      style={{ boxSizing: 'border-box' }}
    >
      {/* 1. Header Box */}
      <div className="border border-black mb-1">
        <div className="flex items-center justify-between p-2 border-b border-black">
          {/* Logo */}
          <div className="w-1/4 flex items-center justify-center">
            <img
              src="/vlr_traders_logo.jpg"
              alt="VLR Traders Logo"
              className="max-h-16 max-w-full object-contain rounded-full border border-black/20"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/nexvelt_logo.png';
              }}
            />
          </div>

          {/* Title & Tagline */}
          <div className="w-3/4 text-center">
            <p className="text-[10px] font-semibold text-slate-800 tracking-tight">{companyTagline}</p>
            <h1 className="text-2xl font-black uppercase text-[#D9381E] tracking-wider my-0.5 leading-none">
              {companyDisplayName}
            </h1>
            <p className="text-[10px] font-bold text-black">
              {companyAddress} &nbsp; Contact No : {companyPhone}
            </p>
          </div>
        </div>

        {/* Client & Project Details Grid */}
        <div className="grid grid-cols-12 text-[10.5px] font-semibold divide-x divide-black border-b border-black bg-white">
          <div className="col-span-8 p-1.5 space-y-1">
            <div className="grid grid-cols-12">
              <span className="col-span-3 font-bold text-black">Project ID</span>
              <span className="col-span-9 font-bold text-black">: {activeQuotationNumber || '109605'}</span>
            </div>
            <div className="grid grid-cols-12">
              <span className="col-span-3 font-bold text-black">Client Name</span>
              <span className="col-span-9 font-extrabold text-black">: {activeCustomer?.name || 'Valued Client'}</span>
            </div>
            <div className="grid grid-cols-12">
              <span className="col-span-3 font-bold text-black">Address</span>
              <span className="col-span-9 font-medium text-black">: {activeCustomer?.projectLocation || '-'}</span>
            </div>
            <div className="grid grid-cols-12">
              <span className="col-span-3 font-bold text-black">City</span>
              <span className="col-span-9 font-medium text-black">: {activeCustomer?.city || 'Siddipet'}</span>
            </div>
            <div className="grid grid-cols-12">
              <span className="col-span-3 font-bold text-black">Quote - Date</span>
              <span className="col-span-9 font-bold text-black">: {activeDate || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
            </div>
          </div>
          <div className="col-span-4 p-1.5 text-right flex flex-col justify-between">
            <span className="font-extrabold text-xs text-black">{activeQuotationNumber}</span>
            <span className="text-[9px] font-medium text-slate-600">Enterprise Quote</span>
          </div>
        </div>
      </div>

      {/* 2. Main Items Table (Space -> Item Type -> Items) */}
      <table className="w-full border-collapse border border-black text-[10px] text-black mb-1">
        <thead>
          <tr className="bg-black text-white font-extrabold uppercase text-[10px] text-center border-b border-black">
            <th className="py-1 px-1 border-r border-white/40 w-[4%]">#</th>
            <th className="py-1 px-1.5 border-r border-white/40 text-left w-[19%]">Item Name</th>
            <th className="py-1 px-1.5 border-r border-white/40 text-left w-[22%]">Specification</th>
            <th className="py-1 px-1 border-r border-white/40 w-[7%]">Height</th>
            <th className="py-1 px-1 border-r border-white/40 w-[7%]">Width</th>
            <th className="py-1 px-1 border-r border-white/40 w-[8%]">Area</th>
            <th className="py-1 px-1 border-r border-white/40 w-[9%]">Rate/Sq.ft</th>
            <th className="py-1 px-1 border-r border-white/40 w-[5%] font-bold">QTY</th>
            <th className="py-1 px-1.5 text-right w-[19%]">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {spaceGroups.length > 0 ? (
            spaceGroups.map((spaceGroup) => (
                <React.Fragment key={spaceGroup.spaceId}>
                  {/* SPACE HEADER ROW */}
                  <tr className="bg-slate-900 text-white font-black text-xs border-b-2 border-black">
                    <td colSpan={9} className="py-1.5 px-2 uppercase tracking-wider text-left bg-slate-900 text-cyan-300">
                      {spaceGroup.spaceName} ({spaceGroup.itemTypeGroups.reduce((n, g) => n + g.items.length, 0)})
                    </td>
                  </tr>

                  {/* ITEM ROWS: numbered 1..n per room, in the order they were added */}
                  {spaceGroup.itemTypeGroups
                    .flatMap((g) => g.items)
                    .sort((x: any, y: any) => (x.itemOrder ?? 0) - (y.itemOrder ?? 0))
                    .map((item: any, itemIdx: number) => {
                        const orderNum = itemIdx + 1;
                        const title = item.title || item.name || `Item #${orderNum}`;
                        const spec = resolveItemSpecification(item);
                        const height = formatDimension(item.height, item.heightFt, item.unit);
                        const width = formatDimension(item.width, item.widthFt, item.unit);
                        const area = item.areaSqFt ? `${item.areaSqFt.toFixed(1)} sq.ft` : '-';
                        const rate = item.rate ?? item.baseRate ?? item.effectiveRatePerUnit ?? 0;
                        const qty = item.quantity || item.qty || 1;
                        const subtotal = item.lineSubtotal || item.amount || 0;

                        return (
                          <tr key={item.id} className="border-b border-black/70 hover:bg-slate-50">
                            <td className="py-1 px-1 border-r border-black font-mono font-bold text-center">{orderNum}</td>
                            <td className="py-1 px-1.5 border-r border-black font-bold text-left">
                              {title}
                              {resolveItemType(item).toLowerCase() !== title.trim().toLowerCase() && (
                                <div className="text-[8.5px] font-semibold italic uppercase text-slate-500">{resolveItemType(item)}</div>
                              )}
                            </td>
                            <td className="py-1 px-1.5 border-r border-black text-left text-[9.5px] whitespace-pre-wrap break-words max-w-[22%]">{spec}</td>
                            <td className="py-1 px-1 border-r border-black text-center font-mono">{height}</td>
                            <td className="py-1 px-1 border-r border-black text-center font-mono">{width}</td>
                            <td className="py-1 px-1 border-r border-black text-center font-mono">{area}</td>
                            <td className="py-1 px-1 border-r border-black text-center font-mono">{rate ? formatINR(rate).replace('₹', '') : '-'}</td>
                            <td className="py-1 px-1 border-r border-black text-center font-semibold">{qty}</td>
                            <td className="py-1 px-1.5 text-right font-mono font-bold">{formatINR(subtotal).replace('₹', '')}</td>
                          </tr>
                        );
                    })}
                </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="py-4 text-center text-slate-500 italic">No items added to quotation</td>
            </tr>
          )}

          {/* ADJUSTMENT ROWS: only when present, so the grand total always reconciles with the items above */}
          {[
            { label: 'ITEMS SUBTOTAL', value: activeSummary?.itemsSubtotal || 0, show: (activeSummary?.additionalChargesTotal || 0) > 0 || (activeSummary?.discountAmount || 0) > 0 || (activeSummary?.taxAmount || 0) > 0, sign: '' },
            { label: 'ADDITIONAL CHARGES', value: activeSummary?.additionalChargesTotal || 0, show: (activeSummary?.additionalChargesTotal || 0) > 0, sign: '' },
            { label: 'DISCOUNT', value: activeSummary?.discountAmount || 0, show: (activeSummary?.discountAmount || 0) > 0, sign: '- ' },
            { label: 'TAX', value: activeSummary?.taxAmount || 0, show: (activeSummary?.taxAmount || 0) > 0, sign: '' },
          ]
            .filter((r) => r.show)
            .map((r) => (
              <tr key={r.label} className="border-t border-black text-xs font-bold">
                <td colSpan={8} className="py-1 px-3 text-right uppercase tracking-wider">{r.label}:</td>
                <td className="py-1 px-3 text-right font-mono">{r.sign}{formatINR(r.value).replace('₹', '')}</td>
              </tr>
            ))}

          {/* GRAND TOTAL ROW (HIGH CONTRAST, BOLD & BIG) */}
          <tr className="bg-slate-900 text-white font-black border-t-4 border-black">
            <td colSpan={8} className="py-2.5 px-3 text-left uppercase tracking-widest font-black text-sm text-cyan-300">
              GRAND TOTAL (ESTIMATED):
            </td>
            <td className="py-2.5 px-3 text-right font-mono font-black text-base text-yellow-300 grand-total-amount">
              {formatINR(grandTotal)}
            </td>
          </tr>

          {/* Terms & Final Notes */}
          <tr className="bg-white text-black font-extrabold text-[9.5px] border-b border-black">
            <td colSpan={9} className="py-1 px-2 text-left uppercase">
              NOTE : CIVIL WORKS , WALL PAPERS & GLASS WORK NOT INCLUDED IN THIS ESTIMATION .
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

A4PrintableInvoice.displayName = 'A4PrintableInvoice';
