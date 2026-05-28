import config from '../config/config.js';
import logger from '../utils/logger.js';

/**
 * Email Service
 * In development: logs email content to console (simulated)
 * In production: sends via SMTP (nodemailer) — configure EMAIL_* env vars
 */

/**
 * Send an email
 * @param {Object} options - { to, subject, html, text }
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  if (config.env === 'production' && config.email.host) {
    // Production: Use nodemailer (install separately if needed)
    try {
      // Dynamic import so nodemailer is only required in production
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.default.createTransport({
        host: config.email.host,
        port: config.email.port,
        secure: config.email.port === 465,
        auth: {
          user: config.email.user,
          pass: config.email.pass,
        },
      });

      await transporter.sendMail({
        from: `"${config.appName}" <${config.email.from}>`,
        to,
        subject,
        html,
        text,
      });

      logger.info(`Email sent to ${to}: ${subject}`);
      return true;
    } catch (error) {
      logger.error(`Email send failed: ${error.message}`);
      throw error;
    }
  } else {
    // Development: Simulate email by logging
    logger.info(`
╔══════════════════════════════════════════════╗
║  📧 SIMULATED EMAIL (Dev Mode)               ║
╠══════════════════════════════════════════════╣
║  To:      ${to.padEnd(35)}║
║  Subject: ${subject.padEnd(35)}║
╠══════════════════════════════════════════════╣
${text ? `║  ${text.substring(0, 120).padEnd(45)}║` : ''}
╚══════════════════════════════════════════════╝
    `);
    return true;
  }
};

/**
 * Send email verification email
 */
export const sendVerificationEmail = async (email, name, token) => {
  const verifyUrl = `${config.frontendUrl}/verify-email?token=${token}`;
  
  await sendEmail({
    to: email,
    subject: '☀️ Verify Your Solar Bharat Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 40px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #f59e0b; font-size: 28px;">☀️ Solar Bharat</h1>
        </div>
        <h2 style="color: #f8fafc;">Welcome, ${name}!</h2>
        <p style="font-size: 16px; line-height: 1.6;">
          Thank you for registering. Please verify your email address to activate your account.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: #0f172a; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p style="font-size: 14px; color: #94a3b8;">
          This link expires in <strong>24 hours</strong>.
        </p>
        <p style="font-size: 14px; color: #94a3b8;">
          If you didn't create this account, please ignore this email.
        </p>
        <hr style="border: 1px solid #1e293b; margin: 30px 0;">
        <p style="font-size: 12px; color: #64748b; text-align: center;">
          Verification Token (dev): <code style="background: #1e293b; padding: 4px 8px; border-radius: 4px;">${token}</code>
        </p>
      </div>
    `,
    text: `Welcome to Solar Bharat, ${name}! Verify your email: ${verifyUrl} (Expires in 24 hours). Token: ${token}`,
  });
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (email, name, token) => {
  const resetUrl = `${config.frontendUrl}/reset-password?token=${token}`;

  await sendEmail({
    to: email,
    subject: '🔐 Reset Your Solar Bharat Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 40px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #f59e0b; font-size: 28px;">☀️ Solar Bharat</h1>
        </div>
        <h2 style="color: #f8fafc;">Password Reset Request</h2>
        <p style="font-size: 16px; line-height: 1.6;">
          Hi ${name}, we received a request to reset your password. Click the button below to proceed.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: #0f172a; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="font-size: 14px; color: #94a3b8;">
          This link expires in <strong>1 hour</strong>.
        </p>
        <p style="font-size: 14px; color: #94a3b8;">
          If you didn't request this, please ignore this email. Your password will remain unchanged.
        </p>
        <hr style="border: 1px solid #1e293b; margin: 30px 0;">
        <p style="font-size: 12px; color: #64748b; text-align: center;">
          Reset Token (dev): <code style="background: #1e293b; padding: 4px 8px; border-radius: 4px;">${token}</code>
        </p>
      </div>
    `,
    text: `Password reset for Solar Bharat. Reset link: ${resetUrl} (Expires in 1 hour). Token: ${token}`,
  });
};

/**
 * Send login alert email
 */
export const sendLoginAlertEmail = async (email, name, device) => {
  await sendEmail({
    to: email,
    subject: '🔔 New Login to Solar Bharat',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 40px; border-radius: 16px;">
        <h1 style="color: #f59e0b;">☀️ Solar Bharat</h1>
        <h2>New Login Detected</h2>
        <p>Hi ${name}, a new login was detected on your account:</p>
        <div style="background: #1e293b; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Browser:</strong> ${device.browser}</p>
          <p><strong>OS:</strong> ${device.os}</p>
          <p><strong>IP:</strong> ${device.ip}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
        </div>
        <p style="color: #94a3b8;">If this wasn't you, please change your password immediately.</p>
      </div>
    `,
    text: `New login detected on your Solar Bharat account from ${device.browser} on ${device.os} (IP: ${device.ip}).`,
  });
};

/**
 * Send account locked email
 */
export const sendAccountLockedEmail = async (email, name, minutes) => {
  await sendEmail({
    to: email,
    subject: '⚠️ Solar Bharat Account Temporarily Locked',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 40px; border-radius: 16px;">
        <h1 style="color: #f59e0b;">☀️ Solar Bharat</h1>
        <h2 style="color: #ef4444;">Account Locked</h2>
        <p>Hi ${name}, your account has been temporarily locked due to ${config.security.maxLoginAttempts} failed login attempts.</p>
        <p>Your account will be automatically unlocked in <strong>${minutes} minutes</strong>.</p>
        <p style="color: #94a3b8;">If this wasn't you, someone may be trying to access your account. Please reset your password once the lock expires.</p>
      </div>
    `,
    text: `Your Solar Bharat account is locked for ${minutes} minutes due to failed login attempts.`,
  });
};

export default {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendLoginAlertEmail,
  sendAccountLockedEmail,
};
