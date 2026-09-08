import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/cards/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Sparkles, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const BookingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageContainer
      title="Smart Slot Booking"
      subtitle="Intelligent capacity-aware scheduling to eliminate waiting time at procurement centers."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-6 space-y-5">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-text-primary mb-4 pb-2 border-b border-surface-border flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-primary" />
              1. Enter Produce & Slot Preferences
            </h2>

            <div className="space-y-4">
              <Select
                label="Crop"
                options={[
                  { value: 'Paddy', label: 'Paddy (Common / Grade A)' },
                  { value: 'Wheat', label: 'Wheat (FAQ)' },
                  { value: 'Maize', label: 'Maize' },
                ]}
              />

              <Input
                label="Estimated Quantity"
                type="number"
                defaultValue={40}
                unitSuffix="Quintals"
              />

              <Input label="Preferred Date" type="date" defaultValue="2026-09-09" />

              <Select
                label="Select Preferred Center"
                options={[
                  { value: 'ctr-02', label: 'Rohania Agribusiness Center B (2.4 km)' },
                  { value: 'ctr-01', label: 'Kashi Mandi Center A (5.1 km)' },
                  { value: 'ctr-03', label: 'Sewapuri Farmer Hub C (8.2 km)' },
                ]}
              />

              <Button
                variant="primary"
                size="lg"
                leftIcon={<Sparkles className="w-5 h-5" />}
                className="w-full mt-4"
              >
                FIND BEST SLOT
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Recommendation Preview */}
        <div className="lg:col-span-6 space-y-5">
          <Card variant="tinted" className="p-6 border-2 border-brand-primary">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-widest bg-brand-primary text-white px-3 py-1 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Best Recommended Slot
              </span>
              <span className="text-xs font-semibold text-brand-dark">Score: 0.28 (Best)</span>
            </div>

            <h3 className="text-2xl font-bold text-brand-dark">Tomorrow, 10:40 AM</h3>
            <div className="flex items-center gap-1.5 text-sm text-brand-dark font-medium mt-1">
              <MapPin className="w-4 h-4 text-brand-primary" />
              <span>Rohania Agribusiness Center B • 2.4 km away</span>
            </div>

            <div className="grid grid-cols-3 gap-3 my-5 p-3 rounded-sm bg-white/80 border border-brand-mint text-center">
              <div>
                <p className="text-[11px] text-text-secondary uppercase font-bold">Queue Load</p>
                <p className="text-lg font-bold text-brand-primary mt-0.5">45%</p>
              </div>
              <div>
                <p className="text-[11px] text-text-secondary uppercase font-bold">Est. Wait</p>
                <p className="text-lg font-bold text-brand-dark mt-0.5">~35 mins</p>
              </div>
              <div>
                <p className="text-[11px] text-text-secondary uppercase font-bold">Travel Time</p>
                <p className="text-lg font-bold text-text-primary mt-0.5">15 mins</p>
              </div>
            </div>

            <div className="p-3 bg-white/90 rounded-sm border border-brand-mint text-xs text-text-primary leading-relaxed">
              <span className="font-bold text-brand-dark">Why this slot?</span> Rohania Center B has 45% load and shorter queue compared to Center A (90% load).
            </div>

            <Button
              variant="primary"
              size="lg"
              leftIcon={<CheckCircle2 className="w-5 h-5" />}
              className="w-full mt-6 shadow-md"
              onClick={() => navigate('/farmer/dashboard')}
            >
              CONFIRM SLOT & GET TOKEN
            </Button>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
