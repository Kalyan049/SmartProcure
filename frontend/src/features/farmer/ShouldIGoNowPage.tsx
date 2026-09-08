import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/cards/Card';
import { Button } from '@/components/ui/Button';
import { Navigation, MapPin, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ShouldIGoNowPage: React.FC = () => {
  return (
    <PageContainer
      title="Departure Advisory: Should I Go Now?"
      subtitle="Capacity-aware dynamic arrival coordination powered by real-time queue processing."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Dominant Decision Card */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-8 rounded-md bg-brand-tint border-2 border-brand-primary shadow-card">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-widest bg-brand-primary text-white px-3 py-1 rounded-full flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Live Advisory
              </span>
              <span className="text-xs text-brand-dark font-semibold">Updated 1 min ago</span>
            </div>

            <h2 className="text-4xl font-extrabold text-brand-dark tracking-tight">
              YES, GO NOW!
            </h2>
            <p className="text-base text-brand-dark mt-2 leading-relaxed">
              The queue at Rohania Center B is moving quickly. Estimated arrival time aligns perfectly with your appointment window.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 p-4 rounded-md bg-white border border-brand-mint">
              <div>
                <p className="text-xs font-bold text-text-secondary uppercase">Recommended Departure</p>
                <p className="text-2xl font-bold text-brand-primary mt-1">10:15 AM</p>
                <p className="text-[11px] text-text-secondary mt-0.5">Leave in ~15 minutes</p>
              </div>
              <div>
                <p className="text-xs font-bold text-text-secondary uppercase">Estimated Center Reach</p>
                <p className="text-2xl font-bold text-text-primary mt-1">10:30 AM</p>
                <p className="text-[11px] text-text-secondary mt-0.5">Travel time: 15 mins (2.4 km)</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                variant="primary"
                leftIcon={<Navigation className="w-5 h-5" />}
                className="w-full sm:w-auto"
              >
                OPEN MAP DIRECTIONS
              </Button>
              <Button
                size="lg"
                variant="secondary"
                leftIcon={<ShieldCheck className="w-5 h-5" />}
                className="w-full sm:w-auto"
              >
                CONFIRM DEPARTURE
              </Button>
            </div>
          </div>
        </div>

        {/* Supporting Context & Queue Summary */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-4">
              Realtime Context
            </h3>
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-text-primary">Rohania Center (CTR-02)</p>
                  <p className="text-text-secondary">GT Road, Varanasi (2.4 km)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-semantic-info shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-text-primary">Current Wait: ~36 mins</p>
                  <p className="text-text-secondary">Position #7 (6 farmers ahead)</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-surface-border text-xs text-text-secondary leading-relaxed bg-surface-page p-3 rounded-sm">
              <p className="font-semibold text-text-primary mb-1">SMS Fallback Alert Active</p>
              <p>You will receive automated SMS notifications if queue speed changes significantly.</p>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
