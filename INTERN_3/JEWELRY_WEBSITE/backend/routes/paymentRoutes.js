import express from 'express';
import { createPaymentIntent, getUPIDetails } from '../controllers/paymentController.js';
import { verifyPayment } from '../controllers/orderController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-payment-intent', authMiddleware, createPaymentIntent);
router.get('/upi-details/:orderId', authMiddleware, getUPIDetails);
router.post('/verify', authMiddleware, verifyPayment);

export default router;
