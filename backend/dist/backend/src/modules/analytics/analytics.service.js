"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCenterAnalytics = getCenterAnalytics;
const bookings_service_1 = require("../bookings/bookings.service");
const queue_service_1 = require("../queue/queue.service");
async function getCenterAnalytics(centerId) {
    // 1. Expected Today: Bookings for this center that are active or arrived
    // In demo we count all bookings for today.
    const expected = bookings_service_1.DEMO_BOOKINGS.filter(b => b.center_id === centerId).length || 124; // Mock baseline
    // 2. Arrived/Queue
    const centerQueue = queue_service_1.DEMO_QUEUE.filter(q => q.center_id === centerId);
    const waiting = centerQueue.filter(q => q.status === 'WAITING').length;
    // 3. Procured (For MVP demo, we'll fake some baseline numbers and add dynamic completed queue tokens)
    const completed = centerQueue.filter(q => q.status === 'COMPLETED').length;
    const baselineProcessed = 64;
    const baselineProcuredQtl = 270;
    const fully_processed = baselineProcessed + completed;
    const procured_today_quintals = baselineProcuredQtl + (completed * 40); // approx 40 Qtl per token
    const daily_quota_quintals = 600;
    const capacity_percent = Math.min(100, Math.round((procured_today_quintals / daily_quota_quintals) * 100));
    return {
        center_id: centerId,
        expected_today: expected > baselineProcessed ? expected : baselineProcessed + 22,
        arrived_today: fully_processed + waiting,
        fully_processed,
        currently_waiting: waiting,
        daily_quota_quintals,
        procured_today_quintals,
        capacity_percent,
    };
}
