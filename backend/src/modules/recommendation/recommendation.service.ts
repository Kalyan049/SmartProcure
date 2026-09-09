/**
 * SmartProcure Recommendation Service — Module 8
 * Strictly implements the rule-based Smart Coordination Engine logic.
 */

import { getAllCenters } from '../centers/centers.service';
import { DEMO_SLOTS } from '../slots/slots.routes'; // Mocks
import { RecommendationResult, SlotRecommendation, ProcurementCenter } from '../../../../shared/types';

export interface RecommendationInputs {
  farmerId: string;
  crop: string;
  quantityQuintals: number;
  preferredDate: string;
}

export class RecommendationService {
  /**
   * Rule-based engine strictly defined by ARCHITECTURE.md
   * Queue       35%
   * Capacity    30%
   * ETA         20%
   * Distance    10%
   * Preference   5%
   */
  async calculateRecommendation(inputs: RecommendationInputs): Promise<RecommendationResult> {
    const centers = await getAllCenters(inputs.farmerId);

    // 1. Filter ineligible centers
    const eligibleCenters = centers.filter(c => {
      if (c.status !== 'OPEN') return false;
      const supportsCrop = c.supported_crops.some(sc => sc.toLowerCase() === inputs.crop.toLowerCase());
      if (!supportsCrop) return false;
      if (c.current_load_percent >= 100) return false;
      return true;
    });

    if (eligibleCenters.length === 0) {
      throw new Error(`No eligible, open centers found supporting ${inputs.crop}.`);
    }

    // 2. Score and Rank Options
    const scoredOptions: SlotRecommendation[] = eligibleCenters.map((center: any) => {
      // Find earliest available slot for the preferred date
      // In a real DB, we'd query slots where center_id = center.id and date = preferredDate
      const slot = DEMO_SLOTS.find((s) => s.center_id === center.id && s.status === 'AVAILABLE') || DEMO_SLOTS[0];

      // Normalize Queue [0, 1]
      const maxQueue = 100; // Arbitrary safe max for normalization
      const normalizedQueue = Math.min(center.queueLength / maxQueue, 1);
      
      // Normalize Capacity [0, 1]
      const normalizedCapacity = center.current_load_percent / 100;
      
      // Normalize ETA [0, 1] - capped at 4 hours
      const normalizedEta = Math.min(center.estimatedWaitTimeMins / 240, 1);
      
      // Normalize Distance [0, 1] - capped at 50 km
      const normalizedDistance = Math.min(center.distanceKm / 50, 1);
      
      // Preference: Neutral for MVP
      const normalizedPreference = 0.5;

      const totalScore = 
        (0.35 * normalizedQueue) +
        (0.30 * normalizedCapacity) +
        (0.20 * normalizedEta) +
        (0.10 * normalizedDistance) +
        (0.05 * normalizedPreference);

      // Determine Reason based on strongest (lowest) factors
      let reason = 'Recommended due to balanced overall operational metrics.';
      if (normalizedQueue < 0.25 && normalizedEta < 0.25) {
        reason = `Recommended due to a very short estimated wait time (~${center.estimatedWaitTimeMins} mins) and low queue pressure.`;
      } else if (normalizedDistance < 0.15) {
        reason = `Recommended due to close proximity (${center.distanceKm} km) despite moderate wait times.`;
      } else if (normalizedCapacity < 0.35) {
        reason = `Recommended because the center has high available capacity for your ${inputs.quantityQuintals} quintals today.`;
      }

      return {
        center,
        slot,
        score_factors: {
          queue_score: normalizedQueue,
          capacity_score: normalizedCapacity,
          eta_score: normalizedEta,
          distance_score: normalizedDistance,
          preference_score: normalizedPreference,
          total_score: totalScore,
        },
        queue_level: center.current_load_percent > 70 ? 'HIGH' : center.current_load_percent > 40 ? 'MEDIUM' : 'LOW',
        expected_queue_count: center.queueLength,
        center_load_percent: center.current_load_percent,
        estimated_wait_minutes: center.estimatedWaitTimeMins,
        distance_km: center.distanceKm,
        travel_time_minutes: Math.round(center.distanceKm * 2),
        reason,
      };
    });

    // Sort ascending: Lower score is better
    scoredOptions.sort((a, b) => a.score_factors.total_score - b.score_factors.total_score);

    return {
      best_option: scoredOptions[0],
      alternatives: scoredOptions.slice(1),
      generated_at: new Date().toISOString(),
    };
  }
}

export const recommendationService = new RecommendationService();
