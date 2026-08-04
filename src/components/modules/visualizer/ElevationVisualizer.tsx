import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Box, Eye } from 'lucide-react';

export interface ElevationVisualizerProps {
  category: string;
  heightFt: number;
  widthFt: number;
  depthIn: number;
  carcassMaterial?: string;
  shutterMaterial?: string;
  hardwareName?: string;
  quantity?: number;
}

export const ElevationVisualizer: React.FC<ElevationVisualizerProps> = ({
  category,
  heightFt,
  widthFt,
  depthIn,
  carcassMaterial,
  shutterMaterial,
  hardwareName,
  quantity = 1,
}) => {
  const h = Math.max(1, heightFt || 7);
  const w = Math.max(1, widthFt || 4);
  const d = Math.max(6, depthIn || 24);

  // SVG Aspect Ratio Bounds (max viewBox width 320, max height 220)
  const maxCanvasW = 280;
  const maxCanvasH = 180;
  const scale = Math.min(maxCanvasW / w, maxCanvasH / h);

  const rectW = Math.max(40, w * scale);
  const rectH = Math.max(50, h * scale);

  const startX = (320 - rectW) / 2;
  const startY = (210 - rectH) / 2;

  // Determine shutter partition count based on width
  const shutterCount = w > 6 ? 4 : w > 4 ? 3 : w > 2 ? 2 : 1;
  const shutterW = rectW / shutterCount;

  return (
    <Card glass className="relative overflow-hidden bg-slate-900/90 text-white border-slate-800">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-[#00D9D9]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Live 2D Elevation Schematic
          </h4>
        </div>
        <Badge variant="cyan">{category}</Badge>
      </div>

      <div className="flex flex-col items-center justify-center my-3 relative min-h-[220px]">
        {/* SVG Drawing Canvas */}
        <svg width="320" height="210" viewBox="0 0 320 210" className="drop-shadow-lg select-none">
          <defs>
            <linearGradient id="shutterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="cyanBorderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00D9D9" />
              <stop offset="100%" stopColor="#00B8B8" />
            </linearGradient>
            <pattern id="woodPattern" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 0 5 Q 5 0 10 5 Q 5 10 0 5" fill="none" stroke="#475569" strokeWidth="0.5" opacity="0.4" />
            </pattern>
          </defs>

          {/* Background Grid */}
          <rect x="0" y="0" width="320" height="210" fill="none" rx="8" />
          <path d="M 0 105 L 320 105 M 160 0 L 160 210" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />

          {/* Main Outer Box */}
          <rect
            x={startX}
            y={startY}
            width={rectW}
            height={rectH}
            fill="url(#shutterGrad)"
            stroke="url(#cyanBorderGrad)"
            strokeWidth="2"
            rx="4"
          />
          <rect x={startX} y={startY} width={rectW} height={rectH} fill="url(#woodPattern)" rx="4" />

          {/* Shutter Doors & Handles */}
          {Array.from({ length: shutterCount }).map((_, idx) => {
            const doorX = startX + idx * shutterW;
            return (
              <g key={idx}>
                {/* Vertical Door Line */}
                <line
                  x1={doorX}
                  y1={startY}
                  x2={doorX}
                  y2={startY + rectH}
                  stroke="#475569"
                  strokeWidth="1.5"
                />
                {/* Handle Bar */}
                <rect
                  x={doorX + (idx % 2 === 0 ? shutterW - 8 : 4)}
                  y={startY + rectH * 0.45}
                  width="4"
                  height={Math.max(12, rectH * 0.2)}
                  fill="#00D9D9"
                  rx="1"
                />
              </g>
            );
          })}

          {/* Depth 3D Accent Isometric Ribbon */}
          <polygon
            points={`${startX + rectW},${startY} ${startX + rectW + 12},${startY - 8} ${startX + rectW + 12},${startY + rectH - 8} ${startX + rectW},${startY + rectH}`}
            fill="#0F172A"
            stroke="#00D9D9"
            strokeWidth="1"
            opacity="0.8"
          />

          {/* Height Dimension Line (Left) */}
          <line
            x1={startX - 14}
            y1={startY}
            x2={startX - 14}
            y2={startY + rectH}
            stroke="#00D9D9"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
          <text
            x={startX - 18}
            y={startY + rectH / 2}
            fill="#35F5FF"
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
            transform={`rotate(-90 ${startX - 18} ${startY + rectH / 2})`}
          >
            {h.toFixed(1)}' H
          </text>

          {/* Width Dimension Line (Bottom) */}
          <line
            x1={startX}
            y1={startY + rectH + 14}
            x2={startX + rectW}
            y2={startY + rectH + 14}
            stroke="#00D9D9"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
          <text
            x={startX + rectW / 2}
            y={startY + rectH + 26}
            fill="#35F5FF"
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
          >
            {w.toFixed(1)}' W ({d}" Depth)
          </text>
        </svg>
      </div>

      {/* Material & Hardware Specs Legend */}
      <div className="grid grid-cols-2 gap-2 text-[11px] pt-3 border-t border-slate-800 text-slate-400">
        <div>
          <span className="text-slate-500 block font-semibold uppercase">Carcass:</span>
          <span className="text-slate-200 font-medium truncate block">{carcassMaterial || 'Standard Board'}</span>
        </div>
        <div>
          <span className="text-slate-500 block font-semibold uppercase">Shutter Finish:</span>
          <span className="text-[#35F5FF] font-medium truncate block">{shutterMaterial || 'Standard Laminate'}</span>
        </div>
      </div>
    </Card>
  );
};
