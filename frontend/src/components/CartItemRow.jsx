import { updateCartItem, removeFromCart, saveForLater } from '../services/api';

export default function CartItemRow({ item, onRefresh, onToast }) {
  const { id, product, quantity } = item;
  const subtotal = product.price * quantity;

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
          <button className="btn-link" style={{ fontSize: '0.72rem', marginTop: '0.2rem' }} onClick={handleSaveForLater}>
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
