import { body } from 'express-validator';
import { PANEL_TYPES } from '../utils/constants.js';

export const calculateValidator = [
  body('roofArea')
    .notEmpty().withMessage('Roof area is required')
    .isFloat({ min: 50, max: 50000 }).withMessage('Roof area must be 50-50,000 sq ft'),
  body('monthlyBill')
    .notEmpty().withMessage('Monthly bill is required')
    .isFloat({ min: 100, max: 500000 }).withMessage('Monthly bill must be ₹100-₹5,00,000'),
  body('electricityRate')
    .notEmpty().withMessage('Electricity rate is required')
    .isFloat({ min: 1, max: 30 }).withMessage('Rate must be ₹1-₹30 per unit'),
  body('sunlightHours')
    .optional()
    .isFloat({ min: 2, max: 10 }).withMessage('Sunlight hours must be 2-10'),
  body('location.city')
    .optional()
    .trim(),
  body('panelType')
    .optional()
    .isIn(Object.values(PANEL_TYPES)).withMessage('Invalid panel type'),
  body('includeSubsidy')
    .optional()
    .isBoolean(),
];

export const rooftopAnalysisValidator = [
  body('address')
    .notEmpty().withMessage('Address is required')
    .trim()
    .isLength({ min: 5, max: 200 }).withMessage('Address must be 5-200 characters'),
  body('roofArea')
    .optional()
    .isFloat({ min: 50, max: 50000 }),
  body('pincode')
    .optional()
    .matches(/^\d{6}$/).withMessage('Pincode must be 6 digits'),
];
