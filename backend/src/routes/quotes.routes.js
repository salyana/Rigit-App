const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const quotesController = require('../controllers/quotes.controller');

// All routes require authentication
router.use(verifyToken);

router.get('/', quotesController.getAllQuotes);
router.get('/:id', quotesController.getQuoteById);
router.post('/', quotesController.createQuote);
router.put('/:id', quotesController.updateQuote);
router.delete('/:id', quotesController.deleteQuote);
router.post('/:id/accept', quotesController.acceptQuote);
router.post('/:id/reject', quotesController.rejectQuote);

module.exports = router;
