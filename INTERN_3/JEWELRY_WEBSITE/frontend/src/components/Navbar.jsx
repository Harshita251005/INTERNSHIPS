import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'shopkeeper':
        return '/shopkeeper';
      case 'customer':
        return '/dashboard';
      default:
        return '/';
    }
  };

  const getProfileLink = () => {
    if (!user) return '/';
    return user.role === 'admin' ? '/admin/profile' : '/profile';
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">💎✨</span>
            <span className="text-2xl font-bold gradient-text">Gleamora Jewels</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-primary-600 transition">
              Products
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="text-gray-700 hover:text-primary-600 transition"
                >
                  Dashboard
                </Link>
                {user.role === 'customer' && (
                  <Link to="/cart" className="text-gray-700 hover:text-primary-600 transition relative">
                    🛒 Cart
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                )}
                <div className="flex items-center space-x-4">
                  <Link 
                    to={getProfileLink()}
                    className="text-sm text-gray-600 hover:text-primary-600 transition cursor-pointer font-medium"
                  >
                    {user.name} ({user.role})
                  </Link>
                  <button onClick={logout} className="btn-outline text-sm py-2 px-4">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 transition">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary text-sm py-2 px-4">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
