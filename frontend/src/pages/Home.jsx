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
          A modern shopping cart management system. Add products, manage your
          inventory, and build your cart — all in one place.
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
          <h2 style={{ textAlign: 'center', fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            Everything you need
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Simple yet powerful features to manage your shopping experience
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-card-icon">📦</div>
              <h3 className="feature-card-title">Product Management</h3>
              <p className="feature-card-desc">
                Add, edit, and delete products with full CRUD operations and validation.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-card-icon">🛒</div>
              <h3 className="feature-card-title">Smart Cart</h3>
              <p className="feature-card-desc">
                Add items to your cart, adjust quantities, and see real-time price calculations.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-card-icon">📊</div>
              <h3 className="feature-card-title">Live Summary</h3>
              <p className="feature-card-desc">
                Instant cart totals and item counts that update automatically after every action.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-card-icon">⚡</div>
              <h3 className="feature-card-title">Real-time Sync</h3>
              <p className="feature-card-desc">
                Changes reflect instantly in both the UI and the MySQL database.
              </p>
            </div>
          </div>
        </section>

        {/* Features Bar */}
        <div className="features-bar">
          <div className="feature-item">
            <div className="feature-icon">📦</div>
            <div className="feature-text">
              <h4>Free Shipping</h4>
              <p>Free shipping for order above $180</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">💳</div>
            <div className="feature-text">
              <h4>Flexible Payment</h4>
              <p>Multiple secure payment options</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🕐</div>
            <div className="feature-text">
              <h4>24x7 Support</h4>
              <p>We support online all days.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
