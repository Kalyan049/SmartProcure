import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageContainer, Card, Button, TokenCard } from '@/components';
import { CheckCircle2, ArrowRight, Home, AlertTriangle } from 'lucide-react';

export const BookingConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // The confirmation data can be passed via state from BookingPage
  const state = location.state as {
    booking?: { token_number: string; id: string; crop: string; quantity_quintals: number };
    queueEntry?: { position: number; farmers_ahead: number; estimated_wait_minutes: number };
    centerName?: string;
    slotTime?: string;
  } | null;

  // If navigated here without state, show a fallback
  if (!state?.booking) {
    return (
      <PageContainer
        title="Booking Status"
        subtitle="View your booking confirmation details."
      >
        <div className="max-w-lg mx-auto">
          <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg flex flex-col items-center text-center gap-4">
            <AlertTriangle className="w-10 h-10 text-amber-500" />
            <div>
              <h2 className="font-bold text-text-primary text-base mb-1">No Booking Data Found</h2>
              <p className="text-sm text-text-secondary">
                This page shows confirmation after completing a booking. Please book a slot first.
              </p>
            </div>
            <Button variant="primary" onClick={() => navigate('/farmer/booking')}>
              Book a Slot
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  const { booking, queueEntry, centerName, slotTime } = state;

  return (
    <PageContainer
      title="Booking Confirmed"
      subtitle="Your procurement arrival slot and token have been issued successfully."
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Success Banner */}
        <div className="p-4 bg-brand-tint border border-brand-mint rounded-md flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-brand-primary shrink-0" aria-hidden="true" />
          <div className="text-xs sm:text-sm">
            <span className="font-bold text-brand-dark block">
              Arrival Slot Confirmed — {booking.token_number}
            </span>
            <span className="text-text-secondary">
              An SMS confirmation with guidance has been dispatched to your registered mobile number.
            </span>
          </div>
        </div>

        {/* Token Card */}
        <TokenCard
          tokenNumber={booking.token_number}
          centerName={centerName || 'Procurement Center'}
          appointmentTime={slotTime || 'Your booked slot'}
          queuePosition={queueEntry?.position || 1}
          farmersAhead={queueEntry?.farmers_ahead || 0}
          estimatedWaitMinutes={queueEntry?.estimated_wait_minutes || 0}
          shouldIGoState="PREPARE_TO_GO"
          shouldIGoReason={`Your slot is confirmed. Estimated wait time is ~${queueEntry?.estimated_wait_minutes || 0} minutes. Prepare your vehicle and produce.`}
          actionLabel="Open Live Queue Tracking"
          onAction={() => navigate('/farmer/queue')}
        />

        {/* Quick Action Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/farmer/dashboard')}
            leftIcon={<Home className="w-4 h-4" />}
            isFullWidth
          >
            Farmer Dashboard
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/farmer/should-i-go')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            isFullWidth
          >
            "Should I Go Now?" Advisor
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};
