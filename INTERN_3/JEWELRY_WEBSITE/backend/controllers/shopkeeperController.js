import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import mongoose from 'mongoose';

/**
 * Get shopkeeper analytics
 */
export const getShopkeeperAnalytics = async (req, res) => {
  try {
    const shopkeeperId = new mongoose.Types.ObjectId(req.user.id);

    // Total products
    const totalProducts = await Product.countDocuments({ shopkeeperId });

    // Low stock products (stock < 5)
    const lowStockProducts = await Product.countDocuments({
      shopkeeperId,
      stock: { $lt: 5 },
    });

    // Total orders containing shopkeeper's products
    const totalOrders = await Order.countDocuments({
      'products.shopkeeperId': shopkeeperId,
    });

    // Calculate revenue from orders (only completed payments)
    const revenueResult = await Order.aggregate([
      { 
        $match: { 
          'products.shopkeeperId': shopkeeperId,
          // paymentStatus: 'completed' // Removed to match Admin dashboard consistency
        } 
      },
      { $unwind: '$products' },
      { 
        $match: { 
          'products.shopkeeperId': shopkeeperId 
        } 
      },
      {
        $group: {
          _id: null,
          totalRevenue: { 
            $sum: { 
              $multiply: ['$products.price', '$products.quantity'] 
            } 
          },
        },
      },
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Sales Over Time (Daily Revenue for last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const salesOverTime = await Order.aggregate([
      {
        $match: {
          'products.shopkeeperId': shopkeeperId,
          // paymentStatus: 'completed', // Removed for consistency
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      { $unwind: '$products' },
      {
        $match: {
          'products.shopkeeperId': shopkeeperId
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { 
            $sum: { 
              $multiply: ['$products.price', '$products.quantity'] 
            } 
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top selling products
    const topProducts = await Order.aggregate([
      { $match: { 'products.shopkeeperId': shopkeeperId } }, // Count all orders for popularity, not just paid? Usually yes, but let's stick to consistent logic or maybe all orders is better for demand. Let's use all orders for "Top Selling" to reflect demand.
      { $unwind: '$products' },
      { 
        $match: { 
          'products.shopkeeperId': shopkeeperId 
        } 
      },
      {
        $group: {
          _id: '$products.productId',
          totalSold: { $sum: '$products.quantity' },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    // Get product details for top products
    const topProductsWithDetails = await Product.find({
      _id: { $in: topProducts.map(p => p._id) },
    }).select('title images price');

    const formattedTopProducts = topProducts.map(p => {
      const productDetails = topProductsWithDetails.find(d => d._id.toString() === p._id.toString());
      return {
        ...p,
        title: productDetails?.title || 'Unknown Product',
        image: productDetails?.images?.[0] || '',
        price: productDetails?.price || 0
      };
    });

    res.status(200).json({
      success: true,
      data: {
        statistics: {
          totalProducts,
          lowStockProducts,
          totalOrders,
          totalRevenue,
          averageOrderValue
        },
        salesOverTime,
        topProducts: formattedTopProducts,
      },
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics.',
      error: error.message,
    });
  }
};

/**
 * Get reviews for shopkeeper's products
 */
export const getMyReviews = async (req, res) => {
  try {
    const shopkeeperId = req.user.id;

    // Get all products by this shopkeeper
    const myProducts = await Product.find({ shopkeeperId }).select('_id');
    const productIds = myProducts.map(p => p._id);

    // Get reviews for these products
    const reviews = await Review.find({ productId: { $in: productIds } })
      .populate('userId', 'name email')
      .populate('productId', 'title images shopkeeperId')
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
