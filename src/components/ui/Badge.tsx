import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps {
  variant?: 'cyan' | 'slate' | 'green' | 'amber' | 'red';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'cyan',
  size = 'sm',
  children,
  className,
}) => {
  const variants = {
    cyan: 'bg-[#E6F7F7] text-[#008080] border-[#00D9D9]/40 font-extrabold',
    slate: 'bg-[#F1F5F9] text-[#111827] border-[#CBD5E1] font-bold',
    green: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold',
    amber: 'bg-amber-50 text-amber-900 border-amber-300 font-bold',
    red: 'bg-red-50 text-red-800 border-red-300 font-bold',
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center rounded-full border tracking-wide uppercase font-mono',
          variants[variant],
          sizes[size],
          className
        )
      )}
    >
      {children}
    </span>
  );
};
