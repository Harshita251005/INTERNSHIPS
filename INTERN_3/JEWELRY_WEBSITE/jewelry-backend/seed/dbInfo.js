const dotenv = require('dotenv');
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const Order = require('../models/Order');

dotenv.config();
connectDB();

async function info() {
  try {
    const conn = mongoose.connection;
    console.log('DB name:', conn.name);
    console.log('DB hosts:', conn.host);
    const orderCount = await Order.countDocuments();
    console.log('Order count:', orderCount);
    process.exit(0);
  } catch (err) {
    console.error('Error reading DB info:', err);
    process.exit(1);
  }
}

info();
