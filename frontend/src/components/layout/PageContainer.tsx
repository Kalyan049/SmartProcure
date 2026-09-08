import React from 'react';
import { clsx } from 'clsx';

export interface PageContainerProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  title,
  subtitle,
  action,
  children,
  className,
}) => {
  return (
    <div className={clsx('w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-24 md:pb-12', className)}>
      {(title || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {title && <h1 className="text-2xl font-bold text-text-primary tracking-tight">{title}</h1>}
            {subtitle && <p className="text-sm text-text-secondary mt-1">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
