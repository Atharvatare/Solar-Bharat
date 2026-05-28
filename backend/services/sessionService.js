import Session from '../models/Session.js';
import config from '../config/config.js';
import logger from '../utils/logger.js';

/**
 * Parse user agent string into device info
 */
export const parseDevice = (req) => {
  const ua = req.headers['user-agent'] || 'Unknown';
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || '0.0.0.0';

  let browser = 'Unknown';
  let os = 'Unknown';

  // Browser detection
  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';

  // OS detection
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac OS')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  return { browser, os, ip, userAgent: ua };
};

/**
 * Create a new session for user
 */
export const createSession = async (userId, refreshToken, req) => {
  const device = parseDevice(req);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  // Enforce max active sessions — remove oldest if limit reached
  const activeSessions = await Session.countDocuments({ userId, isActive: true });
  
  if (activeSessions >= config.security.maxActiveSessions) {
    // Deactivate oldest session
    const oldest = await Session.findOne({ userId, isActive: true }).sort({ createdAt: 1 });
    if (oldest) {
      oldest.isActive = false;
      await oldest.save();
      logger.info(`Evicted oldest session for user ${userId}`);
    }
  }

  const session = await Session.create({
    userId,
    refreshToken,
    device,
    expiresAt,
    lastActivity: new Date(),
  });

  return session;
};

/**
 * Get all active sessions for a user
 */
export const getActiveSessions = async (userId) => {
  return await Session.find({ userId, isActive: true })
    .select('device lastActivity createdAt')
    .sort({ lastActivity: -1 });
};

/**
 * Invalidate a specific session
 */
export const invalidateSession = async (sessionId, userId) => {
  return await Session.findOneAndUpdate(
    { _id: sessionId, userId },
    { isActive: false },
    { new: true }
  );
};

/**
 * Invalidate all sessions for a user (logout all devices)
 */
export const invalidateAllSessions = async (userId) => {
  const result = await Session.updateMany(
    { userId, isActive: true },
    { isActive: false }
  );
  logger.info(`Invalidated ${result.modifiedCount} sessions for user ${userId}`);
  return result.modifiedCount;
};

/**
 * Invalidate session by refresh token
 */
export const invalidateSessionByToken = async (refreshToken) => {
  return await Session.findOneAndUpdate(
    { refreshToken, isActive: true },
    { isActive: false },
    { new: true }
  );
};

/**
 * Validate a session (exists, active, not expired, and update lastActivity)
 */
export const validateSession = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken, isActive: true });

  if (!session) return null;

  // Check session timeout
  const timeout = config.security.sessionTimeout;
  if (Date.now() - session.lastActivity.getTime() > timeout) {
    session.isActive = false;
    await session.save();
    return null;
  }

  // Update lastActivity
  session.lastActivity = new Date();
  await session.save();

  return session;
};

/**
 * Cleanup expired sessions (called periodically)
 */
export const cleanupExpiredSessions = async () => {
  const result = await Session.deleteMany({
    $or: [
      { expiresAt: { $lt: new Date() } },
      { isActive: false, updatedAt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    ],
  });
  if (result.deletedCount > 0) {
    logger.info(`Cleaned up ${result.deletedCount} expired sessions`);
  }
};

export default {
  parseDevice,
  createSession,
  getActiveSessions,
  invalidateSession,
  invalidateAllSessions,
  invalidateSessionByToken,
  validateSession,
  cleanupExpiredSessions,
};
