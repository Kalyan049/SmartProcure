"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationController = void 0;
const zod_1 = require("zod");
const apiResponse_1 = require("../../utils/apiResponse");
const recommendation_service_1 = require("./recommendation.service");
const RecommendationSchema = zod_1.z.object({
    crop: zod_1.z.string().min(1),
    quantity: zod_1.z.number().min(1),
    preferredDate: zod_1.z.string().min(10), // YYYY-MM-DD
});
class RecommendationController {
    static async calculate(req, res) {
        const farmerId = req.user?.id || 'guest-farmer';
        const parsed = RecommendationSchema.safeParse(req.body);
        if (!parsed.success) {
            return apiResponse_1.ApiResponseHandler.error(res, 'Invalid request data: ' + parsed.error.message, 400);
        }
        try {
            const result = await recommendation_service_1.recommendationService.calculateRecommendation({
                farmerId,
                crop: parsed.data.crop,
                quantityQuintals: parsed.data.quantity,
                preferredDate: parsed.data.preferredDate,
            });
            return apiResponse_1.ApiResponseHandler.success(res, result);
        }
        catch (err) {
            return apiResponse_1.ApiResponseHandler.error(res, err.message || 'Recommendation failed', 400);
        }
    }
}
exports.RecommendationController = RecommendationController;
