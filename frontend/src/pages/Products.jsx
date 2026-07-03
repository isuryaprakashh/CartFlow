import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Products({ onToast }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getAllProducts();
      setProducts(res.data);
    } catch {
      onToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <span>Loading products...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Page Banner */}
      <div className="page-banner">
        <h1 className="page-banner-title">Products</h1>
        <div className="page-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          Products
        </div>
      </div>

      <div className="page-container">
        <div className="page-header">
          <p className="page-subtitle" style={{ fontSize: '0.9rem' }}>
            {products.length} product{products.length !== 1 ? 's' : ''} available
          </p>
          <Link to="/products/add" className="btn btn-primary" id="btn-add-product">
            + Add Product
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3 className="empty-title">No products yet</h3>
            <p className="empty-desc">Get started by adding your first product.</p>
            <Link to="/products/add" className="btn btn-primary">
              + Add Product
            </Link>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onRefresh={fetchProducts}
                onToast={onToast}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
