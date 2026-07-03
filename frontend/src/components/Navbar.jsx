import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getCart } from '../services/api';

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [showBanner, setShowBanner] = useState(true);

  const fetchCartCount = async () => {
    try {
      const res = await getCart();
      setCartCount(res.data.summary?.totalItems || 0);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCartCount();
    const handler = () => fetchCartCount();
    window.addEventListener('cart-updated', handler);
    return () => window.removeEventListener('cart-updated', handler);
  }, []);

  return (
    <>
      {/* Top Banner */}
      {showBanner && (
        <div className="top-banner" id="top-banner">
          <span className="top-banner-left">Support (406) 555-0120</span>
          <span className="top-banner-center">
            Sign up and GET 25% OFF for your first order.
            <a href="#">Sign up now</a>
          </span>
          <button
            className="top-banner-close"
            onClick={() => setShowBanner(false)}
            aria-label="Close banner"
          >
            ✕
          </button>
        </div>
      )}

      {/* Navbar */}
      <nav className="navbar" id="main-navbar">
        <div className="navbar-inner">
          <NavLink to="/" className="navbar-brand">
            <span className="navbar-brand-icon">C</span>
            CartFlow.
          </NavLink>

          <div className="navbar-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              id="nav-home"
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              id="nav-products"
            >
              Products
            </NavLink>
            <NavLink
              to="/cart"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              id="nav-cart"
            >
              Cart
            </NavLink>
          </div>

          <div className="navbar-actions">
            <button className="nav-icon-btn" aria-label="Search">🔍</button>
            <button className="nav-icon-btn" aria-label="Wishlist">♡</button>
            <NavLink to="/cart" className="nav-icon-btn" style={{ position: 'relative' }}>
              🛒
              {cartCount > 0 && (
                <span className="nav-cart-badge">{cartCount}</span>
              )}
            </NavLink>
            <button className="nav-icon-btn" aria-label="Account">👤</button>
          </div>
        </div>
      </nav>
    </>
  );
}
