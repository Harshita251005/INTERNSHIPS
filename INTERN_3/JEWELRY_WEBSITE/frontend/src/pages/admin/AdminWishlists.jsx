import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const AdminWishlists = () => {
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlists();
  }, []);

  const fetchWishlists = async () => {
    try {
      const response = await adminAPI.getWishlists();
      if (response.data.success) {
        setWishlists(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching wishlists:', error);
      toast.error('Failed to load wishlists');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold gradient-text">Customer Wishlists</h1>
          <div className="text-gray-600">
            Total Wishlists: <span className="font-semibold text-primary-600">{wishlists.length}</span>
          </div>
        </div>

        <div className="grid gap-6">
          {wishlists.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500 text-lg">No active wishlists found.</p>
            </div>
          ) : (
            wishlists.map((wishlist) => (
              <div key={wishlist._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                      {wishlist.userId?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{wishlist.userId?.name || 'Unknown User'}</h3>
                      <p className="text-sm text-gray-500">{wishlist.userId?.email}</p>
                    </div>
                  </div>
                  <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                    {wishlist.products.length} Items
                  </span>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {wishlist.products.map((product) => (
                      <Link 
                        to={`/products/${product._id}`} 
                        key={product._id}
                        className="group block border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition"
                      >
                        <div className="aspect-square bg-gray-100 relative overflow-hidden">
                          <img 
                            src={product.images?.[0] || 'https://via.placeholder.com/300'} 
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium text-gray-900 truncate">{product.title}</h4>
                          <p className="text-primary-600 font-semibold mt-1">₹{product.price?.toLocaleString()}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminWishlists;
