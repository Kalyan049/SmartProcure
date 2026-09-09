"use strict";
/**
 * SmartProcure Farmers Controller — Module 6: Farmer Profile
 *
 * Exposes profile and history endpoints for the farmer.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmersController = void 0;
const zod_1 = require("zod");
const apiResponse_1 = require("../../utils/apiResponse");
const farmersService = __importStar(require("./farmers.service"));
const UpdateProfileSchema = zod_1.z.object({
    land_size_acres: zod_1.z.number().min(0).optional(),
    land_village: zod_1.z.string().optional(),
    land_district: zod_1.z.string().optional(),
    land_state: zod_1.z.string().optional(),
    crops_grown: zod_1.z.array(zod_1.z.string()).optional(),
    expected_quantity: zod_1.z.number().min(0).optional(),
    harvest_date: zod_1.z.string().optional(),
});
class FarmersController {
    static async getProfile(req, res) {
        const userId = req.user?.id;
        if (!userId)
            return apiResponse_1.ApiResponseHandler.error(res, 'Unauthorized', 401);
        const profile = await farmersService.getFarmerProfile(userId);
        if (!profile)
            return apiResponse_1.ApiResponseHandler.error(res, 'Profile not found', 404);
        return apiResponse_1.ApiResponseHandler.success(res, profile);
    }
    static async updateProfile(req, res) {
        const userId = req.user?.id;
        if (!userId)
            return apiResponse_1.ApiResponseHandler.error(res, 'Unauthorized', 401);
        const parsed = UpdateProfileSchema.safeParse(req.body);
        if (!parsed.success) {
            return apiResponse_1.ApiResponseHandler.error(res, parsed.error.errors.map(e => e.message).join(', '), 400);
        }
        const updated = await farmersService.updateFarmerProfile(userId, parsed.data);
        return apiResponse_1.ApiResponseHandler.success(res, updated, 'Profile updated successfully');
    }
    static async getBookingHistory(req, res) {
        const userId = req.user?.id;
        if (!userId)
            return apiResponse_1.ApiResponseHandler.error(res, 'Unauthorized', 401);
        const history = await farmersService.getBookingHistory(userId);
        return apiResponse_1.ApiResponseHandler.success(res, history);
    }
    static async getProcurementHistory(req, res) {
        const userId = req.user?.id;
        if (!userId)
            return apiResponse_1.ApiResponseHandler.error(res, 'Unauthorized', 401);
        const history = await farmersService.getProcurementHistory(userId);
        return apiResponse_1.ApiResponseHandler.success(res, history);
    }
    static async getPaymentHistory(req, res) {
        const userId = req.user?.id;
        if (!userId)
            return apiResponse_1.ApiResponseHandler.error(res, 'Unauthorized', 401);
        const history = await farmersService.getPaymentHistory(userId);
        return apiResponse_1.ApiResponseHandler.success(res, history);
    }
}
exports.FarmersController = FarmersController;
