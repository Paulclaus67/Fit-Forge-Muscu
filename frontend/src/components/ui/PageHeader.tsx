import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  action,
  children,
}) => {
  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl bg-app-secondary p-6 shadow-xl border border-app">
      <div className="absolute inset-0 opacity-5" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-app mb-2">{title}</h1>
            {subtitle && (
              <p className="text-sm text-app-secondary">{subtitle}</p>
            )}
          </div>
          {action && (
            <button
              onClick={action.onClick}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-app rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 shrink-0"
            >
              {action.icon}
              {action.label}
            </button>
          )}
        </div>
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
