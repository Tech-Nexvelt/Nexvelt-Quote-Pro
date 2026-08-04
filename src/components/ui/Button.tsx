import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'glass' | 'success' | 'error';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children?: React.ReactNode;
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  loadingText?: string;
  preventDoubleClick?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  isLoading,
  isSuccess,
  isError,
  loadingText,
  preventDoubleClick = true,
  className,
  disabled,
  onClick,
  ...props
}) => {
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading || isProcessing) return;
    if (preventDoubleClick) {
      setIsProcessing(true);
      setTimeout(() => setIsProcessing(false), 600);
    }
    if (onClick) {
      onClick(e);
    }
  };

  const baseStyles =
    'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

  const variants = {
    primary:
      'bg-[#00D9D9] hover:bg-[#00B8B8] text-white font-extrabold shadow-sm focus:ring-[#00D9D9]',
    secondary:
      'bg-[#111827] text-white hover:bg-[#1F2937] font-bold focus:ring-[#111827]',
    outline:
      'border-2 border-slate-300 text-slate-800 bg-white hover:bg-slate-50 font-bold focus:ring-slate-400',
    ghost:
      'text-[#111827] font-bold hover:bg-[#F1F5F9] focus:ring-[#111827]',
    danger:
      'bg-red-600 text-white hover:bg-red-700 font-bold focus:ring-red-500',
    glass:
      'bg-white border border-[#E2E8F0] text-[#111827] font-bold hover:bg-[#F8FAFC] shadow-sm focus:ring-[#00D9D9]',
    success:
      'bg-[#10B981] hover:bg-emerald-600 text-white font-bold focus:ring-[#10B981]',
    error:
      'bg-[#EF4444] hover:bg-rose-700 text-white font-bold focus:ring-[#EF4444]',
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  const activeVariant = isSuccess ? 'success' : isError ? 'error' : variant;

  return (
    <motion.button
      whileTap={{ scale: disabled || isLoading || isProcessing ? 1 : 0.97 }}
      whileHover={{ y: disabled || isLoading || isProcessing ? 0 : -1 }}
      className={twMerge(clsx(baseStyles, variants[activeVariant], sizes[size], className))}
      disabled={disabled || isLoading || isProcessing}
      onClick={handleClick}
      aria-busy={isLoading || isProcessing}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-4 w-4 text-current shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>{loadingText || children}</span>
        </>
      ) : (
        <>
          {icon && <span className="shrink-0 text-current">{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  );
};
