import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts, getAllCategories } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Products({ onToast }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [stockStatus, setStockStatus] = useState('ALL'); // ALL, IN_STOCK, OUT_OF_STOCK
  const [sortBy, setSortBy] = useState('id,asc');
  
  // Pagination States
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 8;

  useEffect(() => {
    setCurrentUser(JSON.parse(localStorage.getItem('user')));
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, selectedCategory, minPrice, maxPrice, stockStatus, sortBy, page]);

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories();
      setCategories(res.data || []);
    } catch {
      // silent fail
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: pageSize,
        sort: sortBy
      };

      if (search.trim()) params.search = search.trim();
      if (selectedCategory) params.categoryId = selectedCategory;
      if (minPrice) params.minPrice = parseFloat(minPrice);
      if (maxPrice) params.maxPrice = parseFloat(maxPrice);
      
      if (stockStatus === 'IN_STOCK') {
        params.inStock = true;
      } else if (stockStatus === 'OUT_OF_STOCK') {
        params.inStock = false;
      }

      const res = await getAllProducts(params);
      
      // Handle page response
      if (res.data && res.data.content) {
        setProducts(res.data.content);
        setTotalPages(res.data.totalPages);
        setTotalElements(res.data.totalElements);
      } else {
        // Fallback for direct array (V1 compatibility)
        setProducts(Array.isArray(res.data) ? res.data : []);
        setTotalPages(1);
        setTotalElements(Array.isArray(res.data) ? res.data.length : 0);
      }
    } catch {
      onToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setStockStatus('ALL');
    setSortBy('id,asc');
    setPage(0);
  };

  const isAdmin = currentUser?.roles?.includes('ROLE_ADMIN');

  return (
    <>
      {/* Page Banner */}
      <div className="page-banner">
        <h1 className="page-banner-title">Products Catalogue</h1>
        <div className="page-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          Products
        </div>
      </div>

      <div className="page-container">
        {/* Filtering & Search Bar */}
        <div className="form-card" style={{ background: 'var(--bg-cream)', padding: '1.25rem', marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'end' }}>
            
            {/* Search Input */}
            <div>
              <label className="form-label">Search</label>
              <input
                type="text"
                className="form-input"
                placeholder="Name or SKU..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                style={{ background: 'white' }}
              />
            </div>

            {/* Category Select */}
            <div>
              <label className="form-label">Category</label>
              <select
                className="form-input"
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setPage(0); }}
                style={{ appearance: 'auto', background: 'white' }}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Price Inputs */}
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <div>
                <label className="form-label">Min Price</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => { setMinPrice(e.target.value); setPage(0); }}
                  style={{ background: 'white' }}
                />
              </div>
              <div>
                <label className="form-label">Max Price</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => { setMaxPrice(e.target.value); setPage(0); }}
                  style={{ background: 'white' }}
                />
              </div>
            </div>

            {/* Stock Status Select */}
            <div>
              <label className="form-label">Availability</label>
              <select
                className="form-input"
                value={stockStatus}
                onChange={(e) => { setStockStatus(e.target.value); setPage(0); }}
                style={{ appearance: 'auto', background: 'white' }}
              >
                <option value="ALL">All Items</option>
                <option value="IN_STOCK">In Stock</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>
            </div>

            {/* Sort Select */}
            <div>
              <label className="form-label">Sort By</label>
              <select
                className="form-input"
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(0); }}
                style={{ appearance: 'auto', background: 'white' }}
              >
                <option value="id,asc">Default</option>
                <option value="price,asc">Price: Low to High</option>
                <option value="price,desc">Price: High to Low</option>
                <option value="name,asc">Name: A to Z</option>
                <option value="name,desc">Name: Z to A</option>
              </select>
            </div>

            {/* Reset Button */}
            <div>
              <button className="btn btn-secondary btn-sm" style={{ width: '100%' }} onClick={handleClearFilters}>
                Clear Filters
              </button>
            </div>

          </div>
        </div>

        {/* Header section with add product trigger */}
        <div className="page-header">
          <p className="page-subtitle" style={{ fontSize: '0.9rem' }}>
            Showing {products.length} of {totalElements} product{totalElements !== 1 ? 's' : ''}
          </p>
          {isAdmin && (
            <Link to="/products/add" className="btn btn-primary" id="btn-add-product">
              + Add Product
            </Link>
          )}
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <span>Fetching catalog items...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3 className="empty-title">No products found</h3>
            <p className="empty-desc">Try modifying search tags or filters.</p>
            <button className="btn btn-primary btn-sm" onClick={handleClearFilters}>
              Reset Filters
            </button>
          </div>
        ) : (
          <>
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '3rem' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={page === 0}
                  onClick={() => setPage(prev => Math.max(0, prev - 1))}
                >
                  ◀ Previous
                </button>
                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={page === totalPages - 1}
                  onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
                >
                  Next ▶
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
