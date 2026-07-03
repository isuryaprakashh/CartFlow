import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';

export default function Register({ onToast }) {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: ['customer'] // default
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    setForm({ ...form, role: [e.target.value] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      onToast('Registered successfully! Please log in.', 'success');
      navigate('/login');
    } catch (err) {
      onToast(err.response?.data?.message || 'Registration failed. Check details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-banner">
        <h1 className="page-banner-title">Create Account</h1>
        <div className="page-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          Register
        </div>
      </div>

      <div className="page-container">
        <div className="form-container">
          <div className="form-card">
            <form onSubmit={handleSubmit} id="register-form">
              <div className="form-group">
                <label className="form-label" htmlFor="username">Username *</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  className="form-input"
                  placeholder="Choose a username"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-input"
                  placeholder="Your email address"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">Password *</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-input"
                  placeholder="Choose a password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  className="form-input"
                  placeholder="Your contact number"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="address">Shipping Address</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  className="form-input"
                  placeholder="Your shipping address"
                  value={form.address}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="role">Register As</label>
                <select
                  id="role"
                  name="role"
                  className="form-input"
                  value={form.role[0]}
                  onChange={handleRoleChange}
                  style={{ appearance: 'auto', background: 'white' }}
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="form-actions" style={{ flexDirection: 'column', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
                <p style={{ fontSize: '0.82rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Already have an account? <Link to="/login" style={{ color: 'var(--brown-dark)', fontWeight: '600' }}>Login here</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
