import ChatHistory from '../models/ChatHistory.js';
import { asyncHandler, sendSuccess, sendPaginated, ApiError, getPagination } from '../utils/helpers.js';
import { HTTP_STATUS } from '../utils/constants.js';
import { generateResponse, generateSessionId, classifyTopic } from '../ai-services/chatService.js';

/**
 * @desc    Send message to AI chat
 * @route   POST /api/chat/message
 * @access  Private
 */
export const sendMessage = asyncHandler(async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message || !message.trim()) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Message is required');
  }

  const activeSessionId = sessionId || generateSessionId();

  // Find or create chat session
  let chat = await ChatHistory.findOne({
    userId: req.user._id,
    sessionId: activeSessionId,
    isActive: true,
  });

  if (!chat) {
    chat = new ChatHistory({
      userId: req.user._id,
      sessionId: activeSessionId,
      messages: [],
      topic: classifyTopic(message),
    });
  }

  // Add user message
  chat.messages.push({
    role: 'user',
    content: message.trim(),
    timestamp: new Date(),
  });

  // Generate AI response
  const aiResponse = generateResponse(message);

  // Add AI response
  chat.messages.push({
    role: 'assistant',
    content: aiResponse,
    timestamp: new Date(),
  });

  // Update topic if more context
  chat.topic = classifyTopic(message) !== 'general' ? classifyTopic(message) : chat.topic;
  
  await chat.save();

  sendSuccess(res, {
    sessionId: activeSessionId,
    response: aiResponse,
    messageCount: chat.messageCount,
  });
});

/**
 * @desc    Get chat sessions
 * @route   GET /api/chat/sessions
 * @access  Private
 */
export const getSessions = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);

  const [sessions, total] = await Promise.all([
    ChatHistory.find({ userId: req.user._id })
      .select('sessionId topic messageCount createdAt updatedAt isActive')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit),
    ChatHistory.countDocuments({ userId: req.user._id }),
  ]);

  sendPaginated(res, sessions, { page, limit, total });
});

/**
 * @desc    Get chat history for a session
 * @route   GET /api/chat/sessions/:sessionId
 * @access  Private
 */
export const getSessionHistory = asyncHandler(async (req, res) => {
  const chat = await ChatHistory.findOne({
    userId: req.user._id,
    sessionId: req.params.sessionId,
  });

  if (!chat) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Chat session not found');
  }

  sendSuccess(res, { chat });
});

/**
 * @desc    Delete chat session
 * @route   DELETE /api/chat/sessions/:sessionId
 * @access  Private
 */
export const deleteSession = asyncHandler(async (req, res) => {
  const chat = await ChatHistory.findOneAndDelete({
    userId: req.user._id,
    sessionId: req.params.sessionId,
  });

  if (!chat) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Chat session not found');
  }

  sendSuccess(res, null, 'Chat session deleted');
});

/**
 * @desc    Clear all chat history
 * @route   DELETE /api/chat/history
 * @access  Private
 */
export const clearHistory = asyncHandler(async (req, res) => {
  await ChatHistory.deleteMany({ userId: req.user._id });
  sendSuccess(res, null, 'All chat history cleared');
});
