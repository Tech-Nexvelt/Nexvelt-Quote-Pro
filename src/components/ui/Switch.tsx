import React from 'react';
import { motion } from 'framer-motion';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled,
}) => {
  return (
    <label className={`flex items-center justify-between gap-3 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      {(label || description) && (
        <div>
          {label && <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">{label}</span>}
          {description && <span className="text-xs text-slate-500 dark:text-slate-400 block">{description}</span>}
        </div>
      )}
      <div
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ease-in-out ${
          checked ? 'bg-[#00D9D9]' : 'bg-slate-300 dark:bg-slate-700'
        }`}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md my-0.5 ${
            checked ? 'translate-x-5.5' : 'translate-x-0.5'
          }`}
        />
      </div>
    </label>
  );
};
