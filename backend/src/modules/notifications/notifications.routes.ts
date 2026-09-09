import { Router } from 'express';
import { NotificationController } from './notifications.controller';

const router = Router();

router.get('/my', NotificationController.getMyNotifications);
router.post('/:id/read', NotificationController.markRead);

export default router;
