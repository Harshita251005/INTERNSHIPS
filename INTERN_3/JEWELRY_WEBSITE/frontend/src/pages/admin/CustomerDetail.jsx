import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { adminAPI } from '../../utils/api';
import { toast } from 'react-toastify';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomerDetails();
  }, [id]);

  const fetchCustomerDetails = async () => {
    try {
      const response = await adminAPI.getCustomerDetails(id);
      setCustomer(response.data.data.user);
      setOrders(response.data.data.orders);
    } catch (error) {
      console.error('Error fetching customer details:', error);
      toast.error('Failed to load customer details');
      navigate('/admin/customers');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!customer) return <div className="p-8 text-center">Customer not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Customer Profile</h1>
          <button onClick={() => navigate('/admin/customers')} className="btn-outline">
            Back to List
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold mx-auto mb-4">
                  {customer.name.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-bold">{customer.name}</h2>
                <p className="text-gray-500">{customer.email}</p>
              </div>

              <div className="space-y-4 border-t pt-4">
                <div>
                  <label className="text-sm text-gray-500">User ID</label>
                  <p className="font-mono text-sm">{customer._id}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Phone</label>
                  <p>{customer.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Address</label>
                  <p>{customer.address || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Joined Date</label>
                  <p>{new Date(customer.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">Order History</h2>
              
              {orders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No orders found for this customer.</p>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order._id} className="border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-bold">Order #{order._id.slice(-6)}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold gradient-gold-text">${order.totalAmount.toFixed(2)}</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs capitalize ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {order.products.map((item, index) => (
                          <div key={index} className="flex items-center space-x-3 text-sm">
                            <span className="text-gray-500">{item.quantity}x</span>
                            <span>{item.productId?.title || 'Unknown Product'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
