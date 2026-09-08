import React from 'react';
import { clsx } from 'clsx';
import { Check, Clock, AlertTriangle, ChevronRight } from 'lucide-react';

export type TimelineStepState = 'completed' | 'current' | 'upcoming' | 'failed';

export interface TimelineStep {
  id: string;
  label: string;
  state: TimelineStepState;
  timestamp?: string;
  officerName?: string;
  description?: string;
  details?: Record<string, string | number>;
}

export interface TimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ steps, className }) => {
  const renderIcon = (state: TimelineStepState, index: number) => {
    switch (state) {
      case 'completed':
        return (
          <div className="w-7 h-7 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-sm">
            <Check className="w-4 h-4 stroke-[3]" aria-hidden="true" />
          </div>
        );
      case 'current':
        return (
          <div className="w-7 h-7 rounded-full bg-white border-2 border-brand-primary text-brand-primary flex items-center justify-center shadow-sm ring-4 ring-brand-tint">
            <Clock className="w-4 h-4 text-brand-primary animate-pulse" aria-hidden="true" />
          </div>
        );
      case 'failed':
        return (
          <div className="w-7 h-7 rounded-full bg-semantic-error text-white flex items-center justify-center shadow-sm">
            <AlertTriangle className="w-4 h-4" aria-hidden="true" />
          </div>
        );
      case 'upcoming':
      default:
        return (
          <div className="w-7 h-7 rounded-full bg-slate-100 border border-surface-border text-text-muted flex items-center justify-center text-xs font-semibold">
            {index + 1}
          </div>
        );
    }
  };

  return (
    <div className={clsx('w-full flex flex-col text-left', className)}>
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;

        return (
          <div key={step.id} className="relative flex items-start gap-4">
            {/* Step icon and vertical connector line */}
            <div className="flex flex-col items-center">
              {renderIcon(step.state, idx)}
              {!isLast && (
                <div
                  className={clsx(
                    'w-0.5 min-h-[36px] my-1',
                    step.state === 'completed' ? 'bg-brand-primary' : 'bg-surface-border'
                  )}
                  aria-hidden="true"
                />
              )}
            </div>

            {/* Step Content */}
            <div
              className={clsx(
                'flex-1 pb-5 min-w-0',
                step.state === 'current' &&
                  'bg-brand-tint/40 p-3.5 rounded-sm border border-brand-mint mb-3'
              )}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h4
                    className={clsx(
                      'text-sm font-bold',
                      step.state === 'current'
                        ? 'text-brand-primary'
                        : step.state === 'completed'
                        ? 'text-text-primary'
                        : 'text-text-secondary'
                    )}
                  >
                    {step.label}
                  </h4>
                  {step.state === 'current' && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-primary text-white">
                      In Progress
                    </span>
                  )}
                </div>

                {step.timestamp && (
                  <span className="text-xs text-text-muted tabular-nums">
                    {step.timestamp}
                  </span>
                )}
              </div>

              {step.description && (
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  {step.description}
                </p>
              )}

              {/* Extra details card for current / completed stage */}
              {step.details && Object.keys(step.details).length > 0 && (
                <div className="mt-2.5 p-2.5 bg-white rounded border border-surface-border grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {Object.entries(step.details).map(([key, val]) => (
                    <div key={key}>
                      <span className="text-[11px] text-text-muted capitalize block">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span className="font-bold text-text-primary tabular-nums">
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
