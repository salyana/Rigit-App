const { query } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const getAllPayments = async (req, res) => {
  try {
    const result = await query('SELECT * FROM payments ORDER BY created_at DESC');
    res.json({ payments: result.rows });
  } catch (error) {
    console.error('Get all payments error:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM payments WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({ payment: result.rows[0] });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
};

const createPayment = async (req, res) => {
  try {
    const { booking_id, amount, stripe_payment_id } = req.body;
    const paymentId = uuidv4();

    await query(
      `INSERT INTO payments (id, booking_id, amount, stripe_payment_id, status, created_at)
       VALUES ($1, $2, $3, $4, 'pending', NOW())`,
      [paymentId, booking_id, amount, stripe_payment_id]
    );

    res.status(201).json({ message: 'Payment created successfully', id: paymentId });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
};

const handleWebhook = async (req, res) => {
  try {
    // This would handle Stripe webhook events
    const { type, data } = req.body;

    if (type === 'payment_intent.succeeded') {
      const stripePaymentId = data.object.id;
      await query(
        `UPDATE payments SET status = 'completed' WHERE stripe_payment_id = $1`,
        [stripePaymentId]
      );
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

const processRefund = async (req, res) => {
  try {
    const { id } = req.params;
    await query(
      `UPDATE payments SET status = 'refunded' WHERE id = $1`,
      [id]
    );
    res.json({ message: 'Refund processed successfully' });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ error: 'Failed to process refund' });
  }
};

module.exports = {
  getAllPayments,
  getPaymentById,
  createPayment,
  handleWebhook,
  processRefund
};
