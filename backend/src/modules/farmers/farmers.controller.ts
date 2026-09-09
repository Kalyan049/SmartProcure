/**
 * SmartProcure Farmers Controller — Module 6: Farmer Profile
 *
 * Exposes profile and history endpoints for the farmer.
 */

import { Request, Response } from 'express';
import { z } from 'zod';
import { ApiResponseHandler } from '../../utils/apiResponse';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import * as farmersService from './farmers.service';

const UpdateProfileSchema = z.object({
  land_size_acres: z.number().min(0).optional(),
  land_village: z.string().optional(),
  land_district: z.string().optional(),
  land_state: z.string().optional(),
  crops_grown: z.array(z.string()).optional(),
  expected_quantity: z.number().min(0).optional(),
  harvest_date: z.string().optional(),
});

export class FarmersController {
  
  static async getProfile(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) return ApiResponseHandler.error(res, 'Unauthorized', 401);

    const profile = await farmersService.getFarmerProfile(userId);
    if (!profile) return ApiResponseHandler.error(res, 'Profile not found', 404);

    return ApiResponseHandler.success(res, profile);
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) return ApiResponseHandler.error(res, 'Unauthorized', 401);

    const parsed = UpdateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      return ApiResponseHandler.error(res, parsed.error.errors.map(e => e.message).join(', '), 400);
    }

    const updated = await farmersService.updateFarmerProfile(userId, parsed.data);
    return ApiResponseHandler.success(res, updated, 'Profile updated successfully');
  }

  static async getBookingHistory(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) return ApiResponseHandler.error(res, 'Unauthorized', 401);
    
    const history = await farmersService.getBookingHistory(userId);
    return ApiResponseHandler.success(res, history);
  }

  static async getProcurementHistory(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) return ApiResponseHandler.error(res, 'Unauthorized', 401);
    
    const history = await farmersService.getProcurementHistory(userId);
    return ApiResponseHandler.success(res, history);
  }

  static async getPaymentHistory(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) return ApiResponseHandler.error(res, 'Unauthorized', 401);
    
    const history = await farmersService.getPaymentHistory(userId);
    return ApiResponseHandler.success(res, history);
  }
}
