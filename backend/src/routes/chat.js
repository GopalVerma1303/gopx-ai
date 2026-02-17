import express from 'express';
import { chatController } from '../controllers/chatController.js';
import { rateLimiter } from '../middleware/rateLimiter.js';
import { validateChatRequest } from '../middleware/validateRequest.js';

const router = express.Router();

// Apply rate limiting to all chat routes
router.use(rateLimiter);

// Chat endpoint with streaming support
router.post('/stream', validateChatRequest, chatController.streamChat);

// Non-streaming chat endpoint (fallback)
router.post('/', validateChatRequest, chatController.chat);

export { router as chatRouter };
