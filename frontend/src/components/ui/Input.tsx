import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AlertCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  unitSuffix?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isRequired?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      unitSuffix,
      leftIcon,
      rightIcon,
      isRequired,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const errorId = error && inputId ? `${inputId}-error` : undefined;
    const helperId = helperText && inputId ? `${inputId}-helper` : undefined;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-text-primary flex items-center gap-1 select-none"
          >
            {label}
            {isRequired && <span className="text-semantic-error" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3.5 text-text-muted pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            aria-invalid={Boolean(error)}
            aria-describedby={errorId || helperId}
            className={twMerge(
              clsx(
                'w-full bg-white text-text-primary text-sm rounded-sm border border-surface-border px-3.5 py-2.5 transition-colors duration-150',
                'focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary',
                'placeholder:text-text-muted min-h-[44px]',
                leftIcon && 'pl-10',
                (unitSuffix || rightIcon) && 'pr-20',
                error && 'border-semantic-error focus:border-semantic-error focus:ring-semantic-error',
                className
              )
            )}
            {...props}
          />
          {unitSuffix && (
            <span className="absolute right-3.5 text-sm font-medium text-text-secondary select-none pointer-events-none bg-surface-muted px-2 py-0.5 rounded text-xs">
              {unitSuffix}
            </span>
          )}
          {!unitSuffix && rightIcon && (
            <div className="absolute right-3.5 text-text-muted flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} className="text-xs text-semantic-error flex items-center gap-1 mt-0.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-xs text-text-muted mt-0.5">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
