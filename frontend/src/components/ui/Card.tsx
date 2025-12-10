// src/components/ui/Card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  onClick,
}) => {
  return (
    <section
      className={`
        bg-app-secondary 
        border border-app 
        rounded-2xl p-5
        shadow-sm
        transition-all duration-300
        ${hoverable ? 'hover:shadow-md hover:border-primary/50 cursor-pointer hover:scale-[1.02]' : ''}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {children}
    </section>
  );
};
