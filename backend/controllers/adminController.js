import User from '../models/User.js';
import Document from '../models/Document.js';
import Car from '../models/Car.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get system stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCars = await Car.countDocuments();
    const totalDocuments = await Document.countDocuments();
    
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const expiringThisWeek = await Document.countDocuments({
      expiryDate: { $lte: nextWeek, $gte: today }
    });

    res.json({ 
      success: true, 
      data: {
        totalUsers,
        totalCars,
        totalDocuments,
        expiringThisWeek
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent deleting other admins or self (optional, depending on business rules)
    if (user.role === 'admin' && user._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Cannot delete another admin' });
    }

    // Delete associated data
    await Car.deleteMany({ user: user._id });
    await Document.deleteMany({ user: user._id });

    await user.deleteOne();
    res.json({ success: true, message: 'User removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

