import React from 'react';

interface ListItemProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: string;
  onClick?: () => void;
  action?: React.ReactNode;
  className?: string;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  icon,
  badge,
  onClick,
  action,
  className = '',
}) => {
  return (
    <div
      className={`flex items-center justify-between gap-3 p-4 rounded-xl border border-app bg-app-secondary hover:bg-app transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-primary/50 hover:shadow-md' : ''
      } ${className}`}
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
      {icon && (
        <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-app truncate">{title}</h3>
        {subtitle && (
          <p className="text-xs text-app-secondary truncate mt-0.5">{subtitle}</p>
        )}
      </div>

      {badge && (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary shrink-0">
          {badge}
        </span>
      )}

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
