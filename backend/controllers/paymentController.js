import Payment from '../models/Payment.js';
import Car from '../models/Car.js';

// @desc    Get all payments for a user (with optional type filter)
// @route   GET /api/payments
// @access  Private
const getPayments = async (req, res) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.type) filter.paymentType = req.query.type;
    if (req.query.status) filter.status = req.query.status;

    const payments = await Payment.find(filter)
                                  .populate('car', 'make model year registrationNumber')
                                  .sort({ date: -1 });
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get payment stats / summary for a user
// @route   GET /api/payments/stats
// @access  Private
const getPaymentStats = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id });

    const totalSpent = payments.reduce((sum, p) => sum + p.amount, 0);
    const byType = {};
    const TYPES = ['Service', 'Challan', 'Insurance', 'RoadTax', 'Other'];
    TYPES.forEach(t => {
      byType[t] = payments.filter(p => p.paymentType === t)
                          .reduce((s, p) => s + p.amount, 0);
    });

    const thisMonth = new Date();
    thisMonth.setDate(1); thisMonth.setHours(0, 0, 0, 0);
    const monthlySpent = payments
      .filter(p => new Date(p.date) >= thisMonth)
      .reduce((s, p) => s + p.amount, 0);

    res.json({
      success: true,
      data: { totalSpent, byType, monthlySpent, count: payments.length }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a payment record
// @route   POST /api/payments
// @access  Private
const addPayment = async (req, res) => {
  try {
    const { carId, amount, currency, paymentType, status, transactionId, note, date } = req.body;

    if (carId) {
      const car = await Car.findById(carId);
      if (!car || car.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ success: false, message: 'Not authorized for this car' });
      }
    }

    const payment = await Payment.create({
      user: req.user._id,
      car: carId || null,
      amount: parseFloat(amount),
      currency: currency || 'INR',
      paymentType,
      status: status || 'completed',
      transactionId: transactionId || `TXN-${Date.now()}`,
      note: note || '',
      date: date ? new Date(date) : new Date()
    });

    const populated = await payment.populate('car', 'make model year registrationNumber');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a payment record
// @route   DELETE /api/payments/:id
// @access  Private
const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    if (payment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    await payment.deleteOne();
    res.json({ success: true, message: 'Payment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getPayments, getPaymentStats, addPayment, deletePayment };
