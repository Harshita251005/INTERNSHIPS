import React from 'react';
import Navbar from '../../components/Navbar';

const StockManagement = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Stock Management</h1>
        <div className="card p-6">
          <p>Stock management interface - update inventory levels</p>
        </div>
      </div>
    </div>
  );
};

export default StockManagement;
