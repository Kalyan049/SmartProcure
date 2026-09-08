import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AlertCircle } from 'lucide-react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  isRequired?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, isRequired, className, id, rows = 4, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const errorId = error && textareaId ? `${textareaId}-error` : undefined;
    const helperId = helperText && textareaId ? `${textareaId}-helper` : undefined;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-semibold text-text-primary flex items-center gap-1 select-none"
          >
            {label}
            {isRequired && <span className="text-semantic-error" aria-hidden="true">*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId || helperId}
          className={twMerge(
            clsx(
              'w-full bg-white text-text-primary text-sm rounded-sm border border-surface-border p-3 transition-colors duration-150',
              'focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary',
              'placeholder:text-text-muted resize-y min-h-[80px]',
              error && 'border-semantic-error focus:border-semantic-error focus:ring-semantic-error',
              className
            )
          )}
          {...props}
        />
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

Textarea.displayName = 'Textarea';
