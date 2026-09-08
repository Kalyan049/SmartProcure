import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from '../ui/Button';
import { clsx } from 'clsx';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className,
}) => {
  return (
    <div
      className={clsx(
        'w-full flex flex-col items-center justify-center p-8 text-center bg-white rounded-md border border-surface-border shadow-sm',
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-brand-tint border border-brand-mint text-brand-primary flex items-center justify-center mb-3">
        {icon || <PackageOpen className="w-6 h-6" aria-hidden="true" />}
      </div>
      <h3 className="text-base font-bold text-text-primary">{title}</h3>
      <p className="text-xs sm:text-sm text-text-secondary max-w-sm mt-1 mb-5 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="md" variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
