import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    refreshToken: {
      type: String,
      required: true,
      unique: true,
    },
    device: {
      browser: { type: String, default: 'Unknown' },
      os: { type: String, default: 'Unknown' },
      ip: { type: String, default: '0.0.0.0' },
      userAgent: { type: String },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // TTL — auto-delete expired sessions
    },
  },
  {
    timestamps: true,
  }
);

sessionSchema.index({ userId: 1, isActive: 1 });
sessionSchema.index({ refreshToken: 1 });

const Session = mongoose.model('Session', sessionSchema);
export default Session;
