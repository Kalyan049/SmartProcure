"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const apiResponse_1 = require("../../utils/apiResponse");
const router = (0, express_1.Router)();
router.get('/center/:centerId', (req, res) => {
    return apiResponse_1.ApiResponseHandler.success(res, {
        centerId: req.params.centerId,
        expectedToday: 124,
        arrived: 86,
        processed: 64,
        waiting: 22,
        capacityPercent: 68,
        cropDistribution: [
            { name: 'Paddy', value: 55, color: '#1E5A3A' },
            { name: 'Wheat', value: 30, color: '#2E8B57' },
            { name: 'Maize', value: 15, color: '#F0A93C' },
        ],
        averageWaitTimeMinutes: 32,
    });
});
exports.default = router;
