import React, { useState } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { getStoredTemplates, saveStoredTemplates } from '@/storage/templateStore';
import { FurnitureTemplate } from '@/types/enterprise';
import { Layers, Search, Star, Copy, Plus, Check } from 'lucide-react';

export const TemplatesModule: React.FC = () => {
  const { addToast, setCurrentView } = useUIStore();
  const [templates, setTemplates] = useState<FurnitureTemplate[]>(getStoredTemplates());
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Wardrobe', 'Kitchen', 'TV Unit', 'Study Table', 'Reception', 'Office Furniture'];

  const filtered = templates.filter((t) => {
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleFavorite = (id: string) => {
    const updated = templates.map((t) => (t.id === id ? { ...t, isFavorite: !t.isFavorite } : t));
    setTemplates(updated);
    saveStoredTemplates(updated);
    addToast({ type: 'info', title: 'Updated Favorite', message: 'Saved template preference.' });
  };

  const duplicateTemplate = (template: FurnitureTemplate) => {
    const cloned: FurnitureTemplate = {
      ...JSON.parse(JSON.stringify(template)),
      id: `tpl-${Date.now()}`,
      name: `${template.name} (Copy)`,
      isFavorite: false,
    };
    const updated = [cloned, ...templates];
    setTemplates(updated);
    saveStoredTemplates(updated);
    addToast({ type: 'success', title: 'Template Duplicated', message: `Created copy of ${template.name}` });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-[#E2E8F0] p-5 rounded-xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E6F7F7] text-[#00B8B8] flex items-center justify-center font-bold">
            <Layers className="w-5 h-5 text-[#00B8B8]" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-[#111827]">Furniture Template Library</h1>
            <p className="text-xs text-[#4B5563]">Pre-configured modular models with standard dimensions & hardware specs</p>
          </div>
        </div>

        <button
          onClick={() => {
            const newTpl: FurnitureTemplate = {
              id: `tpl-${Date.now()}`,
              name: 'Custom New Template',
              category: 'Wardrobe',
              isFavorite: false,
              dimensions: { unit: 'ft-in', widthFt: 6, heightFt: 7, depthIn: 24, feet: 6, inches: 0 },
              defaultBoxWork: { boxType: 'Wardrobe Box', boardType: 'HDMR', boardThicknessMm: 18, unitRate: 450 },
              defaultShutters: { shutterType: 'Openable / Hinged', finishType: '1mm Laminate', coreBoard: '18mm HDMR', unitRate: 500 },
              defaultHardware: [],
              defaultLabour: [],
            };
            const updated = [newTpl, ...templates];
            setTemplates(updated);
            saveStoredTemplates(updated);
            addToast({ type: 'success', title: 'Template Created', message: 'Added new template to library.' });
          }}
          className="h-10 px-4 bg-[#00D9D9] hover:bg-[#00B8B8] text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Create Template
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
                selectedCategory === cat
                  ? 'bg-[#00D9D9] text-white shadow-xs'
                  : 'bg-white text-[#4B5563] hover:text-[#111827] border border-[#E2E8F0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-64">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-[#E2E8F0] rounded-lg text-[#111827] focus:outline-none focus:border-[#00D9D9]"
          />
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="bg-white border border-[#E2E8F0] hover:border-[#00D9D9] p-5 rounded-xl shadow-xs transition space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-[#008080] bg-[#E6F7F7] px-2 py-0.5 rounded font-mono uppercase">
                    {t.category}
                  </span>
                  <h3 className="text-sm font-extrabold text-[#111827] mt-1">{t.name}</h3>
                </div>
                <button
                  onClick={() => toggleFavorite(t.id)}
                  className="text-amber-400 hover:scale-110 transition p-1"
                >
                  <Star className={`w-4 h-4 ${t.isFavorite ? 'fill-amber-400' : 'text-[#9CA3AF]'}`} />
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-[#374151] pt-2 border-t border-[#F1F5F9]">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Dimensions:</span>
                  <span className="font-mono font-semibold text-[#111827]">
                    {(t.dimensions.widthFt || t.dimensions.feet || 6)}' W × {(t.dimensions.heightFt || 7)}' H × {(t.dimensions.depthIn || 24)}" D
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Carcass Board:</span>
                  <span className="font-medium text-[#111827]">{t.defaultBoxWork?.boardType || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Shutter Finish:</span>
                  <span className="font-medium text-[#111827]">{t.defaultShutters?.finishType || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#F1F5F9]">
              <button
                onClick={() => duplicateTemplate(t)}
                className="px-3 py-1.5 text-xs font-semibold text-[#374151] hover:text-[#111827] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg transition flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" /> Duplicate
              </button>
              <button
                onClick={() => {
                  setCurrentView('builder');
                  addToast({ type: 'success', title: 'Applied Template', message: `Loaded ${t.name} into Quotation Builder.` });
                }}
                className="px-4 py-1.5 text-xs font-bold bg-[#00D9D9] hover:bg-[#00B8B8] text-white rounded-lg transition shadow-xs flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" /> Use Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
