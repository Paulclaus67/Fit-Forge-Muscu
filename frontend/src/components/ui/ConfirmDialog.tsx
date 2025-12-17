import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'default' | 'danger';
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  description,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  tone = 'default',
  isConfirming = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  const confirmButtonClass =
    tone === 'danger'
      ? 'btn-danger'
      : 'btn-primary';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-app bg-app-secondary shadow-2xl">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-(--primary)/40 to-transparent" />

        <div className="flex items-start gap-3 p-5">
          <div className="flex-1 space-y-2">
            <p className="text-base font-semibold text-app">{title}</p>
            <p className="text-sm text-app-secondary leading-relaxed">{description}</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full p-2 text-app-secondary hover:text-app hover:bg-app-secondary transition-colors"
            aria-label="Fermer la fenêtre de confirmation"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-app bg-app px-5 py-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isConfirming}
            className="rounded-full btn-secondary px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all shadow-sm ${confirmButtonClass} disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {isConfirming ? 'Patientez…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
