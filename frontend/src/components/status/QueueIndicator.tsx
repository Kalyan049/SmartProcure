import React from 'react';
import { clsx } from 'clsx';

export interface QueueIndicatorProps {
  farmersAhead: number;
  totalVisible?: number;
}

export const QueueIndicator: React.FC<QueueIndicatorProps> = ({
  farmersAhead,
  totalVisible = 8,
}) => {
  const dots = Array.from({ length: totalVisible }, (_, index) => {
    const isYou = index === farmersAhead;
    const isAhead = index < farmersAhead;

    return (
      <div key={index} className="flex flex-col items-center gap-1">
        <div
          className={clsx(
            'rounded-full transition-all duration-300 flex items-center justify-center font-bold text-[10px]',
            isYou
              ? 'w-8 h-8 bg-brand-primary text-white ring-4 ring-brand-tint shadow-sm animate-pulse'
              : isAhead
              ? 'w-6 h-6 bg-brand-mint text-brand-dark'
              : 'w-6 h-6 bg-gray-100 text-gray-400 border border-surface-border'
          )}
        >
          {isYou ? 'YOU' : index + 1}
        </div>
      </div>
    );
  });

  return (
    <div className="w-full flex items-center justify-start gap-2 overflow-x-auto py-2">
      {dots}
    </div>
  );
};
