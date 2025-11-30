import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

/**
 * Get user's wishlist
 */
export const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user.id }).populate('products');

    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user.id, products: [] });
    }

    res.status(200).json({
      success: true,
      data: wishlist.products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wishlist.',
      error: error.message,
    });
  }
};

/**
 * Add product to wishlist
 */
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    let wishlist = await Wishlist.findOne({ userId: req.user.id });

    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user.id, products: [] });
    }

    // Check if product already exists
    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist.',
      data: wishlist.products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add to wishlist.',
      error: error.message,
    });
  }
};

/**
 * Remove product from wishlist
 */
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    let wishlist = await Wishlist.findOne({ userId: req.user.id });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found.',
      });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );

    await wishlist.save();

    // Return populated products to update UI immediately
    await wishlist.populate('products');

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist.',
      data: wishlist.products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to remove from wishlist.',
      error: error.message,
    });
  }
};
