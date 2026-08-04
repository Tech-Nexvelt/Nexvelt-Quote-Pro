import React, { useState } from 'react';
import { RoomZone, WorkItem, WorkCategoryType, UserMode } from '../../types/enterprise';

interface ProjectHierarchyTreeProps {
  rooms: RoomZone[];
  activeRoomId: string;
  onSelectRoom: (roomId: string) => void;
  onAddRoom: (name: string) => void;
  onRemoveRoom: (roomId: string) => void;
  onAddItemToRoom: (roomId: string, category: string) => void;
  onRemoveItem: (roomId: string, itemId: string) => void;
  mode: UserMode;
}

export const ProjectHierarchyTree: React.FC<ProjectHierarchyTreeProps> = ({
  rooms,
  activeRoomId,
  onSelectRoom,
  onAddRoom,
  onRemoveRoom,
  onAddItemToRoom,
  onRemoveItem,
  mode,
}) => {
  const [newRoomName, setNewRoomName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    onAddRoom(newRoomName.trim());
    setNewRoomName('');
    setShowAddModal(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <span>🏛️ Rooms & Zones</span>
          <span className="text-slate-500 font-mono">({rooms.length})</span>
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-2.5 py-1 text-xs font-medium bg-cyan-950 text-cyan-300 hover:bg-cyan-900 rounded-lg border border-cyan-800/50 transition flex items-center gap-1"
        >
          <span>+ Add Room</span>
        </button>
      </div>

      {/* Add Room Modal / Inline Form */}
      {showAddModal && (
        <form onSubmit={handleCreateRoom} className="mb-3 p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder="Room Name (e.g. Master Bedroom)"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 text-xs text-white rounded px-2 py-1.5 focus:outline-none focus:border-cyan-500"
            autoFocus
          />
          <button type="submit" className="px-3 py-1.5 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded">
            Save
          </button>
          <button
            type="button"
            onClick={() => setShowAddModal(false)}
            className="px-2 py-1.5 text-xs text-slate-400 hover:text-slate-200"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Rooms Tree */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {rooms.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No rooms added yet. Click "+ Add Room" to start.
          </div>
        ) : (
          rooms.map((room) => {
            const isActive = room.id === activeRoomId;
            return (
              <div
                key={room.id}
                className={`rounded-xl border transition ${
                  isActive
                    ? 'bg-cyan-950/40 border-cyan-500/50 shadow-lg shadow-cyan-950/20'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Room Bar */}
                <div
                  onClick={() => onSelectRoom(room.id)}
                  className="p-3 cursor-pointer flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm">🚪</span>
                    <span className={`text-xs font-semibold truncate ${isActive ? 'text-cyan-300' : 'text-slate-200'}`}>
                      {room.name}
                    </span>
                    <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                      {room.items.length} items
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Room Subtotal */}
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      ₹{(room.summary?.subtotal || 0).toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Remove room "${room.name}"?`)) onRemoveRoom(room.id);
                      }}
                      className="text-slate-500 hover:text-red-400 text-xs px-1"
                      title="Delete Room"
                    >
                      ×
                    </button>
                  </div>
                </div>

                {/* Items List in Active Room */}
                {isActive && (
                  <div className="px-3 pb-3 border-t border-slate-800/60 pt-2 space-y-1.5">
                    {room.items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-900/80 p-2 rounded-lg border border-slate-800/80 flex items-center justify-between text-xs group"
                      >
                        <div className="min-w-0">
                          <span className="font-medium text-slate-200 block truncate">{item.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {item.heightFt}' × {item.widthFt}' • {item.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-cyan-300 text-xs">
                            ₹{(item.calculations?.sellingPrice || 0).toLocaleString('en-IN')}
                          </span>
                          <button
                            onClick={() => onRemoveItem(room.id, item.id)}
                            className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Quick Add Item Bar */}
                    <div className="pt-2 flex flex-wrap gap-1">
                      {['Wardrobe', 'Kitchen', 'TV Unit', 'Study', 'Wall Panelling', 'Custom'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => onAddItemToRoom(room.id, cat)}
                          className="px-2 py-0.5 text-[10px] bg-slate-800 hover:bg-cyan-900/60 text-slate-300 hover:text-cyan-300 rounded border border-slate-700 transition"
                        >
                          + {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
