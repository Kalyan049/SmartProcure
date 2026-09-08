import { Router } from 'express';
import authRoutes from './modules/auth/auth.routes';
import farmersRoutes from './modules/farmers/farmers.routes';
import centersRoutes from './modules/centers/centers.routes';
import slotsRoutes from './modules/slots/slots.routes';
import bookingsRoutes from './modules/bookings/bookings.routes';
import recommendationRoutes from './modules/recommendation/recommendation.routes';
import queueRoutes from './modules/queue/queue.routes';
import procurementRoutes from './modules/procurement/procurement.routes';
import paymentsRoutes from './modules/payments/payments.routes';
import notificationsRoutes from './modules/notifications/notifications.routes';
import voiceRoutes from './modules/voice-agent/voice.routes';
import grievancesRoutes from './modules/grievances/grievances.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import { ApiResponseHandler } from './utils/apiResponse';

const router = Router();

// Health Check Endpoint
router.get('/health', (req, res) => {
  return ApiResponseHandler.success(res, {
    status: 'HEALTHY',
    service: 'SmartProcure API & Coordination Engine',
    version: '3.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

// Modular Domain Route Mounts
router.use('/auth', authRoutes);
router.use('/farmers', farmersRoutes);
router.use('/centers', centersRoutes);
router.use('/slots', slotsRoutes);
router.use('/bookings', bookingsRoutes);
router.use('/recommendation', recommendationRoutes);
router.use('/queue', queueRoutes);
router.use('/procurement', procurementRoutes);
router.use('/payments', paymentsRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/voice', voiceRoutes);
router.use('/grievances', grievancesRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
