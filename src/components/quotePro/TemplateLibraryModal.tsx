import React, { useState } from 'react';
import { Layers, Plus, Check } from 'lucide-react';

export interface FurnitureTemplateItem {
  id: string;
  name: string;
  category: string;
  defaultDimensions: string;
  estimatedArea: string;
  suggestedRate: number;
  materials: string[];
  finishes: string[];
  hardwareSummary: string;
}

export const TEMPLATE_LIBRARY: FurnitureTemplateItem[] = [
  {
    id: 'tpl-1',
    name: 'Standard 2-Door Wardrobe (Carcass + Shutters)',
    category: 'Wardrobes',
    defaultDimensions: '1200 x 2100 x 600 mm',
    estimatedArea: '27.13 Sq.ft',
    suggestedRate: 1450,
    materials: ['18mm HDMR Board', '8mm Backing Ply'],
    finishes: ['1mm High Gloss Laminate', 'Inner Fabric Finish'],
    hardwareSummary: 'Soft close hinges (4 pcs), Stainless handles (2 pcs)',
  },
  {
    id: 'tpl-2',
    name: '3-Door Sliding Wardrobe with Loft',
    category: 'Wardrobes',
    defaultDimensions: '2400 x 2700 x 600 mm',
    estimatedArea: '69.75 Sq.ft',
    suggestedRate: 1650,
    materials: ['18mm HDMR Board', 'Heavy Duty Aluminum Channel'],
    finishes: ['Acrylic Finish Shutters', 'Inner Suede Finish'],
    hardwareSummary: 'Heavy duty sliding track mechanism, Soft close dampers',
  },
  {
    id: 'tpl-3',
    name: 'L-Shape Modular Kitchen Base & Wall Units',
    category: 'Kitchen',
    defaultDimensions: '3000 x 2100 x 600 mm',
    estimatedArea: '67.81 Sq.ft',
    suggestedRate: 1750,
    materials: ['18mm Marine Plywood IS:710'],
    finishes: ['PU Paint Gloss Shutters', 'White Laminate Inner'],
    hardwareSummary: 'Tandem drawer boxes (6 pcs), Corner carousel unit',
  },
  {
    id: 'tpl-4',
    name: 'Modern Floating TV Unit with Fluted Panelling',
    category: 'TV Units',
    defaultDimensions: '2100 x 1800 x 400 mm',
    estimatedArea: '40.69 Sq.ft',
    suggestedRate: 1550,
    materials: ['18mm HDMR Board', 'Charcoal Louvers Panelling'],
    finishes: ['Veneer Polish', 'Smoked Mirror Accents'],
    hardwareSummary: 'Wire manager grommets, Push-to-open drawer channels',
  },
];

interface TemplateLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (template: FurnitureTemplateItem) => void;
}

export const TemplateLibraryModal: React.FC<TemplateLibraryModalProps> = ({
  isOpen,
  onClose,
  onApplyTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Wardrobes', 'Kitchen', 'TV Units'];

  const filteredTemplates =
    selectedCategory === 'All'
      ? TEMPLATE_LIBRARY
      : TEMPLATE_LIBRARY.filter((t) => t.category === selectedCategory);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl text-[#111827]">
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E6F7F7] border border-[#00D9D9]/30 flex items-center justify-center text-[#008080]">
              <Layers className="w-4 h-4 text-[#00B8B8]" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#111827]">Furniture Template Library</h2>
              <p className="text-xs font-semibold text-[#4B5563]">Pre-configured furniture assemblies with specifications</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#6B7280] hover:text-[#111827] text-lg font-bold">
            ✕
          </button>
        </div>

        {/* Category Tabs Filter */}
        <div className="p-3 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#00D9D9] text-white shadow-2xs'
                  : 'bg-white border border-[#E2E8F0] text-[#4B5563] hover:text-[#111827]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="p-5 flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTemplates.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#00D9D9] rounded-xl p-4 transition flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold font-mono text-[#008080] bg-[#E6F7F7] px-2 py-0.5 rounded uppercase">
                    {tpl.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#00B8B8]">₹{tpl.suggestedRate} / sq.ft</span>
                </div>

                <h3 className="text-sm font-extrabold text-[#111827]">{tpl.name}</h3>

                <div className="text-xs text-[#4B5563] space-y-1 font-medium">
                  <p>Dimensions: <span className="font-bold text-[#111827] font-mono">{tpl.defaultDimensions}</span></p>
                  <p>Est. Area: <span className="font-bold text-[#111827] font-mono">{tpl.estimatedArea}</span></p>
                  <p>Materials: <span className="font-bold text-[#111827]">{tpl.materials.join(', ')}</span></p>
                  <p>Finishes: <span className="font-bold text-[#111827]">{tpl.finishes.join(', ')}</span></p>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                <span className="text-[11px] text-[#4B5563] truncate pr-2 font-medium">{tpl.hardwareSummary}</span>
                <button
                  onClick={() => {
                    onApplyTemplate(tpl);
                    onClose();
                  }}
                  className="px-3 py-1.5 text-xs font-bold bg-[#00D9D9] hover:bg-[#00B8B8] text-white rounded-lg transition shrink-0 flex items-center gap-1 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E2E8F0] flex items-center justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#111827] font-bold text-xs rounded-lg">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
