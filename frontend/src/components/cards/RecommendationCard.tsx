import React from 'react';
import { Card } from './Card';
import { Button } from '../ui/Button';
import { Clock, MapPin, Users, Sparkles, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

export interface AlternativeCenter {
  id: string;
  name: string;
  slotTime: string;
  waitMinutes: number;
  distanceKm: number;
  queueLength: number;
  capacityPercent: number;
}

export interface RecommendationCardProps {
  centerName: string;
  slotTime: string;
  estimatedWaitMinutes: number;
  queueLength: number;
  capacityPercent: number;
  distanceKm: number;
  recommendationReason: string;
  score?: number;
  onSelect: () => void;
  ctaLabel?: string;
  alternatives?: AlternativeCenter[];
  onSelectAlternative?: (alt: AlternativeCenter) => void;
  className?: string;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  centerName,
  slotTime,
  estimatedWaitMinutes,
  queueLength,
  capacityPercent,
  distanceKm,
  recommendationReason,
  onSelect,
  ctaLabel = 'Continue with This Slot',
  alternatives = [],
  onSelectAlternative,
  className,
}) => {
  return (
    <Card
      className={clsx(
        'border-2 border-brand-primary/20 bg-white relative overflow-hidden shadow-card',
        className
      )}
    >
      {/* Recommended Header Banner */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-surface-border">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-tint text-brand-primary border border-brand-mint text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Recommended Center</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-text-secondary">
          <MapPin className="w-3.5 h-3.5 text-text-muted" aria-hidden="true" />
          <span>{distanceKm} km away</span>
        </div>
      </div>

      {/* Primary Highlights: Center & Time */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
            {centerName}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-text-secondary">
            <span className="font-semibold text-brand-primary">{slotTime}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-text-muted">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              Est. wait ~{estimatedWaitMinutes} min
            </span>
          </div>
        </div>

        <div className="self-start sm:self-auto">
          <Button
            size="md"
            variant="primary"
            onClick={onSelect}
            className="w-full sm:w-auto"
            rightIcon={<CheckCircle2 className="w-4 h-4" />}
          >
            {ctaLabel}
          </Button>
        </div>
      </div>

      {/* Scannable Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 p-3 bg-surface-page rounded-sm border border-surface-border text-center mb-4">
        <div>
          <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-text-muted uppercase">
            <Users className="w-3 h-3" aria-hidden="true" />
            <span>Queue</span>
          </div>
          <p className="text-lg sm:text-xl font-bold text-text-primary mt-0.5 tabular-nums">
            {queueLength}
          </p>
          <span className="text-[10px] text-text-muted">farmers</span>
        </div>

        <div className="border-x border-surface-border">
          <div className="text-[11px] font-medium text-text-muted uppercase">
            Capacity
          </div>
          <p
            className={clsx(
              'text-lg sm:text-xl font-bold mt-0.5 tabular-nums',
              capacityPercent > 80 ? 'text-semantic-warning' : 'text-text-primary'
            )}
          >
            {capacityPercent}%
          </p>
          <span className="text-[10px] text-text-muted">utilized</span>
        </div>

        <div>
          <div className="text-[11px] font-medium text-text-muted uppercase">
            Distance
          </div>
          <p className="text-lg sm:text-xl font-bold text-text-primary mt-0.5 tabular-nums">
            {distanceKm}
          </p>
          <span className="text-[10px] text-text-muted">km</span>
        </div>
      </div>

      {/* Explainable Automation Reason Box */}
      <div className="p-3 bg-brand-tint/60 rounded-sm border border-brand-mint text-xs">
        <p className="font-semibold text-brand-primary mb-0.5">
          Why this center is recommended:
        </p>
        <p className="text-text-secondary leading-relaxed">{recommendationReason}</p>
      </div>

      {/* Alternative Options (if provided) */}
      {alternatives.length > 0 && (
        <div className="mt-4 pt-3 border-t border-surface-border">
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            Alternative Options
          </h4>
          <div className="space-y-2">
            {alternatives.map((alt) => (
              <div
                key={alt.id}
                className="flex items-center justify-between p-2.5 rounded-sm border border-surface-border bg-surface-page hover:bg-white transition-colors text-xs"
              >
                <div>
                  <span className="font-bold text-text-primary block">{alt.name}</span>
                  <span className="text-text-muted">
                    {alt.slotTime} • {alt.distanceKm} km • ~{alt.waitMinutes}m wait
                  </span>
                </div>
                {onSelectAlternative && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSelectAlternative(alt)}
                  >
                    Select
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
