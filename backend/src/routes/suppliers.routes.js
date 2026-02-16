const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const suppliersController = require('../controllers/suppliers.controller');

// Public routes
router.get('/', suppliersController.getAllSuppliers);
router.get('/:id', suppliersController.getSupplierById);

// Protected routes
router.use(verifyToken);
router.post('/', requireRole('supplier'), suppliersController.createSupplier);
router.put('/:id', requireRole('supplier'), suppliersController.updateSupplier);
router.delete('/:id', requireRole('supplier', 'admin'), suppliersController.deleteSupplier);
router.get('/:id/quotes', suppliersController.getSupplierQuotes);
router.get('/:id/reviews', suppliersController.getSupplierReviews);

module.exports = router;
