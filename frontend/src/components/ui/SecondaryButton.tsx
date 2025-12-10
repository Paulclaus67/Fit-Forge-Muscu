// src/components/ui/SecondaryButton.tsx
import React from 'react';

interface SecondaryButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'px-3 py-2 text-xs rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-xl',
};

const baseClasses =
  'inline-flex justify-center items-center font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary btn-secondary';

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  className = '',
  onClick,
  disabled,
  size = 'md',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
};
