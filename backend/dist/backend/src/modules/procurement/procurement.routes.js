"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEMO_PROCUREMENTS = void 0;
const express_1 = require("express");
const apiResponse_1 = require("../../utils/apiResponse");
exports.DEMO_PROCUREMENTS = [
    {
        id: 'pr-01',
        booking_id: 'bk-1047',
        farmer_id: 'usr-farmer-01',
        center_id: 'ctr-02',
        crop: 'Paddy',
        estimated_quantity_quintals: 40,
        accepted_quantity_quintals: 39.2,
        inspection_status: 'PASSED',
        inspection_notes: 'Clean grain, low foreign matter.',
        grade: 'GRADE_A',
        moisture_percent: 13.5,
        weighing_status: 'PASSED',
        verification_status: 'PASSED',
        status: 'COMPLETED',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date().toISOString(),
    },
];
const router = (0, express_1.Router)();
router.get('/my', (req, res) => {
    return apiResponse_1.ApiResponseHandler.success(res, exports.DEMO_PROCUREMENTS);
});
router.get('/:id', (req, res) => {
    const proc = exports.DEMO_PROCUREMENTS.find((p) => p.id === req.params.id);
    if (!proc)
        return apiResponse_1.ApiResponseHandler.error(res, 'Procurement record not found', 404);
    return apiResponse_1.ApiResponseHandler.success(res, proc);
});
exports.default = router;
