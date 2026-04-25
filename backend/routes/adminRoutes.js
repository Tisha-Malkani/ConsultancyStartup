import express from 'express';
import { createEngagement, getAdminOverview, updateEngagement } from '../controllers/adminController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/overview', protect, adminOnly, getAdminOverview);
router.post('/engagements', protect, adminOnly, createEngagement);
router.put('/engagements/:id', protect, adminOnly, updateEngagement);

export default router;
