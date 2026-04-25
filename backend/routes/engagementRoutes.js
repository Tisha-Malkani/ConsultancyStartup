import express from 'express';
import { getMyEngagement } from '../controllers/engagementController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my', protect, getMyEngagement);

export default router;
