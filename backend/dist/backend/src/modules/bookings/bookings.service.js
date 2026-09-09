"use strict";
/**
 * SmartProcure Bookings Service — Module 9: Slot Booking & Token Generation
 *
 * Handles slot availability, duplicate prevention, booking creation,
 * token generation, queue entry, and notification dispatch.
 * Backend is the single source of truth for all booking operations.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEMO_QUEUE = exports.DEMO_BOOKINGS = void 0;
exports.getAvailableSlots = getAvailableSlots;
exports.checkDuplicateBooking = checkDuplicateBooking;
exports.createBooking = createBooking;
exports.getMyBookings = getMyBookings;
exports.getBookingById = getBookingById;
const supabase_1 = require("../../config/supabase");
const logger_1 = require("../../utils/logger");
const slots_routes_1 = require("../slots/slots.routes");
// ── In-memory stores (MVP fallback when DB is not configured) ───────────────
exports.DEMO_BOOKINGS = [
    {
        id: 'bk-1047',
        farmer_id: 'usr-farmer-demo-01',
        center_id: 'ctr-02',
        slot_id: 'slt-01',
        crop: 'Paddy',
        quantity_quintals: 40,
        token_number: 'SP-1047',
        qr_code_payload: 'SP:BK1047:F01:C02:PADDY:40',
        status: 'CONFIRMED',
        created_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    },
];
exports.DEMO_QUEUE = [
    {
        id: 'qe-1047',
        booking_id: 'bk-1047',
        center_id: 'ctr-02',
        token_number: 'SP-1047',
        position: 12,
        farmers_ahead: 11,
        estimated_wait_minutes: 35,
        status: 'WAITING',
        updated_at: new Date().toISOString(),
    },
];
// In-memory slot tracking (augments DEMO_SLOTS)
const slotBookedCounts = {};
function getEffectiveBookedCount(slotId, baseCount) {
    return (slotBookedCounts[slotId] ?? baseCount);
}
function generateToken() {
    const num = Math.floor(1000 + Math.random() * 9000);
    return `SP-${num}`;
}
function generateQrPayload(bookingId, farmerId, centerId, crop, qty) {
    return `SP:${bookingId}:${farmerId}:${centerId}:${crop.toUpperCase()}:${qty}`;
}
// ── Service Functions ────────────────────────────────────────────────────────
async function getAvailableSlots(centerId, date) {
    if ((0, supabase_1.isDatabaseConfigured)() && supabase_1.supabase) {
        const { data, error } = await supabase_1.supabase
            .from('slots')
            .select('*')
            .eq('center_id', centerId)
            .eq('date', date)
            .neq('status', 'CANCELLED')
            .order('start_time');
        if (!error && data)
            return data;
    }
    // Mock: return slots for the center, filtering by date (demo uses today's date)
    const today = new Date().toISOString().split('T')[0];
    const baseSlots = slots_routes_1.DEMO_SLOTS.filter(s => s.center_id === centerId);
    return baseSlots.map(slot => ({
        ...slot,
        date,
        booked_count: getEffectiveBookedCount(slot.id, slot.booked_count),
        status: getEffectiveBookedCount(slot.id, slot.booked_count) >= slot.capacity ? 'FULL' : 'AVAILABLE',
    }));
}
async function checkDuplicateBooking(farmerId, date, centerId) {
    if ((0, supabase_1.isDatabaseConfigured)() && supabase_1.supabase) {
        const { data } = await supabase_1.supabase
            .from('bookings')
            .select('*, slots!inner(date, center_id)')
            .eq('farmer_id', farmerId)
            .eq('slots.center_id', centerId)
            .neq('status', 'CANCELLED')
            .limit(1)
            .single();
        if (data)
            return data;
    }
    // Mock duplicate check
    return exports.DEMO_BOOKINGS.find(b => b.farmer_id === farmerId && b.center_id === centerId && b.status !== 'CANCELLED') || null;
}
async function createBooking(input) {
    const { farmerId, centerId, slotId, crop, quantityQuintals, date } = input;
    // 1. Verify slot still available
    const slots = await getAvailableSlots(centerId, date);
    const slot = slots.find(s => s.id === slotId);
    if (!slot) {
        throw new Error('SLOT_NOT_FOUND: The selected slot does not exist.');
    }
    if (slot.status === 'FULL' || slot.booked_count >= slot.capacity) {
        throw new Error('SLOT_FULL: This slot is now at full capacity. Please choose another slot.');
    }
    if (slot.status === 'CANCELLED') {
        throw new Error('SLOT_CANCELLED: This slot has been cancelled. Please choose another slot.');
    }
    // 2. Check for duplicate booking
    const existing = await checkDuplicateBooking(farmerId, date, centerId);
    if (existing) {
        throw new Error(`DUPLICATE_BOOKING: You already have an active booking (${existing.token_number}) at this center. Cancel it before creating a new one.`);
    }
    const bookingId = `bk-${Date.now().toString().slice(-6)}`;
    const tokenNumber = generateToken();
    const qrPayload = generateQrPayload(bookingId, farmerId, centerId, crop, quantityQuintals);
    // 3. Persist booking
    const booking = {
        id: bookingId,
        farmer_id: farmerId,
        center_id: centerId,
        slot_id: slotId,
        crop,
        quantity_quintals: quantityQuintals,
        token_number: tokenNumber,
        qr_code_payload: qrPayload,
        status: 'CONFIRMED',
        created_at: new Date().toISOString(),
    };
    if ((0, supabase_1.isDatabaseConfigured)() && supabase_1.supabase) {
        const { error } = await supabase_1.supabase.from('bookings').insert(booking);
        if (error) {
            logger_1.logger.error('[Bookings] DB insert failed:', error);
            throw new Error('BOOKING_FAILED: Failed to create booking. Please try again.');
        }
        // Decrement slot availability in DB
        const { error: slotErr } = await supabase_1.supabase.rpc('increment_slot_booked_count', {
            p_center_id: centerId,
            p_date: date,
            p_time_slot: slotId
        });
        if (slotErr) {
            logger_1.logger.error('Failed to update slot count: ' + slotErr.message);
        }
    }
    else {
        // Mock: update in-memory slot count
        slotBookedCounts[slotId] = getEffectiveBookedCount(slotId, slot.booked_count) + 1;
        exports.DEMO_BOOKINGS.unshift(booking);
    }
    // 4. Create queue entry
    const existingQueueAtCenter = exports.DEMO_QUEUE.filter(q => q.center_id === centerId && q.status === 'WAITING');
    const queuePosition = existingQueueAtCenter.length + 1;
    const farmersAhead = queuePosition - 1;
    const processingRateMin = 6; // Default; ideally fetched from center
    const estimatedWaitMinutes = farmersAhead * processingRateMin;
    const queueEntry = {
        id: `qe-${bookingId}`,
        booking_id: bookingId,
        center_id: centerId,
        token_number: tokenNumber,
        position: queuePosition,
        farmers_ahead: farmersAhead,
        estimated_wait_minutes: estimatedWaitMinutes,
        status: 'WAITING',
        updated_at: new Date().toISOString(),
    };
    if ((0, supabase_1.isDatabaseConfigured)() && supabase_1.supabase) {
        await supabase_1.supabase.from('queue_entries').insert(queueEntry).catch(err => logger_1.logger.warn('[Bookings] Queue entry insert failed (non-fatal):', err));
    }
    else {
        exports.DEMO_QUEUE.push(queueEntry);
    }
    logger_1.logger.info(`[Bookings] Created booking ${bookingId}, token ${tokenNumber} for farmer ${farmerId}`);
    return { booking, queueEntry };
}
async function getMyBookings(farmerId) {
    if ((0, supabase_1.isDatabaseConfigured)() && supabase_1.supabase) {
        const { data, error } = await supabase_1.supabase
            .from('bookings')
            .select('*')
            .eq('farmer_id', farmerId)
            .order('created_at', { ascending: false });
        if (!error && data)
            return data;
    }
    return exports.DEMO_BOOKINGS.filter(b => b.farmer_id === farmerId);
}
async function getBookingById(bookingId) {
    if ((0, supabase_1.isDatabaseConfigured)() && supabase_1.supabase) {
        const { data } = await supabase_1.supabase.from('bookings').select('*').eq('id', bookingId).single();
        if (data)
            return data;
    }
    return exports.DEMO_BOOKINGS.find(b => b.id === bookingId) || null;
}
