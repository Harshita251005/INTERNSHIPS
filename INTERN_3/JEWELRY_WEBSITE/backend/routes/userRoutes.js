import express from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
} from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

// Protected routes - all authenticated users
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.put('/profile/password', authMiddleware, changePassword);

// Admin only
router.get('/', authMiddleware, roleMiddleware(['admin']), getAllUsers);

export default router;
