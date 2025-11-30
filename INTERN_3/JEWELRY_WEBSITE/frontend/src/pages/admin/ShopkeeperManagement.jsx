import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { adminAPI } from '../../utils/api';
import { toast } from 'react-toastify';

const ShopkeeperManagement = () => {
  const [shopkeepers, setShopkeepers] = useState([]);

  useEffect(() => {
    fetchShopkeepers();
  }, []);

  const fetchShopkeepers = async () => {
    try {
      const response = await adminAPI.getShopkeepers();
      setShopkeepers(response.data.data.shopkeepers);
    } catch (error) {
      console.error('Error fetching shopkeepers:', error);
    }
  };

  const approveShopkeeper = async (id) => {
    try {
      await adminAPI.approveShopkeeper(id);
      toast.success('Shopkeeper approved');
      fetchShopkeepers();
    } catch (error) {
      toast.error('Approval failed');
    }
  };

  const toggleSuspension = async (id) => {
    try {
      await adminAPI.suspendShopkeeper(id);
      toast.success('Status updated');
      fetchShopkeepers();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Shopkeeper Management</h1>
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Shopkeeper
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {shopkeepers.map((shopkeeper) => (
                <tr key={shopkeeper._id}>
                  <td className="px-6 py-4">
                    <div className="font-medium">{shopkeeper.name}</div>
                    <div className="text-sm text-gray-500">{shopkeeper.email}</div>
                  </td>
                  <td className="px-6 py-4">{shopkeeper.productCount || 0}</td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className={`status-badge ${shopkeeper.shopkeeperApproved ? 'status-delivered' : 'status-pending'}`}>
                        {shopkeeper.shopkeeperApproved ? 'Approved' : 'Pending'}
                      </span>
                      {shopkeeper.suspended && (
                        <span className="status-badge status-cancelled ml-2">Suspended</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    {!shopkeeper.shopkeeperApproved && (
                      <button
                        onClick={() => approveShopkeeper(shopkeeper._id)}
                        className="text-green-600 hover:underline"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => toggleSuspension(shopkeeper._id)}
                      className="text-orange-600 hover:underline"
                    >
                      {shopkeeper.suspended ? 'Activate' : 'Suspend'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShopkeeperManagement;
