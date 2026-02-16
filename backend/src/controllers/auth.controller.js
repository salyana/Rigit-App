const { query } = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { sign } = require('../config/jwt');

const SALT_ROUNDS = 10;

const register = async (req, res) => {
  try {
    const { email, password, name, role = 'customer' } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password and name are required' });
    }

    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const userId = uuidv4();

    await query(
      `INSERT INTO users (id, email, name, role, password_hash, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      [userId, email, name, role, password_hash]
    );

    const user = { id: userId, email, name, role };
    const token = sign({ id: userId, email });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await query(
      'SELECT id, email, name, role, password_hash FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const userRow = result.rows[0];
    if (!userRow.password_hash) {
      return res.status(401).json({ error: 'Account uses external login. Use password reset or contact support.' });
    }

    const valid = await bcrypt.compare(password, userRow.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = { id: userRow.id, email: userRow.email, name: userRow.name, role: userRow.role };
    const token = sign({ id: userRow.id, email: userRow.email });

    res.json({
      message: 'Login successful',
      token,
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

const logout = async (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

const refreshToken = async (req, res) => {
  res.status(501).json({ error: 'Refresh token not implemented for local auth' });
};

const forgotPassword = async (req, res) => {
  res.status(501).json({ error: 'Password reset not implemented. Contact support.' });
};

const resetPassword = async (req, res) => {
  res.status(501).json({ error: 'Password reset not implemented. Contact support.' });
};

const getMe = async (req, res) => {
  try {
    const result = await query(
      'SELECT id, email, name, role, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  getMe
};
