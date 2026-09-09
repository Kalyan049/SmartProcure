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
exports.ProcurementController = void 0;
const apiResponse_1 = require("../../utils/apiResponse");
const procurementService = __importStar(require("./procurement.service"));
class ProcurementController {
    static async getMyProcurement(req, res) {
        const farmerId = req.user?.id || 'usr-farmer-01'; // Mock
        const proc = await procurementService.getMyProcurement(farmerId);
        if (!proc)
            return apiResponse_1.ApiResponseHandler.error(res, 'Not found', 404);
        const events = await procurementService.getEvents(proc.id);
        return apiResponse_1.ApiResponseHandler.success(res, { procurement: proc, events });
    }
    static async getProcurement(req, res) {
        const proc = await procurementService.getProcurement(req.params.id);
        if (!proc)
            return apiResponse_1.ApiResponseHandler.error(res, 'Not found', 404);
        const events = await procurementService.getEvents(proc.id);
        return apiResponse_1.ApiResponseHandler.success(res, { procurement: proc, events });
    }
    static async advanceStage(req, res) {
        try {
            const actorId = req.user?.id || 'officer-01';
            const actorName = req.user?.role === 'OFFICER' ? 'Verification Officer' : 'System';
            const updatedProc = await procurementService.advanceStage(req.params.id, actorId, actorName, req.body);
            return apiResponse_1.ApiResponseHandler.success(res, updatedProc, 'Stage advanced successfully');
        }
        catch (error) {
            return apiResponse_1.ApiResponseHandler.error(res, error.message, 400);
        }
    }
}
exports.ProcurementController = ProcurementController;
