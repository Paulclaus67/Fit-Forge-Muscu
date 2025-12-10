import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  fullPage = false,
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const spinner = (
    <div className={`${sizeClasses[size]} relative animate-spin`}>
      <div
        className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-primary"
        style={{
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <div
        className="absolute inset-1 rounded-full border-2 border-transparent border-b-accent"
        style={{
          animation: 'spin 1.2s linear infinite reverse',
        }}
      />
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-app/50 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      {spinner}
    </div>
  );
};
