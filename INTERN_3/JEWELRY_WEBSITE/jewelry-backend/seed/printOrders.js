const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Order = require('../models/Order');

dotenv.config();
connectDB();

async function printOrders() {
  try {
    const orders = await Order.find().populate('user', 'name email').populate('items.product', 'name price');
    if (!orders || orders.length === 0) {
      console.log('No orders found in the database.');
      process.exit(0);
    }

    console.log(`Found ${orders.length} orders:\n`);
    orders.forEach(o => {
      console.log('Order ID:', o._id.toString());
      console.log('User:', o.user ? `${o.user.name} <${o.user.email}>` : o.user);
      console.log('Total:', o.totalAmount);
      console.log('Status:', o.status);
      console.log('Created:', o.createdAt);
      console.log('Items:');
      o.items.forEach(it => {
        console.log(`  - ${it.name} (product: ${it.product ? it.product._id : it.product}) x${it.quantity} @ ${it.price}`);
      });
      console.log('\n---\n');
    });

    process.exit(0);
  } catch (err) {
    console.error('Error fetching orders:', err);
    process.exit(1);
  }
}

printOrders();
