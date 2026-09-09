import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  PageContainer,
  Card,
  Input,
  Select,
  Button,
  StatusBadge,
  CapacityMeter,
} from '@/components';
import {
  Compass,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Users,
  Clock,
  Zap,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Info,
} from 'lucide-react';
import { fetchApi } from '@/services/api/apiClient';
import { API_ENDPOINTS } from '@/app/config/api.config';
import { RecommendationResult, SlotRecommendation } from '@shared/types';
import { useAuth } from '@/app/providers/AuthProvider';

// ── Form state ────────────────────────────────────────────────────────────────
const CROP_OPTIONS = [
  { value: 'Paddy',   label: 'Paddy (Dhan)' },
  { value: 'Wheat',   label: 'Wheat (Gehun)' },
  { value: 'Maize',   label: 'Maize (Makka)' },
  { value: 'Mustard', label: 'Mustard (Sarson)' },
];

type Phase = 'form' | 'loading' | 'results' | 'error';

const LOADING_MESSAGES = [
  'Checking center availability…',
  'Evaluating queue pressure…',
  'Calculating estimated wait times…',
  'Scoring capacity and load…',
  'Ranking best options for you…',
];

// ── Score Badge ───────────────────────────────────────────────────────────────
const ScorePill: React.FC<{ label: string; score: number; weight: string }> = ({ label, score, weight }) => {
  const pct = Math.round(score * 100);
  const color = pct < 30 ? 'text-green-700 bg-green-50 border-green-200'
    : pct < 60 ? 'text-amber-700 bg-amber-50 border-amber-200'
    : 'text-red-700 bg-red-50 border-red-200';
  return (
    <div className={`flex items-center justify-between text-xs border rounded px-2 py-1 ${color}`}>
      <span className="font-medium">{label} <span className="opacity-60">({weight})</span></span>
      <span className="font-bold">{pct}%</span>
    </div>
  );
};

