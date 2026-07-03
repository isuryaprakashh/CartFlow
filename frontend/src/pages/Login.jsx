import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';

export default function Login({ onToast }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      onToast('Username and password are required', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await login(form);
      localStorage.setItem('user', JSON.stringify(res.data));
      onToast('Logged in successfully', 'success');
      window.dispatchEvent(new Event('auth-change'));
      window.dispatchEvent(new Event('cart-updated'));
      
      if (res.data.roles.includes('ROLE_ADMIN')) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      onToast(err.response?.data?.message || 'Login failed. Check your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-banner">
        <h1 className="page-banner-title">Account Login</h1>
        <div className="page-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          Login
        </div>
      </div>

      <div className="page-container">
        <div className="form-container">
          <div className="form-card">
            <form onSubmit={handleSubmit} id="login-form">
              <div className="form-group">
                <label className="form-label" htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  className="form-input"
                  placeholder="Your username"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-input"
                  placeholder="Your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-actions" style={{ flexDirection: 'column', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
                <p style={{ fontSize: '0.82rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Don't have an account? <Link to="/register" style={{ color: 'var(--brown-dark)', fontWeight: '600' }}>Register here</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
