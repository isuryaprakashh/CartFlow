import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCart, checkout, validateCoupon } from '../services/api';

export default function Checkout({ onToast }) {
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({ totalItems: 0, totalQuantity: 0, totalPrice: 0 });
  const [form, setForm] = useState({ shippingAddress: '', phoneNumber: '', couponCode: '' });
  
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0.0);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await getCart();
      setItems(res.data.items || []);
      setSummary(res.data.summary || { totalItems: 0, totalQuantity: 0, totalPrice: 0 });
      // Pre-fill user profile info if available
      const storedUser = JSON.parse(localStorage.getItem('user'));
      setForm((prev) => ({
        ...prev,
        shippingAddress: storedUser.address || '',
        phoneNumber: storedUser.phone || ''
      }));
    } catch {
      onToast('Failed to load checkout details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!form.couponCode.trim()) return;
    try {
      const res = await validateCoupon(form.couponCode.trim());
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

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!form.shippingAddress || !form.phoneNumber) {
      onToast('Address and Phone are required', 'error');
      return;
    }
    setCheckoutLoading(true);
    try {
      await checkout({
        shippingAddress: form.shippingAddress,
        phoneNumber: form.phoneNumber,
        couponCode: appliedCoupon ? appliedCoupon.code : null
      });
      onToast('Order placed successfully!', 'success');
      window.dispatchEvent(new Event('cart-updated'));
      navigate('/orders');
    } catch (err) {
      onToast(err.response?.data?.message || 'Checkout failed', 'error');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const totalAmount = Math.max(0.0, summary.totalPrice - discount);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <span>Preparing checkout...</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h3 className="empty-title">Your cart is empty</h3>
          <p className="empty-desc">Add items before checkout.</p>
          <Link to="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-banner">
        <h1 className="page-banner-title">Checkout</h1>
        <div className="page-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          Checkout
        </div>
      </div>

      <div className="page-container">
        <div className="cart-layout" style={{ gridTemplateColumns: '1fr 340px' }}>
          {/* Shipping & Payment Form */}
          <div className="form-card" style={{ background: 'white' }}>
            <h2 className="page-title" style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Shipping Details</h2>
            <form onSubmit={handlePlaceOrder} id="checkout-form">
              <div className="form-group">
                <label className="form-label" htmlFor="shippingAddress">Shipping Address *</label>
                <input
                  id="shippingAddress"
                  type="text"
                  className="form-input"
                  placeholder="Enter full shipping address"
                  value={form.shippingAddress}
                  onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="phoneNumber">Phone Number *</label>
                <input
                  id="phoneNumber"
                  type="text"
                  className="form-input"
                  placeholder="Enter active phone number"
                  value={form.phoneNumber}
                  onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                  required
                />
              </div>

              <div style={{ marginTop: '2rem' }}>
                <h3 className="page-title" style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Payment</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  💵 Cash on Delivery (COD) — Multiple payment methods available during delivery.
                </p>
              </div>

              <div className="form-actions" style={{ marginTop: '2rem' }}>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={checkoutLoading}>
                  {checkoutLoading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary & Coupon Sidebar */}
          <div>
            <div className="order-summary" style={{ background: 'white', marginBottom: '1.5rem' }}>
              <h3 className="order-summary-title">Apply Coupon</h3>
              <form onSubmit={handleApplyCoupon} style={{ padding: '1rem 1.25rem', display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Code"
                  className="form-input"
                  value={form.couponCode}
                  onChange={(e) => setForm({ ...form, couponCode: e.target.value })}
                />
                <button type="submit" className="btn btn-primary btn-sm">Apply</button>
              </form>
            </div>

            <div className="order-summary" style={{ background: 'white' }}>
              <h3 className="order-summary-title">Order Summary</h3>
              <div className="order-summary-body">
                {items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.35rem 0' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {item.product.name} (x{item.quantity})
                    </span>
                    <span style={{ fontWeight: '600' }}>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                
                <div className="summary-row" style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
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
                <div className="summary-row summary-total">
                  <span className="summary-row-label">Total</span>
                  <span className="summary-row-value">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
