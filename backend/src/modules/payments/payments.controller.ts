import { Response } from 'express';
import { ApiResponseHandler } from '../../utils/apiResponse';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import * as paymentsService from './payments.service';

export class PaymentsController {
  static async getMyPayments(req: AuthenticatedRequest, res: Response) {
    const farmerId = req.user?.id || 'usr-farmer-01'; // Mock ID
    const payments = await paymentsService.getMyPayments(farmerId);
    return ApiResponseHandler.success(res, payments);
  }
}
