import { Request, Response } from 'express';
import { z } from 'zod';
import { ApiResponseHandler } from '../../utils/apiResponse';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import { recommendationService } from './recommendation.service';

const RecommendationSchema = z.object({
  crop: z.string().min(1),
  quantity: z.number().min(1),
  preferredDate: z.string().min(10), // YYYY-MM-DD
});

export class RecommendationController {
  static async calculate(req: AuthenticatedRequest, res: Response) {
    const farmerId = req.user?.id || 'guest-farmer';
    
    const parsed = RecommendationSchema.safeParse(req.body);
    if (!parsed.success) {
      return ApiResponseHandler.error(res, 'Invalid request data: ' + parsed.error.message, 400);
    }

    try {
      const result = await recommendationService.calculateRecommendation({
        farmerId,
        crop: parsed.data.crop,
        quantityQuintals: parsed.data.quantity,
        preferredDate: parsed.data.preferredDate,
      });

      return ApiResponseHandler.success(res, result);
    } catch (err: any) {
      return ApiResponseHandler.error(res, err.message || 'Recommendation failed', 400);
    }
  }
}
