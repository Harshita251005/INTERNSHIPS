import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { orderAPI } from '../../utils/api';
import { Link } from 'react-router-dom';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getAll();
      setOrders(response.data.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="card p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="font-semibold">Order #{order._id.slice(-6)}</p>
                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold mb-1">${order.totalAmount}</p>
                    <div className="flex items-center gap-3">
                      <span className={`status-badge status-${order.status}`}>
                        {order.status}
                      </span>
                      <Link 
                        to={`/order-tracking/${order._id}`}
                        className="text-xs text-gold-600 hover:text-gold-700 font-medium border border-gold-200 px-3 py-1 rounded-full hover:bg-gold-50 transition"
                      >
                        Track
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t pt-4 space-y-4">
                  {order.products.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          <img 
                            src={item.productId?.images?.[0] || 'https://via.placeholder.com/150'} 
                            alt={item.productId?.title} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.productId?.title || 'Product Unavailable'}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity} × ${item.price}</p>
                        </div>
                      </div>
                      
                      {order.status === 'delivered' && (
                        <Link 
                          to={`/products/${item.productId?._id}`}
                          className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
                        >
                          Write Review
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
