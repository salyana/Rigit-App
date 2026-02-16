/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // PostgreSQL errors
  if (err.code === '23505') {
    statusCode = 409;
    message = 'Duplicate entry';
  } else if (err.code === '23503') {
    statusCode = 400;
    message = 'Foreign key constraint violation';
  } else if (err.code === '23502') {
    statusCode = 400;
    message = 'Required field is missing';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
