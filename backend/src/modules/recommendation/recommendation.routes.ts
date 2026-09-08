import { Router, Request, Response } from 'express';
import { ApiResponseHandler } from '../../utils/apiResponse';
import { DEMO_CENTERS } from '../centers/centers.routes';
import { DEMO_SLOTS } from '../slots/slots.routes';
import { RecommendationResult, SlotRecommendation } from '../../../../shared/types';

export class RecommendationEngine {
  calculateRecommendation(
    crop: string,
    quantityQuintals: number,
    preferredDate: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    farmerLat: number = 25.3176,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    farmerLng: number = 82.9739
  ): RecommendationResult {
    // Deterministic 5-factor rule scoring
    const eligibleCenters = DEMO_CENTERS.filter(
      (c) => c.status === 'OPEN' && c.supported_crops.includes(crop)
    );

    const scoredOptions: SlotRecommendation[] = eligibleCenters.map((center) => {
      const slot = DEMO_SLOTS.find((s) => s.center_id === center.id) || DEMO_SLOTS[0];
      const queueScore = center.current_load_percent / 100;
      const capacityScore = (center.daily_capacity_quintals - quantityQuintals > 0) ? 0.3 : 0.9;
      const etaScore = (center.processing_rate_min_per_farmer * 5) / 60;
      const distanceScore = 0.2;
      const preferenceScore = 0.1;

      const totalScore =
        0.35 * queueScore +
        0.30 * capacityScore +
        0.20 * etaScore +
        0.10 * distanceScore +
        0.05 * preferenceScore;

      return {
        center,
        slot,
        score_factors: {
          queue_score: queueScore,
          capacity_score: capacityScore,
          eta_score: etaScore,
          distance_score: distanceScore,
          preference_score: preferenceScore,
          total_score: totalScore,
        },
        queue_level: center.current_load_percent > 70 ? 'HIGH' : center.current_load_percent > 40 ? 'MEDIUM' : 'LOW',
        expected_queue_count: Math.round((center.current_load_percent / 100) * 40),
        center_load_percent: center.current_load_percent,
        estimated_wait_minutes: center.processing_rate_min_per_farmer * 5,
        distance_km: 2.4,
        travel_time_minutes: 15,
        reason: `Recommended due to lower queue (${center.current_load_percent}% load) and faster average processing (${center.processing_rate_min_per_farmer} min/farmer).`,
      };
    });

    scoredOptions.sort((a, b) => a.score_factors.total_score - b.score_factors.total_score);

    return {
      best_option: scoredOptions[0] || scoredOptions[0],
      alternatives: scoredOptions.slice(1),
      generated_at: new Date().toISOString(),
    };
  }
}

const engine = new RecommendationEngine();
const router = Router();

router.post('/', (req: Request, res: Response) => {
  const { crop = 'Paddy', quantity = 40, preferredDate = '2026-09-09' } = req.body;
  const result = engine.calculateRecommendation(crop, Number(quantity), preferredDate);
  return ApiResponseHandler.success(res, result);
});

export default router;
