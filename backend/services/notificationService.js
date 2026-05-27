import Notification from '../models/Notification.js';
import { NOTIFICATION_TYPES } from '../utils/constants.js';

/**
 * Create a notification for a user
 */
export const createNotification = async (userId, { type, title, message, actionUrl, metadata }) => {
  const notification = await Notification.create({
    userId,
    type: type || NOTIFICATION_TYPES.SYSTEM,
    title,
    message,
    actionUrl,
    metadata,
  });
  return notification;
};

/**
 * Send welcome notification to new user
 */
export const sendWelcomeNotification = async (userId, userName) => {
  return createNotification(userId, {
    type: NOTIFICATION_TYPES.WELCOME,
    title: 'Welcome to Solar Bharat! ☀️',
    message: `Hi ${userName}, welcome aboard! Start by uploading your electricity bill to get a personalized solar recommendation.`,
    actionUrl: '/dashboard/bill-upload',
  });
};

/**
 * Send bill analyzed notification
 */
export const sendBillAnalyzedNotification = async (userId, billId, savings) => {
  return createNotification(userId, {
    type: NOTIFICATION_TYPES.BILLING,
    title: 'Bill Analysis Complete',
    message: `Your electricity bill has been analyzed. Estimated savings: ₹${savings}/month with solar.`,
    actionUrl: `/dashboard/bill-upload`,
    metadata: { billId },
  });
};

/**
 * Send savings milestone notification
 */
export const sendSavingsMilestoneNotification = async (userId, amount) => {
  return createNotification(userId, {
    type: NOTIFICATION_TYPES.SAVINGS,
    title: '🎉 Savings Milestone!',
    message: `Congratulations! You've saved ₹${amount.toLocaleString('en-IN')} with solar energy so far!`,
    actionUrl: '/dashboard/analytics',
  });
};

/**
 * Send maintenance reminder
 */
export const sendMaintenanceReminder = async (userId) => {
  return createNotification(userId, {
    type: NOTIFICATION_TYPES.MAINTENANCE,
    title: 'Maintenance Reminder',
    message: 'Your solar panels are due for cleaning. Regular cleaning maintains optimal performance.',
    actionUrl: '/dashboard/settings',
  });
};

export default {
  createNotification,
  sendWelcomeNotification,
  sendBillAnalyzedNotification,
  sendSavingsMilestoneNotification,
  sendMaintenanceReminder,
};
