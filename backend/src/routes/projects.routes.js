const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const projectsController = require('../controllers/projects.controller');

// All routes require authentication
router.use(verifyToken);

router.get('/', projectsController.getAllProjects);
router.get('/:id', projectsController.getProjectById);
router.post('/', projectsController.createProject);
router.put('/:id', projectsController.updateProject);
router.delete('/:id', projectsController.deleteProject);
router.get('/:id/quotes', projectsController.getProjectQuotes);
router.get('/:id/scaffolds', projectsController.getProjectScaffolds);

module.exports = router;
