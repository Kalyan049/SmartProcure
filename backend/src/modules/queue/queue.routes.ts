import { Router, Request, Response } from 'express';
import { ApiResponseHandler } from '../../utils/apiResponse';
import { QueueEntry, ShouldIGoNowResult } from '../../../../shared/types';

export const DEMO_QUEUE: QueueEntry[] = [
  {
    id: 'q-01',
    booking_id: 'bk-1047',
    center_id: 'ctr-02',
    token_number: 'SP-1047',
    position: 7,
    farmers_ahead: 6,
    estimated_wait_minutes: 36,
    status: 'WAITING',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'q-02',
    booking_id: 'bk-1048',
    center_id: 'ctr-02',
    token_number: 'SP-1048',
    position: 8,
    farmers_ahead: 7,
    estimated_wait_minutes: 42,
    status: 'WAITING',
    updated_at: new Date().toISOString(),
  },
];

const router = Router();

router.get('/my', (req: Request, res: Response) => {
  return ApiResponseHandler.success(res, DEMO_QUEUE[0]);
});

router.get('/should-i-go-now', (req: Request, res: Response) => {
  const current = DEMO_QUEUE[0];
  const eta = current.estimated_wait_minutes;
  
  const result: ShouldIGoNowResult = {
    decision: eta <= 30 ? 'GO NOW' : eta <= 60 ? 'PREPARE TO GO' : 'WAIT',
    reason: eta <= 30
      ? 'The queue is moving quickly. Estimated arrival aligns with your slot.'
      : eta <= 60
      ? 'Your turn is approaching in under an hour. Prepare your vehicle and produce.'
      : 'Queue is currently moderate. Please check back in 20 minutes.',
    token_number: current.token_number,
    current_position: current.position,
    farmers_ahead: current.farmers_ahead,
    estimated_wait_minutes: current.estimated_wait_minutes,
    center_load_percent: 45,
    recommended_departure_time: '10:15 AM',
    estimated_arrival_time: '10:35 AM',
    center_name: 'Rohania Agribusiness Center B',
    center_location: { lat: 25.2677, lng: 82.9234 },
    last_updated: new Date().toISOString(),
  };

  return ApiResponseHandler.success(res, result);
});

router.get('/center/:centerId', (req: Request, res: Response) => {
  const filtered = DEMO_QUEUE.filter((q) => q.center_id === req.params.centerId);
  return ApiResponseHandler.success(res, filtered);
});

export default router;
