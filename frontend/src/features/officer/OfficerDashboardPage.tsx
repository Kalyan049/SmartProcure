import React from 'react';
import { PageContainer, StatCard, Card, StatusBadge, CapacityBar, AlertCard, Button } from '@/components';
import { Users, CheckCircle2, Clock, Truck, Eye, Search, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOfficerDashboard } from './hooks/useOfficerDashboard';

export const OfficerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { analytics, queue, loading } = useOfficerDashboard('ctr-02');

  if (loading && !analytics) {
    return (
      <PageContainer title="Procurement Officer Operations Portal">
        <div className="flex flex-col items-center justify-center py-20 text-text-secondary">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-brand-primary" />
          <p>Loading Operations Dashboard...</p>
        </div>
      </PageContainer>
    );
  }

  const waitingQueue = queue.filter(q => q.status === 'WAITING').sort((a, b) => a.position - b.position);

  return (
    <PageContainer
      title="Procurement Officer Operations Portal"
      subtitle="Center 02 (Rohania Agribusiness Hub) • Daily Intake, Queue Load & Capacity Coordination"
    >
      {/* 1. Row of 4 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Expected Today"
          value={analytics?.expected_today.toString() || '0'}
          subtitle="Total scheduled farmer slots"
          icon={<Truck className="w-5 h-5" />}
          iconColor="blue"
        />
        <StatCard
          title="Arrived at Center"
          value={analytics?.arrived_today.toString() || '0'}
          subtitle="Checked-in at security gates"
          icon={<Users className="w-5 h-5" />}
          iconColor="amber"
        />
        <StatCard
          title="Fully Processed"
          value={analytics?.fully_processed.toString() || '0'}
          subtitle="Weighed & payment initiated"
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconColor="green"
        />
        <StatCard
          title="Currently Waiting"
          value={analytics?.currently_waiting.toString() || '0'}
          subtitle="In physical center queue"
          icon={<Clock className="w-5 h-5" />}
          iconColor="amber"
        />
      </div>

      {/* 2. Operational Capacity & Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Center Capacity & Crop Mix */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-6">
            <h2 className="text-base font-bold text-text-primary mb-4 pb-2 border-b border-surface-border">
              Center Load & Intake Capacity
            </h2>
            <CapacityBar 
              percent={analytics?.capacity_percent || 0} 
              label={`Rohania Center Capacity: ${analytics?.capacity_percent}% (${(analytics?.capacity_percent || 0) < 90 ? 'Normal Operation' : 'Critical Load'})`} 
            />

            <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-surface-border text-center text-xs">
              <div>
                <p className="text-text-secondary">Daily Quota</p>
                <p className="text-lg font-bold text-text-primary mt-1">{analytics?.daily_quota_quintals} Quintals</p>
              </div>
              <div>
                <p className="text-text-secondary">Procured Today</p>
                <p className="text-lg font-bold text-brand-primary mt-1">{analytics?.procured_today_quintals} Quintals</p>
              </div>
              <div>
                <p className="text-text-secondary">Remaining Space</p>
                <p className="text-lg font-bold text-text-primary mt-1">{(analytics?.daily_quota_quintals || 0) - (analytics?.procured_today_quintals || 0)} Quintals</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Alerts & Smart Suggestions */}
        <div className="lg:col-span-4 space-y-4">
          <AlertCard
            type="warning"
            title="Neighboring Center 01 Approaching 90% Load"
            message="Kashi Mandi has high queue surge. Recommended to accept redirects."
            actionLabel="View Redirects"
            onAction={() => {}}
          />
          <AlertCard
            type="suggestion"
            title="Smart Load Balancing Suggestion"
            message={`Center 02 has ${100 - (analytics?.capacity_percent || 0)}% spare capacity for afternoon slot intake.`}
            actionLabel="Manage Slots"
            onAction={() => {}}
          />
        </div>
      </div>

      {/* 3. Live Queue Table */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border mb-4">
          <div>
            <h2 className="text-base font-bold text-text-primary">Live Counter Queue</h2>
            <p className="text-xs text-text-secondary mt-0.5">Real-time arrival order and counter status</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={() => navigate('/officer/queue')}
            >
              Manage Queue
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-page text-text-secondary text-xs uppercase font-bold border-y border-surface-border">
              <tr>
                <th className="py-3 px-4">Pos</th>
                <th className="py-3 px-4">Token</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Est. Wait</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {waitingQueue.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-text-secondary">
                    No farmers are currently waiting.
                  </td>
                </tr>
              ) : (
                waitingQueue.slice(0, 5).map((entry, idx) => (
                  <tr key={entry.id} className="hover:bg-surface-page transition-colors">
                    <td className="py-3 px-4 font-bold text-text-secondary">#{entry.position}</td>
                    <td className="py-3 px-4 font-mono font-bold text-brand-dark">{entry.token_number}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={entry.status} />
                    </td>
                    <td className="py-3 px-4 text-text-secondary">{entry.estimated_wait_minutes} min</td>
                    <td className="py-3 px-4 text-right">
                      {idx === 0 ? (
                        <Button
                          size="sm"
                          variant="primary"
                          leftIcon={<Eye className="w-3.5 h-3.5" />}
                          onClick={() => navigate('/officer/procurement')}
                        >
                          Process
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" disabled>
                          Wait
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </PageContainer>
  );
};
