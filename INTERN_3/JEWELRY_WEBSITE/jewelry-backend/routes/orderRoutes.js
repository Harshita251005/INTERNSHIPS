const express = require('express');
const router = express.Router();
const { protect, isShopkeeperOrAdmin } = require('../middleware/authMiddleware');
const { createOrder, getMyOrders, getOrderById, getAllOrders } = require('../controllers/orderController');

// Place an order (customer)
router.post('/', protect, createOrder);

// Get current user's orders
router.get('/myorders', protect, getMyOrders);

// Get single order (owner or shopkeeper/admin)
router.get('/:id', protect, getOrderById);

// Admin/shopkeeper: list all orders
router.get('/', protect, isShopkeeperOrAdmin, getAllOrders);

module.exports = router;
