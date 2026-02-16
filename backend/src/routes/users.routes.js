const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const usersController = require('../controllers/users.controller');

// All routes require authentication
router.use(verifyToken);

router.get('/', requireRole('admin'), usersController.getAllUsers);
router.get('/:id', usersController.getUserById);
router.put('/:id', usersController.updateUser);
router.delete('/:id', requireRole('admin'), usersController.deleteUser);
router.get('/:id/projects', usersController.getUserProjects);

module.exports = router;
