import { AppError } from '../utils/errors.js';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  // Groq API errors
  if (err.status) {
    return res.status(err.status).json({
      error: err.message || 'AI service error',
      ...(process.env.NODE_ENV === 'development' && { details: err })
    });
  }

  // Default error
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { message: err.message })
  });
};
