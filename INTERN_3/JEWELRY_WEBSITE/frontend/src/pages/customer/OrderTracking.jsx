import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { orderAPI } from '../../utils/api';
import { toast } from 'react-toastify';

const OrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await orderAPI.getById(orderId);
      setOrder(response.data.data.order);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
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

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Order not found</h2>
          <Link to="/my-orders" className="text-gold-600 hover:underline">
            Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  const steps = [
    { status: 'pending', label: 'Order Placed', icon: '📝' },
    { status: 'packed', label: 'Packed', icon: '📦' },
    { status: 'shipped', label: 'Shipped', icon: '🚚' },
    { status: 'delivered', label: 'Delivered', icon: '✅' },
  ];

  const getCurrentStepIndex = () => {
    const statusMap = {
      pending: 0,
      packed: 1,
      shipped: 2,
      delivered: 3,
      cancelled: -1,
    };
    return statusMap[order.status] || 0;
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link to="/my-orders" className="text-gray-500 hover:text-gray-700 flex items-center gap-2">
            ← Back to Orders
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-2">Order #{order._id.slice(-6)}</h1>
              <p className="text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold gradient-gold-text">${order.totalAmount}</p>
              <p className="text-sm text-gray-500">{order.products.length} Items</p>
            </div>
          </div>

          {/* Tracking Timeline */}
          {order.status === 'cancelled' ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center font-bold">
              This order has been cancelled.
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
              <div 
                className="absolute left-0 top-1/2 h-1 bg-green-500 -translate-y-1/2 z-0 transition-all duration-1000"
                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
              ></div>
              
              <div className="relative z-10 flex justify-between">
                {steps.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  
                  return (
                    <div key={step.status} className="flex flex-col items-center">
                      <div 
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border-4 transition-colors ${
                          isCompleted 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'bg-white border-gray-200 text-gray-400'
                        }`}
                      >
                        {step.icon}
                      </div>
                      <p className={`mt-2 font-medium ${isCurrent ? 'text-green-600' : 'text-gray-500'}`}>
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-lg mb-4">Shipping Address</h3>
            <div className="text-gray-600">
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p>{order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-lg mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.products.map((item) => (
                <div key={item._id} className="flex items-center gap-4">
                  <img 
                    src={item.productId?.images?.[0] || 'https://via.placeholder.com/50'} 
                    alt={item.productId?.title} 
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium line-clamp-1">{item.productId?.title}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">${item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
