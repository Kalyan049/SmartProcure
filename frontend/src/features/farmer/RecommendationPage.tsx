import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer, RecommendationCard, Button } from '@/components';
import { ArrowLeft } from 'lucide-react';

export const RecommendationPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageContainer
      title="Recommended Procurement Slot"
      subtitle="Capacity-aware arrival coordination calculated based on your location, load pressure, and wait times."
      action={
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/farmer/booking')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Booking
        </Button>
      }
    >
      <div className="max-w-3xl mx-auto">
        <RecommendationCard
          centerName="Center B — Malwa North Mandi"
          slotTime="Today, 10:40 AM"
          estimatedWaitMinutes={35}
          queueLength={32}
          capacityPercent={45}
          distanceKm={2.4}
          recommendationReason="Center B has an optimal arrival distribution with 32 farmers currently in queue (compared to 85 at Center A) and operating at 45% capacity. Choosing this slot reduces your estimated yard waiting time to ~35 minutes."
          onSelect={() => navigate('/farmer/booking/confirmation')}
          ctaLabel="Confirm This Recommended Slot"
          alternatives={[
            {
              id: 'alt-1',
              name: 'Center C — Kisan Mandi Hub',
              slotTime: 'Today, 11:15 AM',
              waitMinutes: 40,
              distanceKm: 4.1,
              queueLength: 18,
              capacityPercent: 30,
            },
            {
              id: 'alt-2',
              name: 'Center A — District Terminal',
              slotTime: 'Today, 02:00 PM',
              waitMinutes: 75,
              distanceKm: 5.8,
              queueLength: 85,
              capacityPercent: 90,
            },
          ]}
          onSelectAlternative={() => navigate('/farmer/booking/confirmation')}
        />
      </div>
    </PageContainer>
  );
};
