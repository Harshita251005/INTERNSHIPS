import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isShopkeeperApproved } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user role is allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/no-access" replace />;
  }

  // Check if shopkeeper is approved
  if (user.role === 'shopkeeper' && !isShopkeeperApproved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <div className="text-yellow-500 text-6xl mb-4">⏳</div>
          <h2 className="text-2xl font-bold mb-2">Account Pending Approval</h2>
          <p className="text-gray-600 mb-4">
            Your shopkeeper account is awaiting admin approval. You'll be able to access your dashboard once approved.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="btn-outline"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;
