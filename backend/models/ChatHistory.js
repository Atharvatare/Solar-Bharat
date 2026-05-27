import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: 5000,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    messages: [messageSchema],
    topic: {
      type: String,
      default: 'General',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    messageCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

chatHistorySchema.index({ userId: 1, createdAt: -1 });

// Update message count on save
chatHistorySchema.pre('save', function (next) {
  this.messageCount = this.messages.length;
  next();
});

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);
export default ChatHistory;
