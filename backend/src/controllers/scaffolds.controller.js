const { query } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const getAllScaffolds = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM scaffold_configurations ORDER BY created_at DESC'
    );
    res.json({ scaffolds: result.rows });
  } catch (error) {
    console.error('Get all scaffolds error:', error);
    res.status(500).json({ error: 'Failed to fetch scaffolds' });
  }
};

const getScaffoldById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT * FROM scaffold_configurations WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Scaffold configuration not found' });
    }

    res.json({ scaffold: result.rows[0] });
  } catch (error) {
    console.error('Get scaffold error:', error);
    res.status(500).json({ error: 'Failed to fetch scaffold' });
  }
};

const createScaffold = async (req, res) => {
  try {
    const { project_id, config_data } = req.body;
    const scaffoldId = uuidv4();

    await query(
      `INSERT INTO scaffold_configurations (id, project_id, config_data, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())`,
      [scaffoldId, project_id, JSON.stringify(config_data)]
    );

    res.status(201).json({ message: 'Scaffold configuration created successfully', id: scaffoldId });
  } catch (error) {
    console.error('Create scaffold error:', error);
    res.status(500).json({ error: 'Failed to create scaffold configuration' });
  }
};

const updateScaffold = async (req, res) => {
  try {
    const { id } = req.params;
    const { config_data } = req.body;

    await query(
      `UPDATE scaffold_configurations 
       SET config_data = $1, updated_at = NOW() 
       WHERE id = $2`,
      [JSON.stringify(config_data), id]
    );

    res.json({ message: 'Scaffold configuration updated successfully' });
  } catch (error) {
    console.error('Update scaffold error:', error);
    res.status(500).json({ error: 'Failed to update scaffold configuration' });
  }
};

const deleteScaffold = async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM scaffold_configurations WHERE id = $1', [id]);
    res.json({ message: 'Scaffold configuration deleted successfully' });
  } catch (error) {
    console.error('Delete scaffold error:', error);
    res.status(500).json({ error: 'Failed to delete scaffold configuration' });
  }
};

module.exports = {
  getAllScaffolds,
  getScaffoldById,
  createScaffold,
  updateScaffold,
  deleteScaffold
};
