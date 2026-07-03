import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createProduct, getProductById, updateProduct, getAllCategories, uploadImage } from '../services/api';

export default function ProductForm({ onToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '',
    sku: '',
    categoryId: '',
    price: '',
    quantity: '',
    imageUrl: ''
  });

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories();
      setCategories(res.data || []);
    } catch {
      onToast('Failed to load categories', 'error');
    }
  };

  const fetchProduct = async () => {
    try {
      const res = await getProductById(id);
      const p = res.data;
      setForm({
        name: p.name,
        sku: p.sku,
        categoryId: p.category ? String(p.category.id) : '',
        price: String(p.price),
        quantity: String(p.quantity),
        imageUrl: p.imageUrl || ''
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
    if (!form.categoryId) errs.categoryId = 'Category selection is required';
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    setUploading(true);
    try {
      const res = await uploadImage(formData);
      setForm((prev) => ({ ...prev, imageUrl: res.data.url }));
      onToast('Image uploaded successfully', 'success');
    } catch (err) {
      onToast(err.response?.data?.message || 'Image upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const selectedCategory = categories.find(c => String(c.id) === form.categoryId);
    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      category: selectedCategory,
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity, 10),
      imageUrl: form.imageUrl
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
      onToast(err.response?.data?.message || 'Save failed. Check details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
                <label className="form-label" htmlFor="categoryId">Category *</label>
                <select
                  id="categoryId"
                  name="categoryId"
                  className={`form-input ${errors.categoryId ? 'error' : ''}`}
                  value={form.categoryId}
                  onChange={handleChange}
                  style={{ appearance: 'auto', background: 'white' }}
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.categoryId && <p className="form-error">{errors.categoryId}</p>}
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

              {/* Image Upload field */}
              <div className="form-group">
                <label className="form-label" htmlFor="imageFile">Product Image</label>
                <input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  className="form-input"
                  onChange={handleImageUpload}
                  style={{ background: 'white' }}
                />
                {uploading && <p style={{ fontSize: '0.75rem', color: 'var(--brown-dark)' }}>Uploading image...</p>}
                {form.imageUrl && (
                  <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <img src={form.imageUrl} alt="Preview" style={{ width: '60px', height: '60px', borderRadius: '4px', objectFit: 'cover' }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', wordBreak: 'break-all' }}>{form.imageUrl}</span>
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || uploading}
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
