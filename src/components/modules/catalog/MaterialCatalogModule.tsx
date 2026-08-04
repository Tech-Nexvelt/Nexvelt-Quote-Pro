import React, { useState } from 'react';
import { useCatalogStore } from '@/store/useCatalogStore';
import { useUIStore } from '@/store/useUIStore';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Layers, Plus, Trash2 } from 'lucide-react';

export const MaterialCatalogModule: React.FC = () => {
  const { materials, hardware, addMaterial, deleteMaterial, addHardware, deleteHardware } = useCatalogStore();
  const { addToast } = useUIStore();

  const [activeTab, setActiveTab] = useState<'materials' | 'hardware'>('materials');
  const [isMatModalOpen, setIsMatModalOpen] = useState(false);
  const [isHwModalOpen, setIsHwModalOpen] = useState(false);

  // New Material Form
  const [matName, setMatName] = useState('');
  const [matType, setMatType] = useState<'carcass' | 'shutter' | 'both'>('shutter');
  const [matCategory, setMatCategory] = useState('Laminate');
  const [matBrand, setMatBrand] = useState('Merino');
  const [matRate, setMatRate] = useState(0);

  // New Hardware Form
  const [hwName, setHwName] = useState('');
  const [hwBrand, setHwBrand] = useState('Hettich');
  const [hwDesc, setHwDesc] = useState('');
  const [hwPrice, setHwPrice] = useState(1500);

  const handleAddMat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matName.trim()) return;
    addMaterial({
      name: matName,
      type: matType,
      category: matCategory,
      brand: matBrand,
      rateModifierSqFt: matRate,
    });
    setIsMatModalOpen(false);
    setMatName('');
    addToast({ type: 'success', title: 'Material Added', message: `${matName} added to catalog.` });
  };

  const handleAddHw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hwName.trim()) return;
    addHardware({
      name: hwName,
      brand: hwBrand,
      description: hwDesc,
      packagePricePerUnit: hwPrice,
    });
    setIsHwModalOpen(false);
    setHwName('');
    addToast({ type: 'success', title: 'Hardware Package Added', message: `${hwName} added to catalog.` });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#111827] flex items-center gap-2">
            <Layers className="w-6 h-6 text-[#00B8B8]" />
            Materials & Hardware Library
          </h2>
          <p className="text-xs font-semibold text-[#4B5563] mt-0.5">
            Configure default rate add-ons for carcass boards, shutter finishes, and branded hardware fittings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#F1F5F9] p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('materials')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
                activeTab === 'materials' ? 'bg-white text-[#111827] shadow-xs' : 'text-[#4B5563]'
              }`}
            >
              Materials ({materials.length})
            </button>
            <button
              onClick={() => setActiveTab('hardware')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
                activeTab === 'hardware' ? 'bg-white text-[#111827] shadow-xs' : 'text-[#4B5563]'
              }`}
            >
              Hardware ({hardware.length})
            </button>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => (activeTab === 'materials' ? setIsMatModalOpen(true) : setIsHwModalOpen(true))}
          >
            Add {activeTab === 'materials' ? 'Material' : 'Hardware'}
          </Button>
        </div>
      </div>

      {activeTab === 'materials' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map((m) => (
            <Card key={m.id} glass className="space-y-3 relative">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant={m.type === 'shutter' ? 'cyan' : 'amber'}>{m.type} finish</Badge>
                  <h4 className="text-sm font-extrabold text-[#111827] mt-1.5">{m.name}</h4>
                  <p className="text-xs font-semibold text-[#4B5563]">{m.brand} • {m.category}</p>
                </div>
                <button onClick={() => deleteMaterial(m.id)} className="text-[#9CA3AF] hover:text-red-500 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-2 border-t border-[#E2E8F0] text-xs flex items-center justify-between font-mono">
                <span className="text-[#4B5563] font-semibold">Rate Adjustment:</span>
                <span className="font-extrabold text-[#008080]">
                  {m.rateModifierSqFt >= 0 ? `+₹${m.rateModifierSqFt}` : `-₹${Math.abs(m.rateModifierSqFt)}`} / sq.ft
                </span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hardware.map((h) => (
            <Card key={h.id} glass className="space-y-3 relative">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="cyan">{h.brand}</Badge>
                  <h4 className="text-sm font-extrabold text-[#111827] mt-1.5">{h.name}</h4>
                  <p className="text-xs font-semibold text-[#4B5563]">{h.description}</p>
                </div>
                <button onClick={() => deleteHardware(h.id)} className="text-[#9CA3AF] hover:text-red-500 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-2 border-t border-[#E2E8F0] text-xs flex items-center justify-between font-mono">
                <span className="text-[#4B5563] font-semibold">Package Flat Cost:</span>
                <span className="font-extrabold text-[#008080]">
                  +₹{h.packagePricePerUnit} / unit
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Material Modal */}
      <Modal isOpen={isMatModalOpen} onClose={() => setIsMatModalOpen(false)} title="Add Material Option">
        <form onSubmit={handleAddMat} className="space-y-4">
          <Input label="Material Name" value={matName} onChange={(e) => setMatName(e.target.value)} required />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Application Type"
              value={matType}
              onChange={(val) => setMatType(val as any)}
              options={[
                { value: 'shutter', label: 'Shutter Door Finish' },
                { value: 'carcass', label: 'Carcass Structure Board' },
                { value: 'both', label: 'Both / Universal' },
              ]}
            />
            <Input label="Category (Laminate, Acrylic, etc.)" value={matCategory} onChange={(e) => setMatCategory(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Brand Name" value={matBrand} onChange={(e) => setMatBrand(e.target.value)} />
            <Input
              label="Rate Modifier (₹ / sq.ft)"
              type="number"
              value={matRate}
              onChange={(e) => setMatRate(parseFloat(e.target.value) || 0)}
              prefixSymbol="₹"
            />
          </div>
          <div className="pt-3 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsMatModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Material</Button>
          </div>
        </form>
      </Modal>

      {/* Add Hardware Modal */}
      <Modal isOpen={isHwModalOpen} onClose={() => setIsHwModalOpen(false)} title="Add Hardware Package">
        <form onSubmit={handleAddHw} className="space-y-4">
          <Input label="Hardware Package Title" value={hwName} onChange={(e) => setHwName(e.target.value)} required />
          <Input label="Brand Name (Hettich, Hafele, Godrej)" value={hwBrand} onChange={(e) => setHwBrand(e.target.value)} />
          <Input label="Description" value={hwDesc} onChange={(e) => setHwDesc(e.target.value)} />
          <Input
            label="Package Flat Add-on Price (₹ / unit)"
            type="number"
            value={hwPrice}
            onChange={(e) => setHwPrice(parseFloat(e.target.value) || 0)}
            prefixSymbol="₹"
          />
          <div className="pt-3 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsHwModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Hardware</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
