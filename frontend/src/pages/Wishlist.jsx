import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWishlist, removeFromWishlist, addToCart } from '../services/api';

export default function Wishlist({ onToast }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await getWishlist();
      setItems(res.data || []);
    } catch {
      onToast('Failed to load wishlist items', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeFromWishlist(id);
      onToast('Removed from wishlist', 'success');
      fetchWishlist();
    } catch {
      onToast('Failed to remove item', 'error');
    }
  };

  const handleMoveToCart = async (id, productId, name) => {
    try {
      // Add to cart
      await addToCart(productId, 1);
      // Remove from wishlist
      await removeFromWishlist(id);
      onToast(`"${name}" moved to cart`, 'success');
      fetchWishlist();
      window.dispatchEvent(new Event('cart-updated'));
    } catch (err) {
      onToast(err.response?.data?.message || 'Failed to move item to cart', 'error');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <span>Loading Wishlist...</span>
      </div>
    );
  }

  return (
    <>
      <div className="page-banner">
        <h1 className="page-banner-title">My Wishlist</h1>
        <div className="page-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          Wishlist
        </div>
      </div>

      <div className="page-container">
        {items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">♡</div>
            <h3 className="empty-title">Your wishlist is empty</h3>
            <p className="empty-desc">Save items you like to buy them later.</p>
            <Link to="/products" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="cart-table">
            <div className="cart-table-header" style={{ gridTemplateColumns: '50% 20% 30%' }}>
              <div>Product</div>
              <div>Price</div>
              <div>Actions</div>
            </div>
            <div className="cart-table-body">
              {items.map((item) => (
                <div key={item.id} className="cart-item" style={{ gridTemplateColumns: '50% 20% 30%', alignItems: 'center' }}>
                  <div className="cart-item-product">
                    <button className="cart-item-remove" onClick={() => handleRemove(item.id)}>✕</button>
                    <div className="cart-item-image">📦</div>
                    <div>
                      <div className="cart-item-name">{item.product.name}</div>
                      <div className="cart-item-meta">Category: {item.product.category?.name || 'N/A'}</div>
                    </div>
                  </div>
                  <div className="cart-item-price">${item.product.price.toFixed(2)}</div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-primary btn-sm" onClick={() => handleMoveToCart(item.id, item.product.id, item.product.name)}>
                      Move to Cart
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleRemove(item.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
