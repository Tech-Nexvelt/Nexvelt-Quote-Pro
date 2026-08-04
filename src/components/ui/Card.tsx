import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', glass, ...props }) => {
  return (
    <div
      className={`bg-white border border-[#E5E7EB] rounded-[18px] p-6 shadow-[0_2px_12px_rgba(15,23,42,0.05)] transition-all ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
