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
exports.BookingsController = void 0;
const zod_1 = require("zod");
const apiResponse_1 = require("../../utils/apiResponse");
const bookingsService = __importStar(require("./bookings.service"));
const CreateBookingSchema = zod_1.z.object({
    centerId: zod_1.z.string().min(1, 'Center ID is required'),
    slotId: zod_1.z.string().min(1, 'Slot ID is required'),
    crop: zod_1.z.string().min(1, 'Crop is required'),
    quantity: zod_1.z.number().min(1, 'Quantity must be at least 1 quintal'),
    date: zod_1.z.string().min(10, 'Valid date is required (YYYY-MM-DD)'),
});
class BookingsController {
    static async createBooking(req, res) {
        const farmerId = req.user?.id;
        if (!farmerId)
            return apiResponse_1.ApiResponseHandler.error(res, 'Unauthorized', 401);
        const parsed = CreateBookingSchema.safeParse(req.body);
        if (!parsed.success) {
            return apiResponse_1.ApiResponseHandler.error(res, parsed.error.errors.map(e => e.message).join(', '), 400);
        }
        try {
            const confirmation = await bookingsService.createBooking({
                farmerId,
                centerId: parsed.data.centerId,
                slotId: parsed.data.slotId,
                crop: parsed.data.crop,
                quantityQuintals: parsed.data.quantity,
                date: parsed.data.date,
            });
            return apiResponse_1.ApiResponseHandler.success(res, confirmation, 'Slot booked successfully', 201);
        }
        catch (err) {
            // Return structured error codes for the frontend to handle
            const statusCode = err.message.startsWith('DUPLICATE') ? 409
                : err.message.startsWith('SLOT_FULL') ? 409
                    : err.message.startsWith('SLOT_NOT_FOUND') ? 404
                        : err.message.startsWith('SLOT_CANCELLED') ? 410
                            : 400;
            return apiResponse_1.ApiResponseHandler.error(res, err.message, statusCode);
        }
    }
    static async getMyBookings(req, res) {
        const farmerId = req.user?.id;
        if (!farmerId)
            return apiResponse_1.ApiResponseHandler.error(res, 'Unauthorized', 401);
        const bookings = await bookingsService.getMyBookings(farmerId);
        return apiResponse_1.ApiResponseHandler.success(res, bookings);
    }
    static async getBookingById(req, res) {
        const farmerId = req.user?.id;
        if (!farmerId)
            return apiResponse_1.ApiResponseHandler.error(res, 'Unauthorized', 401);
        const booking = await bookingsService.getBookingById(req.params.id);
        if (!booking)
            return apiResponse_1.ApiResponseHandler.error(res, 'Booking not found', 404);
        if (booking.farmer_id !== farmerId)
            return apiResponse_1.ApiResponseHandler.error(res, 'Access denied', 403);
        return apiResponse_1.ApiResponseHandler.success(res, booking);
    }
    static async getAvailableSlots(req, res) {
        const { centerId, date } = req.query;
        if (!centerId || !date) {
            return apiResponse_1.ApiResponseHandler.error(res, 'centerId and date query params are required', 400);
        }
        const slots = await bookingsService.getAvailableSlots(centerId, date);
        return apiResponse_1.ApiResponseHandler.success(res, slots);
    }
}
exports.BookingsController = BookingsController;
