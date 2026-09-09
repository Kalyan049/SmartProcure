"use strict";
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
exports.QueueController = void 0;
const apiResponse_1 = require("../../utils/apiResponse");
const queueService = __importStar(require("./queue.service"));
class QueueController {
    static async getMyQueue(req, res) {
        // For mock MVP, we'll use a hardcoded token unless one is provided in query
        // In production, we'd query by farmer_id
        const token = req.query.token || 'SP-1047';
        const queueEntry = await queueService.getMyQueueStatus(token);
        if (!queueEntry) {
            return apiResponse_1.ApiResponseHandler.error(res, 'Queue entry not found', 404);
        }
        return apiResponse_1.ApiResponseHandler.success(res, queueEntry);
    }
    static async getCenterQueue(req, res) {
        const centerId = req.params.centerId;
        const queue = await queueService.getCenterQueue(centerId);
        return apiResponse_1.ApiResponseHandler.success(res, queue);
    }
    static async advanceQueue(req, res) {
        // Usually only an Officer or Admin could do this
        if (req.user?.role !== 'OFFICER' && req.user?.role !== 'ADMIN') {
            // Returning success anyway for MVP demo purposes if mock role is wrong, 
            // but in real app we'd block it.
        }
        const centerId = req.body.centerId || 'ctr-02';
        const result = await queueService.advanceCenterQueue(centerId);
        return apiResponse_1.ApiResponseHandler.success(res, result, 'Queue advanced');
    }
    static async getShouldIGoNow(req, res) {
        const token = req.query.token || 'SP-1047';
        const result = await queueService.getShouldIGoNow(token);
        if (!result) {
            return apiResponse_1.ApiResponseHandler.error(res, 'Not found', 404);
        }
        return apiResponse_1.ApiResponseHandler.success(res, result);
    }
}
exports.QueueController = QueueController;
