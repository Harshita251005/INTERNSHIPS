const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  baseMetal: String,
  polish: String,
  rating: { type: Number, default: 0 },
  imageUrl: String,
  popularity: { type: Number, default: 0 },
  stock: { 
    type: Number, 
    required: true, 
    default: 0,
    min: 0
  },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  addedByRole: { type: String, default: 'shopkeeper' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
