import express from 'express';
import { createBooking } from '../controllers/bookingController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', optionalAuth, createBooking);

export default router;
