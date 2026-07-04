import { useState, useEffect } from 'react';
import { updateCartItem, removeFromCart, saveForLater } from '../services/api';

export default function CartItemRow({ item, onRefresh, onToast }) {
  const { id, product, quantity } = item;
  const subtotal = product.price * quantity;

  const getRemainingSeconds = () => {
    if (!item.reservedAt) return 600; // 10 minutes default
    const savedTime = new Date(item.reservedAt).getTime();
    const now = new Date().getTime();
    const elapsedSeconds = Math.floor((now - savedTime) / 1000);
    const remaining = 600 - elapsedSeconds;
    return Math.max(0, remaining);
  };

  const [timeLeft, setTimeLeft] = useState(getRemainingSeconds);

  useEffect(() => {
    setTimeLeft(getRemainingSeconds());
  }, [item.reservedAt]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleExpired();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleExpired = () => {
    onToast(`Reservation expired for "${product.name}". Released back to stock.`, 'warning');
    onRefresh();
    window.dispatchEvent(new Event('cart-updated'));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleQuantityChange = async (newQty) => {
    if (newQty <= 0) {
      handleRemove();
      return;
    }
    try {
      await updateCartItem(id, newQty);
      onRefresh();
      window.dispatchEvent(new Event('cart-updated'));
    } catch (err) {
      onToast(err.response?.data?.message || 'Failed to update quantity', 'error');
    }
  };

  const handleRemove = async () => {
    try {
      await removeFromCart(id);
      onToast(`"${product.name}" removed from cart`, 'success');
      onRefresh();
      window.dispatchEvent(new Event('cart-updated'));
    } catch (err) {
      onToast(err.response?.data?.message || 'Failed to remove item', 'error');
    }
  };

  const handleSaveForLater = async () => {
    try {
      // Save for later
      await saveForLater(product.id, quantity);
      // Remove from cart
      await removeFromCart(id);
      onToast(`"${product.name}" saved for later`, 'success');
      onRefresh();
      window.dispatchEvent(new Event('cart-updated'));
    } catch (err) {
      onToast(err.response?.data?.message || 'Failed to save for later', 'error');
    }
  };

  const isUrgent = timeLeft < 60;

  return (
    <div className="cart-item" id={`cart-item-${id}`}>
      {/* Product Column */}
      <div className="cart-item-product">
        <button
          className="cart-item-remove"
          onClick={handleRemove}
          aria-label={`Remove ${product.name}`}
        >
          ✕
        </button>
        <div className="cart-item-image">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} />
          ) : (
            '📦'
          )}
        </div>
        <div className="cart-item-details">
          <div className="cart-item-name">{product.name}</div>
          <div className="cart-item-meta">
            Category: {product.category?.name || 'N/A'} | SKU: {product.sku}
          </div>
          
          {/* Reservation Timer display */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.35rem', 
              marginTop: '0.4rem', 
              fontSize: '0.75rem', 
              color: isUrgent ? 'var(--danger)' : 'var(--brown-dark)', 
              fontWeight: '600' 
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>Reserved for: {formatTime(timeLeft)}</span>
          </div>

          <button className="btn-link" style={{ fontSize: '0.72rem', marginTop: '0.35rem', display: 'block' }} onClick={handleSaveForLater}>
            Save for later
          </button>
        </div>
      </div>

      {/* Price Column */}
      <div className="cart-item-price">${product.price.toFixed(2)}</div>

      {/* Quantity Column */}
      <div className="quantity-controls" id={`qty-controls-${id}`}>
        <button
          className="qty-btn"
          onClick={() => handleQuantityChange(quantity - 1)}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="qty-value">{quantity}</span>
        <button
          className="qty-btn"
          onClick={() => handleQuantityChange(quantity + 1)}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      {/* Subtotal Column */}
      <div className="cart-item-subtotal">${subtotal.toFixed(2)}</div>
    </div>
  );
}
