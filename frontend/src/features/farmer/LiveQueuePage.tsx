import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/cards/Card';
import { StatusBadge } from '@/components/status/StatusBadge';
import { QueueIndicator } from '@/components/status/QueueIndicator';
import { CapacityBar } from '@/components/status/CapacityBar';
import { Button } from '@/components/ui/Button';
import { Compass, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LiveQueuePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageContainer
      title="Live Queue Status"
      subtitle="Real-time monitoring of your position and center processing throughput."
      action={
        <Button
          variant="primary"
          leftIcon={<Compass className="w-4 h-4" />}
          onClick={() => navigate('/farmer/should-i-go')}
        >
          Check "Should I Go Now?"
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Token Summary Card */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Your Digital Token
                </span>
                <h2 className="text-3xl font-extrabold text-brand-dark tracking-tight mt-0.5">
                  SP-1047
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status="CONFIRMED" />
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-semantic-info flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-semantic-info animate-ping" />
                  Live Sync
                </span>
              </div>
            </div>

            {/* Visual Queue Indicator */}
            <div className="my-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-text-secondary">
                  Queue Position Progress
                </span>
                <span className="text-xs font-bold text-brand-dark">Position #7 (6 ahead)</span>
              </div>
              <QueueIndicator farmersAhead={6} />
            </div>

            {/* Estimated Wait Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-surface-border text-center">
              <div className="p-3 bg-surface-page rounded-sm">
                <p className="text-xs text-text-secondary">Estimated Wait</p>
                <p className="text-xl font-bold text-text-primary mt-1">~36 mins</p>
              </div>
              <div className="p-3 bg-surface-page rounded-sm">
                <p className="text-xs text-text-secondary">Processing Speed</p>
                <p className="text-xl font-bold text-brand-primary mt-1">6 min/farmer</p>
              </div>
              <div className="p-3 bg-surface-page rounded-sm">
                <p className="text-xs text-text-secondary">Current Token Serving</p>
                <p className="text-xl font-bold text-text-primary mt-1">SP-1041</p>
              </div>
            </div>
          </Card>
        </div>

        {/* QR Code & Center Details Card */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 text-center">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-3">
              Fast Check-In QR
            </h3>
            <div className="w-40 h-40 mx-auto bg-gray-100 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center p-3 mb-4">
              <QrCode className="w-20 h-20 text-text-primary" />
              <span className="text-[10px] font-mono text-text-secondary mt-2">
                SP:BK1047:F01:C02
              </span>
            </div>
            <p className="text-xs text-text-secondary">
              Present this QR at the gate for touchless check-in and weight verification.
            </p>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-bold text-text-primary mb-3">Center Capacity</h3>
            <CapacityBar percent={45} label="Rohania Center Load" />
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
