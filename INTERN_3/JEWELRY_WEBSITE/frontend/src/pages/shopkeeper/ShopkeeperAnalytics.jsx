import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { shopkeeperAPI } from '../../utils/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

const ShopkeeperAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await shopkeeperAPI.getAnalytics();
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="text-gray-600 text-sm">Total Revenue</div>
            <div className="text-3xl font-bold gradient-gold-text">
              ${analytics?.statistics.totalRevenue?.toFixed(2) || '0.00'}
            </div>
          </div>
          <div className="card p-6">
            <div className="text-gray-600 text-sm">Total Orders</div>
            <div className="text-3xl font-bold">{analytics?.statistics.totalOrders || 0}</div>
          </div>
          <div className="card p-6">
            <div className="text-gray-600 text-sm">Avg. Order Value</div>
            <div className="text-3xl font-bold text-blue-600">
              ${analytics?.statistics.averageOrderValue?.toFixed(2) || '0.00'}
            </div>
          </div>
          <div className="card p-6">
            <div className="text-gray-600 text-sm">Low Stock Items</div>
            <div className="text-3xl font-bold text-orange-600">
              {analytics?.statistics.lowStockProducts || 0}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Over Time */}
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-6">Sales Over Time (Last 30 Days)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics?.salesOverTime || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#D4AF37" 
                    strokeWidth={2}
                    name="Revenue ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Products */}
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-6">Top Selling Products</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.topProducts || []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="title" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="totalSold" fill="#4F46E5" name="Units Sold" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Products Table */}
        <div className="card p-6">
          <h3 className="text-xl font-bold mb-6">Top Products Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Product</th>
                  <th className="text-left py-3 px-4">Price</th>
                  <th className="text-left py-3 px-4">Units Sold</th>
                  <th className="text-left py-3 px-4">Revenue Generated</th>
                </tr>
              </thead>
              <tbody>
                {analytics?.topProducts?.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img 
                        src={product.image || 'https://via.placeholder.com/40'} 
                        alt={product.title} 
                        className="w-10 h-10 rounded object-cover"
                      />
                      <span className="font-medium">{product.title}</span>
                    </td>
                    <td className="py-3 px-4">${product.price}</td>
                    <td className="py-3 px-4">{product.totalSold}</td>
                    <td className="py-3 px-4 font-bold">
                      ${(product.price * product.totalSold).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopkeeperAnalytics;
