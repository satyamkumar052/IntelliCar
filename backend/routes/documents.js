import express from 'express';
const router = express.Router();
import { uploadDocument, getDocuments, deleteDocument } from '../controllers/documentController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

router.route('/:carId')
  .get(protect, getDocuments)
  .post(protect, upload.single('file'), uploadDocument);

router.route('/:id')
  .delete(protect, deleteDocument);

export default router;
