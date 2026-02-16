const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const scaffoldsController = require('../controllers/scaffolds.controller');

// All routes require authentication
router.use(verifyToken);

router.get('/', scaffoldsController.getAllScaffolds);
router.get('/:id', scaffoldsController.getScaffoldById);
router.post('/', scaffoldsController.createScaffold);
router.put('/:id', scaffoldsController.updateScaffold);
router.delete('/:id', scaffoldsController.deleteScaffold);

module.exports = router;
