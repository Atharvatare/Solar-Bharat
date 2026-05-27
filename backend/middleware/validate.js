import { validationResult } from 'express-validator';
import { HTTP_STATUS } from '../utils/constants.js';

// Validation middleware — runs after express-validator checks
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
      value: err.value,
    }));

    return res.status(HTTP_STATUS.UNPROCESSABLE).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
    });
  }

  next();
};

export default validate;
