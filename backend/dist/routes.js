"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const farmers_routes_1 = __importDefault(require("./modules/farmers/farmers.routes"));
const centers_routes_1 = __importDefault(require("./modules/centers/centers.routes"));
const slots_routes_1 = __importDefault(require("./modules/slots/slots.routes"));
const bookings_routes_1 = __importDefault(require("./modules/bookings/bookings.routes"));
const recommendation_routes_1 = __importDefault(require("./modules/recommendation/recommendation.routes"));
const queue_routes_1 = __importDefault(require("./modules/queue/queue.routes"));
const procurement_routes_1 = __importDefault(require("./modules/procurement/procurement.routes"));
const payments_routes_1 = __importDefault(require("./modules/payments/payments.routes"));
const notifications_routes_1 = __importDefault(require("./modules/notifications/notifications.routes"));
const voice_routes_1 = __importDefault(require("./modules/voice-agent/voice.routes"));
const grievances_routes_1 = __importDefault(require("./modules/grievances/grievances.routes"));
const analytics_routes_1 = __importDefault(require("./modules/analytics/analytics.routes"));
const apiResponse_1 = require("./utils/apiResponse");
const router = (0, express_1.Router)();
// Health Check Endpoint
router.get('/health', (req, res) => {
    return apiResponse_1.ApiResponseHandler.success(res, {
        status: 'HEALTHY',
        service: 'SmartProcure API & Coordination Engine',
        version: '3.0.0',
        timestamp: new Date().toISOString(),
        uptimeSeconds: Math.floor(process.uptime()),
    });
});
// Modular Domain Route Mounts
router.use('/auth', auth_routes_1.default);
router.use('/farmers', farmers_routes_1.default);
router.use('/centers', centers_routes_1.default);
router.use('/slots', slots_routes_1.default);
router.use('/bookings', bookings_routes_1.default);
router.use('/recommendation', recommendation_routes_1.default);
router.use('/queue', queue_routes_1.default);
router.use('/procurement', procurement_routes_1.default);
router.use('/payments', payments_routes_1.default);
router.use('/notifications', notifications_routes_1.default);
router.use('/voice', voice_routes_1.default);
router.use('/grievances', grievances_routes_1.default);
router.use('/analytics', analytics_routes_1.default);
exports.default = router;
