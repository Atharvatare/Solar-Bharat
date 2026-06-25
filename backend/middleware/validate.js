/**
 * Request Validation Middleware — Phase 13
 * Validates incoming request bodies against defined schemas
 * Prevents malformed data from reaching controllers
 */
import { ApiError } from '../utils/helpers.js';
import { HTTP_STATUS } from '../utils/constants.js';

/**
 * Generic validation middleware factory
 * @param {Object} schema - { field: { type, required, min, max, match, enum, custom } }
 * @param {'body'|'query'|'params'} source - request property to validate
 */
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const data = req[source];
    const errors = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = data?.[field];

      // Required check
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} is required`);
        continue;
      }

      // Skip optional empty fields
      if (value === undefined || value === null || value === '') continue;

      // Type check
      if (rules.type === 'string' && typeof value !== 'string') {
        errors.push(`${field} must be a string`);
      } else if (rules.type === 'number' && (typeof value !== 'number' || isNaN(value))) {
        errors.push(`${field} must be a number`);
      } else if (rules.type === 'boolean' && typeof value !== 'boolean') {
        errors.push(`${field} must be a boolean`);
      } else if (rules.type === 'array' && !Array.isArray(value)) {
        errors.push(`${field} must be an array`);
      } else if (rules.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.push(`${field} must be a valid email`);
      }

      // String length
      if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters`);
      }
      if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
        errors.push(`${field} must not exceed ${rules.maxLength} characters`);
      }

      // Number range
      if (rules.min !== undefined && typeof value === 'number' && value < rules.min) {
        errors.push(`${field} must be at least ${rules.min}`);
      }
      if (rules.max !== undefined && typeof value === 'number' && value > rules.max) {
        errors.push(`${field} must not exceed ${rules.max}`);
      }

      // Pattern match
      if (rules.match && !rules.match.test(value)) {
        errors.push(`${field} format is invalid`);
      }

      // Enum validation
      if (rules.enum && !rules.enum.includes(value)) {
        errors.push(`${field} must be one of: ${rules.enum.join(', ')}`);
      }

      // Array max length
      if (rules.maxItems && Array.isArray(value) && value.length > rules.maxItems) {
        errors.push(`${field} must not exceed ${rules.maxItems} items`);
      }
    }

    if (errors.length > 0) {
      return next(new ApiError(HTTP_STATUS.BAD_REQUEST, errors.join('. ')));
    }

    next();
  };
};

// ============================================
// Pre-built Validation Schemas
// ============================================

export const registerSchema = {
  name: { type: 'string', required: true, minLength: 2, maxLength: 50 },
  email: { type: 'email', required: true },
  password: { type: 'string', required: true, minLength: 8, maxLength: 128 },
};

export const loginSchema = {
  email: { type: 'email', required: true },
  password: { type: 'string', required: true },
};

export const leadSchema = {
  name: { type: 'string', required: true, minLength: 2, maxLength: 100 },
  email: { type: 'email', required: true },
  source: { type: 'string', enum: ['website', 'referral', 'social_media', 'advertisement', 'walk_in', 'partner', 'other'] },
  priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
};

export const quotationSchema = {
  systemSize: { type: 'number', required: true, min: 0.5, max: 500 },
  totalCost: { type: 'number', required: true, min: 0 },
  netCost: { type: 'number', required: true, min: 0 },
};

export const bookingSchema = {
  bookingType: { type: 'string', required: true, enum: ['site_survey', 'installation', 'maintenance', 'repair', 'inspection'] },
  scheduledDate: { type: 'string', required: true },
  timeSlot: { type: 'string', enum: ['morning', 'afternoon', 'evening'] },
};

export const compareSchema = {
  productIds: { type: 'array', required: true, maxItems: 4 },
};