// ── Single Recommendation Card ────────────────────────────────────────────────
const CenterRecommendationCard: React.FC<{
  option: SlotRecommendation;
  rank: 'best' | 'alt';
  onSelect: () => void;
}> = ({ option, rank, onSelect }) => {
  const [expanded, setExpanded] = useState(false);
  const { center, slot, score_factors } = option;
  const isBest = rank === 'best';

  return (
    <Card className={`p-5 ${isBest ? 'border-2 border-brand-primary ring-2 ring-brand-primary/20' : 'border border-surface-border'}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          {isBest && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-primary bg-brand-tint border border-brand-mint px-2 py-0.5 rounded-full mb-1">
              <Zap className="w-3 h-3" /> BEST RECOMMENDATION
            </span>
          )}
          <h3 className="text-base font-bold text-text-primary leading-tight">{center.name}</h3>
          <div className="flex items-center gap-1 mt-0.5 text-xs text-text-secondary">
            <MapPin className="w-3 h-3" />
            <span>{center.address} · <strong className="text-text-primary">{option.distance_km} km</strong></span>
          </div>
        </div>
        <StatusBadge status={center.status as any} size="sm" />
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-surface-page rounded p-2 text-center border border-surface-border">
          <div className="text-xs text-text-secondary mb-0.5 flex items-center justify-center gap-1"><Users className="w-3 h-3" /> Queue</div>
          <div className="font-bold text-text-primary">{option.expected_queue_count}</div>
          <div className={`text-[10px] font-semibold ${option.queue_level === 'LOW' ? 'text-green-600' : option.queue_level === 'MEDIUM' ? 'text-amber-600' : 'text-red-600'}`}>
            {option.queue_level}
          </div>
        </div>
        <div className="bg-surface-page rounded p-2 text-center border border-surface-border">
          <div className="text-xs text-text-secondary mb-0.5 flex items-center justify-center gap-1"><Clock className="w-3 h-3" /> Est. Wait</div>
          <div className="font-bold text-text-primary">
            {option.estimated_wait_minutes < 60
              ? `${option.estimated_wait_minutes}m`
              : `${Math.floor(option.estimated_wait_minutes / 60)}h ${option.estimated_wait_minutes % 60}m`}
          </div>
          <div className="text-[10px] text-text-secondary">Travel: {option.travel_time_minutes}m</div>
        </div>
        <div className="bg-surface-page rounded p-2 text-center border border-surface-border">
          <div className="text-xs text-text-secondary mb-0.5">Slot</div>
          <div className="font-bold text-[11px] text-text-primary leading-tight">{slot.start_time}</div>
          <div className="text-[10px] text-text-secondary">{slot.date}</div>
        </div>
      </div>

      {/* Capacity Bar */}
      <div className="mb-4">
        <CapacityMeter percent={option.center_load_percent} label="Center Load" />
      </div>

      {/* Recommendation Reason */}
      <div className="mb-4 p-3 bg-brand-tint border border-brand-mint rounded text-xs text-brand-dark flex gap-2">
        <Info className="w-4 h-4 shrink-0 text-brand-primary mt-0.5" />
        <span>{option.reason}</span>
      </div>

      {/* Score Breakdown (collapsible) */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full text-xs text-text-secondary flex items-center justify-between py-1 mb-3 hover:text-text-primary transition-colors"
      >
        <span className="font-medium">Score Breakdown (lower = better)</span>
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {expanded && (
        <div className="space-y-1.5 mb-4">
          <ScorePill label="Queue Pressure" score={score_factors.queue_score} weight="35%" />
          <ScorePill label="Capacity Load" score={score_factors.capacity_score} weight="30%" />
          <ScorePill label="Estimated ETA" score={score_factors.eta_score} weight="20%" />
          <ScorePill label="Distance" score={score_factors.distance_score} weight="10%" />
          <ScorePill label="Preference" score={score_factors.preference_score} weight="5%" />
          <div className="flex items-center justify-between text-xs font-bold text-text-primary bg-gray-100 rounded px-2 py-1.5 border">
            <span>Total Score</span>
            <span>{(score_factors.total_score * 100).toFixed(1)}%</span>
          </div>
          <p className="text-[10px] text-text-secondary text-center">Score is rule-based. Lower score = better option.</p>
        </div>
      )}

      {/* Action */}
      <Button
        variant={isBest ? 'primary' : 'outline'}
        size={isBest ? 'md' : 'sm'}
        isFullWidth
        onClick={onSelect}
        rightIcon={<ArrowRight className="w-4 h-4" />}
      >
        {isBest ? 'CONFIRM THIS SLOT' : 'Choose This Instead'}
      </Button>
    </Card>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
export const RecommendationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [phase, setPhase] = useState<Phase>('form');
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Form
  const [crop, setCrop] = useState(CROP_OPTIONS[0].value);
  const [quantity, setQuantity] = useState('40');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  const formErrors = {
    quantity: quantity === '' || isNaN(Number(quantity)) || Number(quantity) <= 0
      ? 'Enter a valid quantity in quintals'
      : null,
    date: !date ? 'Select a preferred date' : null,
  };
  const isFormValid = !formErrors.quantity && !formErrors.date;

  const handleCalculate = async () => {
    if (!isFormValid) return;

    setPhase('loading');
    let msgIdx = 0;
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[msgIdx]);
    }, 700);

    try {
      const res = await fetchApi<{ data: RecommendationResult }>(
        API_ENDPOINTS.RECOMMENDATION.CALCULATE,
        {
          method: 'POST',
          body: JSON.stringify({ crop, quantity: Number(quantity), preferredDate: date }),
        }
      );
      setResult(res.data);
      setPhase('results');
    } catch (err: any) {
      setErrorMsg(err.message || 'Recommendation engine failed. Please try again.');
      setPhase('error');
    } finally {
      clearInterval(interval);
    }
  };

  const handleSelectOption = (option: SlotRecommendation) => {
    // Pass selected center + slot info forward to the booking page
    navigate(
      `/farmer/booking?center=${option.center.id}&slot=${option.slot?.id || ''}&crop=${crop}&quantity=${quantity}&date=${date}`
    );
  };

  return (
    <PageContainer
      title="Smart Recommendation Engine"
      subtitle="Rule-based capacity-aware arrival coordination — picks the best slot across all eligible centers."
    >
      {/* ── FORM PHASE ────────────────────────────────────────────────────── */}
      {(phase === 'form' || phase === 'error') && (
        <div className="max-w-xl mx-auto">
          <Card className="p-6">
            <h2 className="text-base font-bold text-text-primary mb-1 flex items-center gap-2">
              <Compass className="w-5 h-5 text-brand-primary" />
              Tell us about your harvest
            </h2>
            <p className="text-xs text-text-secondary mb-6">
              We will analyse all open centers and find you the slot with the shortest wait time.
            </p>

            <div className="space-y-4">
              <Select
                label="Crop"
                options={CROP_OPTIONS}
                value={crop}
                onChange={e => setCrop(e.target.value)}
              />
              <Input
                label="Estimated Quantity"
                type="number"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                unitSuffix="Quintals"
                error={quantity !== '' && formErrors.quantity ? formErrors.quantity : undefined}
              />
              <Input
                label="Preferred Date"
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                error={formErrors.date || undefined}
              />
            </div>

            {phase === 'error' && (
              <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-700 rounded text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {errorMsg}
              </div>
            )}

            <Button
              variant="primary"
              isFullWidth
              className="mt-6"
              onClick={handleCalculate}
              disabled={!isFormValid}
              leftIcon={<Compass className="w-4 h-4" />}
            >
              FIND BEST SLOT
            </Button>
          </Card>

          <div className="mt-4 p-3 bg-surface-page border border-surface-border rounded text-[11px] text-text-secondary text-center">
            Scoring model: Queue (35%) · Capacity (30%) · ETA (20%) · Distance (10%) · Preference (5%)
          </div>
        </div>
      )}

      {/* ── LOADING PHASE ─────────────────────────────────────────────────── */}
      {phase === 'loading' && (
        <div className="max-w-xl mx-auto">
          <Card className="p-10 flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full bg-brand-tint flex items-center justify-center border-2 border-brand-mint">
                <Compass className="w-8 h-8 text-brand-primary animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <div className="absolute -inset-1 rounded-full border-2 border-brand-primary/30 animate-ping" />
            </div>
            <h3 className="text-base font-bold text-text-primary mb-2">Analysing Procurement Centers</h3>
            <p className="text-sm text-text-secondary animate-pulse">{loadingMsg}</p>

            <div className="mt-6 w-full space-y-2 text-left">
              {['Paddy', 'Wheat', 'Maize', 'Mustard'].map((c, i) => (
                <div key={c} className="flex items-center gap-3 text-xs text-text-secondary">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center bg-brand-tint">
                    <Loader2 className="w-2.5 h-2.5 animate-spin text-brand-primary" style={{ animationDelay: `${i * 200}ms` }} />
                  </div>
                  Evaluating {c} compatible centers…
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── RESULTS PHASE ─────────────────────────────────────────────────── */}
      {phase === 'results' && result && (
        <div className="space-y-6">
          {/* Summary Banner */}
          <div className="bg-brand-tint border border-brand-mint rounded-lg p-4 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-brand-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-brand-dark">
                Best slot found at <span className="text-brand-primary">{result.best_option.center.name}</span>
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                {result.alternatives.length} alternative{result.alternatives.length !== 1 ? 's' : ''} also available ·
                Generated at {new Date(result.generated_at).toLocaleTimeString()}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setPhase('form')}>
              Recalculate
            </Button>
          </div>

          {/* Best Option */}
          <CenterRecommendationCard
            option={result.best_option}
            rank="best"
            onSelect={() => handleSelectOption(result.best_option)}
          />

          {/* Alternatives */}
          {result.alternatives.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wide mb-3">
                Other Available Options
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.alternatives.map(alt => (
                  <CenterRecommendationCard
                    key={alt.center.id}
                    option={alt}
                    rank="alt"
                    onSelect={() => handleSelectOption(alt)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className="text-center text-[11px] text-text-secondary pb-4">
            This is a rule-based recommendation. Scores use: Queue (35%) · Capacity (30%) · ETA (20%) · Distance (10%) · Preference (5%)
          </div>
        </div>
      )}
    </PageContainer>
  );
};
