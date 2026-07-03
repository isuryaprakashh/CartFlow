import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, clearCart, getSavedItems, removeSavedItem, addToCart, validateCoupon } from '../services/api';
import CartItemRow from '../components/CartItemRow';

export default function Cart({ onToast }) {
  const [items, setItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [summary, setSummary] = useState({ totalItems: 0, totalQuantity: 0, totalPrice: 0 });
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0.0);
  
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCartAndSaved = async () => {
    setLoading(true);
    try {
      const [cartRes, savedRes] = await Promise.all([getCart(), getSavedItems()]);
      setItems(cartRes.data.items || []);
      setSummary(cartRes.data.summary || { totalItems: 0, totalQuantity: 0, totalPrice: 0 });
      setSavedItems(savedRes.data || []);
      
      // Reset coupon if cart changes or total price becomes 0
      setAppliedCoupon(null);
      setDiscount(0.0);
      setCouponCode('');
    } catch {
      onToast('Failed to load cart and saved items', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartAndSaved();
  }, []);

  const handleClearCart = async () => {
    if (!window.confirm('Clear all items from cart?')) return;
    try {
      await clearCart();
      onToast('Cart cleared', 'success');
      fetchCartAndSaved();
      window.dispatchEvent(new Event('cart-updated'));
    } catch {
      onToast('Failed to clear cart', 'error');
    }
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    try {
      const res = await validateCoupon(couponCode.trim());
      setAppliedCoupon(res.data);
      const subtotal = summary.totalPrice;
      let calculatedDiscount = 0.0;
      if (res.data.discountType === 'PERCENTAGE') {
        calculatedDiscount = subtotal * (res.data.discountAmount / 100.0);
      } else {
        calculatedDiscount = res.data.discountAmount;
      }
      setDiscount(calculatedDiscount);
      onToast('Coupon applied successfully!', 'success');
    } catch (err) {
      setAppliedCoupon(null);
      setDiscount(0.0);
      onToast(err.response?.data?.message || 'Invalid or expired coupon code', 'error');
    }
  };

  const handleRemoveSaved = async (id) => {
    try {
      await removeSavedItem(id);
      onToast('Saved item removed', 'success');
      fetchCartAndSaved();
    } catch {
      onToast('Failed to remove saved item', 'error');
    }
  };

  const handleMoveToCart = async (id, productId, name) => {
    try {
      // Add to cart
      await addToCart(productId, 1);
      // Remove from saved
      await removeSavedItem(id);
      onToast(`"${name}" moved to cart`, 'success');
      fetchCartAndSaved();
      window.dispatchEvent(new Event('cart-updated'));
    } catch (err) {
      onToast(err.response?.data?.message || 'Failed to move saved item to cart', 'error');
    }
  };

  const totalAmount = Math.max(0.0, summary.totalPrice - discount);

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
                      onRefresh={fetchCartAndSaved}
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
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button className="coupon-btn" id="btn-apply-coupon" onClick={handleApplyCoupon}>
                      Apply Coupon
                    </button>
                  </div>
                  <button className="btn-link" onClick={handleClearCart} id="btn-clear-cart">
                    Clear Shopping Cart
                  </button>
                </div>
              </div>

              {/* Save for later section */}
              {savedItems.length > 0 && (
                <div style={{ marginTop: '2rem' }}>
                  <h3 className="page-title" style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Saved for Later</h3>
                  <div className="cart-table">
                    <div className="cart-table-header" style={{ gridTemplateColumns: '50% 20% 30%' }}>
                      <div>Product</div>
                      <div>Price</div>
                      <div>Actions</div>
                    </div>
                    <div className="cart-table-body">
                      {savedItems.map((sItem) => (
                        <div key={sItem.id} className="cart-item" style={{ gridTemplateColumns: '50% 20% 30%', alignItems: 'center' }}>
                          <div className="cart-item-product">
                            <button className="cart-item-remove" onClick={() => handleRemoveSaved(sItem.id)}>✕</button>
                            <div className="cart-item-image">
                              {sItem.product.imageUrl ? <img src={sItem.product.imageUrl} alt={sItem.product.name} /> : '📦'}
                            </div>
                            <div>
                              <div className="cart-item-name">{sItem.product.name}</div>
                              <div className="cart-item-meta">Category: {sItem.product.category?.name || 'N/A'}</div>
                            </div>
                          </div>
                          <div className="cart-item-price">${sItem.product.price.toFixed(2)}</div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn btn-primary btn-sm" onClick={() => handleMoveToCart(sItem.id, sItem.product.id, sItem.product.name)}>
                              Move to Cart
                            </button>
                            <button className="btn btn-secondary btn-sm" onClick={() => handleRemoveSaved(sItem.id)}>
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

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
                {discount > 0 && (
                  <div className="summary-row">
                    <span className="summary-row-label" style={{ color: '#27ae60' }}>Coupon Discount</span>
                    <span className="summary-row-value" style={{ color: '#27ae60' }}>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="summary-row">
                  <span className="summary-row-label">Shipping</span>
                  <span className="summary-row-value">$00.00</span>
                </div>
                <div className="summary-row">
                  <span className="summary-row-label">Taxes</span>
                  <span className="summary-row-value">$00.00</span>
                </div>
                <div className="summary-row summary-total">
                  <span className="summary-row-label">Total</span>
                  <span className="summary-row-value">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
              <div className="order-summary-footer">
                <button className="btn-checkout" id="btn-checkout" onClick={() => navigate('/checkout')}>
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
