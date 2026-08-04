import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SelectOption {
  value: string;
  label: string;
}

export interface CustomSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  error?: string;
  disabled?: boolean;
}

export const Select: React.FC<CustomSelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  className = '',
  error,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else if (focusedIndex >= 0 && options[focusedIndex]) {
        onChange(options[focusedIndex].value);
        setIsOpen(false);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setFocusedIndex(0);
      } else {
        setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (isOpen) {
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const selectId = React.useId();

  return (
    <div className={`w-full space-y-1.5 select-none ${className}`} ref={containerRef}>
      {label && (
        <label htmlFor={selectId} className="block text-[13px] font-medium text-[#6B7280]">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Custom Trigger Button */}
        <button
          id={selectId}
          aria-label={label || placeholder}
          type="button"
          tabIndex={0}
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className={`w-full h-12 px-3.5 bg-white border ${
            isOpen ? 'border-[#00D9D9] ring-2 ring-[#00D9D9]/20' : 'border-[#D1D5DB]'
          } rounded-xl text-xs font-semibold text-[#111827] flex items-center justify-between transition-all duration-150 shadow-2xs hover:border-[#00D9D9] ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-[#6B7280] transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-[#00D9D9]' : ''
            }`}
          />
        </button>

        {/* Custom Animated Dropdown Popover */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 4, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 left-0 right-0 top-full bg-white border border-[#E5E7EB] rounded-xl shadow-[0_8px_24px_rgba(15,23,42,0.08)] overflow-hidden max-h-60 overflow-y-auto py-1"
            >
              {options.map((opt, idx) => {
                const isSelected = opt.value === value;
                const isFocused = idx === focusedIndex;

                return (
                  <div
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    onMouseEnter={() => setFocusedIndex(idx)}
                    className={`px-3.5 py-2.5 text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#00D9D9] text-white font-bold'
                        : isFocused
                        ? 'bg-[#E0F7F7] text-[#111827]'
                        : 'text-[#111827] hover:bg-[#E0F7F7]'
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-2" />}
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && <p className="text-xs text-[#DC2626] font-medium">{error}</p>}
    </div>
  );
};
