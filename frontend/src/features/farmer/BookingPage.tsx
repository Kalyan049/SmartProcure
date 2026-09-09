import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageContainer, Card, Button, Select, Input } from '@/components';
import {
  Calendar, MapPin, CheckCircle2, AlertTriangle, Loader2,
  Clock, Users, Sparkles, ArrowRight, ShieldCheck, Info,
} from 'lucide-react';
import { fetchApi } from '@/services/api/apiClient';
import { API_ENDPOINTS } from '@/app/config/api.config';
import { Slot } from '@shared/types';

// ── Types ─────────────────────────────────────────────────────────────────────
interface SlotWithMeta extends Slot {
  available: boolean;
  spotsLeft: number;
}

type Phase = 'form' | 'review' | 'confirming' | 'done' | 'error';

const CROP_OPTIONS = [
  { value: 'Paddy',   label: 'Paddy (Dhan)' },
  { value: 'Wheat',   label: 'Wheat (Gehun)' },
  { value: 'Maize',   label: 'Maize (Makka)' },
  { value: 'Mustard', label: 'Mustard (Sarson)' },
];

// ── Slot Selector ─────────────────────────────────────────────────────────────
const SlotCard: React.FC<{
  slot: SlotWithMeta;
  selected: boolean;
  onSelect: () => void;
}> = ({ slot, selected, onSelect }) => (
  <button
    disabled={!slot.available}
    onClick={onSelect}
    className={`w-full text-left p-3 rounded-lg border-2 transition-all
      ${!slot.available ? 'opacity-40 cursor-not-allowed border-gray-200 bg-gray-50' :
        selected ? 'border-brand-primary bg-brand-tint ring-2 ring-brand-primary/20' :
        'border-surface-border hover:border-brand-primary/40 bg-white'}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="font-bold text-sm text-text-primary">{slot.start_time} – {slot.end_time}</p>
        <p className="text-xs text-text-secondary mt-0.5">
          {slot.available ? `${slot.spotsLeft} spots remaining` : 'Full — no spots available'}
        </p>
      </div>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
        ${selected ? 'border-brand-primary bg-brand-primary' : 'border-gray-300'}`}>
        {selected && <div className="w-2 h-2 rounded-full bg-white" />}
      </div>
    </div>
  </button>
);

