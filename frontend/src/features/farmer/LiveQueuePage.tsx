import React from 'react';
import { PageContainer, Card, StatusBadge, QueueIndicator, CapacityBar, Button } from '@/components';
import { Compass, QrCode, AlertTriangle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQueueRealtime } from './hooks/useQueueRealtime';

export const LiveQueuePage: React.FC = () => {
  const navigate = useNavigate();
  // Using default demo token for the MVP
  const { queueEntry, loading, error, status } = useQueueRealtime('SP-1047');

  if (loading) {
    return (
      <PageContainer title="Live Queue Status">
        <div className="flex flex-col items-center justify-center py-20 text-text-secondary">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-brand-primary" />
          <p>Syncing your digital token...</p>
        </div>
      </PageContainer>
    );
  }

  if (error || !queueEntry) {
    return (
      <PageContainer title="Live Queue Status">
        <div className="max-w-lg mx-auto">
          <Card className="p-6 flex flex-col items-center text-center">
            <AlertTriangle className="w-10 h-10 text-red-500 mb-4" />
            <h3 className="font-bold text-text-primary mb-2">Token Not Found or Offline</h3>
            <p className="text-sm text-text-secondary mb-6">
              {error || "We couldn't find an active queue entry for your token. It may have been completed."}
            </p>
            <Button variant="primary" onClick={() => navigate('/farmer/booking')}>
              Book a New Slot
            </Button>
          </Card>
        </div>
      </PageContainer>
    );
  }

  const isCompleted = queueEntry.status === 'COMPLETED';

  return (
    <PageContainer
      title="Live Queue Status"
      subtitle="Real-time monitoring of your position and center processing throughput."
      action={
        <Button
          variant="primary"
          leftIcon={<Compass className="w-4 h-4" />}
          onClick={() => navigate('/farmer/should-i-go')}
          disabled={isCompleted}
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
                  {queueEntry.token_number}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={queueEntry.status} />
                {!isCompleted && status === 'LIVE' && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-semantic-info flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-semantic-info animate-ping" />
                    Live Sync
                  </span>
                )}
                {!isCompleted && status === 'CONNECTING' && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-50 text-gray-500 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Syncing...
                  </span>
                )}
              </div>
            </div>

            {isCompleted ? (
              <div className="py-10 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-green-50">
                  <span className="text-green-600 font-bold text-2xl">✓</span>
                </div>
                <h3 className="text-lg font-bold text-text-primary">Procurement Complete</h3>
                <p className="text-sm text-text-secondary mt-1">
                  Your token has been processed by the center officer.
                </p>
                <Button className="mt-6" variant="outline" onClick={() => navigate('/farmer/dashboard')}>
                  Return to Dashboard
                </Button>
              </div>
            ) : (
              <>
                {/* Visual Queue Indicator */}
                <div className="my-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-text-secondary">
                      Queue Position Progress
                    </span>
                    <span className="text-xs font-bold text-brand-dark">
                      Position #{queueEntry.position} ({queueEntry.farmers_ahead} ahead)
                    </span>
                  </div>
                  {/* Dynamic Queue Indicator that respects farmers_ahead */}
                  <QueueIndicator farmersAhead={queueEntry.farmers_ahead} />
                </div>

                {/* Estimated Wait Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-surface-border text-center">
                  <div className="p-3 bg-surface-page rounded-sm transition-all duration-500 transform">
                    <p className="text-xs text-text-secondary">Estimated Wait</p>
                    <p className={`text-xl font-bold mt-1 ${queueEntry.estimated_wait_minutes <= 15 ? 'text-green-600' : 'text-text-primary'}`}>
                      ~{queueEntry.estimated_wait_minutes} mins
                    </p>
                  </div>
                  <div className="p-3 bg-surface-page rounded-sm">
                    <p className="text-xs text-text-secondary">Processing Speed</p>
                    <p className="text-xl font-bold text-brand-primary mt-1">6 min/farmer</p>
                  </div>
                  <div className="p-3 bg-surface-page rounded-sm">
                    <p className="text-xs text-text-secondary">Farmers Ahead</p>
                    <p className="text-xl font-bold text-text-primary mt-1">{queueEntry.farmers_ahead}</p>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>

        {/* QR Code & Center Details Card */}
        <div className="lg:col-span-4 space-y-6">
          <Card className={`p-6 text-center ${isCompleted ? 'opacity-50' : ''}`}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-3">
              Fast Check-In QR
            </h3>
            <div className="w-40 h-40 mx-auto bg-gray-100 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center p-3 mb-4">
              <QrCode className="w-20 h-20 text-text-primary" />
              <span className="text-[10px] font-mono text-text-secondary mt-2 break-all px-2">
                SP:BK{queueEntry.booking_id?.split('-')[1]}:F01:C02
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
