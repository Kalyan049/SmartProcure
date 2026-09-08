import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '../ui/Button';

export interface AlertCardProps {
  type: 'warning' | 'critical' | 'info' | 'success' | 'suggestion';
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  type,
  title,
  message,
  actionLabel,
  onAction,
  className,
}) => {
  const typeConfig = {
    warning: {
      container: 'bg-amber-50/90 border-l-4 border-l-semantic-warning border-y border-r border-amber-200',
      icon: <AlertTriangle className="w-5 h-5 text-semantic-warning shrink-0" aria-hidden="true" />,
      titleColor: 'text-amber-950',
      msgColor: 'text-amber-900',
      btnVariant: 'secondary' as const,
    },
    critical: {
      container: 'bg-red-50/90 border-l-4 border-l-semantic-error border-y border-r border-red-200',
      icon: <AlertCircle className="w-5 h-5 text-semantic-error shrink-0" aria-hidden="true" />,
      titleColor: 'text-red-950',
      msgColor: 'text-red-900',
      btnVariant: 'danger' as const,
    },
    info: {
      container: 'bg-blue-50/90 border-l-4 border-l-semantic-info border-y border-r border-blue-200',
      icon: <Info className="w-5 h-5 text-semantic-info shrink-0" aria-hidden="true" />,
      titleColor: 'text-blue-950',
      msgColor: 'text-blue-900',
      btnVariant: 'outline' as const,
    },
    success: {
      container: 'bg-brand-tint/90 border-l-4 border-l-brand-primary border-y border-r border-brand-mint',
      icon: <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0" aria-hidden="true" />,
      titleColor: 'text-brand-dark',
      msgColor: 'text-brand-dark/90',
      btnVariant: 'primary' as const,
    },
    suggestion: {
      container: 'bg-brand-tint/90 border-l-4 border-l-brand-primary border-y border-r border-brand-mint',
      icon: <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0" aria-hidden="true" />,
      titleColor: 'text-brand-dark',
      msgColor: 'text-brand-dark/90',
      btnVariant: 'primary' as const,
    },
  };


  const config = typeConfig[type];

  return (
    <div
      className={clsx(
        'rounded-sm p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm text-left',
        config.container,
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-3 flex-1">
        <div className="mt-0.5">{config.icon}</div>
        <div>
          <h4 className={clsx('text-sm font-bold', config.titleColor)}>{title}</h4>
          <p className={clsx('text-xs mt-0.5 leading-relaxed', config.msgColor)}>{message}</p>
        </div>
      </div>
      {actionLabel && onAction && (
        <div className="shrink-0 self-end sm:self-center">
          <Button size="sm" variant={config.btnVariant} onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
