import React from 'react';
import { ExclamationTriangleIcon, CheckCircleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface AlertProps {
  variant: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  closeable?: boolean;
}

export const Alert: React.FC<AlertProps> = ({
  variant,
  title,
  message,
  onClose,
  closeable = true,
}) => {
  const variants = {
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-800 dark:text-green-300',
      icon: CheckCircleIcon,
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-800 dark:text-red-300',
      icon: XCircleIcon,
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      text: 'text-yellow-800 dark:text-yellow-300',
      icon: ExclamationTriangleIcon,
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-300',
      icon: InformationCircleIcon,
    },
  };

  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div
      className={`rounded-lg border ${config.bg} ${config.border} p-4 transition-all duration-300 animate-slide-in`}
      role="alert"
    >
      <div className="flex gap-3">
        <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${config.text}`} />
        <div className="flex-1">
          {title && <h3 className={`font-semibold ${config.text}`}>{title}</h3>}
          <p className={`text-sm ${config.text}`}>{message}</p>
        </div>
        {closeable && onClose && (
          <button
            onClick={onClose}
            className={`shrink-0 text-lg font-bold ${config.text} hover:opacity-70 transition-opacity`}
            aria-label="Fermer l'alerte"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};
