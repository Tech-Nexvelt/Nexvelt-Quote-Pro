import React from 'react';
import { useProjectStore } from '@/store/useProjectStore';
import { useUIStore } from '@/store/useUIStore';
import { Card } from '@/components/ui/Card';
import { Layers } from 'lucide-react';

interface FurniturePreset {
  id: string;
  image: string;
  name: string;
  category: string;
  defaultHeight: number;
  defaultWidth: number;
  defaultDepth: number;
  defaultRate: number;
}

const TEMPLATES: FurniturePreset[] = [
  { id: 't_wardrobe_2d', image: '/furniture/wardrobe_2door.png', name: '2-Door Wardrobe', category: 'Wardrobe', defaultHeight: 7, defaultWidth: 4, defaultDepth: 24, defaultRate: 1350 },
  { id: 't_wardrobe_3d', image: '/furniture/wardrobe_3door.png', name: '3-Door Wardrobe', category: 'Wardrobe', defaultHeight: 7, defaultWidth: 6, defaultDepth: 24, defaultRate: 1400 },
  { id: 't_wardrobe_4d', image: '/furniture/wardrobe_4door.png', name: '4-Door Master Wardrobe', category: 'Wardrobe', defaultHeight: 8, defaultWidth: 8, defaultDepth: 24, defaultRate: 1450 },
  { id: 't_sliding_w', image: '/furniture/wardrobe_sliding.png', name: 'Sliding Door Wardrobe', category: 'Wardrobe', defaultHeight: 8, defaultWidth: 8, defaultDepth: 24, defaultRate: 1650 },
  { id: 't_kitchen_l', image: '/furniture/kitchen_lshape.png', name: 'L-Shaped Modular Kitchen', category: 'Kitchen', defaultHeight: 7, defaultWidth: 12, defaultDepth: 22, defaultRate: 1550 },
  { id: 't_kitchen_parallel', image: '/furniture/kitchen_parallel.png', name: 'Parallel Modular Kitchen', category: 'Kitchen', defaultHeight: 7, defaultWidth: 10, defaultDepth: 22, defaultRate: 1500 },
  { id: 't_tv_unit', image: '/furniture/tv_unit_floating.png', name: 'Floating TV Wall Unit', category: 'TV Unit', defaultHeight: 6, defaultWidth: 8, defaultDepth: 16, defaultRate: 1350 },
  { id: 't_pooja', image: '/furniture/pooja_unit_teak.png', name: 'Teak Wooden Pooja Unit', category: 'Pooja Unit', defaultHeight: 6, defaultWidth: 4, defaultDepth: 18, defaultRate: 1600 },
  { id: 't_shoe_rack', image: '/furniture/shoe_cabinet_entry.png', name: 'Entryway Shoe Cabinet', category: 'Storage', defaultHeight: 4, defaultWidth: 3.5, defaultDepth: 14, defaultRate: 1250 },
  { id: 't_study_table', image: '/furniture/study_table_book.png', name: 'Study Table & Bookshelf', category: 'Study', defaultHeight: 6.5, defaultWidth: 5, defaultDepth: 20, defaultRate: 1300 },
];

export const FurnitureTemplateGrid: React.FC = () => {
  const { addProduct, selectProduct } = useProjectStore();
  const { addToast } = useUIStore();

  const handleSelectTemplate = (t: FurniturePreset) => {
    const newProduct = addProduct({
      templateId: t.id,
      category: t.category,
      name: t.name,
      previewImage: t.image,
      heightFt: t.defaultHeight,
      widthFt: t.defaultWidth,
      depthIn: t.defaultDepth,
      areaSqFt: t.defaultHeight * t.defaultWidth,
      pricingModel: 'sqft',
      baseRate: t.defaultRate,
      quantity: 1,
      carcassMaterialName: '18mm HDMR Water Resistant Board',
      shutterMaterialName: '18mm HDMR with Premium Laminate',
    });
    selectProduct(newProduct.id);
    addToast({
      type: 'success',
      title: 'Furniture Item Added',
      message: `Added ${t.name} to quotation.`,
    });
  };

  return (
    <Card className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#E0F7F7] text-[#00B8B8]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-[20px] font-extrabold text-[#111827] leading-tight">
              Select Furniture Template
            </h2>
            <p className="text-[13px] text-[#6B7280] font-medium mt-0.5">
              Click any template to add to quotation in 1 second.
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-[#00B8B8] hover:underline cursor-pointer">1-Click Quick Add</span>
      </div>

      {/* 2 Rows of 5 Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
        {TEMPLATES.map((t) => (
          <div
            key={t.id}
            onClick={() => handleSelectTemplate(t)}
            className="group flex flex-col rounded-2xl border border-[#E5E7EB] hover:border-[#00D9D9] bg-white overflow-hidden shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer"
          >
            {/* Real Product Render Image */}
            <div className="h-28 w-full bg-[#F8FAFC] overflow-hidden relative">
              <img
                src={t.image}
                alt={t.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Title & Dimensions Subtext */}
            <div className="p-3 text-center bg-white border-t border-[#F1F5F9]">
              <h4 className="text-xs font-bold text-[#111827] line-clamp-1 group-hover:text-[#00B8B8]">
                {t.name}
              </h4>
              <p className="text-[11px] text-[#6B7280] font-mono mt-1">
                {t.defaultHeight}' × {t.defaultWidth}' @ ₹{t.defaultRate}/sq.ft
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
