import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Users,
  Wheat,
  Clock,
  MapPin,
  ChevronRight,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Card } from '@/components/cards/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/status/StatusBadge';
import { StatusCard } from '@/components/cards/StatusCard';
import { PageContainer } from '@/components/layout/PageContainer';
import { useAuth } from '@/app/providers/AuthProvider';
import { healthService, HealthStatus } from '@/services/api/healthService';

export const FarmerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [health, setHealth] = useState<HealthStatus | null>(null);

  useEffect(() => {
    healthService
      .check()
      .then(setHealth)
      .catch((err) => console.log('Operating in standalone mode:', err));
  }, []);

  return (
    <PageContainer>
      {/* 1. Greeting & Hero Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-md border border-surface-border shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              Namaste, {user?.name || 'Farmer'}!
            </h1>
            <span className="text-xs bg-brand-tint text-brand-primary px-2 py-0.5 rounded-full font-bold">
              ID: SP-FARMER-1082
            </span>
          </div>
          <p className="text-sm text-text-secondary mt-1">
            Right Information. Less Waiting. Brighter Tomorrows.
          </p>
        </div>
        {health && (
          <div className="flex items-center gap-2 text-xs bg-brand-tint border border-brand-mint text-brand-dark px-3 py-1.5 rounded-sm self-start md:self-auto">
            <span className="w-2 h-2 rounded-full bg-brand-primary animate-ping" />
            <span className="font-semibold">Backend Live (v{health.version})</span>
          </div>
        )}
      </div>

      {/* 2. Row of 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: My Slot */}
        <Card className="hover:border-brand-primary transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-brand-tint text-brand-primary flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <StatusBadge status="CONFIRMED" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            My Slot
          </p>
          <h2 className="text-2xl font-bold text-text-primary mt-1">10:30 AM</h2>
          <p className="text-xs text-text-secondary mt-1">Tomorrow, 09 Sep 2026</p>
        </Card>

        {/* Card 2: Queue Position */}
        <Card className="hover:border-brand-primary transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-semantic-info flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-semantic-info bg-blue-50 px-2.5 py-0.5 rounded-full">
              Live
            </span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Queue Position
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <h2 className="text-2xl font-bold text-text-primary">#7</h2>
            <span className="text-xs text-text-secondary font-medium">
              (6 farmers ahead)
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1">Est. Wait: ~36 mins</p>
        </Card>

        {/* Card 3: Crop & Quantity */}
        <Card className="hover:border-brand-primary transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-semantic-warning flex items-center justify-center">
              <Wheat className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-text-secondary bg-gray-100 px-2.5 py-0.5 rounded-full">
              Paddy
            </span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Crop & Quantity
          </p>
          <h2 className="text-2xl font-bold text-text-primary mt-1">40.0 Quintals</h2>
          <p className="text-xs text-text-secondary mt-1">Estimated MSP: ₹92,000</p>
        </Card>
      </div>

      {/* 3. Confirmation Banner & Procurement Center Location */}
      <StatusCard
        status="confirmed"
        title="Your Slot is Confirmed at Rohania Center B"
        description="Please arrive within your recommended departure window to avoid physical waiting."
        centerName="Rohania Agribusiness Center (CTR-02) • GT Road, Varanasi"
      >
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            size="lg"
            variant="primary"
            leftIcon={<Sparkles className="w-5 h-5" />}
            onClick={() => navigate('/farmer/should-i-go')}
            className="w-full sm:w-auto shadow-md"
          >
            SHOULD I GO NOW?
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate('/farmer/booking')}
            className="w-full sm:w-auto"
          >
            BOOK / CHANGE SLOT
          </Button>
        </div>
      </StatusCard>

      {/* 4. Latest Updates & Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Updates Timeline */}
        <div className="lg:col-span-2 bg-white p-6 rounded-md border border-surface-border shadow-card">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-surface-border">
            <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-primary" />
              Latest Operational Updates
            </h2>
            <button
              onClick={() => navigate('/farmer/notifications')}
              className="text-xs font-bold text-brand-primary hover:underline inline-flex items-center gap-1"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-sm bg-surface-page border border-surface-border">
              <div className="w-2 h-2 rounded-full bg-brand-primary mt-1.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary">
                  Center B queue is moving smoothly (~6 min/farmer).
                </p>
                <p className="text-xs text-text-secondary mt-0.5">10 minutes ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-sm bg-surface-page border border-surface-border">
              <div className="w-2 h-2 rounded-full bg-semantic-info mt-1.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary">
                  Token SP-1047 assigned for 40 quintals Paddy.
                </p>
                <p className="text-xs text-text-secondary mt-0.5">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Procurement Center Quick Card */}
        <div className="bg-white p-6 rounded-md border border-surface-border shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-brand-dark font-bold mb-3">
              <MapPin className="w-5 h-5 text-brand-primary" />
              <span>Center Overview</span>
            </div>
            <h3 className="text-base font-bold text-text-primary">Rohania Center (CTR-02)</h3>
            <p className="text-xs text-text-secondary mt-1">
              2.4 km away from your registered village (Rampur).
            </p>
            <div className="mt-4 pt-3 border-t border-surface-border space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-text-secondary">Operating Hours:</span>
                <span className="font-semibold text-text-primary">08:00 AM – 06:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Current Load:</span>
                <span className="font-semibold text-brand-primary">45% (Normal)</span>
              </div>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/farmer/queue')}
            className="w-full mt-6"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Track Live Queue
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};
