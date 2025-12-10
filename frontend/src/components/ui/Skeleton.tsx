import React from 'react';

interface SkeletonProps {
  className?: string;
  count?: number;
  variant?: 'text' | 'circular' | 'rectangular';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  count = 1,
  variant = 'rectangular',
}) => {
  const baseClasses = 'skeleton bg-app-secondary rounded';

  const variantClasses = {
    text: 'h-4 rounded w-full mb-2',
    circular: 'w-10 h-10 rounded-full',
    rectangular: 'h-24 w-full rounded-lg mb-3',
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        />
      ))}
    </>
  );
};
