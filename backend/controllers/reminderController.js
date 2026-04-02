import Reminder from '../models/Reminder.js';

// @desc    Get all active reminders for user
// @route   GET /api/reminders
// @access  Private
const getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user._id })
                                    .populate('car document')
                                    .sort({ dueDate: 1 });
    res.json({ success: true, data: reminders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a manual reminder
// @route   POST /api/reminders
// @access  Private
const addReminder = async (req, res) => {
  try {
    const { documentId, carId, title, description, dueDate } = req.body;

    const reminder = await Reminder.create({
      user: req.user._id,
      document: documentId,
      car: carId,
      title,
      description,
      dueDate
    });

    res.status(201).json({ success: true, data: reminder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a reminder
// @route   DELETE /api/reminders/:id
// @access  Private
const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({ success: false, message: 'Reminder not found' });
    }

    if (reminder.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await reminder.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getReminders, addReminder, deleteReminder };
