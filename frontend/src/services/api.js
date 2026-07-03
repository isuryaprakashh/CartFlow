import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios Request Interceptor to add JWT Auth Token
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers['Authorization'] = `Bearer ${user.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ==================
// Auth Endpoints
// ==================
export const login = (credentials) => API.post('/auth/login', credentials);
export const register = (userData) => API.post('/auth/register', userData);

// ==================
// User Profile Endpoints
// ==================
export const getProfile = () => API.get('/users/profile');
export const updateProfile = (profileData) => API.put('/users/profile', profileData);
export const changePassword = (passwordData) => API.put('/users/password', passwordData);

// ==================
// Product Endpoints
// ==================
export const getAllProducts = (params) => API.get('/products', { params });
export const getProductById = (id) => API.get(`/products/${id}`);
export const createProduct = (product) => API.post('/products', product);
export const updateProduct = (id, product) => API.put(`/products/${id}`, product);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// ==================
// Category Endpoints
// ==================
export const getAllCategories = () => API.get('/categories');
export const getCategoryById = (id) => API.get(`/categories/${id}`);
export const createCategory = (category) => API.post('/categories', category);
export const updateCategory = (id, category) => API.put(`/categories/${id}`, category);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

// ==================
// Cart Endpoints
// ==================
export const getCart = () => API.get('/cart');
export const addToCart = (productId, quantity = 1) =>
  API.post('/cart/add', { productId, quantity });
export const updateCartItem = (id, quantity) =>
  API.put(`/cart/update/${id}`, { quantity });
export const removeFromCart = (id) => API.delete(`/cart/remove/${id}`);
export const clearCart = () => API.delete('/cart/clear');

// ==================
// Wishlist Endpoints
// ==================
export const getWishlist = () => API.get('/wishlist');
export const addToWishlist = (productId) => API.post('/wishlist/add', { productId });
export const removeFromWishlist = (id) => API.delete(`/wishlist/remove/${id}`);

// ==================
// Save for Later Endpoints
// ==================
export const getSavedItems = () => API.get('/saved');
export const saveForLater = (productId, quantity) => API.post('/saved/add', { productId, quantity });
export const removeSavedItem = (id) => API.delete(`/saved/remove/${id}`);

// ==================
// Review Endpoints
// ==================
export const getReviews = (productId) => API.get(`/reviews/product/${productId}`);
export const createReview = (productId, reviewData) => API.post(`/reviews/product/${productId}`, reviewData);
export const getAverageRating = (productId) => API.get(`/reviews/product/${productId}/average`);

// ==================
// Coupon Endpoints
// ==================
export const getAllCoupons = () => API.get('/coupons');
export const getCouponById = (id) => API.get(`/coupons/${id}`);
export const createCoupon = (coupon) => API.post('/coupons', coupon);
export const updateCoupon = (id, coupon) => API.put(`/coupons/${id}`, coupon);
export const deleteCoupon = (id) => API.delete(`/coupons/${id}`);
export const validateCoupon = (code) => API.get(`/coupons/validate?code=${code}`);
export const getLatestCoupon = () => API.get('/coupons/latest');

// ==================
// Order Endpoints
// ==================
export const checkout = (orderRequest) => API.post('/orders/checkout', orderRequest);
export const getOrderHistory = () => API.get('/orders/history');
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const getAllOrders = () => API.get('/orders');
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status });

// ==================
// Dashboard Endpoints
// ==================
export const getAdminDashboard = () => API.get('/dashboard/admin');
export const getCustomerDashboard = () => API.get('/dashboard/customer');

// ==================
// File Upload Endpoint
// ==================
export const uploadImage = (formData) => {
  return API.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export default API;
