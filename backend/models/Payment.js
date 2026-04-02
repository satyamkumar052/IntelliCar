import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  paymentType: { 
    type: String, 
    enum: ['Service', 'Challan', 'Insurance', 'RoadTax', 'Other'],
    required: true
  },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  transactionId: { type: String },
  note: { type: String, default: '' },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

paymentSchema.index({ user: 1, date: -1 });

export default mongoose.model('Payment', paymentSchema);
