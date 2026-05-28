import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import TokenBlacklist from '../models/TokenBlacklist.js';
import config from '../config/config.js';
import { ApiError } from '../utils/helpers.js';
import { HTTP_STATUS } from '../utils/constants.js';

/**
 * Protect routes — verify JWT, check blacklist, validate user
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Extract token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Access denied. No token provided.');
    }

    // 2. Check if token is blacklisted (logged out / revoked)
    const isBlacklisted = await TokenBlacklist.findOne({ token });
    if (isBlacklisted) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Token has been revoked. Please log in again.');
    }

    // 3. Verify token
    const decoded = jwt.verify(token, config.jwt.secret, {
      issuer: 'solar-bharat',
      audience: 'solar-bharat-client',
    });

    // 4. Check if user exists and is active
    const user = await User.findById(decoded.id).select('-refreshToken');
    
    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User no longer exists.');
    }

    if (!user.isActive) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Account has been deactivated. Contact support.');
    }

    // 5. Check if password was changed after token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Password recently changed. Please log in again.');
    }

    // 6. Attach user and token to request
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid token. Authentication failed.'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Token expired. Please refresh your session.'));
    }
    next(error);
  }
};

/**
 * Optional auth — attaches user if valid token present, continues regardless
 */
export const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const isBlacklisted = await TokenBlacklist.findOne({ token });
      if (!isBlacklisted) {
        const decoded = jwt.verify(token, config.jwt.secret, {
          issuer: 'solar-bharat',
          audience: 'solar-bharat-client',
        });
        req.user = await User.findById(decoded.id).select('-password -refreshToken');
      }
    }
  } catch (error) {
    // Silently continue without user
  }
  next();
};

/**
 * Require verified email
 */
export const requireVerifiedEmail = (req, res, next) => {
  if (!req.user.emailVerified) {
    return next(
      new ApiError(
        HTTP_STATUS.FORBIDDEN,
        'Please verify your email address before accessing this resource. Check your inbox for the verification link.'
      )
    );
  }
  next();
};
