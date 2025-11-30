import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import NoAccess from './pages/NoAccess';
import Categories from './pages/Categories';
import CategoryProducts from './pages/CategoryProducts';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import MyOrders from './pages/customer/MyOrders';
import Wishlist from './pages/customer/Wishlist';
import Profile from './pages/customer/Profile';
import OrderTracking from './pages/customer/OrderTracking';
import PaymentGateway from './pages/customer/PaymentGateway';
import PaymentSuccess from './pages/customer/PaymentSuccess';

// Shopkeeper Pages
import ShopkeeperDashboard from './pages/shopkeeper/ShopkeeperDashboard';
import ProductManagement from './pages/shopkeeper/ProductManagement';
import StockManagement from './pages/shopkeeper/StockManagement';
import ShopkeeperOrders from './pages/shopkeeper/ShopkeeperOrders';
import ShopkeeperProfile from './pages/shopkeeper/ShopkeeperProfile';

import ShopkeeperAnalytics from './pages/shopkeeper/ShopkeeperAnalytics';
import ShopkeeperReviews from './pages/shopkeeper/ShopkeeperReviews';

// ... (existing imports)

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import ShopkeeperManagement from './pages/admin/ShopkeeperManagement';
import CustomerManagement from './pages/admin/CustomerManagement';
import CustomerDetail from './pages/admin/CustomerDetail';
import CategoryManagement from './pages/admin/CategoryManagement';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminProfile from './pages/admin/AdminProfile';
import AdminWishlists from './pages/admin/AdminWishlists';
import AdminReviews from './pages/admin/AdminReviews';

function App() {
  const { user, isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to={getDashboardRoute(user)} /> : <Login />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to={getDashboardRoute(user)} /> : <Signup />}
      />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/categories" element={<Categories />} />
      <Route
        path="/category/:categoryId"
        element={
          <PrivateRoute allowedRoles={['customer', 'admin', 'shopkeeper']}>
            <CategoryProducts />
          </PrivateRoute>
        }
      />
      <Route path="/no-access" element={<NoAccess />} />

      {/* Customer Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute allowedRoles={['customer']}>
            <CustomerDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <PrivateRoute allowedRoles={['customer']}>
            <Cart />
          </PrivateRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <PrivateRoute allowedRoles={['customer']}>
            <Checkout />
          </PrivateRoute>
        }
      />
      <Route
        path="/my-orders"
        element={
          <PrivateRoute allowedRoles={['customer']}>
            <MyOrders />
          </PrivateRoute>
        }
      />
      <Route
        path="/order-tracking/:orderId"
        element={
          <PrivateRoute allowedRoles={['customer']}>
            <OrderTracking />
          </PrivateRoute>
        }
      />
      <Route
        path="/payment/gateway"
        element={
          <PrivateRoute allowedRoles={['customer']}>
            <PaymentGateway />
          </PrivateRoute>
        }
      />
      <Route
        path="/payment/success"
        element={
          <PrivateRoute allowedRoles={['customer']}>
            <PaymentSuccess />
          </PrivateRoute>
        }
      />
      <Route
        path="/wishlist"
        element={
          <PrivateRoute allowedRoles={['customer']}>
            <Wishlist />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute allowedRoles={['customer', 'shopkeeper', 'admin']}>
            <Profile />
          </PrivateRoute>
        }
      />

      {/* Shopkeeper Routes */}
      <Route
        path="/shopkeeper"
        element={
          <PrivateRoute allowedRoles={['shopkeeper']}>
            <ShopkeeperDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/shopkeeper/products"
        element={
          <PrivateRoute allowedRoles={['shopkeeper']}>
            <ProductManagement />
          </PrivateRoute>
        }
      />
      <Route
        path="/shopkeeper/stock"
        element={
          <PrivateRoute allowedRoles={['shopkeeper']}>
            <StockManagement />
          </PrivateRoute>
        }
      />
      <Route
        path="/shopkeeper/orders"
        element={
          <PrivateRoute allowedRoles={['shopkeeper']}>
            <ShopkeeperOrders />
          </PrivateRoute>
        }
      />
      <Route
        path="/shopkeeper/analytics"
        element={
          <PrivateRoute allowedRoles={['shopkeeper']}>
            <ShopkeeperAnalytics />
          </PrivateRoute>
        }
      />
      <Route
        path="/shopkeeper/reviews"
        element={
          <PrivateRoute allowedRoles={['shopkeeper']}>
            <ShopkeeperReviews />
          </PrivateRoute>
        }
      />
      <Route
        path="/shopkeeper/profile"
        element={
          <PrivateRoute allowedRoles={['shopkeeper']}>
            <ShopkeeperProfile />
          </PrivateRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminProducts />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminOrders />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/shopkeepers"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <ShopkeeperManagement />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/customers"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <CustomerManagement />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/customers/:id"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <CustomerDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <CategoryManagement />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminAnalytics />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminProfile />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/wishlists"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminWishlists />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/reviews"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminReviews />
          </PrivateRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Helper function to determine dashboard route based on role
function getDashboardRoute(user) {
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
}

export default App;
