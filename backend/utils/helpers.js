import { HTTP_STATUS } from './constants.js';

// Custom API Error class
export class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Standard success response
export const sendSuccess = (res, data = null, message = 'Success', statusCode = HTTP_STATUS.OK) => {
  const response = {
    success: true,
    message,
  };
  if (data !== null) response.data = data;
  return res.status(statusCode).json(response);
};

// Standard paginated response
export const sendPaginated = (res, data, pagination, message = 'Success') => {
  return res.status(HTTP_STATUS.OK).json({
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      pages: Math.ceil(pagination.total / pagination.limit),
    },
  });
};

// Standard error response
export const sendError = (res, statusCode, message, errors = []) => {
  const response = {
    success: false,
    message,
  };
  if (errors.length > 0) response.errors = errors;
  return res.status(statusCode).json(response);
};

// Calculate pagination params from query
export const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

// Generate sort object from query
export const getSortFromQuery = (query, allowedFields = []) => {
  if (!query.sort) return { createdAt: -1 };
  
  const sort = {};
  const fields = query.sort.split(',');
  
  fields.forEach((field) => {
    const direction = field.startsWith('-') ? -1 : 1;
    const fieldName = field.replace(/^-/, '');
    if (allowedFields.length === 0 || allowedFields.includes(fieldName)) {
      sort[fieldName] = direction;
    }
  });
  
  return Object.keys(sort).length ? sort : { createdAt: -1 };
};

// Async handler wrapper (eliminates try/catch in controllers)
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Generate random OTP
export const generateOTP = (length = 6) => {
  return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)).toString();
};

// Sanitize user object (remove sensitive fields)
export const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  delete obj.refreshToken;
  delete obj.emailVerificationToken;
  delete obj.emailVerificationExpire;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpire;
  delete obj.loginAttempts;
  delete obj.lockUntil;
  delete obj.passwordChangedAt;
  delete obj.__v;
  return obj;
};
