import React from 'react';

export const SkeletonPulse: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => (
  <div className={`animate-pulse bg-slate-200/80 rounded-lg ${className}`} />
);

/**
 * Card #2: Dashboard Skeleton
 */
export const DashboardSkeleton: React.FC = () => (
  <div className="p-6 space-y-6 max-w-7xl mx-auto">
    <div className="flex items-center justify-between border-b border-slate-200 pb-4">
      <div className="space-y-2">
        <SkeletonPulse className="h-6 w-48" />
        <SkeletonPulse className="h-4 w-72" />
      </div>
      <SkeletonPulse className="h-9 w-32" />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <SkeletonPulse className="h-4 w-24" />
          <SkeletonPulse className="h-8 w-32" />
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <SkeletonPulse className="h-5 w-40" />
        <SkeletonPulse className="h-64 w-full" />
      </div>
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center">
        <SkeletonPulse className="h-5 w-36 self-start" />
        <SkeletonPulse className="w-40 h-40 rounded-full" />
      </div>
    </div>
  </div>
);

/**
 * Card #3: Customer Loading Skeleton
 */
export const CustomerLoadingSkeleton: React.FC = () => (
  <div className="p-6 space-y-6 max-w-6xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <SkeletonPulse className="w-10 h-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <SkeletonPulse className="h-4 w-3/4" />
            <SkeletonPulse className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>

    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
      <SkeletonPulse className="h-10 w-full" />
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <SkeletonPulse key={i} className="h-12 w-full" />
      ))}
    </div>
  </div>
);

/**
 * Customer Details Skeleton
 */
export const CustomerDetailsSkeleton: React.FC = () => (
  <div className="p-6 space-y-6 max-w-5xl mx-auto">
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
      <div className="flex items-center gap-4">
        <SkeletonPulse className="w-16 h-16 rounded-full" />
        <div className="space-y-2">
          <SkeletonPulse className="h-6 w-48" />
          <SkeletonPulse className="h-4 w-32" />
        </div>
      </div>
      <SkeletonPulse className="h-10 w-28" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <SkeletonPulse className="h-5 w-32" />
        <SkeletonPulse className="h-32 w-full" />
      </div>
      <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <SkeletonPulse className="h-5 w-40" />
        <SkeletonPulse className="h-48 w-full" />
      </div>
    </div>
  </div>
);

/**
 * Product Grid Skeleton
 */
