import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createProduct, getProductById, updateProduct } from '../services/api';

export default function ProductForm({ onToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: '',
    price: '',
    quantity: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await getProductById(id);
      const p = res.data;
      setForm({
        name: p.name,
        sku: p.sku,
        category: p.category,
        price: String(p.price),
        quantity: String(p.quantity),
      });
    } catch {
      onToast('Failed to load product', 'error');
      navigate('/products');
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Product name is required';
    if (!form.sku.trim()) errs.sku = 'SKU is required';
    if (!form.category.trim()) errs.category = 'Category is required';
    if (!form.price || Number(form.price) <= 0) errs.price = 'Price must be greater than 0';
    if (form.quantity === '' || Number(form.quantity) < 0) errs.quantity = 'Quantity must be ≥ 0';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      category: form.category.trim(),
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity, 10),
    };

    try {
      if (isEdit) {
        await updateProduct(id, payload);
        onToast('Product updated successfully', 'success');
      } else {
        await createProduct(payload);
        onToast('Product created successfully', 'success');
      }
      navigate('/products');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.data?.errors
          ? Object.values(err.response.data.errors).join(', ')
          : 'Something went wrong');
      onToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Page Banner */}
      <div className="page-banner">
        <h1 className="page-banner-title">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
        <div className="page-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          {isEdit ? 'Edit' : 'Add'}
        </div>
      </div>

      <div className="page-container">
        <div className="form-container">
          <div className="form-card">
            <form onSubmit={handleSubmit} id="product-form">
              <div className="form-group">
                <label className="form-label" htmlFor="name">Product Name *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="e.g. Trendy Brown Coat"
                  value={form.name}
                  onChange={handleChange}
                />
                {errors.name && <p className="form-error">{errors.name}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="sku">SKU *</label>
                <input
                  id="sku"
                  name="sku"
                  type="text"
                  className={`form-input ${errors.sku ? 'error' : ''}`}
                  placeholder="e.g. TBC-001"
                  value={form.sku}
                  onChange={handleChange}
                />
                {errors.sku && <p className="form-error">{errors.sku}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="category">Category *</label>
                <input
                  id="category"
                  name="category"
                  type="text"
                  className={`form-input ${errors.category ? 'error' : ''}`}
                  placeholder="e.g. Outerwear"
                  value={form.category}
                  onChange={handleChange}
                />
                {errors.category && <p className="form-error">{errors.category}</p>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="price">Price ($) *</label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0.01"
                    className={`form-input ${errors.price ? 'error' : ''}`}
                    placeholder="0.00"
                    value={form.price}
                    onChange={handleChange}
                  />
                  {errors.price && <p className="form-error">{errors.price}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="quantity">Quantity *</label>
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    className={`form-input ${errors.quantity ? 'error' : ''}`}
                    placeholder="0"
                    value={form.quantity}
                    onChange={handleChange}
                  />
                  {errors.quantity && <p className="form-error">{errors.quantity}</p>}
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  id="btn-save-product"
                >
                  {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Save Product'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate('/products')}
                  id="btn-cancel"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
