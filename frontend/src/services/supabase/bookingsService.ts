/**
 * SmartProcure - Bookings Service
 * Manages slot bookings via Supabase; falls back to mock data.
 */
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { MOCK_BOOKING } from '@/data/mockData';
import type { Booking } from '@shared/types';

function mapRow(row: Record<string, unknown>): Booking {
  return {
    id: row.id as string,
    farmer_id: row.farmer_id as string,
    center_id: row.center_id as string,
    slot_id: row.slot_id as string,
    crop: row.crop as string,
    quantity_quintals: Number(row.quantity_quintals),
    token_number: row.token_number as string,
    qr_code_payload: row.qr_code_payload as string | undefined,
    status: row.status as Booking['status'],
    created_at: row.created_at as string,
    updated_at: row.updated_at as string | undefined,
  };
}

export const bookingsService = {
  /** Get the active booking for the current farmer */
  async getMyBooking(farmerId: string): Promise<Booking | null> {
    if (!isSupabaseConfigured) return MOCK_BOOKING;

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('farmer_id', farmerId)
      .in('status', ['CONFIRMED', 'PENDING'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('[bookingsService] getMyBooking error:', error.message);
      return MOCK_BOOKING;
    }
    return data ? mapRow(data as Record<string, unknown>) : null;
  },

  /** Get all bookings for a farmer */
  async listMyBookings(farmerId: string): Promise<Booking[]> {
    if (!isSupabaseConfigured) return [MOCK_BOOKING];

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('farmer_id', farmerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[bookingsService] listMyBookings error:', error.message);
      return [MOCK_BOOKING];
    }
    return (data ?? []).map((row) => mapRow(row as Record<string, unknown>));
  },

  /** Create a new booking */
  async createBooking(
    booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Booking | null> {
    if (!isSupabaseConfigured) return { ...MOCK_BOOKING, ...booking };

    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select()
      .single();

    if (error) {
      console.error('[bookingsService] createBooking error:', error.message);
      return null;
    }
    return mapRow(data as Record<string, unknown>);
  },

  /** Cancel a booking */
  async cancelBooking(bookingId: string): Promise<boolean> {
    if (!isSupabaseConfigured) return true;

    const { error } = await supabase
      .from('bookings')
      .update({ status: 'CANCELLED' })
      .eq('id', bookingId);

    if (error) {
      console.error('[bookingsService] cancelBooking error:', error.message);
      return false;
    }
    return true;
  },
};
