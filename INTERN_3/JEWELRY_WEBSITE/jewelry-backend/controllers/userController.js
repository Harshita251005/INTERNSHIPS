const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const crypto = require('crypto');
const path = require('path');


// Register
const register = async (req, res) => {
  try {
    const { name, email, password, role = 'customer' } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // Validate role
    const validRoles = ['customer', 'shopkeeper', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role. Must be customer, shopkeeper, or admin" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during registration" });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
};

// Get profile (protected)
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -resetPasswordToken -resetPasswordExpires');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error fetching profile' });
  }
};

// Update profile (protected) - supports avatar upload via multer single 'avatar'
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, phone, address } = req.body;
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) {
      try {
        const parsed = typeof address === 'string' ? JSON.parse(address) : address;
        user.address = { ...user.address, ...parsed };
      } catch (e) {
        // ignore parse error
      }
    }

    // Avatar file
    if (req.file) {
      // store accessible url
      user.avatarUrl = `/uploads/avatars/${req.file.filename}`;
    }

    await user.save();

    return res.json({ message: 'Profile updated', user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      avatarUrl: user.avatarUrl,
      role: user.role
    }});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error updating profile' });
  }
};

// Change password (protected) - requires currentPassword and newPassword
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Provide current and new password' });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error changing password' });
  }
};

// Request password reset (public) - will log reset link to console in dev
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: 'If that email exists, a reset link was sent' });

    const token = crypto.randomBytes(20).toString('hex');
    const hashed = crypto.createHash('sha256').update(token).digest('hex');
    user.resetPasswordToken = hashed;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `http://localhost:3000/reset-password/${token}`;
    console.log(`Password reset for ${email}: ${resetUrl}`);

    return res.json({ message: 'If that email exists, a reset link was sent (check server log in dev).' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error requesting password reset' });
  }
};

// Reset password using token (public)
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ message: 'Invalid request' });

    const hashed = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ resetPasswordToken: hashed, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error resetting password' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  requestPasswordReset,
  resetPassword
};

