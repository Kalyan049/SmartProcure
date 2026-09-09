import { Router } from 'express';
import { QueueController } from './queue.controller';
import { requireRole } from '../../middleware/auth.middleware';

const router = Router();

// Farmer Endpoints
router.get('/my', QueueController.getMyQueue);
router.get('/should-i-go-now', QueueController.getShouldIGoNow);

// Officer Endpoints
router.get('/center/:centerId', QueueController.getCenterQueue);
router.post('/advance', QueueController.advanceQueue);

export default router;
