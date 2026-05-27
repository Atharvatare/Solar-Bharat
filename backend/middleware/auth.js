import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../config/config.js';
import { ApiError } from '../utils/helpers.js';
import { HTTP_STATUS } from '../utils/constants.js';

// Protect routes — verify JWT
export const protect = async (req, res, next) => {
  try {
    let token;

    // Extract token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Access denied. No token provided.');
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);

    // Get user from token
    const user = await User.findById(decoded.id).select('-password -refreshToken');
    
    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User not found. Token is invalid.');
    }

    if (!user.isActive) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Account has been deactivated.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid token.'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Token expired. Please refresh.'));
    }
    next(error);
  }
};

// Optional auth — doesn't fail if no token, but attaches user if present
export const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, config.jwt.secret);
      req.user = await User.findById(decoded.id).select('-password -refreshToken');
    }
  } catch (error) {
    // Silently continue without user
  }
  next();
};
