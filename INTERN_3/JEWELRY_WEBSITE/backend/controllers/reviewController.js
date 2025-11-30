import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

/**
 * Create a new review
 */
export const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    // Check if user has already reviewed this product
    const alreadyReviewed = await Review.findOne({
      productId,
      userId: req.user.id,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'Product already reviewed.',
      });
    }

    // Check if user has purchased the product
    const hasPurchased = await Order.findOne({
      customerId: req.user.id,
      'products.productId': productId,
      status: 'delivered', // Only allow reviews for delivered orders
    });

    // For testing purposes, we might want to relax this check or ensure we have delivered orders.
    // Let's keep it strict for now as per requirements.
    if (!hasPurchased) {
      return res.status(403).json({
        success: false,
        message: 'You can only review products you have purchased and received.',
      });
    }

    const review = await Review.create({
      productId,
      userId: req.user.id,
      rating: Number(rating),
      comment,
    });

    // Update product rating
    const reviews = await Review.find({ productId });
    product.reviewCount = reviews.length;
    product.averageRating =
      reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully.',
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add review.',
      error: error.message,
    });
  }
};

/**
 * Get reviews for a product
 */
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews.',
      error: error.message,
    });
  }
};

/**
 * Delete a review (Admin/Shopkeeper)
 */
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found.',
      });
    }

    // Allow admin or the review author to delete
    if (req.user.role !== 'admin' && review.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review.',
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    // Update product stats
    const product = await Product.findById(review.productId);
    if (product) {
      const reviews = await Review.find({ productId: review.productId });
      product.reviewCount = reviews.length;
      product.averageRating =
        reviews.length > 0
          ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
          : 0;
      await product.save();
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete review.',
      error: error.message,
    });
  }
};
