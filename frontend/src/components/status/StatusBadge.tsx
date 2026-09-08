import React from 'react';
import { clsx } from 'clsx';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  AlertCircle,
  XCircle,
  Activity,
} from 'lucide-react';

export type SmartProcureStatus =
  | 'OPEN'
  | 'CLOSED'
  | 'NORMAL'
  | 'BUSY'
  | 'HIGH'
  | 'CRITICAL'
  | 'WAITING'
  | 'ARRIVED'
  | 'INSPECTION'
  | 'GRADING'
  | 'WEIGHING'
  | 'VERIFICATION'
  | 'COMPLETED'
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | string;

export interface StatusBadgeProps {
  status: SmartProcureStatus;
  size?: 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'sm',
  showIcon = true,
  className,
}) => {
  const normalized = status.toUpperCase();

  const getStyleAndIcon = () => {
    switch (normalized) {
      // Green / Positive / Normal
      case 'OPEN':
      case 'NORMAL':
      case 'COMPLETED':
      case 'PAID':
      case 'CONFIRMED':
        return {
          style: 'bg-brand-tint text-brand-primary border-brand-mint',
          icon: <CheckCircle2 className="w-3 h-3 text-brand-primary" aria-hidden="true" />,
          dot: 'bg-brand-primary',
        };

      // Amber / Warning / In-Progress
      case 'BUSY':
      case 'HIGH':
      case 'WAITING':
      case 'ARRIVED':
      case 'PENDING':
      case 'INSPECTION':
      case 'GRADING':
      case 'WEIGHING':
      case 'VERIFICATION':
        return {
          style: 'bg-amber-50 text-amber-900 border-amber-200',
          icon: <Clock className="w-3 h-3 text-semantic-warning" aria-hidden="true" />,
          dot: 'bg-semantic-warning',
        };

      // Red / Critical / Error / Closed
      case 'CLOSED':
      case 'CRITICAL':
      case 'FAILED':
      case 'CANCELLED':
      case 'REJECTED':
        return {
          style: 'bg-red-50 text-semantic-error border-red-200',
          icon: <XCircle className="w-3 h-3 text-semantic-error" aria-hidden="true" />,
          dot: 'bg-semantic-error',
        };

      // Neutral / Default
      default:
        return {
          style: 'bg-slate-100 text-text-secondary border-surface-border',
          icon: <Activity className="w-3 h-3 text-text-muted" aria-hidden="true" />,
          dot: 'bg-text-muted',
        };
    }
  };

  const { style, icon, dot } = getStyleAndIcon();

  const sizeClasses = {
    sm: 'text-[11px] px-2.5 py-0.5 gap-1.5 font-bold',
    md: 'text-xs px-3 py-1 gap-2 font-bold',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full tracking-wider uppercase border select-none',
        sizeClasses[size],
        style,
        className
      )}
      role="status"
      aria-label={`Status: ${status}`}
    >
      {showIcon ? icon : <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', dot)} />}
      <span>{status}</span>
    </span>
  );
};
