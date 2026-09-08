"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEMO_QUEUE = void 0;
const express_1 = require("express");
const apiResponse_1 = require("../../utils/apiResponse");
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
const router = (0, express_1.Router)();
router.get('/my', (req, res) => {
    return apiResponse_1.ApiResponseHandler.success(res, exports.DEMO_QUEUE[0]);
});
router.get('/should-i-go-now', (req, res) => {
    const current = exports.DEMO_QUEUE[0];
    const eta = current.estimated_wait_minutes;
    const result = {
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
        recommended_departure_time: '10:15 AM',
        estimated_arrival_time: '10:35 AM',
        center_name: 'Rohania Agribusiness Center B',
        center_location: { lat: 25.2677, lng: 82.9234 },
        last_updated: new Date().toISOString(),
    };
    return apiResponse_1.ApiResponseHandler.success(res, result);
});
router.get('/center/:centerId', (req, res) => {
    const filtered = exports.DEMO_QUEUE.filter((q) => q.center_id === req.params.centerId);
    return apiResponse_1.ApiResponseHandler.success(res, filtered);
});
exports.default = router;
