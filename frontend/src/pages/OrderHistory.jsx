import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrderHistory } from '../services/api';

export default function OrderHistory({ onToast }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getOrderHistory();
      setOrders(res.data || []);
    } catch {
      onToast('Failed to load order history', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <span>Loading orders...</span>
      </div>
    );
  }

  return (
    <>
      <div className="page-banner">
        <h1 className="page-banner-title">My Orders</h1>
        <div className="page-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          Orders
        </div>
      </div>

      <div className="page-container">
        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3 className="empty-title">No orders yet</h3>
            <p className="empty-desc">You haven't placed any orders yet.</p>
            <Link to="/products" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {orders.map((order) => (
              <div key={order.id} className="order-summary" style={{ background: 'white' }}>
                <div className="order-summary-title" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span>Order ID: #{order.id}</span>
                  <span className="card-badge" style={{ background: order.status === 'DELIVERED' ? '#d4edda' : '#fff3cd', color: order.status === 'DELIVERED' ? '#155724' : '#856404' }}>
                    {order.status}
                  </span>
                </div>
                <div className="order-summary-body" style={{ borderBottom: '1px solid var(--border-light)' }}>
                  {order.items.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.4rem 0' }}>
                      <span>
                        {item.product.name} (x{item.quantity})
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <span>Date: {new Date(order.orderDate).toLocaleDateString()}</span>
                  <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                    Total: ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
