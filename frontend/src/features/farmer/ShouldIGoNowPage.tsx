import React from 'react';
import { PageContainer, Card, Button } from '@/components';
import { Navigation, MapPin, Clock, ShieldCheck, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { useShouldIGoRealtime } from './hooks/useShouldIGoRealtime';
import { useNavigate } from 'react-router-dom';

export const ShouldIGoNowPage: React.FC = () => {
  const navigate = useNavigate();
  // Using default token for demo MVP
  const { advisory, loading, error, status } = useShouldIGoRealtime('SP-1047');

  if (loading) {
    return (
      <PageContainer title="Departure Advisory">
        <div className="flex flex-col items-center justify-center py-20 text-text-secondary">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-brand-primary" />
          <p>Calculating live departure advisory...</p>
        </div>
      </PageContainer>
    );
  }

  if (error || !advisory) {
    return (
      <PageContainer title="Departure Advisory">
        <Card className="p-6 text-center max-w-lg mx-auto">
          <AlertTriangle className="w-10 h-10 text-red-500 mb-4 mx-auto" />
          <h3 className="font-bold mb-2">Advisory Unavailable</h3>
          <p className="text-sm text-text-secondary mb-4">{error || 'Could not fetch advisory.'}</p>
          <Button variant="primary" onClick={() => navigate('/farmer/booking')}>
            Go to Bookings
          </Button>
        </Card>
      </PageContainer>
    );
  }

  // Determine UI Colors based on the decision
  let cardClass = '';
  let titleColor = '';
  let showConfirm = false;

  switch (advisory.decision) {
    case 'GO NOW':
      cardClass = 'bg-green-50 border-green-500';
      titleColor = 'text-green-700';
      showConfirm = true;
      break;
    case 'PREPARE TO GO':
      cardClass = 'bg-amber-50 border-amber-500';
      titleColor = 'text-amber-700';
      showConfirm = false;
      break;
    case 'WAIT':
      cardClass = 'bg-brand-tint border-brand-primary';
      titleColor = 'text-brand-dark';
      showConfirm = false;
      break;
    case 'DO NOT GO':
    default:
      cardClass = 'bg-red-50 border-red-500';
      titleColor = 'text-red-700';
      showConfirm = false;
      break;
  }

  const isNoBooking = advisory.decision === 'DO NOT GO' && advisory.current_position === 0;

  return (
    <PageContainer
      title="Departure Advisory: Should I Go Now?"
      subtitle="Capacity-aware dynamic arrival coordination powered by real-time queue processing."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Dominant Decision Card */}
        <div className="lg:col-span-8 space-y-6">
          <div className={`p-8 rounded-md border-2 shadow-card transition-colors duration-500 ${cardClass}`}>
            <div className="flex items-center justify-between mb-4">
              <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1.5 text-white ${
                status === 'LIVE' ? 'bg-semantic-success' : 'bg-gray-400'
              }`}>
                {status === 'LIVE' ? (
                  <><span className="w-1.5 h-1.5 rounded-full bg-white animate-ping mr-1" /> Live Advisory</>
                ) : (
                  <><Loader2 className="w-3 h-3 animate-spin" /> Syncing</>
                )}
              </span>
              <span className="text-xs font-semibold opacity-70 text-brand-dark">
                Updated {new Date(advisory.last_updated).toLocaleTimeString()}
              </span>
            </div>

            <h2 className={`text-4xl sm:text-5xl font-extrabold tracking-tight mb-2 ${titleColor}`}>
              {isNoBooking ? 'BOOK A SLOT' : advisory.decision}
            </h2>
            <p className="text-base sm:text-lg font-medium opacity-90 mt-2 leading-relaxed">
              {advisory.reason}
            </p>

            {!isNoBooking && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 p-4 rounded-md bg-white/80 border border-black/10">
                <div>
                  <p className="text-xs font-bold text-text-secondary uppercase">Recommended Departure</p>
                  <p className="text-2xl font-bold text-brand-primary mt-1">{advisory.recommended_departure_time}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-text-secondary uppercase">Estimated Center Reach</p>
                  <p className="text-2xl font-bold text-text-primary mt-1">{advisory.estimated_arrival_time}</p>
                  <p className="text-[11px] text-text-secondary mt-0.5">Travel time assumes ~15 mins</p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              {isNoBooking ? (
                <Button size="lg" variant="primary" onClick={() => navigate('/farmer/booking')}>
                  Book a Slot Now
                </Button>
              ) : (
                <>
                  <Button size="lg" variant="primary" leftIcon={<Navigation className="w-5 h-5" />} className="w-full sm:w-auto">
                    OPEN MAP DIRECTIONS
                  </Button>
                  {showConfirm && (
                    <Button size="lg" variant="secondary" leftIcon={<ShieldCheck className="w-5 h-5" />} className="w-full sm:w-auto">
                      CONFIRM DEPARTURE
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Supporting Context & Queue Summary */}
        <div className="lg:col-span-4 space-y-6">
          {!isNoBooking && (
            <Card className="p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-4">
                Realtime Context
              </h3>
              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-text-primary">{advisory.center_name}</p>
                    <p className="text-text-secondary">Center Load: {advisory.center_load_percent}%</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-semantic-info shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-text-primary">Current Wait: ~{advisory.estimated_wait_minutes} mins</p>
                    <p className="text-text-secondary">Position #{advisory.current_position} ({advisory.farmers_ahead} farmers ahead)</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-surface-border text-xs text-text-secondary leading-relaxed bg-surface-page p-3 rounded-sm">
                <p className="font-semibold text-text-primary mb-1">SMS Fallback Alert Active</p>
                <p>You will receive automated SMS notifications if queue speed changes significantly.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
};
