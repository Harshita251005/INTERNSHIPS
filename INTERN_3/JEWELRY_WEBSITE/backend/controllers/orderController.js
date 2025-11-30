import Order from '../models/Order.js';
import Product from '../models/Product.js';

/**
 * Create new order (Customer)
 */
export const createOrder = async (req, res) => {
  try {
    const { products, shippingAddress, paymentMethod, orderNotes } = req.body;

    // Validation
    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one product.',
      });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complete shipping address.',
      });
    }

    // Process products and calculate total
    let totalAmount = 0;
    const orderProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.productId} not found.`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product: ${product.title}`,
        });
      }

      // Deduct stock
      product.stock -= item.quantity;
      await product.save();

      orderProducts.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
        shopkeeperId: product.shopkeeperId,
      });

      totalAmount += product.price * item.quantity;
    }

    // Create order
    const order = new Order({
      customerId: req.user.id,
      products: orderProducts,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'cod',
      orderNotes,
    });

    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('customerId', 'name email')
      .populate('products.productId', 'title images')
      .populate('products.shopkeeperId', 'name');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      data: {
        order: populatedOrder,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create order.',
      error: error.message,
    });
  }
};

/**
 * Get all orders (Role-based)
 */
export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    // Admin: all orders (no filter)
    if (req.user.role === 'admin') {
      // No filter needed
    }
    // Shopkeeper: orders containing their products
    else if (req.user.role === 'shopkeeper') {
      query['products.shopkeeperId'] = req.user.id;
    }
    // Default / Customer: only their orders (Secure by default)
    else {
      query.customerId = req.user.id;
    }

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('customerId', 'name email')
      .populate('products.productId', 'title images')
      .populate('products.shopkeeperId', 'name')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders.',
      error: error.message,
    });
  }
};

/**
 * Get single order by ID
 */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customerId', 'name email')
      .populate('products.productId', 'title images price')
      .populate('products.shopkeeperId', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    // Authorization check
    const isCustomer = req.user.role === 'customer' && order.customerId._id.toString() === req.user.id;
    const isShopkeeper = req.user.role === 'shopkeeper' && 
      order.products.some(p => p.shopkeeperId._id.toString() === req.user.id);
    const isAdmin = req.user.role === 'admin';

    if (!isCustomer && !isShopkeeper && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this order.',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        order,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order.',
      error: error.message,
    });
  }
};

/**
 * Update order status (Shopkeeper/Admin)
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'payment_pending_approval', 'packed', 'shipped', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value.',
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    // Shopkeeper can only update orders containing their products
    if (req.user.role === 'shopkeeper') {
      const hasShopkeeperProduct = order.products.some(
        p => p.shopkeeperId.toString() === req.user.id
      );

      if (!hasShopkeeperProduct) {
        return res.status(403).json({
          success: false,
          message: 'You can only update orders containing your products.',
        });
      }
    }

    order.status = status;
    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('customerId', 'name email')
      .populate('products.productId', 'title images')
      .populate('products.shopkeeperId', 'name');

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully.',
      data: {
        order: updatedOrder,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update order status.',
      error: error.message,
    });
  }
};

/**
 * Verify Payment
 */
export const verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    if (status === 'success') {
      order.paymentStatus = 'completed';
      order.status = 'packed'; // Auto-move to packed if paid? Or keep pending. Let's keep pending or move to 'confirmed' if we had that status. 'pending' is fine, but payment is done.
      // Actually, if paid, it's confirmed.
    } else {
      order.paymentStatus = 'failed';
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment status updated.',
      data: { order },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment.',
      error: error.message,
    });
  }
};
