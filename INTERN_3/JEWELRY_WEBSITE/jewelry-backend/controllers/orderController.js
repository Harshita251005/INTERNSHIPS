const Order = require('../models/Order');
const Product = require('../models/Product');

// Create a new order (protected)
const createOrder = async (req, res) => {
  try {
    const user = req.user; // set by protect middleware
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    // Calculate totals and validate stock
    let total = 0;

    for (const it of items) {
      if (!it.product || !it.quantity) {
        return res.status(400).json({ message: 'Each item must contain product and quantity' });
      }

      const prod = await Product.findById(it.product);
      if (!prod) return res.status(404).json({ message: `Product not found: ${it.product}` });

      if (prod.stock < it.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${prod.name}` });
      }

      // Use product price at time of order
      const price = prod.price - (prod.discount || 0);
      total += price * it.quantity;

      // attach name and price for order item
      it.name = prod.name;
      it.price = price;
    }

    const order = new Order({
      user: user._id,
      items,
      totalAmount: total,
      paymentMethod: paymentMethod || 'unknown',
      shippingAddress: shippingAddress || {}
    });

    const saved = await order.save();
    // decrement stock for products
    for (const it of items) {
      await Product.findByIdAndUpdate(it.product, { $inc: { stock: -Math.abs(it.quantity) } });
    }

    console.log(`Order created: user=${user.email || user._id} total=${saved.totalAmount} items=${saved.items.length}`);
    return res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error creating order' });
  }
};

// Get logged-in user's orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.product').sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error fetching orders' });
  }
};

// Get single order by id (owner or shopkeeper/admin)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', '-password').populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // allow owner or shopkeeper/admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role === 'customer') {
      return res.status(403).json({ message: 'Access denied' });
    }

    return res.json(order);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error fetching order' });
  }
};

// Admin / shopkeeper: get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error fetching orders' });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders
};
