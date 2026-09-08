import React from 'react';
import { Card } from './Card';
import { clsx } from 'clsx';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  iconColor?: 'green' | 'amber' | 'blue' | 'red' | 'slate';
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
    label?: string;
    isPositive?: boolean; // If 'up' is good or bad
  };
  badge?: React.ReactNode;
  className?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  icon,
  iconColor = 'green',
  trend,
  badge,
  className,
}) => {
  const iconBgStyles = {
    green: 'bg-brand-tint text-brand-primary border border-brand-mint',
    amber: 'bg-amber-50 text-semantic-warning border border-amber-200',
    blue: 'bg-blue-50 text-semantic-info border border-blue-200',
    red: 'bg-red-50 text-semantic-error border border-red-200',
    slate: 'bg-slate-100 text-text-secondary border border-surface-border',
  };

  return (
    <Card className={clsx('p-4 sm:p-5', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {icon && (
            <div
              className={clsx(
                'w-10 h-10 rounded-sm flex items-center justify-center shrink-0 shadow-sm',
                iconBgStyles[iconColor]
              )}
              aria-hidden="true"
            >
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              {title}
            </h3>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight tabular-nums">
                {value}
              </span>
              {unit && (
                <span className="text-sm font-medium text-text-secondary">{unit}</span>
              )}
            </div>
          </div>
        </div>
        {badge && <div className="shrink-0">{badge}</div>}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-2.5 border-t border-surface-border flex items-center justify-between text-xs">
          {subtitle && <span className="text-text-secondary">{subtitle}</span>}
          {trend && (
            <div
              className={clsx(
                'inline-flex items-center gap-1 font-medium',
                trend.isPositive === undefined
                  ? 'text-text-secondary'
                  : trend.isPositive
                  ? 'text-brand-primary'
                  : 'text-semantic-error'
              )}
            >
              {trend.direction === 'up' && <ArrowUpRight className="w-3.5 h-3.5" />}
              {trend.direction === 'down' && <ArrowDownRight className="w-3.5 h-3.5" />}
              {trend.direction === 'neutral' && <Minus className="w-3.5 h-3.5" />}
              <span>{trend.value}</span>
              {trend.label && <span className="text-text-muted">{trend.label}</span>}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
