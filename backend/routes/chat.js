import express from 'express';
import { sendMessage, getThread } from '../controllers/chat.controller.js';

const router = express.Router();

router.post('/', sendMessage);
router.get('/:threadId', getThread);

export default router;
