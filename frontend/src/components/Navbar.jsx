import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getCart, getLatestCoupon } from '../services/api';

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [showBanner, setShowBanner] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [latestCoupon, setLatestCoupon] = useState(null);
  const navigate = useNavigate();

  const fetchCartCount = () => {
    if (!localStorage.getItem('user')) {
      setCartCount(0);
      return;
    }
    getCart()
      .then((res) => {
        setCartCount(res.data.summary?.totalItems || 0);
      })
      .catch(() => {
        setCartCount(0);
      });
  };

  const checkUserSession = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(user);
    fetchCartCount();
  };

  const fetchLatestPromo = async () => {
    try {
      const res = await getLatestCoupon();
      if (res && res.data) {
        setLatestCoupon(res.data);
      } else {
        setLatestCoupon(null);
      }
    } catch {
      setLatestCoupon(null);
    }
  };

  useEffect(() => {
    checkUserSession();
    fetchLatestPromo();
    // Listen for custom events
    const cartHandler = () => fetchCartCount();
    const authHandler = () => checkUserSession();
    const couponHandler = () => fetchLatestPromo();

    window.addEventListener('cart-updated', cartHandler);
    window.addEventListener('auth-change', authHandler);
    window.addEventListener('coupon-updated', couponHandler);

    return () => {
      window.removeEventListener('cart-updated', cartHandler);
      window.removeEventListener('auth-change', authHandler);
      window.removeEventListener('coupon-updated', couponHandler);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    setCartCount(0);
    window.dispatchEvent(new Event('auth-change'));
    window.dispatchEvent(new Event('cart-updated'));
    navigate('/');
  };

  const isAdmin = currentUser?.roles?.includes('ROLE_ADMIN');

  return (
    <>
      {/* Top Banner */}
      {showBanner && (
        <div className="top-banner" id="top-banner">
          {/* <span className="top-banner-left">Support (406) 555-0120</span> */}
          <span className="top-banner-center">
            {latestCoupon ? (
              <>
                Use <b>{latestCoupon.code}</b> and GET {latestCoupon.discountType === 'PERCENTAGE' ? `${latestCoupon.discountAmount}%` : `$${latestCoupon.discountAmount}`} OFF for your order.{' '}
              </>
            ) : (
              <>Use <b>DISCOUNT25</b> and GET 25% OFF for your first order. </>
            )}
            <NavLink to="/register" style={{ color: 'white', textDecoration: 'underline' }}>Sign up now</NavLink>
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
            {!isAdmin && (
              <NavLink
                to="/"
                end
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                id="nav-home"
              >
                Home
              </NavLink>
            )}
            <NavLink
              to="/products"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              id="nav-products"
            >
              Products
            </NavLink>
            {currentUser && (
              <NavLink
                to={isAdmin ? '/admin/dashboard' : '/dashboard'}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                id="nav-dashboard"
              >
                Dashboard
              </NavLink>
            )}
            {currentUser && !isAdmin && (
              <NavLink
                to="/cart"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                id="nav-cart"
              >
                Cart
              </NavLink>
            )}
          </div>

          <div className="navbar-actions">
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--brown-dark)' }}>
                  Hi, <b>{currentUser.username.toUpperCase()}</b>
                </span>
                {/* {!isAdmin && (
                  <NavLink to="/cart" className="nav-icon-btn" style={{ position: 'relative' }}>
                    🛒
                    {cartCount > 0 && (
                      <span className="nav-cart-badge">{cartCount}</span>
                    )}
                  </NavLink>
                )} */}
                <button onClick={handleLogout} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                  Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <NavLink to="/login" className="btn btn-secondary btn-sm">Login</NavLink>
                <NavLink to="/register" className="btn btn-primary btn-sm">Register</NavLink>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
