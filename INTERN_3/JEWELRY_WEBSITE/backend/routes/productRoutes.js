import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
} from '../controllers/productController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Protected routes - Shopkeeper & Admin
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['shopkeeper', 'admin']),
  createProduct
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['shopkeeper', 'admin']),
  updateProduct
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['shopkeeper', 'admin']),
  deleteProduct
);

// Shopkeeper routes
router.get(
  '/shopkeeper/mine',
  authMiddleware,
  roleMiddleware(['shopkeeper']),
  getMyProducts
);

export default router;
