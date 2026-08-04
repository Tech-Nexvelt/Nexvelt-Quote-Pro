import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  prefixSymbol?: string;
  suffixSymbol?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, prefixSymbol, suffixSymbol, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '_') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-[11px] font-extrabold uppercase tracking-wider text-[#4B5563]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefixSymbol && (
            <span className="absolute left-3.5 text-sm font-semibold text-[#6B7280] pointer-events-none select-none">
              {prefixSymbol}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            className={twMerge(
              clsx(
                'w-full h-[44px] rounded-xl border border-[#E2E8F0] bg-white text-[#111827] text-xs font-semibold px-3.5 transition-all duration-150',
                'placeholder:text-[#9CA3AF]',
                'focus:outline-none focus:ring-2 focus:ring-[#00D9D9]/20 focus:border-[#00D9D9]',
                prefixSymbol && 'pl-9',
                suffixSymbol && 'pr-14',
                error && 'border-red-500 focus:ring-red-500/20 focus:border-red-500',
                className
              )
            )}
            {...props}
          />
          {suffixSymbol && (
            <span className="absolute right-3 text-xs font-bold text-[#4B5563] pointer-events-none select-none bg-[#F8FAFC] px-2 py-1 rounded-lg border border-[#E2E8F0]">
              {suffixSymbol}
            </span>
          )}
        </div>
        {error ? (
          <p className="text-xs text-red-500 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-[#6B7280]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
