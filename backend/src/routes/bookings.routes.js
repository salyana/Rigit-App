const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const bookingsController = require('../controllers/bookings.controller');

// All routes require authentication
router.use(verifyToken);

router.get('/', bookingsController.getAllBookings);
router.get('/:id', bookingsController.getBookingById);
router.post('/', bookingsController.createBooking);
router.put('/:id', bookingsController.updateBooking);
router.delete('/:id', bookingsController.deleteBooking);
router.post('/:id/cancel', bookingsController.cancelBooking);

module.exports = router;
