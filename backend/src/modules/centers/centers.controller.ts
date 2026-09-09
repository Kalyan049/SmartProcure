/**
 * SmartProcure Centers Controller — Module 7: Procurement Center Discovery
 */

import { Request, Response } from 'express';
import { ApiResponseHandler } from '../../utils/apiResponse';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import * as centersService from './centers.service';

export class CentersController {
  static async listCenters(req: AuthenticatedRequest, res: Response) {
    // If not authenticated, use a dummy ID to still provide distances
    const farmerId = req.user?.id || 'guest-farmer';
    const centers = await centersService.getAllCenters(farmerId);
    return ApiResponseHandler.success(res, centers);
  }

  static async getCenterDetail(req: AuthenticatedRequest, res: Response) {
    const farmerId = req.user?.id || 'guest-farmer';
    const centerId = req.params.id;

    const center = await centersService.getCenterById(centerId, farmerId);
    if (!center) {
      return ApiResponseHandler.error(res, 'Center not found', 404);
    }

    return ApiResponseHandler.success(res, center);
  }

  static async getCenterCapacity(req: AuthenticatedRequest, res: Response) {
    const farmerId = req.user?.id || 'guest-farmer';
    const centerId = req.params.id;

    const center = await centersService.getCenterById(centerId, farmerId);
    if (!center) {
      return ApiResponseHandler.error(res, 'Center not found', 404);
    }

    return ApiResponseHandler.success(res, {
      centerId: center.id,
      daily_capacity_quintals: center.daily_capacity_quintals,
      current_load_percent: center.current_load_percent,
      load_status: center.load_status,
      processing_rate_min_per_farmer: center.processing_rate_min_per_farmer,
      active_queue_count: center.queueLength,
      estimated_wait_time_mins: center.estimatedWaitTimeMins,
    });
  }
}
