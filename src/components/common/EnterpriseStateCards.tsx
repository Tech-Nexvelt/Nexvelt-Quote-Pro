import React from 'react';
import {
  CloudOff,
  Signal,
  WifiOff,
  AlertOctagon,
  FileQuestion,
  Lock,
  ShieldAlert,
  RefreshCw,
  UploadCloud,
  FileCheck,
  Wrench,
  CheckCircle2,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

/**
 * Card #9: Offline Mode Card
 */
export const OfflineStateCard: React.FC<{ onReconnect?: () => void }> = ({ onReconnect }) => (
  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-4 max-w-md mx-auto">
    <div className="relative">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500">
        <CloudOff className="w-8 h-8" />
      </div>
      <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded bg-slate-800 text-white font-mono text-[9px] font-black uppercase">
        OFFLINE
      </span>
    </div>
    <div className="space-y-1">
      <h3 className="text-base font-extrabold text-slate-900">You're Offline</h3>
      <p className="text-xs text-slate-500 font-medium">
        Some features are unavailable. We'll sync when you're back online.
      </p>
    </div>
    <div className="flex flex-col items-center gap-2 w-full">
      <Button variant="primary" size="sm" className="w-full" onClick={onReconnect || (() => window.location.reload())}>
        Reconnect
      </Button>
      <span className="text-[10px] text-slate-400 font-mono">Sync Pending (12)</span>
    </div>
  </div>
);

/**
 * Card #10: Low Data Mode Card
 */
export const LowDataStateCard: React.FC = () => (
  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-4 max-w-md mx-auto">
    <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center text-[#00D9D9]">
      <Signal className="w-8 h-8" />
    </div>
    <div className="space-y-1">
      <h3 className="text-base font-extrabold text-slate-900">Low Data Mode Enabled</h3>
      <p className="text-xs text-slate-500 font-medium">
        Animations reduced and images optimized to save data.
      </p>
    </div>
    <div className="space-y-1.5 text-xs text-emerald-700 font-bold self-start w-full bg-emerald-50 p-3 rounded-xl border border-emerald-200">
      <div className="flex items-center gap-2">
        <Check className="w-4 h-4 text-emerald-600" /> Animations Reduced
      </div>
      <div className="flex items-center gap-2">
        <Check className="w-4 h-4 text-emerald-600" /> Images Optimized
      </div>
    </div>
  </div>
);

/**
 * Card #11: Slow Network Card
 */
export const SlowNetworkCard: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-4 max-w-md mx-auto">
    <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 relative">
      <WifiOff className="w-8 h-8" />
    </div>
    <div className="space-y-1">
      <h3 className="text-base font-extrabold text-slate-900">Poor Network</h3>
      <p className="text-xs text-slate-500 font-medium">Trying to reconnect...</p>
    </div>
    <Button variant="outline" size="sm" onClick={onRetry}>
      Retry Now
    </Button>
  </div>
);

/**
 * Card #12: Server Error (500) Card
 */
export const ServerErrorCard: React.FC<{ onRetry?: () => void; onHome?: () => void }> = ({ onRetry, onHome }) => (
  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-4 max-w-md mx-auto">
    <div className="w-16 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 font-black text-lg">
      500
    </div>
    <div className="space-y-1">
      <h3 className="text-base font-extrabold text-slate-900">Something went wrong</h3>
      <p className="text-xs text-slate-500 font-medium">Our team has been notified.</p>
    </div>
    <div className="flex items-center gap-3">
      <Button variant="primary" size="sm" onClick={onRetry}>
        Retry
      </Button>
      <Button variant="outline" size="sm" onClick={onHome || (() => (window.location.href = '/'))}>
        Go Home
      </Button>
    </div>
  </div>
);

/**
 * Card #13: 404 Not Found Card
 */
export const NotFoundCard: React.FC<{ onDashboard?: () => void }> = ({ onDashboard }) => (
  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-4 max-w-md mx-auto">
    <span className="text-4xl font-black text-slate-800 tracking-tighter">404</span>
    <div className="space-y-1">
      <h3 className="text-base font-extrabold text-slate-900">Page not found</h3>
      <p className="text-xs text-slate-500 font-medium">The page you're looking for doesn't exist.</p>
    </div>
    <Button variant="primary" size="sm" onClick={onDashboard || (() => (window.location.href = '/dashboard'))}>
      Back to Dashboard
    </Button>
  </div>
);

/**
 * Card #14: Access Denied Card
 */
export const AccessDeniedCard: React.FC<{ onRequestAccess?: () => void }> = ({ onRequestAccess }) => (
  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-4 max-w-md mx-auto">
    <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
      <Lock className="w-7 h-7" />
    </div>
    <div className="space-y-1">
      <h3 className="text-base font-extrabold text-slate-900">Access Denied</h3>
      <p className="text-xs text-slate-500 font-medium">You don't have permission to access this resource.</p>
    </div>
    <Button variant="primary" size="sm" onClick={onRequestAccess}>
      Request Access
    </Button>
  </div>
);

/**
 * Card #15: Session Expired Card
 */
export const SessionExpiredCard: React.FC<{ onLogin?: () => void }> = ({ onLogin }) => (
  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-4 max-w-md mx-auto">
    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
      <ShieldAlert className="w-7 h-7" />
    </div>
    <div className="space-y-1">
      <h3 className="text-base font-extrabold text-slate-900">Session Expired</h3>
      <p className="text-xs text-slate-500 font-medium">Please login again to continue.</p>
    </div>
    <Button variant="primary" size="sm" onClick={onLogin || (() => (window.location.href = '/login'))}>
      Login Again
    </Button>
  </div>
);

/**
 * Card #16: Background Sync Card
 */
export const BackgroundSyncCard: React.FC = () => (
  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-4 max-w-md mx-auto">
    <div className="w-14 h-14 rounded-full bg-cyan-50 flex items-center justify-center text-[#00D9D9]">
      <RefreshCw className="w-7 h-7 animate-spin" />
    </div>
    <h3 className="text-base font-extrabold text-slate-900">Sync in Progress</h3>
    <div className="space-y-1.5 text-xs text-slate-600 font-semibold text-left w-full bg-slate-50 p-3 rounded-xl border border-slate-200">
      <div className="flex items-center gap-2 text-emerald-600">
        <Check className="w-3.5 h-3.5" /> Uploading 12 Items
      </div>
      <div className="flex items-center gap-2 text-[#00B8B8]">
        <Check className="w-3.5 h-3.5" /> Downloading 8 Items
      </div>
      <div className="flex items-center gap-2 text-amber-600">
        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Pending 4 Items
      </div>
      <div className="flex items-center gap-2 text-slate-500">
        <Check className="w-3.5 h-3.5" /> Completed 16 Items
      </div>
    </div>
  </div>
);

/**
 * Card #17: File Upload Card
 */
export const FileUploadCard: React.FC<{ progress?: number; fileName?: string }> = ({
  progress = 60,
  fileName = 'Quotation_Details.pdf',
}) => (
  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-4 max-w-md mx-auto">
    <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center text-[#00D9D9]">
      <UploadCloud className="w-7 h-7" />
    </div>
    <div className="space-y-1">
      <h3 className="text-base font-extrabold text-slate-900">Uploading Files</h3>
      <p className="text-xs text-slate-500 font-medium">3 of 5 files uploaded</p>
    </div>

    <div className="w-full space-y-2">
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-[#00D9D9] rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>
      <div className="flex justify-between text-[11px] font-mono text-slate-400">
        <span>{fileName}</span>
        <span>{progress}%</span>
      </div>
    </div>

    <div className="flex items-center gap-3">
      <Button variant="outline" size="sm">
        Cancel
      </Button>
      <Button variant="danger" size="sm">
        Retry Failed
      </Button>
    </div>
  </div>
);

/**
 * Card #18: Print Generation Card
 */
export const PrintGenerationCard: React.FC = () => (
  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-4 max-w-md mx-auto">
    <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center text-[#00D9D9]">
      <FileCheck className="w-7 h-7" />
    </div>
    <h3 className="text-base font-extrabold text-slate-900">Generating Quote</h3>
    <div className="space-y-1.5 text-xs text-emerald-700 font-bold text-left w-full bg-emerald-50 p-3 rounded-xl border border-emerald-200">
      <div className="flex items-center gap-2">
        <Check className="w-3.5 h-3.5 text-emerald-600" /> Preparing PDF
      </div>
      <div className="flex items-center gap-2">
        <Check className="w-3.5 h-3.5 text-emerald-600" /> Generating
      </div>
      <div className="flex items-center gap-2">
        <Check className="w-3.5 h-3.5 text-emerald-600" /> Opening Preview
      </div>
    </div>
  </div>
);

/**
 * Card #24: Maintenance Mode Card
 */
export const MaintenanceCard: React.FC = () => (
  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-4 max-w-md mx-auto">
    <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
      <Wrench className="w-7 h-7" />
    </div>
    <div className="space-y-1">
      <h3 className="text-base font-extrabold text-slate-900">We're under maintenance</h3>
      <p className="text-xs text-slate-500 font-medium">We'll be back shortly. Thanks for your patience!</p>
    </div>
  </div>
);

/**
 * Card #25: Success State Card
 */
export const SuccessStateCard: React.FC<{ onContinue?: () => void }> = ({ onContinue }) => (
  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-4 max-w-md mx-auto">
    <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
      <CheckCircle2 className="w-8 h-8" />
    </div>
    <div className="space-y-1">
      <h3 className="text-base font-extrabold text-slate-900">Everything Saved!</h3>
      <p className="text-xs text-slate-500 font-medium">Your quotation has been saved successfully.</p>
    </div>
    <Button variant="primary" size="sm" onClick={onContinue}>
      Continue
    </Button>
  </div>
);
