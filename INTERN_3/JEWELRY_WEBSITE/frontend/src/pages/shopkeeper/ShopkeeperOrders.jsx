import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { orderAPI } from '../../utils/api';
import { toast } from 'react-toastify';

const ShopkeeperOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getAll();
      setOrders(response.data.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await orderAPI.updateStatus(orderId, status);
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        
        {/* Filter for Payment Pending */}
        <div className="mb-6">
           <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-400 text-xl">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  You have {orders.filter(o => o.status === 'payment_pending_approval').length} orders waiting for payment approval.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {orders.length === 0 ? (
             <div className="text-center py-12 text-gray-500">No orders found</div>
          ) : (
            orders.map((order) => (
              <div key={order._id} className={`card p-6 ${order.status === 'payment_pending_approval' ? 'border-2 border-yellow-400' : ''}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-lg">#{order._id.slice(-8)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'payment_pending_approval' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-gray-600">Customer: <span className="font-medium">{order.customerId?.name}</span></p>
                    <p className="text-gray-600">
                      {order.products.length} items • <span className="font-bold text-gray-900">${order.totalAmount}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {order.status === 'payment_pending_approval' ? (
                      <button
                        onClick={() => updateStatus(order._id, 'pending')} // Move to pending (processing) after approval
                        className="btn-primary px-6 py-2 bg-green-600 hover:bg-green-700 border-none"
                      >
                        Approve Payment
                      </button>
                    ) : (
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="payment_pending_approval">Payment Pending</option>
                        <option value="packed">Packed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopkeeperOrders;
