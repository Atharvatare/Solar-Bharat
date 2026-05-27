import { ApiError } from '../utils/helpers.js';
import { HTTP_STATUS } from '../utils/constants.js';

// Role-based access control middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Authentication required.'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          HTTP_STATUS.FORBIDDEN,
          `Role '${req.user.role}' is not authorized to access this resource.`
        )
      );
    }

    next();
  };
};

// Check if user is the resource owner or admin
export const authorizeOwnerOrAdmin = (resourceUserIdField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Authentication required.'));
    }

    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];

    if (req.user.role === 'admin' || req.user._id.toString() === resourceUserId) {
      return next();
    }

    return next(
      new ApiError(HTTP_STATUS.FORBIDDEN, 'You do not have permission to access this resource.')
    );
  };
};
