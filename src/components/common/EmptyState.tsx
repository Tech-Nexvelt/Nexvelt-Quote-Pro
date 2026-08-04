import React from 'react';
import { LucideIcon, Users, FileText, Folder, Search, Bell } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  type?: 'customers' | 'quotations' | 'projects' | 'search' | 'notifications' | 'generic';
  title?: string;
  description?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  icon?: LucideIcon;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'generic',
  title,
  description,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  icon,
}) => {
  // Preset content matching Cards #5, #6, #7, #8, #19 from design reference
  if (type === 'customers') {
    return (
      <div className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center text-[#00D9D9]">
          <Users className="w-8 h-8" />
        </div>
        <div className="space-y-1 max-w-sm">
          <h3 className="text-base font-extrabold text-slate-900">No Customers Yet</h3>
          <p className="text-xs text-slate-500 font-medium">Create your first customer to get started.</p>
        </div>
        {onPrimaryAction && (
          <Button variant="primary" size="sm" onClick={onPrimaryAction}>
            + Create Customer
          </Button>
        )}
      </div>
    );
  }

  if (type === 'quotations') {
    return (
      <div className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center text-[#00D9D9]">
          <FileText className="w-8 h-8" />
        </div>
        <div className="space-y-1 max-w-sm">
          <h3 className="text-base font-extrabold text-slate-900">No Quotations Found</h3>
          <p className="text-xs text-slate-500 font-medium">Create a new quotation to get started.</p>
        </div>
        {onPrimaryAction && (
          <Button variant="primary" size="sm" onClick={onPrimaryAction}>
            + Create Quote
          </Button>
        )}
      </div>
    );
  }

  if (type === 'projects') {
    return (
      <div className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center text-[#00D9D9]">
          <Folder className="w-8 h-8" />
        </div>
        <div className="space-y-1 max-w-sm">
          <h3 className="text-base font-extrabold text-slate-900">No Projects</h3>
          <p className="text-xs text-slate-500 font-medium">Create your first project to get started.</p>
        </div>
        {onPrimaryAction && (
          <Button variant="primary" size="sm" onClick={onPrimaryAction}>
            + Create Project
          </Button>
        )}
      </div>
    );
  }

  if (type === 'search') {
    return (
      <div className="py-10 px-6 flex flex-col items-center justify-center text-center space-y-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
          <Search className="w-7 h-7" />
        </div>
        <div className="space-y-1 max-w-sm">
          <h3 className="text-base font-extrabold text-slate-900">No Results Found</h3>
          <p className="text-xs text-slate-500 font-medium">Try adjusting your search or filters.</p>
        </div>
        <div className="text-left text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
          <span className="font-bold text-slate-700 block">Suggestions:</span>
          <ul className="list-disc list-inside space-y-0.5 font-medium">
            <li>Check spelling</li>
            <li>Use fewer keywords</li>
            <li>Try more general terms</li>
          </ul>
        </div>
      </div>
    );
  }

  if (type === 'notifications') {
    return (
      <div className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <Bell className="w-8 h-8" />
        </div>
        <h3 className="text-base font-extrabold text-slate-900">You're all caught up!</h3>
        <p className="text-xs text-slate-500 font-medium">No new notifications. Check back later.</p>
      </div>
    );
  }

  const CustomIcon = icon || FileText;

  return (
    <div className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
      <div className="w-14 h-14 rounded-2xl bg-[#00D9D9]/15 flex items-center justify-center text-[#00B8B8]">
        <CustomIcon className="w-7 h-7" />
      </div>

      <div className="space-y-1 max-w-sm">
        <h3 className="text-base font-extrabold text-slate-900">{title || 'No Items Found'}</h3>
        <p className="text-xs text-slate-500 font-medium">{description || 'Get started by creating your first entry.'}</p>
      </div>

      {(primaryActionLabel || secondaryActionLabel) && (
        <div className="flex items-center gap-3 pt-2">
          {secondaryActionLabel && onSecondaryAction && (
            <Button variant="outline" size="sm" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
          {primaryActionLabel && onPrimaryAction && (
            <Button variant="primary" size="sm" onClick={onPrimaryAction}>
              {primaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
