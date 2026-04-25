import express from 'express';
import { healthCheck } from '../controllers/index.js';
import bookingRoutes from './bookingRoutes.js';
import caseStudyRoutes from './caseStudyRoutes.js';
import esgRoutes from './esgRoutes.js';
import authRoutes from './authRoutes.js';
import blogRoutes from './blogRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import adminRoutes from './adminRoutes.js';
import engagementRoutes from './engagementRoutes.js';

const router = express.Router();

// Basic health check route
router.get('/health', healthCheck);

// API Routes
router.use('/book', bookingRoutes);
router.use('/case-studies', caseStudyRoutes);
router.use('/esg', esgRoutes);
router.use('/auth', authRoutes);
router.use('/blogs', blogRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/admin', adminRoutes);
router.use('/engagements', engagementRoutes);

export default router;
