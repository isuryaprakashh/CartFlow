import { Link, Navigate } from 'react-router-dom';

export default function Home() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.roles?.includes('ROLE_ADMIN')) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return (
    <>
      {/* Hero Section */}
      <div className="hero" id="hero-section">
        <h1 className="hero-title">
          Welcome to <span className="hero-title-accent">CartFlow</span>
        </h1>
        <p className="hero-subtitle">
          Your premium destination for curated fashion, accessories, and home collections. 
          Discover tags you love and checkout with ease.
        </p>
        <div className="hero-actions">
          <Link to="/products" className="btn btn-primary" id="hero-browse">
            Browse Products
          </Link>
          <Link to="/cart" className="btn btn-outline-brown" id="hero-cart">
            View Cart
          </Link>
        </div>
      </div>

      <div className="page-container" style={{ paddingTop: 0 }}>
        {/* Features */}
        <section id="features-section">
          <h2 style={{ textAlign: 'center', fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--brown-dark)' }}>
            Designed for Elegant Shopping
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Enjoy a seamless, beautiful boutique experience from browsing to checkout
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-card-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--brown-dark)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <h3 className="feature-card-title">Curated Collections</h3>
              <p className="feature-card-desc">
                Browse handpicked premium products organized across our updated boutique categories.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-card-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--brown-dark)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="14" x="2" y="5" rx="2"/>
                  <line x1="2" y1="10" x2="22" y2="10"/>
                </svg>
              </div>
              <h3 className="feature-card-title">Seamless Checkout</h3>
              <p className="feature-card-desc">
                Apply exclusive discount coupons and place secure Cash on Delivery orders in seconds.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-card-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--brown-dark)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                </svg>
              </div>
              <h3 className="feature-card-title">Personal Wishlist</h3>
              <p className="feature-card-desc">
                Save your favorite styling pieces and instantly move them to your bag when ready to buy.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-card-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--brown-dark)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                </svg>
              </div>
              <h3 className="feature-card-title">Save For Later</h3>
              <p className="feature-card-desc">
                Separate items in your bag to reconsider them later without cluttering your active order.
              </p>
            </div>
          </div>
        </section>

        {/* Features Bar */}
        <div className="features-bar">
          <div className="feature-item">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--brown-dark)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="2" ry="2"/>
                <polygon points="16 8 20 8 23 11 23 16 16 16"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            </div>
            <div className="feature-text">
              <h4>Free Shipping</h4>
              <p>Free shipping for orders above $180</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--brown-dark)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div className="feature-text">
              <h4>Flexible Payment</h4>
              <p>Multiple secure payment options</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--brown-dark)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <div className="feature-text">
              <h4>24x7 Support</h4>
              <p>We support online all days</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
