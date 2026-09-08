import { Router, Request, Response } from 'express';
import { ApiResponseHandler } from '../../utils/apiResponse';
import { Notification } from '../../../../shared/types';

export const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-01',
    user_id: 'usr-farmer-01',
    type: 'SLOT_CONFIRMED',
    title: 'Slot Confirmed',
    message: 'Your slot for Paddy at Center B is confirmed for 10:30 AM.',
    is_read: false,
    action_target: '/farmer/queue',
    created_at: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: 'notif-02',
    user_id: 'usr-farmer-01',
    type: 'PAYMENT_CREDITED',
    title: 'Payment Credited',
    message: '₹89,600 has been credited via DBT for Procurement PR-01.',
    is_read: true,
    action_target: '/farmer/payments',
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
];

const router = Router();

router.get('/', (req: Request, res: Response) => {
  return ApiResponseHandler.success(res, DEMO_NOTIFICATIONS);
});

router.put('/:id/read', (req: Request, res: Response) => {
  const notif = DEMO_NOTIFICATIONS.find((n) => n.id === req.params.id);
  if (notif) notif.is_read = true;
  return ApiResponseHandler.success(res, { id: req.params.id, is_read: true });
});

export default router;
