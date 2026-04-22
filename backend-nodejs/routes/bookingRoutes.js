const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/auth');

// Public/Protected Routes
router.get('/', protect, bookingController.getAllBookings);
router.get('/:id', protect, bookingController.getBookingById);
router.post('/', protect, bookingController.createBooking);
router.put('/:id', protect, bookingController.updateBooking);
router.delete('/:id', protect, bookingController.deleteBooking);

// Admin Routes
router.get('/admin/all', protect, admin, bookingController.getAllBookingsAdmin);
router.get('/admin/payments', protect, admin, bookingController.getPaymentHistory);
router.put('/admin/:id', protect, admin, bookingController.updateBookingAdmin);
router.delete('/admin/:id', protect, admin, bookingController.deleteBookingAdmin);

module.exports = router;
