/**
 * SmartProcure - Procurement Service
 * Manages procurement records and procurement event timeline.
 */
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { MOCK_PROCUREMENT } from '@/data/mockData';
import type { Procurement, ProcurementEvent } from '@shared/types';

function mapProcurementRow(row: Record<string, unknown>): Procurement {
  return {
    id: row.id as string,
    booking_id: row.booking_id as string,
    farmer_id: row.farmer_id as string,
    center_id: row.center_id as string,
    crop: row.crop as string,
    estimated_quantity_quintals: Number(row.estimated_quantity_quintals),
    accepted_quantity_quintals: row.accepted_quantity_quintals != null
      ? Number(row.accepted_quantity_quintals)
      : undefined,
    inspection_status: row.inspection_status as Procurement['inspection_status'],
    inspection_notes: row.inspection_notes as string | undefined,
    grade: row.grade as Procurement['grade'] | undefined,
    moisture_percent: row.moisture_percent != null
      ? Number(row.moisture_percent)
      : undefined,
    weighing_status: row.weighing_status as Procurement['weighing_status'],
    verification_status: row.verification_status as Procurement['verification_status'],
    status: row.status as Procurement['status'],
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

function mapEventRow(row: Record<string, unknown>): ProcurementEvent {
  return {
    id: row.id as string,
    procurement_id: row.procurement_id as string,
    stage: row.stage as ProcurementEvent['stage'],
    status: row.status as string,
    actor_id: row.actor_id as string,
    actor_name: row.actor_name as string,
    notes: row.notes as string | undefined,
    created_at: row.created_at as string,
  };
}

export const procurementService = {
  /** Get the active procurement for a booking */
  async getProcurementByBooking(bookingId: string): Promise<Procurement | null> {
    if (!isSupabaseConfigured) return MOCK_PROCUREMENT;

    const { data, error } = await supabase
      .from('procurements')
      .select('*')
      .eq('booking_id', bookingId)
      .maybeSingle();

    if (error) {
      console.error('[procurementService] getProcurementByBooking error:', error.message);
      return MOCK_PROCUREMENT;
    }
    return data ? mapProcurementRow(data as Record<string, unknown>) : null;
  },

  /** Get all procurements for a farmer */
  async listFarmerProcurements(farmerId: string): Promise<Procurement[]> {
    if (!isSupabaseConfigured) return [MOCK_PROCUREMENT];

    const { data, error } = await supabase
      .from('procurements')
      .select('*')
      .eq('farmer_id', farmerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[procurementService] listFarmerProcurements error:', error.message);
      return [MOCK_PROCUREMENT];
    }
    return (data ?? []).map((row) => mapProcurementRow(row as Record<string, unknown>));
  },

  /** Get all procurements for a center (officer view) */
  async listCenterProcurements(
    centerId: string,
    date?: string
  ): Promise<Procurement[]> {
    if (!isSupabaseConfigured) return [MOCK_PROCUREMENT];

    let query = supabase
      .from('procurements')
      .select('*')
      .eq('center_id', centerId)
      .order('created_at', { ascending: false });

    if (date) {
      query = query.gte('created_at', `${date}T00:00:00`).lte('created_at', `${date}T23:59:59`);
    }

    const { data, error } = await query;
    if (error) {
      console.error('[procurementService] listCenterProcurements error:', error.message);
      return [];
    }
    return (data ?? []).map((row) => mapProcurementRow(row as Record<string, unknown>));
  },

  /** Get procurement timeline events */
  async getEvents(procurementId: string): Promise<ProcurementEvent[]> {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from('procurement_events')
      .select('*')
      .eq('procurement_id', procurementId)
      .order('created_at');

    if (error) {
      console.error('[procurementService] getEvents error:', error.message);
      return [];
    }
    return (data ?? []).map((row) => mapEventRow(row as Record<string, unknown>));
  },

  /** Subscribe to real-time procurement stage updates */
  subscribeToProcurement(
    procurementId: string,
    callback: (procurement: Procurement) => void
  ) {
    if (!isSupabaseConfigured) return { unsubscribe: () => {} };

    const channel = supabase
      .channel(`procurement-${procurementId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'procurements',
          filter: `id=eq.${procurementId}`,
        },
        (payload) => {
          callback(mapProcurementRow(payload.new as Record<string, unknown>));
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
