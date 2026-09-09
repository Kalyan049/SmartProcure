import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';

const router = Router();

router.get('/center/:id', AnalyticsController.getCenterAnalytics);

export default router;
