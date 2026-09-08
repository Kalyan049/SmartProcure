import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { clsx } from 'clsx';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to Load Information',
  message = 'We encountered an issue communicating with the procurement server. Your last saved data is intact. Please try again.',
  onRetry,
  retryLabel = 'Try Again',
  className,
}) => {
  return (
    <div
      className={clsx(
        'w-full flex flex-col items-center justify-center p-8 text-center bg-white rounded-md border border-red-200 shadow-sm',
        className
      )}
      role="alert"
    >
      <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 text-semantic-error flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6" aria-hidden="true" />
      </div>
      <h3 className="text-base font-bold text-text-primary">{title}</h3>
      <p className="text-xs sm:text-sm text-text-secondary max-w-sm mt-1 mb-5 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="secondary"
          size="md"
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
};
