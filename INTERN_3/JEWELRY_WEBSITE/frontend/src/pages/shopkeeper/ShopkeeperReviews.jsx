import React, { useState, useEffect } from 'react';
import { shopkeeperAPI, reviewAPI } from '../../utils/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const ShopkeeperReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await shopkeeperAPI.getMyReviews();
      if (response.data.success) {
        setReviews(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        const response = await reviewAPI.delete(id);
        if (response.data.success) {
          toast.success('Review deleted successfully');
          setReviews(reviews.filter(review => review._id !== id));
        }
      } catch (error) {
        console.error('Error deleting review:', error);
        toast.error('Failed to delete review');
      }
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
          <h1 className="text-3xl font-bold gradient-text">My Product Reviews</h1>
          <div className="text-gray-600">
            Total Reviews: <span className="font-semibold text-primary-600">{reviews.length}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-700">Product</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Customer</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Rating</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Comment</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reviews.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      No reviews found for your products yet.
                    </td>
                  </tr>
                ) : (
                  reviews.map((review) => (
                    <tr key={review._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <Link to={`/products/${review.productId?._id}`} className="flex items-center space-x-3 group">
                          <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <img 
                              src={review.productId?.images?.[0] || 'https://via.placeholder.com/150'} 
                              alt={review.productId?.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="font-medium text-gray-900 group-hover:text-primary-600 transition">
                            {review.productId?.title || 'Unknown Product'}
                          </span>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{review.userId?.name || 'Unknown User'}</p>
                          <p className="text-xs text-gray-500">{review.userId?.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < review.rating ? "text-yellow-400 text-lg" : "text-gray-300 text-lg"}>
                              ★
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600 text-sm line-clamp-2">{review.comment}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="text-red-500 hover:text-red-700 px-3 py-1 rounded-md hover:bg-red-50 transition text-sm font-medium"
                          title="Delete Review"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShopkeeperReviews;
