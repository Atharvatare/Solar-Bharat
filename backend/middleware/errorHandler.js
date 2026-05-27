import logger from '../utils/logger.js';
import { HTTP_STATUS } from '../utils/constants.js';

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || HTTP_STATUS.SERVER_ERROR;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Validation Error';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = HTTP_STATUS.CONFLICT;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for field: ${field}. This ${field} already exists.`;
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Invalid token. Please log in again.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Your session has expired. Please log in again.';
  }

  // Multer file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'File too large. Maximum allowed size is 10MB.';
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Unexpected file field.';
  }

  // Log the error
  if (statusCode >= 500) {
    logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`, {
      stack: err.stack,
    });
  } else {
    logger.warn(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method}`);
  }

  // Send response
  const response = {
    success: false,
    message,
  };

  if (errors.length > 0) {
    response.errors = errors;
  }

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development' && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

// 404 handler
export const notFound = (req, res, next) => {
  const message = `Route not found: ${req.method} ${req.originalUrl}`;
  logger.warn(message);
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message,
  });
};

export default errorHandler;
