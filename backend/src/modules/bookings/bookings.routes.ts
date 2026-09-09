import { Router } from 'express';
import { BookingsController } from './bookings.controller';

const router = Router();

// All routes require authentication (enforced by the global middleware in routes.ts)
router.get('/my', BookingsController.getMyBookings);
router.post('/', BookingsController.createBooking);
router.get('/slots', BookingsController.getAvailableSlots);
router.get('/:id', BookingsController.getBookingById);

export default router;
