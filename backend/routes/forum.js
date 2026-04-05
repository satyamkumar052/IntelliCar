import express from 'express';
import { getPosts, createPost, getPostById, addReply, resolvePost } from '../controllers/forumController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getPosts)
  .post(protect, createPost);

router.route('/:id')
  .get(protect, getPostById);

router.route('/:id/reply')
  .post(protect, addReply);

router.route('/:id/resolve')
  .put(protect, resolvePost);

export default router;
