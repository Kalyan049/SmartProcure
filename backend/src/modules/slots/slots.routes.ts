import { Router, Request, Response } from 'express';
import { ApiResponseHandler } from '../../utils/apiResponse';
import { Slot } from '../../../../shared/types';

export const DEMO_SLOTS: Slot[] = [
  {
    id: 'slt-01',
    center_id: 'ctr-02',
    date: '2026-09-09',
    start_time: '10:00 AM',
    end_time: '11:00 AM',
    capacity: 15,
    booked_count: 5,
    status: 'AVAILABLE',
    created_at: new Date().toISOString(),
  },
  {
    id: 'slt-02',
    center_id: 'ctr-02',
    date: '2026-09-09',
    start_time: '11:00 AM',
    end_time: '12:00 PM',
    capacity: 15,
    booked_count: 8,
    status: 'AVAILABLE',
    created_at: new Date().toISOString(),
  },
  {
    id: 'slt-03',
    center_id: 'ctr-03',
    date: '2026-09-09',
    start_time: '10:30 AM',
    end_time: '11:30 AM',
    capacity: 12,
    booked_count: 3,
    status: 'AVAILABLE',
    created_at: new Date().toISOString(),
  },
];

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const centerId = req.query.centerId as string;
  const filtered = centerId ? DEMO_SLOTS.filter((s) => s.center_id === centerId) : DEMO_SLOTS;
  return ApiResponseHandler.success(res, filtered);
});

export default router;
