import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Eye, Layers, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export interface EnlargedHeroVisualizerProps {
  category: string;
  heightFt: number;
  widthFt: number;
  depthIn: number;
  carcassMaterial?: string;
  shutterMaterial?: string;
  hardwareName?: string;
}

export const EnlargedHeroVisualizer: React.FC<EnlargedHeroVisualizerProps> = ({
  category,
  heightFt,
  widthFt,
  depthIn,
  carcassMaterial,
  shutterMaterial,
  hardwareName,
}) => {
  const h = Math.max(1, heightFt || 8);
  const w = Math.max(1, widthFt || 10);
  const d = Math.max(6, depthIn || 24);

  // Enlarged 300% Bounds (max viewBox 480 x 280)
  const maxW = 420;
  const maxH = 240;
  const scale = Math.min(maxW / w, maxH / h);

  const rectW = Math.max(80, w * scale);
  const rectH = Math.max(90, h * scale);

  const startX = (480 - rectW) / 2;
  const startY = (280 - rectH) / 2;

  const shutterCount = w > 8 ? 4 : w > 5 ? 3 : w > 2 ? 2 : 1;
  const shutterW = rectW / shutterCount;

  return (
    <Card glass className="relative overflow-hidden bg-slate-950 text-white border-slate-800 p-6 glow-subtle">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#00D9D9]/15 text-[#00D9D9]">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
              Interactive 2D Front Elevation Schematic
            </h4>
            <p className="text-[11px] text-slate-400">Scale visualization • Direct dimension callouts</p>
          </div>
        </div>
        <Badge variant="cyan">{category}</Badge>
      </div>

      {/* Hero Enlarged SVG Canvas */}
      <div className="flex items-center justify-center my-2 relative min-h-[290px] select-none">
        <svg width="480" height="280" viewBox="0 0 480 280" className="drop-shadow-2xl">
          <defs>
            <linearGradient id="heroShutterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="heroCyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00D9D9" />
              <stop offset="100%" stopColor="#00B8B8" />
            </linearGradient>
            <pattern id="woodGrain" width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M 0 8 Q 8 0 16 8 Q 8 16 0 8" fill="none" stroke="#475569" strokeWidth="0.75" opacity="0.3" />
            </pattern>
          </defs>

          {/* Canvas Background Grid */}
          <rect x="0" y="0" width="480" height="280" fill="none" />
          <path d="M 0 140 L 480 140 M 240 0 L 240 280" stroke="#1E293B" strokeWidth="1" strokeDasharray="6 6" />

          {/* Outer Cabinet Main Box */}
          <rect
            x={startX}
            y={startY}
            width={rectW}
            height={rectH}
            fill="url(#heroShutterGrad)"
            stroke="url(#heroCyanGrad)"
            strokeWidth="3"
            rx="6"
          />
          <rect x={startX} y={startY} width={rectW} height={rectH} fill="url(#woodGrain)" rx="6" />

          {/* Shutter Doors & Handles */}
          {Array.from({ length: shutterCount }).map((_, idx) => {
            const doorX = startX + idx * shutterW;
            return (
              <g key={idx}>
                {/* Vertical Door Divider */}
                <line
                  x1={doorX}
                  y1={startY}
                  x2={doorX}
                  y2={startY + rectH}
                  stroke="#475569"
                  strokeWidth="2"
                />
                {/* Handle Bar */}
                <rect
                  x={doorX + (idx % 2 === 0 ? shutterW - 10 : 6)}
                  y={startY + rectH * 0.42}
                  width="5"
                  height={Math.max(16, rectH * 0.22)}
                  fill="#00D9D9"
                  rx="1.5"
                />
              </g>
            );
          })}

          {/* 3D Depth Isometric Side Accent Ribbon */}
          <polygon
            points={`${startX + rectW},${startY} ${startX + rectW + 18},${startY - 12} ${startX + rectW + 18},${startY + rectH - 12} ${startX + rectW},${startY + rectH}`}
            fill="#0F172A"
            stroke="#00D9D9"
            strokeWidth="1.5"
            opacity="0.85"
          />

          {/* Height Callout Arrow & Text (Left) */}
          <line
            x1={startX - 18}
            y1={startY}
            x2={startX - 18}
            y2={startY + rectH}
            stroke="#00D9D9"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <text
            x={startX - 24}
            y={startY + rectH / 2}
            fill="#35F5FF"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
            transform={`rotate(-90 ${startX - 24} ${startY + rectH / 2})`}
          >
            {h.toFixed(1)}' Height
          </text>

          {/* Width Callout Arrow & Text (Top) */}
          <line
            x1={startX}
            y1={startY - 18}
            x2={startX + rectW}
            y2={startY - 18}
            stroke="#00D9D9"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <text
            x={startX + rectW / 2}
            y={startY - 24}
            fill="#35F5FF"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
          >
            {w.toFixed(1)}' Width ({d}" Depth)
          </text>
        </svg>
      </div>

      {/* Material Specification Footer Strip */}
      <div className="grid grid-cols-3 gap-2 text-xs pt-3 border-t border-slate-800 text-slate-400">
        <div>
          <span className="text-slate-500 uppercase font-bold text-[10px] block">Carcass Structure:</span>
          <span className="text-slate-200 font-semibold truncate block">{carcassMaterial || 'Standard Board'}</span>
        </div>
        <div>
          <span className="text-slate-500 uppercase font-bold text-[10px] block">Shutter Door Finish:</span>
          <span className="text-[#35F5FF] font-semibold truncate block">{shutterMaterial || 'Standard Laminate'}</span>
        </div>
        <div>
          <span className="text-slate-500 uppercase font-bold text-[10px] block">Hardware Fittings:</span>
          <span className="text-slate-200 font-semibold truncate block">{hardwareName || 'Soft-Close Hardware'}</span>
        </div>
      </div>
    </Card>
  );
};
