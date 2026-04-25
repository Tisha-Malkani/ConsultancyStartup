import express from 'express';
import { getBlogs, getBlogById, createBlog } from '../controllers/blogController.js';

const router = express.Router();

router.route('/')
  .get(getBlogs)
  .post(createBlog); // Should ideally be protected with middleware, but simple for now

router.route('/:id')
  .get(getBlogById);

export default router;
