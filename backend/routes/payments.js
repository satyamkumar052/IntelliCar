import express from "express";
import { getPayments, getPaymentStats, addPayment, deletePayment } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/stats', protect, getPaymentStats);

router.route('/')
  .get(protect, getPayments)
  .post(protect, addPayment);

router.route('/:id')
  .delete(protect, deletePayment);

export default router;
