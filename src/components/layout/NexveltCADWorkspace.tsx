import React from 'react';
import { ProjectExplorerTree } from '@/components/explorer/ProjectExplorerTree';
import { CADVisualizerCanvas } from '@/components/canvas/CADVisualizerCanvas';
import { PropertyInspector } from '@/components/inspector/PropertyInspector';
import { BottomDock } from '@/components/dock/BottomDock';
import { NexveltStatusBar } from '@/components/layout/NexveltStatusBar';

export const NexveltCADWorkspace: React.FC = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-72px)] w-full overflow-hidden bg-[#F8FAFC] dark:bg-[#0B0F17]">
      {/* 3-Pane Center Grid Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 p-3 overflow-hidden">
        {/* LEFT 20% (lg:col-span-2.5) - Project Explorer Tree */}
        <div className="lg:col-span-3 h-full overflow-hidden">
          <ProjectExplorerTree />
        </div>

        {/* CENTER 58% (lg:col-span-6.5) - Product Workspace & 70%+ Hero SVG Visualizer Canvas */}
        <div className="lg:col-span-6 h-full overflow-hidden">
          <CADVisualizerCanvas />
        </div>

        {/* RIGHT 22% (lg:col-span-3) - Property Inspector Panel & Grand Total */}
        <div className="lg:col-span-3 h-full overflow-hidden">
          <PropertyInspector />
        </div>
      </div>

      {/* Bottom Dock Console */}
      <BottomDock />

      {/* Desktop Status Bar */}
      <NexveltStatusBar />
    </div>
  );
};
