import express from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from '../controllers/orderController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

// Customer routes
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['customer']),
  createOrder
);

// All authenticated users can view orders (filtered by role in controller)
router.get(
  '/',
  authMiddleware,
  getAllOrders
);

router.get(
  '/:id',
  authMiddleware,
  getOrderById
);

// Shopkeeper & Admin routes
router.put(
  '/:id/status',
  authMiddleware,
  roleMiddleware(['shopkeeper', 'admin']),
  updateOrderStatus
);

export default router;
