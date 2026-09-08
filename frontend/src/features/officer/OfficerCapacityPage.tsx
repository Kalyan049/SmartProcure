import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/cards/Card';
import { CapacityBar } from '@/components/status/CapacityBar';
import { Button } from '@/components/ui/Button';

export const OfficerCapacityPage: React.FC = () => {
  return (
    <PageContainer
      title="Capacity & Slot Inventory Management"
      subtitle="Monitor intake throughput and dynamically adjust hourly slot allocations."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-base font-bold text-text-primary mb-4 pb-2 border-b border-surface-border">
            Today's Operating Load
          </h2>
          <CapacityBar percent={45} label="Current Capacity Utilization (45%)" />
          <div className="mt-6 space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-surface-border">
              <span className="text-text-secondary">Total Daily Capacity:</span>
              <span className="font-bold text-text-primary">600.0 Quintals</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-surface-border">
              <span className="text-text-secondary">Current Procured Produce:</span>
              <span className="font-bold text-brand-primary">270.0 Quintals</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-text-secondary">Remaining Intake Space:</span>
              <span className="font-bold text-text-primary">330.0 Quintals</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-base font-bold text-text-primary mb-4 pb-2 border-b border-surface-border">
            Slot Capacity Controls
          </h2>
          <p className="text-xs text-text-secondary mb-4">
            Increase or throttle booking slots for upcoming hours to balance arrivals.
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-surface-page rounded-sm border border-surface-border text-xs">
              <div>
                <p className="font-bold text-text-primary">11:00 AM - 12:00 PM</p>
                <p className="text-text-secondary">8 / 15 slots booked</p>
              </div>
              <Button size="sm" variant="outline">
                Adjust Limit
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-surface-page rounded-sm border border-surface-border text-xs">
              <div>
                <p className="font-bold text-text-primary">12:00 PM - 01:00 PM</p>
                <p className="text-text-secondary">12 / 15 slots booked</p>
              </div>
              <Button size="sm" variant="outline">
                Adjust Limit
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};