export const ProductGridSkeleton: React.FC = () => (
  <div className="p-6 space-y-6 max-w-7xl mx-auto">
    <div className="flex items-center justify-between">
      <SkeletonPulse className="h-8 w-48" />
      <SkeletonPulse className="h-10 w-36" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <SkeletonPulse className="h-40 w-full rounded-xl" />
          <SkeletonPulse className="h-5 w-3/4" />
          <SkeletonPulse className="h-4 w-1/2" />
          <div className="flex justify-between items-center pt-2">
            <SkeletonPulse className="h-6 w-20" />
            <SkeletonPulse className="h-8 w-24" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

/**
 * Project Skeleton
 */
export const ProjectSkeleton: React.FC = () => (
  <div className="p-6 space-y-6 max-w-7xl mx-auto">
    <div className="flex justify-between items-center">
      <SkeletonPulse className="h-8 w-40" />
      <SkeletonPulse className="h-10 w-32" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((col) => (
        <div key={col} className="bg-slate-50 p-4 rounded-2xl space-y-4 border border-slate-200">
          <SkeletonPulse className="h-6 w-28" />
          {[1, 2].map((card) => (
            <div key={card} className="bg-white p-4 rounded-xl space-y-3 border border-slate-200 shadow-xs">
              <SkeletonPulse className="h-5 w-3/4" />
              <SkeletonPulse className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

/**
 * Quotation Table Skeleton
 */
export const QuotationTableSkeleton: React.FC = () => (
  <div className="p-6 space-y-6 max-w-7xl mx-auto">
    <div className="flex justify-between items-center">
      <SkeletonPulse className="h-8 w-48" />
      <SkeletonPulse className="h-10 w-36" />
    </div>
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
      <SkeletonPulse className="h-10 w-full" />
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <SkeletonPulse key={i} className="h-12 w-full" />
      ))}
    </div>
  </div>
);

/**
 * Card #4: Quotation Builder Loading Skeleton
 */
export const QuotationBuilderSkeleton: React.FC = () => (
  <div className="p-6 space-y-6 max-w-7xl mx-auto">
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-around">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#00D9D9]/30 animate-pulse" />
          <SkeletonPulse className="h-4 w-24" />
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <SkeletonPulse className="h-8 w-48" />
        <SkeletonPulse className="h-48 w-full" />
      </div>
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center space-y-4 min-h-[300px]">
        <div className="w-12 h-12 rounded-full border-4 border-[#00D9D9] border-t-transparent animate-spin" />
        <SkeletonPulse className="h-4 w-36" />
      </div>
    </div>
  </div>
);

/**
 * Invoice Preview Skeleton
 */
export const InvoicePreviewSkeleton: React.FC = () => (
  <div className="p-6 max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-lg space-y-6">
    <div className="flex justify-between items-start">
      <SkeletonPulse className="w-32 h-12" />
      <SkeletonPulse className="w-40 h-10" />
    </div>
    <SkeletonPulse className="h-px w-full" />
    <div className="grid grid-cols-2 gap-6">
      <SkeletonPulse className="h-20 w-full" />
      <SkeletonPulse className="h-20 w-full" />
    </div>
    <SkeletonPulse className="h-48 w-full" />
    <div className="flex justify-end">
      <SkeletonPulse className="h-24 w-64" />
    </div>
  </div>
);

/**
 * Card #20: Reports Loading Skeleton
 */
export const ReportsLoadingSkeleton: React.FC = () => (
  <div className="p-6 space-y-6 max-w-6xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <SkeletonPulse className="h-5 w-32" />
        <SkeletonPulse className="h-40 w-full" />
      </div>
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <SkeletonPulse className="h-5 w-32" />
        <SkeletonPulse className="h-40 w-full" />
      </div>
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-center">
        <SkeletonPulse className="w-32 h-32 rounded-full" />
      </div>
    </div>
  </div>
);

/**
 * Card #21: Analytics Loading Skeleton
 */
export const AnalyticsLoadingSkeleton: React.FC = () => (
  <div className="p-6 space-y-6 max-w-6xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <SkeletonPulse className="h-3 w-16" />
          <SkeletonPulse className="h-7 w-24" />
          <SkeletonPulse className="h-3 w-12" />
        </div>
      ))}
    </div>
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
      <SkeletonPulse className="h-5 w-40" />
      <SkeletonPulse className="h-56 w-full" />
    </div>
  </div>
);

/**
 * Card #22: Settings Loading Skeleton
 */
export const SettingsLoadingSkeleton: React.FC = () => (
  <div className="p-6 space-y-6 max-w-5xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <SkeletonPulse key={i} className="h-10 w-full" />
        ))}
      </div>
      <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <SkeletonPulse className="h-6 w-48" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <SkeletonPulse className="h-4 w-40" />
            <SkeletonPulse className="h-6 w-12 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

/**
 * Users / Roles / Permissions Skeleton
 */
export const UsersSkeleton: React.FC = () => (
  <div className="p-6 space-y-6 max-w-6xl mx-auto">
    <div className="flex justify-between items-center">
      <SkeletonPulse className="h-8 w-40" />
      <SkeletonPulse className="h-10 w-28" />
    </div>
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <SkeletonPulse key={i} className="h-12 w-full" />
      ))}
    </div>
  </div>
);

export const AuditSkeleton = UsersSkeleton;
export const ActivitySkeleton = UsersSkeleton;
export const StorageSkeleton = UsersSkeleton;
export const IntegrationSkeleton = UsersSkeleton;

/**
 * Card #23: Search Loading Skeleton
 */
export const SearchLoadingSkeleton: React.FC = () => (
  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
    <SkeletonPulse className="h-10 w-full" />
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <SkeletonPulse key={i} className="h-8 w-full" />
      ))}
    </div>
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
    <div className="flex items-center justify-between">
      <SkeletonPulse className="h-5 w-36" />
      <SkeletonPulse className="h-8 w-28" />
    </div>
    <div className="space-y-2">
      <SkeletonPulse className="h-10 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonPulse key={i} className="h-12 w-full" />
      ))}
    </div>
  </div>
);

export const CardGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <SkeletonPulse className="w-10 h-10 rounded-xl" />
          <div className="space-y-1.5 flex-1">
            <SkeletonPulse className="h-4 w-3/4" />
            <SkeletonPulse className="h-3 w-1/2" />
          </div>
        </div>
        <SkeletonPulse className="h-16 w-full" />
      </div>
    ))}
  </div>
);
