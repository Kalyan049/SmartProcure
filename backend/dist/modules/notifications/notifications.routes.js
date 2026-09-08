"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEMO_NOTIFICATIONS = void 0;
const express_1 = require("express");
const apiResponse_1 = require("../../utils/apiResponse");
exports.DEMO_NOTIFICATIONS = [
    {
        id: 'notif-01',
        user_id: 'usr-farmer-01',
        type: 'SLOT_CONFIRMED',
        title: 'Slot Confirmed',
        message: 'Your slot for Paddy at Center B is confirmed for 10:30 AM.',
        is_read: false,
        action_target: '/farmer/queue',
        created_at: new Date(Date.now() - 600000).toISOString(),
    },
    {
        id: 'notif-02',
        user_id: 'usr-farmer-01',
        type: 'PAYMENT_CREDITED',
        title: 'Payment Credited',
        message: '₹89,600 has been credited via DBT for Procurement PR-01.',
        is_read: true,
        action_target: '/farmer/payments',
        created_at: new Date(Date.now() - 7200000).toISOString(),
    },
];
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    return apiResponse_1.ApiResponseHandler.success(res, exports.DEMO_NOTIFICATIONS);
});
router.put('/:id/read', (req, res) => {
    const notif = exports.DEMO_NOTIFICATIONS.find((n) => n.id === req.params.id);
    if (notif)
        notif.is_read = true;
    return apiResponse_1.ApiResponseHandler.success(res, { id: req.params.id, is_read: true });
});
exports.default = router;
