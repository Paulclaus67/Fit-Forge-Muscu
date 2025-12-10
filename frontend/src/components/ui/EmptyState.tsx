import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div className="mb-4 text-6xl opacity-50">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-app mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-app-secondary mb-6 max-w-xs">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-primary text-app-secondary rounded-lg font-medium hover:bg-opacity-90 transition-all duration-200 hover:scale-105"
          type="button"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
