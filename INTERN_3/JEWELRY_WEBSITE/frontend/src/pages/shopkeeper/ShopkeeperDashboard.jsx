import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';
import { shopkeeperAPI }from '../../utils/api';

const ShopkeeperDashboard = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await shopkeeperAPI.getAnalytics();
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Shopkeeper Dashboard</h1>
        
        {/* Stats */}
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
            <div className="text-3xl font-bold gradient-gold-text">${analytics?.statistics.totalRevenue?.toFixed(2) || '0.00'}</div>
          </div>
          <div className="card p-6">
            <div className="text-gray-600 text-sm">Avg. Order Value</div>
            <div className="text-3xl font-bold text-blue-600">${analytics?.statistics.averageOrderValue?.toFixed(2) || '0.00'}</div>
          </div>
          <div className="card p-6">
            <div className="text-gray-600 text-sm">Low Stock Items</div>
            <div className="text-3xl font-bold text-red-600">{analytics?.statistics.lowStockProducts || 0}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/shopkeeper/products" className="card p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="font-bold text-xl mb-2">Manage Products</h3>
            <p className="text-gray-600">Add, edit, or delete products</p>
          </Link>
          <Link to="/shopkeeper/orders" className="card p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="font-bold text-xl mb-2">View Orders</h3>
            <p className="text-gray-600">Track and update orders</p>
          </Link>
          <Link to="/shopkeeper/analytics" className="card p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="font-bold text-xl mb-2">Analytics</h3>
            <p className="text-gray-600">View sales insights</p>
          </Link>
          <Link to="/shopkeeper/reviews" className="card p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="font-bold text-xl mb-2">Reviews & Ratings</h3>
            <p className="text-gray-600">View product reviews</p>
          </Link>
          <Link to="/shopkeeper/profile" className="card p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="font-bold text-xl mb-2">My Profile</h3>
            <p className="text-gray-600">Manage account & payments</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShopkeeperDashboard;
