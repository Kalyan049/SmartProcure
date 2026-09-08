import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer, Card, Input, Select, Button, StatusBadge, CapacityMeter } from '@/components';
import { Search, MapPin, Clock, Users, ArrowRight, Compass } from 'lucide-react';

interface ProcurementCenterItem {
  id: string;
  name: string;
  location: string;
  distanceKm: number;
  queueLength: number;
  capacityPercent: number;
  operatingHours: string;
  status: 'OPEN' | 'BUSY' | 'CLOSED';
}

export const CenterDiscoveryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [cropFilter, setCropFilter] = useState('wheat');

  const mockCenters: ProcurementCenterItem[] = [
    {
      id: 'CTR-02',
      name: 'Center B — Malwa North Mandi',
      location: 'Plot 14, Industrial Estate, Malwa',
      distanceKm: 2.4,
      queueLength: 32,
      capacityPercent: 45,
      operatingHours: '08:00 AM – 06:00 PM',
      status: 'OPEN',
    },
    {
      id: 'CTR-01',
      name: 'Center A — District Grain Terminal',
      location: 'GT Road By-Pass, Zone 1',
      distanceKm: 5.8,
      queueLength: 85,
      capacityPercent: 90,
      operatingHours: '08:00 AM – 06:00 PM',
      status: 'BUSY',
    },
    {
      id: 'CTR-03',
      name: 'Center C — Kisan Mandi Hub',
      location: 'Sub-Division 3, Near Railway Siding',
      distanceKm: 4.1,
      queueLength: 18,
      capacityPercent: 30,
      operatingHours: '08:30 AM – 05:30 PM',
      status: 'OPEN',
    },
  ];

  return (
    <PageContainer
      title="Procurement Centers"
      subtitle="Discover authorized procurement centers, check live queue pressure, and find available slots."
      action={
        <Button
          variant="primary"
          onClick={() => navigate('/farmer/booking')}
          leftIcon={<Compass className="w-4 h-4" />}
        >
          Get Recommendation
        </Button>
      }
    >
      {/* Search & Filter Controls */}
      <Card className="p-4 bg-white shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search by center name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-text-muted" />}
          />
          <Select
            options={[
              { value: 'wheat', label: 'Produce: Wheat (Gehun)' },
              { value: 'paddy', label: 'Produce: Paddy (Dhan)' },
              { value: 'gram', label: 'Produce: Gram (Chana)' },
            ]}
            value={cropFilter}
            onChange={(e) => setCropFilter(e.target.value)}
          />
          <Button
            variant="secondary"
            onClick={() => navigate('/farmer/booking')}
          >
            Filter by Proximity
          </Button>
        </div>
      </Card>

      {/* Centers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockCenters.map((center) => (
          <Card key={center.id} className="p-5 flex flex-col justify-between hover:border-brand-primary/40 transition-colors">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-base font-bold text-text-primary">{center.name}</h3>
                <StatusBadge status={center.status} size="sm" />
              </div>

              <div className="flex items-center gap-1.5 text-xs text-text-muted mb-4">
                <MapPin className="w-3.5 h-3.5 text-text-muted shrink-0" />
                <span className="truncate">{center.location} ({center.distanceKm} km)</span>
              </div>

              <div className="space-y-3 p-3 bg-surface-page rounded border border-surface-border mb-4">
                <CapacityMeter percent={center.capacityPercent} label="Live Capacity" />
                <div className="flex items-center justify-between text-xs text-text-secondary pt-2 border-t border-surface-border">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-text-muted" />
                    <strong>{center.queueLength}</strong> waiting
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-text-muted" />
                    {center.operatingHours}
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              isFullWidth
              onClick={() => navigate('/farmer/booking')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Book at This Center
            </Button>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
};
