import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { StatCard } from '@/components/cards/StatCard';
import { Card } from '@/components/cards/Card';
import { StatusBadge } from '@/components/status/StatusBadge';
import { CapacityBar } from '@/components/status/CapacityBar';
import { AlertCard } from '@/components/cards/AlertCard';
import { Button } from '@/components/ui/Button';
import {
  Users,
  CheckCircle2,
  Clock,
  Truck,
  Eye,
  Search,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OfficerDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageContainer
      title="Procurement Officer Operations Portal"
      subtitle="Center 02 (Rohania Agribusiness Hub) • Daily Intake, Queue Load & Capacity Coordination"
    >
      {/* 1. Row of 4 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Expected Today"
          value="124"
          subtitle="Total scheduled farmer slots"
          icon={<Truck className="w-5 h-5" />}
          iconColor="blue"
        />
        <StatCard
          title="Arrived at Center"
          value="86"
          subtitle="Checked-in at security gates"
          icon={<Users className="w-5 h-5" />}
          iconColor="amber"
        />
        <StatCard
          title="Fully Processed"
          value="64"
          subtitle="Weighed & payment initiated"
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconColor="green"
        />
        <StatCard
          title="Currently Waiting"
          value="22"
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
            <CapacityBar percent={45} label="Rohania Center Capacity: 45% (Normal Operation)" />

            <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-surface-border text-center text-xs">
              <div>
                <p className="text-text-secondary">Daily Quota</p>
                <p className="text-lg font-bold text-text-primary mt-1">600 Quintals</p>
              </div>
              <div>
                <p className="text-text-secondary">Procured Today</p>
                <p className="text-lg font-bold text-brand-primary mt-1">270 Quintals</p>
              </div>
              <div>
                <p className="text-text-secondary">Remaining Space</p>
                <p className="text-lg font-bold text-text-primary mt-1">330 Quintals</p>
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
            onAction={() => navigate('/officer/alerts')}
          />
          <AlertCard
            type="suggestion"
            title="Smart Load Balancing Suggestion"
            message="Center 02 has 55% spare capacity for afternoon slot intake."
            actionLabel="Manage Slots"
            onAction={() => navigate('/officer/capacity')}
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
            <div className="relative">
              <Search className="w-4 h-4 text-text-secondary absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search token / farmer..."
                className="pl-9 pr-3 py-1.5 text-xs rounded-sm border border-surface-input focus:border-brand-primary"
              />
            </div>
            <Button
              size="sm"
              variant="outline"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={() => navigate('/officer/queue')}
            >
              Full Table
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-page text-text-secondary text-xs uppercase font-bold border-y border-surface-border">
              <tr>
                <th className="py-3 px-4">Token</th>
                <th className="py-3 px-4">Farmer Name</th>
                <th className="py-3 px-4">Crop</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Appointment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              <tr className="hover:bg-surface-page transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-brand-dark">SP-1047</td>
                <td className="py-3 px-4 font-medium text-text-primary">Ramesh Kumar</td>
                <td className="py-3 px-4 text-text-secondary">Paddy</td>
                <td className="py-3 px-4 text-text-primary font-semibold">40.0 Qtl</td>
                <td className="py-3 px-4 text-text-secondary">10:30 AM</td>
                <td className="py-3 px-4">
                  <StatusBadge status="WAITING" />
                </td>
                <td className="py-3 px-4 text-right">
                  <Button
                    size="sm"
                    variant="primary"
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                    onClick={() => navigate('/officer/procurement')}
                  >
                    Process
                  </Button>
                </td>
              </tr>
              <tr className="hover:bg-surface-page transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-text-primary">SP-1048</td>
                <td className="py-3 px-4 font-medium text-text-primary">Suresh Singh</td>
                <td className="py-3 px-4 text-text-secondary">Paddy</td>
                <td className="py-3 px-4 text-text-primary font-semibold">35.0 Qtl</td>
                <td className="py-3 px-4 text-text-secondary">10:45 AM</td>
                <td className="py-3 px-4">
                  <StatusBadge status="WAITING" />
                </td>
                <td className="py-3 px-4 text-right">
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </PageContainer>
  );
};
