const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock
} = require('../controllers/productController');
const { protect, isShopkeeperOrAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes - Shopkeeper/Admin only
router.post('/', protect, isShopkeeperOrAdmin, createProduct);
router.put('/:id', protect, isShopkeeperOrAdmin, updateProduct);
router.patch('/:id/stock', protect, updateStock);
router.delete('/:id', protect, isShopkeeperOrAdmin, deleteProduct);

module.exports = router;
