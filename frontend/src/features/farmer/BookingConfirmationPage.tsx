import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer, Card, Button, TokenCard } from '@/components';
import { CheckCircle2, ArrowRight, Home } from 'lucide-react';

export const BookingConfirmationPage: React.FC = () => {
  const navigate = useNavigate();

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
              Arrival Slot Confirmed — SP-1047
            </span>
            <span className="text-text-secondary">
              An SMS confirmation with guidance has been dispatched to your registered mobile number.
            </span>
          </div>
        </div>

        {/* Token Card */}
        <TokenCard
          tokenNumber="SP-1047"
          centerName="Center B — Malwa North Mandi"
          appointmentTime="Today, 10:40 AM"
          queuePosition={12}
          farmersAhead={11}
          estimatedWaitMinutes={35}
          shouldIGoState="PREPARE_TO_GO"
          shouldIGoReason="Your slot is in ~35 minutes. Prepare your vehicle and produce for dispatch."
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
