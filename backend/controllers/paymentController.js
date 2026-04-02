import Payment from '../models/Payment.js';
import Car from '../models/Car.js';

// @desc    Get all payments for a user
// @route   GET /api/payments
// @access  Private
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
                                  .populate('car')
                                  .sort({ date: -1 });
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a payment record
// @route   POST /api/payments
// @access  Private
const addPayment = async (req, res) => {
  try {
    const { carId, amount, currency, paymentType, status, transactionId } = req.body;

    // Verify car belongs to user if provided
    if (carId) {
      const car = await Car.findById(carId);
      if (!car || car.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ success: false, message: 'Not authorized for this car' });
      }
    }

    const payment = await Payment.create({
      user: req.user._id,
      car: carId || null,
      amount,
      currency: currency || 'INR',
      paymentType,
      status: status || 'completed',
      transactionId: transactionId || `TXN-${Date.now()}`
    });

    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getPayments, addPayment };
