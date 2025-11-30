
import Stripe from 'stripe';
import Order from '../models/Order.js';

// Initialize Stripe with the secret key from environment variables
// Using a placeholder test key for development if not set
const stripe =  new Stripe(process.env.STRIPE_SECRET_KEY)


/**
 * Create Payment Intent
 */
export const createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100), // Amount in cents
      currency: 'usd',
      metadata: {
        orderId: order._id.toString(),
      },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment initiation failed.',
      error: error.message,
    });
  }
};

/**
 * Get UPI Details for an Order
 */
export const getUPIDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('products.shopkeeperId');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    // Check if multiple shopkeepers
    const shopkeeperIds = new Set(order.products.map(p => p.shopkeeperId._id.toString()));
    
    let upiQrCode = '';
    let upiId = '';
    let merchantName = 'Gleamora Jewels';

    if (shopkeeperIds.size === 1) {
      // Single shopkeeper - use their QR code
      const shopkeeper = order.products[0].shopkeeperId;
      upiQrCode = shopkeeper.upiQrCode;
      upiId = shopkeeper.upiId;
      merchantName = shopkeeper.name;
    } else {
      // Multiple shopkeepers - use platform QR code (fallback)
      // You might want to store platform UPI details in env vars or a config
      upiQrCode = process.env.PLATFORM_UPI_QR || ''; 
      upiId = process.env.PLATFORM_UPI_ID || '';
    }

    res.status(200).json({
      success: true,
      data: {
        upiQrCode,
        upiId,
        merchantName,
        amount: order.totalAmount
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch UPI details.',
      error: error.message,
    });
  }
};
