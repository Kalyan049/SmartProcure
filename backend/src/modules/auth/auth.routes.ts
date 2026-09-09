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

import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

// ── Public (unauthenticated) routes ──────────────────────────────────────────
router.post('/send-otp', AuthController.handleSendOtp);
router.post('/verify-otp', AuthController.handleVerifyOtp);
router.post('/register', AuthController.handleRegister);

// ── Authenticated routes ─────────────────────────────────────────────────────
router.get('/me', authenticate, AuthController.handleGetMe);
router.put('/profile', authenticate, AuthController.handleUpdateProfile);

export default router;
