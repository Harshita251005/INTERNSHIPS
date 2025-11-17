const Product = require('../models/Product');
const Category = require('../models/Category');
const mongoose = require('mongoose');

// GET all products
exports.getProducts = async (req, res) => {
  try {
    // Allow optional filtering by category id via query param: /products?category=<categoryId>
    const filter = {};
    if (req.query.category) {
      const catQuery = req.query.category;
      // If client passed an ObjectId string, use it. Otherwise try to resolve by category name.
      if (mongoose.Types.ObjectId.isValid(catQuery)) {
        filter.category = catQuery;
      } else {
        // Try find category by name (case-insensitive)
        const cat = await Category.findOne({ name: { $regex: `^${catQuery}$`, $options: 'i' } });
        if (!cat) {
          // No category with that name -> return empty list
          return res.json([]);
        }
        filter.category = cat._id;
      }
    }
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST create product (Shopkeeper/Admin only)
exports.createProduct = async (req, res) => {
  try {
    // Validate stock field
    if (req.body.stock === undefined) {
      return res.status(400).json({ message: 'Stock quantity is required' });
    }

    if (req.body.stock < 0) {
      return res.status(400).json({ message: 'Stock cannot be negative' });
    }

    // If category was provided as a name, resolve to ObjectId
    if (req.body.category && !mongoose.Types.ObjectId.isValid(req.body.category)) {
      const cat = await Category.findOne({ name: { $regex: `^${req.body.category}$`, $options: 'i' } });
      if (!cat) return res.status(400).json({ message: `Category '${req.body.category}' not found` });
      req.body.category = cat._id;
    }

    // Add shopkeeper/admin info to product
    const productData = {
      ...req.body,
      addedBy: req.user._id,
      addedByRole: req.user.role
    };

    const product = new Product(productData);
    await product.save();
    
    res.status(201).json({
      message: 'Product added successfully',
      product
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT update product (Shopkeeper/Admin only)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Check if user is the one who added the product or is admin
    if (product.addedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only edit products you have added' });
    }

    // Validate stock if being updated
    if (req.body.stock !== undefined && req.body.stock < 0) {
      return res.status(400).json({ message: 'Stock cannot be negative' });
    }

    // If category update provided as name, resolve it
    if (req.body.category && !mongoose.Types.ObjectId.isValid(req.body.category)) {
      const cat = await Category.findOne({ name: { $regex: `^${req.body.category}$`, $options: 'i' } });
      if (!cat) return res.status(400).json({ message: `Category '${req.body.category}' not found` });
      req.body.category = cat._id;
    }
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT update product stock (reduce stock after purchase)
exports.updateStock = async (req, res) => {
  try {
    const { quantity } = req.body;
    
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.stock < quantity) {
      return res.status(400).json({ 
        message: `Insufficient stock. Available: ${product.stock}, Requested: ${quantity}` 
      });
    }

    product.stock -= quantity;
    await product.save();

    res.json({ 
      message: `Stock updated successfully. Remaining stock: ${product.stock}`,
      product 
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE product (Shopkeeper/Admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Check if user is the one who added the product or is admin
    if (product.addedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only delete products you have added' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
