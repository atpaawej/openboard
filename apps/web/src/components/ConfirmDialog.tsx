import React, { useEffect } from 'react';
import { IconClose, IconAlertCircle } from './icons/Icons.js';
import { Button } from './ui/Button.js';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  variant = 'primary',
  onConfirm,
  onCancel,
  isSubmitting = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const getConfirmButtonVariant = () => {
    switch (variant) {
      case 'danger':
        return 'danger';
      case 'warning':
        return 'warning';
      default:
        return 'primary';
    }
  };

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className="modal-container modal-size-sm"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-confirm-title"
        aria-describedby="dialog-confirm-desc"
      >
        <div className="modal-header">
          <div className="modal-title-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
            {variant === 'danger' || variant === 'warning' ? (
              <span style={{ color: variant === 'danger' ? 'var(--danger)' : 'var(--warning)', display: 'inline-flex' }}>
                <IconAlertCircle size={18} />
              </span>
            ) : null}
            <h2 id="dialog-confirm-title" className="modal-title">
              {title}
            </h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onCancel}
            aria-label="Close dialog"
          >
            <IconClose size={15} />
          </button>
        </div>

        <div className="modal-body">
          <p id="dialog-confirm-desc" className="dialog-confirm-message">
            {message}
          </p>
        </div>

        <div className="modal-footer">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {cancelLabel}
          </Button>
          <Button
            id="btn-dialog-confirm-action"
            type="button"
            variant={getConfirmButtonVariant()}
            size="md"
            onClick={() => onConfirm()}
            isLoading={isSubmitting}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
