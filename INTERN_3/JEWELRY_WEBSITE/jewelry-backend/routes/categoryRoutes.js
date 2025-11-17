const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect, isShopkeeperOrAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Protected routes - only shopkeepers/admins can manage categories
router.post('/', protect, isShopkeeperOrAdmin, createCategory);
router.put('/:id', protect, isShopkeeperOrAdmin, updateCategory);
router.delete('/:id', protect, isShopkeeperOrAdmin, deleteCategory);

module.exports = router;
