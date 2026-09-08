"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEMO_PAYMENTS = void 0;
const express_1 = require("express");
const apiResponse_1 = require("../../utils/apiResponse");
exports.DEMO_PAYMENTS = [
    {
        id: 'pay-10291',
        procurement_id: 'pr-01',
        farmer_id: 'usr-farmer-01',
        crop: 'Paddy (Grade A)',
        accepted_quantity_quintals: 39.2,
        rate_per_quintal: 2300,
        gross_amount: 90160,
        deductions_amount: 560,
        net_amount: 89600,
        status: 'CREDITED',
        transaction_reference: 'DBT-GOV-2026-99214',
        bank_account_masked: 'XXXXXX5892',
        credited_date: '2026-09-08',
        created_at: new Date(Date.now() - 3600000).toISOString(),
    },
];
const router = (0, express_1.Router)();
router.get('/my', (req, res) => {
    return apiResponse_1.ApiResponseHandler.success(res, exports.DEMO_PAYMENTS);
});
router.get('/:id', (req, res) => {
    const pay = exports.DEMO_PAYMENTS.find((p) => p.id === req.params.id);
    if (!pay)
        return apiResponse_1.ApiResponseHandler.error(res, 'Payment not found', 404);
    return apiResponse_1.ApiResponseHandler.success(res, pay);
});
exports.default = router;
