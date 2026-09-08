import React from 'react';
import { Card } from './Card';
import { StatusBadge } from '../status/StatusBadge';
import { CapacityMeter } from '../status/CapacityMeter';
import { Clock, Users, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';

export interface QueueCardProps {
  tokenNumber: string;
  currentToken?: string;
  position: number;
  farmersAhead: number;
  estimatedWaitMinutes: number;
  centerName?: string;
  centerCapacityPercent?: number;
  processingRateMinutes?: number;
  lastUpdatedText?: string;
  onRefresh?: () => void;
  className?: string;
}

export const QueueCard: React.FC<QueueCardProps> = ({
  tokenNumber,
  currentToken,
  position,
  farmersAhead,
  estimatedWaitMinutes,
  centerName,
  centerCapacityPercent,
  processingRateMinutes,
  lastUpdatedText = 'Updated just now',
  onRefresh,
  className,
}) => {
  return (
    <Card className={clsx('border-brand-mint/60 shadow-card', className)}>
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-surface-border pb-3">
        <div>
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Live Queue Position
          </span>
          {centerName && (
            <h4 className="text-sm font-bold text-text-primary mt-0.5">{centerName}</h4>
          )}
        </div>
        <StatusBadge
          status={position <= 3 ? 'ARRIVED' : 'WAITING'}
          className="text-xs"
        />
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4">
        {/* Token Number */}
        <div className="bg-surface-page p-3 rounded-sm border border-surface-border">
          <span className="text-xs text-text-muted font-medium block">Your Token</span>
          <span className="text-2xl sm:text-3xl font-bold text-brand-primary tabular-nums tracking-tight">
            {tokenNumber}
          </span>
          {currentToken && (
            <span className="text-[11px] text-text-secondary block mt-1">
              Now serving: <strong className="text-text-primary">{currentToken}</strong>
            </span>
          )}
        </div>

        {/* Position & Farmers Ahead */}
        <div className="bg-surface-page p-3 rounded-sm border border-surface-border">
          <div className="flex items-center gap-1.5 text-text-muted text-xs font-medium">
            <Users className="w-3.5 h-3.5" aria-hidden="true" />
            <span>In Queue</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-bold text-text-primary tabular-nums">
              #{position}
            </span>
          </div>
          <span className="text-[11px] text-text-secondary block mt-1">
            {farmersAhead === 0
              ? 'You are next in line'
              : `${farmersAhead} farmer${farmersAhead > 1 ? 's' : ''} ahead of you`}
          </span>
        </div>

        {/* Estimated Wait */}
        <div className="col-span-2 sm:col-span-1 bg-surface-page p-3 rounded-sm border border-surface-border">
          <div className="flex items-center gap-1.5 text-text-muted text-xs font-medium">
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Estimated Wait</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-bold text-text-primary tabular-nums">
              {estimatedWaitMinutes}
            </span>
            <span className="text-xs font-medium text-text-secondary">min</span>
          </div>
          {processingRateMinutes && (
            <span className="text-[11px] text-text-secondary block mt-1">
              ~{processingRateMinutes} min per farmer
            </span>
          )}
        </div>
      </div>

      {/* Center Capacity Meter if provided */}
      {centerCapacityPercent !== undefined && (
        <div className="pt-2 pb-3 border-t border-surface-border">
          <CapacityMeter percent={centerCapacityPercent} label="Center Load" />
        </div>
      )}

      {/* Footer info */}
      <div className="flex items-center justify-between text-xs text-text-muted pt-3 border-t border-surface-border">
        <span>{lastUpdatedText}</span>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-1 text-text-secondary hover:text-brand-primary font-medium transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Refresh</span>
          </button>
        )}
      </div>
    </Card>
  );
};
