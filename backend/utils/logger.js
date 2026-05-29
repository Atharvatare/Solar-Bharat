import winston from 'winston';
import config from '../config/config.js';

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const isVercel = process.env.VERCEL || process.env.NODE_ENV === 'production';

const transportsList = [
  // Console transport
  new winston.transports.Console({
    format: combine(colorize(), logFormat),
  })
];

// ONLY add file transports if NOT running on Vercel (Vercel filesystem is read-only)
if (!isVercel) {
  transportsList.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880,
      maxFiles: 5,
    })
  );
}

const logger = winston.createLogger({
  level: config.logLevel,
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  defaultMeta: { service: 'solar-bharat' },
  transports: transportsList,
});

export default logger;
