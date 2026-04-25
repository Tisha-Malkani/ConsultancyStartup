import express from 'express';
import { createBooking } from '../controllers/bookingController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';
import { createRateLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();
const bookingRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
  message: 'Too many booking requests. Please wait a few minutes before trying again.',
});

router.post('/', bookingRateLimit, optionalAuth, createBooking);

export default router;
