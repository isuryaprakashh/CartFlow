import { useNavigate } from 'react-router-dom';
import { deleteProduct, addToCart } from '../services/api';

export default function ProductCard({ product, onRefresh, onToast }) {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${product.name}"?`)) return;
    try {
      await deleteProduct(product.id);
      onToast('Product deleted successfully', 'success');
      onRefresh();
    } catch (err) {
      onToast(err.response?.data?.message || 'Failed to delete product', 'error');
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, 1);
      onToast(`"${product.name}" added to cart`, 'success');
      window.dispatchEvent(new Event('cart-updated'));
    } catch (err) {
      onToast(err.response?.data?.message || 'Failed to add to cart', 'error');
    }
  };

  return (
    <div className="card" id={`product-card-${product.id}`}>
      <div className="card-header">
        <div className="card-title">{product.name}</div>
        <span className="card-badge">{product.category}</span>
      </div>
      <div className="card-body">
        <div className="card-meta">
          <span className="card-meta-label">SKU</span>
          <span>{product.sku}</span>
        </div>
        <div className="card-meta">
          <span className="card-meta-label">Stock</span>
          <span>{product.quantity} units</span>
        </div>
        <div className="card-price">${product.price.toFixed(2)}</div>
      </div>
      <div className="card-actions">
        <button
          className="btn btn-primary btn-sm"
          onClick={handleAddToCart}
          id={`add-to-cart-${product.id}`}
        >
          Add to Cart
        </button>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => navigate(`/products/edit/${product.id}`)}
          id={`edit-product-${product.id}`}
        >
          Edit
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={handleDelete}
          id={`delete-product-${product.id}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
