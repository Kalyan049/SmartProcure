import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ChevronDown, AlertCircle } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: (SelectOption | string)[];
  error?: string;
  helperText?: string;
  isRequired?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, isRequired, className, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const errorId = error && selectId ? `${selectId}-error` : undefined;
    const helperId = helperText && selectId ? `${selectId}-helper` : undefined;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-semibold text-text-primary flex items-center gap-1 select-none"
          >
            {label}
            {isRequired && <span className="text-semantic-error" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative flex items-center w-full">
          <select
            id={selectId}
            ref={ref}
            aria-invalid={Boolean(error)}
            aria-describedby={errorId || helperId}
            className={twMerge(
              clsx(
                'w-full bg-white text-text-primary text-sm rounded-sm border border-surface-border px-3.5 py-2.5 pr-10 appearance-none transition-colors duration-150',
                'focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary min-h-[44px] cursor-pointer',
                error && 'border-semantic-error focus:border-semantic-error focus:ring-semantic-error',
                className
              )
            )}
            {...props}
          >
            {options.map((opt) => {
              const value = typeof opt === 'string' ? opt : opt.value;
              const optLabel = typeof opt === 'string' ? opt : opt.label;
              const disabled = typeof opt === 'string' ? false : opt.disabled;
              return (
                <option key={value} value={value} disabled={disabled}>
                  {optLabel}
                </option>
              );
            })}
          </select>
          <ChevronDown className="w-4 h-4 text-text-muted absolute right-3.5 pointer-events-none" aria-hidden="true" />
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

Select.displayName = 'Select';
