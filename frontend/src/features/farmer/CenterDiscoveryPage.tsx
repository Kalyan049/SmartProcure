import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer, Card, Input, Select, Button, StatusBadge, CapacityMeter } from '@/components';
import { Search, MapPin, Clock, Users, ArrowRight, Compass, AlertTriangle, Loader2 } from 'lucide-react';
import { fetchApi } from '@/services/api/apiClient';
import { API_ENDPOINTS } from '@/app/config/api.config';
import { ProcurementCenter } from '@shared/types';

interface CenterData extends ProcurementCenter {
  distanceKm: number;
  queueLength: number;
  estimatedWaitTimeMins: number;
}

export const CenterDiscoveryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [cropFilter, setCropFilter] = useState('all');
  
  const [centers, setCenters] = useState<CenterData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCenters();
  }, []);

  const loadCenters = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetchApi<{ data: CenterData[] }>(API_ENDPOINTS.CENTERS.LIST);
      setCenters(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load procurement centers');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCenters = useMemo(() => {
    return centers.filter(center => {
      const matchSearch = center.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          center.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCrop = cropFilter === 'all' || center.supported_crops.map(c => c.toLowerCase()).includes(cropFilter.toLowerCase());
      return matchSearch && matchCrop;
    });
  }, [centers, searchTerm, cropFilter]);

  // Extract unique crops from all centers for the filter dropdown
  const availableCrops = useMemo(() => {
    const crops = new Set<string>();
    centers.forEach(c => c.supported_crops.forEach(crop => crops.add(crop)));
    return Array.from(crops).sort();
  }, [centers]);

  const formatWaitTime = (mins: number) => {
    if (mins < 60) return `${mins} min`;
    const hrs = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${hrs}h ${m}m` : `${hrs}h`;
  };

  return (
    <PageContainer
      title="Procurement Centers"
      subtitle="Discover authorized procurement centers, check live queue pressure, and find available slots."
      action={
        <Button
          variant="primary"
          onClick={() => navigate('/farmer/recommendation')}
          leftIcon={<Compass className="w-4 h-4" />}
        >
          Get Recommendation
        </Button>
      }
    >
      {/* Search & Filter Controls */}
      <Card className="p-4 bg-white shadow-card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search by center name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-text-muted" />}
          />
          <Select
            options={[
              { value: 'all', label: 'Produce: All Crops' },
              ...availableCrops.map(c => ({ value: c, label: `Produce: ${c}` }))
            ]}
            value={cropFilter}
            onChange={(e) => setCropFilter(e.target.value)}
          />
          <Button
            variant="secondary"
            onClick={() => {
              // Reset filters for now since backend sort handles proximity
              setSearchTerm('');
              setCropFilter('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-5 flex flex-col justify-between animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="h-24 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </Card>
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="p-6 bg-red-50 text-red-700 rounded-lg flex flex-col items-center justify-center text-center">
          <AlertTriangle className="w-8 h-8 mb-2" />
          <p className="font-semibold">{error}</p>
          <Button variant="secondary" onClick={loadCenters} className="mt-4">Retry</Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredCenters.length === 0 && (
        <div className="p-12 bg-white rounded-lg border border-surface-border flex flex-col items-center justify-center text-center">
          <MapPin className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-text-primary">No centers found</h3>
          <p className="text-sm text-text-secondary mt-1">Try adjusting your search or crop filter.</p>
          <Button variant="outline" onClick={() => { setSearchTerm(''); setCropFilter('all'); }} className="mt-4">
            Clear Filters
          </Button>
        </div>
      )}

      {/* Centers Grid */}
      {!isLoading && !error && filteredCenters.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCenters.map((center) => (
            <Card key={center.id} className="p-5 flex flex-col justify-between hover:border-brand-primary/40 transition-colors">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-base font-bold text-text-primary">{center.name}</h3>
                  <StatusBadge status={center.status as any} size="sm" />
                </div>

                <div className="flex items-center gap-1.5 text-xs text-text-muted mb-4">
                  <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                  <span className="truncate">{center.address} <strong className="text-text-primary">({center.distanceKm} km)</strong></span>
                </div>

                <div className="space-y-3 p-3 bg-surface-page rounded border border-surface-border mb-4">
                  <CapacityMeter percent={center.current_load_percent} label="Center Load" />
                  <div className="flex items-center justify-between text-xs text-text-secondary pt-2 border-t border-surface-border">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-amber-500" />
                      <strong>{center.queueLength}</strong> waiting
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      Est. Wait: <strong>{formatWaitTime(center.estimatedWaitTimeMins)}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                isFullWidth
                onClick={() => navigate(`/farmer/booking?center=${center.id}`)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                disabled={center.status === 'CLOSED' || center.status === 'MAINTENANCE'}
              >
                {center.status === 'OPEN' ? 'Book at This Center' : 'Currently Closed'}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
};
