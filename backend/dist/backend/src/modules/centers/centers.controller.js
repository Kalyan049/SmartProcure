"use strict";
/**
 * SmartProcure Centers Controller — Module 7: Procurement Center Discovery
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
exports.CentersController = void 0;
const apiResponse_1 = require("../../utils/apiResponse");
const centersService = __importStar(require("./centers.service"));
class CentersController {
    static async listCenters(req, res) {
        // If not authenticated, use a dummy ID to still provide distances
        const farmerId = req.user?.id || 'guest-farmer';
        const centers = await centersService.getAllCenters(farmerId);
        return apiResponse_1.ApiResponseHandler.success(res, centers);
    }
    static async getCenterDetail(req, res) {
        const farmerId = req.user?.id || 'guest-farmer';
        const centerId = req.params.id;
        const center = await centersService.getCenterById(centerId, farmerId);
        if (!center) {
            return apiResponse_1.ApiResponseHandler.error(res, 'Center not found', 404);
        }
        return apiResponse_1.ApiResponseHandler.success(res, center);
    }
    static async getCenterCapacity(req, res) {
        const farmerId = req.user?.id || 'guest-farmer';
        const centerId = req.params.id;
        const center = await centersService.getCenterById(centerId, farmerId);
        if (!center) {
            return apiResponse_1.ApiResponseHandler.error(res, 'Center not found', 404);
        }
        return apiResponse_1.ApiResponseHandler.success(res, {
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
exports.CentersController = CentersController;
