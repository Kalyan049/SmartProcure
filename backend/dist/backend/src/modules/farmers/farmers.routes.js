"use strict";
/**
 * SmartProcure Farmers Routes — Module 6: Farmer Profile
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const farmers_controller_1 = require("./farmers.controller");
const router = (0, express_1.Router)();
// These routes assume `authenticate` middleware is applied globally before them in routes.ts
router.get('/me', farmers_controller_1.FarmersController.getProfile);
router.put('/me', farmers_controller_1.FarmersController.updateProfile);
// History endpoints
router.get('/me/history/bookings', farmers_controller_1.FarmersController.getBookingHistory);
router.get('/me/history/procurement', farmers_controller_1.FarmersController.getProcurementHistory);
router.get('/me/history/payments', farmers_controller_1.FarmersController.getPaymentHistory);
exports.default = router;
