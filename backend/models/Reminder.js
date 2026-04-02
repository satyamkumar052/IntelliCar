import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, required: true },
  isRead: { type: Boolean, default: false },
  emailSent: { type: Boolean, default: false }
}, { timestamps: true });

reminderSchema.index({ user: 1, dueDate: 1 });

export default mongoose.model('Reminder', reminderSchema);
