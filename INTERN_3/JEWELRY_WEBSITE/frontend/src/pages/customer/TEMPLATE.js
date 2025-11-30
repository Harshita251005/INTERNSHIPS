// Placeholder dashboard pages - create subdirectories
// This is a batch creation file that references the structure

// Customer Dashboard Pages
export const customerDashboardPages = {
  CustomerDashboard: `
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
  `,
  
  Cart: `
import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <Link to="/products" className="btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="card p-6">
            <div className="space-y-4">
              {/* Cart items would be mapped here */}
            </div>
            <div className="mt-6 pt-6 border-t">
              <Link to="/checkout" className="btn-primary">Proceed to Checkout</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
  `,

  Checkout: `
import React from 'react';
import Navbar from '../../components/Navbar';

const Checkout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="card p-6">
          <p>Checkout form would go here</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
  `,

  MyOrders: `
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { orderAPI } from '../../utils/api';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getAll();
      setOrders(response.data.data.orders);
    } catch (error) {
      console.error('Error fetching orders', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="card p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Order #{order._id.slice(-6)}</p>
                  <p className="text-gray-600">{order.products.length} items</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">$</ {order.totalAmount}</p>
                  <span className={\`status-badge status-\${order.status}\`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
  `,

  Wishlist: `
import React from 'react';
import Navbar from '../../components/Navbar';

const Wishlist = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Wishlist</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Wishlist items would go here */}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
  `,

  Profile: `
import React from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        <div className="card p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="mt-1 text-lg">{user?.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-lg">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <p className="mt-1 text-lg capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
  `
};
