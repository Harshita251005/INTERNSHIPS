import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../utils/api';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await adminAPI.getAnalytics();
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="text-gray-600 text-sm">Total Users</div>
            <div className="text-3xl font-bold">{analytics?.statistics.totalUsers || 0}</div>
          </div>
          <div className="card p-6">
            <div className="text-gray-600 text-sm">Total Products</div>
            <div className="text-3xl font-bold">{analytics?.statistics.totalProducts || 0}</div>
          </div>
          <div className="card p-6">
            <div className="text-gray-600 text-sm">Total Orders</div>
            <div className="text-3xl font-bold">{analytics?.statistics.totalOrders || 0}</div>
          </div>
          <div className="card p-6">
            <div className="text-gray-600 text-sm">Total Revenue</div>
            <div className="text-3xl font-bold gradient-gold-text">${analytics?.statistics.totalRevenue || 0}</div>
          </div>
          <div className="card p-6">
            <div className="text-gray-600 text-sm">Customers</div>
            <div className="text-3xl font-bold text-blue-600">{analytics?.statistics.totalCustomers || 0}</div>
          </div>
          <div className="card p-6">
            <div className="text-gray-600 text-sm">Shopkeepers</div>
            <div className="text-3xl font-bold text-purple-600">{analytics?.statistics.totalShopkeepers || 0}</div>
          </div>
          <div className="card p-6">
            <div className="text-gray-600 text-sm">Pending Approvals</div>
            <div className="text-3xl font-bold text-orange-600">{analytics?.statistics.pendingShopkeepers || 0}</div>
          </div>
          <div className="card p-6">
            <div className="text-gray-600 text-sm">Total Reviews</div>
            <div className="text-3xl font-bold text-yellow-600">{analytics?.statistics.totalReviews || 0}</div>
          </div>
          <div className="card p-6">
            <div className="text-gray-600 text-sm">Wishlist Items</div>
            <div className="text-3xl font-bold text-pink-600">{analytics?.statistics.totalWishlistItems || 0}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-2xl font-bold mb-4">Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/admin/shopkeepers" className="card p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="font-bold text-xl mb-2">Shopkeeper Management</h3>
            <p className="text-gray-600">Approve and manage shopkeepers</p>
          </Link>
          <Link to="/admin/products" className="card p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="font-bold text-xl mb-2">Product Management</h3>
            <p className="text-gray-600">View and manage all products</p>
          </Link>
          <Link to="/admin/orders" className="card p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="font-bold text-xl mb-2">Order Management</h3>
            <p className="text-gray-600">Monitor all orders</p>
          </Link>
          <Link to="/admin/categories" className="card p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4">🏷️</div>
            <h3 className="font-bold text-xl mb-2">Category Management</h3>
            <p className="text-gray-600">Manage product categories</p>
          </Link>
          <Link to="/admin/customers" className="card p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4">🛍️</div>
            <h3 className="font-bold text-xl mb-2">Customer Management</h3>
            <p className="text-gray-600">View all customers</p>
          </Link>
          <Link to="/admin/analytics" className="card p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="font-bold text-xl mb-2">Analytics</h3>
            <p className="text-gray-600">Detailed insights</p>
          </Link>
          <Link to="/admin/profile" className="card p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="font-bold text-xl mb-2">Admin Profile</h3>
            <p className="text-gray-600">Manage your account</p>
          </Link>
          <Link to="/admin/wishlists" className="card p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4">❤️</div>
            <h3 className="font-bold text-xl mb-2">Customer Wishlists</h3>
            <p className="text-gray-600">View all customer wishlists</p>
          </Link>
          <Link to="/admin/reviews" className="card p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="font-bold text-xl mb-2">Reviews & Ratings</h3>
            <p className="text-gray-600">Manage customer reviews</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
