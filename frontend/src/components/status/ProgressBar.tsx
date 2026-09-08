import React from 'react';
import { clsx } from 'clsx';

export interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  showPercent?: boolean;
  colorVariant?: 'brand' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  showPercent = true,
  colorVariant = 'brand',
  size = 'md',
  className,
}) => {
  const clamped = Math.min(100, Math.max(0, Math.round(value)));

  const colorClasses = {
    brand: 'bg-brand-primary',
    success: 'bg-semantic-success',
    warning: 'bg-semantic-warning',
    error: 'bg-semantic-error',
    info: 'bg-semantic-info',
  };

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={clsx('w-full flex flex-col gap-1.5 text-left', className)}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between text-xs font-semibold text-text-secondary">
          {label && <span>{label}</span>}
          {showPercent && (
            <span className="text-text-primary tabular-nums font-bold">
              {clamped}%
            </span>
          )}
        </div>
      )}
      <div
        className={clsx(
          'w-full bg-slate-100 rounded-full overflow-hidden border border-surface-border',
          heightClasses[size]
        )}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || `Progress: ${clamped}%`}
      >
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-300 ease-out',
            colorClasses[colorVariant]
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
