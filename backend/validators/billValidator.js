import { body, query } from 'express-validator';

export const billUploadValidator = [
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
];

export const billQueryValidator = [
  query('status')
    .optional()
    .isIn(['pending', 'processing', 'analyzed', 'failed']).withMessage('Invalid status'),
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
];
