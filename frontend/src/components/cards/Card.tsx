import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'tinted' | 'interactive' | 'bordered';
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  header,
  footer,
  className,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-surface-card border border-surface-border shadow-card',
    tinted: 'bg-brand-tint border border-brand-mint shadow-card',
    bordered: 'bg-surface-card border-2 border-surface-border shadow-card',
    interactive:
      'bg-surface-card border border-surface-border shadow-card hover:shadow-card-hover hover:border-brand-primary cursor-pointer transition-all duration-150',
  };

  return (
    <div
      className={twMerge(
        clsx('rounded-md p-5 flex flex-col text-left', variantStyles[variant], className)
      )}
      {...props}
    >
      {header && <div className="mb-4 pb-3 border-b border-surface-border">{header}</div>}
      <div className="flex-1">{children}</div>
      {footer && <div className="mt-4 pt-3 border-t border-surface-border">{footer}</div>}
    </div>
  );
};
