import { body } from 'express-validator';

export const updateProfileValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[+]?91?\s?[6-9]\d{9}$/).withMessage('Invalid phone number'),
  body('location.city')
    .optional()
    .trim()
    .isLength({ max: 50 }),
  body('location.state')
    .optional()
    .trim()
    .isLength({ max: 50 }),
  body('location.pincode')
    .optional()
    .trim()
    .matches(/^\d{6}$/).withMessage('Pincode must be 6 digits'),
];

export const updatePreferencesValidator = [
  body('preferences.language')
    .optional()
    .isIn(['en', 'hi', 'ta', 'bn', 'mr', 'te', 'gu']).withMessage('Invalid language'),
  body('preferences.notifications.email')
    .optional()
    .isBoolean(),
  body('preferences.notifications.push')
    .optional()
    .isBoolean(),
  body('preferences.notifications.sms')
    .optional()
    .isBoolean(),
];
