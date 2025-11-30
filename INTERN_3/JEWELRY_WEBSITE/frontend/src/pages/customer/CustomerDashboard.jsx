import React from 'react';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Customer Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/my-orders" className="card p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="font-bold text-xl mb-2">My Orders</h3>
            <p className="text-gray-600">Track your orders</p>
          </Link>
          <Link to="/cart" className="card p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4">🛒</div>
            <h3 className="font-bold text-xl mb-2">Shopping Cart</h3>
            <p className="text-gray-600">View cart items</p>
          </Link>
          <Link to="/wishlist" className="card p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4">❤️</div>
            <h3 className="font-bold text-xl mb-2">Wishlist</h3>
            <p className="text-gray-600">Saved items</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
