import express from 'express';
import { getCaseStudies, getCaseStudyById } from '../controllers/caseStudyController.js';

const router = express.Router();

router.get('/', getCaseStudies);
router.get('/:id', getCaseStudyById);

export default router;
