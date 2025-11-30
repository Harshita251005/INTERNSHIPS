import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const NoAccess = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-8xl mb-4">🚫</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">
            You don't have permission to access this page.
          </p>
          <Link to="/" className="btn-primary">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NoAccess;
