import Product from '../models/Product.js';
import Review from '../models/Review.js';

/**
 * Get all products (Public)
 */
export const getAllProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, page = 1, limit = 12 } = req.query;

    // Build query
    const query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get products
    const products = await Product.find(query)
      .populate('category', 'name')
      .populate('shopkeeperId', 'name email')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        products,
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
      message: 'Failed to fetch products.',
      error: error.message,
    });
  }
};

/**
 * Get single product by ID (Public)
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name description')
      .populate('shopkeeperId', 'name email');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    // Get reviews for this product
    const reviews = await Review.find({ productId: product._id })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        product,
        reviews,
      },
    });
  } catch (error) {
    console.error('Error in getProductById:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product.',
      error: error.message,
    });
  }
};

/**
 * Create new product (Shopkeeper/Admin)
 */
export const createProduct = async (req, res) => {
  try {
    const { title, description, price, stock, images, category, weight, material, purity } = req.body;

    // Validation
    if (!title || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields.',
      });
    }

    // Create product
    const product = new Product({
      title,
      description,
      price,
      stock: stock || 0,
      images: images || [],
      category,
      shopkeeperId: req.user.id,
      weight,
      material,
      purity,
    });

    await product.save();

    const populatedProduct = await Product.findById(product._id)
      .populate('category', 'name')
      .populate('shopkeeperId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      data: {
        product: populatedProduct,
      },
    });
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product.',
      error: error.message,
    });
  }
};

/**
 * Update product (Shopkeeper own/Admin all)
 */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    // Check ownership (shopkeeper can only update their own products)
    if (req.user.role === 'shopkeeper' && product.shopkeeperId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own products.',
      });
    }

    // Update fields
    const allowedFields = ['title', 'description', 'price', 'stock', 'images', 'category', 'weight', 'material', 'purity'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    await product.save();

    const updatedProduct = await Product.findById(product._id)
      .populate('category', 'name')
      .populate('shopkeeperId', 'name email');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      data: {
        product: updatedProduct,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update product.',
      error: error.message,
    });
  }
};

/**
 * Delete product (Shopkeeper own/Admin all)
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    // Check ownership (shopkeeper can only delete their own products)
    if (req.user.role === 'shopkeeper' && product.shopkeeperId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own products.',
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete product.',
      error: error.message,
    });
  }
};

/**
 * Get shopkeeper's own products
 */
export const getMyProducts = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;

    const products = await Product.find({ shopkeeperId: req.user.id })
      .populate('category', 'name')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments({ shopkeeperId: req.user.id });

    res.status(200).json({
      success: true,
      data: {
        products,
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
      message: 'Failed to fetch your products.',
      error: error.message,
    });
  }
};
