import React, { useState } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { Box, Search, Plus, Filter, Tag } from 'lucide-react';

interface ProductItem {
  id: string;
  name: string;
  category: string;
  baseRateSqFt: number;
  carcassMat: string;
  shutterFinish: string;
  previewImage: string;
}

export const ProductsModule: React.FC = () => {
  const { addToast, setCurrentView } = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const products: ProductItem[] = [
    { id: 'p1', name: '4-Door Hinged Master Wardrobe', category: 'Wardrobe', baseRateSqFt: 1450, carcassMat: '18mm HDMR', shutterFinish: '1mm Merino Laminate', previewImage: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=300&auto=format&fit=crop&q=80' },
    { id: 'p2', name: '3-Door Sliding Wardrobe with Top-Hung Track', category: 'Wardrobe', baseRateSqFt: 1650, carcassMat: '18mm HDMR', shutterFinish: '2mm Acrylic Sheet', previewImage: 'https://images.unsplash.com/photo-1558882224-dda166733046?w=300&auto=format&fit=crop&q=80' },
    { id: 'p3', name: 'L-Shaped Modular Kitchen Base Cabinets', category: 'Kitchen', baseRateSqFt: 1550, carcassMat: '18mm BWP Marine Ply', shutterFinish: 'Acrylic Finish', previewImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=300&auto=format&fit=crop&q=80' },
    { id: 'p4', name: 'Floating TV Console with Louvered Backing', category: 'TV Unit', baseRateSqFt: 1350, carcassMat: '18mm HDMR', shutterFinish: 'PU Paint Gloss', previewImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&auto=format&fit=crop&q=80' },
    { id: 'p5', name: 'Teak Wooden Pooja Mandir Unit', category: 'Pooja Unit', baseRateSqFt: 1800, carcassMat: '18mm Teak Ply', shutterFinish: 'Veneer + PU Polish', previewImage: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=300&auto=format&fit=crop&q=80' },
    { id: 'p6', name: 'Executive Home Study Desk & Pedestal', category: 'Study', baseRateSqFt: 1250, carcassMat: '18mm Commercial Ply', shutterFinish: '1mm Matte Laminate', previewImage: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=300&auto=format&fit=crop&q=80' },
  ];

  const categories = ['All', 'Wardrobe', 'Kitchen', 'TV Unit', 'Pooja Unit', 'Study'];

  const filtered = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-[#E2E8F0] p-5 rounded-xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E6F7F7] text-[#00B8B8] flex items-center justify-center font-bold">
            <Box className="w-5 h-5 text-[#00B8B8]" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-[#111827]">Standard Product Catalogue</h1>
            <p className="text-xs text-[#4B5563]">Browse pre-priced furniture modules and standard specifications</p>
          </div>
        </div>

        <button
          onClick={() => addToast({ type: 'info', title: 'Add Product', message: 'Opened product creation form.' })}
          className="h-10 px-4 bg-[#00D9D9] hover:bg-[#00B8B8] text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Product SKU
        </button>
      </div>

      {/* Filter & Search */}
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
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-[#E2E8F0] rounded-lg text-[#111827] focus:outline-none focus:border-[#00D9D9]"
          />
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="bg-white border border-[#E2E8F0] hover:border-[#00D9D9] rounded-xl overflow-hidden shadow-xs transition group flex flex-col justify-between"
          >
            <div>
              <div className="h-44 w-full bg-[#F8FAFC] overflow-hidden relative">
                <img
                  src={p.previewImage}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 right-3 text-[10px] font-bold font-mono bg-[#E0F7F7] text-[#008080] px-2 py-0.5 rounded shadow-xs">
                  {p.category}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="text-sm font-extrabold text-[#111827] group-hover:text-[#00B8B8] transition">
                  {p.name}
                </h3>
                <div className="space-y-1 text-xs text-[#374151] pt-2 border-t border-[#F1F5F9]">
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Carcass:</span>
                    <span className="font-medium text-[#111827]">{p.carcassMat}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Shutter:</span>
                    <span className="font-medium text-[#111827]">{p.shutterFinish}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#6B7280] block uppercase font-mono">Standard Rate</span>
                <span className="text-sm font-extrabold font-mono text-[#00B8B8]">₹{p.baseRateSqFt}/sq.ft</span>
              </div>
              <button
                onClick={() => {
                  setCurrentView('builder');
                  addToast({ type: 'success', title: 'Product Selected', message: `Added ${p.name} to active quote.` });
                }}
                className="px-3 py-1.5 bg-[#00D9D9] hover:bg-[#00B8B8] text-white text-xs font-bold rounded-lg transition"
              >
                Add to Quote
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
