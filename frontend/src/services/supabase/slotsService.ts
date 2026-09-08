/**
 * SmartProcure - Slots Service
 * Fetches available slots from Supabase; falls back to mock data.
 */
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { MOCK_SLOTS } from '@/data/mockData';
import type { Slot } from '@shared/types';

function mapRow(row: Record<string, unknown>): Slot {
  return {
    id: row.id as string,
    center_id: row.center_id as string,
    date: row.date as string,
    start_time: row.start_time as string,
    end_time: row.end_time as string,
    capacity: Number(row.capacity),
    booked_count: Number(row.booked_count),
    status: row.status as Slot['status'],
    created_at: row.created_at as string,
  };
}

export const slotsService = {
  /** List available slots for a center on a given date */
  async listSlots(centerId: string, date: string): Promise<Slot[]> {
    if (!isSupabaseConfigured) return MOCK_SLOTS;

    const { data, error } = await supabase
      .from('slots')
      .select('*')
      .eq('center_id', centerId)
      .eq('date', date)
      .neq('status', 'CANCELLED')
      .order('start_time');

    if (error) {
      console.error('[slotsService] listSlots error:', error.message);
      return MOCK_SLOTS;
    }
    return (data ?? []).map((row) => mapRow(row as Record<string, unknown>));
  },

  /** Get a single slot by ID */
  async getSlot(slotId: string): Promise<Slot | null> {
    if (!isSupabaseConfigured) {
      return MOCK_SLOTS.find((s) => s.id === slotId) ?? null;
    }

    const { data, error } = await supabase
      .from('slots')
      .select('*')
      .eq('id', slotId)
      .single();

    if (error) {
      console.error('[slotsService] getSlot error:', error.message);
      return null;
    }
    return mapRow(data as Record<string, unknown>);
  },
};
