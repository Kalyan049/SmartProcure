import { Router } from 'express';
import { RecommendationController } from './recommendation.controller';
import { authenticateOptional } from '../../middleware/auth.middleware';

const router = Router();

// /recommendation route
router.post('/', authenticateOptional, RecommendationController.calculate);

export default router;
