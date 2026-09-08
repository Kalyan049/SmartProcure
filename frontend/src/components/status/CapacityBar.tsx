import React from 'react';
import { clsx } from 'clsx';

export interface CapacityBarProps {
  percent: number;
  label?: string;
  showLabel?: boolean;
}

export const CapacityBar: React.FC<CapacityBarProps> = ({
  percent,
  label,
  showLabel = true,
}) => {
  const clamped = Math.min(100, Math.max(0, percent));

  const getColor = () => {
    if (clamped >= 90) return 'bg-semantic-error';
    if (clamped >= 70) return 'bg-semantic-warning';
    return 'bg-brand-primary';
  };

  const getStatusText = () => {
    if (label) return label;
    if (clamped >= 90) return 'Critical Load';
    if (clamped >= 70) return 'High Queue';
    return 'Normal Operation';
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {showLabel && (
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-text-secondary">{getStatusText()}</span>
          <span className="text-text-primary font-bold">{clamped}% Capacity</span>
        </div>
      )}
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-surface-border">
        <div
          className={clsx('h-full rounded-full transition-all duration-500', getColor())}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
