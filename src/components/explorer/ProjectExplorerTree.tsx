import React, { useState } from 'react';
import { useProjectStore } from '@/store/useProjectStore';
import { useUIStore } from '@/store/useUIStore';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Folder,
  FolderOpen,
  Box,
  Plus,
  Trash2,
  Copy,
  Edit3,
  ChevronRight,
  ChevronDown,
  Home,
  Sparkles,
} from 'lucide-react';

export const ProjectExplorerTree: React.FC = () => {
  const { project, selectedRoomId, selectedProductId, selectRoom, selectProduct, addRoom, addProduct, deleteRoom, deleteProduct, duplicateProduct } = useProjectStore();
  const { addToast } = useUIStore();

  const [collapsedRooms, setCollapsedRooms] = useState<Record<string, boolean>>({});
  const [newRoomName, setNewRoomName] = useState('');
  const [isAddingRoom, setIsAddingRoom] = useState(false);

  const toggleRoomCollapse = (roomId: string) => {
    setCollapsedRooms((prev) => ({ ...prev, [roomId]: !prev[roomId] }));
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    addRoom(newRoomName.trim());
    setNewRoomName('');
    setIsAddingRoom(false);
    addToast({ type: 'success', title: 'Room Added', message: `Added ${newRoomName} to project tree.` });
  };

  const handleAddQuickProduct = (roomId: string) => {
    selectRoom(roomId);
    const newProd = addProduct({
      category: 'Wardrobe',
      name: 'Custom Storage Cabinet',
      baseRate: 1450,
      quantity: 1,
    });
    selectProduct(newProd.id);
    addToast({ type: 'success', title: 'Product Object Added', message: 'Created product line under selected room.' });
  };

  return (
    <Card glass className="h-full flex flex-col p-4 space-y-4 border-slate-200 dark:border-slate-800 select-none">
      {/* Explorer Tree Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Home className="w-4 h-4 text-[#00D9D9]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Project Explorer
          </h3>
        </div>
        <button
          onClick={() => setIsAddingRoom(!isAddingRoom)}
          className="p-1 rounded-lg text-slate-500 hover:text-[#00B8B8] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Add new room zone"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Add Room Inline Input */}
      {isAddingRoom && (
        <form onSubmit={handleCreateRoom} className="space-y-2 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <input
            type="text"
            placeholder="Room name (e.g. Dining Room)"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#00D9D9]"
            autoFocus
          />
          <div className="flex justify-end gap-1.5 text-[11px]">
            <button type="button" onClick={() => setIsAddingRoom(false)} className="px-2 py-1 text-slate-500">Cancel</button>
            <button type="submit" className="px-2.5 py-1 rounded-md bg-[#00D9D9] text-gray-900 font-bold">Add Room</button>
          </div>
        </form>
      )}

      {/* Hierarchical Tree Container */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
        {/* Root Project Node */}
        <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between p-2 rounded-xl bg-slate-100/70 dark:bg-slate-800/70">
          <div className="flex items-center gap-2 truncate">
            <Sparkles className="w-3.5 h-3.5 text-[#00D9D9] shrink-0" />
            <span className="truncate">{project.title}</span>
          </div>
          <Badge variant="cyan">{project.products.length} Products</Badge>
        </div>

        {/* Rooms Hierarchy */}
        {project.rooms.map((room) => {
          const isRoomSelected = selectedRoomId === room.id;
          const isCollapsed = !!collapsedRooms[room.id];
          const roomProducts = project.products.filter((p) => p.roomId === room.id);

          return (
            <div key={room.id} className="space-y-1">
              {/* Room Header Node */}
              <div
                onClick={() => selectRoom(room.id)}
                className={`group flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${
                  isRoomSelected
                    ? 'bg-[#00D9D9]/15 text-[#00B8B8] dark:text-[#35F5FF] font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRoomCollapse(room.id);
                    }}
                    className="text-slate-400 hover:text-slate-700"
                  >
                    {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                  {isCollapsed ? <Folder className="w-4 h-4 text-amber-500" /> : <FolderOpen className="w-4 h-4 text-amber-500" />}
                  <span className="truncate font-semibold">{room.name}</span>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddQuickProduct(room.id);
                    }}
                    className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
                    title="Add product to this room"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  {project.rooms.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteRoom(room.id);
                      }}
                      className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-red-500"
                      title="Delete room"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Room Products Children Nodes */}
              {!isCollapsed && (
                <div className="pl-6 space-y-1 border-l-2 border-slate-200 dark:border-slate-800 ml-3">
                  {roomProducts.length === 0 ? (
                    <div className="text-[11px] text-slate-400 py-1 italic">No products added. Click + to add.</div>
                  ) : (
                    roomProducts.map((prod) => {
                      const isProdSelected = selectedProductId === prod.id;
                      return (
                        <div
                          key={prod.id}
                          onClick={() => {
                            selectRoom(room.id);
                            selectProduct(prod.id);
                          }}
                          className={`group flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${
                            isProdSelected
                              ? 'bg-[#00D9D9] text-gray-900 font-bold shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Box className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{prod.name}</span>
                          </div>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                duplicateProduct(prod.id);
                              }}
                              className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700"
                              title="Duplicate product"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteProduct(prod.id);
                              }}
                              className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-red-500"
                              title="Delete product"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};
