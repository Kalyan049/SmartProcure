import { Router, Request, Response } from 'express';
import { ApiResponseHandler } from '../../utils/apiResponse';
import { Grievance } from '../../../../shared/types';

export const DEMO_GRIEVANCES: Grievance[] = [
  {
    id: 'grv-01',
    farmer_id: 'usr-farmer-01',
    booking_id: 'bk-1047',
    category: 'QUEUE_DELAY',
    title: 'Moisture testing delay at Center B',
    description: 'Waited 45 minutes past appointment for moisture meter calibration.',
    status: 'SUBMITTED',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const router = Router();

router.get('/my', (req: Request, res: Response) => {
  return ApiResponseHandler.success(res, DEMO_GRIEVANCES);
});

router.post('/', (req: Request, res: Response) => {
  const { category = 'OTHER', title, description } = req.body;
  const newGrievance: Grievance = {
    id: `grv-${Date.now().toString().slice(-4)}`,
    farmer_id: 'usr-farmer-01',
    category,
    title: title || 'Farmer Grievance',
    description: description || 'No details provided',
    status: 'SUBMITTED',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  DEMO_GRIEVANCES.unshift(newGrievance);
  return ApiResponseHandler.success(res, newGrievance, 'Grievance submitted successfully', 201);
});

export default router;
