import { Response } from 'express';
import { ApiResponseHandler } from '../../utils/apiResponse';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import { notificationService } from './notifications.service';

export class NotificationController {
  static async getMyNotifications(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id || 'usr-farmer-01'; // Mock MVP ID
    const notifications = await notificationService.getMyNotifications(userId);
    return ApiResponseHandler.success(res, notifications);
  }

  static async markRead(req: AuthenticatedRequest, res: Response) {
    await notificationService.markAsRead(req.params.id);
    return ApiResponseHandler.success(res, { success: true });
  }
}
