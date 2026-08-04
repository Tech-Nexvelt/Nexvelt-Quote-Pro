import React, { useState } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { getStoredTemplates } from '@/storage/templateStore';
import { FurnitureTemplate } from '@/types/enterprise';
import { Bookmark, Star, Plus, Check } from 'lucide-react';

export const MyTemplatesModule: React.FC = () => {
  const { addToast, setCurrentView } = useUIStore();
  const [templates] = useState<FurnitureTemplate[]>(getStoredTemplates().filter((t) => t.isFavorite));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-[#E2E8F0] p-5 rounded-xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E6F7F7] text-[#00B8B8] flex items-center justify-center font-bold">
            <Bookmark className="w-5 h-5 text-[#00B8B8]" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-[#111827]">My Saved Preset Templates</h1>
            <p className="text-xs text-[#4B5563]">Your favorite custom furniture models for 1-click quotation entry</p>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('templates')}
          className="h-10 px-4 bg-[#00D9D9] hover:bg-[#00B8B8] text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Browse All Templates
        </button>
      </div>

      {/* Favorites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-[#E2E8F0] text-xs text-[#6B7280]">
            No favorite templates marked yet. Star any template in the Templates Library to save it here.
          </div>
        ) : (
          templates.map((t) => (
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
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
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

              <div className="pt-3 border-t border-[#F1F5F9] flex justify-end">
                <button
                  onClick={() => {
                    setCurrentView('builder');
                    addToast({ type: 'success', title: 'Applied Template', message: `Loaded ${t.name} into Quotation Builder.` });
                  }}
                  className="w-full py-2 text-xs font-bold bg-[#00D9D9] hover:bg-[#00B8B8] text-white rounded-lg transition shadow-xs flex items-center justify-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Use Template
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
