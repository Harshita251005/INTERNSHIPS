import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const PaymentSuccess = () => {
  const location = useLocation();
  const { orderId } = location.state || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. Your order has been confirmed.
          </p>

          <div className="space-y-4">
            {orderId && (
              <Link 
                to={`/order-tracking/${orderId}`}
                className="block w-full btn-primary py-3"
              >
                Track Order
              </Link>
            )}
            <Link 
              to="/products"
              className="block w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
