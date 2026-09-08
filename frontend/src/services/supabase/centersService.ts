/**
 * SmartProcure - Procurement Centers Service
 * Fetches centers from Supabase; falls back to mock data when offline.
 */
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { MOCK_CENTERS } from '@/data/mockData';
import type { ProcurementCenter } from '@shared/types';

function mapRow(row: Record<string, unknown>): ProcurementCenter {
  return {
    id: row.id as string,
    name: row.name as string,
    code: row.code as string,
    address: row.address as string,
    district: row.district as string,
    state: row.state as string,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    daily_capacity_quintals: Number(row.daily_capacity_quintals),
    current_load_percent: Number(row.current_load_percent),
    processing_rate_min_per_farmer: Number(row.processing_rate_min_per_farmer),
    status: row.status as ProcurementCenter['status'],
    load_status: row.load_status as ProcurementCenter['load_status'],
    operating_hours: row.operating_hours as ProcurementCenter['operating_hours'],
    supported_crops: row.supported_crops as string[],
    photo_url: row.photo_url as string | undefined,
    contact_phone: row.contact_phone as string | undefined,
    created_at: row.created_at as string,
  };
}

export const centersService = {
  /** List all active procurement centers */
  async listCenters(): Promise<ProcurementCenter[]> {
    if (!isSupabaseConfigured) return MOCK_CENTERS;

    const { data, error } = await supabase
      .from('procurement_centers')
      .select('*')
      .eq('status', 'OPEN')
      .order('name');

    if (error) {
      console.error('[centersService] listCenters error:', error.message);
      return MOCK_CENTERS;
    }
    return (data ?? []).map((row) => mapRow(row as Record<string, unknown>));
  },

  /** Get a single center by ID */
  async getCenter(centerId: string): Promise<ProcurementCenter | null> {
    if (!isSupabaseConfigured) {
      return MOCK_CENTERS.find((c) => c.id === centerId) ?? MOCK_CENTERS[0];
    }

    const { data, error } = await supabase
      .from('procurement_centers')
      .select('*')
      .eq('id', centerId)
      .single();

    if (error) {
      console.error('[centersService] getCenter error:', error.message);
      return null;
    }
    return mapRow(data as Record<string, unknown>);
  },

  /** Subscribe to real-time capacity updates for a center */
  subscribeToCapacity(
    centerId: string,
    callback: (center: Partial<ProcurementCenter>) => void
  ) {
    if (!isSupabaseConfigured) return { unsubscribe: () => {} };

    const channel = supabase
      .channel(`center-capacity-${centerId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'procurement_centers',
          filter: `id=eq.${centerId}`,
        },
        (payload) => {
          callback(payload.new as Partial<ProcurementCenter>);
        }
      )
      .subscribe();

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      },
    };
  },
};
