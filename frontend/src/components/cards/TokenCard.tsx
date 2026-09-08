import React from 'react';
import { Card } from './Card';
import { Button } from '../ui/Button';
import { Clock, MapPin, Navigation, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { clsx } from 'clsx';

export type ShouldIGoState = 'GO_NOW' | 'PREPARE_TO_GO' | 'WAIT' | 'DO_NOT_GO';

export interface TokenCardProps {
  tokenNumber: string;
  centerName: string;
  appointmentTime: string;
  queuePosition: number;
  farmersAhead: number;
  estimatedWaitMinutes: number;
  shouldIGoState?: ShouldIGoState;
  shouldIGoReason?: string;
  onAction?: () => void;
  actionLabel?: string;
  className?: string;
}

export const TokenCard: React.FC<TokenCardProps> = ({
  tokenNumber,
  centerName,
  appointmentTime,
  queuePosition,
  farmersAhead,
  estimatedWaitMinutes,
  shouldIGoState = 'PREPARE_TO_GO',
  shouldIGoReason,
  onAction,
  actionLabel = 'Check Live Queue',
  className,
}) => {
  const shouldIGoConfig: Record<
    ShouldIGoState,
    { label: string; badgeClass: string; icon: React.ReactNode; defaultReason: string }
  > = {
    GO_NOW: {
      label: 'GO NOW',
      badgeClass: 'bg-brand-tint text-brand-primary border-brand-mint',
      icon: <CheckCircle className="w-4 h-4 text-brand-primary" aria-hidden="true" />,
      defaultReason: 'The queue is moving quickly. Recommended to depart now.',
    },
    PREPARE_TO_GO: {
      label: 'PREPARE TO GO',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: <Clock className="w-4 h-4 text-amber-700" aria-hidden="true" />,
      defaultReason: 'Your turn is approaching in less than 45 minutes.',
    },
    WAIT: {
      label: 'WAIT',
      badgeClass: 'bg-orange-50 text-orange-800 border-orange-200',
      icon: <Info className="w-4 h-4 text-orange-700" aria-hidden="true" />,
      defaultReason: 'The queue is currently busy. Please wait for the next update.',
    },
    DO_NOT_GO: {
      label: 'DO NOT GO',
      badgeClass: 'bg-red-50 text-semantic-error border-red-200',
      icon: <AlertTriangle className="w-4 h-4 text-semantic-error" aria-hidden="true" />,
      defaultReason: 'The center is currently closed or experiencing severe delays.',
    },
  };

  const guidance = shouldIGoConfig[shouldIGoState];

  return (
    <Card
      className={clsx(
        'border-2 border-brand-primary/30 shadow-card bg-white overflow-hidden p-0',
        className
      )}
    >
      {/* Top Banner with Token */}
      <div className="p-5 bg-brand-tint/60 border-b border-brand-mint/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-dark/80 block">
            Your Token
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold text-brand-primary tracking-tight font-mono tabular-nums mt-0.5">
            {tokenNumber}
          </div>
        </div>

        {/* Should I Go Guidance Badge */}
        <div className="flex flex-col sm:items-end">
          <div
            className={clsx(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border font-bold text-xs uppercase tracking-wider',
              guidance.badgeClass
            )}
          >
            {guidance.icon}
            <span>{guidance.label}</span>
          </div>
          <span className="text-[11px] text-text-secondary mt-1 max-w-[200px] text-left sm:text-right">
            {shouldIGoReason || guidance.defaultReason}
          </span>
        </div>
      </div>

      {/* Body details */}
      <div className="p-5 space-y-4">
        {/* Center & Time */}
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-primary shrink-0" aria-hidden="true" />
            <span className="text-sm font-bold text-text-primary">{centerName}</span>
          </div>
          <div className="text-sm font-semibold text-brand-primary bg-white px-2 py-0.5 rounded border border-brand-mint">
            {appointmentTime}
          </div>
        </div>

        {/* Operational numbers grid */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-2.5 bg-surface-page rounded-sm border border-surface-border">
            <span className="text-[11px] text-text-muted uppercase font-medium block">
              Position
            </span>
            <span className="text-xl sm:text-2xl font-bold text-text-primary tabular-nums">
              #{queuePosition}
            </span>
          </div>

          <div className="p-2.5 bg-surface-page rounded-sm border border-surface-border">
            <span className="text-[11px] text-text-muted uppercase font-medium block">
              Ahead
            </span>
            <span className="text-xl sm:text-2xl font-bold text-text-primary tabular-nums">
              {farmersAhead}
            </span>
          </div>

          <div className="p-2.5 bg-surface-page rounded-sm border border-surface-border">
            <span className="text-[11px] text-text-muted uppercase font-medium block">
              Est. Wait
            </span>
            <div className="flex items-baseline justify-center gap-0.5">
              <span className="text-xl sm:text-2xl font-bold text-text-primary tabular-nums">
                {estimatedWaitMinutes}
              </span>
              <span className="text-xs text-text-secondary">min</span>
            </div>
          </div>
        </div>

        {/* Primary Action Button (Single Dominant CTA) */}
        {onAction && (
          <div className="pt-2">
            <Button
              size="lg"
              variant="primary"
              isFullWidth
              onClick={onAction}
              leftIcon={<Navigation className="w-4 h-4" />}
            >
              {actionLabel}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
