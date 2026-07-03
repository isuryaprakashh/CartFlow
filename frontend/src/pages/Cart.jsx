import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCart, clearCart } from '../services/api';
import CartItemRow from '../components/CartItemRow';

export default function Cart({ onToast }) {
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({ totalItems: 0, totalQuantity: 0, totalPrice: 0 });
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await getCart();
      setItems(res.data.items || []);
      setSummary(res.data.summary || { totalItems: 0, totalQuantity: 0, totalPrice: 0 });
    } catch {
      onToast('Failed to load cart', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleClearCart = async () => {
    if (!window.confirm('Clear all items from cart?')) return;
    try {
      await clearCart();
      onToast('Cart cleared', 'success');
      fetchCart();
      window.dispatchEvent(new Event('cart-updated'));
    } catch {
      onToast('Failed to clear cart', 'error');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <span>Loading cart...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Page Banner */}
      <div className="page-banner">
        <h1 className="page-banner-title">Shopping Cart</h1>
        <div className="page-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          Shopping Cart
        </div>
      </div>

      <div className="page-container">
        {items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <h3 className="empty-title">Your cart is empty</h3>
            <p className="empty-desc">Browse products and add items to your cart.</p>
            <Link to="/products" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Cart Table */}
            <div>
              <div className="cart-table" id="cart-table">
                {/* Table Header */}
                <div className="cart-table-header">
                  <div>Product</div>
                  <div>Price</div>
                  <div>Quantity</div>
                  <div>Subtotal</div>
                </div>

                {/* Table Body */}
                <div className="cart-table-body">
                  {items.map((item) => (
                    <CartItemRow
                      key={item.id}
                      item={item}
                      onRefresh={fetchCart}
                      onToast={onToast}
                    />
                  ))}
                </div>

                {/* Coupon Row */}
                <div className="cart-coupon-row">
                  <div className="coupon-form">
                    <input
                      type="text"
                      className="coupon-input"
                      placeholder="Coupon Code"
                      id="coupon-input"
                    />
                    <button className="coupon-btn" id="btn-apply-coupon">
                      Apply Coupon
                    </button>
                  </div>
                  <button className="btn-link" onClick={handleClearCart} id="btn-clear-cart">
                    Clear Shopping Cart
                  </button>
                </div>
              </div>

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

            {/* Order Summary Sidebar */}
            <div className="order-summary" id="order-summary">
              <h3 className="order-summary-title">Order Summary</h3>
              <div className="order-summary-body">
                <div className="summary-row">
                  <span className="summary-row-label">Items</span>
                  <span className="summary-row-value">{summary.totalItems}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-row-label">Sub Total</span>
                  <span className="summary-row-value">${summary.totalPrice.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-row-label">Shipping</span>
                  <span className="summary-row-value">$00.00</span>
                </div>
                <div className="summary-row">
                  <span className="summary-row-label">Taxes</span>
                  <span className="summary-row-value">$00.00</span>
                </div>
                <div className="summary-row">
                  <span className="summary-row-label">Coupon Discount</span>
                  <span className="summary-row-value">-</span>
                </div>
                <div className="summary-row summary-total">
                  <span className="summary-row-label">Total</span>
                  <span className="summary-row-value">${summary.totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <div className="order-summary-footer">
                <button className="btn-checkout" id="btn-checkout">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
