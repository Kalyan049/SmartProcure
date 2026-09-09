"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEMO_PAYMENTS = void 0;
exports.generatePaymentForProcurement = generatePaymentForProcurement;
exports.getMyPayments = getMyPayments;
const notifications_service_1 = require("../notifications/notifications.service");
exports.DEMO_PAYMENTS = [];
async function generatePaymentForProcurement(procurement) {
    // Check if payment already exists
    const existing = exports.DEMO_PAYMENTS.find(p => p.procurement_id === procurement.id);
    if (existing)
        return existing;
    const mspRate = procurement.grade === 'GRADE_A' ? 2300 : 2200;
    const qty = procurement.accepted_quantity_quintals || procurement.estimated_quantity_quintals;
    const gross = qty * mspRate;
    // Simulated deductions (e.g. 1% handling, MVP mockup)
    const net = gross * 0.99;
    const payment = {
        id: `pay-${Math.random().toString(36).substring(7)}`,
        procurement_id: procurement.id,
        farmer_id: procurement.farmer_id,
        transaction_ref: `DBT-DEMO-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
        crop: procurement.crop,
        grade: procurement.grade || 'GRADE_A',
        quantity_quintals: qty,
        msp_rate_per_quintal: mspRate,
        gross_amount: gross,
        net_amount: net,
        status: 'PROCESSING',
        is_demo: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
    exports.DEMO_PAYMENTS.push(payment);
    // Dispatch Notification
    await notifications_service_1.notificationService.dispatch(procurement.farmer_id, 'Payment Processing Initiated', `Simulated DBT payment of ₹${net.toLocaleString()} for ${qty} Qtl ${procurement.crop} has been initiated.`, 'INFO');
    // Simulate payment completion after 10 seconds for the demo
    setTimeout(async () => {
        payment.status = 'CREDITED';
        payment.updated_at = new Date().toISOString();
        await notifications_service_1.notificationService.dispatch(procurement.farmer_id, 'Payment Credited', `Simulated DBT payment of ₹${net.toLocaleString()} has been credited to your registered account.`, 'SUCCESS');
    }, 10000);
    return payment;
}
async function getMyPayments(farmerId) {
    return exports.DEMO_PAYMENTS.filter(p => p.farmer_id === farmerId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}
