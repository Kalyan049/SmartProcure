"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analytics_controller_1 = require("./analytics.controller");
const router = (0, express_1.Router)();
router.get('/center/:id', analytics_controller_1.AnalyticsController.getCenterAnalytics);
exports.default = router;
