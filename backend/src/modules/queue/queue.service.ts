import { QueueEntry, ShouldIGoNowResult } from '../../../../shared/types';
import { supabase, isDatabaseConfigured } from '../../config/supabase';
import { logger } from '../../utils/logger';

// ── Shared In-Memory State for MVP Mock Mode ─────────────────────────────────
export let DEMO_QUEUE: QueueEntry[] = [
  {
    id: 'q-01',
    booking_id: 'bk-1047',
    center_id: 'ctr-02',
    token_number: 'SP-1047',
    position: 7,
    farmers_ahead: 6,
    estimated_wait_minutes: 36,
    status: 'WAITING',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'q-02',
    booking_id: 'bk-1048',
    center_id: 'ctr-02',
    token_number: 'SP-1048',
    position: 8,
    farmers_ahead: 7,
    estimated_wait_minutes: 42,
    status: 'WAITING',
    updated_at: new Date().toISOString(),
  },
];

// In-memory processor rate (mins per farmer)
const PROCESSING_RATE_MINS = 6;

// ── Services ─────────────────────────────────────────────────────────────────

export async function getMyQueueStatus(farmerToken: string): Promise<QueueEntry | null> {
  if (isDatabaseConfigured() && supabase) {
    const { data } = await supabase
      .from('queue_entries')
      .select('*')
      .eq('token_number', farmerToken)
      .single();
    if (data) return data as QueueEntry;
  }
  // We use token_number to identify farmer's queue in the mock since auth mock gives all farmers same ID
  return DEMO_QUEUE.find(q => q.token_number === farmerToken) || DEMO_QUEUE[0] || null;
}

export async function getCenterQueue(centerId: string): Promise<QueueEntry[]> {
  if (isDatabaseConfigured() && supabase) {
    const { data } = await supabase
      .from('queue_entries')
      .select('*')
      .eq('center_id', centerId)
      .order('position', { ascending: true });
    if (data) return data as QueueEntry[];
  }
  return DEMO_QUEUE.filter(q => q.center_id === centerId);
}

/**
 * Simulates an Officer calling the "Next Token"
 * This decreases the position and wait times for everyone else.
 */
export async function advanceCenterQueue(centerId: string): Promise<{ processed: QueueEntry | null, remaining: number }> {
  if (isDatabaseConfigured() && supabase) {
    // In a real DB, this would update the first 'WAITING' token to 'COMPLETED',
    // then trigger a DB function or Realtime event to shift everyone's position down.
    // For MVP we won't fully implement the DB stored procedure here.
    logger.warn('advanceCenterQueue DB mode not fully implemented');
  }

  // ── Mock Logic ──────────────────────────────────────────────
  const centerQueue = DEMO_QUEUE.filter(q => q.center_id === centerId && q.status === 'WAITING').sort((a, b) => a.position - b.position);
  
  if (centerQueue.length === 0) {
    return { processed: null, remaining: 0 };
  }

  // 1. Mark first as processed
  const first = centerQueue[0];
  first.status = 'COMPLETED';
  first.updated_at = new Date().toISOString();

  // 2. Advance everyone else
  const remaining = centerQueue.slice(1);
  remaining.forEach(entry => {
    entry.position -= 1;
    entry.farmers_ahead = Math.max(0, entry.position - 1);
    entry.estimated_wait_minutes = entry.farmers_ahead * PROCESSING_RATE_MINS;
    entry.updated_at = new Date().toISOString();
  });

  return { processed: first, remaining: remaining.length };
}

export async function getShouldIGoNow(farmerToken: string): Promise<ShouldIGoNowResult | null> {
  const current = await getMyQueueStatus(farmerToken);
  if (!current) return null;

  const eta = current.estimated_wait_minutes;
  
  const result: ShouldIGoNowResult = {
    decision: eta <= 30 ? 'GO NOW' : eta <= 60 ? 'PREPARE TO GO' : 'WAIT',
    reason: eta <= 30
      ? 'The queue is moving quickly. Estimated arrival aligns with your slot.'
      : eta <= 60
      ? 'Your turn is approaching in under an hour. Prepare your vehicle and produce.'
      : 'Queue is currently moderate. Please check back in 20 minutes.',
    token_number: current.token_number,
    current_position: current.position,
    farmers_ahead: current.farmers_ahead,
    estimated_wait_minutes: current.estimated_wait_minutes,
    center_load_percent: 45,
    recommended_departure_time: '10:15 AM', // static mock
    estimated_arrival_time: '10:35 AM',     // static mock
    center_name: 'Rohania Agribusiness Center B',
    center_location: { lat: 25.2677, lng: 82.9234 },
    last_updated: current.updated_at,
  };

  return result;
}
