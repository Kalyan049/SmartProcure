"use strict";
/**
 * SmartProcure Auth Routes — Module 5: Authentication & Role-Based Access
 *
 * Route definitions only. All logic is in auth.controller.ts / auth.service.ts.
 *
 * Public routes (no auth required):
 *   POST /auth/send-otp
 *   POST /auth/verify-otp
 *   POST /auth/register
 *
 * Authenticated routes:
 *   GET  /auth/me
 *   PUT  /auth/profile
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
// ── Public (unauthenticated) routes ──────────────────────────────────────────
router.post('/send-otp', auth_controller_1.AuthController.handleSendOtp);
router.post('/verify-otp', auth_controller_1.AuthController.handleVerifyOtp);
router.post('/register', auth_controller_1.AuthController.handleRegister);
// ── Authenticated routes ─────────────────────────────────────────────────────
router.get('/me', auth_middleware_1.authenticate, auth_controller_1.AuthController.handleGetMe);
router.put('/profile', auth_middleware_1.authenticate, auth_controller_1.AuthController.handleUpdateProfile);
exports.default = router;
