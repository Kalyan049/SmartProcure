"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEMO_QUEUE = void 0;
exports.getMyQueueStatus = getMyQueueStatus;
exports.getCenterQueue = getCenterQueue;
exports.advanceCenterQueue = advanceCenterQueue;
exports.getShouldIGoNow = getShouldIGoNow;
const supabase_1 = require("../../config/supabase");
const logger_1 = require("../../utils/logger");
// ── Shared In-Memory State for MVP Mock Mode ─────────────────────────────────
exports.DEMO_QUEUE = [
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
async function getMyQueueStatus(farmerToken) {
    if ((0, supabase_1.isDatabaseConfigured)() && supabase_1.supabase) {
        const { data } = await supabase_1.supabase
            .from('queue_entries')
            .select('*')
            .eq('token_number', farmerToken)
            .single();
        if (data)
            return data;
    }
    // We use token_number to identify farmer's queue in the mock since auth mock gives all farmers same ID
    return exports.DEMO_QUEUE.find(q => q.token_number === farmerToken) || exports.DEMO_QUEUE[0] || null;
}
async function getCenterQueue(centerId) {
    if ((0, supabase_1.isDatabaseConfigured)() && supabase_1.supabase) {
        const { data } = await supabase_1.supabase
            .from('queue_entries')
            .select('*')
            .eq('center_id', centerId)
            .order('position', { ascending: true });
        if (data)
            return data;
    }
    return exports.DEMO_QUEUE.filter(q => q.center_id === centerId);
}
/**
 * Simulates an Officer calling the "Next Token"
 * This decreases the position and wait times for everyone else.
 */
async function advanceCenterQueue(centerId) {
    if ((0, supabase_1.isDatabaseConfigured)() && supabase_1.supabase) {
        // In a real DB, this would update the first 'WAITING' token to 'COMPLETED',
        // then trigger a DB function or Realtime event to shift everyone's position down.
        // For MVP we won't fully implement the DB stored procedure here.
        logger_1.logger.warn('advanceCenterQueue DB mode not fully implemented');
    }
    // ── Mock Logic ──────────────────────────────────────────────
    const centerQueue = exports.DEMO_QUEUE.filter(q => q.center_id === centerId && q.status === 'WAITING').sort((a, b) => a.position - b.position);
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
async function getShouldIGoNow(farmerToken) {
    const currentQueue = await getMyQueueStatus(farmerToken);
    // Default fallback center info (MVP)
    const center_name = 'Rohania Agribusiness Center B';
    const center_location = { lat: 25.2677, lng: 82.9234 };
    // Rule 1: No Booking
    if (!currentQueue || currentQueue.status === 'COMPLETED' || currentQueue.status === 'CANCELLED') {
        return {
            decision: 'DO NOT GO', // Maps to BOOK A SLOT visually on frontend or similar
            reason: 'You do not have an active booking or queue token. Please book a slot first.',
            token_number: farmerToken,
            current_position: 0,
            farmers_ahead: 0,
            estimated_wait_minutes: 0,
            center_load_percent: 0,
            recommended_departure_time: '—',
            estimated_arrival_time: '—',
            center_name,
            center_location,
            last_updated: new Date().toISOString(),
        };
    }
    // Get mocked center data for the rules
    const isCenterClosed = false; // Mock
    const centerLoadPercent = currentQueue.center_id === 'ctr-02' ? 45 : 95; // Mock
    // Rule 2: Center Closed
    if (isCenterClosed) {
        return {
            decision: 'DO NOT GO',
            reason: 'The procurement center is currently closed. Do not proceed.',
            token_number: currentQueue.token_number,
            current_position: currentQueue.position,
            farmers_ahead: currentQueue.farmers_ahead,
            estimated_wait_minutes: currentQueue.estimated_wait_minutes,
            center_load_percent: centerLoadPercent,
            recommended_departure_time: '—',
            estimated_arrival_time: '—',
            center_name,
            center_location,
            last_updated: currentQueue.updated_at,
        };
    }
    // Rule 3: Critical Queue
    if (centerLoadPercent >= 95) {
        return {
            decision: 'WAIT',
            reason: 'Center is experiencing critical load and delays. Please delay your departure.',
            token_number: currentQueue.token_number,
            current_position: currentQueue.position,
            farmers_ahead: currentQueue.farmers_ahead,
            estimated_wait_minutes: currentQueue.estimated_wait_minutes,
            center_load_percent: centerLoadPercent,
            recommended_departure_time: 'Check back later',
            estimated_arrival_time: '—',
            center_name,
            center_location,
            last_updated: currentQueue.updated_at,
        };
    }
    // Real-time calculation logic
    const eta = currentQueue.estimated_wait_minutes;
    let decision = 'WAIT';
    let reason = '';
    // Rule 4, 5, 6: ETA Based
    if (eta <= 30) {
        decision = 'GO NOW';
        reason = 'The queue is moving quickly. Estimated arrival aligns with your slot.';
    }
    else if (eta <= 60) {
        decision = 'PREPARE TO GO';
        reason = 'Your turn is approaching in under an hour. Prepare your vehicle and produce.';
    }
    else {
        decision = 'WAIT';
        reason = 'Queue is currently moderate. Please check back later.';
    }
    // Calculate mock times based on ETA
    const now = new Date();
    const travelTimeMins = 15; // mock 15 mins travel
    const recommendedMins = Math.max(0, eta - travelTimeMins);
    const departureTime = new Date(now.getTime() + recommendedMins * 60000);
    const arrivalTime = new Date(departureTime.getTime() + travelTimeMins * 60000);
    const timeString = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return {
        decision,
        reason,
        token_number: currentQueue.token_number,
        current_position: currentQueue.position,
        farmers_ahead: currentQueue.farmers_ahead,
        estimated_wait_minutes: currentQueue.estimated_wait_minutes,
        center_load_percent: centerLoadPercent,
        recommended_departure_time: timeString(departureTime),
        estimated_arrival_time: timeString(arrivalTime),
        center_name,
        center_location,
        last_updated: currentQueue.updated_at,
    };
}
