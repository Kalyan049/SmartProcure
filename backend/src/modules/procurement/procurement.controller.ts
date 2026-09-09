import { Response } from 'express';
import { ApiResponseHandler } from '../../utils/apiResponse';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import * as procurementService from './procurement.service';

export class ProcurementController {
  static async getMyProcurement(req: AuthenticatedRequest, res: Response) {
    const farmerId = req.user?.id || 'usr-farmer-01'; // Mock
    const proc = await procurementService.getMyProcurement(farmerId);
    if (!proc) return ApiResponseHandler.error(res, 'Not found', 404);
    
    const events = await procurementService.getEvents(proc.id);
    return ApiResponseHandler.success(res, { procurement: proc, events });
  }

  static async getProcurement(req: AuthenticatedRequest, res: Response) {
    const proc = await procurementService.getProcurement(req.params.id);
    if (!proc) return ApiResponseHandler.error(res, 'Not found', 404);
    
    const events = await procurementService.getEvents(proc.id);
    return ApiResponseHandler.success(res, { procurement: proc, events });
  }

  static async advanceStage(req: AuthenticatedRequest, res: Response) {
    try {
      const actorId = req.user?.id || 'officer-01';
      const actorName = req.user?.role === 'OFFICER' ? 'Verification Officer' : 'System';
      
      const updatedProc = await procurementService.advanceStage(
        req.params.id,
        actorId,
        actorName,
        req.body
      );
      
      return ApiResponseHandler.success(res, updatedProc, 'Stage advanced successfully');
    } catch (error: any) {
      return ApiResponseHandler.error(res, error.message, 400);
    }
  }
}
