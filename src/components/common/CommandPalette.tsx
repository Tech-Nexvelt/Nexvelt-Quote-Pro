import React, { useState } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useCatalogStore } from '@/store/useCatalogStore';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Search, Box, Folder, Layers, Wrench, Printer, FileDown, Plus } from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setCommandPaletteOpen, setPrintPreviewOpen, setCurrentView, addToast } = useUIStore();
  const { project, selectProduct, selectRoom, addProduct } = useProjectStore();
  const { materials, hardware } = useCatalogStore();
  const [query, setQuery] = useState('');

  if (!isCommandPaletteOpen) return null;

  const q = query.toLowerCase().trim();

  // Matched items
  const matchedProducts = project.products.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  const matchedRooms = project.rooms.filter((r) => r.name.toLowerCase().includes(q));

  const handleSelectProduct = (prodId: string, roomId: string) => {
    selectRoom(roomId);
    selectProduct(prodId);
    setCurrentView('builder');
    setCommandPaletteOpen(false);
    setQuery('');
  };

  const handleRunCommand = (cmd: string) => {
    setCommandPaletteOpen(false);
    setQuery('');

    if (cmd === 'print' || cmd === 'export') {
      setPrintPreviewOpen(true);
    } else if (cmd === 'add_product') {
      const newP = addProduct({ category: 'Wardrobe', name: 'Custom Cabinet', baseRate: 1450 });
      addToast({ type: 'success', title: 'Product Created', message: 'Added product to project tree.' });
    }
  };

  return (
    <Modal
      isOpen={isCommandPaletteOpen}
      onClose={() => setCommandPaletteOpen(false)}
      title="Command Palette & Quick Search"
      subtitle="Press Esc to close • Instant search products, rooms, materials, and actions"
      maxWidth="xl"
    >
      <div className="space-y-4">
        <Input
          placeholder="Type a command or search product..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          prefixSymbol="🔍"
          autoFocus
        />

        <div className="max-h-64 overflow-y-auto space-y-3 text-xs">
          {/* Quick Actions Header */}
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block px-1 mb-1">Actions</span>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => handleRunCommand('export')}
                className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 font-medium"
              >
                <FileDown className="w-4 h-4 text-[#00D9D9]" />
                <span>Generate & Export Quotation PDF</span>
              </button>
              <button
                type="button"
                onClick={() => handleRunCommand('print')}
                className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 font-medium"
              >
                <Printer className="w-4 h-4 text-sky-500" />
                <span>Print A4 Invoice</span>
              </button>
              <button
                type="button"
                onClick={() => handleRunCommand('add_product')}
                className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 font-medium"
              >
                <Plus className="w-4 h-4 text-emerald-500" />
                <span>Create New Product Line Object</span>
              </button>
            </div>
          </div>

          {/* Matched Products */}
          {matchedProducts.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block px-1 mb-1">Products</span>
              <div className="space-y-1">
                {matchedProducts.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectProduct(p.id, p.roomId)}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <Box className="w-4 h-4 text-[#00B8B8]" />
                      <span>{p.name}</span>
                    </div>
                    <span className="font-mono text-slate-400">{p.heightFt}' × {p.widthFt}'</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
