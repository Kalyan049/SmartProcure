"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEMO_GRIEVANCES = void 0;
const express_1 = require("express");
const apiResponse_1 = require("../../utils/apiResponse");
exports.DEMO_GRIEVANCES = [
    {
        id: 'grv-01',
        farmer_id: 'usr-farmer-01',
        booking_id: 'bk-1047',
        category: 'QUEUE_DELAY',
        title: 'Moisture testing delay at Center B',
        description: 'Waited 45 minutes past appointment for moisture meter calibration.',
        status: 'SUBMITTED',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
];
const router = (0, express_1.Router)();
router.get('/my', (req, res) => {
    return apiResponse_1.ApiResponseHandler.success(res, exports.DEMO_GRIEVANCES);
});
router.post('/', (req, res) => {
    const { category = 'OTHER', title, description } = req.body;
    const newGrievance = {
        id: `grv-${Date.now().toString().slice(-4)}`,
        farmer_id: 'usr-farmer-01',
        category,
        title: title || 'Farmer Grievance',
        description: description || 'No details provided',
        status: 'SUBMITTED',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
    exports.DEMO_GRIEVANCES.unshift(newGrievance);
    return apiResponse_1.ApiResponseHandler.success(res, newGrievance, 'Grievance submitted successfully', 201);
});
exports.default = router;
