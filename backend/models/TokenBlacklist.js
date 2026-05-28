import mongoose from 'mongoose';

const tokenBlacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reason: {
      type: String,
      enum: ['logout', 'password_change', 'security', 'admin_revoke'],
      default: 'logout',
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // TTL — auto-cleanup after token natural expiry
    },
  },
  {
    timestamps: true,
  }
);

const TokenBlacklist = mongoose.model('TokenBlacklist', tokenBlacklistSchema);
export default TokenBlacklist;
