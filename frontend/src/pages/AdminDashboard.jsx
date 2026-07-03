import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminDashboard, createCategory, getAllCategories, deleteCategory, createCoupon, getAllCoupons, deleteCoupon, getAllOrders, updateOrderStatus } from '../services/api';

export default function AdminDashboard({ onToast }) {
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [orders, setOrders] = useState([]);
  
  const [newCat, setNewCat] = useState('');
  const [newCoupon, setNewCoupon] = useState({ code: '', discountAmount: '', discountType: 'PERCENTAGE', expiryDate: '' });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sumRes, catRes, coupRes, ordRes] = await Promise.all([
        getAdminDashboard(),
        getAllCategories(),
        getAllCoupons(),
        getAllOrders()
      ]);
      setSummary(sumRes.data);
      setCategories(catRes.data);
      setCoupons(coupRes.data);
      setOrders(ordRes.data);
    } catch {
      onToast('Failed to load admin dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    try {
      await createCategory({ name: newCat.trim() });
      onToast('Category created successfully', 'success');
      setNewCat('');
      fetchData();
    } catch (err) {
      onToast(err.response?.data?.message || 'Failed to create category', 'error');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await deleteCategory(id);
      onToast('Category deleted successfully', 'success');
      fetchData();
    } catch (err) {
      onToast(err.response?.data?.message || 'Failed to delete category', 'error');
    }
  };

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.discountAmount || !newCoupon.expiryDate) {
      onToast('Please fill all coupon fields', 'error');
      return;
    }
    try {
      await createCoupon({
        code: newCoupon.code,
        discountAmount: parseFloat(newCoupon.discountAmount),
        discountType: newCoupon.discountType,
        expiryDate: newCoupon.expiryDate,
        active: true
      });
      onToast('Coupon created successfully', 'success');
      setNewCoupon({ code: '', discountAmount: '', discountType: 'PERCENTAGE', expiryDate: '' });
      fetchData();
      window.dispatchEvent(new Event('coupon-updated'));
    } catch (err) {
      onToast(err.response?.data?.message || 'Failed to create coupon', 'error');
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await deleteCoupon(id);
      onToast('Coupon deleted', 'success');
      fetchData();
      window.dispatchEvent(new Event('coupon-updated'));
    } catch {
      onToast('Failed to delete coupon', 'error');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      onToast(`Order #${orderId} updated to ${newStatus}`, 'success');
      fetchData();
    } catch {
      onToast('Failed to update status', 'error');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <span>Loading Admin Panel...</span>
      </div>
    );
  }

  return (
    <>
      <div className="page-banner">
        <h1 className="page-banner-title">Admin Control Panel</h1>
        <div className="page-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          Admin Dashboard
        </div>
      </div>

      <div className="page-container">
        {/* Aggregates Stats Grid */}
        <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '2.5rem' }}>
          <div className="feature-card" style={{ padding: '1rem' }}>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Products</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--brown-dark)' }}>{summary?.totalProducts || 0}</p>
          </div>
          <div className="feature-card" style={{ padding: '1rem' }}>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Categories</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--brown-dark)' }}>{summary?.totalCategories || 0}</p>
          </div>
          <div className="feature-card" style={{ padding: '1rem' }}>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Users</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--brown-dark)' }}>{summary?.totalUsers || 0}</p>
          </div>
          <div className="feature-card" style={{ padding: '1rem' }}>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Orders</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--brown-dark)' }}>{summary?.totalOrders || 0}</p>
          </div>
          <div className="feature-card" style={{ padding: '1rem' }}>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Revenue</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#27ae60' }}>${summary?.revenue.toFixed(2) || '0.00'}</p>
          </div>
        </div>

        <div className="cart-layout" style={{ gridTemplateColumns: '1.2fr 0.8fr' }}>
          {/* Orders Management */}
          <div>
            <h2 className="page-title" style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Order Management</h2>
            {orders && orders.length > 0 ? (
              <div className="cart-table">
                <div className="cart-table-header" style={{ gridTemplateColumns: '15% 20% 25% 20% 20%' }}>
                  <div>ID</div>
                  <div>User</div>
                  <div>Status</div>
                  <div>Total</div>
                  <div>Action</div>
                </div>
                <div className="cart-table-body">
                  {orders.map((order) => (
                    <div key={order.id} className="cart-item" style={{ gridTemplateColumns: '15% 20% 25% 20% 20%', padding: '0.85rem 1.25rem', alignItems: 'center' }}>
                      <div style={{ fontWeight: '600' }}>#{order.id}</div>
                      <div>{order.user.username}</div>
                      <div>
                        <span className="card-badge" style={{ background: order.status === 'DELIVERED' ? '#d4edda' : '#fff3cd', color: order.status === 'DELIVERED' ? '#155724' : '#856404' }}>
                          {order.status}
                        </span>
                      </div>
                      <div style={{ fontWeight: '600' }}>${order.totalAmount.toFixed(2)}</div>
                      <div>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="form-input"
                          style={{ padding: '0.25rem', fontSize: '0.75rem', appearance: 'auto', background: 'white' }}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="PACKED">Packed</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>No orders placed yet.</p>
            )}

            {/* Low Stock Alerts */}
            <h2 className="page-title" style={{ fontSize: '1.15rem', marginTop: '2rem', marginBottom: '1rem', color: 'var(--danger)' }}>
              ⚠️ Low Stock Products (&lt; 5 units)
            </h2>
            {summary?.lowStockProducts && summary.lowStockProducts.length > 0 ? (
              <div className="cart-table">
                <div className="cart-table-header" style={{ gridTemplateColumns: '30% 30% 20% 20%' }}>
                  <div>Product Name</div>
                  <div>SKU</div>
                  <div>Price</div>
                  <div>Stock</div>
                </div>
                <div className="cart-table-body">
                  {summary.lowStockProducts.map((p) => (
                    <div key={p.id} className="cart-item" style={{ gridTemplateColumns: '30% 30% 20% 20%', padding: '0.85rem 1.25rem' }}>
                      <div style={{ fontWeight: '600' }}>{p.name}</div>
                      <div>{p.sku}</div>
                      <div>${p.price.toFixed(2)}</div>
                      <div style={{ color: 'var(--danger)', fontWeight: '700' }}>{p.quantity} left</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>All products have sufficient stock levels.</p>
            )}
          </div>

          {/* Categories and Coupons Creators */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Manage Categories */}
            <div className="order-summary" style={{ background: 'white' }}>
              <h3 className="order-summary-title">Categories</h3>
              <form onSubmit={handleAddCategory} style={{ padding: '1rem 1.25rem', display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="New Category Name"
                  className="form-input"
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                />
                <button type="submit" className="btn btn-primary btn-sm">Add</button>
              </form>
              <div style={{ padding: '0 1.25rem 1.25rem', maxHeight: '180px', overflowY: 'auto' }}>
                {categories.map((c) => (
                  <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.35rem 0', borderBottom: '1px solid var(--border-light)' }}>
                    <span style={{ fontSize: '0.85rem' }}>{c.name}</span>
                    <button className="btn-link" style={{ color: 'var(--danger)', fontSize: '0.75rem' }} onClick={() => handleDeleteCategory(c.id)}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Manage Coupons */}
            <div className="order-summary" style={{ background: 'white' }}>
              <h3 className="order-summary-title">Coupons</h3>
              <form onSubmit={handleAddCoupon} style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Code</label>
                  <input
                    type="text"
                    placeholder="e.g. DISCOUNT25"
                    className="form-input"
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '0.5rem' }}>
                  <div>
                    <label className="form-label">Amount</label>
                    <input
                      type="number"
                      placeholder="Amount"
                      className="form-input"
                      value={newCoupon.discountAmount}
                      onChange={(e) => setNewCoupon({ ...newCoupon, discountAmount: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Type</label>
                    <select
                      className="form-input"
                      value={newCoupon.discountType}
                      onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                      style={{ appearance: 'auto', background: 'white' }}
                    >
                      <option value="PERCENTAGE">%</option>
                      <option value="FIXED">$</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="form-label">Expiry Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newCoupon.expiryDate}
                    onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                  Create Coupon
                </button>
              </form>
              <div style={{ padding: '0 1.25rem 1.25rem', maxHeight: '180px', overflowY: 'auto' }}>
                {coupons.map((cp) => (
                  <div key={cp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.35rem 0', borderBottom: '1px solid var(--border-light)' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>{cp.code} ({cp.discountAmount}{cp.discountType === 'PERCENTAGE' ? '%' : '$'})</span>
                    <button className="btn-link" style={{ color: 'var(--danger)', fontSize: '0.75rem' }} onClick={() => handleDeleteCoupon(cp.id)}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
