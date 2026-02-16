const { query } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const getAllProjects = async (req, res) => {
  try {
    // Users can only see their own projects unless admin
    let result;
    if (req.user.role === 'admin') {
      result = await query('SELECT * FROM projects ORDER BY created_at DESC');
    } else {
      result = await query(
        'SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC',
        [req.user.id]
      );
    }
    res.json({ projects: result.rows });
  } catch (error) {
    console.error('Get all projects error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM projects WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check permissions
    if (result.rows[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    res.json({ project: result.rows[0] });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

const createProject = async (req, res) => {
  try {
    const { name, address, location } = req.body;
    const projectId = uuidv4();

    await query(
      `INSERT INTO projects (id, user_id, name, address, location, status, created_at)
       VALUES ($1, $2, $3, $4, ST_GeomFromGeoJSON($5), 'draft', NOW())`,
      [projectId, req.user.id, name, address, JSON.stringify(location)]
    );

    res.status(201).json({ message: 'Project created successfully', id: projectId });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, location, status } = req.body;

    // Verify ownership
    const check = await query('SELECT user_id FROM projects WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    if (check.rows[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (address) {
      updates.push(`address = $${paramCount++}`);
      values.push(address);
    }
    if (location) {
      updates.push(`location = ST_GeomFromGeoJSON($${paramCount++})`);
      values.push(JSON.stringify(location));
    }
    if (status) {
      updates.push(`status = $${paramCount++}`);
      values.push(status);
    }

    values.push(id);
    await query(
      `UPDATE projects SET ${updates.join(', ')} WHERE id = $${paramCount}`,
      values
    );

    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM projects WHERE id = $1', [id]);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

const getProjectQuotes = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT * FROM quotes WHERE project_id = $1 ORDER BY created_at DESC',
      [id]
    );
    res.json({ quotes: result.rows });
  } catch (error) {
    console.error('Get project quotes error:', error);
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
};

const getProjectScaffolds = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT * FROM scaffold_configurations WHERE project_id = $1 ORDER BY created_at DESC',
      [id]
    );
    res.json({ scaffolds: result.rows });
  } catch (error) {
    console.error('Get project scaffolds error:', error);
    res.status(500).json({ error: 'Failed to fetch scaffolds' });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectQuotes,
  getProjectScaffolds
};
