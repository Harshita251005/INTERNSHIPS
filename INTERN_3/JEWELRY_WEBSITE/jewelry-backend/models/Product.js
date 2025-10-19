const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: { type: String, required: true }, // using String now
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  baseMetal: String,
  polish: String,
  rating: { type: Number, default: 0 },
  imageUrl: String,
  popularity: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
