const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const checkAuth = require('../middleware/check-auth');

router.get('/invoice/:invoiceno', checkAuth, bookingController.get_booking_by_invoiceno);

module.exports = router;