/**
 * SmartProcure Farmers Routes — Module 6: Farmer Profile
 */

import { Router } from 'express';
import { FarmersController } from './farmers.controller';

const router = Router();

// These routes assume `authenticate` middleware is applied globally before them in routes.ts
router.get('/me', FarmersController.getProfile);
router.put('/me', FarmersController.updateProfile);

// History endpoints
router.get('/me/history/bookings', FarmersController.getBookingHistory);
router.get('/me/history/procurement', FarmersController.getProcurementHistory);
router.get('/me/history/payments', FarmersController.getPaymentHistory);

export default router;
