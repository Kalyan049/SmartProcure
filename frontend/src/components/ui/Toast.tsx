import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { clsx } from 'clsx';

export interface ToastProps {
  type?: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ type = 'info', title, message, onClose }) => {
  const typeConfig = {
    success: {
      icon: <CheckCircle2 className="w-5 h-5 text-semantic-success" aria-hidden="true" />,
      border: 'border-l-semantic-success',
      defaultTitle: 'Success',
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5 text-semantic-warning" aria-hidden="true" />,
      border: 'border-l-semantic-warning',
      defaultTitle: 'Warning',
    },
    error: {
      icon: <AlertCircle className="w-5 h-5 text-semantic-error" aria-hidden="true" />,
      border: 'border-l-semantic-error',
      defaultTitle: 'Error',
    },
    info: {
      icon: <Info className="w-5 h-5 text-semantic-info" aria-hidden="true" />,
      border: 'border-l-semantic-info',
      defaultTitle: 'Information',
    },
  };

  const config = typeConfig[type];

  return (
    <div
      className={clsx(
        'fixed bottom-6 right-6 z-50 flex items-start gap-3 p-4 rounded-sm shadow-card border border-surface-border border-l-4 bg-white max-w-sm transition-all text-left'
      )}
      role="alert"
    >
      <div className="shrink-0 mt-0.5">{config.icon}</div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-text-primary leading-none mb-1">
          {title || config.defaultTitle}
        </h4>
        <p className="text-xs text-text-secondary leading-relaxed">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-text-muted hover:text-text-primary p-0.5 -mr-1 -mt-1 rounded transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};
