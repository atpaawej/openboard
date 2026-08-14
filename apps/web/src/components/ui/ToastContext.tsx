import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, type ToastItem, type ToastType } from './Toast.js';

export interface ToastContextValue {
  showToast: (options: {
    title: string;
    message?: string;
    type?: ToastType;
    durationMs?: number;
  }) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({
      title,
      message,
      type = 'info',
      durationMs = 3200,
    }: {
      title: string;
      message?: string;
      type?: ToastType;
      durationMs?: number;
    }) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newToast: ToastItem = { id, title, message, type, durationMs };

      setToasts((prev) => [...prev.slice(-4), newToast]);

      if (durationMs > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, durationMs);
      }
    },
    [dismissToast],
  );

  const success = useCallback(
    (title: string, message?: string) => showToast({ title, message, type: 'success' }),
    [showToast],
  );
  const error = useCallback(
    (title: string, message?: string) => showToast({ title, message, type: 'error' }),
    [showToast],
  );
  const warning = useCallback(
    (title: string, message?: string) => showToast({ title, message, type: 'warning' }),
    [showToast],
  );
  const info = useCallback(
    (title: string, message?: string) => showToast({ title, message, type: 'info' }),
    [showToast],
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      <div className="toast-viewport" aria-live="polite">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback if not inside ToastProvider so tests or standalone views never crash
    return {
      showToast: () => {},
      success: () => {},
      error: () => {},
      warning: () => {},
      info: () => {},
    };
  }
  return context;
}
