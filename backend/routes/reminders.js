import express from 'express';
import { getReminders, addReminder, deleteReminder } from '../controllers/reminderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getReminders)
  .post(protect, addReminder);

router.route('/:id')
  .delete(protect, deleteReminder);

export default router;
