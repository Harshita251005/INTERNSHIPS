import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { adminAPI } from '../../utils/api';
import { toast } from 'react-toastify';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await adminAPI.getAnalytics();
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  const stats = analytics?.statistics || {};
  const recentOrders = analytics?.recentOrders || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Platform Analytics</h1>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="card p-6 bg-gradient-to-br from-green-50 to-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <h3 className="text-3xl font-bold text-green-700">
                  ${stats.totalRevenue?.toFixed(2) || '0.00'}
                </h3>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="card p-6 bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <h3 className="text-3xl font-bold text-blue-700">{stats.totalOrders || 0}</h3>
              </div>
              <div className="text-4xl">📦</div>
            </div>
          </div>

          {/* Total Products */}
          <div className="card p-6 bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Products</p>
                <h3 className="text-3xl font-bold text-purple-700">{stats.totalProducts || 0}</h3>
              </div>
              <div className="text-4xl">💎</div>
            </div>
          </div>

          {/* Total Users */}
          <div className="card p-6 bg-gradient-to-br from-orange-50 to-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <h3 className="text-3xl font-bold text-orange-700">{stats.totalUsers || 0}</h3>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>
        </div>

        {/* User Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Customers</p>
              <span className="text-2xl">🛍️</span>
            </div>
            <h3 className="text-2xl font-bold">{stats.totalCustomers || 0}</h3>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Shopkeepers</p>
              <span className="text-2xl">🏪</span>
            </div>
            <h3 className="text-2xl font-bold">{stats.totalShopkeepers || 0}</h3>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Pending Approvals</p>
              <span className="text-2xl">⏳</span>
            </div>
            <h3 className="text-2xl font-bold text-yellow-600">{stats.pendingShopkeepers || 0}</h3>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold">Recent Orders</h2>
          </div>
          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Products
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                        #{order._id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.customerId?.name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">{order.customerId?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.products?.length || 0} items
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ${order.totalAmount?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === 'delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'processing'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <p>No orders yet</p>
            </div>
          )}
        </div>

        {/* Customer Reviews & Wishlist Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Reviews */}
          <div className="card">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold">Customer Reviews</h2>
              <div className="text-3xl font-bold text-yellow-600">{stats.totalReviews || 0}</div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 text-center py-8">
                Total reviews submitted by customers.
              </p>
            </div>
          </div>

          {/* Customer Wishlist Stats */}
          <div className="card">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Wishlist Insights</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600 text-xl mr-4">
                      ❤️
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Total Wishlisted Items</p>
                      <p className="text-sm text-gray-500">Across all user wishlists</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{stats.totalWishlistItems || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
