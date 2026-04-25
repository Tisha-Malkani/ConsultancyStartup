import express from 'express';
import { calculateESGScore } from '../controllers/esgController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', optionalAuth, calculateESGScore);

export default router;
