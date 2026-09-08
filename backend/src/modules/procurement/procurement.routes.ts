import { Router, Request, Response } from 'express';
import { ApiResponseHandler } from '../../utils/apiResponse';
import { Procurement } from '../../../../shared/types';

export const DEMO_PROCUREMENTS: Procurement[] = [
  {
    id: 'pr-01',
    booking_id: 'bk-1047',
    farmer_id: 'usr-farmer-01',
    center_id: 'ctr-02',
    crop: 'Paddy',
    estimated_quantity_quintals: 40,
    accepted_quantity_quintals: 39.2,
    inspection_status: 'PASSED',
    inspection_notes: 'Clean grain, low foreign matter.',
    grade: 'GRADE_A',
    moisture_percent: 13.5,
    weighing_status: 'PASSED',
    verification_status: 'PASSED',
    status: 'COMPLETED',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const router = Router();

router.get('/my', (req: Request, res: Response) => {
  return ApiResponseHandler.success(res, DEMO_PROCUREMENTS);
});

router.get('/:id', (req: Request, res: Response) => {
  const proc = DEMO_PROCUREMENTS.find((p) => p.id === req.params.id);
  if (!proc) return ApiResponseHandler.error(res, 'Procurement record not found', 404);
  return ApiResponseHandler.success(res, proc);
});

export default router;
