import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import ProductForm from './components/ProductForm';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
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
            <span className="footer-social-icon">📷</span>
          </div>
        </div>

        <div className="footer-column">
          <h4>Company</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Career</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Customer Services</h4>
          <ul>
            <li><a href="#">My Account</a></li>
            <li><a href="#">Track Your Order</a></li>
            <li><a href="#">Return</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Our Information</h4>
          <ul>
            <li><a href="#">Privacy</a></li>
            <li><a href="#">User Terms & Condition</a></li>
            <li><a href="#">Return Policy</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Contact Info</h4>
          <ul>
            <li><a href="#">+0123-456-789</a></li>
            <li><a href="#">example@gmail.com</a></li>
            <li><a href="#">8502 Preston Rd, Inglewood, Maine 98380</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>Copyright © 2024 CartFlow. All Rights Reserved.</span>
        <span>English ∨ &nbsp;|&nbsp; USD ∨</span>
      </div>
    </footer>
  );
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
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products onToast={addToast} />} />
          <Route path="/products/add" element={<ProductForm onToast={addToast} />} />
          <Route path="/products/edit/:id" element={<ProductForm onToast={addToast} />} />
          <Route path="/cart" element={<Cart onToast={addToast} />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
