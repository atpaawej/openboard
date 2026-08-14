import React from 'react';
import { IconCheck, IconAlertCircle, IconClose } from '../icons/Icons.js';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type?: ToastType;
  durationMs?: number;
}

export interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const { id, title, message, type = 'info' } = toast;

  const renderIcon = () => {
    switch (type) {
      case 'success':
        return <IconCheck size={16} />;
      case 'error':
      case 'warning':
        return <IconAlertCircle size={16} />;
      default:
        return <IconCheck size={16} />;
    }
  };

  return (
    <div className={`toast-card toast-${type}`} role="alert">
      <span className="toast-icon">{renderIcon()}</span>
      <div className="toast-content">
        <span className="toast-title">{title}</span>
        {message && <span className="toast-desc">{message}</span>}
      </div>
      <button
        type="button"
        className="toast-close-btn"
        onClick={() => onDismiss(id)}
        aria-label="Dismiss notification"
      >
        <IconClose size={13} />
      </button>
    </div>
  );
};
