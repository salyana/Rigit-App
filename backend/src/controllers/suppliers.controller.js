const { query } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const getAllSuppliers = async (req, res) => {
  try {
    const result = await query(
      `SELECT s.*, u.email, u.name as user_name 
       FROM suppliers s 
       JOIN users u ON s.user_id = u.id 
       ORDER BY s.created_at DESC`
    );
    res.json({ suppliers: result.rows });
  } catch (error) {
    console.error('Get all suppliers error:', error);
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
};

const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT s.*, u.email, u.name as user_name 
       FROM suppliers s 
       JOIN users u ON s.user_id = u.id 
       WHERE s.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.json({ supplier: result.rows[0] });
  } catch (error) {
    console.error('Get supplier error:', error);
    res.status(500).json({ error: 'Failed to fetch supplier' });
  }
};

const createSupplier = async (req, res) => {
  try {
    const { company_name, description, service_areas } = req.body;
    const userId = req.user.id;

    // Check if supplier already exists
    const existing = await query(
      'SELECT id FROM suppliers WHERE user_id = $1',
      [userId]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Supplier profile already exists' });
    }

    const supplierId = uuidv4();
    await query(
      `INSERT INTO suppliers (id, user_id, company_name, description, service_areas, rating, created_at)
       VALUES ($1, $2, $3, $4, ST_GeomFromGeoJSON($5), 0, NOW())`,
      [supplierId, userId, company_name, description, JSON.stringify(service_areas)]
    );

    res.status(201).json({ message: 'Supplier created successfully', id: supplierId });
  } catch (error) {
    console.error('Create supplier error:', error);
    res.status(500).json({ error: 'Failed to create supplier' });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { company_name, description, service_areas } = req.body;

    // Verify ownership
    const check = await query('SELECT user_id FROM suppliers WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    if (check.rows[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (company_name) {
      updates.push(`company_name = $${paramCount++}`);
      values.push(company_name);
    }
    if (description) {
      updates.push(`description = $${paramCount++}`);
      values.push(description);
    }
    if (service_areas) {
      updates.push(`service_areas = ST_GeomFromGeoJSON($${paramCount++})`);
      values.push(JSON.stringify(service_areas));
    }

    values.push(id);
    await query(
      `UPDATE suppliers SET ${updates.join(', ')} WHERE id = $${paramCount}`,
      values
    );

    res.json({ message: 'Supplier updated successfully' });
  } catch (error) {
    console.error('Update supplier error:', error);
    res.status(500).json({ error: 'Failed to update supplier' });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM suppliers WHERE id = $1', [id]);
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Delete supplier error:', error);
    res.status(500).json({ error: 'Failed to delete supplier' });
  }
};

const getSupplierQuotes = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT * FROM quotes WHERE supplier_id = $1 ORDER BY created_at DESC',
      [id]
    );
    res.json({ quotes: result.rows });
  } catch (error) {
    console.error('Get supplier quotes error:', error);
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
};

const getSupplierReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT r.*, u.name as user_name 
       FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.supplier_id = $1 
       ORDER BY r.created_at DESC`,
      [id]
    );
    res.json({ reviews: result.rows });
  } catch (error) {
    console.error('Get supplier reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

module.exports = {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierQuotes,
  getSupplierReviews
};
