"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookings_controller_1 = require("./bookings.controller");
const router = (0, express_1.Router)();
// All routes require authentication (enforced by the global middleware in routes.ts)
router.get('/my', bookings_controller_1.BookingsController.getMyBookings);
router.post('/', bookings_controller_1.BookingsController.createBooking);
router.get('/slots', bookings_controller_1.BookingsController.getAvailableSlots);
router.get('/:id', bookings_controller_1.BookingsController.getBookingById);
exports.default = router;
