import { Router, Request, Response } from 'express';
import { ApiResponseHandler } from '../../utils/apiResponse';

const router = Router();

router.get('/center/:centerId', (req: Request, res: Response) => {
  return ApiResponseHandler.success(res, {
    centerId: req.params.centerId,
    expectedToday: 124,
    arrived: 86,
    processed: 64,
    waiting: 22,
    capacityPercent: 68,
    cropDistribution: [
      { name: 'Paddy', value: 55, color: '#1E5A3A' },
      { name: 'Wheat', value: 30, color: '#2E8B57' },
      { name: 'Maize', value: 15, color: '#F0A93C' },
    ],
    averageWaitTimeMinutes: 32,
  });
});

export default router;
