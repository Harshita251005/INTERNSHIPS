import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          const response = await axios.post('/api/auth/refresh-token', {
            refreshToken,
          });

          const { accessToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

// Product API
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getMyProducts: (params) => api.get('/products/shopkeeper/mine', { params }),
};

// Order API
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

// Admin API
export const adminAPI = {
  getAnalytics: () => api.get('/admin/analytics'),
  getShopkeepers: () => api.get('/admin/shopkeepers'),
  approveShopkeeper: (id) => api.put(`/admin/shopkeepers/${id}/approve`),
  suspendShopkeeper: (id) => api.put(`/admin/shopkeepers/${id}/suspend`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getCustomerDetails: (id) => api.get(`/admin/customers/${id}`),
  getWishlists: () => api.get('/admin/wishlists'),
  getReviews: () => api.get('/admin/reviews'),
};

// Shopkeeper API
export const shopkeeperAPI = {
  getAnalytics: () => api.get('/shopkeeper/analytics'),
  getMyReviews: () => api.get('/shopkeeper/reviews'),
};

// Category API
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/profile/password', data),
  getAllUsers: () => api.get('/users'),
};

// Wishlist API
export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (productId) => api.post('/wishlist/add', { productId }),
  removeFromWishlist: (productId) => api.delete(`/wishlist/${productId}`),
};

// Review API
export const reviewAPI = {
  create: (productId, data) => api.post(`/reviews/${productId}`, data),
  getByProduct: (productId) => api.get(`/reviews/${productId}`),
  delete: (id) => api.delete(`/reviews/${id}`),
};

// Payment API
export const paymentAPI = {
  verify: (data) => api.post('/payment/verify', data),
  createPaymentIntent: (data) => api.post('/payment/create-payment-intent', data),
  getUPIDetails: (orderId) => api.get(`/payment/upi-details/${orderId}`),
};

// Upload API
export const uploadAPI = {
  uploadImage: (formData) => api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};
