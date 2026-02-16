const { query } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const getAllBookings = async (req, res) => {
  try {
    const result = await query('SELECT * FROM bookings ORDER BY created_at DESC');
    res.json({ bookings: result.rows });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM bookings WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ booking: result.rows[0] });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};

const createBooking = async (req, res) => {
  try {
    const { quote_id, start_date, end_date } = req.body;
    const bookingId = uuidv4();

    await query(
      `INSERT INTO bookings (id, quote_id, start_date, end_date, status, created_at)
       VALUES ($1, $2, $3, $4, 'pending', NOW())`,
      [bookingId, quote_id, start_date, end_date]
    );

    res.status(201).json({ message: 'Booking created successfully', id: bookingId });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { start_date, end_date, status } = req.body;

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (start_date) {
      updates.push(`start_date = $${paramCount++}`);
      values.push(start_date);
    }
    if (end_date) {
      updates.push(`end_date = $${paramCount++}`);
      values.push(end_date);
    }
    if (status) {
      updates.push(`status = $${paramCount++}`);
      values.push(status);
    }

    values.push(id);
    await query(
      `UPDATE bookings SET ${updates.join(', ')} WHERE id = $${paramCount}`,
      values
    );

    res.json({ message: 'Booking updated successfully' });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM bookings WHERE id = $1', [id]);
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    await query(
      `UPDATE bookings SET status = 'cancelled' WHERE id = $1`,
      [id]
    );
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  cancelBooking
};
