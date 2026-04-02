const mongoose = require('mongoose');

const serviceRecordSchema = new mongoose.Schema({
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceCenterName: { type: String, required: true },
  serviceDate: { type: Date, required: true },
  odometerReading: { type: Number },
  totalCost: { type: Number },
  description: { type: String },
  nextServiceDueDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('ServiceRecord', serviceRecordSchema);
