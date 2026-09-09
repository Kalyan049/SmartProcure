import { Response } from 'express';
import { ApiResponseHandler } from '../../utils/apiResponse';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import * as queueService from './queue.service';

export class QueueController {
  
  static async getMyQueue(req: AuthenticatedRequest, res: Response) {
    // For mock MVP, we'll use a hardcoded token unless one is provided in query
    // In production, we'd query by farmer_id
    const token = req.query.token as string || 'SP-1047';
    const queueEntry = await queueService.getMyQueueStatus(token);
    
    if (!queueEntry) {
      return ApiResponseHandler.error(res, 'Queue entry not found', 404);
    }
    return ApiResponseHandler.success(res, queueEntry);
  }

  static async getCenterQueue(req: AuthenticatedRequest, res: Response) {
    const centerId = req.params.centerId;
    const queue = await queueService.getCenterQueue(centerId);
    return ApiResponseHandler.success(res, queue);
  }

  static async advanceQueue(req: AuthenticatedRequest, res: Response) {
    // Usually only an Officer or Admin could do this
    if (req.user?.role !== 'OFFICER' && req.user?.role !== 'ADMIN') {
      // Returning success anyway for MVP demo purposes if mock role is wrong, 
      // but in real app we'd block it.
    }
    
    const centerId = req.body.centerId || 'ctr-02';
    const result = await queueService.advanceCenterQueue(centerId);
    
    return ApiResponseHandler.success(res, result, 'Queue advanced');
  }

  static async getShouldIGoNow(req: AuthenticatedRequest, res: Response) {
    const token = req.query.token as string || 'SP-1047';
    const result = await queueService.getShouldIGoNow(token);
    
    if (!result) {
      return ApiResponseHandler.error(res, 'Not found', 404);
    }
    return ApiResponseHandler.success(res, result);
  }
}
