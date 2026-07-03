import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { deleteProduct, addToCart, addToWishlist, getReviews, getWishlist, removeFromWishlist } from '../services/api';

export default function ProductCard({ product, onRefresh, onToast }) {
  const navigate = useNavigate();
  const [avgRating, setAvgRating] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState(null);

  useEffect(() => {
    setCurrentUser(JSON.parse(localStorage.getItem('user')));
    fetchReviews();
    fetchWishlistStatus();
  }, [product.id]);

  const fetchReviews = async () => {
    try {
      const res = await getReviews(product.id);
      const reviewsList = res.data || [];
      if (reviewsList.length > 0) {
        const sum = reviewsList.reduce((acc, curr) => acc + curr.rating, 0);
        setAvgRating(sum / reviewsList.length);
      }
    } catch {
      // ignore silently
    }
  };

  const fetchWishlistStatus = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;
    try {
      const res = await getWishlist();
      const wishlist = res.data || [];
      const foundItem = wishlist.find(item => item.product.id === product.id);
      if (foundItem) {
        setIsWishlisted(true);
        setWishlistItemId(foundItem.id);
      } else {
        setIsWishlisted(false);
        setWishlistItemId(null);
      }
    } catch {
      // ignore
    }
  };

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
    if (!currentUser) {
      onToast('Please log in to add items to cart', 'error');
      navigate('/login');
      return;
    }
    try {
      await addToCart(product.id, 1);
      onToast(`"${product.name}" added to cart`, 'success');
      window.dispatchEvent(new Event('cart-updated'));
    } catch (err) {
      onToast(err.response?.data?.message || 'Failed to add to cart', 'error');
    }
  };

  const handleAddToWishlist = async () => {
    if (!currentUser) {
      onToast('Please log in to manage your wishlist', 'error');
      navigate('/login');
      return;
    }
    try {
      if (isWishlisted) {
        await removeFromWishlist(wishlistItemId);
        setIsWishlisted(false);
        setWishlistItemId(null);
        onToast(`"${product.name}" removed from wishlist`, 'success');
      } else {
        const res = await addToWishlist(product.id);
        setIsWishlisted(true);
        setWishlistItemId(res.data.id);
        onToast(`"${product.name}" saved to wishlist`, 'success');
      }
      if (onRefresh) onRefresh();
    } catch (err) {
      onToast(err.response?.data?.message || 'Failed to update wishlist', 'error');
    }
  };

  const isAdmin = currentUser?.roles?.includes('ROLE_ADMIN');

  return (
    <div className="card" id={`product-card-${product.id}`} style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', width: '100%', height: '180px', background: '#faf6f1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: '3rem' }}>📦</span>
        )}
        <button 
          onClick={handleAddToWishlist} 
          style={{ position: 'absolute', top: '8px', right: '8px', border: 'none', background: 'white', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', color: isWishlisted ? 'var(--danger)' : '#888', fontSize: '1.25rem' }}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          {isWishlisted ? '♥' : '♡'}
        </button>
      </div>

      <div className="card-header" style={{ marginTop: '0.75rem', marginBottom: '0.25rem' }}>
        <div className="card-title">{product.name}</div>
        <span className="card-badge">{product.category?.name || 'Uncategorized'}</span>
      </div>

      <div className="card-body" style={{ flexGrow: 1 }}>
        <div className="card-meta">
          <span className="card-meta-label">SKU</span>
          <span>{product.sku}</span>
        </div>
        <div className="card-meta">
          <span className="card-meta-label">Stock</span>
          <span style={{ color: product.quantity > 0 ? '#27ae60' : 'var(--danger)', fontWeight: '600' }}>
            {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
          </span>
        </div>
        {/* Rating display */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
          <span style={{ color: 'var(--brown-accent)', fontSize: '0.95rem' }}>
            {avgRating > 0 ? '★'.repeat(Math.round(avgRating)) + '☆'.repeat(5 - Math.round(avgRating)) : '☆☆☆☆☆'}
          </span>
          {avgRating > 0 && <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>({avgRating.toFixed(1)})</span>}
        </div>
        
        <div className="card-price" style={{ marginTop: '0.5rem' }}>${product.price.toFixed(2)}</div>
      </div>

      <div className="card-actions">
        {!isAdmin && (
          <button
            className="btn btn-primary btn-sm"
            onClick={handleAddToCart}
            id={`add-to-cart-${product.id}`}
            disabled={product.quantity <= 0}
          >
            {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        )}
        {isAdmin && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
