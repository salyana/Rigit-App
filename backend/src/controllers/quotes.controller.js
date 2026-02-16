const { query } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const getAllQuotes = async (req, res) => {
  try {
    const result = await query('SELECT * FROM quotes ORDER BY created_at DESC');
    res.json({ quotes: result.rows });
  } catch (error) {
    console.error('Get all quotes error:', error);
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
};

const getQuoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM quotes WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    res.json({ quote: result.rows[0] });
  } catch (error) {
    console.error('Get quote error:', error);
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
};

const createQuote = async (req, res) => {
  try {
    const { project_id, supplier_id, amount, valid_until } = req.body;
    const quoteId = uuidv4();

    await query(
      `INSERT INTO quotes (id, project_id, supplier_id, amount, status, valid_until, created_at)
       VALUES ($1, $2, $3, $4, 'pending', $5, NOW())`,
      [quoteId, project_id, supplier_id, amount, valid_until]
    );

    res.status(201).json({ message: 'Quote created successfully', id: quoteId });
  } catch (error) {
    console.error('Create quote error:', error);
    res.status(500).json({ error: 'Failed to create quote' });
  }
};

const updateQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, valid_until } = req.body;

    await query(
      `UPDATE quotes 
       SET amount = $1, valid_until = $2 
       WHERE id = $3`,
      [amount, valid_until, id]
    );

    res.json({ message: 'Quote updated successfully' });
  } catch (error) {
    console.error('Update quote error:', error);
    res.status(500).json({ error: 'Failed to update quote' });
  }
};

const deleteQuote = async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM quotes WHERE id = $1', [id]);
    res.json({ message: 'Quote deleted successfully' });
  } catch (error) {
    console.error('Delete quote error:', error);
    res.status(500).json({ error: 'Failed to delete quote' });
  }
};

const acceptQuote = async (req, res) => {
  try {
    const { id } = req.params;
    await query(
      `UPDATE quotes SET status = 'accepted' WHERE id = $1`,
      [id]
    );
    res.json({ message: 'Quote accepted successfully' });
  } catch (error) {
    console.error('Accept quote error:', error);
    res.status(500).json({ error: 'Failed to accept quote' });
  }
};

const rejectQuote = async (req, res) => {
  try {
    const { id } = req.params;
    await query(
      `UPDATE quotes SET status = 'rejected' WHERE id = $1`,
      [id]
    );
    res.json({ message: 'Quote rejected successfully' });
  } catch (error) {
    console.error('Reject quote error:', error);
    res.status(500).json({ error: 'Failed to reject quote' });
  }
};

module.exports = {
  getAllQuotes,
  getQuoteById,
  createQuote,
  updateQuote,
  deleteQuote,
  acceptQuote,
  rejectQuote
};
