import { Response } from 'express';
import { ApiResponseHandler } from '../../utils/apiResponse';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import * as analyticsService from './analytics.service';

export class AnalyticsController {
  static async getCenterAnalytics(req: AuthenticatedRequest, res: Response) {
    const centerId = req.params.id;
    const analytics = await analyticsService.getCenterAnalytics(centerId);
    return ApiResponseHandler.success(res, analytics);
  }
}
