const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const paymentsController = require('../controllers/payments.controller');

// All routes require authentication
router.use(verifyToken);

router.get('/', paymentsController.getAllPayments);
router.get('/:id', paymentsController.getPaymentById);
router.post('/', paymentsController.createPayment);
router.post('/:id/webhook', paymentsController.handleWebhook);
router.post('/:id/refund', paymentsController.processRefund);

module.exports = router;
