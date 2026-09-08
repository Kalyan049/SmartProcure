"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEMO_BOOKINGS = void 0;
const express_1 = require("express");
const apiResponse_1 = require("../../utils/apiResponse");
exports.DEMO_BOOKINGS = [
    {
        id: 'bk-1047',
        farmer_id: 'usr-farmer-01',
        center_id: 'ctr-02',
        slot_id: 'slt-01',
        crop: 'Paddy',
        quantity_quintals: 40,
        token_number: 'SP-1047',
        qr_code_payload: 'SP:BK1047:F01:C02:PADDY:40',
        status: 'CONFIRMED',
        created_at: new Date().toISOString(),
    },
];
const router = (0, express_1.Router)();
router.get('/my', (req, res) => {
    return apiResponse_1.ApiResponseHandler.success(res, exports.DEMO_BOOKINGS);
});
router.post('/', (req, res) => {
    const { crop = 'Paddy', quantity = 40, centerId = 'ctr-02', slotId = 'slt-01' } = req.body;
    const newBooking = {
        id: `bk-${Date.now().toString().slice(-4)}`,
        farmer_id: 'usr-farmer-01',
        center_id: centerId,
        slot_id: slotId,
        crop,
        quantity_quintals: Number(quantity),
        token_number: `SP-${Math.floor(1000 + Math.random() * 9000)}`,
        qr_code_payload: `SP:NEW:${crop}:${quantity}`,
        status: 'CONFIRMED',
        created_at: new Date().toISOString(),
    };
    exports.DEMO_BOOKINGS.unshift(newBooking);
    return apiResponse_1.ApiResponseHandler.success(res, newBooking, 'Slot booked successfully', 201);
});
router.get('/:id', (req, res) => {
    const booking = exports.DEMO_BOOKINGS.find((b) => b.id === req.params.id);
    if (!booking)
        return apiResponse_1.ApiResponseHandler.error(res, 'Booking not found', 404);
    return apiResponse_1.ApiResponseHandler.success(res, booking);
});
exports.default = router;
