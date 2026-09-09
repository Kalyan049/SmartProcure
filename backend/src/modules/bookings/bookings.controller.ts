import { Response } from 'express';
import { z } from 'zod';
import { ApiResponseHandler } from '../../utils/apiResponse';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import * as bookingsService from './bookings.service';

const CreateBookingSchema = z.object({
  centerId: z.string().min(1, 'Center ID is required'),
  slotId: z.string().min(1, 'Slot ID is required'),
  crop: z.string().min(1, 'Crop is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1 quintal'),
  date: z.string().min(10, 'Valid date is required (YYYY-MM-DD)'),
});

export class BookingsController {
  static async createBooking(req: AuthenticatedRequest, res: Response) {
    const farmerId = req.user?.id;
    if (!farmerId) return ApiResponseHandler.error(res, 'Unauthorized', 401);

    const parsed = CreateBookingSchema.safeParse(req.body);
    if (!parsed.success) {
      return ApiResponseHandler.error(res, parsed.error.errors.map(e => e.message).join(', '), 400);
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
      return ApiResponseHandler.success(res, confirmation, 'Slot booked successfully', 201);
    } catch (err: any) {
      // Return structured error codes for the frontend to handle
      const statusCode = err.message.startsWith('DUPLICATE') ? 409
        : err.message.startsWith('SLOT_FULL') ? 409
        : err.message.startsWith('SLOT_NOT_FOUND') ? 404
        : err.message.startsWith('SLOT_CANCELLED') ? 410
        : 400;
      return ApiResponseHandler.error(res, err.message, statusCode);
    }
  }

  static async getMyBookings(req: AuthenticatedRequest, res: Response) {
    const farmerId = req.user?.id;
    if (!farmerId) return ApiResponseHandler.error(res, 'Unauthorized', 401);

    const bookings = await bookingsService.getMyBookings(farmerId);
    return ApiResponseHandler.success(res, bookings);
  }

  static async getBookingById(req: AuthenticatedRequest, res: Response) {
    const farmerId = req.user?.id;
    if (!farmerId) return ApiResponseHandler.error(res, 'Unauthorized', 401);

    const booking = await bookingsService.getBookingById(req.params.id);
    if (!booking) return ApiResponseHandler.error(res, 'Booking not found', 404);
    if (booking.farmer_id !== farmerId) return ApiResponseHandler.error(res, 'Access denied', 403);

    return ApiResponseHandler.success(res, booking);
  }

  static async getAvailableSlots(req: AuthenticatedRequest, res: Response) {
    const { centerId, date } = req.query as { centerId: string; date: string };
    if (!centerId || !date) {
      return ApiResponseHandler.error(res, 'centerId and date query params are required', 400);
    }
    const slots = await bookingsService.getAvailableSlots(centerId, date);
    return ApiResponseHandler.success(res, slots);
  }
}
