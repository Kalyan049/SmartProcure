import React from 'react';
import { Card } from './Card';
import { clsx } from 'clsx';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  iconColor?: 'green' | 'amber' | 'blue' | 'red';
  badge?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconColor = 'green',
  badge,
}) => {
  const iconBgStyles = {
    green: 'bg-brand-tint text-brand-primary',
    amber: 'bg-amber-50 text-semantic-warning',
    blue: 'bg-blue-50 text-semantic-info',
    red: 'bg-red-50 text-semantic-error',
  };

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {icon && (
            <div
              className={clsx(
                'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                iconBgStyles[iconColor]
              )}
            >
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              {title}
            </h3>
            <p className="text-2xl font-bold text-text-primary mt-1">{value}</p>
          </div>
        </div>
        {badge && <div>{badge}</div>}
      </div>
      {subtitle && <p className="text-xs text-text-secondary mt-3">{subtitle}</p>}
    </Card>
  );
};
