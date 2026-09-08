import React from 'react';
import { clsx } from 'clsx';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'circle' | 'kpi' | 'button';
  count?: number;
}

export const LoadingSkeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'card',
  count = 1,
}) => {
  const variantStyles = {
    text: 'h-4 w-full rounded-sm',
    button: 'h-11 w-32 rounded-sm',
    card: 'h-32 w-full rounded-md border border-surface-border',
    kpi: 'h-24 w-full rounded-md border border-surface-border',
    circle: 'w-10 h-10 rounded-full',
  };

  const elements = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={clsx(
        'animate-pulse bg-slate-200/70',
        variantStyles[variant],
        className
      )}
      aria-hidden="true"
    />
  ));

  return count === 1 ? elements[0] : <div className="space-y-3">{elements}</div>;
};
