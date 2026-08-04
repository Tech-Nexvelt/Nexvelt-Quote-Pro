import React, { forwardRef } from 'react';
import { useQuotationStore } from '@/store/useQuotationStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useCompanyStore } from '@/store/useCompanyStore';
import { formatINR } from '@/utils/currency';

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

  // Group items hierarchy: Space -> Item Type -> Items
  // Group by spaceId/spaceName first
  const spaceGroupMap: Record<string, { spaceName: string; spaceType?: string; items: any[] }> = {};

  activeItems.forEach((item) => {
    const sId = item.spaceId || 'space_general';
    const sName = item.spaceName || 'General';
    if (!spaceGroupMap[sId]) {
      spaceGroupMap[sId] = { spaceName: sName, items: [] };
    }
    spaceGroupMap[sId].items.push(item);
  });

  // Ensure defined spaces are preserved
  activeSpaces.forEach((s) => {
    if (!spaceGroupMap[s.id]) {
      spaceGroupMap[s.id] = { spaceName: s.spaceName, spaceType: s.spaceType, items: [] };
    } else {
      spaceGroupMap[s.id].spaceType = s.spaceType;
    }
  });

  const spaceGroups = Object.values(spaceGroupMap).filter((sg) => sg.items.length > 0);

  // Dynamic Material Details Extraction
  const extractedFinishes = Array.from(
    new Set(
      activeItems
        .map((i) => i.finish || i.shutterMaterialName || i.specification)
        .filter((val): val is string => Boolean(val) && val !== '-')
    )
  );

  const extractedMaterials = Array.from(
    new Set(
      activeItems
        .map((i) => i.material || i.carcassMaterialName)
        .filter((val): val is string => Boolean(val) && val !== '-')
    )
  );

  const extractedHardware = Array.from(
    new Set(
      activeItems
        .filter((i) => {
          const cat = (i.category || '').toLowerCase();
          return cat.includes('hardware') || cat.includes('accessories') || i.hardwarePackageName;
        })
        .map((i) => i.title || i.name || i.hardwarePackageName || i.specification)
        .filter((val): val is string => Boolean(val) && val !== '-')
    )
  );

  const dynamicLaminates = extractedFinishes.length > 0
    ? extractedFinishes.join(' | ')
    : '1 MM Upto 2000/- Any Brand. Inner Laminate (Fabric 0.8 mm)';

  const dynamicMaterials = extractedMaterials.length > 0
    ? extractedMaterials.join(' | ')
    : '18mm block board for all doors, HDMR Board';

  const dynamicHardware = extractedHardware.length > 0
    ? extractedHardware.join(' | ')
    : 'Hinges: Soft Close Hittech indian / Nimmi';

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
            <th className="py-1 px-1 border-r border-white/40 w-[5%]">#</th>
            <th className="py-1 px-1.5 border-r border-white/40 text-left w-[22%]">Item Name</th>
            <th className="py-1 px-1.5 border-r border-white/40 text-left w-[28%]">Specification</th>
            <th className="py-1 px-1 border-r border-white/40 w-[8%]">Height</th>
            <th className="py-1 px-1 border-r border-white/40 w-[8%]">Width</th>
            <th className="py-1 px-1 border-r border-white/40 w-[9%]">Area</th>
            <th className="py-1 px-1 border-r border-white/40 w-[6%] font-bold">QTY</th>
            <th className="py-1 px-1.5 text-right w-[14%]">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {spaceGroups.length > 0 ? (
            spaceGroups.map((spaceGroup) => {
              const spaceSubtotal = spaceGroup.items.reduce((acc, i) => acc + (i.lineSubtotal || i.amount || 0), 0);

              // Group items inside space by Item Type / Category
              const itemTypeMap: Record<string, any[]> = {};
              spaceGroup.items.forEach((item) => {
                const cat = item.category || 'General Work';
                if (!itemTypeMap[cat]) itemTypeMap[cat] = [];
                itemTypeMap[cat].push(item);
              });

              return (
                <React.Fragment key={spaceGroup.spaceName}>
                  {/* SPACE HEADER ROW */}
                  <tr className="bg-slate-900 text-white font-black text-xs border-b-2 border-black">
                    <td colSpan={8} className="py-1.5 px-2 uppercase tracking-wider text-left bg-slate-900 text-cyan-300">
                      SPACE: {spaceGroup.spaceName} {spaceGroup.spaceType ? `[${spaceGroup.spaceType}]` : ''}
                    </td>
                  </tr>

                  {/* ITEM TYPE GROUPS WITHIN SPACE */}
                  {Object.entries(itemTypeMap).map(([itemType, typeItems]) => (
                    <React.Fragment key={itemType}>
                      {/* ITEM TYPE SUBHEADER */}
                      <tr className="bg-slate-200 text-slate-900 font-extrabold text-[10px] border-b border-black">
                        <td colSpan={8} className="py-1 px-3 uppercase tracking-wide text-left italic">
                          {itemType} ({typeItems.length})
                        </td>
                      </tr>

                      {/* ITEM ROWS WITH INDEPENDENT CATEGORY/SPACE NUMBERING */}
                      {typeItems.map((item, itemIdx) => {
                        const orderNum = itemIdx + 1;
                        const title = item.title || item.name || `Item #${orderNum}`;
                        const spec = item.specification || item.finish || item.shutterMaterialName || item.material || item.subtitle || '-';
                        const height = item.heightFt ? `${item.heightFt.toFixed(1)}'` : item.height || '-';
                        const width = item.widthFt ? `${item.widthFt.toFixed(1)}'` : item.width || '-';
                        const area = item.areaSqFt ? `${item.areaSqFt.toFixed(1)} sq.ft` : '-';
                        const qty = item.quantity || item.qty || 1;
                        const subtotal = item.lineSubtotal || item.amount || 0;

                        return (
                          <tr key={item.id} className="border-b border-black/70 hover:bg-slate-50">
                            <td className="py-1 px-1 border-r border-black font-mono font-bold text-center">{orderNum}</td>
                            <td className="py-1 px-1.5 border-r border-black font-bold text-left">{title}</td>
                            <td className="py-1 px-1.5 border-r border-black text-left text-[9.5px]">{spec}</td>
                            <td className="py-1 px-1 border-r border-black text-center font-mono">{height}</td>
                            <td className="py-1 px-1 border-r border-black text-center font-mono">{width}</td>
                            <td className="py-1 px-1 border-r border-black text-center font-mono">{area}</td>
                            <td className="py-1 px-1 border-r border-black text-center font-semibold">{qty}</td>
                            <td className="py-1 px-1.5 text-right font-mono font-bold">{formatINR(subtotal).replace('₹', '')}</td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  ))}

                  {/* SPACE SUBTOTAL ROW (HIGHLIGHTED, BOLD & BIG) */}
                  <tr className="bg-[#E6F7F7] text-slate-900 font-black text-xs border-y-2 border-black">
                    <td colSpan={7} className="py-2 px-3 text-right uppercase tracking-wider font-black text-xs text-slate-900">
                      {spaceGroup.spaceName.toUpperCase()} TOTAL SUBTOTAL:
                    </td>
                    <td className="py-2 px-2 text-right font-mono font-black text-sm text-[#008080]">
                      {formatINR(spaceSubtotal).replace('₹', '')}
                    </td>
                  </tr>
                </React.Fragment>
              );
            })
          ) : (
            <tr>
              <td colSpan={8} className="py-4 text-center text-slate-500 italic">No items added to quotation</td>
            </tr>
          )}

          {/* GRAND TOTAL ROW (HIGH CONTRAST, BOLD & BIG) */}
          <tr className="bg-slate-900 text-white font-black border-t-4 border-black">
            <td colSpan={7} className="py-2.5 px-3 text-left uppercase tracking-widest font-black text-sm text-cyan-300">
              GRAND TOTAL (ESTIMATED):
            </td>
            <td className="py-2.5 px-3 text-right font-mono font-black text-base text-yellow-300">
              {formatINR(grandTotal)}
            </td>
          </tr>

          {/* Terms & Final Notes */}
          <tr className="bg-white text-black font-extrabold text-[9.5px] border-b border-black">
            <td colSpan={8} className="py-1 px-2 text-left uppercase">
              NOTE : CIVIL WORKS , WALL PAPERS & GLASS WORK NOT INCLUDED IN THIS ESTIMATION .
            </td>
          </tr>
        </tbody>
      </table>

      {/* 3. Summary of Material Details Table */}
      <div className="border border-black mt-2">
        <div className="bg-black text-white font-extrabold text-xs text-center py-1 border-b border-black uppercase tracking-wider">
          Summary of Material Details:
        </div>
        <table className="w-full border-collapse text-[10px] text-black">
          <tbody>
            <tr className="border-b border-black">
              <td className="w-1/4 p-1.5 border-r border-black font-bold text-right bg-slate-50">Laminates / Finishes :</td>
              <td className="w-3/4 p-1.5 font-medium">{dynamicLaminates}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="p-1.5 border-r border-black font-bold text-right bg-slate-50">Materials / Core Board :</td>
              <td className="p-1.5 font-medium">{dynamicMaterials}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="p-1.5 border-r border-black font-bold text-right bg-slate-50">Hardware & Accessories :</td>
              <td className="p-1.5 font-medium">{dynamicHardware}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="p-1.5 border-r border-black font-bold text-right bg-slate-50">PAYMENT TERMS :</td>
              <td className="p-1.5 font-medium whitespace-pre-line">
                {currentQuotation?.termsAndConditions || '10% Signup payment , 50% in production, 30% before lamination, 10% before handover'}
              </td>
            </tr>
            <tr>
              <td className="p-1.5 border-r border-black font-bold text-right bg-slate-50">NOTE :</td>
              <td className="p-1.5 font-medium">
                {currentQuotation?.notes || 'Any Extra work will be added as per sft price , Any add-ons will be charged in Laminates or Hardware as per cost.'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
});

A4PrintableInvoice.displayName = 'A4PrintableInvoice';
