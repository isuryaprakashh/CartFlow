import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================
// Product Endpoints
// ==================

export const getAllProducts = () => API.get('/products');

export const getProductById = (id) => API.get(`/products/${id}`);

export const createProduct = (product) => API.post('/products', product);

export const updateProduct = (id, product) => API.put(`/products/${id}`, product);

export const deleteProduct = (id) => API.delete(`/products/${id}`);

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

export default API;
