/**
 * SmartProcure - Queue Service
 * Manages live queue entries and real-time subscriptions.
 */
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { MOCK_QUEUE_ENTRY } from '@/data/mockData';
import type { QueueEntry } from '@shared/types';

function mapRow(row: Record<string, unknown>): QueueEntry {
  return {
    id: row.id as string,
    booking_id: row.booking_id as string,
    center_id: row.center_id as string,
    token_number: row.token_number as string,
    position: Number(row.position),
    farmers_ahead: Number(row.farmers_ahead),
    estimated_wait_minutes: Number(row.estimated_wait_minutes),
    status: row.status as QueueEntry['status'],
    checked_in_at: row.checked_in_at as string | undefined,
    updated_at: row.updated_at as string,
  };
}

export const queueService = {
  /** Get queue entry for the current farmer's booking */
  async getMyQueueEntry(bookingId: string): Promise<QueueEntry | null> {
    if (!isSupabaseConfigured) return MOCK_QUEUE_ENTRY;

    const { data, error } = await supabase
      .from('queue_entries')
      .select('*')
      .eq('booking_id', bookingId)
      .not('status', 'in', '("COMPLETED","CANCELLED")')
      .maybeSingle();

    if (error) {
      console.error('[queueService] getMyQueueEntry error:', error.message);
      return MOCK_QUEUE_ENTRY;
    }
    return data ? mapRow(data as Record<string, unknown>) : null;
  },

  /** Get all active queue entries for a center (officer view) */
  async getCenterQueue(centerId: string): Promise<QueueEntry[]> {
    if (!isSupabaseConfigured) return [MOCK_QUEUE_ENTRY];

    const { data, error } = await supabase
      .from('queue_entries')
      .select('*')
      .eq('center_id', centerId)
      .not('status', 'in', '("COMPLETED","CANCELLED")')
      .order('position');

    if (error) {
      console.error('[queueService] getCenterQueue error:', error.message);
      return [];
    }
    return (data ?? []).map((row) => mapRow(row as Record<string, unknown>));
  },

  /** Subscribe to real-time queue position updates for a booking */
  subscribeToQueueEntry(
    bookingId: string,
    callback: (entry: QueueEntry) => void
  ) {
    if (!isSupabaseConfigured) return { unsubscribe: () => {} };

    const channel = supabase
      .channel(`queue-entry-${bookingId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'queue_entries',
          filter: `booking_id=eq.${bookingId}`,
        },
        (payload) => {
          if (payload.new) {
            callback(mapRow(payload.new as Record<string, unknown>));
          }
        }
      )
      .subscribe();

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      },
    };
  },

  /** Subscribe to all queue updates for a center (officer real-time board) */
  subscribeToCenterQueue(
    centerId: string,
    callback: (entry: QueueEntry, eventType: string) => void
  ) {
    if (!isSupabaseConfigured) return { unsubscribe: () => {} };

    const channel = supabase
      .channel(`center-queue-${centerId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'queue_entries',
          filter: `center_id=eq.${centerId}`,
        },
        (payload) => {
          if (payload.new) {
            callback(
              mapRow(payload.new as Record<string, unknown>),
              payload.eventType
            );
          }
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
