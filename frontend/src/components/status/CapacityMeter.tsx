import React from 'react';
import { clsx } from 'clsx';
import { StatusBadge } from './StatusBadge';

export interface CapacityMeterProps {
  percent: number;
  label?: string;
  centerName?: string;
  showStatusBadge?: boolean;
  showPercentText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CapacityMeter: React.FC<CapacityMeterProps> = ({
  percent,
  label = 'Center Capacity',
  centerName,
  showStatusBadge = true,
  showPercentText = true,
  size = 'md',
  className,
}) => {
  const clamped = Math.min(100, Math.max(0, Math.round(percent)));

  const getThresholdInfo = () => {
    if (clamped >= 90) {
      return {
        status: 'CRITICAL',
        colorClass: 'bg-semantic-error',
        textColor: 'text-semantic-error',
        desc: 'Center at maximum capacity',
      };
    }
    if (clamped >= 80) {
      return {
        status: 'HIGH',
        colorClass: 'bg-orange-500',
        textColor: 'text-orange-700',
        desc: 'High queue pressure',
      };
    }
    if (clamped >= 60) {
      return {
        status: 'BUSY',
        colorClass: 'bg-semantic-warning',
        textColor: 'text-amber-800',
        desc: 'Moderate queue load',
      };
    }
    return {
      status: 'NORMAL',
      colorClass: 'bg-brand-primary',
      textColor: 'text-brand-primary',
      desc: 'Normal operations',
    };
  };

  const info = getThresholdInfo();

  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className={clsx('w-full flex flex-col gap-1.5 text-left', className)}>
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 min-w-0">
          {centerName && (
            <span className="font-bold text-text-primary truncate">{centerName}</span>
          )}
          {centerName && <span className="text-text-muted">•</span>}
          <span className="text-text-secondary font-medium">{label}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {showPercentText && (
            <span className="font-bold text-text-primary tabular-nums">
              {clamped}% utilized
            </span>
          )}
          {showStatusBadge && (
            <StatusBadge status={info.status} size="sm" showIcon={false} />
          )}
        </div>
      </div>

      {/* Progress Track */}
      <div
        className={clsx(
          'w-full bg-slate-100 rounded-full overflow-hidden border border-surface-border p-0.5',
          heightClasses[size]
        )}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${clamped}% utilized (${info.status})`}
      >
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-300 ease-out',
            info.colorClass
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
