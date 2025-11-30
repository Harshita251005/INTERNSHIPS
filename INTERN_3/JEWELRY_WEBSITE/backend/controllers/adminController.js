import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import Wishlist from '../models/Wishlist.js';

/**
 * Get platform analytics (Admin)
 */
export const getAnalytics = async (req, res) => {
  try {
    // Count statistics
    const totalUsers = await User.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalShopkeepers = await User.countDocuments({ role: 'shopkeeper' });
    const pendingShopkeepers = await User.countDocuments({ 
      role: 'shopkeeper', 
      shopkeeperApproved: false 
    });

    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    // New stats
    const totalReviews = await Review.countDocuments();
    
    // Calculate total wishlist items (sum of products array length in all wishlists)
    const wishlistStats = await Wishlist.aggregate([
      {
        $project: {
          itemCount: { $size: "$products" }
        }
      },
      {
        $group: {
          _id: null,
          totalItems: { $sum: "$itemCount" }
        }
      }
    ]);
    const totalWishlistItems = wishlistStats.length > 0 ? wishlistStats[0].totalItems : 0;

    // Calculate revenue
    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
        },
      },
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Recent orders
    const recentOrders = await Order.find()
      .populate('customerId', 'name email')
      .populate('products.productId', 'title')
      .limit(5)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        statistics: {
          totalUsers,
          totalCustomers,
          totalShopkeepers,
          pendingShopkeepers,
          totalProducts,
          totalOrders,
          totalRevenue,
          totalReviews,
          totalWishlistItems,
        },
        recentOrders,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics.',
      error: error.message,
    });
  }
};

/**
 * Get all shopkeepers (Admin)
 */
export const getAllShopkeepers = async (req, res) => {
  try {
    const shopkeepers = await User.find({ role: 'shopkeeper' })
      .select('-password -refreshToken')
      .sort({ createdAt: -1 });

    // Get product count for each shopkeeper
    const shopkeepersWithStats = await Promise.all(
      shopkeepers.map(async (shopkeeper) => {
        const productCount = await Product.countDocuments({ 
          shopkeeperId: shopkeeper._id 
        });
        return {
          ...shopkeeper.toObject(),
          productCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        shopkeepers: shopkeepersWithStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shopkeepers.',
      error: error.message,
    });
  }
};

/**
 * Approve shopkeeper (Admin)
 */
export const approveShopkeeper = async (req, res) => {
  try {
    const shopkeeper = await User.findById(req.params.id);

    if (!shopkeeper) {
      return res.status(404).json({
        success: false,
        message: 'Shopkeeper not found.',
      });
    }

    if (shopkeeper.role !== 'shopkeeper') {
      return res.status(400).json({
        success: false,
        message: 'User is not a shopkeeper.',
      });
    }

    shopkeeper.shopkeeperApproved = true;
    await shopkeeper.save();

    res.status(200).json({
      success: true,
      message: 'Shopkeeper approved successfully.',
      data: {
        shopkeeper: {
          id: shopkeeper._id,
          name: shopkeeper.name,
          email: shopkeeper.email,
          shopkeeperApproved: shopkeeper.shopkeeperApproved,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to approve shopkeeper.',
      error: error.message,
    });
  }
};

/**
 * Suspend/Unsuspend shopkeeper (Admin)
 */
export const toggleShopkeeperSuspension = async (req, res) => {
  try {
    const shopkeeper = await User.findById(req.params.id);

    if (!shopkeeper) {
      return res.status(404).json({
        success: false,
        message: 'Shopkeeper not found.',
      });
    }

    if (shopkeeper.role !== 'shopkeeper') {
      return res.status(400).json({
        success: false,
        message: 'User is not a shopkeeper.',
      });
    }

    shopkeeper.suspended = !shopkeeper.suspended;
    await shopkeeper.save();

    res.status(200).json({
      success: true,
      message: `Shopkeeper ${shopkeeper.suspended ? 'suspended' : 'activated'} successfully.`,
      data: {
        shopkeeper: {
          id: shopkeeper._id,
          name: shopkeeper.name,
          email: shopkeeper.email,
          suspended: shopkeeper.suspended,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update shopkeeper status.',
      error: error.message,
    });
  }
};

/**
 * Delete user (Admin)
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Prevent deleting admin accounts
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete admin accounts.',
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete user.',
      error: error.message,
    });
  }
};

/**
 * Get customer details with orders (Admin)
 */
export const getCustomerDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const orders = await Order.find({ customerId: user._id })
      .populate('products.productId', 'title images')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        user,
        orders,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer details.',
      error: error.message,
    });
  }
};

/**
 * Get all wishlists (Admin)
 */
export const getAllWishlists = async (req, res) => {
  try {
    const wishlists = await Wishlist.find()
      .populate('userId', 'name email')
      .populate('products', 'title price images')
      .sort({ updatedAt: -1 });

    // Filter out empty wishlists if desired, or keep them to show user activity
    const activeWishlists = wishlists.filter(w => w.products.length > 0);

    res.status(200).json({
      success: true,
      data: activeWishlists,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wishlists.',
      error: error.message,
    });
  }
};

/**
 * Get all reviews (Admin)
 */
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('userId', 'name email')
      .populate('productId', 'title images')
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
