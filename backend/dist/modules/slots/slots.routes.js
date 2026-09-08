"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEMO_SLOTS = void 0;
const express_1 = require("express");
const apiResponse_1 = require("../../utils/apiResponse");
exports.DEMO_SLOTS = [
    {
        id: 'slt-01',
        center_id: 'ctr-02',
        date: '2026-09-09',
        start_time: '10:00 AM',
        end_time: '11:00 AM',
        capacity: 15,
        booked_count: 5,
        status: 'AVAILABLE',
        created_at: new Date().toISOString(),
    },
    {
        id: 'slt-02',
        center_id: 'ctr-02',
        date: '2026-09-09',
        start_time: '11:00 AM',
        end_time: '12:00 PM',
        capacity: 15,
        booked_count: 8,
        status: 'AVAILABLE',
        created_at: new Date().toISOString(),
    },
    {
        id: 'slt-03',
        center_id: 'ctr-03',
        date: '2026-09-09',
        start_time: '10:30 AM',
        end_time: '11:30 AM',
        capacity: 12,
        booked_count: 3,
        status: 'AVAILABLE',
        created_at: new Date().toISOString(),
    },
];
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    const centerId = req.query.centerId;
    const filtered = centerId ? exports.DEMO_SLOTS.filter((s) => s.center_id === centerId) : exports.DEMO_SLOTS;
    return apiResponse_1.ApiResponseHandler.success(res, filtered);
});
exports.default = router;
