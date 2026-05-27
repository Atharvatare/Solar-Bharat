import { Router } from 'express';
import {
  sendMessage, getSessions, getSessionHistory, deleteSession, clearHistory,
} from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';
import { chatLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.use(protect);

router.post('/message', chatLimiter, sendMessage);
router.get('/sessions', getSessions);
router.get('/sessions/:sessionId', getSessionHistory);
router.delete('/sessions/:sessionId', deleteSession);
router.delete('/history', clearHistory);

export default router;
