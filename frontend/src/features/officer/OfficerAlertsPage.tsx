import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { AlertCard } from '@/components/cards/AlertCard';

export const OfficerAlertsPage: React.FC = () => {
  return (
    <PageContainer
      title="Overload & Surge Alerts"
      subtitle="Early warning alerts regarding capacity bottlenecks, severe delays, and dynamic redirect proposals."
    >
      <div className="max-w-3xl space-y-4">
        <AlertCard
          type="warning"
          title="Center 01 (Kashi Mandi) Overload Surge (>90%)"
          message="Center 01 has reached 90% capacity with 85 farmers in physical queue. 14 incoming bookings can be rerouted to your center."
          actionLabel="Accept Batch Redirect"
          onAction={() => alert('Batch redirect confirmed for 14 farmers.')}
        />

        <AlertCard
          type="suggestion"
          title="Suggested Rerouting Optimization"
          message="12 farmers within a 5 km radius have requested paddy slots. Center 02 has sufficient quota to accommodate them."
          actionLabel="Approve Allocation"
          onAction={() => alert('Allocation approved.')}
        />
      </div>
    </PageContainer>
  );
};
