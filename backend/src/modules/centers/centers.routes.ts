/**
 * SmartProcure Centers Routes — Module 7: Procurement Center Discovery
 */

import { Router } from 'express';
import { CentersController } from './centers.controller';
import { authenticateOptional } from '../../middleware/auth.middleware';

const router = Router();

// We use authenticateOptional if we want to allow public viewing of centers, 
// but still get the farmer ID if logged in to calculate deterministic distances.
router.get('/', authenticateOptional, CentersController.listCenters);
router.get('/:id', authenticateOptional, CentersController.getCenterDetail);
router.get('/:id/capacity', authenticateOptional, CentersController.getCenterCapacity);

export default router;