// ── Main Page ─────────────────────────────────────────────────────────────────
export const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Pre-fill from query params (set by Recommendation Engine or Center Discovery)
  const [crop, setCrop] = useState(searchParams.get('crop') || 'Paddy');
  const [quantity, setQuantity] = useState(searchParams.get('quantity') || '40');
  const [date, setDate] = useState(searchParams.get('date') || new Date().toISOString().split('T')[0]);
  const [centerId, setCenterId] = useState(searchParams.get('center') || 'ctr-02');
  const [selectedSlotId, setSelectedSlotId] = useState(searchParams.get('slot') || '');

  const [phase, setPhase] = useState<Phase>('form');
  const [slots, setSlots] = useState<SlotWithMeta[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmation, setConfirmation] = useState<any>(null);

  // Center options — simplified for MVP
  const CENTER_OPTIONS = [
    { value: 'ctr-02', label: 'Rohania Agribusiness Center B' },
    { value: 'ctr-01', label: 'Kashi Mandi Center A' },
    { value: 'ctr-03', label: 'Sewapuri Farmer Hub C' },
  ];

  const centerName = CENTER_OPTIONS.find(c => c.value === centerId)?.label || centerId;
  const selectedSlot = slots.find(s => s.id === selectedSlotId);

  // Load slots when center or date changes
  useEffect(() => {
    if (centerId && date) {
      loadSlots();
    }
  }, [centerId, date]);

  const loadSlots = async () => {
    setSlotsLoading(true);
    setSlotsError(null);
    try {
      const res = await fetchApi<{ data: Slot[] }>(
        `${API_ENDPOINTS.BOOKINGS.SLOTS}?centerId=${centerId}&date=${date}`
      );
      const enriched: SlotWithMeta[] = res.data.map(s => ({
        ...s,
        available: s.status === 'AVAILABLE' && s.booked_count < s.capacity,
        spotsLeft: Math.max(0, s.capacity - s.booked_count),
      }));
      setSlots(enriched);
      // Auto-select the pre-filled slot if valid
      if (selectedSlotId && enriched.some(s => s.id === selectedSlotId && s.available)) {
        // keep it
      } else {
        // auto-select first available
        const firstAvail = enriched.find(s => s.available);
        if (firstAvail) setSelectedSlotId(firstAvail.id);
      }
    } catch (err: any) {
      setSlotsError('Failed to load available slots. Please retry.');
    } finally {
      setSlotsLoading(false);
    }
  };

  const formIsValid =
    crop && quantity && Number(quantity) > 0 && date && centerId && selectedSlotId;

  const handleProceedToReview = () => {
    if (!formIsValid) return;
    setPhase('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmBooking = async () => {
    setPhase('confirming');
    try {
      const res = await fetchApi<{ data: any }>(API_ENDPOINTS.BOOKINGS.CREATE, {
        method: 'POST',
        body: JSON.stringify({
          centerId,
          slotId: selectedSlotId,
          crop,
          quantity: Number(quantity),
          date,
        }),
      });
      setConfirmation(res.data);
      setPhase('done');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      const msg = err.message || 'Booking failed';
      const isConflict = msg.includes('DUPLICATE') || msg.includes('SLOT_FULL');
      setErrorMsg(msg.replace(/^[A-Z_]+: /, '')); // Strip error code prefix
      setPhase(isConflict ? 'form' : 'error');
      if (isConflict) {
        // Refresh slots to show updated availability
        await loadSlots();
        setSelectedSlotId('');
      }
    }
  };

  return (
    <PageContainer
      title="Smart Slot Booking"
      subtitle="Book your arrival slot at a procurement center. Confirmation is only issued after the backend validates your booking."
    >
      {/* ── FORM PHASE ────────────────────────────────────────────────────── */}
      {(phase === 'form' || phase === 'error') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Produce & Preferences */}
          <div className="lg:col-span-5 space-y-5">
            <Card className="p-6">
              <h2 className="text-base font-bold text-text-primary mb-4 flex items-center gap-2 border-b border-surface-border pb-2">
                <Sparkles className="w-5 h-5 text-brand-primary" />
                1. Produce Details
              </h2>
              <div className="space-y-4">
                <Select label="Crop" options={CROP_OPTIONS} value={crop}
                  onChange={e => setCrop(e.target.value)} />
                <Input label="Estimated Quantity" type="number" value={quantity}
                  onChange={e => setQuantity(e.target.value)} unitSuffix="Quintals"
                  error={quantity !== '' && Number(quantity) <= 0 ? 'Enter a valid quantity' : undefined} />
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-base font-bold text-text-primary mb-4 flex items-center gap-2 border-b border-surface-border pb-2">
                <MapPin className="w-5 h-5 text-brand-primary" />
                2. Center & Date
              </h2>
              <div className="space-y-4">
                <Select label="Procurement Center" options={CENTER_OPTIONS}
                  value={centerId} onChange={e => setCenterId(e.target.value)} />
                <Input label="Preferred Date" type="date" value={date}
                  onChange={e => setDate(e.target.value)} />
              </div>
            </Card>
          </div>

          {/* Right: Slot Selection */}
          <div className="lg:col-span-7">
            <Card className="p-6 h-full">
              <h2 className="text-base font-bold text-text-primary mb-4 flex items-center gap-2 border-b border-surface-border pb-2">
                <Calendar className="w-5 h-5 text-brand-primary" />
                3. Available Slots
              </h2>

              {/* Error alert from failed booking attempt */}
              {(phase === 'error' || (errorMsg && phase === 'form')) && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex gap-2 text-sm text-red-700">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <strong>Booking Failed</strong>
                    <p className="text-xs mt-1">{errorMsg}</p>
                  </div>
                </div>
              )}

              {slotsLoading && (
                <div className="flex items-center justify-center py-10 text-text-secondary">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading slots…
                </div>
              )}

              {slotsError && !slotsLoading && (
                <div className="p-4 bg-red-50 rounded text-sm text-red-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> {slotsError}
                  <button onClick={loadSlots} className="ml-auto underline text-xs">Retry</button>
                </div>
              )}

              {!slotsLoading && !slotsError && slots.length === 0 && (
                <div className="text-center py-10 text-text-secondary">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p>No slots found for this date and center.</p>
                </div>
              )}

              {!slotsLoading && slots.length > 0 && (
                <div className="space-y-3">
                  {slots.map(slot => (
                    <SlotCard
                      key={slot.id}
                      slot={slot}
                      selected={selectedSlotId === slot.id}
                      onSelect={() => setSelectedSlotId(slot.id)}
                    />
                  ))}
                  <p className="text-[11px] text-text-secondary flex items-center gap-1 pt-2">
                    <Info className="w-3 h-3" />
                    Slot availability is validated again when you confirm. Slots can fill up while you're deciding.
                  </p>
                </div>
              )}

              <Button
                variant="primary"
                isFullWidth
                className="mt-6"
                disabled={!formIsValid || slotsLoading}
                onClick={handleProceedToReview}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                REVIEW & CONFIRM BOOKING
              </Button>
            </Card>
          </div>
        </div>
      )}

      {/* ── REVIEW PHASE ──────────────────────────────────────────────────── */}
      {phase === 'review' && selectedSlot && (
        <div className="max-w-lg mx-auto space-y-5">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3 text-sm text-amber-800">
            <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <strong>Final confirmation required</strong>
              <p className="text-xs mt-1">Your booking will only be created after you tap "Confirm" below. No changes can be undone.</p>
            </div>
          </div>

          <Card className="p-6 border-2 border-brand-primary">
            <h2 className="text-base font-bold text-text-primary mb-4 pb-2 border-b border-surface-border">
              Booking Summary
            </h2>
            <dl className="space-y-3 text-sm">
              {[
                { label: 'Crop', value: crop },
                { label: 'Quantity', value: `${quantity} Quintals` },
                { label: 'Procurement Center', value: centerName },
                { label: 'Date', value: date },
                { label: 'Slot', value: `${selectedSlot.start_time} – ${selectedSlot.end_time}` },
                { label: 'Spots Remaining', value: `${selectedSlot.spotsLeft} (before your booking)` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-4">
                  <dt className="text-text-secondary">{label}</dt>
                  <dd className="font-semibold text-text-primary text-right">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button variant="outline" isFullWidth onClick={() => setPhase('form')}>
                Go Back & Edit
              </Button>
              <Button variant="primary" isFullWidth onClick={handleConfirmBooking}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}>
                CONFIRM BOOKING
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ── CONFIRMING PHASE ──────────────────────────────────────────────── */}
      {phase === 'confirming' && (
        <div className="max-w-sm mx-auto py-16 flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 rounded-full bg-brand-tint border-2 border-brand-mint flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-brand-primary animate-pulse" />
            </div>
            <div className="absolute -inset-1 rounded-full border-2 border-brand-primary/30 animate-ping" />
          </div>
          <h3 className="text-base font-bold text-text-primary mb-2">Creating Your Booking…</h3>
          <p className="text-sm text-text-secondary">Validating slot availability and generating your token.</p>
          <p className="text-xs text-text-secondary mt-1 italic">Do not close or refresh this page.</p>
        </div>
      )}

      {/* ── SUCCESS PHASE ─────────────────────────────────────────────────── */}
      {phase === 'done' && confirmation && (
        <div className="max-w-lg mx-auto space-y-5">
          {/* Confirmed Banner */}
          <div className="p-4 bg-brand-tint border border-brand-mint rounded-lg flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-brand-primary shrink-0" />
            <div>
              <p className="font-bold text-brand-dark text-sm">
                Slot Confirmed — Token {confirmation.booking.token_number}
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                An SMS has been dispatched to your registered mobile number.
              </p>
            </div>
          </div>

          {/* Token & Booking Details */}
          <Card className="p-6 border-2 border-brand-primary">
            <div className="text-center mb-5">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary rounded-full text-white font-bold text-lg shadow-md">
                <CheckCircle2 className="w-5 h-5" />
                {confirmation.booking.token_number}
              </div>
              <p className="text-xs text-text-secondary mt-2">Your arrival token for {crop} at {centerName}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-surface-page rounded p-3 text-center border border-surface-border">
                <div className="text-xs text-text-secondary mb-1 flex items-center justify-center gap-1">
                  <Calendar className="w-3 h-3" /> Slot
                </div>
                <p className="font-bold text-sm text-text-primary">{selectedSlot?.start_time}</p>
                <p className="text-[10px] text-text-secondary">{date}</p>
              </div>
              <div className="bg-surface-page rounded p-3 text-center border border-surface-border">
                <div className="text-xs text-text-secondary mb-1 flex items-center justify-center gap-1">
                  <Users className="w-3 h-3" /> Queue
                </div>
                <p className="font-bold text-sm text-text-primary">
                  #{confirmation.queueEntry?.position || '—'}
                </p>
                <p className="text-[10px] text-text-secondary">
                  {confirmation.queueEntry?.farmers_ahead ?? '—'} ahead
                </p>
              </div>
              <div className="bg-surface-page rounded p-3 text-center border border-surface-border">
                <div className="text-xs text-text-secondary mb-1 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" /> Est. Wait
                </div>
                <p className="font-bold text-sm text-text-primary">
                  {confirmation.queueEntry?.estimated_wait_minutes ?? '—'} min
                </p>
              </div>
              <div className="bg-surface-page rounded p-3 text-center border border-surface-border">
                <div className="text-xs text-text-secondary mb-1">Booking ID</div>
                <p className="font-bold text-[11px] text-text-primary">{confirmation.booking.id}</p>
              </div>
            </div>

            {/* QR Placeholder */}
            <div className="flex items-center justify-center mb-5">
              <div className="w-28 h-28 bg-gray-100 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-center">
                <div>
                  <div className="text-[10px] text-text-secondary">QR Code</div>
                  <div className="text-[9px] text-gray-400 break-all px-1 mt-1">{confirmation.booking.qr_code_payload}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" isFullWidth onClick={() => navigate('/farmer/dashboard')}>
                Back to Dashboard
              </Button>
              <Button variant="primary" isFullWidth
                onClick={() => navigate('/farmer/should-i-go')}
                rightIcon={<ArrowRight className="w-4 h-4" />}>
                Should I Go Now?
              </Button>
            </div>
          </Card>
        </div>
      )}
    </PageContainer>
  );
};
