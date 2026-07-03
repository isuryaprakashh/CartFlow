import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCustomerDashboard, updateProfile, changePassword } from '../services/api';

export default function CustomerDashboard({ onToast }) {
  const [summary, setSummary] = useState(null);
  const [profileForm, setProfileForm] = useState({ email: '', phone: '', address: '', profileImageUrl: '' });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await getCustomerDashboard();
      setSummary(res.data);
      // Fetch user profile info
      const storedUser = JSON.parse(localStorage.getItem('user'));
      setProfileForm({
        email: storedUser.email || '',
        phone: storedUser.phone || '',
        address: storedUser.address || '',
        profileImageUrl: storedUser.profileImageUrl || ''
      });
    } catch {
      onToast('Failed to load dashboard metrics', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile(profileForm);
      // Update local storage
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const updatedUser = { ...storedUser, ...res.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      onToast('Profile updated successfully', 'success');
      window.dispatchEvent(new Event('auth-change'));
    } catch (err) {
      onToast(err.response?.data?.message || 'Profile update failed', 'error');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwordForm.oldPassword || !passwordForm.newPassword) {
      onToast('Both old and new passwords are required', 'error');
      return;
    }
    try {
      await changePassword(passwordForm);
      onToast('Password changed successfully', 'success');
      setPasswordForm({ oldPassword: '', newPassword: '' });
    } catch (err) {
      onToast(err.response?.data?.message || 'Password update failed', 'error');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <span>Loading Dashboard...</span>
      </div>
    );
  }

  return (
    <>
      <div className="page-banner">
        <h1 className="page-banner-title">My Dashboard</h1>
        <div className="page-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          Dashboard
        </div>
      </div>

      <div className="page-container">
        {/* Quick Stats Grid */}
        <div className="features-grid" style={{ marginBottom: '2rem' }}>
          <div className="feature-card" style={{ padding: '1.25rem' }}>
            <div className="feature-card-icon">🛒</div>
            <h3 className="feature-card-title">My Cart</h3>
            <p className="feature-card-desc" style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--brown-dark)' }}>
              {summary?.cartItemsCount || 0} items
            </p>
            <Link to="/cart" className="btn btn-secondary btn-sm" style={{ marginTop: '0.5rem' }}>Go to Cart</Link>
          </div>

          <div className="feature-card" style={{ padding: '1.25rem' }}>
            <div className="feature-card-icon">♡</div>
            <h3 className="feature-card-title">My Wishlist</h3>
            <p className="feature-card-desc" style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--brown-dark)' }}>
              {summary?.wishlistItemsCount || 0} items
            </p>
            <Link to="/wishlist" className="btn btn-secondary btn-sm" style={{ marginTop: '0.5rem' }}>View Wishlist</Link>
          </div>

          <div className="feature-card" style={{ padding: '1.25rem' }}>
            <div className="feature-card-icon">📦</div>
            <h3 className="feature-card-title">My Orders</h3>
            <p className="feature-card-desc" style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--brown-dark)' }}>
              {summary?.totalOrdersCount || 0} orders
            </p>
            <Link to="/orders" className="btn btn-secondary btn-sm" style={{ marginTop: '0.5rem' }}>Order History</Link>
          </div>
        </div>

        <div className="cart-layout" style={{ gridTemplateColumns: '1.2fr 0.8fr' }}>
          {/* Recent Orders */}
          <div>
            <h2 className="page-title" style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Recent Orders</h2>
            {summary?.recentOrders && summary.recentOrders.length > 0 ? (
              <div className="cart-table">
                <div className="cart-table-header" style={{ gridTemplateColumns: '25% 30% 25% 20%' }}>
                  <div>Order ID</div>
                  <div>Date</div>
                  <div>Status</div>
                  <div>Total</div>
                </div>
                <div className="cart-table-body">
                  {summary.recentOrders.map((order) => (
                    <div key={order.id} className="cart-item" style={{ gridTemplateColumns: '25% 30% 25% 20%', padding: '0.85rem 1.25rem' }}>
                      <div style={{ fontWeight: '600' }}>#{order.id}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {new Date(order.orderDate).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="card-badge" style={{ background: order.status === 'DELIVERED' ? '#d4edda' : '#fff3cd', color: order.status === 'DELIVERED' ? '#155724' : '#856404' }}>
                          {order.status}
                        </span>
                      </div>
                      <div style={{ fontWeight: '600' }}>${order.totalAmount.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <p className="empty-desc">You have no orders yet.</p>
              </div>
            )}
          </div>

          {/* Profile Management Forms */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Edit Profile */}
            <div className="order-summary" style={{ background: 'white' }}>
              <h3 className="order-summary-title">Update Profile</h3>
              <form onSubmit={handleProfileUpdate} style={{ padding: '1rem 1.25rem' }}>
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                  Save Profile
                </button>
              </form>
            </div>

            {/* Change Password */}
            <div className="order-summary" style={{ background: 'white' }}>
              <h3 className="order-summary-title">Change Password</h3>
              <form onSubmit={handlePasswordChange} style={{ padding: '1rem 1.25rem' }}>
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label">Old Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                  Change Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
