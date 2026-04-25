import express from 'express';
import { registerUser, loginUser, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { createRateLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();
const authRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 10,
  message: 'Too many authentication attempts. Please wait a few minutes and try again.',
});

router.post('/register', authRateLimit, registerUser);
router.post('/login', authRateLimit, loginUser);
router.get('/me', protect, getMe);

export default router;
