import React, { useState, useEffect } from 'react';
import { reviewAPI, orderAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ReviewSection = ({ productId }) => {
  const { isAuthenticated, user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [canReview, setCanReview] = useState(false);

  useEffect(() => {
    fetchReviews();
    if (isAuthenticated && user?.role === 'customer') {
      checkEligibility();
    }
  }, [productId, isAuthenticated]);

  const checkEligibility = async () => {
    try {
      // Fetch delivered orders for this user
      const response = await orderAPI.getAll({ status: 'delivered' });
      const orders = response.data.data.orders;
      
      // Check if product is in any delivered order
      const hasPurchased = orders.some(order => 
        order.products.some(p => p.productId._id === productId || p.productId === productId)
      );
      
      setCanReview(hasPurchased);
    } catch (error) {
      console.error('Error checking review eligibility:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewAPI.getByProduct(productId);
      setReviews(response.data.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to submit a review');
      return;
    }

    setSubmitting(true);
    try {
      await reviewAPI.create(productId, { rating, comment });
      toast.success('Review submitted successfully');
      setComment('');
      setRating(5);
      fetchReviews(); // Refresh reviews
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

      {/* Reviews List */}
      <div className="space-y-6 mb-12">
        {loading ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gold-100 rounded-full flex items-center justify-center text-gold-600 font-bold">
                    {review.userId?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="font-medium">{review.userId?.name || 'Anonymous'}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex text-yellow-400 mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700">{review.comment}</p>
              
              {(user?.role === 'admin' || user?._id === review.userId?._id) && (
                <button
                  onClick={async () => {
                    if (window.confirm('Delete this review?')) {
                      try {
                        await reviewAPI.delete(review._id);
                        toast.success('Review deleted');
                        fetchReviews();
                      } catch (error) {
                        toast.error('Failed to delete review');
                      }
                    }
                  }}
                  className="text-red-500 text-sm mt-2 hover:underline"
                >
                  Delete Review
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Write Review Form */}
      {isAuthenticated && user?.role === 'customer' ? (
        canReview ? (
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4">Write a Review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl focus:outline-none ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  rows="4"
                  required
                  placeholder="Share your thoughts about this product..."
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary px-8 py-3 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-xl text-center">
            <p className="text-gray-600">
              You can only review products you have purchased and received.
            </p>
          </div>
        )
      ) : null}
    </div>
  );
};

export default ReviewSection;
