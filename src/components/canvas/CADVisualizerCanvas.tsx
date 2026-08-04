import React, { useState } from 'react';
import { useProjectStore } from '@/store/useProjectStore';
import { useUIStore } from '@/store/useUIStore';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CADViewMode } from '@/types/project';
import { Eye, ZoomIn, ZoomOut, Grid, Sliders, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CADVisualizerCanvas: React.FC = () => {
  const { project, selectedProductId } = useProjectStore();
  const { cadViewMode, setCADViewMode } = useUIStore();

  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);

  // Selected Product Object
  const selectedProduct = project.products.find((p) => p.id === selectedProductId);

  if (!selectedProduct) {
    return (
      <Card glass={false} className="h-full flex flex-col items-center justify-center p-8 text-center bg-white border border-[#E5E7EB] rounded-[18px]">
        <div className="w-16 h-16 rounded-full bg-[#E0F7F7] text-[#00B8B8] flex items-center justify-center mb-3">
          <Box className="w-8 h-8" />
        </div>
        <h3 className="text-base font-extrabold text-[#111827]">No Furniture Selected</h3>
        <p className="text-xs text-[#6B7280]">Select any furniture item from the quotation list to view CAD drawings.</p>
      </Card>
    );
  }

  const h = Math.max(1, selectedProduct.heightFt || 8);
  const w = Math.max(1, selectedProduct.widthFt || 10);
  const d = Math.max(6, selectedProduct.depthIn || 24);
  const cat = (selectedProduct.category || '').toLowerCase();

  // Canvas bounds calculation
  const maxW = 480 * (zoomLevel / 100);
  const maxH = 280 * (zoomLevel / 100);
  const scale = Math.min(maxW / w, maxH / h);

  const rectW = Math.max(120, w * scale);
  const rectH = Math.max(120, h * scale);

  const startX = (560 - rectW) / 2;
  const startY = (360 - rectH) / 2;

  const shutterCount = w > 8 ? 4 : w > 5 ? 3 : w > 2 ? 2 : 1;
  const shutterW = rectW / shutterCount;

  const views: { id: CADViewMode; label: string }[] = [
    { id: 'front', label: 'Front View' },
    { id: 'side', label: 'Side View' },
    { id: 'top', label: 'Top View' },
    { id: 'isometric', label: 'Isometric' },
    { id: 'section', label: 'Section' },
  ];

  return (
    <Card glass={false} className="h-full flex flex-col p-4 space-y-3 bg-white border border-[#E5E7EB] rounded-[18px] select-none shadow-xs">
      {/* Canvas Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1F5F9] pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#E0F7F7] text-[#00B8B8]">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-[#111827]">
                {selectedProduct.name}
              </h3>
              <Badge variant="cyan">{selectedProduct.category}</Badge>
            </div>
            <p className="text-xs text-[#6B7280] font-mono mt-0.5">
              {selectedProduct.heightFt.toFixed(1)}' H × {selectedProduct.widthFt.toFixed(1)}' W × {selectedProduct.depthIn}" D ({selectedProduct.areaSqFt.toFixed(2)} sq.ft)
            </p>
          </div>
        </div>

        {/* CAD View Mode Switcher Buttons */}
        <div className="flex items-center gap-1 bg-[#F8FAFC] p-1.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold">
          {views.map((v) => (
            <button
              key={v.id}
              onClick={() => setCADViewMode(v.id)}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 ${
                cadViewMode === v.id
                  ? 'bg-[#00D9D9] text-white shadow-xs font-bold'
                  : 'bg-white text-[#111827] border border-[#E5E7EB] hover:bg-[#E0F7F7] hover:text-[#00B8B8]'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Light Theme CAD Surface */}
      <div className="flex-1 bg-[#F8FAFC] rounded-2xl relative flex flex-col items-center justify-center p-4 overflow-hidden border border-[#E5E7EB]">
        {/* Floating Controls Bar */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-white/95 border border-[#E5E7EB] p-1.5 rounded-xl text-xs shadow-xs">
          <button
            onClick={() => setZoomLevel((z) => Math.min(180, z + 15))}
            className="p-1.5 text-[#6B7280] hover:text-[#111827] hover:bg-[#F8FAFC] rounded-lg"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="font-mono text-[11px] text-[#00B8B8] px-1 font-bold">{zoomLevel}%</span>
          <button
            onClick={() => setZoomLevel((z) => Math.max(60, z - 15))}
            className="p-1.5 text-[#6B7280] hover:text-[#111827] hover:bg-[#F8FAFC] rounded-lg"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-[#E5E7EB] my-auto" />
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-1.5 rounded-lg ${showGrid ? 'text-[#00B8B8] bg-[#E0F7F7]' : 'text-[#94A3B8]'}`}
            title="Toggle Grid"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowDimensions(!showDimensions)}
            className={`p-1.5 rounded-lg ${showDimensions ? 'text-[#00B8B8] bg-[#E0F7F7]' : 'text-[#94A3B8]'}`}
            title="Toggle Dimension Callouts"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>

        {/* Light Theme SVG Canvas Render with 200ms Framer Motion Fade */}
        <AnimatePresence mode="wait">
          <motion.svg
            key={`${selectedProduct.id}_${cadViewMode}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            width="560"
            height="360"
            viewBox="0 0 560 360"
            className="drop-shadow-xs select-none"
          >
            <defs>
              <linearGradient id="cadShutterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#F1F5F9" />
                <stop offset="100%" stopColor="#E2E8F0" />
              </linearGradient>
              <linearGradient id="cadCyanBorder" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00D9D9" />
                <stop offset="100%" stopColor="#00B8B8" />
              </linearGradient>
              <pattern id="cadGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E5E7EB" strokeWidth="0.75" />
              </pattern>
            </defs>

            {/* Grid Layer */}
            {showGrid && <rect x="0" y="0" width="560" height="360" fill="url(#cadGrid)" opacity="0.8" />}

            {/* CAD Center Reference Axes */}
            <path d="M 0 180 L 560 180 M 280 0 L 280 360" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="6 6" />

            {/* 1. FRONT VIEW MODE */}
            {cadViewMode === 'front' && (
              <g>
                <rect
                  x={startX}
                  y={startY}
                  width={rectW}
                  height={rectH}
                  fill="url(#cadShutterGrad)"
                  stroke="url(#cadCyanBorder)"
                  strokeWidth="3"
                  rx="6"
                />
                {/* Specific Category Front Features */}
                {cat.includes('tv') ? (
                  <>
                    {/* TV Screen Panel */}
                    <rect x={startX + rectW * 0.2} y={startY + rectH * 0.15} width={rectW * 0.6} height={rectH * 0.5} fill="#1E293B" rx="4" />
                    <rect x={startX + 20} y={startY + rectH * 0.72} width={rectW - 40} height={rectH * 0.2} fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" rx="3" />
                  </>
                ) : cat.includes('kitchen') ? (
                  <>
                    {/* Countertop Line */}
                    <line x1={startX} y1={startY + rectH * 0.5} x2={startX + rectW} y2={startY + rectH * 0.5} stroke="#00B8B8" strokeWidth="4" />
                    <rect x={startX} y={startY + rectH * 0.52} width={rectW} height={rectH * 0.45} fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.5" />
                  </>
                ) : cat.includes('pooja') ? (
                  <>
                    {/* Pooja Mandir Arch */}
                    <path d={`M ${startX + 15} ${startY + 40} Q ${startX + rectW / 2} ${startY - 10} ${startX + rectW - 15} ${startY + 40}`} fill="none" stroke="#00B8B8" strokeWidth="3" />
                  </>
                ) : (
                  Array.from({ length: shutterCount }).map((_, idx) => {
                    const doorX = startX + idx * shutterW;
                    return (
                      <g key={idx}>
                        <line
                          x1={doorX}
                          y1={startY}
                          x2={doorX}
                          y2={startY + rectH}
                          stroke="#94A3B8"
                          strokeWidth="2"
                        />
                        <rect
                          x={doorX + (idx % 2 === 0 ? shutterW - 12 : 8)}
                          y={startY + rectH * 0.42}
                          width="6"
                          height={Math.max(18, rectH * 0.22)}
                          fill="#00B8B8"
                          rx="2"
                        />
                      </g>
                    );
                  })
                )}
              </g>
            )}

            {/* 2. SIDE VIEW MODE */}
            {cadViewMode === 'side' && (
              <g>
                <rect
                  x={280 - (d / 24) * 70}
                  y={startY}
                  width={(d / 24) * 140}
                  height={rectH}
                  fill="#F1F5F9"
                  stroke="#00B8B8"
                  strokeWidth="3"
                  rx="6"
                />
                <rect
                  x={280 - (d / 24) * 70}
                  y={startY}
                  width="8"
                  height={rectH}
                  fill="#E2E8F0"
                  stroke="#94A3B8"
                  strokeWidth="1"
                />
                <rect
                  x={280 + (d / 24) * 70 - 8}
                  y={startY}
                  width="8"
                  height={rectH}
                  fill="#E2E8F0"
                  stroke="#94A3B8"
                  strokeWidth="1"
                />
              </g>
            )}

            {/* 3. TOP VIEW MODE */}
            {cadViewMode === 'top' && (
              <g>
                <rect
                  x={startX}
                  y={180 - (d / 24) * 70}
                  width={rectW}
                  height={(d / 24) * 140}
                  fill="#F1F5F9"
                  stroke="#00B8B8"
                  strokeWidth="3"
                  rx="6"
                />
                <line
                  x1={startX - 20}
                  y1={180 - (d / 24) * 70}
                  x2={startX + rectW + 20}
                  y2={180 - (d / 24) * 70}
                  stroke="#00D9D9"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              </g>
            )}

            {/* 4. ISOMETRIC VIEW MODE */}
            {cadViewMode === 'isometric' && (
              <g>
                <rect
                  x={startX}
                  y={startY + 15}
                  width={rectW}
                  height={rectH - 15}
                  fill="url(#cadShutterGrad)"
                  stroke="#00B8B8"
                  strokeWidth="2.5"
                  rx="4"
                />
                <polygon
                  points={`${startX},${startY + 15} ${startX + 30},${startY - 10} ${startX + rectW + 30},${startY - 10} ${startX + rectW},${startY + 15}`}
                  fill="#E2E8F0"
                  stroke="#00B8B8"
                  strokeWidth="2"
                />
                <polygon
                  points={`${startX + rectW},${startY + 15} ${startX + rectW + 30},${startY - 10} ${startX + rectW + 30},${startY + rectH - 25} ${startX + rectW},${startY + rectH - 15}`}
                  fill="#CBD5E1"
                  stroke="#00B8B8"
                  strokeWidth="2"
                />
              </g>
            )}

            {/* 5. SECTION VIEW MODE */}
            {cadViewMode === 'section' && (
              <g>
                <rect
                  x={startX}
                  y={startY}
                  width={rectW}
                  height={rectH}
                  fill="#FFFFFF"
                  stroke="#00B8B8"
                  strokeWidth="3"
                  rx="6"
                />
                <line x1={startX} y1={startY + rectH * 0.25} x2={startX + rectW} y2={startY + rectH * 0.25} stroke="#64748B" strokeWidth="2.5" />
                <line x1={startX} y1={startY + rectH * 0.50} x2={startX + rectW} y2={startY + rectH * 0.50} stroke="#64748B" strokeWidth="2.5" />
                <line x1={startX} y1={startY + rectH * 0.75} x2={startX + rectW} y2={startX + rectW} stroke="#64748B" strokeWidth="2.5" />
                <line x1={startX + rectW * 0.5} y1={startY} x2={startX + rectW * 0.5} y2={startY + rectH} stroke="#64748B" strokeWidth="2.5" />
              </g>
            )}

            {/* Dynamic Dimension Callouts */}
            {showDimensions && (
              <>
                <line
                  x1={startX - 22}
                  y1={startY}
                  x2={startX - 22}
                  y2={startY + rectH}
                  stroke="#00B8B8"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
                <text
                  x={startX - 30}
                  y={startY + rectH / 2}
                  fill="#00B8B8"
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                  transform={`rotate(-90 ${startX - 30} ${startY + rectH / 2})`}
                >
                  {h.toFixed(1)}' H
                </text>

                <line
                  x1={startX}
                  y1={startY - 22}
                  x2={startX + rectW}
                  y2={startY - 22}
                  stroke="#00B8B8"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
                <text
                  x={startX + rectW / 2}
                  y={startY - 30}
                  fill="#00B8B8"
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {cadViewMode === 'side' ? `${d}" Depth` : `${w.toFixed(1)}' Width (${d}" Depth)`}
                </text>
              </>
            )}
          </motion.svg>
        </AnimatePresence>

        {/* Bottom Material Legend */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-white/95 border border-[#E5E7EB] p-2.5 rounded-xl text-xs shadow-xs text-[#111827]">
          <div>
            <span className="text-[#6B7280] uppercase text-[10px] font-bold block">Selected Furniture:</span>
            <span className="font-bold text-[#00B8B8]">{selectedProduct.name}</span>
          </div>
          <div>
            <span className="text-[#6B7280] uppercase text-[10px] font-bold block">Active View:</span>
            <span className="font-bold text-[#111827] uppercase">{cadViewMode} View</span>
          </div>
          <div>
            <span className="text-[#6B7280] uppercase text-[10px] font-bold block">Shutter Finish:</span>
            <span className="font-semibold text-[#111827]">{selectedProduct.shutterMaterialName || 'Standard Finish'}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
