import express from "express";
import { getPayments, addPayment } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route('/')
  .get(protect, getPayments)
  .post(protect, addPayment);

export default router;
