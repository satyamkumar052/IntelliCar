import express from 'express';
import { getPosts, createPost, getPostById, addReply } from '../controllers/forumController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getPosts)
  .post(protect, createPost);

router.route('/:id')
  .get(protect, getPostById);

router.route('/:id/reply')
  .post(protect, addReply);

export default router;
