import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProductForm from './components/ProductForm';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';

function Footer() {
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    const handler = () => {
      setCurrentUser(JSON.parse(localStorage.getItem('user')));
    };
    window.addEventListener('auth-change', handler);
    return () => window.removeEventListener('auth-change', handler);
  }, []);

  const isAdmin = currentUser?.roles?.includes('ROLE_ADMIN');

  return (
    <footer className="footer">
      <div className="footer-main" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr' }}>
        <div>
          <div className="footer-brand">
            <span className="footer-brand-icon">C</span>
            CartFlow.
          </div>
          <p className="footer-desc">
            A modern shopping cart management system built with React, Spring Boot, and MySQL.
            Manage products and cart items with ease.
          </p>
          <div className="footer-socials">
            <span className="footer-social-icon">f</span>
            <span className="footer-social-icon">B</span>
            <span className="footer-social-icon">▶</span>
            <span className="footer-social-icon">𝕏</span>
            {/* <span className="footer-social-icon">📷</span> */}
          </div>
        </div>

        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Browse Products</Link></li>
            {!isAdmin && <li><Link to="/cart">Shopping Cart</Link></li>}
          </ul>
        </div>

        <div className="footer-column">
          <h4>My Account</h4>
          <ul>
            {currentUser ? (
              <>
                <li><Link to={isAdmin ? "/admin/dashboard" : "/dashboard"}>My Dashboard</Link></li>
                {!isAdmin && (
                  <>
                    <li><Link to="/orders">Order History</Link></li>
                    <li><Link to="/wishlist">My Wishlist</Link></li>
                  </>
                )}
              </>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Create Account</Link></li>
              </>
            )}
          </ul>
        </div>

        <div className="footer-column">
          <h4>Contact Info</h4>
          <ul>
            <li><a href="tel:+0123456789">+91 1234567890</a></li>
            <li><a href="mailto:support@cartflow.com">support@cartflow.com</a></li>
            {/* <li>8502 Preston Rd, Inglewood, Maine 98380</li> */}
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>Copyright © 2026 CartFlow. All Rights Reserved.</span>
        {/* <span>English ∨ &nbsp;|&nbsp; USD ∨</span> */}
      </div>
    </footer>
  );
}

function ProtectedRoute({ element, adminOnly = false }) {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (adminOnly && !user.roles?.includes('ROLE_ADMIN')) {
    return <Navigate to="/" replace />;
  }
  return element;
}

function App() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />

        {/* Toast Notifications */}
        <div className="toast-container">
          {toasts.map((toast) => (
            <div key={toast.id} className={`toast toast-${toast.type}`}>
              {toast.type === 'success' ? '✓' : '✕'} {toast.message}
            </div>
          ))}
        </div>

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products onToast={addToast} />} />
          <Route path="/login" element={<Login onToast={addToast} />} />
          <Route path="/register" element={<Register onToast={addToast} />} />

          {/* Customer Protected Routes */}
          <Route path="/cart" element={<ProtectedRoute element={<Cart onToast={addToast} />} />} />
          <Route path="/checkout" element={<ProtectedRoute element={<Checkout onToast={addToast} />} />} />
          <Route path="/wishlist" element={<ProtectedRoute element={<Wishlist onToast={addToast} />} />} />
          <Route path="/orders" element={<ProtectedRoute element={<OrderHistory onToast={addToast} />} />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<CustomerDashboard onToast={addToast} />} />} />

          {/* Admin Protected Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly={true} element={<AdminDashboard onToast={addToast} />} />} />
          <Route path="/products/add" element={<ProtectedRoute adminOnly={true} element={<ProductForm onToast={addToast} />} />} />
          <Route path="/products/edit/:id" element={<ProtectedRoute adminOnly={true} element={<ProductForm onToast={addToast} />} />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
