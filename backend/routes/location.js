import express from 'express';
import { getLocationServices } from '../controllers/locationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getLocationServices);

export default router;
